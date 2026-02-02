import { supabase } from '../lib/supabase';

/**
 * V5.08.0: Salvar distribuição de reparações no Supabase
 * @param {Object} distribuicao - Objeto com distribuições
 * @param {string} quarter - Trimestre (Q1, Q2, Q3)
 * @param {number|string} year - Ano
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const salvarDistribuicaoNoSupabase = async (distribuicao, quarter, year) => {
  try {
    const registros = [];
    
    // Converter objeto para array de registros
    Object.keys(distribuicao).forEach(psm => {
      Object.keys(distribuicao[psm] || {}).forEach(week => {
        Object.keys(distribuicao[psm][week] || {}).forEach(route => {
          Object.keys(distribuicao[psm][week][route] || {}).forEach(tipo => {
            const desconto = distribuicao[psm][week][route][tipo];
            if (desconto > 0) {
              registros.push({
                psm,
                week,
                route,
                tipo,
                desconto: parseInt(desconto, 10),
                year: parseInt(year, 10),
                quarter
              });
            }
          });
        });
      });
    });
    
    if (registros.length === 0) {
      console.log('📝 [DISTRIBUIÇÃO] Nenhuma distribuição para salvar');
      return { success: true };
    }
    
    console.log(`💾 [DISTRIBUIÇÃO] Salvando ${registros.length} registros no Supabase...`);
    
    // Upsert (insert ou update se já existir)
    const { data, error } = await supabase
      .from('psm_distribuicao_reparacoes')
      .upsert(registros, { 
        onConflict: 'psm,week,route,tipo,year,quarter',
        ignoreDuplicates: false
      });
    
    if (error) throw error;
    
    console.log(`✅ [DISTRIBUIÇÃO] ${registros.length} registros salvos no Supabase`);
    return { success: true };
  } catch (error) {
    console.error('❌ [DISTRIBUIÇÃO] Erro ao salvar no Supabase:', error);
    return { success: false, error };
  }
};

/**
 * V5.08.0: Carregar distribuição de reparações do Supabase
 * @param {string} quarter - Trimestre (Q1, Q2, Q3)
 * @param {number|string} year - Ano
 * @returns {Promise<Object>} - Objeto com distribuições
 */
export const carregarDistribuicaoDoSupabase = async (quarter, year) => {
  try {
    console.log(`📥 [DISTRIBUIÇÃO] Carregando do Supabase (${quarter} ${year})...`);
    
    const { data, error } = await supabase
      .from('psm_distribuicao_reparacoes')
      .select('*')
      .eq('year', parseInt(year, 10))
      .eq('quarter', quarter);
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('📝 [DISTRIBUIÇÃO] Nenhuma distribuição encontrada no Supabase');
      return {};
    }
    
    // Converter array para objeto
    const distribuicao = {};
    
    data.forEach(reg => {
      if (!distribuicao[reg.psm]) distribuicao[reg.psm] = {};
      if (!distribuicao[reg.psm][reg.week]) distribuicao[reg.psm][reg.week] = {};
      if (!distribuicao[reg.psm][reg.week][reg.route]) {
        distribuicao[reg.psm][reg.week][reg.route] = {};
      }
      distribuicao[reg.psm][reg.week][reg.route][reg.tipo] = reg.desconto;
    });
    
    console.log(`✅ [DISTRIBUIÇÃO] ${data.length} registros carregados do Supabase`);
    return distribuicao;
  } catch (error) {
    console.error('❌ [DISTRIBUIÇÃO] Erro ao carregar do Supabase:', error);
    return {};
  }
};

/**
 * V5.08.0: Limpar distribuição do Supabase (quando apagar reparadas)
 * @param {string} psm - PSM
 * @param {string} week - Semana
 * @param {string} route - Rota
 * @param {string} quarter - Trimestre
 * @param {number|string} year - Ano
 * @returns {Promise<{success: boolean, error?: any}>}
 */
export const limparDistribuicaoNoSupabase = async (psm, week, route, quarter, year) => {
  try {
    console.log(`🧹 [DISTRIBUIÇÃO] Limpando (${psm}, ${week}, ${route})...`);
    
    const { error } = await supabase
      .from('psm_distribuicao_reparacoes')
      .delete()
      .eq('psm', psm)
      .eq('week', week)
      .eq('route', route)
      .eq('year', parseInt(year, 10))
      .eq('quarter', quarter);
    
    if (error) throw error;
    
    console.log('✅ [DISTRIBUIÇÃO] Limpa do Supabase');
    return { success: true };
  } catch (error) {
    console.error('❌ [DISTRIBUIÇÃO] Erro ao limpar do Supabase:', error);
    return { success: false, error };
  }
};