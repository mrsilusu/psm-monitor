import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarChart3, TrendingUp, Users, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, TrendingDown, Home, Upload, FileJson, Download, Calendar, BarChart, FileText, Menu, PieChart, DownloadCloud, Trash2, AlertCircle } from 'lucide-react';

import { limparDistribuicaoNoSupabase } from './services/supabaseDistribuicaoService';
import { cleanupOldData } from './services/localStorageService';

import { CURRENT_DATA_VERSION, ALL_WEEKS, STATUS_CATEGORIES } from './config/constants';
import { QUARTER_CONFIG } from './config/quarterConfig';
import { ROUTES_BY_PSM } from './config/routeConfig';
import { ROUTE_TO_PROVINCE, PROVINCE_TO_OPERATOR, OPERATOR_TO_PROVINCES } from './config/provinceConfig';
import { getQuarterFromWeek, getWeeksForQuarter, getQuarterAnterior } from './utils/dateUtils.js';
import { isValidNumericInput } from './utils/validators.js';
import { formatPercentage, formatNumber, formatWeekLabel, formatQuarterLabel } from './utils/formatters.js';
import { buscarValorAnterior as buscarValorAnteriorUtil, getValorReduzido as getValorReduzidoUtil, getValorOriginal as getValorOriginalUtil } from './utils/valueUtils.js';
import { findPSMForRoute as findPSMForRouteUtil, isRotaTestada as isRotaTestadaUtil, isRotaValidada as isRotaValidadaUtil, getSemanasTestadasNoQuarter as getSemanasTestadasNoQuarterUtil, getSemanasValidadasNoQuarter as getSemanasValidadasNoQuarterUtil, getSemanasTestadas as getSemanasTestadasUtil, getSemanasValidadas as getSemanasValidadasUtil, isRotaTestadaGlobalNoQuarter as isRotaTestadaGlobalNoQuarterUtil, isRotaValidadaGlobalNoQuarter as isRotaValidadaGlobalNoQuarterUtil, isRotaTestadaGlobal as isRotaTestadaGlobalUtil, isRotaValidadaGlobal as isRotaValidadaGlobalUtil, isRotaValidadaNoQuarter as isRotaValidadaNoQuarterUtil, isRotaTestadaNoQuarter as isRotaTestadaNoQuarterUtil } from './utils/routeUtils.js';
import { calcularNovoEstadoFibras } from './utils/fibraLogic.js';
import { buildBackupJSON, buildJustificativasCSV, downloadFile, parseCSVText } from './utils/exportImport.js';
import { useFilters } from './hooks/state/useFilters.js';
import { useAppState } from './hooks/state/useAppState.js';
import { usePersistence } from './hooks/state/usePersistence.js';
import { useScrollHeader } from './hooks/state/useScrollHeader.js';
import { useTestes } from './hooks/business/useTestes.js';
import { useAlertas } from './hooks/business/useAlertas.js';
import { useClassificacao } from './hooks/business/useClassificacao.js';
import { useIntervencoes } from './hooks/business/useIntervencoes.js';
import { useTendencias } from './hooks/business/useTendencias.js';
import { usePieChart } from './hooks/business/usePieChart.js';
import { useDashboard } from './hooks/business/useDashboard.js';
import SaveStatus from './components/feedback/SaveStatus.jsx';
import PresentationMode from './features/Apresentacao/PresentationMode.jsx';
import RepairTypeModal from './features/DataEntry/RepairTypeModal.jsx';
import TestesAnalises from './features/Testes/TestesAnalises.jsx';
import StatusDrilldown from './features/Dashboard/StatusDrilldown.jsx';
import ExecutiveDashboard from './features/Dashboard/ExecutiveDashboard.jsx';

const PSMMonitorApp = () => {
  console.log("🚀 PSM Monitor 5.10.19 - FIX CRÍTICO: Salva apenas no Quarter correto da semana! ✅");
  
  // ============================================================================
  // V5.08.19: SISTEMA DE VERSIONAMENTO E LIMPEZA AUTOMÁTICA DO localStorage
  // ============================================================================
  
  /**
   * VERSÃO ATUAL DO SCHEMA DE DADOS
   * Incrementar quando houver mudanças incompatíveis
   */
  // CURRENT_DATA_VERSION moved to src/config/constants.js
  
  /**
   * Função para limpar localStorage corrompido ou antigo
   * Executada UMA VEZ ao carregar o app
   */
  // Executar limpeza UMA VEZ ao montar o componente
  // ANTES de inicializar qualquer estado
  React.useEffect(() => {
    const wasCleanedUp = cleanupOldData();

    if (wasCleanedUp) {
      // Se foi limpo, forçar reload para carregar dados frescos do Supabase
      console.log('🔄 [CLEANUP] Recarregando página para aplicar mudanças...');
      // Usar timeout para dar tempo de mostrar os logs
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, []); // Executar apenas uma vez no mount
  
  // ROUTE_TO_PROVINCE moved to src/config/provinceConfig.js
  
  // PROVINCE_TO_OPERATOR moved to src/config/provinceConfig.js
  
  // MAPEAMENTO DE PSM PARA PROVÍNCIAS DISPONÍVEIS
  // v3.37.0: Lunda Norte REMOVIDA da FIBRASOL (Cuango está em Malanje)
  // OPERATOR_TO_PROVINCES moved to src/config/provinceConfig.js
  
  // ============================================================================
  // FASE 7: ESTRUTURA DE DADOS CENTRAL
  // ============================================================================

  // QUARTER_CONFIG moved to src/config/QUARTER_CONFIG.js

  // Gerar array de semanas [W1, W2, ..., W52]
  // ALL_WEEKS moved to src/config/constants.js

  // ROTAS_BY_PSM moved to src/config/routeConfig.js
  // Importado no topo: import { ROUTES_BY_PSM } from './config/routeConfig';

  const {
    data,
    setData,
    distribuicaoReparacoes,
    setDistribuicaoReparacoes,
    justificativas,
    setJustificativas,
    alertasAbertos,
    setAlertasAbertos,
    alertasLidos,
    setAlertasLidos,
    efetividadeMode,
    setEfetividadeMode,
    showTestesAnalises,
    setShowTestesAnalises,
    testesData,
    setTestesData,
    todosTestesData,
    setTodosTestesData,
    rotasTestadas,
    setRotasTestadas,
    rotasValidadas,
    setRotasValidadas,
    tabelaValidacaoAberta,
    setTabelaValidacaoAberta,
    isMobileDevice,
    setIsMobileDevice,
    showMobileWarning,
    setShowMobileWarning,
    menuOpen,
    setMenuOpen,
    manualDataExpanded,
    setManualDataExpanded,
    presentationMode,
    setPresentationMode,
    currentSlide,
    setCurrentSlide,
    viewMode,
    setViewMode,
    viewModeClassificacao,
    setViewModeClassificacao,
    currentGraph,
    setCurrentGraph,
    currentGraphClassificacao,
    setCurrentGraphClassificacao,
    saveStatus,
    setSaveStatus,
    lastSaveTime,
    setLastSaveTime,
    showModal,
    setShowModal,
    selectedRota,
    setSelectedRota,
    showRepairTypeModal,
    setShowRepairTypeModal,
    pendingRepairData,
    setPendingRepairData,
    currentPageDrilldown,
    setCurrentPageDrilldown,
    currentPageAcomp,
    setCurrentPageAcomp,
    currentPageNormalizadas,
    setCurrentPageNormalizadas,
    currentPageIntervencoes,
    setCurrentPageIntervencoes,
    currentPageSemIntervencao,
    setCurrentPageSemIntervencao,
    hoveredPieSlice,
    setHoveredPieSlice,
    hoveredWeekIndex,
    setHoveredWeekIndex,
    tooltipData,
    setTooltipData,
    tooltipPosition,
    setTooltipPosition,
    showStatusDrilldown,
    setShowStatusDrilldown,
    selectedStatusDrilldown,
    setSelectedStatusDrilldown,
  } = useAppState();

  const {
    selectedOperator,
    setSelectedOperator,
    selectedWeek,
    setSelectedWeek,
    selectedQuarter,
    setSelectedQuarter,
    selectedYear,
    setSelectedYear,
    selectedProvince,
    setSelectedProvince,
  } = useFilters();

  const { isLoadingDistribuicao } = usePersistence({
    data,
    justificativas,
    distribuicaoReparacoes,
    selectedYear,
    selectedQuarter,
    rotasTestadas,
    rotasValidadas,
    setData,
    setJustificativas,
    setRotasTestadas,
    setRotasValidadas,
    setDistribuicaoReparacoes,
    setSaveStatus,
    setLastSaveTime,
  });

  const { scrollContainerRef, headerVisible } = useScrollHeader();

// Cleanup do timer do modal ao desmontar
useEffect(() => {
  return () => {
    if (modalTimerRef.current) {
      clearTimeout(modalTimerRef.current);
      modalTimerRef.current = null;
    }
  };
}, []);

// Carregamento de dados do Supabase gerido por usePersistence (src/hooks/state/usePersistence.js)
  
  
  // v3.49.24: Detecção automática de dispositivo mobile
  useEffect(() => {
    const checkMobileDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
      setIsMobileDevice(isMobile);
    };
    
    checkMobileDevice();
    window.addEventListener('resize', checkMobileDevice);
    
    return () => window.removeEventListener('resize', checkMobileDevice);
  }, []);
  
  const isRotaTestada = (psm, semana, rota) =>
    isRotaTestadaUtil(rotasTestadas, selectedYear, psm, semana, rota);

  const isRotaValidada = (psm, semana, rota) =>
    isRotaValidadaUtil(rotasValidadas, selectedYear, psm, semana, rota);

  const getSemanasTestadasNoQuarter = (psm, rota, quarter) =>
    getSemanasTestadasNoQuarterUtil(rotasTestadas, selectedYear, psm, rota, quarter);

  const getSemanasValidadasNoQuarter = (psm, rota, quarter) =>
    getSemanasValidadasNoQuarterUtil(rotasValidadas, selectedYear, psm, rota, quarter);

  const getSemanasTestadas = (psm, rota) =>
    getSemanasTestadasUtil(rotasTestadas, psm, rota);

  const getSemanasValidadas = (psm, rota) =>
    getSemanasValidadasUtil(rotasValidadas, psm, rota);

  const isRotaTestadaGlobalNoQuarter = (psm, rota, quarter) =>
    isRotaTestadaGlobalNoQuarterUtil(rotasTestadas, selectedYear, psm, rota, quarter);

  const isRotaValidadaGlobalNoQuarter = (psm, rota, quarter) =>
    isRotaValidadaGlobalNoQuarterUtil(rotasValidadas, selectedYear, psm, rota, quarter);

  const isRotaTestadaGlobal = (psm, rota) =>
    isRotaTestadaGlobalUtil(rotasTestadas, psm, rota);

  const isRotaValidadaGlobal = (psm, rota) =>
    isRotaValidadaGlobalUtil(rotasValidadas, psm, rota);

  const isRotaValidadaNoQuarter = (psm, rota, quarter) =>
    isRotaValidadaNoQuarterUtil(rotasValidadas, selectedYear, psm, rota, quarter);

  const isRotaTestadaNoQuarter = (psm, rota, quarter) =>
    isRotaTestadaNoQuarterUtil(rotasTestadas, selectedYear, psm, rota, quarter);

  // ============================================================================
  // FASE 6: HOOKS DE LÓGICA DE NEGÓCIO
  // ============================================================================

  useTestes({
    data, rotasTestadas, rotasValidadas,
    selectedOperator, selectedQuarter,
    setTestesData, setTodosTestesData,
    isRotaTestadaGlobalNoQuarter, isRotaValidadaGlobalNoQuarter, getSemanasValidadasNoQuarter,
  });

  const { alertas } = useAlertas({
    data, selectedOperator, selectedQuarter, selectedWeek, selectedProvince, alertasLidos,
  });

  const { classificacaoRotas } = useClassificacao({
    data, selectedOperator, selectedWeek, selectedQuarter,
  });

  const { intervencoesRecentes, rotasNormalizadas, rotasMaisIntervencionadas, rotasSemIntervencao } = useIntervencoes({
    data, selectedOperator, selectedQuarter, selectedWeek, selectedProvince,
  });

  const { trendData } = useTendencias({
    data, distribuicaoReparacoes, selectedOperator, selectedQuarter, selectedYear, selectedWeek, selectedProvince,
  });

  const { pieChartData } = usePieChart({
    data, distribuicaoReparacoes, selectedOperator, selectedQuarter, selectedYear, selectedProvince,
  });

  const {
    executiveDashboard, headerCardsData, topRotasCriticas, acompanhamentoData,
    efetividadeGlobalMedia, efetividadePSMMedia,
  } = useDashboard({
    data, distribuicaoReparacoes, justificativas,
    selectedOperator, selectedQuarter, selectedYear, selectedWeek, selectedProvince,
  });

  // ============================================================================
  // Lógica de testes/validações movida para useTestes (src/hooks/business/useTestes.js)

  // v3.40.27: Fechar dropdown de alertas ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertasAbertos && !event.target.closest('.relative')) {
        setAlertasAbertos(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [alertasAbertos]);
  
  // v3.21.1: Removido showProvincialDashboard (dashboard redundante)

  // Função para obter semanas de um quadrimestre
  const getWeeksForQuarter = (quarter) => {
    const config = QUARTER_CONFIG[quarter];
    return Array.from(
      { length: config.weeks },
      (_, i) => `W${config.start + i}`
    );
  };

  // ============================================================================
  // v3.7.0: ESTADOS PARA CARROSSEL DE GRÁFICOS
  // ============================================================================
  
  // ============================================================================
  // FASE 8: ESTADOS DE FEEDBACK DE SALVAMENTO
  // ============================================================================

  const modalTimerRef = useRef(null);
  const valorOriginalRef = useRef(null); // Guarda valor antes de começar a editar
  const skipNextSaveRef = useRef(false); // V5.08.17: Flag para evitar salvamento após delete

  // Constantes de paginação (estados vêm de useAppState)
  const itemsPerPageDrilldown = 16;
  const itemsPerPageAcomp = 10;
  const itemsPerPageNormalizadas = 6;
  const itemsPerPageIntervencoes = 5;
  const itemsPerPageSemIntervencao = 7;

  // ============================================================================
  // v3.7.0: FUNÇÕES DE NAVEGAÇÃO DO CARROSSEL
  // ============================================================================

  const goToNextGraph = () => setCurrentGraph((prev) => (prev + 1) % 3);
  const goToPrevGraph = () => setCurrentGraph((prev) => (prev - 1 + 3) % 3);
  const goToGraph = (index) => setCurrentGraph(index);
  
  const goToNextGraphClassificacao = () => setCurrentGraphClassificacao((prev) => (prev + 1) % 3);
  const goToPrevGraphClassificacao = () => setCurrentGraphClassificacao((prev) => (prev - 1 + 3) % 3);
  const goToGraphClassificacao = (index) => setCurrentGraphClassificacao(index);
  const toggleViewMode = () => setViewMode((prev) => (prev === 'carousel' ? 'all' : 'carousel'));
  const toggleViewModeClassificacao = () => setViewModeClassificacao((prev) => (prev === 'carousel' ? 'all' : 'carousel'));

  const quarterWeeks = ALL_WEEKS.slice(
    QUARTER_CONFIG[selectedQuarter].start - 1,
    QUARTER_CONFIG[selectedQuarter].end
  );

  // ============================================================================
  // IMPORTAR JUSTIFICATIVAS - CÓDIGO COMPLETO
  // ============================================================================

  /**
   * FUNÇÃO 1: Detectar PSM baseado no nome da rota
   * Faz busca exata e normalizada (case-insensitive, sem espaços extras)
   */
  const findPSMForRoute = (routeName) => findPSMForRouteUtil(routeName);

  /**
   * FUNÇÃO 2: Carregar biblioteca XLSX dinamicamente
   */
  const loadXLSX = () => {
    return new Promise((resolve, reject) => {
      if (window.XLSX) {
        resolve(window.XLSX);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      script.onload = () => resolve(window.XLSX);
      script.onerror = () => reject(new Error('Falha ao carregar biblioteca XLSX'));
      document.head.appendChild(script);
    });
  };

  /**
   * FUNÇÃO 3: Processar arquivo Excel (OTIMIZADO para fórmulas)
   */
  const processExcelFile = async (file) => {
    try {

      // 1. Carregar biblioteca XLSX
      const XLSX = await loadXLSX();
      
      // 2. Ler arquivo Excel COM CÁLCULO DE FÓRMULAS
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { 
        type: 'array', 
        codepage: 65001,  // UTF-8
        cellFormula: true, // Preservar fórmulas
        cellStyles: true   // Preservar estilos
      });
      
      // 3. Pegar primeira aba
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // 4. Converter para JSON (array de arrays) COM VALORES CALCULADOS
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        raw: false,        // Valores como string
        defval: '',        // Default vazio
        blankrows: false   // Ignorar linhas vazias
      });

      // 5. Validar arquivo
      if (jsonData.length < 2) {
        alert('Arquivo Excel vazio ou inválido');
        return;
      }

      // 6. Buscar linha de cabeçalho (nas primeiras 5 linhas)
      const newJustificativas = {};
      let headerRow = -1;
      
      for (let i = 0; i < Math.min(5, jsonData.length); i++) {
        const row = jsonData[i];
        if (row && row.some(cell => 
          cell && (String(cell).toLowerCase().includes('secç') || 
                  String(cell).toLowerCase().includes('rota') ||
                  String(cell).toLowerCase().includes('secc'))
        )) {
          headerRow = i;

          break;
        }
      }
      
      if (headerRow === -1) {
        alert('Não foi possível encontrar os cabeçalhos.\n\nVerifique se o arquivo contém uma coluna "Secções" ou "Rota".');
        return;
      }

      // 7. Extrair headers
      const headers = jsonData[headerRow].map(h => 
        String(h || '').toLowerCase().trim()
      );

      // 8. Encontrar índices das colunas (OTIMIZADO)
      const seccaoIdx = headers.findIndex(h => 
        h.includes('secç') || h.includes('rota') || h.includes('secc')
      );
      const regiaoIdx = headers.findIndex(h => 
        h.includes('região') || h.includes('regiao')
      );
      // OTIMIZADO: aceita "Transporte Q 2" (com espaços)
      const transporteIdx = headers.findIndex(h => 
        h.includes('transporte') && (h.includes('q') || h.includes('2'))
      );
      // OTIMIZADO: aceita "Indisponíveis" simples
      const indisponiveisIdx = headers.findIndex(h => 
        h.includes('indispon') && !h.includes('delta')
      );
      // OTIMIZADO: aceita "Delta Indisponibilidade" com espaço
      const deltaIdx = headers.findIndex(h => 
        h.includes('delta')
      );
      // OTIMIZADO: aceita "JUSTIFICATIVA DEGRADAÇÃO" (maiúsculas)
      const justificativaIdx = headers.findIndex(h => 
        h.includes('justifica')
      );

      // 9. Validar coluna obrigatória
      if (seccaoIdx === -1) {
        alert('Não foi possível encontrar a coluna "Secções".\n\nColunas encontradas:\n' + 
              headers.filter(h => h).join(', '));
        return;
      }

      // 10. Processar cada linha
      let totalImported = 0;
      let notFoundRoutes = [];
      let processedRows = 0;
      let skippedRows = 0;

      for (let i = headerRow + 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || row.length === 0) continue;

        const seccao = row[seccaoIdx] ? String(row[seccaoIdx]).trim() : '';
        
        // Ignorar linhas vazias ou com fórmulas não resolvidas
        if (!seccao || seccao === '' || seccao === '#REF!' || seccao === '#N/A') {
          skippedRows++;
          continue;
        }

        processedRows++;

        // 11. Detectar PSM automaticamente
        const detectedPSM = findPSMForRoute(seccao);
        
        if (!detectedPSM) {

          notFoundRoutes.push(seccao);
          continue;
        }

        // 12. Extrair valores da linha (OTIMIZADO para fórmulas)
        const regiao = regiaoIdx !== -1 && row[regiaoIdx] ? 
          String(row[regiaoIdx]).trim() : '';
        
        // OTIMIZADO: converter valores que podem ser fórmulas ou strings
        const parseValue = (val) => {
          if (!val) return 0;
          const str = String(val).trim();
          if (str === '' || str === '#REF!' || str === '#N/A') return 0;
          const num = parseFloat(str);
          return isNaN(num) ? 0 : Math.round(num);
        };
        
        const transporte = transporteIdx !== -1 ? parseValue(row[transporteIdx]) : 0;
        const indisponiveis = indisponiveisIdx !== -1 ? parseValue(row[indisponiveisIdx]) : 0;
        const delta = deltaIdx !== -1 ? parseValue(row[deltaIdx]) : 0;
        
        const justificativa = justificativaIdx !== -1 && row[justificativaIdx] ? 
          String(row[justificativaIdx]).trim() : '';

        // 13. Importar APENAS se tiver pelo menos UM valor diferente de zero
        // REGRA: Se Transporte=0 E Indisponíveis=0 E Delta=0 → NÃO IMPORTAR
        const temDadosValidos = transporte > 0 || indisponiveis > 0 || delta !== 0;
        
        if (temDadosValidos) {
          const key = detectedPSM + '_' + seccao;
          newJustificativas[key] = {
            seccao: seccao,
            regiao: regiao,
            transporte: transporte,
            indisponiveis: indisponiveis,
            delta: delta,
            justificativa: justificativa,
            psm: detectedPSM,
            quarter: selectedQuarter
          };
          totalImported++;

        } else {
          console.log('  ⚠️ Ignorado (todos valores = 0)');
          skippedRows++;
        }
      }

      // 14. Logs de estatísticas
      console.log('=' .repeat(60));

      console.log('=' .repeat(60));

      console.log('   ISISTEL:', Object.values(newJustificativas).filter(j => j.psm === 'ISISTEL').length);
      console.log('   FIBRASOL:', Object.values(newJustificativas).filter(j => j.psm === 'FIBRASOL').length);
      console.log('   ANGLOBAL:', Object.values(newJustificativas).filter(j => j.psm === 'ANGLOBAL').length);
      console.log('=' .repeat(60));

      // 15. Atualizar estado
      setJustificativas(prev => {
        const updated = { ...prev, ...newJustificativas };
        console.log('💾 Estado de justificativas atualizado. Total:', Object.keys(updated).length);
        return updated;
      });
      
      // 16. Feedback ao usuário (OTIMIZADO)
      if (totalImported === 0) {
        alert('⚠️ Nenhuma justificativa foi importada!\n\n' +
              'Possíveis causas:\n' +
              '• Nenhuma rota foi encontrada no sistema\n' +
              '• Todas as linhas estão vazias ou sem dados válidos\n\n' +
              `Linhas processadas: ${processedRows}\n` +
              `Rotas não encontradas: ${notFoundRoutes.length}`);
        return;
      }
      
      let message = '✅ Excel importado com sucesso!\n\n';
      message += `📊 ESTATÍSTICAS:\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `Linhas processadas: ${processedRows}\n`;
      message += `Total importado: ${totalImported} secções\n`;
      message += `Linhas ignoradas: ${skippedRows}\n`;
      message += `Trimestre: ${selectedQuarter}\n\n`;
      message += `📈 POR PSM:\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `• ISISTEL: ${Object.values(newJustificativas).filter(j => j.psm === 'ISISTEL').length}\n`;
      message += `• FIBRASOL: ${Object.values(newJustificativas).filter(j => j.psm === 'FIBRASOL').length}\n`;
      message += `• ANGLOBAL: ${Object.values(newJustificativas).filter(j => j.psm === 'ANGLOBAL').length}`;
      
      if (notFoundRoutes.length > 0) {
        message += `\n\n⚠️ ROTAS NÃO ENCONTRADAS (${notFoundRoutes.length}):\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += notFoundRoutes.slice(0, 10).join('\n');
        if (notFoundRoutes.length > 10) {
          message += `\n... e mais ${notFoundRoutes.length - 10} rotas`;
        }
      }
      
      alert(message);
      
    } catch (error) {
      console.error('❌ Erro ao processar Excel:', error);
      alert('❌ Erro ao processar Excel!\n\n' + 
            'Detalhes: ' + error.message + '\n\n' +
            'Verifique se o arquivo está correto e tente novamente.');
    }
  };

  /**
   * FUNÇÃO 4: Processar arquivo CSV
   */
  const processCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          let text = e.target.result;

          // 1. Remover BOM UTF-8 se presente
          if (text.charCodeAt(0) === 0xFEFF) {
            text = text.substring(1);

          }
          
          const lines = text.split('\n');
          
          // 2. Validar arquivo
          if (lines.length < 2) {
            alert('Arquivo CSV vazio ou inválido');
            reject(new Error('Arquivo vazio'));
            return;
          }

          // 3. Extrair headers (linha 0)
          const headers = lines[0].split(',')
            .map(h => h.trim().replace(/"/g, '').toLowerCase());
          
          const newJustificativas = {};

          // 4. Encontrar índices das colunas
          const seccaoIdx = headers.findIndex(h => 
            h.includes('secç') || h.includes('rota') || 
            h.includes('troço') || h.includes('secc')
          );
          const regiaoIdx = headers.findIndex(h => 
            h.includes('região') || h.includes('regiao')
          );
          const transporteIdx = headers.findIndex(h => 
            h.includes('transporte')
          );
          const indisponiveisIdx = headers.findIndex(h => 
            h.includes('indispon') && !h.includes('delta')
          );
          const deltaIdx = headers.findIndex(h => 
            h.includes('delta')
          );
          const justificativaIdx = headers.findIndex(h => 
            h.includes('justifica')
          );

          if (seccaoIdx === -1) {
            alert('Arquivo deve conter a coluna "Secções" ou "Rota"');
            reject(new Error('Coluna Secções não encontrada'));
            return;
          }

          let totalImported = 0;
          let notFoundRoutes = [];
          let processedLines = 0;

          // 5. Processar cada linha
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            processedLines++;

            // 6. Parser CSV robusto (trata vírgulas dentro de aspas)
            const values = [];
            let currentValue = '';
            let insideQuotes = false;

            for (let char of line) {
              if (char === '"') {
                insideQuotes = !insideQuotes;
              } else if (char === ',' && !insideQuotes) {
                values.push(currentValue.trim().replace(/^"|"$/g, ''));
                currentValue = '';
              } else {
                currentValue += char;
              }
            }
            values.push(currentValue.trim().replace(/^"|"$/g, ''));

            // 7. Extrair secção/rota
            const seccao = values[seccaoIdx]?.trim();
            if (!seccao || seccao === '') continue;

            // 8. Detectar PSM automaticamente
            const detectedPSM = findPSMForRoute(seccao);

            if (!detectedPSM) {
              notFoundRoutes.push(seccao);
              continue;
            }

            // 9. Extrair valores
            const regiao = regiaoIdx !== -1 ? values[regiaoIdx]?.trim() : '';
            const transporte = transporteIdx !== -1 ? 
              parseInt(values[transporteIdx]) || 0 : 0;
            const indisponiveis = indisponiveisIdx !== -1 ? 
              parseInt(values[indisponiveisIdx]) || 0 : 0;
            const delta = deltaIdx !== -1 ? 
              parseInt(values[deltaIdx]) || 0 : 0;
            const justificativa = justificativaIdx !== -1 ? 
              values[justificativaIdx]?.trim() : '';

            // 10. Importar APENAS se tiver pelo menos UM valor diferente de zero
            // REGRA: Se Transporte=0 E Indisponíveis=0 E Delta=0 → NÃO IMPORTAR
            const temDadosValidos = transporte > 0 || indisponiveis > 0 || delta !== 0;
            
            if (temDadosValidos) {
              const key = detectedPSM + '_' + seccao;
              newJustificativas[key] = {
                seccao: seccao,
                regiao: regiao,
                transporte: transporte,
                indisponiveis: indisponiveis,
                delta: delta,
                justificativa: justificativa,
                psm: detectedPSM,
                quarter: selectedQuarter
              };
              totalImported++;

            } else {
              console.log('⚠️ Ignorado (todos valores = 0):', seccao);
            }
          }

          // 11. Atualizar estado
          setJustificativas(prev => {
            const updated = { ...prev, ...newJustificativas };
            console.log('💾 Estado de justificativas atualizado. Total:', Object.keys(updated).length);
            return updated;
          });
          
          // 12. Feedback
          let message = '✅ CSV importado com sucesso!\n';
          message += 'Linhas processadas: ' + processedLines + '\n';
          message += 'Total importado: ' + totalImported + ' secções\n';
          message += 'Trimestre: ' + selectedQuarter;
          
          if (notFoundRoutes.length > 0) {
            message += '\n\n⚠️ Rotas não encontradas (' + notFoundRoutes.length + '):\n';
            message += notFoundRoutes.slice(0, 10).join('\n');
            if (notFoundRoutes.length > 10) {
              message += '\n... e mais ' + (notFoundRoutes.length - 10) + ' rotas';
            }
          }
          
          alert(message);
          resolve();
          
        } catch (error) {
          console.error('❌ Erro ao processar CSV:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler o arquivo'));
      };

      // 13. Ler arquivo com UTF-8
      reader.readAsText(file, 'UTF-8');
    });
  };

  /**
   * FUNÇÃO 5: Handler principal de upload
   */
  const handleUploadJustificativas = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Detectar tipo de arquivo
      const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

      // Processar baseado no tipo
      if (isExcel) {
        await processExcelFile(file);
      } else {
        await processCSVFile(file);
      }
    } catch (error) {
      console.error('❌ Erro ao importar:', error);
      alert('Erro ao importar arquivo: ' + error.message);
    }
    
    // Limpar input (permite reimportar)
    event.target.value = '';
  };

  /**
   * FUNÇÃO LIMPAR JUSTIFICATIVAS
   * Remove todas as justificativas importadas do PSM e Quarter selecionados
   */
  const handleLimparJustificativas = () => {
    const countBefore = Object.keys(justificativas).length;
    const countFiltered = Object.values(justificativas).filter(j => 
      j.psm === selectedOperator && j.quarter === selectedQuarter
    ).length;

    if (countFiltered === 0) {
      alert('⚠️ Não há justificativas para limpar!\n\n' +
            `PSM: ${selectedOperator}\n` +
            `Quarter: ${selectedQuarter}\n\n` +
            'Nenhum dado encontrado.');
      return;
    }

    const confirmar = confirm(
      `🗑️ LIMPAR JUSTIFICATIVAS\n\n` +
      `Deseja realmente limpar TODAS as justificativas de:\n\n` +
      `PSM: ${selectedOperator}\n` +
      `Quarter: ${selectedQuarter}\n\n` +
      `Total a remover: ${countFiltered} secções\n\n` +
      `Esta ação não pode ser desfeita!`
    );

    if (!confirmar) {

      return;
    }

    // Filtrar e remover apenas do PSM/Quarter selecionado
    const updated = {};
    let removed = 0;

    Object.entries(justificativas).forEach(([key, just]) => {
      if (just.psm === selectedOperator && just.quarter === selectedQuarter) {
        removed++;

      } else {
        updated[key] = just;
      }
    });

    setJustificativas(updated);

    console.log('✅ Limpeza concluída:', {
      antes: countBefore,
      removidas: removed,
      depois: Object.keys(updated).length
    });

    alert(
      `✅ Justificativas limpas com sucesso!\n\n` +
      `PSM: ${selectedOperator}\n` +
      `Quarter: ${selectedQuarter}\n\n` +
      `Removidas: ${removed} secções\n` +
      `Restantes no sistema: ${Object.keys(updated).length}`
    );
  };

  // Persistência automática gerida por usePersistence (src/hooks/state/usePersistence.js)

  // ============================================================================
  // FASE 7.1: FUNÇÕES DOS BOTÕES DO MENU
  // ============================================================================

  // v3.13.8: Função CORRIGIDA - Salvar Dados PSM (localStorage + CSV)
  const handleSaveData = () => {
    try {
      // 1. Salvar no localStorage
      window.localStorage.setItem('psm_rotas_data_v3', JSON.stringify(data));
      window.localStorage.setItem('psm_justificativas_v1', JSON.stringify(justificativas));
      
      setSaveStatus('saved');
      setLastSaveTime(new Date());
      
      // 2. Exportar para CSV (igual handleDownloadCSV)
      // Header do CSV
      let csv = 'PSM,Semana,Rota,Transporte,Indisponíveis,Total Reparadas,Reconhecidas,Dep. Passagem Cabo,Dep. Licença,Dep. Cutover,Fibras Dependentes\n';
      
      // Obter semanas do quadrimestre selecionado
      const quarterWeeks = ALL_WEEKS.slice(
        QUARTER_CONFIG[selectedQuarter].start - 1,
        QUARTER_CONFIG[selectedQuarter].end
      );
      
      // Iterar sobre PSM selecionado, semanas do quadrimestre e rotas
      quarterWeeks.forEach(week => {
        if (data[selectedOperator] && data[selectedOperator][week]) {
          ROUTES_BY_PSM[selectedOperator].forEach(route => {
            const routeData = data[selectedOperator][week][route];
            if (routeData) {
              csv += `${selectedOperator},${week},"${route}",`;
              csv += `${routeData['Transporte'] || ''},`;
              csv += `${routeData['Indisponíveis'] || ''},`;
              csv += `${routeData['Total Reparadas'] || ''},`;
              csv += `${routeData['Reconhecidas'] || ''},`;
              csv += `${routeData['Dep. de Passagem de Cabo'] || ''},`;
              csv += `${routeData['Dep. de Licença'] || ''},`;
              csv += `${routeData['Dep. de Cutover'] || ''},`;
              csv += `${routeData[`Fibras dependentes da ${selectedOperator}`] || ''}\n`;
            }
          });
        }
      });
      
      // Criar e baixar arquivo CSV
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PSM_${selectedOperator}_${selectedQuarter}_${selectedYear}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('✓ Dados salvos e exportados com sucesso!\n\n' +
            `💾 LocalStorage: Salvo\n` +
            `📄 CSV exportado: PSM_${selectedOperator}_${selectedQuarter}_${selectedYear}.csv\n\n` +
            `PSM: ${selectedOperator}\n` +
            `Quadrimestre: ${selectedQuarter}\n` +
            `Semanas: ${quarterWeeks.length}\n` +
            `Rotas: ${ROUTES_BY_PSM[selectedOperator].length}\n` +
            `Justificativas: ${Object.keys(justificativas).length}\n` +
            `Horário: ${new Date().toLocaleString('pt-BR')}`);
      
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      console.error('Erro ao salvar/exportar:', error);
      alert('✗ Erro ao salvar/exportar dados!\n\n' + error.message);
      setSaveStatus('error');
    }
  };

  // ============================================================================
  // FASE 17: IMPORTAR DADOS PSM (CSV/EXCEL)
  // ============================================================================

  // v3.13.16: IMPORTAÇÃO CORRIGIDA - Parser CSV robusto
  /**
   * Função: Importar Dados PSM (CSV)
   * Formato esperado (SEM coluna PSM):
   * Semana,Rota,Transporte,Indisponíveis,Total Reparadas,Reconhecidas,Dep. Passagem Cabo,Dep. Licença,Dep. Cutover,Fibras dependentes da [PSM]
   */
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (event) => {
      // 1. Pegar arquivo selecionado
      const file = event.target.files[0];
      if (!file) return;  // Se cancelou, sair
      
      // 2. Criar leitor de arquivo
      const reader = new FileReader();
      
      // 3. Quando arquivo for lido
      reader.onload = (e) => {
        try {
          // 4. Pegar conteúdo do arquivo
          const text = e.target.result;

          // 5. Dividir em linhas
          const lines = text.split('\n');

          // 6. Validar: precisa ter pelo menos 2 linhas (header + 1 dado)
          if (lines.length < 2) {
            alert('Arquivo CSV vazio ou inválido');
            return;
          }
          
          // 7. Função para parsear linha CSV (respeita aspas)
          const parseCSVLine = (line) => {
            const values = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              
              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            values.push(current.trim());
            return values;
          };
          
          // 8. Processar cabeçalho (linha 0)
          const headers = parseCSVLine(lines[0]);

          // 9. Clonar dados atuais (deep clone para não mutar estado)
          // v3.49.11: MERGE - Mantém dados de outros PSMs
          const newData = JSON.parse(JSON.stringify(data));
          
          console.log('📦 MERGE DE DADOS GERAIS:');
          console.log('  PSMs existentes:', Object.keys(data));
          console.log('  PSM sendo importado:', selectedOperator);
          
          let rowCount = 0;
          let errorCount = 0;
          
          // 10. Processar cada linha de dados (a partir da linha 1)
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;  // Pular linhas vazias
            
            try {
              // 11. Parsear valores da linha (respeitando aspas)
              const values = parseCSVLine(line);
              
              // v3.40.98: DETECTAR FORMATO DO CSV (com ou sem Ano/Quarter)
              const hasAnoColumn = headers[0] === 'Ano' || headers[0] === 'ano';
              
              let week, rota, dataStartIndex;
              
              if (hasAnoColumn) {
                // FORMATO NOVO: Ano,Quarter,Semana,Rota,...
                // Ignorar Ano e Quarter
                week = values[2]?.trim();   // Coluna 2: Semana
                rota = values[3]?.trim();   // Coluna 3: Rota
                dataStartIndex = 4;         // Dados começam na coluna 4
                
                console.log(`  📋 Formato NOVO detectado: Ano=${values[0]}, Quarter=${values[1]}, Semana=${week}`);
              } else {
                // FORMATO ANTIGO: Semana,Rota,...
                week = values[0]?.trim();   // Coluna 0: Semana
                rota = values[1]?.trim();   // Coluna 1: Rota
                dataStartIndex = 2;         // Dados começam na coluna 2
                
                console.log(`  📋 Formato ANTIGO detectado: Semana=${week}`);
              }
              
              // 12. Validar dados essenciais
              if (!week || !rota) {
                console.warn(`⚠️ Linha ${i} ignorada: week='${week}', rota='${rota}'`);
                continue;
              }
              
              // 13. Criar estrutura se não existir
              if (!newData[selectedOperator]) newData[selectedOperator] = {};
              if (!newData[selectedOperator][week]) newData[selectedOperator][week] = {};
              if (!newData[selectedOperator][week][rota]) newData[selectedOperator][week][rota] = {};
              
              // 14. Importar cada status (a partir da coluna dataStartIndex)
              for (let j = dataStartIndex; j < headers.length && j < values.length; j++) {
                let statusHeader = headers[j];  // Ex: 'Transporte' ou 'Fibras dependentes da FIBRASOL'
                const valueStr = values[j]?.trim() || '0';
                const value = parseInt(valueStr) || 0;  // Ex: 10
                
                // v3.13.22: NORMALIZAR "Fibras dependentes da [QUALQUER_PSM]" 
                // para usar o PSM atualmente selecionado
                if (statusHeader.startsWith('Fibras dependentes da ')) {
                  // CSV pode ter "Fibras dependentes da FIBRASOL"
                  // mas estamos importando para ISISTEL
                  // então renomear para "Fibras dependentes da ISISTEL"
                  statusHeader = `Fibras dependentes da ${selectedOperator}`;

                }
                
                // 15. Atribuir valor com nome normalizado
                newData[selectedOperator][week][rota][statusHeader] = value;
              }
              
              rowCount++;
              
            } catch (lineError) {
              console.error(`✗ Erro na linha ${i}:`, lineError);
              errorCount++;
            }
          }

          // 16. Verificar se importou algo
          if (rowCount === 0) {
            alert('⚠️ Nenhum dado foi importado!\n\n' +
                  'Verifique:\n' +
                  '- Formato do CSV\n' +
                  '- PSM selecionado\n' +
                  '- Conteúdo do arquivo\n\n' +
                  'Veja o console (F12) para mais detalhes.');
            return;
          }
          
          // 17. Atualizar estado global (salva automaticamente no localStorage)
          setData(newData);
          
          console.log('  ✅ Estado atualizado - PSMs após merge:', Object.keys(newData));
          
          // v3.48.00: PROCESSAR VALIDAÇÕES POR SEMANA
          console.log('🔍 INICIANDO PROCESSAMENTO DE VALIDAÇÕES POR SEMANA...');
          console.log('  Headers:', headers);
          
          // V5.10.16: MERGE - Clonar estados atuais ao invés de criar vazios (com ANO)
          const novasTestadas = JSON.parse(JSON.stringify(rotasTestadas));
          const novasValidadas = JSON.parse(JSON.stringify(rotasValidadas));
          
          if (!novasTestadas[selectedYear]) novasTestadas[selectedYear] = {};
          if (!novasTestadas[selectedYear][selectedOperator]) novasTestadas[selectedYear][selectedOperator] = {};
          if (!novasValidadas[selectedYear]) novasValidadas[selectedYear] = {};
          if (!novasValidadas[selectedYear][selectedOperator]) novasValidadas[selectedYear][selectedOperator] = {};
          
          let validacoesImportadas = 0;
          
          // Encontrar índices das colunas
          const testadaIdx = headers.findIndex(h => 
            h === 'Testada' || h === 'testada' || h.includes('Testada')
          );
          const validadaIdx = headers.findIndex(h => 
            h === 'Validada' || h === 'validada' || h.includes('Validada')
          );
          
          console.log('  📊 ÍNDICES: Testada:', testadaIdx, 'Validada:', validadaIdx);
          
          if (testadaIdx >= 0 || validadaIdx >= 0) {
            console.log('  ✅ Colunas encontradas, processando...');
            
            // Processar TODAS as linhas (cada linha = uma semana)
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;
              
              try {
                const values = parseCSVLine(line);
                const hasAnoColumn = headers[0] === 'Ano' || headers[0] === 'ano';
                
                let semana, rota;
                if (hasAnoColumn) {
                  semana = values[2]?.trim();  // Ano,Quarter,Semana
                  rota = values[3]?.trim();
                } else {
                  semana = values[0]?.trim();  // Semana,Rota
                  rota = values[1]?.trim();
                }
                
                if (!semana || !rota) continue;
                
                // V5.10.16: Inicializar semana se necessário (com ANO)
                if (!novasTestadas[selectedYear][selectedOperator][semana]) {
                  novasTestadas[selectedYear][selectedOperator][semana] = {};
                }
                if (!novasValidadas[selectedYear][selectedOperator][semana]) {
                  novasValidadas[selectedYear][selectedOperator][semana] = {};
                }
                
                // Importar testada
                if (testadaIdx >= 0) {
                  const testadaVal = (values[testadaIdx] || '').toString().trim().toUpperCase();
                  
                  if (testadaVal === 'SIM' || testadaVal === 'TRUE' || testadaVal === '1') {
                    novasTestadas[selectedYear][selectedOperator][semana][rota] = {
                      testada: true
                    };
                    validacoesImportadas++;
                  }
                }
                
                // Importar validada
                if (validadaIdx >= 0) {
                  const validadaVal = (values[validadaIdx] || '').toString().trim().toUpperCase();
                  
                  if (validadaVal === 'SIM' || validadaVal === 'TRUE' || validadaVal === '1') {
                    novasValidadas[selectedYear][selectedOperator][semana][rota] = {
                      validada: true
                    };
                    validacoesImportadas++;
                  }
                }
              } catch (e) {
                console.error('  ❌ Erro na linha', i, ':', e);
              }
            }
            
            // Atualizar estados
            console.log('  📦 MERGE DE DADOS:');
            console.log('    PSMs antes:', Object.keys(rotasTestadas));
            console.log('    PSM importado:', selectedOperator);
            console.log('    PSMs depois:', Object.keys(novasTestadas));
            
            setRotasTestadas(novasTestadas);
            setRotasValidadas(novasValidadas);
            
            console.log('  ✅ Validações importadas:', validacoesImportadas);
            
            // Contar semanas e rotas
            const semanasTest = Object.keys(novasTestadas[selectedOperator] || {}).length;
            const semanasValid = Object.keys(novasValidadas[selectedOperator] || {}).length;
            console.log('  📅 Semanas com testadas:', semanasTest);
            console.log('  📅 Semanas com validadas:', semanasValid);
          }
          
          // 18. DEBUG: Verificar dados importados

          // Pegar primeira semana e primeira rota para debug
          const firstWeek = Object.keys(newData[selectedOperator] || {})[0];
          const firstRoute = firstWeek ? Object.keys(newData[selectedOperator][firstWeek])[0] : null;
          
          if (firstWeek && firstRoute) {
            const sampleData = newData[selectedOperator][firstWeek][firstRoute];

            console.log('  Campos importados:', Object.keys(sampleData));

            // Verificar campos específicos - TODOS

            console.log('  Transporte:', sampleData['Transporte'], '(tipo:', typeof sampleData['Transporte'], ')');
            console.log('  Indisponíveis:', sampleData['Indisponíveis'], '(tipo:', typeof sampleData['Indisponíveis'], ')');
            console.log('  Total Reparadas:', sampleData['Total Reparadas'], '(tipo:', typeof sampleData['Total Reparadas'], ')');
            console.log('  Reconhecidas:', sampleData['Reconhecidas'], '(tipo:', typeof sampleData['Reconhecidas'], ')');
            console.log('  Dep. de Passagem de Cabo:', sampleData['Dep. de Passagem de Cabo'], '(tipo:', typeof sampleData['Dep. de Passagem de Cabo'], ')');
            console.log('  Dep. de Licença:', sampleData['Dep. de Licença'], '(tipo:', typeof sampleData['Dep. de Licença'], ')');
            console.log('  Dep. de Cutover:', sampleData['Dep. de Cutover'], '(tipo:', typeof sampleData['Dep. de Cutover'], ')');
            console.log('  Fibras dependentes da ' + selectedOperator + ':', sampleData[`Fibras dependentes da ${selectedOperator}`], '(tipo:', typeof sampleData[`Fibras dependentes da ${selectedOperator}`], ')');
            
            // Verificar se campo existe

          } else {
            console.warn('⚠️ Nenhum dado encontrado após importação!');
          }
          
          // 19. Contar detalhes da importação
          let semanasCont = new Set();
          let rotasCont = new Set();
          
          if (newData[selectedOperator]) {
            Object.keys(newData[selectedOperator]).forEach(week => {
              semanasCont.add(week);
              if (newData[selectedOperator][week]) {
                Object.keys(newData[selectedOperator][week]).forEach(rota => {
                  rotasCont.add(rota);
                });
              }
            });
          }

          console.log('  Semanas:', Array.from(semanasCont).sort().join(', '));
          
          // 19. Contar validações por semana
          let rotasTestCount = 0;
          let rotasValidCount = 0;
          
          Object.keys(novasTestadas[selectedOperator] || {}).forEach(semana => {
            rotasTestCount += Object.keys(novasTestadas[selectedOperator][semana]).length;
          });
          
          Object.keys(novasValidadas[selectedOperator] || {}).forEach(semana => {
            rotasValidCount += Object.keys(novasValidadas[selectedOperator][semana]).length;
          });
          
          // 20. Confirmar sucesso
          alert(`✓ Dados importados com sucesso!\n\n` +
                `PSM: ${selectedOperator}\n` +
                `Linhas CSV: ${rowCount}\n` +
                `Semanas com dados: ${semanasCont.size}\n` +
                `Rotas únicas: ${rotasCont.size}\n` +
                `🧪 Marcações testadas: ${rotasTestCount}\n` +
                `✅ Marcações validadas: ${rotasValidCount}\n` +
                (errorCount > 0 ? `Linhas com erro: ${errorCount}\n` : '') +
                `Arquivo: ${file.name}\n\n` +
                `💡 Use os dropdowns para navegar entre semanas!`);
          
        } catch (error) {
          // 19. Capturar erros de parsing
          console.error('✗ Erro ao importar CSV:', error);
          console.error('Stack:', error.stack);
          alert('✗ Erro ao importar CSV!\n\n' + 
                error.message + '\n\n' +
                'Abra o console (F12) para mais detalhes.');
        }
      };
      
      // 20. Tratar erro de leitura do arquivo
      reader.onerror = () => {
        alert('Erro ao ler o arquivo');
      };
      
      // 21. Iniciar leitura como texto
      reader.readAsText(file);
      
      // 22. Limpar input (permite importar o mesmo arquivo novamente)
      event.target.value = '';
    };
    
    input.click();
  };

  // ============================================================================
  // FASE 18: IMPORTAR JUSTIFICATIVAS
  // ============================================================================

  /**
   * Função: Importar Justificativas
   * Suporta CSV com estrutura:
   * PSM,Semana,Rota,Justificativa
   * 
   * Mescla com justificativas existentes
   */
  const handleImportJustificativas = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const fileName = file.name.toLowerCase();
        
        if (!fileName.endsWith('.csv')) {
          alert('⚠️ Formato não suportado!\n\n' +
                'Apenas arquivos CSV são suportados para justificativas.\n\n' +
                'Formato esperado:\n' +
                'PSM,Semana,Rota,Justificativa');
          return;
        }
        
        // Ler arquivo CSV
        const text = await file.text();
        
        // Detectar delimitador
        const firstLine = text.split('\n')[0];
        let delimiter = ',';
        if (firstLine.split(';').length > firstLine.split(',').length) {
          delimiter = ';';
        } else if (firstLine.split('\t').length > firstLine.split(',').length) {
          delimiter = '\t';
        }

        // Parsear CSV
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/['"]/g, '').toLowerCase());

        // Validar headers necessários
        const hasPSM = headers.some(h => h.includes('psm'));
        const hasSemana = headers.some(h => h.includes('semana') || h.includes('week'));
        const hasRota = headers.some(h => h.includes('rota') || h.includes('route'));
        const hasJustificativa = headers.some(h => h.includes('justif') || h.includes('observ') || h.includes('coment'));
        
        if (!hasPSM || !hasSemana || !hasRota || !hasJustificativa) {
          alert('⚠️ Estrutura CSV inválida!\n\n' +
                'Headers obrigatórios:\n' +
                '- PSM\n' +
                '- Semana (ou Week)\n' +
                '- Rota (ou Route)\n' +
                '- Justificativa (ou Observação/Comentário)\n\n' +
                `Headers encontrados:\n${headers.join(', ')}`);
          return;
        }
        
        // Mapear índices das colunas
        const colIndexes = {
          psm: headers.findIndex(h => h.includes('psm')),
          semana: headers.findIndex(h => h.includes('semana') || h.includes('week')),
          rota: headers.findIndex(h => h.includes('rota') || h.includes('route')),
          justificativa: headers.findIndex(h => h.includes('justif') || h.includes('observ') || h.includes('coment'))
        };
        
        let importedJustificativas = {};
        let rowCount = 0;
        
        // Processar linhas
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Split respeitando aspas
          const values = [];
          let current = '';
          let inQuotes = false;
          
          for (let char of line) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
              values.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          values.push(current.trim());
          
          // Extrair dados
          const psm = values[colIndexes.psm]?.trim();
          const semana = values[colIndexes.semana]?.trim();
          const rota = values[colIndexes.rota]?.trim().replace(/['"]/g, '');
          const justificativa = values[colIndexes.justificativa]?.trim().replace(/['"]/g, '');
          
          if (!psm || !semana || !rota || !justificativa) continue;
          
          // Criar chave única: PSM_Semana_Rota
          const key = `${psm}_${semana}_${rota}`;
          importedJustificativas[key] = justificativa;
          rowCount++;
        }
        
        if (rowCount > 0) {
          // Mesclar com justificativas existentes
          const newJustificativas = { ...justificativas, ...importedJustificativas };
          setJustificativas(newJustificativas);

          console.log('  Total justificativas:', Object.keys(newJustificativas).length);
          
          alert(`✓ Importação de justificativas bem-sucedida!\n\n` +
                `📂 Arquivo: ${file.name}\n` +
                `📝 Justificativas importadas: ${rowCount}\n` +
                `📊 Total no sistema: ${Object.keys(newJustificativas).length}\n\n` +
                `As justificativas foram mescladas com as existentes.\n` +
                `Acesse a "Tabela de Acompanhamento" para visualizar.`);
        } else {
          alert('⚠️ Nenhuma justificativa foi importada!\n\n' +
                'Verifique:\n' +
                '- Arquivo tem dados (além do header)\n' +
                '- Colunas obrigatórias preenchidas\n' +
                '- Formato correto');
        }
        
      } catch (error) {
        console.error('✗ Erro ao importar justificativas:', error);
        alert(`✗ Erro ao importar justificativas!\n\n` +
              `Erro: ${error.message}\n\n` +
              `Verifique:\n` +
              `- Formato do arquivo (CSV com header)\n` +
              `- Codificação (UTF-8)\n` +
              `- Estrutura: PSM,Semana,Rota,Justificativa`);
      }
    };
    
    input.click();
  };

  // Função: Exportar JSON Backup
  const handleExportJSON = () => {
    try {
      const backup = {
        version: '1.7.1',
        timestamp: new Date().toISOString(),
        data: data,
        justificativas: justificativas,
        metadata: {
          totalRoutes: Object.values(ROUTES_BY_PSM).reduce((acc, r) => acc + r.length, 0),
          psms: Object.keys(ROUTES_BY_PSM),
          weeks: ALL_WEEKS.length,
          quarters: Object.keys(QUARTER_CONFIG)
        }
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PSM_Backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('✓ Backup JSON exportado com sucesso!\n\n' +
            `Arquivo: PSM_Backup_${new Date().toISOString().split('T')[0]}.json\n` +
            `Tamanho: ${Math.round(blob.size / 1024)} KB`);
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      alert('✗ Erro ao exportar backup!\n\n' + error.message);
    }
  };

  // v3.13.13: Função RESTAURADA - Formato ORIGINAL do código reconstituído
  const handleDownloadCSV = () => {
    try {
      // 1. Pegar PSM selecionado e ano atual
      const psm = selectedOperator;
      const anoAtual = selectedYear;
      
      // v3.40.88: Função para determinar Quarter baseado na semana
      const getQuarterFromWeek = (week) => {
        const weekNum = parseInt(week.substring(1));
        if (weekNum >= 1 && weekNum <= 18) return 'Q1';
        if (weekNum >= 19 && weekNum <= 35) return 'Q2';
        if (weekNum >= 36 && weekNum <= 52) return 'Q3';
        return 'Q1';
      };

      // 2. Criar cabeçalho CSV
      const statusCategorias = [
        'Transporte',
        'Indisponíveis',
        'Total Reparadas',
        'Reconhecidas',
        'Dep. de Passagem de Cabo',
        'Dep. de Licença',
        'Dep. de Cutover',
        'Fibras dependentes'
      ];
      
      const statusHeaders = statusCategorias.map(status => 
        status === "Fibras dependentes" ? 'Fibras dependentes da ' + psm : status
      );
      
      // v3.48.00: Header com 2 colunas de validação (POR SEMANA)
      const csvHeader = 'Ano,Quarter,Semana,Rota,' + statusHeaders.join(',') + ',Testada,Validada\n';

      // v3.40.88: Coletar dados do ANO ATUAL (W1-W52 do ano selecionado)
      const weeks = ALL_WEEKS;
      const rotas = ROUTES_BY_PSM[selectedOperator];
      let dadosAnoAtual = [];
      
      weeks.forEach(week => {
        const quarter = getQuarterFromWeek(week);
        
        rotas.forEach(rota => {
          const rotaData = data[psm]?.[week]?.[rota] || {};
          const valores = statusHeaders.map(header => rotaData[header] || 0);
          
          // v3.48.00: Verificar ESTA semana específica
          const testada = isRotaTestada(psm, week, rota) ? 'SIM' : '';
          const validada = isRotaValidada(psm, week, rota) ? 'SIM' : '';
          
          // Criar linha: Ano,Quarter,Semana,Rota,...,Testada,Validada
          const linha = anoAtual + ',' + quarter + ',' + week + ',' + rota + ',' + valores.join(',') + 
                       ',' + testada + ',' + validada;
          dadosAnoAtual.push(linha);
        });
      });

      // v3.40.88: Perguntar se quer manter histórico de outros anos
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        let dadosOutrosAnos = [];
        
        if (file) {
          // Ler arquivo existente
          const text = await file.text();
          const linhas = text.split('\n');
          
          // v3.40.88: Manter apenas dados de OUTROS anos (não do ano atual)
          for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (!linha) continue;
            
            const anoLinha = linha.split(',')[0];
            
            // Manter apenas se for de outro ano
            if (anoLinha !== anoAtual.toString()) {
              dadosOutrosAnos.push(linha);
            }
          }
          
          console.log(`✓ Mantendo ${dadosOutrosAnos.length} linhas de outros anos`);
          console.log(`✓ Atualizando ${dadosAnoAtual.length} linhas de ${anoAtual}`);
        }
        
        // v3.40.88: Montar CSV: Header + Outros anos + Ano atual
        let csvFinal = csvHeader;
        
        // Adicionar outros anos (ordenados)
        if (dadosOutrosAnos.length > 0) {
          csvFinal += dadosOutrosAnos.join('\n') + '\n';
        }
        
        // Adicionar ano atual (atualiza ou adiciona)
        csvFinal += dadosAnoAtual.join('\n') + '\n';
        
        // Salvar arquivo
        const blob = new Blob(['\uFEFF' + csvFinal], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const hoje = new Date();
        const dataExportacao = hoje.toISOString().split('T')[0];
        const nomeArquivo = `${psm}_Historico_${dataExportacao}.csv`;
        
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const totalLinhas = dadosOutrosAnos.length + dadosAnoAtual.length;
        const anosUnicos = new Set([...dadosOutrosAnos.map(l => l.split(',')[0]), anoAtual.toString()]);
        
        alert(`✅ CSV salvo com sucesso!\n\n` +
              `📊 Anos no arquivo: ${Array.from(anosUnicos).sort().join(', ')}\n` +
              `📊 Total de linhas: ${totalLinhas}\n` +
              `📊 Ano ${anoAtual}: ${dadosAnoAtual.length} linhas (atualizado)\n\n` +
              `Arquivo: ${nomeArquivo}`);
      };
      
      // Mostrar dialog
      const mensagem = `📁 Salvar dados de ${anoAtual}\n\n` +
                       `Deseja manter histórico de outros anos?\n\n` +
                       `SIM: Selecione o CSV anterior\n` +
                       `→ Dados de ${anoAtual} serão atualizados\n` +
                       `→ Outros anos serão mantidos\n\n` +
                       `NÃO: Cancelar e salvar apenas ${anoAtual}`;
      
      if (confirm(mensagem)) {
        input.click();
      } else {
        // Salvar apenas ano atual
        let csvFinal = csvHeader + dadosAnoAtual.join('\n') + '\n';
        
        const blob = new Blob(['\uFEFF' + csvFinal], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const hoje = new Date();
        const dataExportacao = hoje.toISOString().split('T')[0];
        const nomeArquivo = `${psm}_${anoAtual}_${dataExportacao}.csv`;
        
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`✅ CSV salvo com sucesso!\n\n` +
              `📊 Ano ${anoAtual}: ${dadosAnoAtual.length} linhas\n\n` +
              `Arquivo: ${nomeArquivo}`);
      }

    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('❌ Erro ao exportar CSV: ' + error.message);
    }
  };

  // ============================================================================
  // FASE 19: EXPORTAR JUSTIFICATIVAS CSV
  // ============================================================================

  /**
   * Função: Exportar Justificativas em CSV
   * Exporta todas as justificativas do sistema em formato CSV
   */
  const handleExportJustificativasCSV = () => {
    try {

      // Header do CSV
      let csv = 'PSM,Semana,Rota,Justificativa\n';
      
      // Iterar sobre justificativas
      let count = 0;
      Object.entries(justificativas).forEach(([key, justificativa]) => {
        // Chave formato: PSM_Semana_Rota
        const parts = key.split('_');
        if (parts.length >= 3) {
          const psm = parts[0];
          const semana = parts[1];
          const rota = parts.slice(2).join('_'); // Rota pode ter underscore no nome
          
          // Escapar aspas na justificativa
          const justificativaEscaped = justificativa.replace(/"/g, '""');
          
          csv += `${psm},${semana},"${rota}","${justificativaEscaped}"\n`;
          count++;
        }
      });
      
      if (count === 0) {
        alert('⚠️ Nenhuma justificativa para exportar!\n\n' +
              'Adicione justificativas primeiro:\n' +
              '- Edite na Tabela de Acompanhamento\n' +
              '- Ou importe via CSV');
        return;
      }
      
      // Criar e baixar arquivo
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Formato: PSM_Justificativas_2025-12-28_15-30-45.csv
      const hoje = new Date();
      const dataExportacao = hoje.toISOString().split('T')[0]; // 2025-12-28
      const horaExportacao = hoje.toTimeString().split(' ')[0].replace(/:/g, '-'); // 15-30-45
      a.download = `PSM_Justificativas_${dataExportacao}_${horaExportacao}.csv`;
      
      a.click();
      URL.revokeObjectURL(url);

      alert(`✓ Justificativas exportadas com sucesso!\n\n` +
            `📝 Total exportado: ${count} justificativas\n` +
            `📂 Arquivo: ${a.download}\n\n` +
            `Use este arquivo para backup ou reimportação.`);
    } catch (error) {
      console.error('Erro ao exportar justificativas:', error);
      alert('✗ Erro ao exportar justificativas!\n\n' + error.message);
    }
  };

  // Função: Ver Estado no Console
  const handleViewState = () => {
    console.clear();

    console.log('Total PSMs:', Object.keys(ROUTES_BY_PSM).length);
    console.log('Total Rotas:', Object.values(ROUTES_BY_PSM).reduce((acc, r) => acc + r.length, 0));

    console.log('Justificativas carregadas:', Object.keys(justificativas).length);

    console.log('Tamanho data:', new Blob([localStorage.getItem('psm_rotas_data_v3') || '']).size, 'bytes');
    console.log('Tamanho justificativas:', new Blob([localStorage.getItem('psm_justificativas_v1') || '']).size, 'bytes');

    alert('✓ Estado completo exibido no console!\n\nAbra o DevTools (F12) para visualizar.');
  };

  // Função: Selecionar Semanas para Comparação
  const handleSelectWeeks = () => {
    alert('📅 Comparação de Semanas\n\n' +
          '⚠️ Esta funcionalidade será implementada na Fase 24.\n\n' +
          'Recursos planejados:\n' +
          '- Selecionar até 4 semanas\n' +
          '- Comparação lado a lado\n' +
          '- Destaque de diferenças\n' +
          '- Gráficos comparativos');
  };

  // Função: Ver Top 5 Semanas
  const handleViewTop5 = () => {
    alert('📊 Top 5 Semanas com Mais Indisponíveis\n\n' +
          '⚠️ Esta funcionalidade será implementada em breve.\n\n' +
          'Mostrará:\n' +
          '- Ranking de semanas críticas\n' +
          '- Total de indisponíveis por semana\n' +
          '- Rotas mais afetadas\n' +
          '- Tendências de degradação');
  };

  // ============================================================================
  // FASE 9: TABELA EDITÁVEL - FUNÇÕES DE INPUT
  // ============================================================================

  /**
   * Função para manipular mudanças nos inputs da tabela
   * @param {string} psm - Nome do PSM (FIBRASOL, ISISTEL, ANGLOBAL)
   * @param {string} week - Semana (W1, W2, ..., W52)
   * @param {string} route - Nome completo da rota
   * @param {string} category - Categoria (Transporte, Indisponíveis, etc.)
   * @param {string} value - Novo valor digitado
   */
  const handleInputChange = (psm, week, route, category, value) => {
    if (!isValidNumericInput(value)) return;

    setData(prevData => {
      const result = calcularNovoEstadoFibras({
        prevData,
        psm, week, route, category,
        value,
        distribuicaoReparacoes,
        selectedQuarter,
        selectedYear,
        pendingRepairData,
        valorOriginal: valorOriginalRef.current,
        quarterConfig: QUARTER_CONFIG,
        buscarValorAnteriorFn: buscarValorAnterior,
      });

      if (result.shouldSkipNextSave) skipNextSaveRef.current = true;
      if (result.clearValorOriginal) valorOriginalRef.current = null;
      if (result.setValorOriginal !== null) valorOriginalRef.current = result.setValorOriginal;
      if (result.newDistribuicao) setDistribuicaoReparacoes(result.newDistribuicao);
      if (result.shouldClearDistribuicao && result.clearDistribuicaoArgs) {
        const { psm: p, week: w, route: r, selectedQuarter: q, selectedYear: y } = result.clearDistribuicaoArgs;
        limparDistribuicaoNoSupabase(p, w, r, q, y);
      }
      if (result.newPendingRepairData !== undefined) setPendingRepairData(result.newPendingRepairData);

      return result.newData;
    });
  };

  const aplicarReparacaoPorTipo = (tipoSelecionado) => {
    if (!pendingRepairData) return;
    
    const { psm, week, route, diferenca, tiposDisponiveis } = pendingRepairData;
    
    // Encontrar valor atual do tipo selecionado
    const tipoAtual = tiposDisponiveis.find(t => t.tipo === tipoSelecionado);
    if (!tipoAtual) return;
    
    const valorDisponivel = tipoAtual.valor;
    const descontoAplicado = Math.min(valorDisponivel, diferenca);
    const reparacoesRestantes = diferenca - descontoAplicado;
    
    // V5.10.16: Registrar distribuição APENAS na semana atual DO ANO SELECIONADO
    setDistribuicaoReparacoes(prevDist => {
      const updated = JSON.parse(JSON.stringify(prevDist));
      if (!updated[selectedYear]) updated[selectedYear] = {};
      if (!updated[selectedYear][psm]) updated[selectedYear][psm] = {};
      if (!updated[selectedYear][psm][week]) updated[selectedYear][psm][week] = {};
      if (!updated[selectedYear][psm][week][route]) updated[selectedYear][psm][week][route] = {};
      
      // Somar ao desconto já existente desta semana (distribuição sequencial)
      const atual = updated[selectedYear][psm][week][route][tipoSelecionado] || 0;
      updated[selectedYear][psm][week][route][tipoSelecionado] = atual + descontoAplicado;
      
      console.log(`✅ ${tipoSelecionado}: +${descontoAplicado} em ${week} (total: ${atual + descontoAplicado})`);
      
      return updated;
    });
    
    // Verificar se ainda há reparações restantes
    if (reparacoesRestantes > 0) {
      // Atualizar tipos disponíveis (remover tipos zerados)
      const tiposAtualizados = tiposDisponiveis
        .map(t => {
          if (t.tipo === tipoSelecionado) {
            return { ...t, valor: t.valor - descontoAplicado };
          }
          return t;
        })
        .filter(t => t.valor > 0);
      
      if (tiposAtualizados.length > 0) {
        // Atualizar pendingRepairData com reparações restantes
        setPendingRepairData({
          ...pendingRepairData,
          diferenca: reparacoesRestantes,
          tiposDisponiveis: tiposAtualizados
        });
        console.log(`⚠️ Restam ${reparacoesRestantes} reparações. Selecione outro tipo.`);
        // Modal permanece aberto
      } else {
        // Todos os tipos esgotados mas ainda sobram reparações
        console.log(`⚠️ Todos os tipos esgotados. Ainda restam ${reparacoesRestantes} reparações não distribuídas.`);
        setShowRepairTypeModal(false);
        setPendingRepairData(null);
        valorOriginalRef.current = null;
      }
    } else {
      // Todas as reparações foram distribuídas
      console.log('✅ Todas as reparações distribuídas!');
      setShowRepairTypeModal(false);
      setPendingRepairData(null);
      valorOriginalRef.current = null;
    }
  };

  const cancelarModal = () => {
    if (!pendingRepairData) return;
    
    const { psm, week, route, valorAnterior } = pendingRepairData;
    
    // Reverter Total Reparadas para o valor anterior
    setData(prevData => {
      const updatedData = JSON.parse(JSON.stringify(prevData));
      const currentData = updatedData[psm][week][route];
      
      currentData['Total Reparadas'] = valorAnterior.toString();
      
      console.log(`❌ Modal cancelado. Total Reparadas revertido para: ${valorAnterior}`);
      
      return updatedData;
    });
    
    setShowRepairTypeModal(false);
    setPendingRepairData(null);
    valorOriginalRef.current = null;
  };

  const handleBlurTotalReparadas = () => {
    // Abrir modal se houver dados pendentes e modal ainda não estiver aberto
    if (pendingRepairData && !showRepairTypeModal) {
      console.log('❓ Abrindo modal com dados:', {
        diferenca: pendingRepairData.diferenca,
        tiposDisponiveis: pendingRepairData.tiposDisponiveis,
        week: pendingRepairData.week
      });
      setShowRepairTypeModal(true);
    }
  };

  /**
   * Busca o último valor conhecido de um tipo em semanas anteriores DO MESMO TRIMESTRE
   * @param {string} psm - PSM
   * @param {string} week - Semana atual
   * @param {string} route - Rota
   * @param {string} tipo - Tipo de indisponibilidade
   * @returns {number} Último valor conhecido ou 0
   */
  const buscarValorAnterior = (psm, week, route, tipo) =>
    buscarValorAnteriorUtil(data, selectedQuarter, QUARTER_CONFIG, psm, week, route, tipo);

  /**
   * Função auxiliar para obter valor do estado 'data'
   * @param {string} psm - Nome do PSM
   * @param {string} week - Semana
   * @param {string} route - Nome da rota
   * @param {string} category - Categoria
   * @returns {string} Valor atual ou string vazia
   */
  const getInputValue = (psm, week, route, category) => {
    try {
      return data[psm]?.[week]?.[route]?.[category] || '';
    } catch (e) {
      return '';
    }
  };

  /**
   * V5.07.0: Obtém valor REDUZIDO para Dashboard Executivo
   * Calcula: Valor Original - Desconto ACUMULADO de todas as semanas até a atual
   */
  const getValorReduzido = (psm, week, route, tipo) =>
    getValorReduzidoUtil(data, distribuicaoReparacoes, selectedQuarter, selectedYear, QUARTER_CONFIG, psm, week, route, tipo);

  /**
   * V5.06.0: Obtém valor ORIGINAL para Cards Header
   * Retorna valor sem aplicar desconto de reparações
   */
  const getValorOriginal = (psm, week, route, tipo) =>
    getValorOriginalUtil(data, psm, week, route, tipo);

  // v3.40.71: USA headerCardsData (valores ORIGINAIS, exceto Total Reparadas)
  const summaryCards = [
    { 
      label: headerCardsData.transporteQ2.label,
      value: headerCardsData.transporteQ2.value,  // ORIGINAL
      bgColor: headerCardsData.transporteQ2.color, 
      icon: <TrendingUp className="w-3 h-3" /> 
    },
    { 
      label: headerCardsData.indisponiveis.label, 
      value: headerCardsData.indisponiveis.value,  // ORIGINAL (sem redução)
      bgColor: headerCardsData.indisponiveis.color, 
      icon: <XCircle className="w-3 h-3" /> 
    },
    { 
      label: headerCardsData.totalReparadas.label, 
      value: headerCardsData.totalReparadas.value,  // DINÂMICO ✅
      bgColor: headerCardsData.totalReparadas.color, 
      icon: <CheckCircle className="w-3 h-3" /> 
    },
    { 
      label: headerCardsData.reconhecidas.label, 
      value: headerCardsData.reconhecidas.value,  // ORIGINAL (sem redução)
      bgColor: headerCardsData.reconhecidas.color, 
      icon: <AlertTriangle className="w-3 h-3" /> 
    },
    { 
      label: headerCardsData.depPassagens.label, 
      value: headerCardsData.depPassagens.value,  // ORIGINAL (sem redução)
      bgColor: headerCardsData.depPassagens.color, 
      icon: <Users className="w-3 h-3" /> 
    },
    { 
      label: headerCardsData.depLicenca.label, 
      value: headerCardsData.depLicenca.value,  // ORIGINAL (sem redução)
      bgColor: headerCardsData.depLicenca.color, 
      icon: <Clock className="w-3 h-3" /> 
    },
    { 
      label: headerCardsData.depCutover.label, 
      value: headerCardsData.depCutover.value,  // ORIGINAL (sem redução)
      bgColor: headerCardsData.depCutover.color, 
      icon: <MapPin className="w-3 h-3" /> 
    },
    { 
      label: headerCardsData.fibrasDep.label,
      value: headerCardsData.fibrasDep.value,  // ORIGINAL (sem redução)
      bgColor: headerCardsData.fibrasDep.color, 
      icon: <TrendingUp className="w-3 h-3" /> 
    }
  ];


  // FASE 3: Função busca TODOS os dados da rota
  const handleRotaClick = (rota) => {

    // Buscar últimos valores de cada status do quadrimestre
    const quarterLimits = QUARTER_CONFIG[selectedQuarter];
    const stats = {};
    
    STATUS_CATEGORIES.forEach(status => {
      let key = status;
      if (status === "Fibras Dependentes") {
        key = 'Fibras dependentes da ' + selectedOperator;
      }
      
      let lastValue = 0;
      let lastWeek = null;
      
      // EXCEÇÃO: Total Reparadas deve ser ACUMULADO
      if (status === "Total Reparadas") {
        let acumulado = 0;
        
        // Somar todas as reparadas do quadrimestre
        for (let i = quarterLimits.start; i <= quarterLimits.end; i++) {
          const week = 'W' + i;
          const val = data[selectedOperator]?.[week]?.[rota]?.[key];
          if (val !== undefined && val > 0) {
            acumulado += parseInt(val) || 0;
            lastWeek = week; // Última semana com reparos
          }
        }
        
        lastValue = acumulado;
      } else {
        // Para outros status: buscar último valor não-zero do quadrimestre
        for (let i = quarterLimits.end; i >= quarterLimits.start; i--) {
          const week = 'W' + i;
          const val = data[selectedOperator]?.[week]?.[rota]?.[key];
          if (val !== undefined && val !== 0) {
            lastValue = val;
            lastWeek = week;
            break;
          }
        }
      }
      
      stats[status] = { value: lastValue, week: lastWeek };
    });
    
    // Buscar justificativa (chave: PSM_Rota) FILTRADA POR QUARTER
    const justKey = selectedOperator + '_' + rota;
    const rawJust = justificativas[justKey];
    
    // IMPORTANTE: Só usar a justificativa se for do quarter selecionado
    const just = (rawJust && rawJust.quarter === selectedQuarter) ? rawJust : null;

    console.log('📝 Justificativa (filtrada por quarter):', just);

    setSelectedRota({ name: rota, stats, justification: just });
    setShowModal(true);
  };

  // ============================================================================
  // FUNÇÃO DE DRILL-DOWN: Detalhamento por Status
  // ============================================================================
  
  const handleStatusClick = (statusLabel) => {

    const quarterLimits = QUARTER_CONFIG[selectedQuarter];
    const routesDetail = [];
    
    // ✅ MAPEAMENTO CORRETO: Label do card → Chave nos dados
    const labelToKeyMap = {
      // Labels dos cards (podem variar)
      'Indisponíveis': 'Indisponíveis',
      'Total Reparadas': 'Total Reparadas',
      'Reconhecidas': 'Reconhecidas',
      'Dep. Passagens': 'Dep. de Passagem de Cabo',
      'Dep. Licença': 'Dep. de Licença',
      'Dep. Cutover': 'Dep. de Cutover',
      'Fibras Dependentes': `Fibras dependentes da ${selectedOperator}`,
      // Transporte pode ter ano no label
      [`Transporte ${selectedQuarter} (${selectedYear})`]: 'Transporte',
      'Transporte': 'Transporte'
    };
    
    // Verificar se o label contém "Transporte" (pode ter ano)
    let key = labelToKeyMap[statusLabel];
    if (!key && statusLabel.includes('Transporte')) {
      key = 'Transporte';
    }
    
    // Se ainda não encontrou, tentar buscar por "Fibras Dep."
    if (!key && statusLabel.includes('Fibras Dep.')) {
      key = `Fibras dependentes da ${selectedOperator}`;
    }
    
    // Fallback: usar o próprio label
    if (!key) {
      key = statusLabel;
    }
    
    console.log('🔍 handleStatusClick:', { statusLabel, key, selectedOperator });
    
    // Iterar sobre todas as rotas do PSM
    ROUTES_BY_PSM[selectedOperator].forEach(route => {
      // Buscar último valor não-zero do status para esta rota
      let lastValue = 0;
      let lastWeek = null;
      
      // Para Total Reparadas: acumular
      if (key === 'Total Reparadas') {
        for (let i = quarterLimits.start; i <= quarterLimits.end; i++) {
          const week = 'W' + i;
          const val = data[selectedOperator]?.[week]?.[route]?.[key];
          if (val !== undefined && val > 0) {
            lastValue += parseInt(val) || 0;
            lastWeek = week;
          }
        }
      } else {
        // Para outros: buscar último valor não-zero
        for (let i = quarterLimits.end; i >= quarterLimits.start; i--) {
          const week = 'W' + i;
          const val = data[selectedOperator]?.[week]?.[route]?.[key];
          if (val !== undefined && val !== 0) {
            lastValue = parseInt(val) || 0;
            lastWeek = week;
            break;
          }
        }
      }
      
      // Se encontrou valor, adicionar à lista
      if (lastValue > 0) {
        routesDetail.push({
          rota: route,
          valor: lastValue,
          semana: lastWeek
        });
      }
    });
    
    // Ordenar por valor (decrescente)
    routesDetail.sort((a, b) => b.valor - a.valor);
    
    // Calcular total
    const total = routesDetail.reduce((sum, r) => sum + r.valor, 0);

    console.log('✅ Resultado:', { total, rotas: routesDetail.length });

    setSelectedStatusDrilldown({
      label: statusLabel,
      total: total,
      rotas: routesDetail
    });
    setCurrentPageDrilldown(0); // Reset para primeira página
    setShowStatusDrilldown(true);
  };

  // ============================================================================



  // Dependencies: recalcula quando qualquer um desses valores mudar

  // Extrair arrays para os gráficos
  const rotasDegradadasData = classificacaoRotas.degradadas;
  const rotasComGanhoData = classificacaoRotas.comGanho;
  const rotasEstaveisData = classificacaoRotas.estaveis;

  // ============================================================================
  // FUNÇÕES AUXILIARES PARA GRÁFICOS (conforme documentação original)
  // ============================================================================

  /**
   * Preparar dados para o gráfico de barras
   * Busca valores de cada status da semana mais recente
   */
  const prepareChartData = (routesList) => {
    return routesList.map(routeInfo => {
      const rotaData = { name: routeInfo.rota };
      
      // Adicionar cada status ao objeto
      const statusCategorias = [
        'Transporte',
        'Indisponíveis',
        'Total Reparadas',
        'Reconhecidas',
        'Dep. de Passagem de Cabo',
        'Dep. de Licença',
        'Dep. de Cutover',
        `Fibras dependentes da ${selectedOperator}`
      ];

      statusCategorias.forEach(status => {
        // Buscar semana mais recente com dados
        let mostRecentWeek = null;
        const weekNum = parseInt(selectedWeek.substring(1));
        
        for (let i = weekNum; i >= 1; i--) {
          const checkWeek = 'W' + i;
          const weekData = data[selectedOperator]?.[checkWeek]?.[routeInfo.rota] || {};
          
          if ((weekData[status] || 0) > 0) {
            mostRecentWeek = checkWeek;
            break;
          }
        }
        
        // Pegar valor ou zero
        if (mostRecentWeek) {
          const weekData = data[selectedOperator]?.[mostRecentWeek]?.[routeInfo.rota] || {};
          rotaData[status] = weekData[status] || 0;
        } else {
          rotaData[status] = 0;
        }
      });
      
      return rotaData;
    });
  };

  /**
   * Calcular altura do eixo X baseado no tamanho dos nomes
   */
  const getXAxisHeight = (routesList) => {
    if (routesList.length === 0) return 75;
    
    const maxLength = Math.max(...routesList.map(r => r.rota.length));
    return Math.max(80, 80 + Math.floor((maxLength - 20) / 4) * 8);
  };

  /**
   * Calcular margem inferior
   */
  const getBottomMargin = (routesList) => {
    if (routesList.length === 0) return 90;
    
    const maxLength = Math.max(...routesList.map(r => r.rota.length));
    return Math.max(100, 100 + Math.floor((maxLength - 20) / 5) * 10);
  };

  /**
   * Calcular altura do gráfico
   */
  const getChartHeight = (routesList) => {
    const baseHeight = 400;
    const additionalHeight = Math.max(0, (routesList.length - 8) * 15);
    return baseHeight + additionalHeight;
  };

  /**
   * Tick customizado do eixo X
   * Mostra nome em verde/negrito se foi reparada na semana atual
   */
  const CustomXAxisTick = ({ x, y, payload }) => {
    const allRoutes = classificacaoRotas.degradadas.concat(
      classificacaoRotas.comGanho,
      classificacaoRotas.estaveis
    );
    const routeInfo = allRoutes.find(r => r.rota === payload.value);
    const isRepaired = routeInfo?.isRepaired || false;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={18}
          textAnchor="end"
          fill={isRepaired ? "#00A000" : "#666"}
          fontWeight={isRepaired ? "bold" : "normal"}
          fontSize={10}
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  };

  // Mapa de cores para os status - CORES EXATAS DO DASHBOARD EXECUTIVO
  const colorMap = {
    "Transporte": "#475569",              // Cinza escuro (slate-600)
    "Indisponíveis": "#EF4444",           // Vermelho (red-500)
    "Total Reparadas": "#22C55E",         // Verde (green-500)
    "Reconhecidas": "#06B6D4",            // Ciano/Azul claro (cyan-500)
    "Dep. de Passagem de Cabo": "#3B82F6", // Azul (blue-500)
    "Dep. de Licença": "#F97316",         // Laranja (orange-500)
    "Dep. de Cutover": "#A855F7",         // Roxo (purple-500)
    [`Fibras dependentes da ${selectedOperator}`]: "#64748B"  // Cinza médio (slate-500)
  };

  // ============================================================================
  // FASE 16: GRÁFICOS DE TENDÊNCIAS DINÂMICOS COM useMemo


  // ============================================================================

  // FASE 16: trendData agora é dinâmico (calculado via useMemo acima)

  // Dados para a Tabela de Introdução Manual
  const manualDataRows = [
    { rota: 'Alto Dondo - Quiela', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'Ambriz - N\'zeto', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'BSC Malange - Cazenga', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'Calunga - Mussureda', transporte: '', indisponiveis: 6, totalReparadas: 6, reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: 6 },
    { rota: 'Camalamba - Lucala', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'Caxambua - Vila Matibie', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'Guango - Cafurifo', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'Guango - Camipala', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'Cuimba - Ngunhi', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'Damião - Uíge(Negage-CTR)', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' },
    { rota: 'Hospital - Lumbo', transporte: '', indisponiveis: '', totalReparadas: '', reconhecidas: '', depPassagem: '', depLicenca: '', depCutover: '', fibrasDep: '' }
  ];

  // FASE 15: Arrays de classificação agora são dinâmicos (calculados via useMemo acima)
  // rotasDegradadasData, rotasComGanhoData, rotasEstaveisData

  // NOVO: Dados para Tabela de Acompanhamento Transporte vs Degradação (Página 4 do PDF)
  // Combina dados mock com justificativas importadas
  
  // Função para calcular o trimestre anterior
  const getQuarterAnterior = (currentQuarter, currentYear) => {
    const quarterMap = {
      'Q1': { quarter: 'Q3', yearOffset: -1 },
      'Q2': { quarter: 'Q1', yearOffset: 0 },
      'Q3': { quarter: 'Q2', yearOffset: 0 }
    };
    
    const result = quarterMap[currentQuarter];
    if (!result) return { quarter: 'Q1', year: currentYear, label: 'Q1' };
    
    const year = currentYear + result.yearOffset;
    
    // Formatar label: se ano diferente, mostrar ano
    let label = result.quarter;
    if (result.yearOffset !== 0) {
      label = `${result.quarter} ${year}`;
    }
    
    return { quarter: result.quarter, year, label };
  };
  
  const quarterAnterior = getQuarterAnterior(selectedQuarter, selectedYear);
  

  // Paginação do Acompanhamento
  const totalPagesAcomp = Math.ceil(acompanhamentoData.length / itemsPerPageAcomp);
  const startIndexAcomp = currentPageAcomp * itemsPerPageAcomp;
  const endIndexAcomp = startIndexAcomp + itemsPerPageAcomp;
  const currentDataAcomp = acompanhamentoData.slice(startIndexAcomp, endIndexAcomp);

  const goToNextPageAcomp = () => {
    if (currentPageAcomp < totalPagesAcomp - 1) {
      setCurrentPageAcomp(currentPageAcomp + 1);
    }
  };

  const goToPrevPageAcomp = () => {
    if (currentPageAcomp > 0) {
      setCurrentPageAcomp(currentPageAcomp - 1);
    }
  };

  // Paginação das Rotas Normalizadas
  const totalPagesNormalizadas = Math.ceil(rotasNormalizadas.length / itemsPerPageNormalizadas);
  const startIndexNormalizadas = currentPageNormalizadas * itemsPerPageNormalizadas;
  const endIndexNormalizadas = startIndexNormalizadas + itemsPerPageNormalizadas;
  const currentDataNormalizadas = rotasNormalizadas.slice(startIndexNormalizadas, endIndexNormalizadas);

  const goToNextPageNormalizadas = () => {
    if (currentPageNormalizadas < totalPagesNormalizadas - 1) {
      setCurrentPageNormalizadas(currentPageNormalizadas + 1);
    }
  };

  const goToPrevPageNormalizadas = () => {
    if (currentPageNormalizadas > 0) {
      setCurrentPageNormalizadas(currentPageNormalizadas - 1);
    }
  };
  
  // v3.20.1: Funções de navegação para Intervenções Recentes
  const goToNextPageIntervencoes = () => {
    const totalPagesIntervencoes = Math.ceil(intervencoesRecentes.length / itemsPerPageIntervencoes);
    if (currentPageIntervencoes < totalPagesIntervencoes - 1) {
      setCurrentPageIntervencoes(currentPageIntervencoes + 1);
    }
  };

  const goToPrevPageIntervencoes = () => {
    if (currentPageIntervencoes > 0) {
      setCurrentPageIntervencoes(currentPageIntervencoes - 1);
    }
  };
  
  // v3.40.66: Funções de navegação para Rotas Sem Intervenção
  const goToNextPageSemIntervencao = () => {
    const totalPagesSemIntervencao = Math.ceil(rotasSemIntervencao.length / itemsPerPageSemIntervencao);
    if (currentPageSemIntervencao < totalPagesSemIntervencao - 1) {
      setCurrentPageSemIntervencao(currentPageSemIntervencao + 1);
    }
  };

  const goToPrevPageSemIntervencao = () => {
    if (currentPageSemIntervencao > 0) {
      setCurrentPageSemIntervencao(currentPageSemIntervencao - 1);
    }
  };

  // Reset página ao mudar PSM ou Quarter
  useEffect(() => {
    setCurrentPageAcomp(0);
    setCurrentPageNormalizadas(0);
    setCurrentPageIntervencoes(0); // v3.20.1
    setCurrentPageSemIntervencao(0); // v3.40.66
  }, [selectedOperator, selectedQuarter]);

  // Função para criar o path do setor do gráfico de pizza
  const createPieSlice = (startAngle, endAngle, radius = 100, innerRadius = 0) => {
    const start = polarToCartesian(120, 120, radius, endAngle);
    const end = polarToCartesian(120, 120, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    if (innerRadius === 0) {
      return [
        'M', 120, 120,
        'L', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        'Z'
      ].join(' ');
    }
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  // Mapeamento de cores por categoria
  const categoryColors = {
    transporte: '#1e293b',
    indisponiveis: '#ef4444',
    totalReparadas: '#22c55e',
    depPassagem: '#3b82f6',
    depLicenca: '#f97316',
    depCutover: '#a855f7',
    fibrasDep: '#64748b'
  };

  // ============================================================================
  // DEBUG: Informações da Estrutura de Dados (Fases 7-14)
  // ============================================================================

  console.log('📊 Total PSMs:', Object.keys(ROUTES_BY_PSM).length);

  console.log('📊 Total Rotas:', Object.values(ROUTES_BY_PSM).reduce((acc, r) => acc + r.length, 0));

  console.log('💾 Estado `data` keys:', Object.keys(data));

  console.log('📝 Justificativas:', Object.keys(justificativas).length, 'registros');

  console.log('🔍 TESTE: Abra console (F12) e clique em uma rota do Top 5');

  console.log('✓ Lógica bidirecional (↑↓): ATIVO');

  console.log('✓ Acumulado progressivo (reparadasGlobal): ATIVO');

  // ===============================
  // ===============================
  // MODO APRESENTAÇÃO - CONFIGURAÇÃO DE VISIBILIDADE
  // ===============================
  
  // Configuração dos slides - define quais seções aparecem em cada slide
  const slideConfig = {
    0: ["cards", "summary"],                          // Slide 0: Dashboard Executivo
    1: ["performance"],                               // Slide 1: Performance das Rotas
    2: ["comparative"],                               // Slide 2: Análise Comparativa
    3: ["classification"],                            // Slide 3: Gráficos por Classificação
    4: ["tracking"],                                  // Slide 4: Acompanhamento
    5: ["manual"],                                    // Slide 5: Introdução Manual
    6: ["tests"]                                      // Slide 6: Testes (opcional)
  };
  
  // Função que controla visibilidade das seções (não usada mais)
  const isVisible = (section) => {
    if (!presentationMode) return true;
    return slideConfig[currentSlide]?.includes(section);
  };

  // ===============================================
  // MODO APRESENTAÇÃO - TELA CHEIA
  // ===============================================
  if (presentationMode) {
    return (
      <PresentationMode
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        setPresentationMode={setPresentationMode}
        selectedOperator={selectedOperator}
        selectedProvince={selectedProvince}
        selectedQuarter={selectedQuarter}
        selectedWeek={selectedWeek}
        selectedYear={selectedYear}
        executiveDashboard={executiveDashboard}
        efetividadeMode={efetividadeMode}
        setEfetividadeMode={setEfetividadeMode}
        efetividadeGlobalMedia={efetividadeGlobalMedia}
        efetividadePSMMedia={efetividadePSMMedia}
        distribuicaoReparacoes={distribuicaoReparacoes}
        summaryCards={summaryCards}
        quarterWeeks={quarterWeeks}
        showStatusDrilldown={showStatusDrilldown}
        setShowStatusDrilldown={setShowStatusDrilldown}
        selectedStatusDrilldown={selectedStatusDrilldown}
        currentPageDrilldown={currentPageDrilldown}
        setCurrentPageDrilldown={setCurrentPageDrilldown}
        itemsPerPageDrilldown={itemsPerPageDrilldown}
        data={data}
        handleStatusClick={handleStatusClick}
      />
    );
  }

  // ===============================================
  // MODO NORMAL - APP ORIGINAL
  // ===============================================
  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      
      {/* v3.49.24: CSS para animações */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    
       
      {/* v3.49.24: Banner de Aviso Mobile */}
      {isMobileDevice && showMobileWarning && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xl animate-slideDown">
          <div className="px-4 py-3 flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold mb-1 flex items-center">
                  <span className="mr-2">📱</span>
                  Dispositivo Móvel Detectado
                </p>
                <p className="text-xs leading-relaxed opacity-90">
                  Para melhor experiência, recomendamos usar um <strong>computador desktop</strong>. 
                  Algumas funcionalidades podem ter visualização limitada em dispositivos móveis.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMobileWarning(false)}
              className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-colors active:scale-95"
              title="Dispensar aviso"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {showModal && selectedRota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{zIndex: 9999}} onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-3 flex justify-between items-center rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold">Detalhes da Rota</h2>
                <p className="text-sm mt-0.5">{selectedRota.name}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-3xl leading-none hover:bg-white/20 px-3 py-1 rounded">×</button>
            </div>
            
            <div className="p-5">
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 mb-4 border-2 border-orange-200">
                <p className="text-sm font-bold text-orange-900">
                  PSM: {selectedOperator} | {selectedQuarter} ({selectedYear}) - Últimos valores registrados
                </p>
              </div>
              
              <div className="grid grid-cols-8 gap-2 mb-4">
                {[
                  {
                    status:'Transporte', 
                    label: (() => {
                      if (selectedQuarter === 'Q1') {
                        return `Transporte Q3 (${parseInt(selectedYear) - 1})`;
                      } else if (selectedQuarter === 'Q2') {
                        return `Transporte Q1`;
                      } else if (selectedQuarter === 'Q3') {
                        return `Transporte Q2`;
                      }
                      return `Transporte Q1`;
                    })(), 
                    bg:'from-slate-700 to-slate-900', 
                    icon:'🔄'
                  },
                  {status:'Indisponíveis', label:'Indisponíveis', bg:'from-red-500 to-red-600', icon:'🚫'},
                  {status:'Total Reparadas', label:'Total Reparadas', bg:'from-green-500 to-green-600', icon:'✅', highlight: true},
                  {status:'Reconhecidas', label:'Reconhecidas', bg:'from-teal-500 to-teal-600', icon:'🤝'},
                  {status:'Dep. de Passagem de Cabo', label:'Dep. Passagem', bg:'from-blue-500 to-blue-600', icon:'🧵'},
                  {status:'Dep. de Licença', label:'Dep. Licença', bg:'from-orange-500 to-orange-600', icon:'📄'},
                  {status:'Dep. de Cutover', label:'Dep. Cutover', bg:'from-purple-500 to-purple-600', icon:'✂️'},
                  {status:'Fibras Dependentes', label:`Fibras Dep. ${selectedOperator}`, bg:'from-slate-600 to-slate-700', icon:'⏳'}
                ].map((item, idx) => {
                  const st = selectedRota.stats[item.status] || {value: 0, week: null};
                  const isReparadas = item.highlight;
                  return (
                    <div key={idx} className={`bg-gradient-to-br ${item.bg} rounded-lg p-2 text-white shadow-md ${isReparadas ? 'ring-2 ring-green-300 ring-offset-2' : ''}`}>
                      <div className="flex flex-col items-center text-center mb-1">
                        <span className="text-sm mb-0.5">{item.icon}</span>
                        <p className="text-[11px] font-semibold leading-tight">{item.label}</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${isReparadas ? 'text-green-100' : ''}`}>{st.value}</p>
                        {st.week && <p className="text-[7px] opacity-80 mt-0.5">{st.week}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {selectedRota.justification ? (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-400">
                  <h4 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    📝 Justificativa de Degradação
                  </h4>
                  <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200 shadow-sm">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedRota.justification.justificativa || 'Sem texto'}
                    </p>
                  </div>
                  <div className="grid grid-cols-5 gap-2.5">
                    {selectedRota.justification.regiao && (
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-[9px] text-gray-600 font-semibold mb-0.5">Região</p>
                        <p className="text-xs font-bold text-gray-900">{selectedRota.justification.regiao}</p>
                      </div>
                    )}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded p-2 border border-gray-200">
                      <p className="text-[9px] text-gray-600 font-semibold mb-0.5">
                        {selectedQuarter === 'Q1' 
                          ? `Transporte Q3 (${parseInt(selectedYear) - 1})`
                          : selectedQuarter === 'Q2' 
                            ? 'Transporte Q1'
                            : 'Transporte Q2'
                        }
                      </p>
                      <p className="text-base font-bold text-gray-900">
                        {selectedRota.justification.transporteQ2 || selectedRota.justification.transporte || 0}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded p-2 border border-red-200">
                      <p className="text-[9px] text-red-700 font-semibold mb-0.5">Indisponíveis</p>
                      <p className="text-base font-bold text-red-700">{selectedRota.justification.indisponiveis || 0}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-2 border border-green-200 ring-2 ring-green-300">
                      <p className="text-[9px] text-green-700 font-semibold mb-0.5">✅ Reparadas</p>
                      <p className="text-base font-bold text-green-700">{selectedRota.stats['Total Reparadas']?.value || 0}</p>
                    </div>
                    <div className={`bg-gradient-to-br rounded p-2 border ${
                      (selectedRota.justification.delta || 0) > 0 ? 'from-red-50 to-red-100 border-red-200' :
                      (selectedRota.justification.delta || 0) < 0 ? 'from-green-50 to-green-100 border-green-200' :
                      'from-gray-50 to-gray-100 border-gray-200'
                    }`}>
                      <p className={`text-[9px] font-semibold mb-0.5 ${
                        (selectedRota.justification.delta || 0) > 0 ? 'text-red-700' :
                        (selectedRota.justification.delta || 0) < 0 ? 'text-green-700' : 'text-gray-600'
                      }`}>Delta Δ</p>
                      <p className={`text-base font-bold ${
                        (selectedRota.justification.delta || 0) > 0 ? 'text-red-700' :
                        (selectedRota.justification.delta || 0) < 0 ? 'text-green-700' : 'text-gray-900'
                      }`}>
                        {(selectedRota.justification.delta || 0) > 0 ? '+' : ''}{selectedRota.justification.delta || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-dashed border-blue-300 text-center">
                  <p className="text-base text-blue-800 font-medium">
                    ℹ️ Nenhuma justificativa registrada para esta rota no trimestre {selectedQuarter}
                  </p>
                </div>
              )}
              
            </div>
          </div>
        </div>
      )}
      
      {/* MODAL DE DRILL-DOWN: Detalhamento por Status - COM CARROSSEL */}
      <StatusDrilldown
        showStatusDrilldown={showStatusDrilldown}
        setShowStatusDrilldown={setShowStatusDrilldown}
        selectedStatusDrilldown={selectedStatusDrilldown}
        selectedOperator={selectedOperator}
        selectedQuarter={selectedQuarter}
        currentPageDrilldown={currentPageDrilldown}
        setCurrentPageDrilldown={setCurrentPageDrilldown}
        itemsPerPageDrilldown={itemsPerPageDrilldown}
        data={data}
        handleRotaClick={handleRotaClick}
      />
      {/* Menu Lateral */}
      <div className={`${menuOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}>
        <div className="p-4">
          <nav className="space-y-1">
            <button 
              onClick={() => setPresentationMode(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors border-2 border-purple-700"
            >
              <span className="text-lg">📽️</span>
              <span className="text-sm font-bold">Modo Apresentação</span>
            </button>
            <button 
              onClick={handleDownloadCSV}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors border-2 border-blue-500"
            >
              <Download className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">💾 Salvar Dados PSM (CSV)</span>
            </button>
            <button 
              onClick={handleImportData}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span className="text-sm font-medium">Importar Dados PSM</span>
            </button>
            <label className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 rounded-lg transition-colors cursor-pointer border-2 border-yellow-500">
              <DownloadCloud className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">📥 Importar Justificativas</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv,.xlsx,.xls" 
                onChange={handleUploadJustificativas} 
              />
            </label>
            <button 
              onClick={handleExportJSON}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileJson className="w-5 h-5" />
              <span className="text-sm font-medium">JSON Backup</span>
            </button>
            <button 
              onClick={handleDownloadCSV}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium">Baixar Dados CSV</span>
            </button>
            <button 
              onClick={handleExportJustificativasCSV}
              className="w-full flex items-center space-x-3 px-4 py-3 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              <span className="text-sm font-medium">Exportar Justificativas</span>
            </button>
            <div className="py-2">
              <div className="border-t border-gray-200"></div>
              <p className="text-xs font-semibold text-gray-400 mt-3 mb-2 px-4">RECURSOS FUTUROS</p>
            </div>
            <button 
              disabled
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed opacity-60"
              title="Funcionalidade em desenvolvimento - Fase futura"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Selecionar Semanas</span>
            </button>
            <div className="py-2">
              <div className="border-t border-gray-200"></div>
              <p className="text-xs font-semibold text-gray-400 mt-3 mb-2 px-4">RECURSOS FUTUROS</p>
            </div>
            <button 
              disabled
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed opacity-60"
              title="Funcionalidade em desenvolvimento - Fase futura"
            >
              <BarChart className="w-5 h-5" />
              <span className="text-sm font-medium">Ver Top 5 Semanas</span>
            </button>
            
            {/* v3.40.82: Novos recursos futuros */}
            <button 
              disabled
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed opacity-60"
              title="Funcionalidade em desenvolvimento - Transferir responsabilidade entre PSMs"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span className="text-sm font-medium">Transferir Responsabilidade</span>
            </button>
            
            <button 
              disabled
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed opacity-60"
              title="Funcionalidade em desenvolvimento - Projeção de custos de manutenção"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Previsão de Custos</span>
            </button>
            
            <div className="py-2">
              <div className="border-t border-gray-200"></div>
              <p className="text-xs font-semibold text-gray-500 mt-3 mb-2 px-4">DEBUG</p>
            </div>
            <button 
              onClick={handleViewState}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Ver Estado (Console)</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        
        {/* HEADER + FILTROS UNIFICADOS - STICKY COM TRANSIÇÃO */}
        <div 
          className={`sticky z-50 bg-white shadow-md transition-all duration-300 ${
            headerVisible ? 'translate-y-0' : '-translate-y-[60px]'
          }`}
          style={{ top: (isMobileDevice && showMobileWarning) ? '72px' : '0' }}
        >
          {/* Header */}
          <div className="border-b border-gray-200 px-5 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Botão Hamburguer para Menu */}
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={menuOpen ? "Fechar menu" : "Abrir menu"}
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Performance Clean Up Advanced</h1>
                  <p className="text-xs text-gray-500">v5.02.0 - Sem Semana Rep! 🎨✨</p>
                </div>
              </div>
              {/* Indicador de Salvamento */}
              <SaveStatus saveStatus={saveStatus} lastSaveTime={lastSaveTime} />
            </div>
          </div>

          {/* FILTROS E CARDS DE RESUMO */}
          <div className="border-b border-gray-200 px-5 py-2.5">
          <div className="flex items-center justify-between mb-4">
            {/* Filtros */}
            <div className="flex items-center space-x-3">
              <select value={selectedOperator} onChange={(e) => setSelectedOperator(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="FIBRASOL">FIBRASOL</option>
                <option value="ISISTEL">ISISTEL</option>
                <option value="ANGLOBAL">ANGLOBAL</option>
              </select>
              
              {/* FILTRO DE PROVÍNCIA - Texto simples */}
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Todas">Todas as Províncias</option>
                {OPERATOR_TO_PROVINCES[selectedOperator].map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
              
              <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                {getWeeksForQuarter(selectedQuarter).map(week => (
                  <option key={week} value={week}>{week}</option>
                ))}
              </select>
              <select value={selectedQuarter} onChange={(e) => setSelectedQuarter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="Q3">Q3</option>
                <option value="Q2">Q2</option>
                <option value="Q1">Q1</option>
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="2030">2030</option>
                <option value="2029">2029</option>
                <option value="2028">2028</option>
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            
            {/* v3.49.29: BOTÃO TESTES E ANÁLISES MODERNIZADO */}
            <button
              onClick={() => setShowTestesAnalises(!showTestesAnalises)}
              className={`group relative px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                showTestesAnalises
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-blue-600 border-2 border-blue-300 hover:border-blue-500 hover:shadow-md hover:scale-105'
              }`}
              title={showTestesAnalises ? "Fechar Testes e Análises" : "Abrir Testes e Análises"}
            >
              {/* Ícone com animação */}
              <div className={`transition-transform duration-200 ${showTestesAnalises ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              {/* Texto */}
              <span className="whitespace-nowrap">Testes e Análises</span>
              
              {/* Badge indicador quando aberto */}
              {showTestesAnalises && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>
              )}
              
              {/* Ícone de chevron quando fechado */}
              {!showTestesAnalises && (
                <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
            
            {/* v3.40.27: SINO DE ALERTAS */}
            <div className="relative">
              <button
                onClick={() => setAlertasAbertos(!alertasAbertos)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={`${alertas.filter(a => !alertasLidos.includes(a.id)).length} alertas`}
              >
                {/* Ícone do sino */}
                <svg 
                  className="w-6 h-6 text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
                
                {/* Badge com contador (apenas não lidos) */}
                {alertas.filter(a => !alertasLidos.includes(a.id)).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {alertas.filter(a => !alertasLidos.includes(a.id)).length}
                  </span>
                )}
              </button>
              
              {/* Dropdown de alertas */}
              {alertasAbertos && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">
                        🔔 Alertas ({alertas.filter(a => !alertasLidos.includes(a.id)).length} não lidos)
                      </h3>
                      <button
                        onClick={() => {
                          setAlertasLidos(alertas.map(a => a.id));
                          setAlertasAbertos(false);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Marcar todos como lidos
                      </button>
                    </div>
                  </div>
                  
                  {/* Lista de alertas */}
                  <div className="overflow-y-auto flex-1">
                    {alertas.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        ✅ Nenhum alerta no momento
                      </div>
                    ) : (
                      alertas.map((alerta, idx) => {
                        const isLido = alertasLidos.includes(alerta.id);
                        
                        return (
                          <div
                            key={alerta.id}
                            className={`px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                              !isLido ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Ícone condicional baseado no tipo */}
                              <div className="flex-shrink-0 mt-0.5">
                                {alerta.tipo === 'indisponivel-sem-explicacao' ? (
                                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              
                              {/* Conteúdo */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-xs font-semibold uppercase ${
                                    alerta.tipo === 'indisponivel-sem-explicacao' ? 'text-amber-600' : 'text-blue-600'
                                  }`}>
                                    {alerta.tipo === 'indisponivel-sem-explicacao' 
                                      ? 'Indisp. com Cálculo Inconsistente' 
                                      : 'Inconsistência de Dados'}
                                  </span>
                                  {!isLido && (
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                      alerta.tipo === 'indisponivel-sem-explicacao' ? 'bg-amber-500' : 'bg-blue-500'
                                    }`}></span>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-gray-800 mb-1">
                                  {alerta.rota}
                                </p>
                                
                                {/* Conteúdo específico por tipo */}
                                {alerta.tipo === 'indisponivel-sem-explicacao' ? (
                                  <>
                                    <p className="text-xs text-gray-600 mb-2">
                                      Indisponíveis ({alerta.indisponiveis}) ≠ Soma Justificativas ({alerta.somaJustificativas}) em {alerta.semanaDeteccao}
                                    </p>
                                    <div className="text-xs text-gray-500 mb-2 space-y-0.5">
                                      {alerta.detalhes.reconhecidas > 0 && (
                                        <div>• Reconhecidas: {alerta.detalhes.reconhecidas}</div>
                                      )}
                                      {alerta.detalhes.depPassagem > 0 && (
                                        <div>• Dep. Passagem: {alerta.detalhes.depPassagem}</div>
                                      )}
                                      {alerta.detalhes.depLicenca > 0 && (
                                        <div>• Dep. Licença: {alerta.detalhes.depLicenca}</div>
                                      )}
                                      {alerta.detalhes.depCutover > 0 && (
                                        <div>• Dep. Cutover: {alerta.detalhes.depCutover}</div>
                                      )}
                                      {alerta.detalhes.fibrasDependentes > 0 && (
                                        <div>
                                          • Fibras Dependentes: {alerta.detalhes.fibrasDependentes}
                                          {alerta.detalhes.totalReparadas > 0 && (
                                            <span className="text-blue-600 ml-1">
                                              (atual: {alerta.detalhes.fibrasDependentesAtual} + reparadas: {alerta.detalhes.totalReparadas})
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className={`text-xs font-medium ${
                                        alerta.diferenca > 0 ? 'text-red-600' : 'text-amber-600'
                                      }`}>
                                        {alerta.provincia} • {alerta.diferenca > 0 ? 'Faltam' : 'Sobram'} {Math.abs(alerta.diferenca)} fibra(s)
                                      </span>
                                      <button
                                        onClick={() => {
                                          if (!isLido) {
                                            setAlertasLidos([...alertasLidos, alerta.id]);
                                          }
                                        }}
                                        className="text-xs text-amber-600 hover:text-amber-800"
                                      >
                                        {isLido ? '✓ Lido' : 'Marcar como lido'}
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p className="text-xs text-gray-600 mb-2">
                                      Reparadas Acumulado ({alerta.reparadasAcumulado}) {'>'} Indisponíveis ({alerta.indisponiveis}) em {alerta.semanaDeteccao}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">
                                        {alerta.provincia} • Diferença: +{alerta.diferenca}
                                      </span>
                                      <button
                                        onClick={() => {
                                          if (!isLido) {
                                            setAlertasLidos([...alertasLidos, alerta.id]);
                                          }
                                        }}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                      >
                                        {isLido ? '✓ Lido' : 'Marcar como lido'}
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  {/* Footer */}
                  {alertas.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
                      <p className="text-xs text-gray-600">
                        Total: {alertas.length} alerta{alertas.length !== 1 ? 's' : ''} detectado{alertas.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cards de Resumo Superiores - COMPACTOS EM UMA LINHA (8 cards) */}
          {isVisible("cards") && (
          <div className="grid grid-cols-8 gap-2">
            {summaryCards.map((card, index) => (
              <div 
                key={index} 
                className={`${card.bgColor} text-white rounded-lg p-2 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200`}
                onClick={() => handleStatusClick(card.label)}
                title={`Clique para ver detalhes de ${card.label}`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-medium opacity-90 leading-tight">{card.label}</span>
                  <div className="w-3 h-3">{card.icon}</div>
                </div>
                <div className="flex items-end space-x-1">
                  <span className="text-xl font-bold leading-none">{card.value}</span>
                  {card.total && <span className="text-[10px] opacity-75 mb-0.5">de {card.total}</span>}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
        </div> {/* Fim do div HEADER + FILTROS UNIFICADOS */}

        {/* v3.42.00: PAINEL TESTES E ANÁLISES */}
        <TestesAnalises
          showTestesAnalises={showTestesAnalises}
          setShowTestesAnalises={setShowTestesAnalises}
          selectedOperator={selectedOperator}
          selectedQuarter={selectedQuarter}
          selectedYear={selectedYear}
          selectedWeek={selectedWeek}
          testesData={testesData}
          todosTestesData={todosTestesData}
          rotasTestadas={rotasTestadas}
          setRotasTestadas={setRotasTestadas}
          rotasValidadas={rotasValidadas}
          setRotasValidadas={setRotasValidadas}
          tabelaValidacaoAberta={tabelaValidacaoAberta}
          setTabelaValidacaoAberta={setTabelaValidacaoAberta}
          isRotaTestada={isRotaTestada}
          isRotaValidada={isRotaValidada}
          getSemanasTestadasNoQuarter={getSemanasTestadasNoQuarter}
          getSemanasValidadasNoQuarter={getSemanasValidadasNoQuarter}
          isRotaValidadaNoQuarter={isRotaValidadaNoQuarter}
          isRotaTestadaNoQuarter={isRotaTestadaNoQuarter}
        />

        {/* Dashboard Executivo */}
        <div className="px-5 py-3">
          <ExecutiveDashboard
            selectedOperator={selectedOperator}
            selectedProvince={selectedProvince}
            selectedQuarter={selectedQuarter}
            selectedWeek={selectedWeek}
            selectedYear={selectedYear}
            executiveDashboard={executiveDashboard}
            handleStatusClick={handleStatusClick}
            distribuicaoReparacoes={distribuicaoReparacoes}
            quarterWeeks={quarterWeeks}
            efetividadeMode={efetividadeMode}
            setEfetividadeMode={setEfetividadeMode}
            efetividadeGlobalMedia={efetividadeGlobalMedia}
            efetividadePSMMedia={efetividadePSMMedia}
            data={data}
          />

          {/* Performance das Rotas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="py-4 px-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingDown className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Performance das Rotas
                  {selectedProvince !== 'Todas' && <span className="text-blue-600"> | {selectedProvince}</span>}
                </h2>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-4">
                {/* Top 5 Rotas Críticas - GRÁFICO DE BARRAS HORIZONTAL */}
                <div className="bg-red-50 rounded-lg border border-red-200 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h3 className="text-xs font-semibold text-red-700">Top 5 Rotas Críticas - {selectedQuarter}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {(() => {
                      // Calcular valor máximo para escala
                      const maxValue = Math.max(...topRotasCriticas.map(r => r.value), 1);
                      
                      return topRotasCriticas.map((item) => {
                        const percentage = (item.value / maxValue) * 100;
                        const reparadasPercentage = item.value > 0 ? (item.reparadas / item.value) * 100 : 0;
                        
                        return (
                          <div 
                            key={item.rank} 
                            className="relative cursor-pointer group"
                            onClick={() => handleRotaClick(item.rota)}
                          >
                            {/* Barra de fundo */}
                            <div className="relative h-10 rounded-lg overflow-hidden bg-white border border-red-200 group-hover:border-red-400 transition-all duration-200">
                              {/* Barra vermelha (Indisponíveis) */}
                              <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500 ease-out"
                                style={{ width: `${Math.max(percentage, 15)}%` }}
                              >
                                {/* Efeito de brilho */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                              </div>
                              
                              {/* v3.49.34: Barrinha verde sólida e vibrante (Reparadas) */}
                              {item.reparadas > 0 && (
                                <div 
                                  className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-500 ease-out shadow-sm"
                                  style={{ width: `${Math.max(percentage * (reparadasPercentage / 100), 5)}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20"></div>
                                </div>
                              )}
                              
                              {/* Conteúdo sobre a barra */}
                              <div className="relative h-full flex items-center justify-between px-3 z-10">
                                {/* Lado esquerdo: Ranking + Nome da Rota */}
                                <div className="flex items-center space-x-2 flex-1">
                                  <span className="text-xs font-bold text-white bg-red-700/80 rounded-full w-5 h-5 flex items-center justify-center">
                                    {item.rank}
                                  </span>
                                  <div className="flex flex-col">
                                    {/* v3.49.33: Nome sempre em cinza escuro */}
                                    <span className="text-xs font-bold leading-tight text-gray-700">
                                      {item.rota}
                                    </span>
                                    {item.reparadas > 0 && (
                                      <span className="text-[10px] font-bold leading-tight text-green-500">
                                        {item.reparadas} reparadas ({reparadasPercentage.toFixed(0)}%)
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {/* v3.49.37: Valor em círculo branco compacto */}
                                <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-sm border border-red-200">
                                  <span className="text-[11px] font-bold text-red-600">
                                    {item.value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-red-200">
                    <div className="text-xs text-red-700 font-medium text-center">
                      {topRotasCriticas.filter(r => r.value > 0).length} rotas com indisponíveis
                    </div>
                  </div>
                </div>

                {/* Intervenções Recentes - ULTRA COMPACTO COM PAGINAÇÃO */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-semibold text-blue-700">Intervenções Recentes - {selectedQuarter}</h3>
                    </div>
                    {/* Setas discretas - só aparecem se houver mais de 5 rotas */}
                    {intervencoesRecentes.length > 5 && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={goToPrevPageIntervencoes}
                          disabled={currentPageIntervencoes === 0}
                          className="text-blue-600 hover:text-blue-800 disabled:text-blue-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Anterior"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="text-[9px] text-blue-600 font-medium px-1">
                          {currentPageIntervencoes + 1}/{Math.ceil(intervencoesRecentes.length / itemsPerPageIntervencoes)}
                        </span>
                        <button
                          onClick={goToNextPageIntervencoes}
                          disabled={currentPageIntervencoes >= Math.ceil(intervencoesRecentes.length / itemsPerPageIntervencoes) - 1}
                          className="text-blue-600 hover:text-blue-800 disabled:text-blue-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Próxima"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {(() => {
                      // Paginação
                      const startIdx = currentPageIntervencoes * itemsPerPageIntervencoes;
                      const endIdx = startIdx + itemsPerPageIntervencoes;
                      const paginatedItems = intervencoesRecentes.slice(startIdx, endIdx);
                      
                      console.log('📄 PAGINAÇÃO INTERVENÇÕES:', {
                        totalItems: intervencoesRecentes.length,
                        currentPage: currentPageIntervencoes,
                        itemsPerPage: itemsPerPageIntervencoes,
                        startIdx,
                        endIdx,
                        itemsNaPagina: paginatedItems.length
                      });
                      
                      if (paginatedItems.length === 0) {
                        return (
                          <div className="bg-white rounded p-3 border border-blue-100 text-center">
                            <p className="text-xs text-gray-500">Sem intervenções neste quadrimestre</p>
                          </div>
                        );
                      }
                      
                      return paginatedItems.map((item, idx) => {
                        // v3.22.1: Calcular reparações na semana selecionada
                        const weekData = data[selectedOperator]?.[selectedWeek]?.[item.rota];
                        const reparadasNaSemana = weekData ? (parseInt(weekData['Total Reparadas']) || 0) : 0;
                        
                        return (
                          <div key={idx} className="bg-white rounded p-1.5 border border-blue-100">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <p className="text-xs font-medium text-gray-700 leading-tight truncate">
                                    {item.rota}
                                  </p>
                                  {reparadasNaSemana > 0 && (
                                    <span className="text-[10px] font-semibold text-green-600 whitespace-nowrap">
                                      (+{reparadasNaSemana} ↑)
                                    </span>
                                  )}
                                </div>
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-medium px-1 py-0.5 rounded inline-block mt-0.5">{item.status}</span>
                              </div>
                              <span className="text-lg font-bold text-blue-600 flex-shrink-0">{item.reps}</span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-blue-200">
                    {(() => {
                      // v3.20.5: Calcular intervenções e reparações das 2 últimas semanas
                      const routesToProcess = selectedProvince !== 'Todas'
                        ? ROUTES_BY_PSM[selectedOperator].filter(route => ROUTE_TO_PROVINCE[route] === selectedProvince)
                        : ROUTES_BY_PSM[selectedOperator];
                      
                      // Semana atual - contar intervenções e total de reparações
                      let totalSemanaSelecionada = 0;
                      let intervencoesSemanaAtual = 0;
                      routesToProcess.forEach(route => {
                        if (data[selectedOperator]?.[selectedWeek]?.[route]) {
                          const routeData = data[selectedOperator][selectedWeek][route];
                          const reparadas = parseInt(routeData['Total Reparadas']) || 0;
                          if (reparadas > 0) {
                            intervencoesSemanaAtual++;
                            totalSemanaSelecionada += reparadas;
                          }
                        }
                      });
                      
                      // Semana anterior
                      const selectedWeekNum = parseInt(selectedWeek.substring(1)); // W50 -> 50
                      const previousWeekNum = selectedWeekNum - 1;
                      const previousWeek = previousWeekNum >= 1 ? `W${previousWeekNum}` : null;
                      
                      let totalSemanaAnterior = 0;
                      if (previousWeek) {
                        routesToProcess.forEach(route => {
                          if (data[selectedOperator]?.[previousWeek]?.[route]) {
                            const routeData = data[selectedOperator][previousWeek][route];
                            totalSemanaAnterior += parseInt(routeData['Total Reparadas']) || 0;
                          }
                        });
                      }
                      
                      const total2Semanas = totalSemanaSelecionada + totalSemanaAnterior;
                      
                      return (
                        <div className="text-xs text-blue-700 font-medium text-center">
                          <div>
                            {intervencoesSemanaAtual > 0 
                              ? `${intervencoesSemanaAtual} intervenções na ${selectedWeek}`
                              : `Sem intervenções na ${selectedWeek}`
                            }
                          </div>
                          <div className="text-[10px] mt-0.5">
                            {previousWeek && <span>{previousWeek}: {totalSemanaAnterior} | </span>}
                            {selectedWeek}: {totalSemanaSelecionada}
                            <span className="font-bold ml-1">({total2Semanas} total)</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Rotas Normalizadas - ULTRA COMPACTO COM PAGINAÇÃO */}
                <div className="bg-green-50 rounded-lg border border-green-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <h3 className="text-xs font-semibold text-green-700">Rotas Normalizadas - {selectedQuarter}</h3>
                    </div>
                    {/* Setas discretas - só aparecem se houver mais de 6 rotas */}
                    {rotasNormalizadas.length > 6 && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={goToPrevPageNormalizadas}
                          disabled={currentPageNormalizadas === 0}
                          className="text-green-600 hover:text-green-800 disabled:text-green-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Anterior"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="text-[9px] text-green-600 font-medium px-1">
                          {currentPageNormalizadas + 1}/{totalPagesNormalizadas}
                        </span>
                        <button
                          onClick={goToNextPageNormalizadas}
                          disabled={currentPageNormalizadas >= totalPagesNormalizadas - 1}
                          className="text-green-600 hover:text-green-800 disabled:text-green-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Próximo"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {currentDataNormalizadas.map((item, idx) => (
                      <div key={idx} className="bg-white rounded p-1.5 border border-green-100">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 leading-tight truncate">{item.rota}</p>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-[10px] text-green-600 font-medium">{item.status}</span>
                              {item.condition && (
                                <span className="text-[9px] text-gray-500 italic">{item.condition}</span>
                              )}
                            </div>
                          </div>
                          <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">{item.icon}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-green-200">
                    <div className="text-xs text-green-700 font-medium text-center">
                      {rotasNormalizadas.filter(r => r.icon === '✓').length} rotas normalizadas
                    </div>
                  </div>
                </div>
                {/* v3.23.0: ROTAS MAIS INTERVENCIONADAS - TOP 5 */}
                <div className="bg-purple-50 rounded-lg border border-purple-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <h3 className="text-xs font-semibold text-purple-700">Top 5 Mais Intervencionadas - {selectedQuarter}</h3>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {rotasMaisIntervencionadas.map((item) => (
                      <div 
                        key={item.rank} 
                        className="bg-white rounded p-1.5 border border-purple-100 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        onClick={() => item.rota !== '-' && handleRotaClick(item.rota)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 flex-1">
                            <span className="text-sm font-bold text-purple-600 w-5">#{item.rank}</span>
                            <div className="flex flex-col">
                              <p className="text-xs font-medium text-gray-700 leading-tight">{item.rota}</p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-purple-600 ml-2">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-purple-200">
                    <div className="text-xs text-purple-700 font-medium text-center">
                      {rotasMaisIntervencionadas.filter(r => r.value > 0).length} rotas com reparações
                    </div>
                  </div>
                </div>


                {/* v3.23.0: ROTAS SEM INTERVENÇÃO - CARROSSEL */}
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <h3 className="text-xs font-semibold text-orange-700">Rotas Sem Intervenção - {selectedQuarter}</h3>
                    </div>
                    {/* Setas do carrossel - só aparecem se houver mais de 7 rotas */}
                    {rotasSemIntervencao.length > 7 && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={goToPrevPageSemIntervencao}
                          disabled={currentPageSemIntervencao === 0}
                          className="text-orange-600 hover:text-orange-800 disabled:text-orange-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Anterior"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="text-[9px] text-orange-600 font-medium px-1">
                          {currentPageSemIntervencao + 1}/{Math.ceil(rotasSemIntervencao.length / itemsPerPageSemIntervencao)}
                        </span>
                        <button
                          onClick={goToNextPageSemIntervencao}
                          disabled={currentPageSemIntervencao >= Math.ceil(rotasSemIntervencao.length / itemsPerPageSemIntervencao) - 1}
                          className="text-orange-600 hover:text-orange-800 disabled:text-orange-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Próximo"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {rotasSemIntervencao.length > 0 ? (
                      rotasSemIntervencao
                        .slice(
                          currentPageSemIntervencao * itemsPerPageSemIntervencao,
                          (currentPageSemIntervencao + 1) * itemsPerPageSemIntervencao
                        )
                        .map((item, idx) => (
                          <div 
                            key={idx} 
                            className="bg-white rounded p-1.5 border border-orange-100 cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors"
                            onClick={() => handleRotaClick(item.rota)}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-medium text-gray-700 leading-tight truncate flex-1">{item.rota}</p>
                              <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">0</span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="bg-white rounded p-3 border border-orange-100 text-center">
                        <p className="text-xs text-gray-500">Todas as rotas tiveram intervenção</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-orange-200">
                    <div className="text-xs text-orange-700 font-medium text-center">
                      {rotasSemIntervencao.length} rotas sem reparações
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* v3.9.0: Gráfico Semicircular CORRETO - Distribuição por Status */}
          {/* v3.13.0: Análise Comparativa - 2 Colunas Lado a Lado Estilo Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Análise Comparativa: Distribuição e Tendências
                  {selectedProvince !== 'Todas' && <span className="text-blue-600"> | {selectedProvince}</span>}
                </h2>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                
                {/* COLUNA 1: Distribuição por Status - ESQUERDA - COMPACTO */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <PieChart className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-semibold text-blue-700">Distribuição por Status - {selectedQuarter}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-blue-600 font-medium">Dinâmico</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    {/* Altura reduzida de 340px para 280px */}
                    <div className="relative mb-2 w-full" style={{ height: '280px' }}>
                      <svg width="100%" height="100%" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <filter id="shadow2">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
                          </filter>
                        </defs>
                        
                        {(() => {
                          const centerX = 200;
                          const centerY = 160;
                          
                          // FASE 2: Definir raios para DOIS ANÉIS
                          // ANEL EXTERNO (Outer - Transporte e Indisponíveis)
                          const outerRingOuter = 120;  // Raio externo do anel externo
                          const outerRingInner = 95;   // Raio interno do anel externo
                          
                          // ANEL INTERNO (Inner - Subcategorias)
                          const innerRingOuter = 90;   // Raio externo do anel interno
                          const innerRingInner = 60;   // Raio interno do anel interno
                          
                          return (
                            <>
                              {/* ========== ANEL EXTERNO (OUTER) ========== */}
                              {(() => {
                                let currentAngle = 0;
                                return pieChartData.outer.map((slice, index) => {
                                  const startAngle = currentAngle;
                                  const sliceAngle = (slice.percentage / 100) * 180;
                                  const endAngle = startAngle + sliceAngle;
                                  currentAngle = endAngle;
                                  
                                  const startRadians = (startAngle) * Math.PI / 180;
                                  const endRadians = (endAngle) * Math.PI / 180;
                                  
                                  // Pontos do arco EXTERNO
                                  const x1 = centerX + outerRingOuter * Math.cos(startRadians);
                                  const y1 = centerY - outerRingOuter * Math.sin(startRadians);
                                  const x2 = centerX + outerRingOuter * Math.cos(endRadians);
                                  const y2 = centerY - outerRingOuter * Math.sin(endRadians);
                                  
                                  const x3 = centerX + outerRingInner * Math.cos(endRadians);
                                  const y3 = centerY - outerRingInner * Math.sin(endRadians);
                                  const x4 = centerX + outerRingInner * Math.cos(startRadians);
                                  const y4 = centerY - outerRingInner * Math.sin(startRadians);
                                  
                                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                                  
                                  const pathData = [
                                    `M ${x1} ${y1}`,
                                    `A ${outerRingOuter} ${outerRingOuter} 0 ${largeArcFlag} 0 ${x2} ${y2}`,
                                    `L ${x3} ${y3}`,
                                    `A ${outerRingInner} ${outerRingInner} 0 ${largeArcFlag} 1 ${x4} ${y4}`,
                                    'Z'
                                  ].join(' ');
                                  
                                  const isHovered = hoveredPieSlice === `outer-${index}`;
                                  
                                  return (
                                    <g key={`outer-${index}`}>
                                      <path 
                                        d={pathData} 
                                        fill={slice.color} 
                                        stroke="white" 
                                        strokeWidth="3" 
                                        filter="url(#shadow2)"
                                        className="transition-all cursor-pointer"
                                        style={{
                                          opacity: hoveredPieSlice === null ? 0.95 : (isHovered ? 1 : 0.4),
                                          transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                                          transformOrigin: `${centerX}px ${centerY}px`
                                        }}
                                        onMouseEnter={() => setHoveredPieSlice(`outer-${index}`)}
                                        onMouseLeave={() => setHoveredPieSlice(null)}
                                      />
                                      {isHovered && (
                                        <g>
                                          <rect 
                                            x={centerX - 70} 
                                            y={centerY - 100} 
                                            width="140" 
                                            height="75" 
                                            rx="8" 
                                            fill="white" 
                                            stroke={slice.color}
                                            strokeWidth="2"
                                            filter="url(#shadow2)"
                                          />
                                          <text x={centerX} y={centerY - 72} fontSize="12" fontWeight="bold" fill="#374151" textAnchor="middle">{slice.label}</text>
                                          <text x={centerX} y={centerY - 50} fontSize="22" fontWeight="bold" fill={slice.color} textAnchor="middle">{slice.percentage}%</text>
                                          <text x={centerX} y={centerY - 30} fontSize="11" fill="#6b7280" textAnchor="middle">{slice.value} fibras</text>
                                        </g>
                                      )}
                                    </g>
                                  );
                                });
                              })()}
                              
                              {/* ========== ANEL INTERNO (INNER) ========== */}
                              {(() => {
                                let currentAngle = 0;
                                return pieChartData.inner.map((slice, index) => {
                                  const startAngle = currentAngle;
                                  const sliceAngle = (slice.percentage / 100) * 180;
                                  const endAngle = startAngle + sliceAngle;
                                  currentAngle = endAngle;
                                  
                                  const startRadians = (startAngle) * Math.PI / 180;
                                  const endRadians = (endAngle) * Math.PI / 180;
                                  
                                  // Pontos do arco INTERNO
                                  const x1 = centerX + innerRingOuter * Math.cos(startRadians);
                                  const y1 = centerY - innerRingOuter * Math.sin(startRadians);
                                  const x2 = centerX + innerRingOuter * Math.cos(endRadians);
                                  const y2 = centerY - innerRingOuter * Math.sin(endRadians);
                                  
                                  const x3 = centerX + innerRingInner * Math.cos(endRadians);
                                  const y3 = centerY - innerRingInner * Math.sin(endRadians);
                                  const x4 = centerX + innerRingInner * Math.cos(startRadians);
                                  const y4 = centerY - innerRingInner * Math.sin(startRadians);
                                  
                                  const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                                  
                                  const pathData = [
                                    `M ${x1} ${y1}`,
                                    `A ${innerRingOuter} ${innerRingOuter} 0 ${largeArcFlag} 0 ${x2} ${y2}`,
                                    `L ${x3} ${y3}`,
                                    `A ${innerRingInner} ${innerRingInner} 0 ${largeArcFlag} 1 ${x4} ${y4}`,
                                    'Z'
                                  ].join(' ');
                                  
                                  const isHovered = hoveredPieSlice === `inner-${index}`;
                                  
                                  return (
                                    <g key={`inner-${index}`}>
                                      <path 
                                        d={pathData} 
                                        fill={slice.color} 
                                        stroke="white" 
                                        strokeWidth="2" 
                                        filter="url(#shadow2)"
                                        className="transition-all cursor-pointer"
                                        style={{
                                          opacity: hoveredPieSlice === null ? 0.85 : (isHovered ? 1 : 0.3),
                                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                          transformOrigin: `${centerX}px ${centerY}px`
                                        }}
                                        onMouseEnter={() => setHoveredPieSlice(`inner-${index}`)}
                                        onMouseLeave={() => setHoveredPieSlice(null)}
                                      />
                                      {isHovered && (
                                        <g>
                                          <rect 
                                            x={centerX - 65} 
                                            y={centerY - 95} 
                                            width="130" 
                                            height="70" 
                                            rx="8" 
                                            fill="white" 
                                            stroke={slice.color}
                                            strokeWidth="2"
                                            filter="url(#shadow2)"
                                          />
                                          <text x={centerX} y={centerY - 70} fontSize="11" fontWeight="bold" fill="#374151" textAnchor="middle">{slice.label}</text>
                                          <text x={centerX} y={centerY - 50} fontSize="18" fontWeight="bold" fill={slice.color} textAnchor="middle">{slice.percentage}%</text>
                                          <text x={centerX} y={centerY - 32} fontSize="10" fill="#6b7280" textAnchor="middle">{slice.value} fibras</text>
                                        </g>
                                      )}
                                    </g>
                                  );
                                });
                              })()}
                              
                              <text x="200" y="190" fontSize="22" fontWeight="bold" fill="#374151" textAnchor="middle">Status</text>
                              <text x="200" y="210" fontSize="11" fill="#6b7280" textAnchor="middle">{selectedQuarter} {selectedYear}</text>
                            </>
                          );
                        })()}
                        
                      </svg>
                    </div>
                    
                    {/* FASE 3: LEGENDA HIERÁRQUICA */}
                    <div className="flex flex-col items-center gap-2 text-xs">
                      
                      {/* OUTER (Categorias Principais) - DESTAQUE */}
                      <div className="flex flex-wrap justify-center gap-3">
                        {pieChartData.outer.map((item, index) => {
                          const isHovered = hoveredPieSlice === `outer-${index}`;
                          
                          return (
                            <div 
                              key={`legend-outer-${index}`}
                              className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-white border-2 rounded-lg transition-all duration-200 cursor-pointer"
                              style={{
                                borderColor: isHovered ? item.color : '#e5e7eb',
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                boxShadow: isHovered ? `0 2px 8px ${item.color}40` : 'none'
                              }}
                              onMouseEnter={() => setHoveredPieSlice(`outer-${index}`)}
                              onMouseLeave={() => setHoveredPieSlice(null)}
                            >
                              <div 
                                className="w-4 h-4 rounded transition-transform duration-200" 
                                style={{ 
                                  backgroundColor: item.color,
                                  transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                                }}
                              ></div>
                              <span className="font-bold text-gray-800">{item.label}</span>
                              <span className="font-bold" style={{ color: item.color }}>{item.percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* INNER (Subcategorias) - COMPACTO */}
                      <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {pieChartData.inner.map((item, index) => {
                          const isHovered = hoveredPieSlice === `inner-${index}`;
                          
                          return (
                            <div 
                              key={`legend-inner-${index}`}
                              className="flex items-center space-x-1 px-2 py-0.5 bg-white border rounded transition-all duration-200 cursor-pointer"
                              style={{
                                borderColor: isHovered ? item.color : '#e5e7eb',
                                opacity: hoveredPieSlice === null || isHovered ? 1 : 0.5,
                                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                              }}
                              onMouseEnter={() => setHoveredPieSlice(`inner-${index}`)}
                              onMouseLeave={() => setHoveredPieSlice(null)}
                            >
                              <div 
                                className="w-2.5 h-2.5 rounded transition-transform duration-200" 
                                style={{ 
                                  backgroundColor: item.color,
                                  transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                                }}
                              ></div>
                              <span className="text-gray-600 text-[10px]">{item.label}:</span>
                              <span className="font-semibold text-[10px]" style={{ color: item.color }}>{item.percentage}%</span>
                            </div>
                          );
                        })}
                      </div>
                      
                    </div>
                  </div>
                </div>
                
                {/* COLUNA 2: Evolução Temporal - DIREITA - COMPACTO */}
                <div className="bg-green-50 rounded-lg border border-green-200 p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <h3 className="text-xs font-semibold text-green-700">Evolução Temporal - Até {selectedWeek}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-green-600 font-medium">Plateau até W52</span>
                    </div>
                  </div>
                  
                  <div className="w-full" style={{ height: '320px' }}>
                    <svg width="100%" height="100%" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="600" height="280" fill="url(#grid)" />
                      
                      {(() => {
                        // v3.40.81: EIXO Y SEMPRE COMEÇA DO ZERO
                        const allValues = trendData.flatMap(item => [
                          item.indisponiveis,
                          item.totalReparadas,
                          item.reparadasGlobal,
                          item.fibrasDep
                        ]);
                        
                        const maxValue = Math.max(...allValues, 0);
                        
                        // v3.41.01: ESCALA DINÂMICA FLEXÍVEL - mais espaço entre linhas
                        // Adicionar margem proporcional ao valor máximo (20-50%)
                        const marginPercent = maxValue < 20 ? 0.5 : (maxValue < 50 ? 0.3 : 0.2);
                        const maxY = Math.ceil(maxValue * (1 + marginPercent));
                        
                        // v3.40.81: Garantir que eixo começa do 0 (não do mínimo)
                        const minY = 0;  // SEMPRE zero
                        
                        // Calcular intervalo dos ticks (divisões do eixo Y)
                        const numTicks = 5;
                        const tickInterval = Math.ceil(maxY / (numTicks - 1) / 10) * 10; // Arredondar para múltiplo de 10
                        const yAxisMax = tickInterval * (numTicks - 1);
                        
                        // Fator de escala: mapear valores para pixels (altura útil reduzida)
                        // v3.40.81: Escala de 0 até yAxisMax
                        const scaleFactor = 240 / yAxisMax; // 240px de altura útil (320 - 80 margens)

                        // Gerar ticks do eixo Y (começa do 0)
                        const yTicks = [];
                        for (let i = 0; i < numTicks; i++) {
                          yTicks.push(i * tickInterval);  // 0, tickInterval, 2*tickInterval, ...
                        }
                        
                        return yTicks.map((val, idx) => {
                          const y = 270 - (val * scaleFactor); // Ajustado para altura 320px
                          return (
                            <g key={idx}>
                              <line x1="80" y1={y} x2="570" y2={y} stroke="#d1d5db" strokeWidth="1" strokeDasharray="3 3" />
                              <text x="68" y={y + 5} fontSize="10" fill="#6b7280" textAnchor="end" fontWeight="600">{val}</text>
                            </g>
                          );
                        });
                      })()}
                      
                      {(() => {
                        // v3.40.81: Calcular valores para escala dinâmica (COMEÇA DO ZERO)
                        const allValues = trendData.flatMap(item => [
                          item.indisponiveis,
                          item.totalReparadas,
                          item.reparadasGlobal,
                          item.fibrasDep
                        ]);
                        
                        const maxValue = Math.max(...allValues, 0);
                        
                        // v3.41.01: ESCALA DINÂMICA FLEXÍVEL
                        const marginPercent = maxValue < 20 ? 0.5 : (maxValue < 50 ? 0.3 : 0.2);
                        const maxY = Math.ceil(maxValue * (1 + marginPercent));
                        
                        const numTicks = 5;
                        const tickInterval = Math.ceil(maxY / (numTicks - 1) / 10) * 10;
                        const yAxisMax = tickInterval * (numTicks - 1);
                        const scaleFactor = 240 / yAxisMax; // Altura útil (escala de 0 a yAxisMax)
                        
                        // Calcular espaçamento dinâmico para ocupar todo o espaço
                        // v3.49.30: Adicionar margem para não cortar primeira semana
                        const leftMargin = 80;  // Margem esquerda (era 60)
                        const rightMargin = 30; // Margem direita
                        const totalWidth = 600 - leftMargin - rightMargin; // Espaço disponível
                        const numWeeks = trendData.length;
                        const spacing = totalWidth / (numWeeks > 1 ? numWeeks - 1 : 1); // Espaçamento entre pontos
                        
                        return (
                          <>
                            {/* Labels das semanas */}
                            {trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              return <text key={idx} x={x} y="295" fontSize="11" fill="#374151" fontWeight="600" textAnchor="middle">{item.week}</text>;
                            })}
                            
                            {/* Linha Indisponíveis (VERMELHA) */}
                            <path d={trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              const y = 270 - (item.indisponiveis * scaleFactor);
                              return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')} fill="none" stroke="#ef4444" strokeWidth="3.5" />
                            {trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              const y = 270 - (item.indisponiveis * scaleFactor);
                              return <circle key={idx} cx={x} cy={y} r="5" fill="#ef4444" stroke="#fff" strokeWidth="2" />;
                            })}
                            
                            {/* Linha Total Reparadas (LARANJA) */}
                            <path d={trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              const y = 270 - (item.totalReparadas * scaleFactor);
                              return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')} fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="6 6" />
                            {trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              const y = 270 - (item.totalReparadas * scaleFactor);
                              return <circle key={idx} cx={x} cy={y} r="4.5" fill="#f97316" stroke="#fff" strokeWidth="2" />;
                            })}
                            
                            {/* Linha Reparadas Global (VERDE) */}
                            <path d={trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              const y = 270 - (item.reparadasGlobal * scaleFactor);
                              return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')} fill="none" stroke="#22c55e" strokeWidth="3" />
                            {trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              const y = 270 - (item.reparadasGlobal * scaleFactor);
                              return <circle key={idx} cx={x} cy={y} r="4.5" fill="#22c55e" stroke="#fff" strokeWidth="2" />;
                            })}
                            
                            {/* Linha Fibras Dep (ROXO) - v3.40.77: valores diretos do card */}
                            <path d={trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              const y = 270 - (item.fibrasDep * scaleFactor);
                              return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeDasharray="5 3" />
                            {trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              const y = 270 - (item.fibrasDep * scaleFactor);
                              return <circle key={idx} cx={x} cy={y} r="4" fill="#8b5cf6" stroke="#fff" strokeWidth="2" />;
                            })}
                            
                            {/* v3.40.96: ANOTAÇÕES INTELIGENTES - Valores em pontos de variação */}
                            {(() => {
                              // Função para detectar variação significativa
                              // v3.41.01: LÓGICA CONSISTENTE E SIMPLES
                              const isVariation = (data, idx, key) => {
                                const curr = data[idx][key];
                                
                                // NUNCA mostrar zeros
                                if (curr === 0) return false;
                                
                                // Sempre mostrar primeiro e último (se não for zero)
                                if (idx === 0) return true;
                                if (idx === data.length - 1) return true;
                                
                                const prev = data[idx - 1][key];
                                
                                // REGRA SIMPLES E CONSISTENTE:
                                // Mostrar se o valor MUDOU em relação ao anterior
                                // E a mudança é >= 5% OU >= 3 unidades
                                if (curr === prev) return false; // Mesmo valor = não mostrar
                                
                                const mudancaAbsoluta = Math.abs(curr - prev);
                                const mudancaPercentual = prev !== 0 ? Math.abs((curr - prev) / prev) : 1;
                                
                                // Mostrar se mudança >= 3 unidades OU >= 5%
                                return mudancaAbsoluta >= 3 || mudancaPercentual >= 0.05;
                              };
                              
                              // Coletar todas as anotações
                              const allAnnotations = [];
                              
                              // Série 1: Indisponíveis (Vermelho)
                              trendData.forEach((item, idx) => {
                                if (isVariation(trendData, idx, 'indisponiveis')) {
                                  const x = leftMargin + (idx * spacing);
                                  const y = 270 - (item.indisponiveis * scaleFactor);
                                  allAnnotations.push({
                                    x, y, 
                                    value: item.indisponiveis,
                                    color: '#ef4444',
                                    series: 'indisponiveis',
                                    idx
                                  });
                                }
                              });
                              
                              // Série 2: Total Reparadas (Laranja)
                              trendData.forEach((item, idx) => {
                                if (isVariation(trendData, idx, 'totalReparadas')) {
                                  const x = leftMargin + (idx * spacing);
                                  const y = 270 - (item.totalReparadas * scaleFactor);
                                  allAnnotations.push({
                                    x, y,
                                    value: item.totalReparadas,
                                    color: '#f97316',
                                    series: 'totalReparadas',
                                    idx
                                  });
                                }
                              });
                              
                              // Série 3: Reparadas Global (Verde)
                              trendData.forEach((item, idx) => {
                                if (isVariation(trendData, idx, 'reparadasGlobal')) {
                                  const x = leftMargin + (idx * spacing);
                                  const y = 270 - (item.reparadasGlobal * scaleFactor);
                                  allAnnotations.push({
                                    x, y,
                                    value: item.reparadasGlobal,
                                    color: '#22c55e',
                                    series: 'reparadasGlobal',
                                    idx
                                  });
                                }
                              });
                              
                              // Série 4: Fibras Dep (Roxo)
                              trendData.forEach((item, idx) => {
                                if (isVariation(trendData, idx, 'fibrasDep')) {
                                  const x = leftMargin + (idx * spacing);
                                  const y = 270 - (item.fibrasDep * scaleFactor);
                                  allAnnotations.push({
                                    x, y,
                                    value: item.fibrasDep,
                                    color: '#8b5cf6',
                                    series: 'fibrasDep',
                                    idx
                                  });
                                }
                              });
                              
                              // Agrupar anotações por posição X (mesma semana)
                              const groupedByX = {};
                              allAnnotations.forEach(ann => {
                                if (!groupedByX[ann.x]) groupedByX[ann.x] = [];
                                groupedByX[ann.x].push(ann);
                              });
                              
                              // v3.40.97: SISTEMA ROBUSTO ANTI-COLISÃO
                              const finalAnnotations = [];
                              const minSpacing = 18; // Distância mínima entre textos (altura do texto + margem)
                              
                              Object.keys(groupedByX).forEach(x => {
                                const group = groupedByX[x];
                                // Ordenar por Y (de cima para baixo)
                                group.sort((a, b) => a.y - b.y);
                                
                                // v3.41.01: POSICIONAMENTO INTELIGENTE sem colisões
                                group.forEach((ann, i) => {
                                  // v3.41.01: ESPAÇAMENTO MAIOR - 45px
                                  const offsetY = (i % 2 === 0) ? -45 : 45;
                                  let labelY = ann.y + offsetY;
                                  
                                  // Garantir limites do gráfico
                                  if (labelY > 275) labelY = ann.y - 45; // Proteger eixo X
                                  if (labelY < 20) labelY = 20; // Limite superior
                                  
                                  // v3.41.01: ANTI-COLISÃO MELHORADO
                                  let hasCollision = true;
                                  let attempts = 0;
                                  const maxAttempts = 30; // Mais tentativas
                                  
                                  while (hasCollision && attempts < maxAttempts) {
                                    hasCollision = false;
                                    
                                    // Verificar colisão com todas as anotações já posicionadas
                                    for (const existing of finalAnnotations) {
                                      const xDistance = Math.abs(existing.x - ann.x);
                                      const yDistance = Math.abs(existing.labelY - labelY);
                                      
                                      // v3.41.01: Detecção mais sensível
                                      // Colisão se textos muito próximos (mesmo em colunas diferentes)
                                      if (xDistance < 50 && yDistance < minSpacing) {
                                        hasCollision = true;
                                        
                                        // Ajustar com espaçamento maior
                                        if (labelY < existing.labelY) {
                                          labelY = existing.labelY - minSpacing - 2; // +2px extra
                                        } else {
                                          labelY = existing.labelY + minSpacing + 2; // +2px extra
                                        }
                                        
                                        // Re-aplicar limites
                                        if (labelY > 275) {
                                          labelY = existing.labelY - minSpacing - 2;
                                        }
                                        if (labelY < 20) {
                                          labelY = existing.labelY + minSpacing + 2;
                                        }
                                        
                                        break;
                                      }
                                    }
                                    
                                    attempts++;
                                  }
                                  
                                  // Se ainda houver colisão após tentativas, usar estratégia de empilhamento
                                  if (hasCollision) {
                                    // Empilhar verticalmente com espaçamento fixo
                                    const stackPosition = finalAnnotations.length * minSpacing + 20;
                                    labelY = Math.min(stackPosition, 275);
                                  }
                                  
                                  finalAnnotations.push({
                                    ...ann,
                                    labelY
                                  });
                                });
                              });
                              
                              // Renderizar anotações
                              return finalAnnotations.map((ann, i) => (
                                <g key={`ann-${i}`}>
                                  {/* Linha conectora sutil */}
                                  <line
                                    x1={ann.x}
                                    y1={ann.y}
                                    x2={ann.x}
                                    y2={ann.labelY}
                                    stroke={ann.color}
                                    strokeWidth="1"
                                    strokeDasharray="2 2"
                                    opacity="0.4"
                                  />
                                  
                                  {/* Texto do valor - SEM retângulo */}
                                  <text
                                    x={ann.x}
                                    y={ann.labelY}
                                    fontSize="11"
                                    fontWeight="bold"
                                    fill={ann.color}
                                    textAnchor="middle"
                                    stroke="white"
                                    strokeWidth="3"
                                    paintOrder="stroke"
                                  >
                                    {ann.value}
                                  </text>
                                </g>
                              ));
                            })()}
                            
                            {/* Áreas invisíveis para capturar hover por semana */}
                            {trendData.map((item, idx) => {
                              const x = leftMargin + (idx * spacing);
                              return (
                                <rect
                                  key={idx}
                                  x={x - spacing / 2}
                                  y={30}
                                  width={spacing}
                                  height={240}
                                  fill="transparent"
                                  className="cursor-crosshair transition-opacity duration-200"
                                  onMouseEnter={() => setHoveredWeekIndex(idx)}
                                  onMouseLeave={() => setHoveredWeekIndex(null)}
                                />
                              );
                            })}
                            
                            {/* Linha vertical + Tooltip consolidado */}
                            {/* v3.40.84: Tooltip com transição suave e posicionamento inteligente */}
                            {hoveredWeekIndex !== null && (() => {
                              const x = 60 + (hoveredWeekIndex * spacing);
                              const weekData = trendData[hoveredWeekIndex];
                              
                              // v3.40.84: Cálculo inteligente de posição
                              const tooltipWidth = 145;
                              const tooltipHeight = 135;
                              const svgWidth = 600;
                              const padding = 10;
                              
                              // Calcular posição ideal
                              let tooltipX = x + padding; // Padrão: direita do ponto
                              
                              // Se não cabe à direita, coloca à esquerda
                              if (tooltipX + tooltipWidth > svgWidth - padding) {
                                tooltipX = x - tooltipWidth - padding;
                              }
                              
                              // Garantir que não sai pela esquerda
                              if (tooltipX < padding) {
                                tooltipX = padding;
                              }
                              
                              // Garantir que não sai pela direita
                              if (tooltipX + tooltipWidth > svgWidth - padding) {
                                tooltipX = svgWidth - tooltipWidth - padding;
                              }
                              
                              return (
                                <g style={{transition: 'all 0.2s ease-out'}}>
                                  {/* Sombra para tooltip */}
                                  <defs>
                                    <filter id="tooltipShadow" x="-50%" y="-50%" width="200%" height="200%">
                                      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                                      <feOffset dx="0" dy="2" result="offsetblur"/>
                                      <feComponentTransfer>
                                        <feFuncA type="linear" slope="0.3"/>
                                      </feComponentTransfer>
                                      <feMerge>
                                        <feMergeNode/>
                                        <feMergeNode in="SourceGraphic"/>
                                      </feMerge>
                                    </filter>
                                  </defs>
                                  
                                  {/* Linha vertical indicadora com transição */}
                                  <line 
                                    x1={x} 
                                    y1={30} 
                                    x2={x} 
                                    y2={270} 
                                    stroke="#6b7280" 
                                    strokeWidth="2" 
                                    strokeDasharray="4 4"
                                    opacity="0.7"
                                    style={{transition: 'all 0.2s ease-out'}}
                                  />
                                  
                                  {/* Círculos nos pontos das linhas com transição */}
                                  <circle 
                                    cx={x} 
                                    cy={270 - (weekData.indisponiveis * scaleFactor)} 
                                    r="5" 
                                    fill="#ef4444" 
                                    stroke="white" 
                                    strokeWidth="2"
                                    style={{transition: 'all 0.2s ease-out'}}
                                  />
                                  <circle 
                                    cx={x} 
                                    cy={270 - (weekData.totalReparadas * scaleFactor)} 
                                    r="5" 
                                    fill="#f97316" 
                                    stroke="white" 
                                    strokeWidth="2"
                                    style={{transition: 'all 0.2s ease-out'}}
                                  />
                                  <circle 
                                    cx={x} 
                                    cy={270 - (weekData.reparadasGlobal * scaleFactor)} 
                                    r="5" 
                                    fill="#22c55e" 
                                    stroke="white" 
                                    strokeWidth="2"
                                    style={{transition: 'all 0.2s ease-out'}}
                                  />
                                  <circle 
                                    cx={x} 
                                    cy={270 - (weekData.fibrasDep * scaleFactor)} 
                                    r="5" 
                                    fill="#8b5cf6" 
                                    stroke="white" 
                                    strokeWidth="2"
                                    style={{transition: 'all 0.2s ease-out'}}
                                  />
                                  
                                  {/* Tooltip box com transição suave */}
                                  <g filter="url(#tooltipShadow)" style={{transition: 'all 0.2s ease-out'}}>
                                    <rect 
                                      x={tooltipX} 
                                      y={35} 
                                      width={tooltipWidth} 
                                      height={tooltipHeight} 
                                      rx="8" 
                                      fill="white" 
                                      stroke="#e5e7eb" 
                                      strokeWidth="1.5"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    />
                                    
                                    {/* Header com semana */}
                                    <rect 
                                      x={tooltipX} 
                                      y={35} 
                                      width={tooltipWidth} 
                                      height="32" 
                                      rx="8" 
                                      fill="#374151"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    />
                                    <text 
                                      x={tooltipX + tooltipWidth / 2} 
                                      y={56} 
                                      fontSize="14" 
                                      fontWeight="bold" 
                                      fill="white" 
                                      textAnchor="middle"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      {weekData.week}
                                    </text>
                                    
                                    {/* Linha separadora */}
                                    <line 
                                      x1={tooltipX + 10} 
                                      y1={72} 
                                      x2={tooltipX + tooltipWidth - 10} 
                                      y2={72} 
                                      stroke="#e5e7eb" 
                                      strokeWidth="1"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    />
                                    
                                    {/* Indisponíveis */}
                                    <circle 
                                      cx={tooltipX + 15} 
                                      cy={87} 
                                      r="5" 
                                      fill="#ef4444"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    />
                                    <text 
                                      x={tooltipX + 25} 
                                      y={91} 
                                      fontSize="11" 
                                      fill="#6b7280" 
                                      fontWeight="600"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      Indisponíveis:
                                    </text>
                                    <text 
                                      x={tooltipX + tooltipWidth - 10} 
                                      y={91} 
                                      fontSize="12" 
                                      fill="#ef4444" 
                                      fontWeight="bold" 
                                      textAnchor="end"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      {weekData.indisponiveis}
                                    </text>
                                    
                                    {/* Rep. Semanal */}
                                    <circle 
                                      cx={tooltipX + 15} 
                                      cy={107} 
                                      r="5" 
                                      fill="#f97316"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    />
                                    <text 
                                      x={tooltipX + 25} 
                                      y={111} 
                                      fontSize="11" 
                                      fill="#6b7280" 
                                      fontWeight="600"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      Rep. Semanal:
                                    </text>
                                    <text 
                                      x={tooltipX + tooltipWidth - 10} 
                                      y={111} 
                                      fontSize="12" 
                                      fill="#f97316" 
                                      fontWeight="bold" 
                                      textAnchor="end"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      {weekData.totalReparadas}
                                    </text>
                                    
                                    {/* Reparadas Global */}
                                    <circle 
                                      cx={tooltipX + 15} 
                                      cy={127} 
                                      r="5" 
                                      fill="#22c55e"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    />
                                    <text 
                                      x={tooltipX + 25} 
                                      y={131} 
                                      fontSize="11" 
                                      fill="#6b7280" 
                                      fontWeight="600"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      Rep. Global:
                                    </text>
                                    <text 
                                      x={tooltipX + tooltipWidth - 10} 
                                      y={131} 
                                      fontSize="12" 
                                      fill="#22c55e" 
                                      fontWeight="bold" 
                                      textAnchor="end"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      {weekData.reparadasGlobal}
                                    </text>
                                    
                                    {/* Fibras Dep. PSM */}
                                    <circle 
                                      cx={tooltipX + 15} 
                                      cy={147} 
                                      r="5" 
                                      fill="#8b5cf6"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    />
                                    <text 
                                      x={tooltipX + 25} 
                                      y={151} 
                                      fontSize="11" 
                                      fill="#6b7280" 
                                      fontWeight="600"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      Fibras Dep. PSM:
                                    </text>
                                    <text 
                                      x={tooltipX + tooltipWidth - 10} 
                                      y={151} 
                                      fontSize="12" 
                                      fill="#8b5cf6" 
                                      fontWeight="bold" 
                                      textAnchor="end"
                                      style={{transition: 'all 0.2s ease-out'}}
                                    >
                                      {weekData.fibrasDep}
                                    </text>
                                  </g>
                                </g>
                              );
                            })()}
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* LEGENDA CENTRALIZADA */}
                  <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-0.5 bg-red-500"></div>
                      <span className="text-gray-700">Indisponíveis</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-0.5 bg-orange-500 border-t-2 border-dashed border-orange-500"></div>
                      <span className="text-gray-700">Rep. Semanal</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-0.5 bg-green-500"></div>
                      <span className="text-gray-700">Reparadas Global</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-0.5 bg-purple-500 border-t-2 border-dashed border-purple-500"></div>
                      <span className="text-gray-700">Fibras Dep. PSM</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* v3.14.81: GRÁFICOS POR CLASSIFICAÇÃO COM CARROSSEL */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            {/* HEADER COM BOTÃO TOGGLE */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  📊 Gráficos por Classificação
                  {selectedProvince !== 'Todas' && <span className="text-blue-600"> | {selectedProvince}</span>}
                </h2>
                
                <button
                  onClick={toggleViewModeClassificacao}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200"
                >
                  {viewModeClassificacao === 'carousel' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <span className="text-sm font-medium">Ver Resumo</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-sm font-medium">Ver Detalhado</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* CONTEÚDO DA SEÇÃO */}
            <div className="p-6">
              {(() => {
                // Preparar dados das rotas com valores
                // v3.22.0: Calcular dados ACUMULADOS desde a primeira semana com dados até semana selecionada
                const routesData = ROUTES_BY_PSM[selectedOperator]
                  .map(rota => {
                    // Encontrar primeira semana com dados para esta rota no quadrimestre
                    const quarterWeeks = ALL_WEEKS.slice(
                      QUARTER_CONFIG[selectedQuarter].start - 1,
                      QUARTER_CONFIG[selectedQuarter].end
                    );
                    
                    let primeiraSemanaDados = null;
                    let weekNumSelecionada = parseInt(selectedWeek.substring(1)); // W50 -> 50
                    
                    // Procurar primeira semana com dados
                    for (let week of quarterWeeks) {
                      const weekNum = parseInt(week.substring(1));
                      if (weekNum > weekNumSelecionada) break; // Parar se passou da semana selecionada
                      
                      const weekData = data[selectedOperator]?.[week]?.[rota];
                      if (weekData) {
                        const temDados = (parseInt(weekData['Transporte']) || 0) > 0 ||
                                        (parseInt(weekData['Indisponíveis']) || 0) > 0 ||
                                        (parseInt(weekData['Total Reparadas']) || 0) > 0;
                        if (temDados && !primeiraSemanaDados) {
                          primeiraSemanaDados = week;
                          break;
                        }
                      }
                    }
                    
                    // Se não há dados até a semana selecionada, retornar vazio
                    if (!primeiraSemanaDados) {
                      return null;
                    }
                    
                    // Calcular valores ACUMULADOS desde primeira semana até semana selecionada
                    let transporte = 0;
                    let indisponiveis = 0;
                    let totalReparadas = 0;
                    let reconhecidas = 0;
                    let depPassagem = 0;
                    let depLicenca = 0;
                    let depCutover = 0;
                    let fibrasDep = 0;
                    
                    for (let week of quarterWeeks) {
                      const weekNum = parseInt(week.substring(1));
                      if (weekNum > weekNumSelecionada) break; // Parar na semana selecionada
                      
                      const weekData = data[selectedOperator]?.[week]?.[rota];
                      if (weekData && weekNum >= parseInt(primeiraSemanaDados.substring(1))) {
                        // Transporte e Indisponíveis: pegar último valor (não somar)
                        const transporteVal = parseInt(weekData['Transporte']) || 0;
                        const indisponiveisVal = parseInt(weekData['Indisponíveis']) || 0;
                        if (transporteVal > 0) transporte = transporteVal;
                        if (indisponiveisVal > 0) indisponiveis = indisponiveisVal;
                        
                        // Total Reparadas: SOMAR (acumulado) - ÚNICO QUE ACUMULA
                        totalReparadas += parseInt(weekData['Total Reparadas'], 10) || 0;
                        
                        // V5.08.3: Usar valores REDUZIDOS (com desconto aplicado)
                        // Reconhecidas, Dependências e Fibras Dep.: pegar último valor REDUZIDO
                        const reconhecidasVal = getValorReduzido(selectedOperator, week, rota, 'Reconhecidas');
                        const depPassagemVal = getValorReduzido(selectedOperator, week, rota, 'Dep. de Passagem de Cabo');
                        const depLicencaVal = getValorReduzido(selectedOperator, week, rota, 'Dep. de Licença');
                        const depCutoverVal = getValorReduzido(selectedOperator, week, rota, 'Dep. de Cutover');
                        const fibrasDepVal = getValorReduzido(selectedOperator, week, rota, `Fibras dependentes da ${selectedOperator}`);
                        
                        if (reconhecidasVal > 0) reconhecidas = reconhecidasVal;
                        if (depPassagemVal > 0) depPassagem = depPassagemVal;
                        if (depLicencaVal > 0) depLicenca = depLicencaVal;
                        if (depCutoverVal > 0) depCutover = depCutoverVal;
                        if (fibrasDepVal > 0) fibrasDep = fibrasDepVal;
                      }
                    }
                    
                    return {
                      rota,
                      transporte,
                      indisponiveis,
                      totalReparadas, // Acumulado desde primeira semana
                      reconhecidas,
                      depPassagem,
                      depLicenca,
                      depCutover,
                      fibrasDep,
                      primeiraSemanaDados // Para debug
                    };
                  })
                  .filter(r => r !== null) // Remover rotas sem dados até semana selecionada
                  .filter(r => (r.transporte + r.indisponiveis + r.totalReparadas + r.reconhecidas + r.depPassagem + r.depLicenca + r.depCutover + r.fibrasDep) > 0)
                  // v3.20.0 FASE 4: Filtrar por província ANTES da classificação (afeta DADOS GERAIS)
                  .filter(r => selectedProvince === 'Todas' || ROUTE_TO_PROVINCE[r.rota] === selectedProvince);
                
                console.log('📊 GRÁFICOS POR CLASSIFICAÇÃO - Acumulado desde introdução:', {
                  provincia: selectedProvince,
                  semanaSelecionada: selectedWeek,
                  totalRotas: ROUTES_BY_PSM[selectedOperator].length,
                  rotasComDados: routesData.length,
                  amostra: routesData.slice(0, 2).map(r => ({
                    rota: r.rota,
                    primeira: r.primeiraSemanaDados,
                    reparadas: r.totalReparadas
                  }))
                });
                
                // CLASSIFICAR ROTAS BASEADO EM: Transporte vs Indisponíveis
                let rotasDegradadas = routesData.filter(r => r.transporte < r.indisponiveis);
                let rotasComGanho = routesData.filter(r => r.transporte > r.indisponiveis);
                let rotasEstaveis = routesData.filter(r => r.transporte === r.indisponiveis);
                
                // FASE 1: Filtro adicional removido - já filtrado acima
                // (mantido para compatibilidade mas não faz nada pois routesData já está filtrado)
                
                // FASE 2: Renderizar Dashboard Provincial (se província selecionada)
                const renderProvincialDashboard = () => {
                  if (selectedProvince === 'Todas') return null;
                  
                  const rotasProvincia = Object.entries(ROUTE_TO_PROVINCE)
                    .filter(([_, prov]) => prov === selectedProvince)
                    .map(([rota]) => rota);
                  
                  const rotasDegradadasProv = routesData.filter(r => r.transporte < r.indisponiveis && ROUTE_TO_PROVINCE[r.rota] === selectedProvince);
                  const rotasGanhoProv = routesData.filter(r => r.transporte > r.indisponiveis && ROUTE_TO_PROVINCE[r.rota] === selectedProvince);
                  const rotasEstaveisProv = routesData.filter(r => r.transporte === r.indisponiveis && ROUTE_TO_PROVINCE[r.rota] === selectedProvince);
                  
                  const totalTransporte = routesData.filter(r => ROUTE_TO_PROVINCE[r.rota] === selectedProvince).reduce((sum, r) => sum + r.transporte, 0);
                  const totalIndisponiveis = routesData.filter(r => ROUTE_TO_PROVINCE[r.rota] === selectedProvince).reduce((sum, r) => sum + r.indisponiveis, 0);
                  const totalReparadas = routesData.filter(r => ROUTE_TO_PROVINCE[r.rota] === selectedProvince).reduce((sum, r) => sum + r.totalReparadas, 0);
                  const totalGeral = totalTransporte + totalIndisponiveis + totalReparadas;
                  
                  return (
                    <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span className="text-lg font-bold text-blue-900">{selectedProvince}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-3 text-sm">
                        <div className="bg-white p-2 rounded border border-gray-200">
                          <span className="text-gray-600 block text-xs">Total Rotas</span>
                          <span className="font-bold text-xl text-gray-900">{rotasProvincia.length}</span>
                        </div>
                        <div className="bg-red-50 p-2 rounded border border-red-200">
                          <span className="text-gray-600 block text-xs">Degradadas</span>
                          <span className="font-bold text-xl text-red-600">{rotasDegradadasProv.length}</span>
                        </div>
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <span className="text-gray-600 block text-xs">Com Ganho</span>
                          <span className="font-bold text-xl text-green-600">{rotasGanhoProv.length}</span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded border border-blue-200">
                          <span className="text-gray-600 block text-xs">Estáveis</span>
                          <span className="font-bold text-xl text-blue-600">{rotasEstaveisProv.length}</span>
                        </div>
                        <div className="bg-purple-50 p-2 rounded border border-purple-200">
                          <span className="text-gray-600 block text-xs">Total Fibras</span>
                          <span className="font-bold text-xl text-purple-600">{totalGeral}</span>
                        </div>
                      </div>
                    </div>
                  );
                };
                
                // USAR CORES DIRETAMENTE DO colorMap GLOBAL
                const colors = {
                  transporte: colorMap["Transporte"],
                  indisponiveis: colorMap["Indisponíveis"],
                  totalReparadas: colorMap["Total Reparadas"],
                  reconhecidas: colorMap["Reconhecidas"],
                  depPassagem: colorMap["Dep. de Passagem de Cabo"],
                  depLicenca: colorMap["Dep. de Licença"],
                  depCutover: colorMap["Dep. de Cutover"],
                  fibrasDep: colorMap[`Fibras dependentes da ${selectedOperator}`]
                };
                
                // Função para renderizar gráfico com ROTAS INDIVIDUAIS (nome completo, barras alinhadas)
                const renderCompactRoutesChart = (routes, title, borderColor, maxNameWidth) => {
                  const containerClass = borderColor === 'red' ? 'bg-white rounded-lg border-2 border-red-400 p-3 shadow-lg h-full flex flex-col overflow-hidden' :
                                        borderColor === 'green' ? 'bg-white rounded-lg border-2 border-green-400 p-3 shadow-lg h-full flex flex-col overflow-hidden' :
                                        'bg-white rounded-lg border-2 border-blue-400 p-3 shadow-lg h-full flex flex-col overflow-hidden';
                  
                  const headerClass = borderColor === 'red' ? 'bg-gradient-to-r from-red-50 to-red-100 -mx-3 -mt-3 px-3 py-2 mb-2 border-b-2 border-red-300' :
                                     borderColor === 'green' ? 'bg-gradient-to-r from-green-50 to-green-100 -mx-3 -mt-3 px-3 py-2 mb-2 border-b-2 border-green-300' :
                                     'bg-gradient-to-r from-blue-50 to-blue-100 -mx-3 -mt-3 px-3 py-2 mb-2 border-b-2 border-blue-300';
                  
                  if (!routes || routes.length === 0) {
                    return (
                      <div className={containerClass}>
                        <div className={headerClass}>
                          <h3 className="text-center text-xs font-bold text-gray-800">{title}</h3>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                          <p className="text-gray-500 text-xs">Sem rotas</p>
                        </div>
                      </div>
                    );
                  }
                  
                  // Calcular valor máximo para escala (incluindo Total Reparadas)
                  const maxValue = Math.max(...routes.map(r => r.transporte + r.indisponiveis + r.totalReparadas));
                  
                  // Altura dinâmica baseada no número de rotas
                  const barHeight = routes.length <= 3 ? 'h-6' : routes.length <= 5 ? 'h-5' : routes.length <= 8 ? 'h-4' : 'h-3.5';
                  const fontSize = routes.length <= 5 ? 'text-[10px]' : 'text-[9px]';
                  
                  return (
                    <div className={containerClass}>
                      <div className={headerClass}>
                        <h3 className="text-center text-xs font-bold text-gray-800">{title}</h3>
                      </div>
                      <p className="text-center text-[10px] font-semibold mb-2">Total: {routes.length} rotas</p>
                      
                      {/* Legenda COMPLETA - 3 status */}
                      <div className="flex justify-center gap-3 mb-2 text-[9px]">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2" style={{backgroundColor: colors.transporte}}></div>
                          <span>Transp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2" style={{backgroundColor: colors.indisponiveis}}></div>
                          <span>Indisp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2" style={{backgroundColor: colors.totalReparadas}}></div>
                          <span>Reparadas</span>
                        </div>
                      </div>
                      
                      {/* Todas as rotas - Barras alinhadas após nome mais longo */}
                      <div className="flex-1 flex flex-col justify-evenly min-h-0 gap-0.5">
                        {routes.map((route, idx) => {
                          const transpWidth = maxValue > 0 ? (route.transporte / maxValue) * 100 : 0;
                          const indispWidth = maxValue > 0 ? (route.indisponiveis / maxValue) * 100 : 0;
                          const reparadasWidth = maxValue > 0 ? (route.totalReparadas / maxValue) * 100 : 0;
                          
                          // v3.22.1: Verificar se tem reparação na semana selecionada
                          const weekData = data[selectedOperator]?.[selectedWeek]?.[route.rota];
                          const reparadasNaSemana = weekData ? (parseInt(weekData['Total Reparadas']) || 0) : 0;
                          const temReparacao = reparadasNaSemana > 0;
                          
                          return (
                            <div key={idx} className="flex items-center gap-1.5 min-w-0">
                              {/* Nome COMPLETO - VERDE se tem reparação */}
                              <div 
                                className={`${fontSize} font-medium flex-shrink-0 ${temReparacao ? 'text-green-600 font-bold' : 'text-gray-700'}`}
                                style={{ width: `${maxNameWidth}px` }}
                                title={route.rota}
                              >
                                {route.rota}
                              </div>
                              
                              {/* Barra empilhada - 3 segmentos: T + I + R */}
                              <div className={`flex ${barHeight} bg-gray-100 rounded overflow-hidden border border-gray-300 flex-1 min-w-0`}>
                                {/* Segmento Transporte */}
                                {route.transporte > 0 && (
                                  <div 
                                    className={`flex items-center justify-center text-white font-bold ${fontSize}`}
                                    style={{
                                      width: `${transpWidth}%`,
                                      backgroundColor: colors.transporte,
                                      minWidth: '0'
                                    }}
                                  >
                                    {route.transporte}
                                  </div>
                                )}
                                
                                {/* Segmento Indisponíveis */}
                                {route.indisponiveis > 0 && (
                                  <div 
                                    className={`flex items-center justify-center text-white font-bold ${fontSize}`}
                                    style={{
                                      width: `${indispWidth}%`,
                                      backgroundColor: colors.indisponiveis,
                                      minWidth: '0'
                                    }}
                                  >
                                    {route.indisponiveis}
                                  </div>
                                )}
                                
                                {/* Segmento Total Reparadas */}
                                {route.totalReparadas > 0 && (
                                  <div 
                                    className={`flex items-center justify-center text-white font-bold ${fontSize}`}
                                    style={{
                                      width: `${reparadasWidth}%`,
                                      backgroundColor: colors.totalReparadas,
                                      minWidth: '0'
                                    }}
                                  >
                                    {route.totalReparadas}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                };
                
                // Função para renderizar gráfico DADOS GERAIS (barra horizontal empilhada - 8 status)
                const renderCompactChart = (routes, title, borderColor) => {
                  const containerClass = 'bg-white rounded-lg border-2 border-gray-400 p-3 shadow-lg h-full flex flex-col';
                  const headerClass = 'bg-gradient-to-r from-gray-50 to-gray-100 -mx-3 -mt-3 px-3 py-2 mb-3 border-b-2 border-gray-300';
                  
                  if (!routes || routes.length === 0) {
                    return (
                      <div className={containerClass}>
                        <div className={headerClass}>
                          <h3 className="text-center text-sm font-bold text-gray-800">{title}</h3>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                          <p className="text-gray-500 text-sm">Sem dados</p>
                        </div>
                      </div>
                    );
                  }
                  
                  // V5.08.6: Calcular totais
                  // Transporte é ISOLADO (mostra valor mas não entra em percentagem)
                  const totals = {
                    transporte: routes.reduce((sum, r) => sum + r.transporte, 0),
                    totalReparadas: routes.reduce((sum, r) => sum + r.totalReparadas, 0),
                    reconhecidas: routes.reduce((sum, r) => sum + r.reconhecidas, 0),
                    depPassagem: routes.reduce((sum, r) => sum + r.depPassagem, 0),
                    depLicenca: routes.reduce((sum, r) => sum + r.depLicenca, 0),
                    depCutover: routes.reduce((sum, r) => sum + r.depCutover, 0),
                    fibrasDep: routes.reduce((sum, r) => sum + r.fibrasDep, 0)
                  };
                  
                  // V5.08.6: Indisponíveis = soma das subcategorias
                  totals.indisponiveis = totals.reconhecidas + totals.depPassagem + 
                                         totals.depLicenca + totals.depCutover + totals.fibrasDep;
                  
                  // V5.08.7: Total para percentagem = APENAS Reparadas + Indisponíveis
                  // Transporte NÃO entra no cálculo de percentagem (isolado)
                  const totalSum = totals.totalReparadas + totals.indisponiveis;
                  
                  // V5.08.7: Total GERAL para largura da barra (inclui Transporte)
                  const totalGeral = totals.transporte + totals.totalReparadas + totals.indisponiveis;
                  
                  const statusLabels = {
                    transporte: 'Transporte', // V5.08.6: Isolado (sem %)
                    totalReparadas: 'Total Reparadas',
                    indisponiveis: 'Indisponíveis',
                    reconhecidas: 'Reconhecidas',
                    depPassagem: 'Dep. Passagem',
                    depLicenca: 'Dep. Licença',
                    depCutover: 'Dep. Cutover',
                    fibrasDep: 'Fibras Dep.'
                  };
                  
                  return (
                    <div className={containerClass}>
                      <div className={headerClass}>
                        <h3 className="text-center text-sm font-bold text-gray-800">{title}</h3>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center px-4">
                        <p className="text-center text-xs font-semibold mb-3">Total: {routes.length} rotas</p>
                        
                        {/* V5.08.14: Barra com subtipos ordenados CRESCENTE + FONTE FIXA 10px */}
                        <div className="mb-4">
                          <div className="flex h-10 bg-gray-100 rounded overflow-hidden border-2 border-gray-300 shadow-sm">
                            {(() => {
                              // V5.08.12: Ordenar subtipos por valor crescente
                              const subtipos = ['reconhecidas', 'depPassagem', 'depLicenca', 'depCutover', 'fibrasDep'];
                              const subtiposOrdenados = subtipos
                                .map(key => ({ key, value: totals[key] }))
                                .sort((a, b) => a.value - b.value) // Crescente
                                .map(item => item.key);
                              
                              // Ordem final: Transporte → Indisponíveis → Subtipos (crescente) → Total Reparadas
                              const ordem = ['transporte', 'indisponiveis', ...subtiposOrdenados, 'totalReparadas'];
                              
                              return ordem.map(key => {
                                const value = totals[key];
                                if (value === 0) return null;
                                
                                const width = (value / totalGeral) * 100;
                                
                                // V5.08.14: FONTE FIXA - sempre 10px, nunca reduz
                                
                                return (
                                  <div
                                    key={key}
                                    className="flex items-center justify-center text-white font-bold text-[10px]"
                                    style={{
                                      width: `${width}%`,
                                      backgroundColor: colors[key]
                                    }}
                                    title={`${statusLabels[key]}: ${value}`}
                                  >
                                    <span className="px-0.5">{value}</span>
                                  </div>
                                );
                              });
                            })()}
                          </div>
                        </div>
                        
                        {/* V5.08.12: Legenda com subtipos em ordem CRESCENTE */}
                        <div className="flex justify-center items-start gap-6 text-[10px]">
                          {/* Transporte */}
                          {totals.transporte > 0 && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{backgroundColor: colors.transporte}}></div>
                              <span className="whitespace-nowrap font-medium">
                                <strong>Transporte:</strong> {totals.transporte}
                              </span>
                            </div>
                          )}
                          
                          {/* Indisponíveis com subtipos abaixo (ordenados crescente) */}
                          {totals.indisponiveis > 0 && (
                            <div className="flex flex-col items-start">
                              {/* Indisponíveis principal */}
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{backgroundColor: colors.indisponiveis}}></div>
                                <span className="whitespace-nowrap font-medium">
                                  <strong>Indisponíveis:</strong> {totals.indisponiveis}
                                  <span className="text-gray-600"> ({((totals.indisponiveis / totalSum) * 100).toFixed(1)}%)</span>
                                </span>
                              </div>
                              
                              {/* V5.08.12: Subtipos ORDENADOS por valor crescente */}
                              <div className="flex flex-col gap-0.5 pl-5 text-[9px]">
                                {(() => {
                                  const subtipos = ['reconhecidas', 'depPassagem', 'depLicenca', 'depCutover', 'fibrasDep'];
                                  
                                  // Ordenar por valor crescente
                                  return subtipos
                                    .map(key => ({ key, value: totals[key] }))
                                    .sort((a, b) => a.value - b.value)
                                    .map(({ key, value }) => {
                                      if (value === 0) return null;
                                      
                                      const percentage = totals.indisponiveis > 0 
                                        ? ((value / totals.indisponiveis) * 100).toFixed(1) 
                                        : 0;
                                      
                                      return (
                                        <div key={key} className="flex items-center gap-1.5">
                                          <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{backgroundColor: colors[key]}}></div>
                                          <span className="whitespace-nowrap">
                                            {statusLabels[key]}: <strong>{value}</strong>
                                            <span className="text-gray-500"> ({percentage}%)</span>
                                          </span>
                                        </div>
                                      );
                                    });
                                })()}
                              </div>
                            </div>
                          )}
                          
                          {/* Total Reparadas */}
                          {totals.totalReparadas > 0 && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{backgroundColor: colors.totalReparadas}}></div>
                              <span className="whitespace-nowrap font-medium">
                                <strong>Total Reparadas:</strong> {totals.totalReparadas}
                                <span className="text-gray-600"> ({((totals.totalReparadas / totalSum) * 100).toFixed(1)}%)</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                };
                
                // Função para renderizar um gráfico
                const renderChart = (routes, title, borderColor, bgColor, dotColor) => {
                  if (routes.length === 0) {
                    return (
                      <div className={bgColor === 'red' ? 'bg-red-50 rounded-lg border-2 border-red-200 p-8 text-center' : 
                                     bgColor === 'green' ? 'bg-green-50 rounded-lg border-2 border-green-200 p-8 text-center' : 
                                     'bg-blue-50 rounded-lg border-2 border-blue-200 p-8 text-center'}>
                        <p className={borderColor === 'red' ? 'text-red-600 font-semibold' : 
                                     borderColor === 'green' ? 'text-green-600 font-semibold' : 
                                     'text-blue-600 font-semibold'}>
                          ✓ Sem rotas {title.toLowerCase()} em {selectedWeek}
                        </p>
                      </div>
                    );
                  }
                  
                  const maxValue = Math.max(...routes.map(r => 
                    Math.max(r.transporte, r.indisponiveis, r.totalReparadas, r.reconhecidas, r.depPassagem, r.depLicenca, r.depCutover, r.fibrasDep)
                  ));
                  
                  // LARGURAS DINÂMICAS baseadas no número de rotas
                  const numRotas = routes.length;
                  const containerWidth = 1200; // Largura fixa do container
                  const margins = 200; // Margens lateral
                  const availableWidth = containerWidth - margins;
                  
                  // Calcular largura de cada grupo dinamicamente
                  const groupGap = numRotas <= 5 ? 40 : numRotas <= 10 ? 20 : 10;
                  const totalGaps = (numRotas - 1) * groupGap;
                  const widthPerGroup = (availableWidth - totalGaps) / numRotas;
                  
                  // Calcular largura de cada barra (8 barras por grupo)
                  const barGap = 2;
                  const totalBarGaps = 7 * barGap; // 7 gaps entre 8 barras
                  const barWidth = Math.max(3, (widthPerGroup - totalBarGaps) / 8); // Mínimo 3px
                  
                  const groupWidth = (barWidth * 8) + totalBarGaps;
                  const svgWidth = containerWidth;
                  
                  // v3.24.1: Altura dinâmica baseada no número de rotas
                  // Menos rotas = menos espaço para nomes oblíquos
                  const labelSpaceNeeded = numRotas <= 3 ? 60 : numRotas <= 6 ? 80 : numRotas <= 10 ? 100 : 110;
                  const svgHeight = 280 + labelSpaceNeeded; // Base 280 + espaço para labels
                  
                  const chartTop = 50;
                  const chartBottom = svgHeight - labelSpaceNeeded;
                  const chartHeight = chartBottom - chartTop;
                  
                  // Classes fixas por cor
                  const containerClass = borderColor === 'red' ? 'bg-white rounded-lg shadow-xl border-2 border-red-400 p-6' :
                                        borderColor === 'green' ? 'bg-white rounded-lg shadow-xl border-2 border-green-400 p-6' :
                                        'bg-white rounded-lg shadow-xl border-2 border-blue-400 p-6';
                  
                  const headerClass = borderColor === 'red' ? 'bg-gradient-to-r from-red-50 to-white border-b-2 border-red-300 pb-4 mb-4 -mx-6 -mt-6 px-6 pt-4' :
                                     borderColor === 'green' ? 'bg-gradient-to-r from-green-50 to-white border-b-2 border-green-300 pb-4 mb-4 -mx-6 -mt-6 px-6 pt-4' :
                                     'bg-gradient-to-r from-blue-50 to-white border-b-2 border-blue-300 pb-4 mb-4 -mx-6 -mt-6 px-6 pt-4';
                  
                  const dotClass = borderColor === 'red' ? 'w-3 h-3 bg-red-500 rounded-full' :
                                  borderColor === 'green' ? 'w-3 h-3 bg-green-500 rounded-full' :
                                  'w-3 h-3 bg-blue-500 rounded-full';
                  
                  const totalClass = borderColor === 'red' ? 'font-bold text-sm text-red-600' :
                                    borderColor === 'green' ? 'font-bold text-sm text-green-600' :
                                    'font-bold text-sm text-blue-600';
                  
                  return (
                    <div className={containerClass} style={{ position: 'relative' }}>
                      {/* v3.25.0: Estilos para hover */}
                      <style>{`
                        .rota-group:hover .hover-bg {
                          opacity: 0.6 !important;
                        }
                        .rota-group:hover .bar-rect {
                          filter: brightness(1.15);
                          stroke: #1e40af !important;
                          stroke-width: 2 !important;
                        }
                        .rota-group text {
                          transition: all 0.2s ease;
                        }
                        .rota-group:hover text {
                          font-weight: bold !important;
                          filter: brightness(0.85);
                        }
                      `}</style>
                      
                      {/* HEADER DO GRÁFICO */}
                      <div className={headerClass}>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-1">
                            <div className={dotClass}></div>
                            <h3 className="text-lg font-bold text-gray-800">{title} - {selectedOperator}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{selectedWeek} - Quadrimestre {selectedQuarter} {selectedYear}</p>
                        </div>
                      </div>
                      
                      <div className="text-center mb-3">
                        <p className="text-xs text-gray-600">
                          Total de rotas: <span className={totalClass}>{routes.length}</span>
                        </p>
                      </div>
                      
                      {/* v3.24.0: LEGENDA NO TOPO para otimizar espaço */}
                      <div className="mb-4 flex justify-center">
                        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                          {[
                            { label: 'Transporte', color: colors.transporte },
                            { label: 'Indisponíveis', color: colors.indisponiveis },
                            { label: 'Total Reparadas', color: colors.totalReparadas },
                            { label: 'Reconhecidas', color: colors.reconhecidas },
                            { label: 'Dep. Passagem', color: colors.depPassagem },
                            { label: 'Dep. Licença', color: colors.depLicenca },
                            { label: 'Dep. Cutover', color: colors.depCutover },
                            { label: `Fibras Dep. ${selectedOperator}`, color: colors.fibrasDep }
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{backgroundColor: item.color}}></div>
                              <span className="text-[10px] text-gray-600">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* SEM overflow-x-auto - Tudo cabe na largura fixa */}
                      <div className="flex justify-center">
                        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
                          {/* Grid horizontal */}
                          {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                            const y = chartBottom - (pct * chartHeight);
                            const value = Math.round(pct * maxValue);
                            return (
                              <g key={pct}>
                                <line x1="80" y1={y} x2={svgWidth - 40} y2={y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
                                <text x="70" y={y + 4} fontSize="10" fill="#6b7280" textAnchor="end">{value}</text>
                              </g>
                            );
                          })}
                          
                          {/* Barras agrupadas */}
                          {routes.map((route, idx) => {
                            const x = 100 + (idx * (groupWidth + groupGap));
                            const bars = [
                              { value: route.transporte, color: colors.transporte, label: 'Transporte' },
                              { value: route.indisponiveis, color: colors.indisponiveis, label: 'Indisponíveis' },
                              { value: route.totalReparadas, color: colors.totalReparadas, label: 'Total Reparadas' },
                              { value: route.reconhecidas, color: colors.reconhecidas, label: 'Reconhecidas' },
                              { value: route.depPassagem, color: colors.depPassagem, label: 'Dep. Passagem' },
                              { value: route.depLicenca, color: colors.depLicenca, label: 'Dep. Licença' },
                              { value: route.depCutover, color: colors.depCutover, label: 'Dep. Cutover' },
                              { value: route.fibrasDep, color: colors.fibrasDep, label: 'Fibras Dep.' }
                            ];
                            
                            return (
                              <g 
                                key={idx}
                                className="rota-group"
                                style={{cursor: 'pointer'}}
                                onClick={() => handleRotaClick(route.rota)}
                                onMouseEnter={() => {
                                  setTooltipData({
                                    rota: route.rota,
                                    transporte: route.transporte,
                                    indisponiveis: route.indisponiveis,
                                    totalReparadas: route.totalReparadas,
                                    reconhecidas: route.reconhecidas,
                                    depPassagem: route.depPassagem,
                                    depLicenca: route.depLicenca,
                                    depCutover: route.depCutover,
                                    fibrasDep: route.fibrasDep
                                  });
                                }}
                                onMouseMove={(e) => {
                                  // v3.26.0: Capturar posição do mouse relativa ao SVG
                                  const svg = e.currentTarget.ownerSVGElement;
                                  const pt = svg.createSVGPoint();
                                  pt.x = e.clientX;
                                  pt.y = e.clientY;
                                  const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
                                  setTooltipPosition({ x: svgP.x, y: svgP.y });
                                }}
                                onMouseLeave={() => {
                                  setTooltipData(null);
                                }}
                              >
                                {/* v3.25.1: Área invisível de hover (sem title SVG nativo) */}
                                <rect
                                  x={x - 5}
                                  y={chartTop - 10}
                                  width={groupWidth + 10}
                                  height={svgHeight - chartTop}
                                  fill="transparent"
                                  className="hover-area"
                                />
                                
                                {/* Retângulo de fundo que aparece no hover */}
                                <rect
                                  x={x - 5}
                                  y={chartTop - 10}
                                  width={groupWidth + 10}
                                  height={chartBottom - chartTop + 15}
                                  fill="#f0f9ff"
                                  opacity="0"
                                  className="hover-bg"
                                  pointerEvents="none"
                                />
                                
                                {bars.map((bar, barIdx) => {
                                  const barX = x + (barIdx * (barWidth + barGap));
                                  const barHeight = (bar.value / maxValue) * chartHeight;
                                  const barY = chartBottom - barHeight;
                                  
                                  return (
                                    <g key={barIdx}>
                                      {bar.value > 0 && (
                                        <>
                                          <rect
                                            x={barX}
                                            y={barY}
                                            width={barWidth}
                                            height={barHeight}
                                            fill={bar.color}
                                            stroke="#fff"
                                            strokeWidth="1"
                                            rx="2"
                                            className="bar-rect"
                                          />
                                          <text
                                            x={barX + barWidth / 2}
                                            y={barY - 4}
                                            fontSize="9"
                                            fontWeight="bold"
                                            fill={bar.color}
                                            textAnchor="middle"
                                            pointerEvents="none"
                                          >
                                            {bar.value}
                                          </text>
                                        </>
                                      )}
                                    </g>
                                  );
                                })}
                                
                                {/* v3.24.4: Nomes ALINHADOS na mesma linha vertical */}
                                {(() => {
                                  // Verificar reparação na semana
                                  const weekData = data[selectedOperator]?.[selectedWeek]?.[route.rota];
                                  const reparadasNaSemana = weekData ? (parseInt(weekData['Total Reparadas']) || 0) : 0;
                                  const temReparacao = reparadasNaSemana > 0;
                                  const textColor = temReparacao ? "#16a34a" : "#4b5563"; // Verde ou cinza
                                  const fontWeight = temReparacao ? "bold" : "normal";
                                  
                                  // Quebrar no hífen
                                  const parts = route.rota.split(' - ');
                                  const parte1 = parts[0] || '';
                                  const parte2 = parts[1] || '';
                                  
                                  // Ponto de ancoragem ABAIXO do eixo
                                  const anchorY = chartBottom + 5;
                                  const baseX = x + groupWidth / 2;
                                  
                                  // v3.24.4: Para rotação -45°, ajustar X da segunda linha
                                  // Se Y aumenta 12px, X deve aumentar 12px para manter alinhamento vertical
                                  const deltaY = 12;
                                  const deltaX = deltaY; // Mesmo valor para -45°
                                  
                                  return (
                                    <>
                                      {/* Primeira parte */}
                                      <text
                                        x={baseX}
                                        y={anchorY}
                                        fontSize="9"
                                        fill={textColor}
                                        fontWeight={fontWeight}
                                        textAnchor="end"
                                        transform={`rotate(-45 ${baseX} ${anchorY})`}
                                      >
                                        {parte1}
                                      </text>
                                      
                                      {/* Segunda parte - X ajustado para alinhar */}
                                      {parte2 && (
                                        <text
                                          x={baseX + deltaX}
                                          y={anchorY + deltaY}
                                          fontSize="9"
                                          fill={textColor}
                                          fontWeight={fontWeight}
                                          textAnchor="end"
                                          transform={`rotate(-45 ${baseX + deltaX} ${anchorY + deltaY})`}
                                        >
                                          {parte2}
                                        </text>
                                      )}
                                    </>
                                  );
                                })()}
                              </g>
                            );
                          })}
                          
                          {/* v3.26.1: Tooltip SVG melhorado */}
                          {tooltipData && tooltipPosition && (() => {
                            // v3.26.1: Largura maior para evitar sobreposição
                            const tooltipWidth = 240;
                            const tooltipPadding = 10;
                            const isRightSide = tooltipPosition.x > svgWidth / 2;
                            const tooltipX = isRightSide ? 
                              tooltipPosition.x - tooltipWidth - tooltipPadding : 
                              tooltipPosition.x + tooltipPadding;
                            const tooltipY = tooltipPosition.y - 10;
                            
                            // v3.26.1: Quebrar nome no hífen
                            const rotaParts = tooltipData.rota.split(' - ');
                            const rotaParte1 = rotaParts[0] || '';
                            const rotaParte2 = rotaParts[1] || '';
                            
                            // Contar quantos status têm valor > 0 com cores corretas
                            const statusList = [];
                            if (tooltipData.transporte > 0) statusList.push({ 
                              label: 'Transporte', 
                              value: tooltipData.transporte, 
                              textColor: '#fff',
                              dotColor: colors.transporte 
                            });
                            if (tooltipData.indisponiveis > 0) statusList.push({ 
                              label: 'Indisponíveis', 
                              value: tooltipData.indisponiveis, 
                              textColor: '#ef4444',
                              dotColor: colors.indisponiveis 
                            });
                            if (tooltipData.totalReparadas > 0) statusList.push({ 
                              label: 'Total Reparadas', 
                              value: tooltipData.totalReparadas, 
                              textColor: '#22c55e',
                              dotColor: colors.totalReparadas 
                            });
                            if (tooltipData.reconhecidas > 0) statusList.push({ 
                              label: 'Reconhecidas', 
                              value: tooltipData.reconhecidas, 
                              textColor: '#fff',
                              dotColor: colors.reconhecidas 
                            });
                            if (tooltipData.depPassagem > 0) statusList.push({ 
                              label: 'Dep. de Passagem de Cabo', 
                              value: tooltipData.depPassagem, 
                              textColor: '#fff',
                              dotColor: colors.depPassagem 
                            });
                            if (tooltipData.depLicenca > 0) statusList.push({ 
                              label: 'Dep. de Licença', 
                              value: tooltipData.depLicenca, 
                              textColor: '#fff',
                              dotColor: colors.depLicenca 
                            });
                            if (tooltipData.depCutover > 0) statusList.push({ 
                              label: 'Dep. de Cutover', 
                              value: tooltipData.depCutover, 
                              textColor: '#fff',
                              dotColor: colors.depCutover 
                            });
                            if (tooltipData.fibrasDep > 0) statusList.push({ 
                              label: `Fibras dependentes da ${selectedOperator}`, 
                              value: tooltipData.fibrasDep, 
                              textColor: '#fff',
                              dotColor: colors.fibrasDep 
                            });
                            
                            const lineHeight = 16;
                            const headerHeight = rotaParte2 ? 38 : 24; // Mais alto se tem 2 linhas
                            const tooltipHeight = headerHeight + (statusList.length * lineHeight) + 16;
                            
                            return (
                              <g style={{ transition: 'all 0.15s ease-out' }}>
                                {/* Fundo do tooltip */}
                                <rect
                                  x={tooltipX}
                                  y={tooltipY}
                                  width={tooltipWidth}
                                  height={tooltipHeight}
                                  fill="rgba(31, 41, 55, 0.95)"
                                  stroke="#60a5fa"
                                  strokeWidth="1"
                                  rx="6"
                                  filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))"
                                />
                                
                                {/* v3.26.1: Título quebrado em 2 linhas */}
                                <text
                                  x={tooltipX + 10}
                                  y={tooltipY + 15}
                                  fontSize="12"
                                  fontWeight="bold"
                                  fill="white"
                                >
                                  {rotaParte1}
                                </text>
                                {rotaParte2 && (
                                  <text
                                    x={tooltipX + 10}
                                    y={tooltipY + 30}
                                    fontSize="12"
                                    fontWeight="bold"
                                    fill="white"
                                  >
                                    {rotaParte2}
                                  </text>
                                )}
                                
                                {/* Linha separadora */}
                                <line
                                  x1={tooltipX + 10}
                                  y1={tooltipY + headerHeight}
                                  x2={tooltipX + tooltipWidth - 10}
                                  y2={tooltipY + headerHeight}
                                  stroke="rgba(255, 255, 255, 0.2)"
                                  strokeWidth="1"
                                />
                                
                                {/* Status com bolinhas coloridas */}
                                {statusList.map((status, idx) => (
                                  <g key={idx}>
                                    {/* v3.26.1: Bolinha colorida */}
                                    <circle
                                      cx={tooltipX + 15}
                                      cy={tooltipY + headerHeight + 8 + (idx * lineHeight)}
                                      r="4"
                                      fill={status.dotColor}
                                    />
                                    
                                    {/* Label */}
                                    <text
                                      x={tooltipX + 24}
                                      y={tooltipY + headerHeight + 12 + (idx * lineHeight)}
                                      fontSize="10"
                                      fill="#9ca3af"
                                    >
                                      {status.label}:
                                    </text>
                                    
                                    {/* Valor alinhado à direita */}
                                    <text
                                      x={tooltipX + tooltipWidth - 10}
                                      y={tooltipY + headerHeight + 12 + (idx * lineHeight)}
                                      fontSize="10"
                                      fontWeight="bold"
                                      fill={status.textColor}
                                      textAnchor="end"
                                    >
                                      {status.value}
                                    </text>
                                  </g>
                                ))}
                              </g>
                            );
                          })()}
                        </svg>
                      </div>
                      
                    </div>
                  );
                };
                
                return (
                  <div>
                    {/* Renderizar Dashboard Provincial */}
                    {renderProvincialDashboard()}
                    
                    {/* Gráficos */}
                    {(() => {
                      // MODO VER TODOS (LAYOUT DINÂMICO INTELIGENTE)
                      if (viewModeClassificacao === 'all') {
                  // Calcular nome mais longo em TODAS as rotas
                  const allRouteNames = [
                    ...rotasDegradadas.map(r => r.rota),
                    ...rotasComGanho.map(r => r.rota),
                    ...rotasEstaveis.map(r => r.rota)
                  ];
                  const longestName = allRouteNames.reduce((a, b) => a.length > b.length ? a : b, '');
                  // Estimar largura: 7px por caractere
                  const maxNameWidth = Math.min(Math.max(longestName.length * 7, 120), 250);
                  
                  // Criar array apenas dos 3 cards de rotas (excluir DADOS GERAIS)
                  const routeCards = [
                    { component: renderCompactRoutesChart(rotasDegradadas, "ROTAS DEGRADADAS", "red", maxNameWidth), count: rotasDegradadas.length, type: 'degradadas' },
                    { component: renderCompactRoutesChart(rotasComGanho, "ROTAS COM GANHO", "green", maxNameWidth), count: rotasComGanho.length, type: 'ganho' },
                    { component: renderCompactRoutesChart(rotasEstaveis, "ROTAS ESTÁVEIS", "blue", maxNameWidth), count: rotasEstaveis.length, type: 'estaveis' }
                  ];
                  
                  // Ordenar por quantidade (crescente) para pegar o menor
                  const sortedByCount = [...routeCards].sort((a, b) => a.count - b.count);
                  const cardComMenosRotas = sortedByCount[0]; // Menor
                  const outrosCards = sortedByCount.slice(1).sort((a, b) => b.count - a.count); // Outros 2, ordenados decrescente
                  
                  return (
                    <div className="grid grid-cols-2 gap-4">
                      {/* LINHA 1: DADOS GERAIS (fixo) + Card com MENOS rotas */}
                      <div key="dados">
                        {renderCompactChart(
                          routesData, 
                          `DADOS GERAIS - PSM ${selectedOperator}${selectedProvince !== 'Todas' ? ` | ${selectedProvince}` : ''}`, 
                          'gray'
                        )}
                      </div>
                      <div key={cardComMenosRotas.type}>
                        {cardComMenosRotas.component}
                      </div>
                      
                      {/* LINHA 2: Outros 2 cards ordenados por quantidade (decrescente) */}
                      {outrosCards.map((card) => (
                        <div key={card.type}>{card.component}</div>
                      ))}
                    </div>
                  );
                }
                
                // MODO CARROSSEL
                return (
                  <div className="relative">
                    {/* Botão Anterior */}
                    <button 
                      onClick={goToPrevGraphClassificacao} 
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg border hover:bg-white hover:scale-110 transition-all disabled:opacity-30" 
                      disabled={currentGraphClassificacao === 0}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Container do Carrossel */}
                    <div className="overflow-hidden">
                      <div 
                        className="flex transition-transform duration-500 ease-in-out" 
                        style={{ transform: `translateX(-${currentGraphClassificacao * 100}%)` }}
                      >
                        {/* Slide 1: ROTAS DEGRADADAS */}
                        <div className="w-full flex-shrink-0 px-4">
                          {renderChart(rotasDegradadas, "ROTAS DEGRADADAS", "red", "red")}
                        </div>
                        
                        {/* Slide 2: ROTAS COM GANHO */}
                        <div className="w-full flex-shrink-0 px-4">
                          {renderChart(rotasComGanho, "ROTAS COM GANHO", "green", "green")}
                        </div>
                        
                        {/* Slide 3: ROTAS ESTÁVEIS */}
                        <div className="w-full flex-shrink-0 px-4">
                          {renderChart(rotasEstaveis, "ROTAS ESTÁVEIS", "blue", "blue")}
                        </div>
                      </div>
                    </div>

                    {/* Botão Próximo */}
                    <button 
                      onClick={goToNextGraphClassificacao} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg border hover:bg-white hover:scale-110 transition-all disabled:opacity-30" 
                      disabled={currentGraphClassificacao === 2}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Indicadores */}
                    <div className="flex justify-center gap-2 mt-6">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          onClick={() => goToGraphClassificacao(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            currentGraphClassificacao === index 
                              ? 'bg-blue-600 w-8' 
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Ir para gráfico ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                );
                    })()}
                  </div>
                );
              })()}
            </div>
          </div>
          {/* TABELA DE ACOMPANHAMENTO - APENAS DADOS IMPORTADOS */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  📋 Acompanhamento Transporte vs Degradação - {selectedOperator} {selectedQuarter} {selectedYear}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                {/* Contador de importados */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">
                    {acompanhamentoData.length} importados
                  </span>
                </div>
                {/* Botão Limpar Dados */}
                {acompanhamentoData.length > 0 && (
                  <button
                    onClick={handleLimparJustificativas}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-300 rounded-lg transition-colors group"
                    title="Limpar todas as justificativas deste PSM e Quarter"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 group-hover:text-red-700" />
                    <span className="text-xs font-medium text-red-600 group-hover:text-red-700">
                      Limpar Dados
                    </span>
                  </button>
                )}
              </div>
            </div>
            {acompanhamentoData.length === 0 ? (
              // MENSAGEM QUANDO NÃO HÁ DADOS
              <div className="p-6">
                <div className="bg-blue-50 rounded-lg border-2 border-blue-300 p-8 text-center">
                  <div className="text-6xl mb-4">📥</div>
                  <p className="text-lg font-semibold text-gray-800 mb-2">
                    Nenhuma justificativa importada para {selectedOperator} - {selectedQuarter}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Use o botão "📥 Importar Justificativas" no menu lateral para carregar os dados.
                  </p>
                  <p className="text-xs text-gray-500">
                    Formatos aceitos: .xlsx, .xls, .csv
                  </p>
                </div>
              </div>
            ) : (
              // TABELA COM DADOS - OTIMIZADA
              <div className="p-4">
                {/* Container com scroll após 7 linhas */}
                <div 
                  className="overflow-auto border border-gray-200 rounded-lg"
                    style={{ maxHeight: acompanhamentoData.length > 7 ? '420px' : 'none' }}
                  >
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 z-20">
                        <tr className="bg-yellow-100 border-b-2 border-yellow-300">
                          <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-800 border-r border-yellow-200 sticky left-0 bg-yellow-100 z-30">Secção</th>
                          <th className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-yellow-200">Região</th>
                          <th className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-yellow-200 bg-slate-100">Transp. {quarterAnterior.label}</th>
                          <th className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-yellow-200 bg-red-100">Indisp.</th>
                          <th className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-yellow-200">Delta</th>
                          <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-800">Justificativa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentDataAcomp.map((row, index) => (
                          <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                            <td className="px-2 py-1.5 text-xs font-semibold text-gray-800 border-r border-gray-200 sticky left-0 bg-inherit z-10">
                              {row.seccao}
                            </td>
                            <td className="px-2 py-1.5 text-center text-xs text-gray-700 border-r border-gray-200">
                              {row.regiao}
                            </td>
                            <td className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-gray-200 bg-slate-50">
                              {row.transporteQ2}
                            </td>
                            <td className="px-2 py-1.5 text-center text-xs font-bold text-red-700 border-r border-gray-200 bg-red-50">
                              {row.indisponiveis}
                            </td>
                            <td className="px-2 py-1.5 text-center text-xs font-bold border-r border-gray-200">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                row.deltaIndisponibilidade.startsWith('+') 
                                  ? 'bg-red-100 text-red-700' 
                                  : row.deltaIndisponibilidade === '0' 
                                    ? 'bg-gray-100 text-gray-700' 
                                    : 'bg-green-100 text-green-700'
                              }`}>
                                {row.deltaIndisponibilidade}
                              </span>
                            </td>
                            <td className="px-2 py-1.5 text-xs text-gray-600 leading-snug max-w-lg">
                              {row.justificativa}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* PAGINAÇÃO + Contador */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-300 px-4 py-3 mt-0 rounded-b-lg">
                    <div className="flex items-center justify-between">
                      
                      {/* Botão Anterior */}
                      <button
                        onClick={goToPrevPageAcomp}
                        disabled={currentPageAcomp === 0}
                        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-all shadow-sm"
                      >
                        <span className="text-lg">←</span>
                        <span className="text-xs font-semibold text-blue-700">Anterior</span>
                      </button>
                      
                      {/* Indicador Central */}
                      <div className="flex flex-col items-center">
                        <p className="text-xs text-gray-600 mb-1">
                          Mostrando <strong>{startIndexAcomp + 1}</strong> a <strong>{Math.min(endIndexAcomp, acompanhamentoData.length)}</strong> de <strong>{acompanhamentoData.length}</strong> secções
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-blue-700">
                            Página {currentPageAcomp + 1} de {totalPagesAcomp}
                          </span>
                          {/* Bolinhas indicadoras */}
                          <div className="flex space-x-1 ml-3">
                            {Array.from({ length: Math.min(totalPagesAcomp, 5) }, (_, i) => {
                              let pageIndex;
                              if (totalPagesAcomp <= 5) {
                                pageIndex = i;
                              } else if (currentPageAcomp < 2) {
                                pageIndex = i;
                              } else if (currentPageAcomp > totalPagesAcomp - 3) {
                                pageIndex = totalPagesAcomp - 5 + i;
                              } else {
                                pageIndex = currentPageAcomp - 2 + i;
                              }
                              return (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    pageIndex === currentPageAcomp 
                                      ? 'bg-blue-600 w-6' 
                                      : 'bg-blue-300'
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Botão Próximo */}
                      <button
                        onClick={goToNextPageAcomp}
                        disabled={currentPageAcomp >= totalPagesAcomp - 1}
                        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-all shadow-sm"
                      >
                        <span className="text-xs font-semibold text-blue-700">Próximo</span>
                        <span className="text-lg">→</span>
                      </button>
                      
                    </div>
                  </div>
              </div>
            )}
          </div>

            {/* Tabela de Introdução Manual - FASE 9: INPUTS CONTROLADOS */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div 
              className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setManualDataExpanded(!manualDataExpanded)}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    📝 Introdução Manual dos Dados - {selectedOperator} {selectedWeek} {selectedQuarter} {selectedYear}
                  </h2>
                  {!manualDataExpanded && (
                    <p className="text-xs text-gray-500 mt-1">
                      {ROUTES_BY_PSM[selectedOperator].length} rotas disponíveis • Clique para expandir
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">Editável</span>
                </div>
                <button 
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setManualDataExpanded(!manualDataExpanded);
                  }}
                  title={manualDataExpanded ? "Recolher seção" : "Expandir seção"}
                >
                  {manualDataExpanded ? (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                manualDataExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-4">

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>Dica:</strong> Digite valores numéricos. Salvamento automático.
                </p>
                <p className="text-xs text-purple-800 mt-1">
                  🔄 <strong>Lógica:</strong> Total Reparadas ↑ → Fibras Dependentes ↓
                </p>
              </div>
              
              {/* Container com scroll após 10 rotas */}
              <div 
                className="overflow-auto border border-gray-200 rounded-lg"
                style={{ maxHeight: ROUTES_BY_PSM[selectedOperator].length > 10 ? '500px' : 'none' }}
              >
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-yellow-50 border-b-2 border-yellow-200">
                      <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-yellow-200 sticky left-0 bg-yellow-50 z-30">Rota</th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">Transporte</th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">Indisponíveis</th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200 bg-green-100">
                        <div className="flex items-center justify-center space-x-1">
                          <span>Total Reparadas</span>
                          <span className="text-green-600" title="Conectado a Fibras Dependentes">🔗</span>
                        </div>
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">Reconhecidas</th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">Dep. de Passagem de Cabo</th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">Dep. de Licença</th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">Dep. de Cutover</th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 bg-purple-100">
                        <div className="flex items-center justify-center space-x-1">
                          <span>Fibras dependentes da {selectedOperator}</span>
                          <span className="text-purple-600" title="Reduz automaticamente">🔗</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROUTES_BY_PSM[selectedOperator].map((route, index) => (
                      <tr key={index} className={`h-4 border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                        <td className="px-1 py-0 text-[10px] leading-none text-gray-700 font-medium border-r border-gray-200 sticky left-0 bg-inherit z-10 max-h-5">{route}</td>
                        <td className="px-1.5 py-0 text-center text-xs text-gray-600 border-r border-gray-200">
                          <input 
                            type="text" 
                            value={getInputValue(selectedOperator, selectedWeek, route, 'Transporte')}
                            onChange={(e) => handleInputChange(selectedOperator, selectedWeek, route, 'Transporte', e.target.value)}
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" 
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-1.5 py-0 text-center text-xs text-gray-600 border-r border-gray-200">
                          <input 
                            type="text" 
                            value={getInputValue(selectedOperator, selectedWeek, route, 'Indisponíveis')}
                            onChange={(e) => handleInputChange(selectedOperator, selectedWeek, route, 'Indisponíveis', e.target.value)}
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" 
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-1.5 py-0 text-center text-xs text-gray-600 border-r border-gray-200 bg-green-50">
                          <input 
                            type="text" 
                            value={getInputValue(selectedOperator, selectedWeek, route, 'Total Reparadas')}
                            onChange={(e) => handleInputChange(selectedOperator, selectedWeek, route, 'Total Reparadas', e.target.value)}
                            onBlur={handleBlurTotalReparadas}
                            className="w-full text-center border border-green-300 rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-500 transition-colors bg-white" 
                            placeholder="-"
                            maxLength="4"
                            title="🔄 Altera automaticamente as Fibras Dependentes"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                          <input 
                            type="text" 
                            value={getInputValue(selectedOperator, selectedWeek, route, 'Reconhecidas')}
                            onChange={(e) => handleInputChange(selectedOperator, selectedWeek, route, 'Reconhecidas', e.target.value)}
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" 
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                          <input 
                            type="text" 
                            value={getInputValue(selectedOperator, selectedWeek, route, 'Dep. de Passagem de Cabo')}
                            onChange={(e) => handleInputChange(selectedOperator, selectedWeek, route, 'Dep. de Passagem de Cabo', e.target.value)}
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" 
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                          <input 
                            type="text" 
                            value={getInputValue(selectedOperator, selectedWeek, route, 'Dep. de Licença')}
                            onChange={(e) => handleInputChange(selectedOperator, selectedWeek, route, 'Dep. de Licença', e.target.value)}
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" 
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                          <input 
                            type="text" 
                            value={getInputValue(selectedOperator, selectedWeek, route, 'Dep. de Cutover')}
                            onChange={(e) => handleInputChange(selectedOperator, selectedWeek, route, 'Dep. de Cutover', e.target.value)}
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors" 
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 bg-purple-50">
                          <input 
                            type="text" 
                            value={getInputValue(selectedOperator, selectedWeek, route, `Fibras dependentes da ${selectedOperator}`)}
                            onChange={(e) => handleInputChange(selectedOperator, selectedWeek, route, `Fibras dependentes da ${selectedOperator}`, e.target.value)}
                            className="w-full text-center border-2 border-purple-400 rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-500 transition-colors bg-white" 
                            placeholder="-"
                            maxLength="4"
                            title="🔄 Reduz automaticamente quando Total Reparadas aumenta"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center">
                Mostrando todas as {ROUTES_BY_PSM[selectedOperator].length} rotas do PSM {selectedOperator}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* MODAL: Seleção do Tipo de Reparação */}
    <RepairTypeModal
      showRepairTypeModal={showRepairTypeModal}
      pendingRepairData={pendingRepairData}
      aplicarReparacaoPorTipo={aplicarReparacaoPorTipo}
      cancelarModal={cancelarModal}
    />
    
  </div>
  );
};

export default PSMMonitorApp;