// ============================================
// SERVIÇO SUPABASE - PSM MONITOR (OTIMIZADO)
// Versão que preserva testada/validada entre dispositivos
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
    'Transporte': supabaseData.transporte || 0,
    'Indisponíveis': supabaseData.indisponiveis || 0,
    'Total Reparadas': supabaseData.total_reparadas || 0,
    'Reconhecidas': supabaseData.reconhecidas || 0,
    'Dep. de Passagem de Cabo': supabaseData.dep_passagem || 0,
    'Dep. de Licença': supabaseData.dep_licenca || 0,
    'Dep. de Cutover': supabaseData.dep_cutover || 0,
    'Fibras dependentes da ISISTEL': supabaseData.dep_isistel || 0,
    'Fibras dependentes da FIBRASOL': supabaseData.dep_fibrasol || 0,
    'Fibras dependentes da ANGLOBAL': supabaseData.dep_anglobal || 0,
  };
};

// ============================================
// SALVAR TODOS OS DADOS (OTIMIZADO - PRESERVA TESTADA/VALIDADA)
// ============================================
export const salvarTudoNoSupabase = async (allData, quarter, year, routesToProvinceMap, rotasTestadas, rotasValidadas) => {
  try {
    console.log('🚀 Iniciando salvamento OTIMIZADO no Supabase...');
    
    const anoAtual = year || new Date().getFullYear();
    
    // 1. Buscar TODOS os registros existentes do ano de UMA VEZ
    console.log('📥 Buscando registros existentes...');
    const { data: registrosExistentes, error: fetchError } = await supabase
      .from('psm_data')
      .select('id, psm, week, route, testada, validada')
      .eq('year', anoAtual);
    
    if (fetchError) {
      console.error('⚠️ Erro ao buscar existentes:', fetchError);
    }
    
    // Criar mapa de registros existentes para lookup rápido
    const mapaExistentes = {};
    if (registrosExistentes) {
      registrosExistentes.forEach(reg => {
        const chave = `${reg.psm}|${reg.week}|${reg.route}`;
        mapaExistentes[chave] = reg;
      });
    }
    
    console.log(`📊 Encontrados ${Object.keys(mapaExistentes).length} registros existentes`);
    
    // 2. Preparar lotes de UPDATE e INSERT
    const paraAtualizar = [];
    const paraInserir = [];
    
    // ✅ CORREÇÃO: Criar um Set de todas as rotas que precisam ser processadas
    // Inclui rotas de allData + rotas testadas + rotas validadas
    const rotasParaProcessar = new Map(); // chave: "PSM|WEEK|ROUTE", valor: { psm, week, route }
    
    // Adicionar rotas de allData
    for (const psmName of ['ISISTEL', 'FIBRASOL', 'ANGLOBAL']) {
      if (allData[psmName]) {
        for (const week in allData[psmName]) {
          for (const route in allData[psmName][week]) {
            const chave = `${psmName}|${week}|${route}`;
            rotasParaProcessar.set(chave, { psm: psmName, week, route });
          }
        }
      }
    }
    
    // ✅ Adicionar rotas marcadas como TESTADAS (mesmo sem dados numéricos)
    if (rotasTestadas) {
      for (const psmName in rotasTestadas) {
        for (const week in rotasTestadas[psmName]) {
          for (const route in rotasTestadas[psmName][week]) {
            if (rotasTestadas[psmName][week][route]?.testada === true) {
              const chave = `${psmName}|${week}|${route}`;
              if (!rotasParaProcessar.has(chave)) {
                rotasParaProcessar.set(chave, { psm: psmName, week, route });
                console.log(`📌 Adicionando rota TESTADA sem dados: ${chave}`);
              }
            }
          }
        }
      }
    }
    
    // ✅ Adicionar rotas marcadas como VALIDADAS (mesmo sem dados numéricos)
    if (rotasValidadas) {
      for (const psmName in rotasValidadas) {
        for (const week in rotasValidadas[psmName]) {
          for (const route in rotasValidadas[psmName][week]) {
            if (rotasValidadas[psmName][week][route]?.validada === true) {
              const chave = `${psmName}|${week}|${route}`;
              if (!rotasParaProcessar.has(chave)) {
                rotasParaProcessar.set(chave, { psm: psmName, week, route });
                console.log(`📌 Adicionando rota VALIDADA sem dados: ${chave}`);
              }
            }
          }
        }
      }
    }
    
    console.log(`📊 Total de rotas para processar: ${rotasParaProcessar.size}`);
    
    // 3. Processar todas as rotas (com ou sem dados numéricos)
    for (const [chave, { psm: psmName, week, route }] of rotasParaProcessar) {
      const routeData = allData[psmName]?.[week]?.[route] || {
        'Transporte': '',
        'Indisponíveis': '',
        'Total Reparadas': '',
        'Reconhecidas': '',
        'Dep. de Passagem de Cabo': '',
        'Dep. de Licença': '',
        'Dep. de Cutover': '',
        'Fibras dependentes da ISISTEL': '',
        'Fibras dependentes da FIBRASOL': '',
        'Fibras dependentes da ANGLOBAL': ''
      };
      
      const provincia = routesToProvinceMap[route] || '';
      const existente = mapaExistentes[chave];
          
          // ✅ CORREÇÃO: Converter valores vazios para 0 e processar SEMPRE
          // Se o registro existe no banco, sempre atualizar (mesmo que seja para zerar)
          // Se não existe e todos valores são vazios/zero, não criar registro
          const dadosBase = {
            psm: psmName,
            week: week,
            route: route,
            year: anoAtual,
            quarter: quarter || 'Q1',
            provincia: provincia,
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
          
          // Verificar se tem algum valor diferente de zero
          const temDadosNaoZero = Object.entries(dadosBase).some(([key, val]) => {
            // Ignorar campos de identificação
            if (['psm', 'week', 'route', 'year', 'quarter', 'provincia'].includes(key)) return false;
            return val !== 0;
          });
          
          // ✅ Verificar se a rota foi marcada como testada ou validada
          const foiTestada = rotasTestadas?.[psmName]?.[week]?.[route]?.testada === true;
          const foiValidada = rotasValidadas?.[psmName]?.[week]?.[route]?.validada === true;
          
          if (existente) {
            // ✅ UPDATE: Sempre atualizar registros existentes (mesmo que seja para zerar)
            const testeLocal = rotasTestadas?.[psmName]?.[week]?.[route]?.testada === true;
            const validaLocal = rotasValidadas?.[psmName]?.[week]?.[route]?.validada === true;
            
            // Usar valores locais se existirem, senão preservar do banco
            dadosBase.testada = testeLocal || existente.testada || false;
            dadosBase.validada = validaLocal || existente.validada || false;
            
            paraAtualizar.push({
              ...dadosBase,
              id: existente.id
            });
          } else {
            // ✅ INSERT: Criar novo registro se:
            // 1. Tiver pelo menos um valor numérico diferente de zero, OU
            // 2. Foi marcada como testada, OU
            // 3. Foi marcada como validada
            if (temDadosNaoZero || foiTestada || foiValidada) {
              paraInserir.push({
                ...dadosBase,
                testada: foiTestada,
                validada: foiValidada,
              });
              
              if (!temDadosNaoZero && (foiTestada || foiValidada)) {
                console.log(`📌 Criando registro só com teste/validação: ${psmName} | ${week} | ${route}`);
              }
            }
          }
        }
    }
    
    console.log(`📦 Para atualizar: ${paraAtualizar.length}`);
    console.log(`📦 Para inserir: ${paraInserir.length}`);
    
    // 3. Executar UPDATEs em batch
    let totalAtualizado = 0;
    if (paraAtualizar.length > 0) {
      console.log('🔄 Atualizando registros existentes...');
      const BATCH_SIZE = 50; // Reduzir para evitar timeout
      
      for (let i = 0; i < paraAtualizar.length; i += BATCH_SIZE) {
        const batch = paraAtualizar.slice(i, i + BATCH_SIZE);
        
        // Atualizar em paralelo (até 10 por vez)
        const promises = batch.map(registro => {
          const { id, ...dadosSemId } = registro;
          return supabase
            .from('psm_data')
            .update(dadosSemId)
            .eq('id', id);
        });
        
        await Promise.all(promises);
        totalAtualizado += batch.length;
        
        console.log(`✅ Atualizados ${Math.min(i + BATCH_SIZE, paraAtualizar.length)}/${paraAtualizar.length}`);
        
        // Pequeno delay entre batches
        if (i + BATCH_SIZE < paraAtualizar.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    // 4. Executar INSERTs em batch
    let totalInserido = 0;
    if (paraInserir.length > 0) {
      console.log('➕ Inserindo novos registros...');
      const BATCH_SIZE = 100;
      
      for (let i = 0; i < paraInserir.length; i += BATCH_SIZE) {
        const batch = paraInserir.slice(i, i + BATCH_SIZE);
        
        const { data, error } = await supabase
          .from('psm_data')
          .insert(batch)
          .select();
        
        if (error) {
          console.error(`❌ Erro no INSERT batch ${i}:`, error);
        } else {
          totalInserido += batch.length;
          console.log(`✅ Inseridos ${Math.min(i + BATCH_SIZE, paraInserir.length)}/${paraInserir.length}`);
        }
        
        if (i + BATCH_SIZE < paraInserir.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    console.log(`✅ Salvamento completo! ${totalAtualizado} atualizados, ${totalInserido} inseridos`);
    
    return { 
      success: true,
      updated: totalAtualizado,
      inserted: totalInserido,
      total: totalAtualizado + totalInserido
    };

  } catch (error) {
    console.error('❌ Erro no salvamento:', error);
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
      return { success: true, data: {}, rotasTestadas: {}, rotasValidadas: {} };
    }

    console.log(`📦 ${todosRegistros.length} registros encontrados`);

    // Separar em 3 estruturas
    const allData = {};
    const rotasTestadas = {};
    const rotasValidadas = {};
    
    todosRegistros.forEach(row => {
      // Dados principais
      if (!allData[row.psm]) {
        allData[row.psm] = {};
      }
      if (!allData[row.psm][row.week]) {
        allData[row.psm][row.week] = {};
      }
      allData[row.psm][row.week][row.route] = mapSupabaseToLocalStorage(row);
      
      // Rotas testadas
      if (row.testada === true) {
        if (!rotasTestadas[row.psm]) {
          rotasTestadas[row.psm] = {};
        }
        if (!rotasTestadas[row.psm][row.week]) {
          rotasTestadas[row.psm][row.week] = {};
        }
        rotasTestadas[row.psm][row.week][row.route] = { testada: true };
      }
      
      // Rotas validadas
      if (row.validada === true) {
        if (!rotasValidadas[row.psm]) {
          rotasValidadas[row.psm] = {};
        }
        if (!rotasValidadas[row.psm][row.week]) {
          rotasValidadas[row.psm][row.week] = {};
        }
        rotasValidadas[row.psm][row.week][row.route] = { validada: true };
      }
    });

    console.log('✅ Dados convertidos para formato local');
    console.log(`📊 Testadas: ${Object.keys(rotasTestadas).length} PSMs`);
    console.log(`📊 Validadas: ${Object.keys(rotasValidadas).length} PSMs`);
    
    return { 
      success: true, 
      data: allData,
      rotasTestadas: rotasTestadas,
      rotasValidadas: rotasValidadas
    };

  } catch (error) {
    console.error('❌ Erro ao ler dados:', error);
    return { 
      success: false, 
      error, 
      data: {},
      rotasTestadas: {},
      rotasValidadas: {}
    };
  }
};

export default {
  salvarTudoNoSupabase,
  lerTudoDoSupabase
};