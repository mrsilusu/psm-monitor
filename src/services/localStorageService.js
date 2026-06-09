// src/services/localStorageService.js
// Responsabilidade: abstração de localStorage e limpeza de keys antigas
// Máx. 80 linhas

import { CURRENT_DATA_VERSION } from '../config/constants.js';

export const LS_KEYS = {
  DATA_VERSION: 'psm_data_version',
  DATA: 'psm_rotas_data_v3',
  DISTRIBUICAO: 'psm_distribuicao_reparacoes_v3',
  JUSTIFICATIVAS: 'psm_justificativas_v1',
  TESTED_ROUTES: 'psm_rotas_testadas_v2',
  VALIDATED_ROUTES: 'psm_rotas_validadas_v2',
  LEGACY_DISTRIBUICAO: 'psm_distribuicao_reparacoes',
  LEGACY_DISTRIBUICAO_V1: 'psm_distribuicao_reparacoes_v1',
  LEGACY_DATA: 'psm_rotas_data_v2',
  LEGACY_JUSTIFICATIVAS: 'psm_justificativas',
};

export const cleanupOldData = () => {
  try {
    const savedVersion = window.localStorage.getItem(LS_KEYS.DATA_VERSION);
    const versionNumber = savedVersion ? parseInt(savedVersion, 10) : 0;

    console.log(`🔍 [CLEANUP] Versão localStorage: ${versionNumber}, Versão atual: ${CURRENT_DATA_VERSION}`);

    if (versionNumber < CURRENT_DATA_VERSION) {
      console.log('🧹 [CLEANUP] Limpando localStorage antigo...');

      const keysToRemove = [
        LS_KEYS.LEGACY_DISTRIBUICAO,
        LS_KEYS.LEGACY_DISTRIBUICAO_V1,
        LS_KEYS.LEGACY_DATA,
        LS_KEYS.DATA,
        LS_KEYS.LEGACY_JUSTIFICATIVAS,
        LS_KEYS.JUSTIFICATIVAS,
      ];

      keysToRemove.forEach(key => {
        if (window.localStorage.getItem(key)) {
          console.log(`🗑️ [CLEANUP] Removendo: ${key}`);
          window.localStorage.removeItem(key);
        }
      });

      window.localStorage.setItem(LS_KEYS.DATA_VERSION, CURRENT_DATA_VERSION.toString());
      console.log('✅ [CLEANUP] localStorage limpo e atualizado para versão', CURRENT_DATA_VERSION);
      console.log('ℹ️ [CLEANUP] Dados locais foram atualizados. Tudo será recarregado do servidor.');

      return true;
    }

    console.log('✅ [CLEANUP] localStorage já está na versão atual');
    return false;
  } catch (error) {
    console.error('❌ [CLEANUP] Erro ao limpar localStorage:', error);
    return false;
  }
};
