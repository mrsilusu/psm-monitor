// ============================================
// CONFIGURACAO SUPABASE - PSM MONITOR
// Arquivo: src/lib/supabase.js
// ============================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("❌ Variáveis de ambiente do Supabase não definidas");
  console.error("URL:", SUPABASE_URL ? "✅" : "❌");
  console.error("KEY:", SUPABASE_ANON_KEY ? "✅" : "❌");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;