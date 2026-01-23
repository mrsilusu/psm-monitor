// ============================================
// CONFIGURACAO SUPABASE - PSM MONITOR
// Arquivo: src/lib/supabase.js
// ============================================

import { createClient } from '@supabase/supabase-js'

// Credenciais do Supabase (vem das variaveis de ambiente)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// ============================================
// HELPERS - AUTENTICACAO
// ============================================

export const auth = {
  // Login com email/senha
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Registrar novo usuario
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  // Logout
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Obter usuario atual
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Verificar se esta autenticado
  isAuthenticated: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return !!session
  }
}

// ============================================
// HELPERS - PSM DATA
// ============================================

export const psmData = {
  // Buscar dados por PSM/Quarter/Year
  getByPSMQuarter: async (psm, quarter, year) => {
    const { data, error } = await supabase
      .from('psm_data')
      .select('*')
      .eq('psm', psm)
      .eq('quarter', quarter)
      .eq('year', year)
      .order('week', { ascending: true })
    
    return { data, error }
  },

  // Buscar dados de uma rota especifica
  getByRoute: async (psm, route, quarter, year) => {
    const { data, error } = await supabase
      .from('psm_data')
      .select('*')
      .eq('psm', psm)
      .eq('route', route)
      .eq('quarter', quarter)
      .eq('year', year)
      .order('week', { ascending: true })
    
    return { data, error }
  },

  // Inserir multiplos registros (bulk insert)
  bulkInsert: async (records) => {
    const { data, error } = await supabase
      .from('psm_data')
      .upsert(records, { 
        onConflict: 'psm,week,route,year',
        ignoreDuplicates: false 
      })
    
    return { data, error }
  },

  // Inserir/atualizar um registro
  upsert: async (record) => {
    const { data, error } = await supabase
      .from('psm_data')
      .upsert(record, { 
        onConflict: 'psm,week,route,year' 
      })
      .select()
    
    return { data, error }
  },

  // Limpar dados de um PSM/Quarter
  clear: async (psm, quarter, year) => {
    const { data, error } = await supabase.rpc('limpar_dados_psm', {
      p_psm: psm,
      p_quarter: quarter,
      p_year: year
    })
    
    return { data, error }
  },

  // Obter lista de rotas unicas
  getUniqueRoutes: async (psm) => {
    const { data, error } = await supabase
      .from('psm_data')
      .select('route, provincia')
      .eq('psm', psm)
      .order('route')
    
    if (error) return { data: [], error }
    
    // Remover duplicatas
    const unique = [...new Map(data.map(item => [item.route, item])).values()]
    return { data: unique, error: null }
  },

  // Buscar todos os dados (sem filtro)
  getAll: async () => {
    const { data, error } = await supabase
      .from('psm_data')
      .select('*')
      .order('created_at', { ascending: false })
    
    return { data, error }
  },

  // Buscar com filtros customizados
  getFiltered: async (filters = {}) => {
    let query = supabase.from('psm_data').select('*')
    
    if (filters.psm) query = query.eq('psm', filters.psm)
    if (filters.quarter) query = query.eq('quarter', filters.quarter)
    if (filters.year) query = query.eq('year', filters.year)
    if (filters.provincia) query = query.eq('provincia', filters.provincia)
    if (filters.route) query = query.eq('route', filters.route)
    
    const { data, error } = await query.order('week', { ascending: true })
    return { data, error }
  }
}

// ============================================
// HELPERS - JUSTIFICATIVAS
// ============================================

export const justificativas = {
  // Buscar justificativas por PSM/Quarter
  getByPSMQuarter: async (psm, quarter, year) => {
    const { data, error } = await supabase
      .from('justificativas')
      .select('*')
      .eq('psm', psm)
      .eq('quarter', quarter)
      .eq('year', year)
      .order('seccao', { ascending: true })
    
    return { data, error }
  },

  // Inserir multiplas justificativas
  bulkInsert: async (records) => {
    const { data, error } = await supabase
      .from('justificativas')
      .upsert(records, { 
        onConflict: 'psm,quarter,seccao,year',
        ignoreDuplicates: false 
      })
    
    return { data, error }
  },

  // Inserir/atualizar uma justificativa
  upsert: async (record) => {
    const { data, error } = await supabase
      .from('justificativas')
      .upsert(record, {
        onConflict: 'psm,quarter,seccao,year'
      })
      .select()
    
    return { data, error }
  },

  // Limpar justificativas
  clear: async (psm, quarter, year) => {
    const { error } = await supabase
      .from('justificativas')
      .delete()
      .eq('psm', psm)
      .eq('quarter', quarter)
      .eq('year', year)
    
    return { error }
  },

  // Buscar por seccao especifica
  getBySeccao: async (psm, quarter, year, seccao) => {
    const { data, error } = await supabase
      .from('justificativas')
      .select('*')
      .eq('psm', psm)
      .eq('quarter', quarter)
      .eq('year', year)
      .eq('seccao', seccao)
    
    return { data, error }
  }
}

// ============================================
// HELPERS - IMPORT HISTORY
// ============================================

export const importHistory = {
  // Registrar importacao
  create: async (record) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('import_history')
      .insert({
        ...record,
        user_id: user?.id
      })
      .select()
    
    return { data, error }
  },

  // Buscar historico do usuario
  getUserHistory: async (limit = 10) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('import_history')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    return { data, error }
  },

  // Buscar todo historico (admin)
  getAll: async (limit = 50) => {
    const { data, error } = await supabase
      .from('import_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    return { data, error }
  }
}

// ============================================
// HELPERS - USER PREFERENCES
// ============================================

export const userPreferences = {
  // Obter preferencias do usuario
  get: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user?.id)
      .single()
    
    return { data, error }
  },

  // Salvar/atualizar preferencias
  upsert: async (preferences) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user?.id,
        ...preferences
      })
      .select()
    
    return { data, error }
  }
}

// ============================================
// HELPERS - ESTATISTICAS
// ============================================

export const stats = {
  // Estatisticas gerais
  getGeneral: async () => {
    const { data, error } = await supabase.rpc('get_estatisticas_gerais')
    return { data, error }
  },

  // Resumo por PSM/Quarter (usando view)
  getResumoPSMQuarter: async () => {
    const { data, error } = await supabase
      .from('vw_resumo_psm_quarter')
      .select('*')
    
    return { data, error }
  },

  // Contar registros por PSM
  countByPSM: async () => {
    const { data, error } = await supabase
      .from('psm_data')
      .select('psm', { count: 'exact' })
    
    return { data, error }
  }
}

// ============================================
// REALTIME SUBSCRIPTIONS (Opcional)
// ============================================

export const subscriptions = {
  // Escutar mudancas em psm_data
  subscribePSMData: (callback) => {
    return supabase
      .channel('psm-data-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'psm_data' },
        callback
      )
      .subscribe()
  },

  // Escutar mudancas em justificativas
  subscribeJustificativas: (callback) => {
    return supabase
      .channel('justificativas-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'justificativas' },
        callback
      )
      .subscribe()
  },

  // Cancelar subscricao
  unsubscribe: (channel) => {
    supabase.removeChannel(channel)
  }
}

// ============================================
// UTILITIES
// ============================================

export const utils = {
  // Testar conexao
  testConnection: async () => {
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
  },

  // Verificar se tabela existe
  tableExists: async (tableName) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      return !error
    } catch {
      return false
    }
  }
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default supabase
