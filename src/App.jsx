import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TrendingUp, Users, AlertTriangle, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';

import { cleanupOldData } from './services/localStorageService';

import { ALL_WEEKS } from './config/constants';
import { QUARTER_CONFIG } from './config/quarterConfig';
import { ROUTES_BY_PSM } from './config/routeConfig';
import { isRotaTestada as isRotaTestadaUtil, isRotaValidada as isRotaValidadaUtil, getSemanasTestadasNoQuarter as getSemanasTestadasNoQuarterUtil, getSemanasValidadasNoQuarter as getSemanasValidadasNoQuarterUtil, getSemanasTestadas as getSemanasTestadasUtil, getSemanasValidadas as getSemanasValidadasUtil, isRotaTestadaGlobalNoQuarter as isRotaTestadaGlobalNoQuarterUtil, isRotaValidadaGlobalNoQuarter as isRotaValidadaGlobalNoQuarterUtil, isRotaTestadaGlobal as isRotaTestadaGlobalUtil, isRotaValidadaGlobal as isRotaValidadaGlobalUtil, isRotaValidadaNoQuarter as isRotaValidadaNoQuarterUtil, isRotaTestadaNoQuarter as isRotaTestadaNoQuarterUtil } from './utils/routeUtils.js';
import { useFilters } from './hooks/state/useFilters.js';
import { useAppState } from './hooks/state/useAppState.js';
import { usePersistence } from './hooks/state/usePersistence.js';
import { useScrollHeader } from './hooks/state/useScrollHeader.js';
import { useTestes } from './hooks/business/useTestes.js';
import { useAlertas } from './hooks/business/useAlertas.js';
import { useIntervencoes } from './hooks/business/useIntervencoes.js';
import { useTendencias } from './hooks/business/useTendencias.js';
import { usePieChart } from './hooks/business/usePieChart.js';
import { useDashboard } from './hooks/business/useDashboard.js';
import { useIOHandlers } from './hooks/business/useIOHandlers.js';
import { useInputHandlers } from './hooks/business/useInputHandlers.js';
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
  
  // Limpeza automática do localStorage (V5.08.19)
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

  usePersistence({
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
  
  const modalTimerRef = useRef(null);
  const valorOriginalRef = useRef(null); // Guarda valor antes de começar a editar
  const skipNextSaveRef = useRef(false); // V5.08.17: Flag para evitar salvamento após delete

  // Constantes de paginação (estados vêm de useAppState)
  const itemsPerPageDrilldown = 16;
  const itemsPerPageAcomp = 10;
  const itemsPerPageNormalizadas = 6;
  const itemsPerPageIntervencoes = 5;
  const itemsPerPageSemIntervencao = 7;

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
  // FASE 9: I/O HANDLERS (extracted to useIOHandlers)
  // ============================================================================

  const {
    handleUploadJustificativas,
    handleSaveData,
    handleImportData,
    handleImportJustificativas,
    handleExportJSON,
    handleDownloadCSV,
    handleExportJustificativasCSV,
    handleViewState,
  } = useIOHandlers({
    data,
    setData,
    justificativas,
    setJustificativas,
    rotasTestadas,
    setRotasTestadas,
    rotasValidadas,
    setRotasValidadas,
    selectedOperator,
    selectedQuarter,
    selectedYear,
    setSaveStatus,
    setLastSaveTime,
    isRotaTestada,
    isRotaValidada,
  });

  // ============================================================================
  // FASE 9: INPUT HANDLERS (extracted to useInputHandlers)
  // ============================================================================

  const {
    buscarValorAnterior,
    handleInputChange,
    aplicarReparacaoPorTipo,
    cancelarModal,
    handleBlurTotalReparadas,
    getInputValue,
    handleRotaClick,
    handleStatusClick,
  } = useInputHandlers({
    data,
    setData,
    justificativas,
    distribuicaoReparacoes,
    setDistribuicaoReparacoes,
    selectedOperator,
    selectedQuarter,
    selectedYear,
    pendingRepairData,
    setPendingRepairData,
    showRepairTypeModal,
    setShowRepairTypeModal,
    valorOriginalRef,
    skipNextSaveRef,
    setSelectedRota,
    setShowModal,
    setSelectedStatusDrilldown,
    setCurrentPageDrilldown,
    setShowStatusDrilldown,
  });


  // ============================================================================




  useEffect(() => {
    setCurrentPageAcomp(0);
    setCurrentPageNormalizadas(0);
    setCurrentPageIntervencoes(0); // v3.20.1
    setCurrentPageSemIntervencao(0); // v3.40.66
  }, [selectedOperator, selectedQuarter]);

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

  // Configuração dos slides para o modo de apresentação
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