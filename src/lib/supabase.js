// ============================================
// CONFIGURACAO SUPABASE - PSM MONITOR
// Arquivo: src/lib/supabase.js
// ============================================

import { createClient } from '@supabase/supabase-js'

// DEBUG: Ver variáveis
console.log('🔍 [SUPABASE CONFIG] Verificando variáveis...');
console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('KEY:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Existe ✅' : 'Não existe ❌');

// Credenciais do Supabase (vem das variaveis de ambiente do Vercel)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

// Verificar se variáveis existem
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [SUPABASE] Variáveis de ambiente não configuradas!');
  console.error('URL:', supabaseUrl ? '✅' : '❌');
  console.error('KEY:', supabaseAnonKey ? '✅' : '❌');
}

// Criar cliente Supabase (mesmo que variáveis estejam vazias, para não quebrar)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Helper para testar conexao
export const testConnection = async () => {
  if (!supabase) {
    return { 
      success: false, 
      message: 'Variáveis de ambiente não configuradas. Configure REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY no Vercel.' 
    };
  }
  
  try {
    const { data, error } = await supabase
      .from('psm_data')
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    return { success: true, message: 'Conexao OK' }
  } catch (error) {
    return { success: false, message: error.message }
  }
}

export default supabase