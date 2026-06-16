-- Adiciona integridade referencial entre psm_data e route_config
-- Executar no Supabase Dashboard > SQL Editor

-- 1. Garante que todos os (psm, route) em psm_data têm entrada em route_config.
--    Necessário para dados existentes antes da FK existir.
--    Províncias ficam a '' — admin pode preencher no Backoffice.
INSERT INTO route_config (psm, route_name, province, is_active, display_order)
SELECT DISTINCT p.psm, p.route, '', true, 0
FROM psm_data p
WHERE NOT EXISTS (
    SELECT 1 FROM route_config r
    WHERE r.psm = p.psm AND r.route_name = p.route
)
ON CONFLICT (psm, route_name) DO NOTHING;

-- 2. Adiciona a FK composta: psm_data(psm, route) → route_config(psm, route_name)
--    ON DELETE RESTRICT  : não permite apagar uma rota que tenha dados históricos
--    ON UPDATE CASCADE   : se o nome da rota mudar em route_config, psm_data actualiza automaticamente
ALTER TABLE psm_data
ADD CONSTRAINT fk_psm_data_route_config
FOREIGN KEY (psm, route)
REFERENCES route_config (psm, route_name)
ON DELETE RESTRICT
ON UPDATE CASCADE;
