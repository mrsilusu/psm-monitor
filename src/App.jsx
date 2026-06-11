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
import ProvincialDashboard from './features/Dashboard/ProvincialDashboard.jsx';
import AnaliseContainer from './features/Analise/AnaliseContainer.jsx';
import ClassificacaoCarrossel from './features/Analise/ClassificacaoCarrossel.jsx';
import AcompanhamentoTable from './features/Analise/AcompanhamentoTable.jsx';
import RouteDetailModal from './features/DataEntry/RouteDetailModal.jsx';
import Sidebar from './features/Layout/Sidebar.jsx';
import HeaderFilters from './features/Layout/HeaderFilters.jsx';

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
      
      <RouteDetailModal
        showModal={showModal}
        selectedRota={selectedRota}
        setShowModal={setShowModal}
        selectedOperator={selectedOperator}
        selectedQuarter={selectedQuarter}
        selectedYear={selectedYear}
      />
      
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
      <Sidebar
        menuOpen={menuOpen}
        setPresentationMode={setPresentationMode}
        handleDownloadCSV={handleDownloadCSV}
        handleImportData={handleImportData}
        handleUploadJustificativas={handleUploadJustificativas}
        handleExportJSON={handleExportJSON}
        handleExportJustificativasCSV={handleExportJustificativasCSV}
        handleViewState={handleViewState}
      />

      {/* Conteúdo Principal */}
      <div ref={scrollContainerRef} className="flex-1 overflow-auto">
        
        {/* HEADER + FILTROS UNIFICADOS */}
        <HeaderFilters
          headerVisible={headerVisible}
          isMobileDevice={isMobileDevice}
          showMobileWarning={showMobileWarning}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          saveStatus={saveStatus}
          lastSaveTime={lastSaveTime}
          selectedOperator={selectedOperator}
          setSelectedOperator={setSelectedOperator}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          selectedQuarter={selectedQuarter}
          setSelectedQuarter={setSelectedQuarter}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          showTestesAnalises={showTestesAnalises}
          setShowTestesAnalises={setShowTestesAnalises}
          alertasAbertos={alertasAbertos}
          setAlertasAbertos={setAlertasAbertos}
          alertas={alertas}
          alertasLidos={alertasLidos}
          setAlertasLidos={setAlertasLidos}
          summaryCards={summaryCards}
          handleStatusClick={handleStatusClick}
          isVisible={isVisible}
        />

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
          <ProvincialDashboard
            selectedOperator={selectedOperator}
            selectedProvince={selectedProvince}
            selectedQuarter={selectedQuarter}
            selectedWeek={selectedWeek}
            topRotasCriticas={topRotasCriticas}
            intervencoesRecentes={intervencoesRecentes}
            rotasNormalizadas={rotasNormalizadas}
            rotasMaisIntervencionadas={rotasMaisIntervencionadas}
            rotasSemIntervencao={rotasSemIntervencao}
            handleRotaClick={handleRotaClick}
            data={data}
            currentPageNormalizadas={currentPageNormalizadas}
            setCurrentPageNormalizadas={setCurrentPageNormalizadas}
            currentPageIntervencoes={currentPageIntervencoes}
            setCurrentPageIntervencoes={setCurrentPageIntervencoes}
            currentPageSemIntervencao={currentPageSemIntervencao}
            setCurrentPageSemIntervencao={setCurrentPageSemIntervencao}
            itemsPerPageIntervencoes={itemsPerPageIntervencoes}
            itemsPerPageSemIntervencao={itemsPerPageSemIntervencao}
            itemsPerPageNormalizadas={itemsPerPageNormalizadas}
          />

          {/* v3.9.0: Gráfico Semicircular CORRETO - Distribuição por Status */}
          {/* v3.13.0: Análise Comparativa - 2 Colunas Lado a Lado Estilo Performance */}
          <AnaliseContainer
            selectedProvince={selectedProvince}
            selectedQuarter={selectedQuarter}
            selectedWeek={selectedWeek}
            selectedYear={selectedYear}
            data={data}
            trendData={trendData}
            pieChartData={pieChartData}
            hoveredPieSlice={hoveredPieSlice}
            setHoveredPieSlice={setHoveredPieSlice}
            hoveredWeekIndex={hoveredWeekIndex}
            setHoveredWeekIndex={setHoveredWeekIndex}
          />

          {/* v3.14.81: GRÁFICOS POR CLASSIFICAÇÃO COM CARROSSEL */}
          <ClassificacaoCarrossel
            selectedOperator={selectedOperator}
            selectedProvince={selectedProvince}
            selectedQuarter={selectedQuarter}
            selectedWeek={selectedWeek}
            selectedYear={selectedYear}
            handleRotaClick={handleRotaClick}
            data={data}
            distribuicaoReparacoes={distribuicaoReparacoes}
            viewMode={viewMode}
            setViewMode={setViewMode}
            viewModeClassificacao={viewModeClassificacao}
            setViewModeClassificacao={setViewModeClassificacao}
            currentGraph={currentGraph}
            setCurrentGraph={setCurrentGraph}
            currentGraphClassificacao={currentGraphClassificacao}
            setCurrentGraphClassificacao={setCurrentGraphClassificacao}
            goToNextGraph={goToNextGraph}
            goToPrevGraph={goToPrevGraph}
            goToGraph={goToGraph}
            goToNextGraphClassificacao={goToNextGraphClassificacao}
            goToPrevGraphClassificacao={goToPrevGraphClassificacao}
            goToGraphClassificacao={goToGraphClassificacao}
            toggleViewMode={toggleViewMode}
            toggleViewModeClassificacao={toggleViewModeClassificacao}
            quarterWeeks={quarterWeeks}
            tooltipData={tooltipData}
            setTooltipData={setTooltipData}
            tooltipPosition={tooltipPosition}
            setTooltipPosition={setTooltipPosition}
          />
          {/* TABELA DE ACOMPANHAMENTO - APENAS DADOS IMPORTADOS */}
          <AcompanhamentoTable
            selectedOperator={selectedOperator}
            selectedQuarter={selectedQuarter}
            selectedWeek={selectedWeek}
            selectedYear={selectedYear}
            acompanhamentoData={acompanhamentoData}
            currentPageAcomp={currentPageAcomp}
            setCurrentPageAcomp={setCurrentPageAcomp}
            itemsPerPageAcomp={itemsPerPageAcomp}
            handleInputChange={handleInputChange}
            getInputValue={getInputValue}
            manualDataExpanded={manualDataExpanded}
            setManualDataExpanded={setManualDataExpanded}
            handleBlurTotalReparadas={handleBlurTotalReparadas}
          />
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