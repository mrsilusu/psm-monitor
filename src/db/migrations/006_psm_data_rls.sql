-- RLS para psm_data — todos os utilizadores autenticados podem ler e escrever
-- Executar no Supabase Dashboard > SQL Editor
--
-- IMPORTANTE: Antes de executar, actualizar linhas existentes com user_id null
-- para não ficarem inacessíveis se a política de SELECT filtrar por user_id.
-- Substitui <ADMIN_USER_ID> pelo UUID do utilizador admin no Supabase Dashboard → Auth.

-- 0. (Opcional) Atribuir user_id às linhas antigas sem dono
-- UPDATE psm_data SET user_id = '<ADMIN_USER_ID>' WHERE user_id IS NULL;

-- 1. Activar RLS
ALTER TABLE psm_data ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "authenticated read psm_data" ON psm_data;
DROP POLICY IF EXISTS "authenticated write psm_data" ON psm_data;
DROP POLICY IF EXISTS "users manage own psm_data" ON psm_data;

-- 3. SELECT: todos os utilizadores autenticados vêem todos os dados
--    (a app é colaborativa — vários utilizadores trabalham nos mesmos PSMs)
CREATE POLICY "authenticated read psm_data"
ON psm_data FOR SELECT
TO authenticated
USING (true);

-- 4. INSERT / UPDATE / DELETE: utilizador autenticado pode escrever
--    O user_id fica registado para auditoria mas não restringe leitura
CREATE POLICY "authenticated write psm_data"
ON psm_data FOR ALL
TO authenticated
USING (true)
WITH CHECK (user_id = auth.uid());
