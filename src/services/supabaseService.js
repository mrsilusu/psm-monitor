// ============================================
// SERVIÇO SUPABASE - PSM MONITOR (OTIMIZADO)
// Versão com BATCH operations
// ============================================

import { supabase } from '../lib/supabase';

// ============================================
// MAPEAR CAMPOS localStorage → Supabase
// ============================================
const mapLocalStorageToSupabase = (psmName, week, route, routeData, quarter, year, provincia, rotasTestadas, rotasValidadas) => {
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
    testada: rotasTestadas?.[psmName]?.[week]?.[route]?.testada === true,
    validada: rotasValidadas?.[psmName]?.[week]?.[route]?.validada === true,
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
// SALVAR TODOS OS DADOS (BATCH OTIMIZADO)
// ============================================
export const salvarTudoNoSupabase = async (allData, quarter, year, routesToProvinceMap, rotasTestadas, rotasValidadas) => {
  try {
    console.log('🚀 Iniciando salvamento BATCH no Supabase...');
    
    const anoAtual = year || new Date().getFullYear();
    const todosRegistros = [];
    
    // 1. Coletar TODOS os dados primeiro
    for (const psmName of ['ISISTEL', 'FIBRASOL', 'ANGLOBAL']) {
      if (!allData[psmName]) continue;
      
      for (const week in allData[psmName]) {
        for (const route in allData[psmName][week]) {
          const routeData = allData[psmName][week][route];
          const provincia = routesToProvinceMap[route] || '';
          
          // Só adicionar se tiver pelo menos 1 campo preenchido
          const temDados = Object.values(routeData).some(val => val !== '' && val !== 0);
          if (!temDados) continue;
          
          const registro = mapLocalStorageToSupabase(
            psmName,
            week,
            route,
            routeData,
            quarter,
            anoAtual,
            provincia,
            rotasTestadas,
            rotasValidadas
          );
          
          todosRegistros.push(registro);
        }
      }
    }
    
    if (todosRegistros.length === 0) {
      console.log('⚠️ Nenhum dado para salvar');
      return { success: true, count: 0 };
    }
    
    console.log(`📦 Preparados ${todosRegistros.length} registros para salvar`);
    
    // 2. UPSERT em batches (não apaga, só atualiza/insere)
    console.log('💾 Salvando dados em batch com UPSERT...');
    const BATCH_SIZE = 100;
    let totalSalvos = 0;
    
    for (let i = 0; i < todosRegistros.length; i += BATCH_SIZE) {
      const batch = todosRegistros.slice(i, i + BATCH_SIZE);
      
      // UPSERT: atualiza se existir (psm+week+route+year), insere se não
      const { data, error } = await supabase
        .from('psm_data')
        .upsert(batch, {
          onConflict: 'psm,week,route,year',
          ignoreDuplicates: false
        })
        .select();
      
      if (error) {
        console.error(`❌ Erro no batch ${i}-${i + BATCH_SIZE}:`, error);
        // Continuar com próximo batch
      } else {
        totalSalvos += batch.length;
        console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} registros salvos`);
      }
      
      // Pequeno delay entre batches
      if (i + BATCH_SIZE < todosRegistros.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`✅ Salvamento completo! ${totalSalvos}/${todosRegistros.length} registros`);
    
    return { 
      success: true, 
      count: totalSalvos,
      total: todosRegistros.length
    };

  } catch (error) {
    console.error('❌ Erro no salvamento BATCH:', error);
    return { success: false, error };
  }
};

// ============================================
// LER TODOS OS DADOS (OTIMIZADO)
// ============================================
export const lerTudoDoSupabase = async (year) => {
  try {
    console.log('🚀 Carregando dados do Supabase...');
    
    const anoAtual = year || new Date().getFullYear();
    
    // UMA query para buscar TUDO
    const { data: todosRegistros, error } = await supabase
      .from('psm_data')
      .select('*')
      .eq('year', anoAtual)
      .order('psm', { ascending: true })
      .order('week', { ascending: true });

    if (error) throw error;

    if (!todosRegistros || todosRegistros.length === 0) {
      console.log('⚠️ Nenhum dado encontrado no Supabase para', anoAtual);
      return { success: true, data: {} };
    }

    console.log(`📦 ${todosRegistros.length} registros encontrados`);

    // Converter para formato localStorage
    const allData = {};
    
    todosRegistros.forEach(row => {
      // Inicializar estrutura se não existir
      if (!allData[row.psm]) {
        allData[row.psm] = {};
      }
      if (!allData[row.psm][row.week]) {
        allData[row.psm][row.week] = {};
      }
      
      allData[row.psm][row.week][row.route] = mapSupabaseToLocalStorage(row);
    });

    console.log('✅ Dados convertidos para formato local');
    return { success: true, data: allData };

  } catch (error) {
    console.error('❌ Erro ao ler dados:', error);
    return { success: false, error, data: {} };
  }
};

export default {
  salvarTudoNoSupabase,
  lerTudoDoSupabase
};