import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarChart3, TrendingUp, Users, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, TrendingDown, Home, Upload, FileJson, Download, Calendar, BarChart, FileText, Menu, PieChart, DownloadCloud, Trash2, AlertCircle } from 'lucide-react';

import { lerTudoDoSupabase, salvarTudoNoSupabase, salvarJustificativasNoSupabase, lerJustificativasDoSupabase } from './services/supabaseService';
import { salvarDistribuicaoNoSupabase, carregarDistribuicaoDoSupabase, limparDistribuicaoNoSupabase } from './services/supabaseDistribuicaoService';

const PSMMonitorApp = () => {
  console.log("🚀 PSM Monitor 5.08.7 - ORDEM CORRETA ! ✅");
  
  // ============================================================================
  // MAPEAMENTO DE ROTAS PARA PROVÍNCIAS
  // ============================================================================
  const routeToProvince = {
    // CABINDA (17 rotas - ISISTEL)
    'BSC_Cabinda - Quatro': 'Cabinda',
    'BSC_Cabinda - Resistencia (Cabo_1)': 'Cabinda',
    'BSC_Cabinda - Resistencia (Cabo_2)': 'Cabinda',
    'Cine_Popular - BSC_Cabinda': 'Cabinda',
    'Corda_Expansão_Cabassango': 'Cabinda',
    'Hoji_Cacongo - Belize': 'Cabinda',
    'Hoji_Cacongo - Massabe_Fronteira': 'Cabinda',
    'Lucola - Hoji_Cacongo': 'Cabinda',
    'Lucola - Tchizu_O': 'Cabinda',
    'Massabi_Fronteira - Belize': 'Cabinda',
    'PV_Grande_NT - Tchizu_O': 'Cabinda',
    'PV_Grande_NT - Yema_Fronteira': 'Cabinda',
    'Quatro - PV_Grande_NT': 'Cabinda',
    'Quatro - Tchizu_O': 'Cabinda',
    'Resistencia - Cine_Popular': 'Cabinda',
    'Resistencia - Lucola': 'Cabinda',
    'Tchizu_O - Cine_Popular': 'Cabinda',
    
    // ZAIRE (v3.40.0: 22 rotas - nomes padronizados)
    'Mucula - Soyo': 'Zaire',
    'Nzeto - Mucula': 'Zaire',
    'Nzeto - Soyo': 'Zaire',
    'Ambriz - N\'zeto': 'Zaire',
    'Lucenga - Mucula': 'Zaire',
    'Mbanza Congo - Noqui': 'Zaire',
    'Cuimba - Nguabi': 'Zaire',
    'Mbaza Centro - Cuimba': 'Zaire',
    'Tomboco - Lussenga': 'Zaire',
    'Tomboco - Mbanza Congo': 'Zaire',
    'Nzeto - Lussenga': 'Zaire',
    'Mbanza Congo_Sul - BSC ODF 3 (11 de Novembro)': 'Zaire',
    'Mbanza Congo_Sul - BSC ODF 4': 'Zaire',
    'Kimbumba - Soyo_Centro': 'Zaire',
    'Kwanda_DCS - Kwanda_O': 'Zaire',
    'Kwanda_DCS - Porto': 'Zaire',
    'Kwanda_DCS - Loja': 'Zaire',
    'Kwanda_O - Loja': 'Zaire',
    'Kwanda_O - Porto': 'Zaire',
    'Kwanda_DCS- ODFB1- JFO(288)ALNG': 'Zaire',
    'Kwanada_O (ODFB2)- JFO11 Porto': 'Zaire',
    'Kwanda_O (ODFB3)- JFO(288)- Azul Energi': 'Zaire',
    
    // UÍGE
    'Kimbundo - Uige (Inca)': 'Uíge',
    'Muquiama - Kimbundo': 'Uíge',
    'Nguabi - Damba': 'Uíge',
    'Damba - Uige(Negage_CRT)': 'Uíge',
    'Negage - Camabatela': 'Uíge',
    'Uíge - Negage': 'Uíge',
    'Camabatela - Lucala': 'Uíge',
    'Uíge_CTR - Unipop_Oeste ODF 2': 'Uíge',
    'Uíge_CTR - Unipop_Oeste ODF 1': 'Uíge',
    
    // MALANGE (v3.38.0: Nomes padronizados com routesByPSM.FIBRASOL)
    'Malange (Vila Matilde) - Mulo': 'Malanje',
    'Mulo - Cuango': 'Malanje',
    'Mussende - Malange (Catepa)': 'Malanje',
    'Calucinga - Mussende': 'Malanje',
    'Malange (Lumbo) - Lucala': 'Malanje',
    'BSC_Malange - Canambua': 'Malanje',
    'Hospital - Lumbo': 'Malanje',
    'Malange_CTR - Lumbo e Bsc': 'Malanje',
    'Lumbo - BSC_Malange': 'Malanje',
    'Canambua - Vila_Matilde': 'Malanje',
    'Vila_Matilde - Hospital': 'Malanje',
    'Maxinde (Expansão) - Lumbo': 'Malanje',
    'Maxinde (Expansão) - BSC': 'Malanje',
    
    // CUANZA NORTE (v3.40.1: 7 rotas - conforme imagem de referência)
    'Maria teresa Gulungo_Alto - Nadalatando': 'Cuanza Norte',
    'Alto Dondo - Quibala': 'Cuanza Norte',
    'Ndalatando - Alto_Dondo': 'Cuanza Norte',
    'Lucala - Ndalatando': 'Cuanza Norte',
    'Ndala Norte - Ndala_Leste': 'Cuanza Norte',
    'Ndala Norte - KN_Azul': 'Cuanza Norte',
    'Ndala_CTR(BSC Ndalatando) - KN_Azul': 'Cuanza Norte',
    
    // v3.35.0: CUANGO transferido para MALANJE (conforme imagem de referência)
    'Cuango - Cafunfo': 'Malanje',
    'Cuango - Caungula': 'Malanje',
    
    // LUNDA NORTE
    'Aeroporto - Estadio': 'Lunda Norte',
    'Cambacumba - Dundo': 'Lunda Norte',
    'Camissombo (Lucapa) - Dundo': 'Lunda Norte',
    'Caungula - Cuilo': 'Lunda Norte',
    'Chitato - Luachimo': 'Lunda Norte',
    'Cuilo - Cambacumba': 'Lunda Norte',
    'Dundo_CRT - Dundo_Norte': 'Lunda Norte',
    'Dundo_CRT - Samanhonga': 'Lunda Norte',
    'Dundo_CRT ODF1 - Dundo_CRT ODF2': 'Lunda Norte',
    'Dundo_Norte - Chitato': 'Lunda Norte',
    'Estadio - Loja_Dundo': 'Lunda Norte',
    'Loja_Dundo - Dundo_CRT': 'Lunda Norte',
    'Luachimo - Dundo_CRT': 'Lunda Norte',
    'Lucapa - Dundo': 'Lunda Norte',
    'Samanhonga - Aeroporto': 'Lunda Norte',
    
    // LUNDA SUL
    'Cazombo -- Karipande': 'Lunda Sul',
    'Cazombo - Karipande': 'Lunda Sul',
    'Dala - Saurimo': 'Lunda Sul',
    'Luau -- Massibi': 'Lunda Sul',
    'Luau - Massibi': 'Lunda Sul',
    'Massibi -- Cazombo': 'Lunda Sul',
    'Massibi - Cazombo': 'Lunda Sul',
    'Muconda -- Luau': 'Lunda Sul',
    'Muconda - Luau': 'Lunda Sul',
    'Neto - Santo Antonio': 'Lunda Sul',
    'Neto - Terra_Nova (Saurimo_Sul)': 'Lunda Sul',
    'Santo Antonio - Terra Nova': 'Lunda Sul',
    'Saurimo - Muconda': 'Lunda Sul',
    'Saurimo - Lucapa (Camissombo)': 'Lunda Sul',
    'Saurimo - Dala': 'Lunda Sul',
    'Saurimo(Br_Muconda) - Muconda': 'Lunda Sul',
    'Saurimo Norte -- IEIA': 'Lunda Sul',
    'Saurimo_CRT - IEIA': 'Lunda Sul',
    'Saurimo_Norte - Neto': 'Lunda Sul',
    'Stº António - Saurimo_sul': 'Lunda Sul',
    'Terra_Nova - Saurimo_CRT': 'Lunda Sul',
    
    // MOXICO
    'Br_Capango_Sul - Sacalunda': 'Moxico',
    'Cangumbe - Luena': 'Moxico',
    'Cuemba - Cangumbe': 'Moxico',
    'Dom_Bosco - Luena_CTR': 'Moxico',
    'Lucusse - Lutembo': 'Moxico',
    'Luena - Dala': 'Moxico',
    'Luena - Lucusse': 'Moxico',
    'Luena_CTR - Luena_Largo': 'Moxico',
    'Luena_Largo - Zorro': 'Moxico',
    'Lumbala Nguimbo - Ninda': 'Moxico',
    'Lutembo - Lumbala Nguimbo': 'Moxico',
    'Ninda - Malundo': 'Moxico',
    'Sacalunda - Dom_Bosco': 'Moxico',
    'Zorro - Br_Capango_Sul': 'Moxico'
  };
  
  // MAPEAMENTO DE PROVÍNCIA PARA PSM
  // v3.37.0: Lunda Norte agora é exclusiva da ANGLOBAL
  const provinceToOperator = {
    'Cabinda': 'ISISTEL',
    'Zaire': 'FIBRASOL',
    'Uíge': 'FIBRASOL',
    'Malange': 'FIBRASOL',
    'Cuanza Norte': 'FIBRASOL',
    'Lunda Norte': 'ANGLOBAL',
    'Lunda Sul': 'ANGLOBAL',
    'Moxico': 'ANGLOBAL'
  };
  
  // MAPEAMENTO DE PSM PARA PROVÍNCIAS DISPONÍVEIS
  // v3.37.0: Lunda Norte REMOVIDA da FIBRASOL (Cuango está em Malanje)
  const operatorToProvinces = {
    'ISISTEL': ['Cabinda'],
    'FIBRASOL': ['Zaire', 'Uíge', 'Malanje', 'Cuanza Norte'],
    'ANGLOBAL': ['Lunda Norte', 'Lunda Sul', 'Moxico']
  };
  
  // ============================================================================
  // FASE 7: ESTRUTURA DE DADOS CENTRAL
  // ============================================================================

  // Configuração de quadrimestres
  const quarterConfig = {
    Q1: { start: 1, end: 18, weeks: 18 },   // W1-W18
    Q2: { start: 19, end: 35, weeks: 17 },  // W19-W35
    Q3: { start: 36, end: 52, weeks: 17 }   // W36-W52
  };

  // Gerar array de semanas [W1, W2, ..., W52]
  const allWeeks = Array.from({ length: 52 }, (_, i) => `W${i + 1}`);

  // Definição das 8 categorias de status
  const statusCategories = [
    'Transporte',
    'Indisponíveis',
    'Total Reparadas',
    'Reconhecidas',
    'Dep. de Passagem de Cabo',
    'Dep. de Licença',
    'Dep. de Cutover',
    'Fibras Dependentes' // Será "Fibras dependentes da [PSM]"
  ];

  // Definição das rotas por PSM (Total: 104 rotas)
  const routesByPSM = {
    // ISISTEL: 17 rotas (Cabinda) - ORDEM ALFABÉTICA
    ISISTEL: [
      'BSC_Cabinda - Quatro',
      'BSC_Cabinda - Resistencia (Cabo_1)',
      'BSC_Cabinda - Resistencia (Cabo_2)',
      'Cine_Popular - BSC_Cabinda',
      'Corda_Expansão_Cabassango',
      'Hoji_Cacongo - Belize',
      'Hoji_Cacongo - Massabe_Fronteira',
      'Lucola - Hoji_Cacongo',
      'Lucola - Tchizu_O',
      'Massabi_Fronteira - Belize',
      'PV_Grande_NT - Tchizu_O',
      'PV_Grande_NT - Yema_Fronteira',
      'Quatro - PV_Grande_NT',
      'Quatro - Tchizu_O',
      'Resistencia - Cine_Popular',
      'Resistencia - Lucola',
      'Tchizu_O - Cine_Popular'
    ],

    // FIBRASOL: 53 rotas (Norte/Leste) - ORDEM ALFABÉTICA
    FIBRASOL: [
      'Alto Dondo - Quibala',
      'Ambriz - N\'zeto',
      'BSC_Malange - Canambua',
      'Calucinga - Mussende',
      'Camabatela - Lucala',
      'Canambua - Vila_Matilde',
      'Cuango - Cafunfo',
      'Cuango - Caungula',
      'Cuimba - Nguabi',
      'Damba - Uige(Negage_CRT)',
      'Hospital - Lumbo',
      'Kimbumba - Soyo_Centro',
      'Kimbundo - Uige (Inca)',
      'Kwanada_O (ODFB2)- JFO11 Porto',
      'Kwanda_DCS - Kwanda_O',
      'Kwanda_DCS - Loja',
      'Kwanda_DCS - Porto',
      'Kwanda_DCS- ODFB1- JFO(288)ALNG',
      'Kwanda_O (ODFB3)- JFO(288)- Azul Energi',
      'Kwanda_O - Loja',
      'Kwanda_O - Porto',
      'Lucala - Ndalatando',
      'Lucenga - Mucula',
      'Lumbo - BSC_Malange',
      'Malange (Lumbo) - Lucala',
      'Malange (Vila Matilde) - Mulo',
      'Malange_CTR - Lumbo e Bsc',
      'Maria teresa Gulungo_Alto - Nadalatando',
      'Maxinde (Expansão) - BSC',
      'Maxinde (Expansão) - Lumbo',
      'Mbanza Congo - Noqui',
      'Mbanza Congo_Sul - BSC ODF 3 (11 de Novembro)',
      'Mbanza Congo_Sul - BSC ODF 4',
      'Mbaza Centro - Cuimba',
      'Mucula - Soyo',
      'Mulo - Cuango',
      'Muquiama - Kimbundo',
      'Mussende - Malange (Catepa)',
      'Ndala Norte - KN_Azul',
      'Ndala Norte - Ndala_Leste',
      'Ndala_CTR(BSC Ndalatando) - KN_Azul',
      'Ndalatando - Alto_Dondo',
      'Negage - Camabatela',
      'Nguabi - Damba',
      'Nzeto - Lussenga',
      'Nzeto - Mucula',
      'Nzeto - Soyo',
      'Tomboco - Lussenga',
      'Tomboco - Mbanza Congo',
      'Uíge - Negage',
      'Uíge_CTR - Unipop_Oeste ODF 1',
      'Uíge_CTR - Unipop_Oeste ODF 2',
      'Vila_Matilde - Hospital'
    ],

    // ANGLOBAL: 34 rotas (Leste/Sul) - ORDEM ALFABÉTICA
    ANGLOBAL: [
      'Br_Capango_Sul - Sacalunda',
      'Cambacumba - Dundo',
      'Camissombo (Lucapa) - Dundo',
      'Cangumbe - Luena',
      'Caungula - Cuilo',
      'Cazombo - Karipande',
      'Cuemba - Cangumbe',
      'Cuilo - Cambacumba',
      'Dom_Bosco - Luena_CTR',
      'Dundo_CRT ODF1 - Dundo_CRT ODF2',
      'Luau - Massibi',
      'Lucusse - Lutembo',
      'Luena - Dala',
      'Luena - Lucusse',
      'Luena_CTR - Luena_Largo',
      'Luena_Largo - Zorro',
      'Lumbala Nguimbo - Ninda',
      'Lutembo - Lumbala Nguimbo',
      'Massibi - Cazombo',
      'Muconda - Luau',
      'Neto - Santo Antonio',
      'Neto - Terra_Nova (Saurimo_Sul)',
      'Ninda - Malundo',
      'Sacalunda - Dom_Bosco',
      'Santo Antonio - Terra Nova',
      'Saurimo - Dala',
      'Saurimo - Lucapa (Camissombo)',
      'Saurimo(Br_Muconda) - Muconda',
      'Saurimo Norte -- IEIA',
      'Saurimo_CRT - IEIA',
      'Saurimo_Norte - Neto',
      'Stº António - Saurimo_sul',
      'Terra_Nova - Saurimo_CRT',
      'Zorro - Br_Capango_Sul'
    ]
  };

  // ESTADO PRINCIPAL: DATA
  // Estrutura: { PSM: { SEMANA: { ROTA: { categoria: valor } } } }
  const [data, setData] = useState(() => {
    // Tentar carregar do localStorage
    const saved = window.localStorage.getItem('psm_rotas_data_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    }

    // Inicializar estrutura vazia
    const initialData = {};
    Object.keys(routesByPSM).forEach(psm => {
      initialData[psm] = {};
      allWeeks.forEach(week => {
        initialData[psm][week] = {};
        routesByPSM[psm].forEach(route => {
          initialData[psm][week][route] = {
            'Transporte': '',
            'Indisponíveis': '',
            'Total Reparadas': '',
            'Reconhecidas': '',
            'Dep. de Passagem de Cabo': '',
            'Dep. de Licença': '',
            'Dep. de Cutover': '',
            [`Fibras dependentes da ${psm}`]: ''
          };
        });
      });
    });

    return initialData;
  });

  // ESTADO: DISTRIBUIÇÃO DE REPARAÇÕES (V5.06.0)
  // Estrutura: { PSM: { Week: { Rota: { 'Reconhecidas': 10, 'Dep. Cutover': 5 } } } }
  // Guarda QUANTO foi descontado de cada tipo de indisponibilidade
  const [distribuicaoReparacoes, setDistribuicaoReparacoes] = useState(() => {
    const saved = window.localStorage.getItem('psm_distribuicao_reparacoes_v1');
    if (saved) {
      try {
        console.log('📥 [DISTRIBUIÇÃO] Carregado do localStorage');
        return JSON.parse(saved);
      } catch (e) {
        console.error('❌ [DISTRIBUIÇÃO] Erro ao carregar:', e);
        return {};
      }
    }
    return {};
  });


  // ESTADO: JUSTIFICATIVAS
  // Estrutura: { 'PSM_Rota': { seccao, regiao, transporteQ2, indisponiveis, delta, justificativa } }
  const [justificativas, setJustificativas] = useState(() => {
    const saved = window.localStorage.getItem('psm_justificativas_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar justificativas:', e);
        return {};
      }
    }
    return {};
  });

  // ============================================================================
  // ESTADOS DE UI (mantidos da v1.5.0)
  // ============================================================================
  
  // v3.49.24: Estados para detecção mobile e aviso
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(true);
  
  // Estados para os filtros e menu
  const [selectedOperator, setSelectedOperator] = useState(() => {
  return localStorage.getItem('psm_selectedOperator') || 'FIBRASOL';
  });

  const [selectedWeek, setSelectedWeek] = useState(() => {
  return localStorage.getItem('psm_selectedWeek') || 'W1';
  });
  const [selectedQuarter, setSelectedQuarter] = useState(() => {
  return localStorage.getItem('psm_selectedQuarter') || 'Q1';
  });
  const [selectedYear, setSelectedYear] = useState(() => {
  return parseInt(localStorage.getItem('psm_selectedYear')) || new Date().getFullYear();
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [manualDataExpanded, setManualDataExpanded] = useState(true);
  
  // Estados para modo apresentação
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);


    //  useEffects para salvar filtros no localStorage 
useEffect(() => {
  localStorage.setItem('psm_selectedOperator', selectedOperator);
}, [selectedOperator]);

useEffect(() => {
  localStorage.setItem('psm_selectedWeek', selectedWeek);
}, [selectedWeek]);

useEffect(() => {
  localStorage.setItem('psm_selectedQuarter', selectedQuarter);
}, [selectedQuarter]);

useEffect(() => {
  localStorage.setItem('psm_selectedYear', String(selectedYear));
}, [selectedYear]);

// Cleanup do timer do modal ao desmontar
useEffect(() => {
  return () => {
    if (modalTimerRef.current) {
      clearTimeout(modalTimerRef.current);
      modalTimerRef.current = null;
    }
  };
}, []);

// ============================================================================
  // CARREGAR DADOS DO SUPABASE AO INICIAR E QUANDO MUDAR O ANO
  // ============================================================================
  useEffect(() => {
    const carregarDadosDoSupabase = async () => {
      console.log('🔄 Carregando dados do Supabase para o ano:', selectedYear);
      
      const resultado = await lerTudoDoSupabase(selectedYear);
      
      if (resultado.success && resultado.data && Object.keys(resultado.data).length > 0) {
        console.log('✅ Dados carregados do Supabase!', resultado.data);
        setData(resultado.data);
        
        // ✅ CORREÇÃO: Carregar também os estados de teste e validação
        if (resultado.rotasTestadas && Object.keys(resultado.rotasTestadas).length > 0) {
          console.log('✅ Rotas testadas carregadas do Supabase:', resultado.rotasTestadas);
          setRotasTestadas(resultado.rotasTestadas);
        }
        
        if (resultado.rotasValidadas && Object.keys(resultado.rotasValidadas).length > 0) {
          console.log('✅ Rotas validadas carregadas do Supabase:', resultado.rotasValidadas);
          setRotasValidadas(resultado.rotasValidadas);
        }
      } else {
        console.log('⚠️ Sem dados no Supabase para o ano', selectedYear);
        // Limpar dados se não houver nada para o ano selecionado
        setData({ ISISTEL: {}, FIBRASOL: {}, ANGLOBAL: {} });
        setRotasTestadas({});
        setRotasValidadas({});
      }
      
      // ✅ Carregar justificativas do Supabase
      const resultadoJust = await lerJustificativasDoSupabase(selectedYear);
      if (resultadoJust.success && resultadoJust.data && Object.keys(resultadoJust.data).length > 0) {
        console.log('✅ Justificativas carregadas do Supabase!', Object.keys(resultadoJust.data).length);
        setJustificativas(resultadoJust.data);
      } else {
        console.log('⚠️ Sem justificativas no Supabase para o ano', selectedYear);
        setJustificativas({});
      }
    };
    
    // Executar carregamento
    carregarDadosDoSupabase();
  }, [selectedYear]); // ✅ Recarregar quando mudar o ano!
  
  // v3.40.27: Estados para sino de alertas
  const [alertasAbertos, setAlertasAbertos] = useState(false);
  const [alertasLidos, setAlertasLidos] = useState([]);
  
  // v3.40.73: Estado para toggle Efetividade (Global ou PSM)
  const [efetividadeMode, setEfetividadeMode] = useState('global'); // 'global' ou 'psm'
  
  // v3.42.00: Estado para painel Testes e Análises
  const [showTestesAnalises, setShowTestesAnalises] = useState(false);
  
  // v3.42.01: Estados para dados de Testes e Análises
  const [testesData, setTestesData] = useState({
    cadastradas: 0,
    testadas: 0,
    validadas: 0,      // v3.49.10: Adicionar
    pendentes: 0,
    naoTestadas: 0,    // v3.49.10: Adicionar
    semIndisponibilidade: 0,
    semIndisponibilidadeTecnica: 0,  // v3.49.10: Adicionar
    estaveis: 0,
    concluidas: 0,
    comGanho: 0,
    degradadas: 0,     // v3.49.10: Adicionar
    comIndisponibilidades: 0
  });
  
  // v3.42.03: Estados para dados de todos os PSMs (comparação)
  const [todosTestesData, setTodosTestesData] = useState({
    FIBRASOL: null,
    ISISTEL: null,
    ANGLOBAL: null
  });
  
  // v3.48.00: Estados para validação POR SEMANA
  // Estrutura: { PSM: { semana: { rota: { testada: true } } } }
  const [rotasTestadas, setRotasTestadas] = useState(() => {
    const saved = window.localStorage.getItem('psm_rotas_testadas_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar rotas testadas:', e);
      }
    }
    return {};
  });
  
  const [rotasValidadas, setRotasValidadas] = useState(() => {
    const saved = window.localStorage.getItem('psm_rotas_validadas_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao carregar rotas validadas:', e);
      }
    }
    return {};
  });
  
  const [tabelaValidacaoAberta, setTabelaValidacaoAberta] = useState(false);
  
  // v3.48.00: Salvar validações no localStorage automaticamente
  useEffect(() => {
    try {
      window.localStorage.setItem('psm_rotas_testadas_v2', JSON.stringify(rotasTestadas));
      window.localStorage.setItem('psm_rotas_validadas_v2', JSON.stringify(rotasValidadas));
    } catch (e) {
      console.error('Erro ao salvar validações:', e);
    }
  }, [rotasTestadas, rotasValidadas]);
  
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
  
  // v3.48.02: Função para obter quarter de uma semana
  const getQuarterFromWeek = (week) => {
    const weekNum = parseInt(week.substring(1));
    if (weekNum >= 1 && weekNum <= 18) return 'Q1';
    if (weekNum >= 19 && weekNum <= 35) return 'Q2';
    if (weekNum >= 36 && weekNum <= 52) return 'Q3';
    return 'Q1';
  };
  
  // v3.48.02: FUNÇÕES AUXILIARES - Validação POR SEMANA E QUARTER
  // Estrutura: { PSM: { semana: { rota: { testada: true } } } }
  
  const isRotaTestada = (psm, semana, rota) => {
    return rotasTestadas[psm]?.[semana]?.[rota]?.testada === true;
  };
  
  const isRotaValidada = (psm, semana, rota) => {
    return rotasValidadas[psm]?.[semana]?.[rota]?.validada === true;
  };
  
  // v3.48.02: Obter semanas testadas/validadas NO QUARTER SELECIONADO
  const getSemanasTestadasNoQuarter = (psm, rota, quarter) => {
    if (!rotasTestadas[psm]) return [];
    const semanas = [];
    const quarterWeeks = allWeeks.slice(
      quarterConfig[quarter].start - 1,
      quarterConfig[quarter].end
    );
    
    quarterWeeks.forEach(semana => {
      if (rotasTestadas[psm][semana]?.[rota]?.testada === true) {
        semanas.push(semana);
      }
    });
    return semanas.sort();
  };
  
  const getSemanasValidadasNoQuarter = (psm, rota, quarter) => {
    if (!rotasValidadas[psm]) return [];
    const semanas = [];
    const quarterWeeks = allWeeks.slice(
      quarterConfig[quarter].start - 1,
      quarterConfig[quarter].end
    );
    
    quarterWeeks.forEach(semana => {
      if (rotasValidadas[psm][semana]?.[rota]?.validada === true) {
        semanas.push(semana);
      }
    });
    return semanas.sort();
  };
  
  const getSemanasTestadas = (psm, rota) => {
    if (!rotasTestadas[psm]) return [];
    const semanas = [];
    Object.keys(rotasTestadas[psm]).forEach(semana => {
      if (rotasTestadas[psm][semana][rota]?.testada === true) {
        semanas.push(semana);
      }
    });
    return semanas.sort();
  };
  
  const getSemanasValidadas = (psm, rota) => {
    if (!rotasValidadas[psm]) return [];
    const semanas = [];
    Object.keys(rotasValidadas[psm]).forEach(semana => {
      if (rotasValidadas[psm][semana][rota]?.validada === true) {
        semanas.push(semana);
      }
    });
    return semanas.sort();
  };
  
  // v3.48.02: Verificar se rota foi testada/validada em QUALQUER semana DO QUARTER
  const isRotaTestadaGlobalNoQuarter = (psm, rota, quarter) => {
    return getSemanasTestadasNoQuarter(psm, rota, quarter).length > 0;
  };
  
  const isRotaValidadaGlobalNoQuarter = (psm, rota, quarter) => {
    return getSemanasValidadasNoQuarter(psm, rota, quarter).length > 0;
  };
  
  const isRotaTestadaGlobal = (psm, rota) => {
    return getSemanasTestadas(psm, rota).length > 0;
  };
  
  const isRotaValidadaGlobal = (psm, rota) => {
    return getSemanasValidadas(psm, rota).length > 0;
  };
  
  // v3.48.03: Verificar se rota foi validada em QUALQUER semana do quarter (status persiste)
  const isRotaValidadaNoQuarter = (psm, rota, quarter) => {
    const semanasValidadas = getSemanasValidadasNoQuarter(psm, rota, quarter);
    return semanasValidadas.length > 0;
  };
  
  const isRotaTestadaNoQuarter = (psm, rota, quarter) => {
    const semanasTestadas = getSemanasTestadasNoQuarter(psm, rota, quarter);
    return semanasTestadas.length > 0;
  };
  
  // v3.40.7: Estados e ref para scroll inteligente do header
  const scrollContainerRef = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  
  // v3.40.7: Detectar scroll do container para mostrar/ocultar header
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      
      // Só esconde header se scrollar para baixo mais de 50px
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling DOWN - esconde header
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling UP - mostra header
        setHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // v3.43.01: Calcular dados baseado em VALIDAÇÕES MANUAIS (lógica corrigida)
  useEffect(() => {
    if (!selectedOperator || selectedOperator === 'Global') return;
    
    console.log('🧪 Calculando dados de Testes e Análises para', selectedOperator);
    
    const rotas = routesByPSM[selectedOperator] || [];
    const totalRotas = rotas.length;
    
    // Obter semanas do quadrimestre
    const quarterWeeks = allWeeks.slice(
      quarterConfig[selectedQuarter].start - 1,
      quarterConfig[selectedQuarter].end
    );
    
    // v3.43.01: NOVA LÓGICA
    // Não Testada = sem tick em Testada
    // Pendente = tick em Testada MAS sem tick em Validada
    // Validada = tick em ambos
    
    let testadas = 0;      // Total com tick em "Testada"
    let validadas = 0;     // Total com tick em "Validada"
    let pendentes = 0;     // Testada ✓ + Validada ✗
    let naoTestadas = 0;   // Testada ✗
    
    // v3.43.02: Métricas técnicas baseadas em dados
    let semIndisponibilidade = 0;  // Zeradas (último indisp = 0)
    let estaveis = 0;              // Sem variação
    let comGanho = 0;              // Melhorando (reduzindo indisp)
    let degradadas = 0;            // Piorando (aumentando indisp)
    let concluidas = 0;
    let comIndisponibilidades = 0;
    
    // Analisar cada rota
    rotas.forEach(rota => {
      // v3.48.02: Verificar se foi testada/validada NO QUARTER SELECIONADO
      const foiTestada = isRotaTestadaGlobalNoQuarter(selectedOperator, rota, selectedQuarter);
      const foiValidada = isRotaValidadaGlobalNoQuarter(selectedOperator, rota, selectedQuarter);
      
      // v3.43.01: NOVA CLASSIFICAÇÃO
      if (!foiTestada) {
        // Sem tick em Testada = Não Testada
        naoTestadas++;
      } else {
        // Com tick em Testada
        testadas++;
        
        if (foiValidada) {
          // Testada ✓ + Validada ✓ = Validada
          validadas++;
        } else {
          // Testada ✓ + Validada ✗ = Pendente
          pendentes++;
        }
      }
      
      // v3.49.02: STATUS TÉCNICO - Analisar APENAS a semana onde a rota foi VALIDADA
      if (foiValidada) {
        // Buscar em qual(is) semana(s) a rota foi validada
        const semanasValidadas = getSemanasValidadasNoQuarter(selectedOperator, rota, selectedQuarter);
        
        console.log(`🔍 Analisando rota VALIDADA: ${rota} nas semanas: ${semanasValidadas.join(', ')}`);
        
        // Analisar APENAS as semanas onde foi marcada como validada
        semanasValidadas.forEach((week) => {
          const weekData = data[selectedOperator]?.[week]?.[rota];
          
          if (weekData) {
            const transp = parseInt(weekData['Transporte']) || 0;
            const indisp = parseInt(weekData['Indisponíveis']) || 0;
            
            // v3.49.02: Classificar baseado nos dados DESTA semana específica
            // SEM INDISPONIBILIDADE (prioridade máxima)
            if (indisp === 0) {
              semIndisponibilidade++;
              console.log(`  ✅ ${week}: Sem Indisp (T=${transp}, I=${indisp})`);
            }
            // COM GANHO (Melhorando): Indisponíveis < Transporte (ambos > 0)
            else if (indisp < transp && transp > 0) {
              comGanho++;
              console.log(`  📈 ${week}: Com Ganho (T=${transp}, I=${indisp})`);
            }
            // ESTÁVEL: Transporte = Indisponíveis (ambos > 0)
            else if (transp === indisp && indisp > 0) {
              estaveis++;
              console.log(`  ⚪ ${week}: Estável (T=${transp}, I=${indisp})`);
            }
            // DEGRADADA (Piorando): Indisponíveis > Transporte
            else if (indisp > transp) {
              degradadas++;
              console.log(`  📉 ${week}: Degradada (T=${transp}, I=${indisp})`);
            }
          } else {
            // Sem dados na semana = Sem Indisponibilidade
            semIndisponibilidade++;
            console.log(`  ✅ ${week}: Sem Indisp (sem dados)`);
          }
        });
      }
    });
    
    console.log('📊 TOTAIS:');
    console.log(`  🟢 Sem Indisponibilidade: ${semIndisponibilidade}`);
    console.log(`  📈 Com Ganho: ${comGanho}`);
    console.log(`  ⚪ Estável: ${estaveis}`);
    console.log(`  📉 Degradada: ${degradadas}`);
        
    setTestesData({
      cadastradas: totalRotas,
      testadas,                          // Rotas com tick em Testada
      validadas,                         // v3.49.10: Adicionar validadas
      pendentes,                         // v3.43.01: Testada ✓ + Validada ✗
      naoTestadas,                       // v3.49.10: CORRIGIDO - Rotas sem tick em Testada
      semIndisponibilidade: validadas,   // Rotas com tick em Validada
      semIndisponibilidadeTecnica: semIndisponibilidade, // v3.43.02: Baseado em dados (zeradas)
      estaveis,
      concluidas,
      comGanho,
      degradadas,  // v3.43.02: NOVO - Rotas piorando
      comIndisponibilidades
    });
    
    console.log('✅ Dados calculados (nova lógica):', {
      cadastradas: totalRotas,
      naoTestadas,      // Sem tick em Testada
      testadas,         // Com tick em Testada (total)
      pendentes,        // Testada ✓ mas Validada ✗
      validadas         // Testada ✓ e Validada ✓
    });
    
  }, [selectedOperator, selectedQuarter, data, rotasTestadas, rotasValidadas]);
  
  // v3.43.00: Calcular dados de TODOS os PSMs para comparação (com validação manual)
  useEffect(() => {
    console.log('🔄 Calculando dados de todos os PSMs para comparação...');
    
    const psms = ['FIBRASOL', 'ISISTEL', 'ANGLOBAL'];
    const novosDados = {};
    
    psms.forEach(psm => {
      const rotas = routesByPSM[psm] || [];
      const totalRotas = rotas.length;
      
      const quarterWeeks = allWeeks.slice(
        quarterConfig[selectedQuarter].start - 1,
        quarterConfig[selectedQuarter].end
      );
      
      // v3.43.02: NOVA LÓGICA (mesma do primeiro useEffect)
      let testadas = 0;
      let validadas = 0;
      let pendentes = 0;
      let naoTestadas = 0;
      
      // Métricas técnicas
      let semIndisponibilidade = 0;
      let estaveis = 0;
      let comGanho = 0;
      let degradadas = 0;  // NOVO
      let concluidas = 0;
      let comIndisponibilidades = 0;
      
      rotas.forEach(rota => {
        // v3.49.03: Usar funções que filtram por quarter
        const foiTestada = isRotaTestadaGlobalNoQuarter(psm, rota, selectedQuarter);
        const foiValidada = isRotaValidadaGlobalNoQuarter(psm, rota, selectedQuarter);
        
        // v3.43.01: CLASSIFICAÇÃO
        if (!foiTestada) {
          naoTestadas++;
        } else {
          testadas++;
          if (foiValidada) {
            validadas++;
          } else {
            pendentes++;  // Testada ✓ mas Validada ✗
          }
        }
        
        // v3.49.03: Analisar STATUS TÉCNICO - apenas se VALIDADA
        if (foiValidada) {
          // Percorrer TODAS as semanas do quarter
          quarterWeeks.forEach((week) => {
            const weekData = data[psm]?.[week]?.[rota];
            
            if (weekData) {
              const transp = parseInt(weekData['Transporte']) || 0;
              const indisp = parseInt(weekData['Indisponíveis']) || 0;
              
              // Classificar baseado em T vs I
              if (indisp === 0) {
                semIndisponibilidade++;
              } else if (indisp < transp && transp > 0) {
                comGanho++;
              } else if (transp === indisp && indisp > 0) {
                estaveis++;
              } else if (indisp > transp) {
                degradadas++;
              }
            } else {
              // Sem dados = Sem Indisponibilidade
              semIndisponibilidade++;
            }
          });
        }
      });
      
      // v3.49.03: Cálculos corrigidos
      
      novosDados[psm] = {
        cadastradas: totalRotas,
        testadas,
        validadas,  // v3.49.03: Adicionar
        pendentes,
        naoTestadas,  // v3.49.03: Adicionar
        semIndisponibilidade: validadas,  // Validação manual
        semIndisponibilidadeTecnica: semIndisponibilidade,  // v3.49.03: Contagem de semanas
        estaveis,
        comGanho,
        degradadas,
        concluidas,
        comIndisponibilidades,
        // Calcular taxas
        taxaTestes: totalRotas > 0 ? (testadas / totalRotas) * 100 : 0,
        taxaValidacao: testadas > 0 ? (validadas / testadas) * 100 : 0,
        taxaConclusao: testadas > 0 ? (concluidas / testadas) * 100 : 0,
        taxaMelhoria: testadas > 0 ? (comGanho / testadas) * 100 : 0,
        indiceExcelencia: testadas > 0 ? (
          ((validadas / testadas) * 0.3) +
          ((concluidas / testadas) * 0.25) +
          ((comGanho / testadas) * 0.25) +
          ((estaveis / testadas) * 0.2)
        ) * 100 : 0
      };
    });
    
    setTodosTestesData(novosDados);
    console.log('✅ Dados de todos os PSMs calculados:', novosDados);
    
  }, [selectedQuarter, data, rotasTestadas, rotasValidadas]);
  
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
  
  // FASE 1: Filtro de província
  const [selectedProvince, setSelectedProvince] = useState('Todas'); // 'Todas' ou nome da província
  
  // v3.21.1: Removido showProvincialDashboard (dashboard redundante)

  // v3.17.4: Resetar província quando PSM muda e província não pertence ao novo PSM
  useEffect(() => {
    if (selectedProvince !== 'Todas') {
      const provincesOfOperator = operatorToProvinces[selectedOperator];
      if (!provincesOfOperator.includes(selectedProvince)) {
        setSelectedProvince('Todas');
      }
    }
  }, [selectedOperator]);

  // Sincronizar Week quando Quarter muda
  useEffect(() => {
    const config = quarterConfig[selectedQuarter];
    const weekNumber = parseInt(selectedWeek.substring(1));
    
    // Se a semana atual não está no range do quadrimestre selecionado
    if (weekNumber < config.start || weekNumber > config.end) {
      // Ajustar para a primeira semana do quadrimestre
      setSelectedWeek(`W${config.start}`);
    }
  }, [selectedQuarter]);

  // Função para obter semanas de um quadrimestre
  const getWeeksForQuarter = (quarter) => {
    const config = quarterConfig[quarter];
    return Array.from(
      { length: config.weeks },
      (_, i) => `W${config.start + i}`
    );
  };

  // ============================================================================
  // v3.7.0: ESTADOS PARA CARROSSEL DE GRÁFICOS
  // ============================================================================
  
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' ou 'all'
  const [viewModeClassificacao, setViewModeClassificacao] = useState('all'); // PADRÃO: Ver Resumo (all=resumo, carousel=detalhado)
  const [currentGraph, setCurrentGraph] = useState(0); // 0=Degradadas, 1=Com Ganho, 2=Estáveis
  const [currentGraphClassificacao, setCurrentGraphClassificacao] = useState(0); // para carrossel de classificação

  // ============================================================================
  // FASE 8: ESTADOS DE FEEDBACK DE SALVAMENTO
  // ============================================================================
  
  const [saveStatus, setSaveStatus] = useState('');
  const [lastSaveTime, setLastSaveTime] = useState(null);
  
  // FASE 1: Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRota, setSelectedRota] = useState(null);
  
  // Estados para modal de seleção de tipo de reparação
  const [showRepairTypeModal, setShowRepairTypeModal] = useState(false);
  const [pendingRepairData, setPendingRepairData] = useState(null);
  const modalTimerRef = useRef(null);
  const valorOriginalRef = useRef(null); // Guarda valor antes de começar a editar
  
  // Modal de drill-down de status
  const [showStatusDrilldown, setShowStatusDrilldown] = useState(false);
  const [selectedStatusDrilldown, setSelectedStatusDrilldown] = useState(null);
  
  // Paginação do drill-down (16 rotas por página)
  const [currentPageDrilldown, setCurrentPageDrilldown] = useState(0);
  const itemsPerPageDrilldown = 16;
  
  // Paginação Acompanhamento
  const [currentPageAcomp, setCurrentPageAcomp] = useState(0);
  const itemsPerPageAcomp = 10;
  
  // Estados para tooltips dos gráficos
  const [hoveredPieSlice, setHoveredPieSlice] = useState(null);
  const [hoveredWeekIndex, setHoveredWeekIndex] = useState(null);
  
  // v3.25.1: Tooltip do carrossel
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Paginação Rotas Normalizadas
  const [currentPageNormalizadas, setCurrentPageNormalizadas] = useState(0);
  const itemsPerPageNormalizadas = 6;
  
  // v3.20.1: Paginação Intervenções Recentes
  const [currentPageIntervencoes, setCurrentPageIntervencoes] = useState(0);
  const itemsPerPageIntervencoes = 5;
  
  // v3.40.66: Paginação Rotas Sem Intervenção
  const [currentPageSemIntervencao, setCurrentPageSemIntervencao] = useState(0);
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

  // ============================================================================
  // IMPORTAR JUSTIFICATIVAS - CÓDIGO COMPLETO
  // ============================================================================

  /**
   * FUNÇÃO 1: Detectar PSM baseado no nome da rota
   * Faz busca exata e normalizada (case-insensitive, sem espaços extras)
   */
  const findPSMForRoute = (routeName) => {
    const normalizedRoute = routeName.trim();

    // Procura em cada PSM
    for (const [psm, routes] of Object.entries(routesByPSM)) {
      
      // TENTATIVA 1: Comparação exata
      if (routes.includes(normalizedRoute)) {
        console.log('✅ Encontrado em', psm, '(match exato)');
        return psm;
      }
      
      // TENTATIVA 2: Comparação normalizada (case-insensitive)
      const foundRoute = routes.find(r => 
        r.toLowerCase().replace(/\s+/g, ' ').trim() === 
        normalizedRoute.toLowerCase().replace(/\s+/g, ' ').trim()
      );
      
      if (foundRoute) {
        console.log('✅ Encontrado em', psm, '(match normalizado):', foundRoute);
        return psm;
      }
    }

    return null;
  };

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

  // ============================================================================
  // FASE 8: PERSISTÊNCIA AUTOMÁTICA COM useEffect
  // ============================================================================

  // useEffect #1: Salvar estado 'data' no localStorage E SUPABASE automaticamente
  // useEffect #1: Salvar estado 'data' no localStorage E SUPABASE automaticamente
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setSaveStatus('saving');
      
      try {
        // 1. Salvar no localStorage (backup local + rápido)
        window.localStorage.setItem('psm_rotas_data_v3', JSON.stringify(data));
        
        // 2. Salvar no Supabase (compartilhado, com debounce)
        clearTimeout(window.salvarSupabaseTimeout);
        window.salvarSupabaseTimeout = setTimeout(async () => {
          console.log('💾 [DATA] Salvando no Supabase para o ano:', selectedYear);
          
          const resultado = await salvarTudoNoSupabase(
            data,
            selectedQuarter,
            selectedYear, // ✅ Usar ano selecionado
            routeToProvince,
            rotasTestadas,  
            rotasValidadas  
          );
          
          if (resultado.success) {
            console.log('✅ [DATA] Dados salvos no Supabase!', {
              atualizados: resultado.updated,
              inseridos: resultado.inserted,
              ano: selectedYear
            });
          } else {
            console.error('❌ [DATA] Erro ao salvar no Supabase:', resultado.error);
          }
        }, 5000); // Espera 5 segundos sem mudanças antes de salvar
        
        // Feedback visual de sucesso (localStorage)
        setSaveStatus('saved');
        setLastSaveTime(new Date());
        
        // Limpar status após 2 segundos
        const timer = setTimeout(() => {
          setSaveStatus('');
        }, 2000);
        
        return () => {
          clearTimeout(timer);
          clearTimeout(window.salvarSupabaseTimeout);
        };
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
        setSaveStatus('error');
        
        // Limpar status de erro após 3 segundos
        const timer = setTimeout(() => {
          setSaveStatus('');
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [data, selectedQuarter, rotasTestadas, rotasValidadas]); // Adicionar selectedQuarter como dependência

  // useEffect #2: Salvar estado 'justificativas' no localStorage E SUPABASE automaticamente
  useEffect(() => {
    console.log('🔄 [JUSTIFICATIVAS] useEffect executado', {
      quantidade: Object.keys(justificativas).length,
      timestamp: new Date().toISOString()
    });
    
    if (Object.keys(justificativas).length > 0) {
      // 1. Salvar no localStorage (backup local + rápido)
      try {
        window.localStorage.setItem('psm_justificativas_v1', JSON.stringify(justificativas));
        console.log('✓ [JUSTIFICATIVAS] Salvas no localStorage:', Object.keys(justificativas).length, 'registros');
      } catch (error) {
        console.error('❌ [JUSTIFICATIVAS] Erro ao salvar no localStorage:', error);
      }
      
      // 2. Salvar no Supabase (compartilhado, com debounce)
      clearTimeout(window.salvarJustificativasTimeout);
      console.log('⏱️ [JUSTIFICATIVAS] Timeout iniciado - aguardando 3 segundos...');
      
      window.salvarJustificativasTimeout = setTimeout(async () => {
        console.log('💾 [JUSTIFICATIVAS] Iniciando salvamento no Supabase para o ano:', selectedYear);
        
        try {
          const resultado = await salvarJustificativasNoSupabase(justificativas, selectedYear);
          
          if (resultado.success) {
            console.log('✅ [JUSTIFICATIVAS] Salvas no Supabase!', {
              atualizadas: resultado.updated,
              inseridas: resultado.inserted,
              total: resultado.total,
              ano: selectedYear
            });
          } else {
            console.error('❌ [JUSTIFICATIVAS] Erro ao salvar:', resultado.error);
          }
        } catch (error) {
          console.error('❌ [JUSTIFICATIVAS] Exceção ao salvar:', error);
        }
      }, 3000); // Espera 3 segundos sem mudanças antes de salvar
    } else {
      console.log('⚠️ [JUSTIFICATIVAS] Estado vazio - nada para salvar');
    }
    
    // Cleanup: limpar timeout quando componente desmontar ou justificativas mudarem
    return () => {
      console.log('🧹 [JUSTIFICATIVAS] Limpando timeout');
      clearTimeout(window.salvarJustificativasTimeout);
    };
  }, [justificativas, selectedYear]); // Executar sempre que 'justificativas' ou 'selectedYear' mudar

  // useEffect #2.5: Salvar estado 'distribuicaoReparacoes' no localStorage E SUPABASE IMEDIATAMENTE
  useEffect(() => {
    if (Object.keys(distribuicaoReparacoes).length > 0) {
      // 1. Salvar no localStorage (imediato)
      try {
        window.localStorage.setItem('psm_distribuicao_reparacoes_v1', JSON.stringify(distribuicaoReparacoes));
        console.log('💾 [DISTRIBUIÇÃO] Salvo no localStorage');
      } catch (error) {
        console.error('❌ [DISTRIBUIÇÃO] Erro ao salvar no localStorage:', error);
      }
      
      // 2. Salvar no Supabase IMEDIATAMENTE (sem debounce)
      const salvarImediatamente = async () => {
        console.log('💾 [DISTRIBUIÇÃO] Salvando no Supabase IMEDIATAMENTE...');
        
        const resultado = await salvarDistribuicaoNoSupabase(
          distribuicaoReparacoes,
          selectedQuarter,
          selectedYear
        );
        
        if (resultado.success) {
          console.log('✅ [DISTRIBUIÇÃO] Salvo no Supabase');
        } else {
          console.error('❌ [DISTRIBUIÇÃO] Erro ao salvar no Supabase:', resultado.error);
        }
      };
      
      salvarImediatamente();
    }
  }, [distribuicaoReparacoes, selectedQuarter, selectedYear]);

  // useEffect #2.6: Carregar distribuição do Supabase quando mudar quarter/year
  useEffect(() => {
    const carregarDistribuicaoInicial = async () => {
      console.log('📥 [DISTRIBUIÇÃO] Carregando do Supabase...');
      
      const distrib = await carregarDistribuicaoDoSupabase(
        selectedQuarter,
        selectedYear
      );
      
      if (Object.keys(distrib).length > 0) {
        setDistribuicaoReparacoes(distrib);
        console.log('✅ [DISTRIBUIÇÃO] Carregada do Supabase');
      }
    };
    
    carregarDistribuicaoInicial();
  }, [selectedQuarter, selectedYear]);

  // useEffect #3: Log de inicialização (apenas uma vez)
  useEffect(() => {

  }, []); // Executar apenas no mount do componente

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
      const quarterWeeks = allWeeks.slice(
        quarterConfig[selectedQuarter].start - 1,
        quarterConfig[selectedQuarter].end
      );
      
      // Iterar sobre PSM selecionado, semanas do quadrimestre e rotas
      quarterWeeks.forEach(week => {
        if (data[selectedOperator] && data[selectedOperator][week]) {
          routesByPSM[selectedOperator].forEach(route => {
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
            `Rotas: ${routesByPSM[selectedOperator].length}\n` +
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
          
          // v3.49.11: MERGE - Clonar estados atuais ao invés de criar vazios
          const novasTestadas = JSON.parse(JSON.stringify(rotasTestadas));
          const novasValidadas = JSON.parse(JSON.stringify(rotasValidadas));
          
          if (!novasTestadas[selectedOperator]) novasTestadas[selectedOperator] = {};
          if (!novasValidadas[selectedOperator]) novasValidadas[selectedOperator] = {};
          
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
                
                // Inicializar semana se necessário
                if (!novasTestadas[selectedOperator][semana]) {
                  novasTestadas[selectedOperator][semana] = {};
                }
                if (!novasValidadas[selectedOperator][semana]) {
                  novasValidadas[selectedOperator][semana] = {};
                }
                
                // Importar testada
                if (testadaIdx >= 0) {
                  const testadaVal = (values[testadaIdx] || '').toString().trim().toUpperCase();
                  
                  if (testadaVal === 'SIM' || testadaVal === 'TRUE' || testadaVal === '1') {
                    novasTestadas[selectedOperator][semana][rota] = {
                      testada: true
                    };
                    validacoesImportadas++;
                  }
                }
                
                // Importar validada
                if (validadaIdx >= 0) {
                  const validadaVal = (values[validadaIdx] || '').toString().trim().toUpperCase();
                  
                  if (validadaVal === 'SIM' || validadaVal === 'TRUE' || validadaVal === '1') {
                    novasValidadas[selectedOperator][semana][rota] = {
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
          totalRoutes: Object.values(routesByPSM).reduce((acc, r) => acc + r.length, 0),
          psms: Object.keys(routesByPSM),
          weeks: allWeeks.length,
          quarters: Object.keys(quarterConfig)
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
      const weeks = allWeeks;
      const rotas = routesByPSM[selectedOperator];
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

    console.log('Total PSMs:', Object.keys(routesByPSM).length);
    console.log('Total Rotas:', Object.values(routesByPSM).reduce((acc, r) => acc + r.length, 0));

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
    // Validação: aceitar apenas números ou campo vazio
    if (value !== '' && !/^\d+$/.test(value)) {
      console.warn('⚠️ Valor inválido ignorado:', value, '(apenas números são aceitos)');
      return;
    }

    // ✅ CORREÇÃO: Converter vazio para string vazia (será tratado como 0 no save)
    // O campo visual pode ficar vazio, mas ao salvar será convertido para 0
    const valorFinal = value; // Mantém vazio no UI, será 0 no banco

    // ============================================================================
    // FASE 10: LÓGICA DE NEGÓCIO - REDUÇÃO AUTOMÁTICA DE FIBRAS DEPENDENTES
    // ============================================================================

    // Atualizar o estado 'data' de forma imutável
    setData(prevData => {
      // Criar cópia profunda da estrutura
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Garantir que a estrutura existe
      if (!newData[psm]) newData[psm] = {};
      if (!newData[psm][week]) newData[psm][week] = {};
      if (!newData[psm][week][route]) {
        newData[psm][week][route] = {
          'Transporte': '',
          'Indisponíveis': '',
          'Total Reparadas': '',
          'Reconhecidas': '',
          'Dep. de Passagem de Cabo': '',
          'Dep. de Licença': '',
          'Dep. de Cutover': '',
          [`Fibras dependentes da ${psm}`]: ''
        };
      }

      // Obter valores atuais
      const currentData = newData[psm][week][route];
      const currentTotalReparadas = parseInt(currentData['Total Reparadas'], 10) || 0;
      const newTotalReparadas = category === 'Total Reparadas' ? (parseInt(valorFinal, 10) || 0) : currentTotalReparadas;
      
      console.log(`📝 INPUT CHANGE:`, {
        category,
        valorFinal,
        currentTotalReparadas,
        newTotalReparadas
      });
      
      // LÓGICA DE NEGÓCIO: SELEÇÃO DO TIPO DE REPARAÇÃO
      if (category === 'Total Reparadas') {
        // V5.06.5: Se campo estiver VAZIO, limpar distribuição
        if (valorFinal === '' || valorFinal === '0') {
          console.log('🧹 Campo vazio/zerado - limpando distribuição');
          
          setDistribuicaoReparacoes(prev => {
            const updated = JSON.parse(JSON.stringify(prev));
            
            // V5.07.0: Limpar APENAS a semana atual (não futuras)
            if (updated[psm]?.[week]?.[route]) {
              delete updated[psm][week][route];
              
              // V5.08.0: Limpar também no Supabase
              limparDistribuicaoNoSupabase(psm, week, route, selectedQuarter, selectedYear);
            }
            
            return updated;
          });
          
          // Limpar valorOriginalRef para próxima edição
          valorOriginalRef.current = null;
          setPendingRepairData(null);
          
          currentData[category] = valorFinal;
          return newData;
        }
        
        // V5.06.3: Calcular diferença baseada no VALOR ORIGINAL (antes de editar)
        // Se é a primeira mudança, guardar o valor original
        if (!pendingRepairData && valorOriginalRef.current === null) {
          valorOriginalRef.current = currentTotalReparadas;
        }
        
        // Diferença = novo valor - valor ORIGINAL (não o valor anterior de cada tecla)
        const valorOriginal = valorOriginalRef.current !== null ? valorOriginalRef.current : currentTotalReparadas;
        const diferenca = newTotalReparadas - valorOriginal;
        
        console.log(`🔢 DIFERENÇA: ${diferenca} (novo: ${newTotalReparadas} - original: ${valorOriginal})`);
        
        if (diferenca > 0) {
          // Total Reparadas AUMENTOU → Verificar tipos disponíveis
          // Buscar valores ORIGINAIS na semana atual, ou nas anteriores se não houver
          let reconhecidasOriginal = parseInt(currentData['Reconhecidas'], 10) || 0;
          let depPassagemOriginal = parseInt(currentData['Dep. de Passagem de Cabo'], 10) || 0;
          let depLicencaOriginal = parseInt(currentData['Dep. de Licença'], 10) || 0;
          let depCutoverOriginal = parseInt(currentData['Dep. de Cutover'], 10) || 0;
          let fibrasDependentesOriginal = parseInt(currentData[`Fibras dependentes da ${psm}`], 10) || 0;
          
          // Se não houver valores na semana atual, buscar nas anteriores
          if (reconhecidasOriginal === 0) {
            reconhecidasOriginal = buscarValorAnterior(psm, week, route, 'Reconhecidas');
          }
          if (depPassagemOriginal === 0) {
            depPassagemOriginal = buscarValorAnterior(psm, week, route, 'Dep. de Passagem de Cabo');
          }
          if (depLicencaOriginal === 0) {
            depLicencaOriginal = buscarValorAnterior(psm, week, route, 'Dep. de Licença');
          }
          if (depCutoverOriginal === 0) {
            depCutoverOriginal = buscarValorAnterior(psm, week, route, 'Dep. de Cutover');
          }
          if (fibrasDependentesOriginal === 0) {
            fibrasDependentesOriginal = buscarValorAnterior(psm, week, route, `Fibras dependentes da ${psm}`);
          }
          
          // V5.07.1: Subtrair distribuição ACUMULADA (todas semanas até atual)
          const weekNum = parseInt(week.replace('W', ''), 10);
          const trimestreAtual = quarterConfig[selectedQuarter];
          
          // Somar descontos de TODAS as semanas até a atual
          let descontoAcumuladoReconh = 0;
          let descontoAcumuladoDepPass = 0;
          let descontoAcumuladoDepLic = 0;
          let descontoAcumuladoDepCut = 0;
          let descontoAcumuladoFibras = 0;
          
          for (let w = trimestreAtual.start; w <= weekNum; w++) {
            const semana = `W${w}`;
            const distDaSemana = distribuicaoReparacoes[psm]?.[semana]?.[route] || {};
            descontoAcumuladoReconh += distDaSemana['Reconhecidas'] || 0;
            descontoAcumuladoDepPass += distDaSemana['Dep. de Passagem de Cabo'] || 0;
            descontoAcumuladoDepLic += distDaSemana['Dep. de Licença'] || 0;
            descontoAcumuladoDepCut += distDaSemana['Dep. de Cutover'] || 0;
            descontoAcumuladoFibras += distDaSemana[`Fibras dependentes da ${psm}`] || 0;
          }
          
          const reconhecidas = Math.max(0, reconhecidasOriginal - descontoAcumuladoReconh);
          const depPassagem = Math.max(0, depPassagemOriginal - descontoAcumuladoDepPass);
          const depLicenca = Math.max(0, depLicencaOriginal - descontoAcumuladoDepLic);
          const depCutover = Math.max(0, depCutoverOriginal - descontoAcumuladoDepCut);
          const fibrasDependentes = Math.max(0, fibrasDependentesOriginal - descontoAcumuladoFibras);
          
          console.log(`📊 Modal - Valores disponíveis:`, {
            reconhecidas: `${reconhecidasOriginal} - ${descontoAcumuladoReconh} = ${reconhecidas}`,
            depPassagem: `${depPassagemOriginal} - ${descontoAcumuladoDepPass} = ${depPassagem}`,
            fibrasDep: `${fibrasDependentesOriginal} - ${descontoAcumuladoFibras} = ${fibrasDependentes}`
          });
          
          const tiposComValor = [
            { tipo: 'Reconhecidas', valor: reconhecidas },
            { tipo: 'Dep. de Passagem de Cabo', valor: depPassagem },
            { tipo: 'Dep. de Licença', valor: depLicenca },
            { tipo: 'Dep. de Cutover', valor: depCutover },
            { tipo: `Fibras dependentes da ${psm}`, valor: fibrasDependentes }
          ].filter(item => item.valor > 0);
          
          if (tiposComValor.length > 1) {
            // MÚLTIPLOS TIPOS → Preparar dados (modal abrirá no onBlur)
            
            currentData[category] = valorFinal;
            
            setPendingRepairData({
              psm,
              week,
              route,
              diferenca,
              valorAnterior: valorOriginalRef.current, // Já foi guardado no início
              tiposDisponiveis: tiposComValor,
              newData: newData
            });
            
            console.log(`⏳ Múltiplos tipos. Original: ${valorOriginalRef.current}, Novo: ${newTotalReparadas}`);
            return newData;
            
          } else if (tiposComValor.length === 1) {
            // V5.06.4: APENAS 1 TIPO → Registrar distribuição e propagar
            const tipoUnico = tiposComValor[0];
            const descontoAplicado = Math.min(tipoUnico.valor, diferenca);
            
            // V5.07.0: Registrar distribuição APENAS na semana atual (não propagar)
            setDistribuicaoReparacoes(prev => {
              const updated = JSON.parse(JSON.stringify(prev));
              if (!updated[psm]) updated[psm] = {};
              if (!updated[psm][week]) updated[psm][week] = {};
              if (!updated[psm][week][route]) updated[psm][week][route] = {};
              
              // Guardar desconto APENAS desta semana
              updated[psm][week][route][tipoUnico.tipo] = descontoAplicado;
              
              return updated;
            });
            
            console.log(`🔄 Auto: ${tipoUnico.tipo} desconto ${descontoAplicado} registrado em ${week}`);
          }
        }
      }

      // Atualizar o valor específico (para outros casos)
      currentData[category] = valorFinal;

      return newData;
    });

    // Log de confirmação
    console.log(`✓ Atualizado: ${route} -> ${category} = ${valorFinal || '(vazio → será salvo como 0)'}`);
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
    
    // V5.07.0: Registrar distribuição APENAS na semana atual
    setDistribuicaoReparacoes(prevDist => {
      const updated = JSON.parse(JSON.stringify(prevDist));
      if (!updated[psm]) updated[psm] = {};
      if (!updated[psm][week]) updated[psm][week] = {};
      if (!updated[psm][week][route]) updated[psm][week][route] = {};
      
      // Somar ao desconto já existente desta semana (distribuição sequencial)
      const atual = updated[psm][week][route][tipoSelecionado] || 0;
      updated[psm][week][route][tipoSelecionado] = atual + descontoAplicado;
      
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
  const buscarValorAnterior = (psm, week, route, tipo) => {
    if (!data[psm]) return 0;
    
    // Obter número da semana atual
    const weekNum = parseInt(week.replace('W', ''));
    
    // Determinar limites do trimestre atual
    const trimestreAtual = quarterConfig[selectedQuarter];
    const semanaMinima = trimestreAtual.start;
    
    console.log(`🔍 Buscando ${tipo} em ${selectedQuarter} (W${semanaMinima}-W${weekNum-1})`);
    
    // Buscar de trás para frente DENTRO DO TRIMESTRE
    for (let w = weekNum - 1; w >= semanaMinima; w--) {
      const semanaAnterior = `W${w}`;
      const valor = parseInt(data[psm]?.[semanaAnterior]?.[route]?.[tipo], 10) || 0;
      
      if (valor > 0) {
        console.log(`✅ Encontrado ${tipo}=${valor} em ${semanaAnterior} (${selectedQuarter})`);
        return valor;
      }
    }
    
    console.log(`⚠️ ${tipo} não encontrado em ${selectedQuarter}`);
    return 0;
  };

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
  const getValorReduzido = (psm, week, route, tipo) => {
    // Pegar valor original
    let original = parseInt(data[psm]?.[week]?.[route]?.[tipo], 10) || 0;
    
    // Se não houver, buscar em semanas anteriores
    if (original === 0) {
      original = buscarValorAnterior(psm, week, route, tipo);
    }
    
    // V5.07.0: SOMAR descontos de TODAS as semanas até a atual (acumulativo)
    const weekNum = parseInt(week.replace('W', ''), 10);
    const trimestreAtual = quarterConfig[selectedQuarter];
    
    let descontoAcumulado = 0;
    for (let w = trimestreAtual.start; w <= weekNum; w++) {
      const semana = `W${w}`;
      const descontoDaSemana = distribuicaoReparacoes[psm]?.[semana]?.[route]?.[tipo] || 0;
      descontoAcumulado += descontoDaSemana;
    }
    
    return Math.max(0, original - descontoAcumulado);
  };

  /**
   * V5.06.0: Obtém valor ORIGINAL para Cards Header
   * Retorna valor sem aplicar desconto de reparações
   */
  const getValorOriginal = (psm, week, route, tipo) => {
    return parseInt(data[psm]?.[week]?.[route]?.[tipo], 10) || 0;
  };

  // ============================================================================
  // FASE 11: CÁLCULO DINÂMICO DO DASHBOARD EXECUTIVO COM useMemo
  // ============================================================================

  /**
   * Calcula estatísticas do Dashboard Executivo baseado no estado 'data'
   * v3.17.8: REMOVIDO useMemo - calcula direto no render para garantir atualização
   */
  
  // v3.13.25: Obter semanas do quadrimestre SELECIONADO
  const quarterWeeks = allWeeks.slice(
    quarterConfig[selectedQuarter].start - 1,
    quarterConfig[selectedQuarter].end
  );
  
  // FASE 1 v3.17.0: Filtrar rotas por província se selecionada
  const routesToProcess = selectedProvince !== 'Todas'
    ? routesByPSM[selectedOperator].filter(route => routeToProvince[route] === selectedProvince)
    : routesByPSM[selectedOperator];
  
  // v3.17.8: Log de debug
  console.log('📊 EXECUTIVO DASHBOARD (CALCULADO DIRETO):');
  console.log('  PSM:', selectedOperator);
  console.log('  Província:', selectedProvince);
  console.log('  Total rotas do PSM:', routesByPSM[selectedOperator].length);
  console.log('  Rotas após filtro:', routesToProcess.length);
  
  let stats = {
      transporteSum: 0,              // v3.13.25: Transporte do quadrimestre SELECIONADO
      indisponiveisSum: 0,           // SOMA do quadrimestre
      totalReparadasSum: 0,          // SOMA acumulada
      reconhecidasSum: 0,            // SOMA
      depPassagensSum: 0,            // SOMA
      depLicencaSum: 0,              // SOMA
      depCutoverSum: 0,              // SOMA
      fibrasDependentesLast: 0       // Última semana do quadrimestre
    };

    // CÁLCULO 1: Transporte - último valor de cada rota no quadrimestre

    console.log('🔍 DEBUG TRANSPORTE (ÚLTIMO VALOR POR ROTA):');

    let transporteCount = 0;
    let transporteDebugSamples = [];
    
    // Para cada rota, pegar último valor de Transporte
    routesToProcess.forEach(route => {
      let ultimoTransporte = 0;
      
      quarterWeeks.forEach(week => {
        const routeData = data[selectedOperator]?.[week]?.[route];
        if (routeData) {
          const transporte = parseInt(routeData['Transporte']) || 0;
          if (transporte > 0) {
            ultimoTransporte = transporte; // Atualiza para o último valor
            if (transporteDebugSamples.length < 3) {
              transporteDebugSamples.push(`${week}/${route}: ${transporte}`);
            }
          }
        }
      });
      
      if (ultimoTransporte > 0) {
        transporteCount++;
        stats.transporteSum += ultimoTransporte;
      }
    });

    transporteDebugSamples.forEach(sample => console.log('    -', sample));

    // CÁLCULO 2-7: Para cada rota, pegar ÚLTIMO VALOR de cada status (exceto Total Reparadas que acumula)
    const routeLastValues = {}; // Armazena último valor de cada rota
    
    routesToProcess.forEach(route => {
      routeLastValues[route] = {
        indisponiveis: 0,
        totalReparadas: 0, // Este ACUMULA
        reconhecidas: 0,
        depPassagem: 0,
        depLicenca: 0,
        depCutover: 0,
        fibrasDep: 0
      };
      
      // Percorrer semanas do quadrimestre
      quarterWeeks.forEach(week => {
        const routeData = data[selectedOperator]?.[week]?.[route];
        if (routeData) {
          // Pegar último valor diferente de zero
          const indispVal = parseInt(routeData['Indisponíveis'], 10) || 0;
          const reconhVal = parseInt(routeData['Reconhecidas'], 10) || 0;
          const depPassVal = parseInt(routeData['Dep. de Passagem de Cabo'], 10) || 0;
          const depLicVal = parseInt(routeData['Dep. de Licença'], 10) || 0;
          const depCutVal = parseInt(routeData['Dep. de Cutover'], 10) || 0;
          const fibrasVal = parseInt(routeData[`Fibras dependentes da ${selectedOperator}`], 10) || 0;
          
          if (indispVal > 0) routeLastValues[route].indisponiveis = indispVal;
          if (reconhVal > 0) routeLastValues[route].reconhecidas = reconhVal;
          if (depPassVal > 0) routeLastValues[route].depPassagem = depPassVal;
          if (depLicVal > 0) routeLastValues[route].depLicenca = depLicVal;
          if (depCutVal > 0) routeLastValues[route].depCutover = depCutVal;
          if (fibrasVal > 0) routeLastValues[route].fibrasDep = fibrasVal;
          
          // Total Reparadas ACUMULA (soma)
          const reparadasVal = parseInt(routeData['Total Reparadas'], 10) || 0;
          routeLastValues[route].totalReparadas += reparadasVal;
        }
      });
    });
    
    // v3.40.71: GUARDAR VALORES ORIGINAIS (antes da redução) para GRUPO 1 (cards do header)
    // GRUPO 1: USA TODAS AS SEMANAS DO QUADRIMESTRE (valores originais completos)
    const statsOriginais = {
      transporteSum: stats.transporteSum,
      totalReparadasSum: stats.totalReparadasSum,
      indisponiveisSum: 0,
      reconhecidasSum: 0,
      depPassagensSum: 0,
      depLicencaSum: 0,
      depCutoverSum: 0,
      fibrasDependentesLast: 0
    };
    
    // Calcular somas ORIGINAIS (sem redução) - TODAS SEMANAS DO QUADRIMESTRE
    Object.values(routeLastValues).forEach(values => {
      const indisponiveisOriginais = values.reconhecidas + values.depPassagem + 
                                      values.depLicenca + values.depCutover + values.fibrasDep;
      
      statsOriginais.indisponiveisSum += indisponiveisOriginais;
      statsOriginais.reconhecidasSum += values.reconhecidas;
      statsOriginais.depPassagensSum += values.depPassagem;
      statsOriginais.depLicencaSum += values.depLicenca;
      statsOriginais.depCutoverSum += values.depCutover;
      statsOriginais.fibrasDependentesLast += values.fibrasDep;
    });

    // v3.40.72: CÁLCULO SEPARADO PARA GRUPO 2 - APENAS ATÉ SEMANA SELECIONADA
    const selectedWeekNum = parseInt(selectedWeek.substring(1)); // W49 -> 49
    const weeksAteSelecao = quarterWeeks.filter(week => {
      const weekNum = parseInt(week.substring(1));
      return weekNum <= selectedWeekNum;
    });
    
    console.log(`📅 GRUPO 2: Calculando até semana ${selectedWeek} (${weeksAteSelecao.length} semanas)`);
    
    const routeValuesAteSelecao = {}; // Valores até a semana selecionada
    
    routesToProcess.forEach(route => {
      routeValuesAteSelecao[route] = {
        totalReparadas: 0,
        reconhecidas: 0,
        depPassagem: 0,
        depLicenca: 0,
        depCutover: 0,
        fibrasDep: 0
      };
      
      // Percorrer APENAS até a semana selecionada
      weeksAteSelecao.forEach(week => {
        const routeData = data[selectedOperator]?.[week]?.[route];
        if (routeData) {
          const reconhVal = parseInt(routeData['Reconhecidas']) || 0;
          const depPassVal = parseInt(routeData['Dep. de Passagem de Cabo']) || 0;
          const depLicVal = parseInt(routeData['Dep. de Licença']) || 0;
          const depCutVal = parseInt(routeData['Dep. de Cutover']) || 0;
          const fibrasVal = parseInt(routeData[`Fibras dependentes da ${selectedOperator}`]) || 0;
          
          if (reconhVal > 0) routeValuesAteSelecao[route].reconhecidas = reconhVal;
          if (depPassVal > 0) routeValuesAteSelecao[route].depPassagem = depPassVal;
          if (depLicVal > 0) routeValuesAteSelecao[route].depLicenca = depLicVal;
          if (depCutVal > 0) routeValuesAteSelecao[route].depCutover = depCutVal;
          if (fibrasVal > 0) routeValuesAteSelecao[route].fibrasDep = fibrasVal;
          
          // Total Reparadas ACUMULA (soma)
          const reparadasVal = parseInt(routeData['Total Reparadas']) || 0;
          routeValuesAteSelecao[route].totalReparadas += reparadasVal;
        }
      });
    });
    
    // V5.06.1: CÁLCULO COM DISTRIBUIÇÃO - Usar ÚLTIMA semana de cada rota
    console.log(`📊 V5.06.1: Calculando Dashboard (última semana de cada rota)`);
    
    routesToProcess.forEach(route => {
      // Buscar última semana com dados para esta rota
      let ultimaSemana = null;
      for (let i = weeksAteSelecao.length - 1; i >= 0; i--) {
        const week = weeksAteSelecao[i];
        const routeData = data[selectedOperator]?.[week]?.[route];
        if (routeData) {
          ultimaSemana = week;
          break;
        }
      }
      
      if (ultimaSemana) {
        // Usar valores reduzidos da última semana
        const reconhecidasReduzido = getValorReduzido(selectedOperator, ultimaSemana, route, 'Reconhecidas');
        const depPassagemReduzido = getValorReduzido(selectedOperator, ultimaSemana, route, 'Dep. de Passagem de Cabo');
        const depLicencaReduzido = getValorReduzido(selectedOperator, ultimaSemana, route, 'Dep. de Licença');
        const depCutoverReduzido = getValorReduzido(selectedOperator, ultimaSemana, route, 'Dep. de Cutover');
        const fibrasDepReduzido = getValorReduzido(selectedOperator, ultimaSemana, route, `Fibras dependentes da ${selectedOperator}`);
        
        stats.reconhecidasSum += reconhecidasReduzido;
        stats.depPassagensSum += depPassagemReduzido;
        stats.depLicencaSum += depLicencaReduzido;
        stats.depCutoverSum += depCutoverReduzido;
        stats.fibrasDependentesLast += fibrasDepReduzido;
        
        // Total Reparadas ACUMULA todas as semanas
        const values = routeValuesAteSelecao[route];
        stats.totalReparadasSum += values.totalReparadas;
      }
    });
    
    // Indisponíveis = soma dos reduzidos
    stats.indisponiveisSum = stats.reconhecidasSum + stats.depPassagensSum + 
                             stats.depLicencaSum + stats.depCutoverSum + 
                             stats.fibrasDependentesLast;
    
    console.log(`✅ Dashboard calculado:`, {
      reconhecidas: stats.reconhecidasSum,
      depPassagens: stats.depPassagensSum,
      depLicenca: stats.depLicencaSum,
      depCutover: stats.depCutoverSum,
      fibrasDep: stats.fibrasDependentesLast,
      totalReparadas: stats.totalReparadasSum,
      indisponiveis: stats.indisponiveisSum
    });


    console.log(`  ✓ Soma Fibras Dependentes (último valor de cada rota): ${stats.fibrasDependentesLast}`);

  // v3.40.71: GRUPO 1 (Header) - USA VALORES ORIGINAIS (exceto Total Reparadas que é dinâmico)
  const headerCardsData = {
    transporteQ2: { 
      label: (() => {
        if (selectedQuarter === 'Q1') {
          const anoAnterior = parseInt(selectedYear) - 1;
          return `Transporte Q3 (${anoAnterior})`;
        } else if (selectedQuarter === 'Q2') {
          return `Transporte Q1`;
        } else if (selectedQuarter === 'Q3') {
          return `Transporte Q2`;
        }
        return `Transporte Q1`;
      })(),
      value: statsOriginais.transporteSum,  // Original
      color: 'bg-slate-700', 
      textColor: 'text-white' 
    },
    indisponiveis: { 
      label: 'Indisponíveis', 
      value: statsOriginais.indisponiveisSum,  // Original (sem redução)
      color: 'bg-red-500', 
      textColor: 'text-white' 
    },
    totalReparadas: { 
      label: 'Total Reparadas', 
      value: stats.totalReparadasSum,  // Dinâmico ✅
      color: 'bg-green-500', 
      textColor: 'text-white' 
    },
    reconhecidas: { 
      label: 'Reconhecidas', 
      value: statsOriginais.reconhecidasSum,  // Original (sem redução)
      color: 'bg-cyan-500', 
      textColor: 'text-white' 
    },
    depPassagens: { 
      label: 'Dep. Passagens', 
      value: statsOriginais.depPassagensSum,  // Original (sem redução)
      color: 'bg-blue-500', 
      textColor: 'text-white' 
    },
    depLicenca: { 
      label: 'Dep. Licença', 
      value: statsOriginais.depLicencaSum,  // Original (sem redução)
      color: 'bg-orange-500', 
      textColor: 'text-white' 
    },
    depCutover: { 
      label: 'Dep. Cutover', 
      value: statsOriginais.depCutoverSum,  // Original (sem redução)
      color: 'bg-purple-600', 
      textColor: 'text-white' 
    },
    fibrasDep: { 
      label: `Fibras Dep. ${selectedOperator}`, 
      value: statsOriginais.fibrasDependentesLast,  // Original (sem redução)
      color: 'bg-slate-600', 
      textColor: 'text-white' 
    }
  };

  // v3.17.8: GRUPO 2 (Dashboard Executivo) - USA VALORES COM REDUÇÃO POR PRIORIDADE
  const executiveDashboard = {
    transporteQ2: { 
      label: (() => {
        if (selectedQuarter === 'Q1') {
          const anoAnterior = parseInt(selectedYear) - 1;
          return `Transporte Q3 (${anoAnterior})`;
        } else if (selectedQuarter === 'Q2') {
          return `Transporte Q1`;
        } else if (selectedQuarter === 'Q3') {
          return `Transporte Q2`;
        }
        return `Transporte Q1`;
      })(),
      value: stats.transporteSum,  // Com redução
      color: 'bg-slate-700', 
      textColor: 'text-white' 
    },
    indisponiveis: { 
      label: 'Indisponíveis', 
      value: stats.indisponiveisSum,  // Com redução ✅
      color: 'bg-red-500', 
      textColor: 'text-white' 
    },
    totalReparadas: { 
      label: 'Total Reparadas', 
      value: stats.totalReparadasSum,  // Dinâmico ✅
      color: 'bg-green-500', 
      textColor: 'text-white' 
    },
    reconhecidas: { 
      label: 'Reconhecidas', 
      value: stats.reconhecidasSum,  // Com redução ✅
      color: 'bg-cyan-500', 
      textColor: 'text-white' 
    },
    depPassagens: { 
      label: 'Dep. Passagens', 
      value: stats.depPassagensSum,  // Com redução ✅
      color: 'bg-blue-500', 
      textColor: 'text-white' 
    },
    depLicenca: { 
      label: 'Dep. Licença', 
      value: stats.depLicencaSum,  // Com redução ✅
      color: 'bg-orange-500', 
      textColor: 'text-white' 
    },
    depCutover: { 
      label: 'Dep. Cutover', 
      value: stats.depCutoverSum,  // Com redução ✅
      color: 'bg-purple-600', 
      textColor: 'text-white' 
    },
    fibrasDep: { 
      label: `Fibras Dep. ${selectedOperator}`, 
      value: stats.fibrasDependentesLast,  // Com redução ✅
      color: 'bg-slate-600', 
      textColor: 'text-white' 
    }
  };

  // v3.13.20: Dados DINÂMICOS para os cards superiores (GRUPO 1 - Header)
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
      value: headerCardsData.indisponiveis.v