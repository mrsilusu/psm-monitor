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
          
          // ✅ CORREÇÃO: Converter valores vazios para 0 EXPLICITAMENTE
          // Se o registro existe no banco, sempre atualizar (mesmo que seja para zerar)
          // Tratamento explícito de string vazia, null e undefined
          const parseOrZero = (value) => {
            if (value === '' || value === null || value === undefined) return 0;
            const parsed = parseInt(value);
            return isNaN(parsed) ? 0 : parsed;
          };
          
          const dadosBase = {
            psm: psmName,
            week: week,
            route: route,
            year: anoAtual,
            quarter: quarter || 'Q1',
            provincia: provincia,
            transporte: parseOrZero(routeData['Transporte']),
            indisponiveis: parseOrZero(routeData['Indisponíveis']),
            total_reparadas: parseOrZero(routeData['Total Reparadas']),
            reconhecidas: parseOrZero(routeData['Reconhecidas']),
            dep_passagem: parseOrZero(routeData['Dep. de Passagem de Cabo']),
            dep_licenca: parseOrZero(routeData['Dep. de Licença']),
            dep_cutover: parseOrZero(routeData['Dep. de Cutover']),
            dep_isistel: parseOrZero(routeData['Fibras dependentes da ISISTEL']),
            dep_fibrasol: parseOrZero(routeData['Fibras dependentes da FIBRASOL']),
            dep_anglobal: parseOrZero(routeData['Fibras dependentes da ANGLOBAL']),
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
            
            // 🔍 Log detalhado quando valores são zerados
            const todosZero = dadosBase.transporte === 0 && 
                             dadosBase.indisponiveis === 0 && 
                             dadosBase.total_reparadas === 0;
            
            if (todosZero) {
              console.log(`🔄 Atualizando para ZERO: ${psmName} | ${week} | ${route}`);
            }
            
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
  lerTudoDoSupabase,
  salvarJustificativasNoSupabase,
  lerJustificativasDoSupabase
};

// ============================================
// SALVAR JUSTIFICATIVAS NO SUPABASE
// ============================================
export const salvarJustificativasNoSupabase = async (justificativas, year) => {
  try {
    console.log('🚀 Salvando justificativas no Supabase...');
    
    const anoAtual = year || new Date().getFullYear();
    
    if (!justificativas || Object.keys(justificativas).length === 0) {
      console.log('⚠️ Nenhuma justificativa para salvar');
      return { success: true, count: 0 };
    }
    
    // 1. Buscar justificativas existentes do ano
    const { data: existentes, error: fetchError } = await supabase
      .from('psm_justificativas')
      .select('id, psm, quarter, seccao')
      .eq('year', anoAtual);
    
    if (fetchError) {
      console.error('⚠️ Erro ao buscar justificativas existentes:', fetchError);
    }
    
    // Criar mapa de existentes
    const mapaExistentes = {};
    if (existentes) {
      existentes.forEach(reg => {
        const chave = `${reg.psm}|${reg.quarter}|${reg.seccao}`;
        mapaExistentes[chave] = reg;
      });
    }
    
    console.log(`📊 Encontradas ${Object.keys(mapaExistentes).length} justificativas existentes`);
    
    // 2. Preparar lotes de UPDATE e INSERT
    const paraAtualizar = [];
    const paraInserir = [];
    
    Object.entries(justificativas).forEach(([key, just]) => {
      const chave = `${just.psm}|${just.quarter}|${just.seccao}`;
      const existente = mapaExistentes[chave];
      
      // ✅ CORREÇÃO: Tratar valores vazios/null corretamente
      // Se o valor for undefined, null ou string vazia, usar 0
      // Mas SEMPRE criar o registro, mesmo se tudo for 0
      const registro = {
        psm: just.psm,
        quarter: just.quarter,
        year: anoAtual,
        seccao: just.seccao,
        regiao: just.regiao || '',
        transporte: just.transporte === '' || just.transporte === null || just.transporte === undefined ? 0 : parseInt(just.transporte),
        indisponiveis: just.indisponiveis === '' || just.indisponiveis === null || just.indisponiveis === undefined ? 0 : parseInt(just.indisponiveis),
        delta: just.delta === '' || just.delta === null || just.delta === undefined ? 0 : parseInt(just.delta),
        justificativa: just.justificativa || ''
      };
      
      if (existente) {
        // ✅ SEMPRE atualizar registros existentes, mesmo se valores forem 0
        paraAtualizar.push({ ...registro, id: existente.id });
        console.log(`🔄 Atualizando: ${just.seccao} (T:${registro.transporte}, I:${registro.indisponiveis}, D:${registro.delta})`);
      } else {
        paraInserir.push(registro);
        console.log(`➕ Inserindo: ${just.seccao} (T:${registro.transporte}, I:${registro.indisponiveis}, D:${registro.delta})`);
      }
    });
    
    console.log(`📦 Para atualizar: ${paraAtualizar.length}`);
    console.log(`📦 Para inserir: ${paraInserir.length}`);
    
    // 3. Executar UPDATEs
    let totalAtualizado = 0;
    if (paraAtualizar.length > 0) {
      console.log('🔄 Atualizando justificativas existentes...');
      
      for (const registro of paraAtualizar) {
        const { id, ...dadosSemId } = registro;
        const { error } = await supabase
          .from('psm_justificativas')
          .update(dadosSemId)
          .eq('id', id);
        
        if (error) {
          console.error(`❌ Erro ao atualizar ${id}:`, error);
        } else {
          totalAtualizado++;
        }
      }
      
      console.log(`✅ Atualizadas: ${totalAtualizado}/${paraAtualizar.length}`);
    }
    
    // 4. Executar INSERTs
    let totalInserido = 0;
    if (paraInserir.length > 0) {
      console.log('➕ Inserindo novas justificativas...');
      
      const { data, error } = await supabase
        .from('psm_justificativas')
        .insert(paraInserir)
        .select();
      
      if (error) {
        console.error(`❌ Erro no INSERT:`, error);
      } else {
        totalInserido = data?.length || 0;
        console.log(`✅ Inseridas: ${totalInserido}`);
      }
    }
    
    console.log(`✅ Salvamento completo! ${totalAtualizado} atualizadas, ${totalInserido} inseridas`);
    
    return {
      success: true,
      updated: totalAtualizado,
      inserted: totalInserido,
      total: totalAtualizado + totalInserido
    };
    
  } catch (error) {
    console.error('❌ Erro ao salvar justificativas:', error);
    return { success: false, error };
  }
};

// ============================================
// LER JUSTIFICATIVAS DO SUPABASE
// ============================================
export const lerJustificativasDoSupabase = async (year) => {
  try {
    console.log('🚀 Carregando justificativas do Supabase...');
    
    const anoAtual = year || new Date().getFullYear();
    
    const { data: registros, error } = await supabase
      .from('psm_justificativas')
      .select('*')
      .eq('year', anoAtual)
      .order('psm', { ascending: true })
      .order('quarter', { ascending: true });
    
    if (error) throw error;
    
    if (!registros || registros.length === 0) {
      console.log('⚠️ Nenhuma justificativa encontrada no Supabase para', anoAtual);
      return { success: true, data: {} };
    }
    
    console.log(`📦 ${registros.length} justificativas encontradas`);
    
    // Converter para formato do App
    const justificativas = {};
    registros.forEach(reg => {
      const key = `${reg.psm}_${reg.seccao}`;
      justificativas[key] = {
        seccao: reg.seccao,
        regiao: reg.regiao,
        transporte: reg.transporte,
        indisponiveis: reg.indisponiveis,
        delta: reg.delta,
        justificativa: reg.justificativa,
        psm: reg.psm,
        quarter: reg.quarter
      };
    });
    
    console.log('✅ Justificativas convertidas para formato local');
    
    return {
      success: true,
      data: justificativas
    };
    
  } catch (error) {
    console.error('❌ Erro ao ler justificativas:', error);
    return {
      success: false,
      error,
      data: {}
    };
  }
};