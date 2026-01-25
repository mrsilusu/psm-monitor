// ============================================
// SERVIÇO SUPABASE - PSM MONITOR
// Funções para salvar e ler dados do Supabase
// ============================================

import { supabase } from '../lib/supabase';

// ============================================
// MAPEAR CAMPOS localStorage → Supabase
// ============================================
const mapLocalStorageToSupabase = (psmName, week, route, routeData, quarter, year, provincia) => {
  return {
    psm: psmName,
    week: week,
    route: route,
    year: year || new Date().getFullYear(),
    quarter: quarter || 'Q1',
    provincia: provincia || '',
    transporte: parseInt(routeData['Transporte']) || 0,
    indisponiveis: parseInt(routeData['Indisponíveis']) || 0,
    total_reparadas: parseInt(routeData['Total Reparadas']) || 0,
    reconhecidas: parseInt(routeData['Reconhecidas']) || 0,
    dep_passagem: parseInt(routeData['Dep. de Passagem de Cabo']) || 0,
    dep_licenca: parseInt(routeData['Dep. de Licença']) || 0,
    dep_cutover: parseInt(routeData['Dep. de Cutover']) || 0,
    dep_isistel: parseInt(routeData['Fibras dependentes da ISISTEL']) || 0,
    dep_fibrasol: parseInt(routeData['Fibras dependentes da FIBRASOL']) || 0,
    dep_anglobal: parseInt(routeData['Fibras dependentes da ANGLOBAL']) || 0,
  };
};

// ============================================
// MAPEAR Supabase → localStorage
// ============================================
const mapSupabaseToLocalStorage = (supabaseData) => {
  return {
    'Transporte': supabaseData.transporte,
    'Indisponíveis': supabaseData.indisponiveis,
    'Total Reparadas': supabaseData.total_reparadas,
    'Reconhecidas': supabaseData.reconhecidas,
    'Dep. de Passagem de Cabo': supabaseData.dep_passagem,
    'Dep. de Licença': supabaseData.dep_licenca,
    'Dep. de Cutover': supabaseData.dep_cutover,
    'Fibras dependentes da ISISTEL': supabaseData.dep_isistel,
    'Fibras dependentes da FIBRASOL': supabaseData.dep_fibrasol,
    'Fibras dependentes da ANGLOBAL': supabaseData.dep_anglobal,
  };
};

// ============================================
// SALVAR DADOS DE UMA ROTA
// ============================================
export const salvarRotaNoSupabase = async (psmName, week, route, routeData, quarter, year, provincia) => {
  try {
    const dadosSupabase = mapLocalStorageToSupabase(
      psmName, 
      week, 
      route, 
      routeData, 
      quarter, 
      year, 
      provincia
    );

    // Verificar se já existe registro
    const { data: existing, error: searchError } = await supabase
      .from('psm_data')
      .select('id')
      .eq('psm', psmName)
      .eq('week', week)
      .eq('route', route)
      .eq('year', year)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      // PGRST116 = "não encontrado" (OK, vamos inserir)
      throw searchError;
    }

    let result;
    
    if (existing) {
      // UPDATE - registro já existe
      result = await supabase
        .from('psm_data')
        .update({
          ...dadosSupabase,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select();
    } else {
      // INSERT - novo registro
      result = await supabase
        .from('psm_data')
        .insert(dadosSupabase)
        .select();
    }

    if (result.error) throw result.error;

    console.log(`✅ Rota salva: ${psmName} - ${route} - ${week}`);
    return { success: true, data: result.data };

  } catch (error) {
    console.error(`❌ Erro ao salvar rota:`, error);
    return { success: false, error };
  }
};

// ============================================
// SALVAR TODOS OS DADOS DE UM PSM
// ============================================
export const salvarPSMCompleto = async (psmName, psmData, quarter, year, routesToProvinceMap) => {
  try {
    const results = [];
    
    for (const week in psmData) {
      for (const route in psmData[week]) {
        const routeData = psmData[week][route];
        const provincia = routesToProvinceMap[route] || '';
        
        const result = await salvarRotaNoSupabase(
          psmName, 
          week, 
          route, 
          routeData, 
          quarter, 
          year, 
          provincia
        );
        
        results.push(result);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    console.log(`✅ Salvamento completo: ${successCount}/${totalCount} rotas`);
    
    return { 
      success: successCount === totalCount, 
      successCount, 
      totalCount,
      results 
    };

  } catch (error) {
    console.error(`❌ Erro ao salvar PSM completo:`, error);
    return { success: false, error };
  }
};

// ============================================
// SALVAR TODOS OS DADOS (TODOS OS PSMs)
// ============================================
export const salvarTudoNoSupabase = async (allData, quarter, year, routesToProvinceMap) => {
  try {
    console.log('🚀 Iniciando salvamento completo...');
    
    const results = {
      ISISTEL: null,
      FIBRASOL: null,
      ANGLOBAL: null
    };
    
    for (const psmName of ['ISISTEL', 'FIBRASOL', 'ANGLOBAL']) {
      if (allData[psmName]) {
        console.log(`📊 Salvando ${psmName}...`);
        results[psmName] = await salvarPSMCompleto(
          psmName, 
          allData[psmName], 
          quarter, 
          year, 
          routesToProvinceMap
        );
      }
    }
    
    console.log('✅ Salvamento completo finalizado!');
    return { success: true, results };

  } catch (error) {
    console.error('❌ Erro no salvamento completo:', error);
    return { success: false, error };
  }
};

// ============================================
// LER DADOS DE UM PSM
// ============================================
export const lerPSMDoSupabase = async (psmName, year) => {
  try {
    const { data, error } = await supabase
      .from('psm_data')
      .select('*')
      .eq('psm', psmName)
      .eq('year', year)
      .order('week', { ascending: true });

    if (error) throw error;

    // Converter para formato localStorage
    const psmData = {};
    
    data.forEach(row => {
      if (!psmData[row.week]) {
        psmData[row.week] = {};
      }
      
      psmData[row.week][row.route] = mapSupabaseToLocalStorage(row);
    });

    console.log(`✅ Dados lidos: ${psmName} (${data.length} registros)`);
    return { success: true, data: psmData };

  } catch (error) {
    console.error(`❌ Erro ao ler PSM:`, error);
    return { success: false, error };
  }
};

// ============================================
// LER TODOS OS DADOS
// ============================================
export const lerTudoDoSupabase = async (year) => {
  try {
    console.log('🚀 Carregando dados do Supabase...');
    
    const allData = {};
    
    for (const psmName of ['ISISTEL', 'FIBRASOL', 'ANGLOBAL']) {
      const result = await lerPSMDoSupabase(psmName, year);
      if (result.success) {
        allData[psmName] = result.data;
      }
    }
    
    console.log('✅ Dados carregados do Supabase!');
    return { success: true, data: allData };

  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
    return { success: false, error };
  }
};

export default {
  salvarRotaNoSupabase,
  salvarPSMCompleto,
  salvarTudoNoSupabase,
  lerPSMDoSupabase,
  lerTudoDoSupabase
};