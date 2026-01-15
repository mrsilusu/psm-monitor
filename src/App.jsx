import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  TrendingDown,
  Home,
  Upload,
  FileJson,
  Download,
  Calendar,
  BarChart,
  FileText,
  Menu,
  PieChart,
  DownloadCloud,
  Trash2,
  AlertCircle,
} from "lucide-react";
const PSMMonitorApp = () => {
  console.log(
    "🚀 PSM Monitor v3.49.10 - CORRIGIDO: naoTestadas agora salva no estado"
  );

  // ============================================================================
  // MAPEAMENTO DE ROTAS PARA PROVÍNCIAS
  // ============================================================================
  const routeToProvince = {
    // CABINDA (17 rotas - ISISTEL)
    "BSC_Cabinda - Quatro": "Cabinda",
    "BSC_Cabinda - Resistencia (Cabo_1)": "Cabinda",
    "BSC_Cabinda - Resistencia (Cabo_2)": "Cabinda",
    "Cine_Popular - BSC_Cabinda": "Cabinda",
    Corda_Expansão_Cabassango: "Cabinda",
    "Hoji_Cacongo - Belize": "Cabinda",
    "Hoji_Cacongo - Massabe_Fronteira": "Cabinda",
    "Lucola - Hoji_Cacongo": "Cabinda",
    "Lucola - Tchizu_O": "Cabinda",
    "Massabi_Fronteira - Belize": "Cabinda",
    "PV_Grande_NT - Tchizu_O": "Cabinda",
    "PV_Grande_NT - Yema_Fronteira": "Cabinda",
    "Quatro - PV_Grande_NT": "Cabinda",
    "Quatro - Tchizu_O": "Cabinda",
    "Resistencia - Cine_Popular": "Cabinda",
    "Resistencia - Lucola": "Cabinda",
    "Tchizu_O - Cine_Popular": "Cabinda",

    // ZAIRE (v3.40.0: 22 rotas - nomes padronizados)
    "Mucula - Soyo": "Zaire",
    "Nzeto - Mucula": "Zaire",
    "Nzeto - Soyo": "Zaire",
    "Ambriz - N'zeto": "Zaire",
    "Lucenga - Mucula": "Zaire",
    "Mbanza Congo - Noqui": "Zaire",
    "Cuimba - Nguabi": "Zaire",
    "Mbaza Centro - Cuimba": "Zaire",
    "Tomboco - Lussenga": "Zaire",
    "Tomboco - Mbanza Congo": "Zaire",
    "Nzeto - Lussenga": "Zaire",
    "Mbanza Congo_Sul - BSC ODF 3 (11 de Novembro)": "Zaire",
    "Mbanza Congo_Sul - BSC ODF 4": "Zaire",
    "Kimbumba - Soyo_Centro": "Zaire",
    "Kwanda_DCS - Kwanda_O": "Zaire",
    "Kwanda_DCS - Porto": "Zaire",
    "Kwanda_DCS - Loja": "Zaire",
    "Kwanda_O - Loja": "Zaire",
    "Kwanda_O - Porto": "Zaire",
    "Kwanda_DCS- ODFB1- JFO(288)ALNG": "Zaire",
    "Kwanada_O (ODFB2)- JFO11 Porto": "Zaire",
    "Kwanda_O (ODFB3)- JFO(288)- Azul Energi": "Zaire",

    // UÍGE
    "Kimbundo - Uige (Inca)": "Uíge",
    "Muquiama - Kimbundo": "Uíge",
    "Nguabi - Damba": "Uíge",
    "Damba - Uige(Negage_CRT)": "Uíge",
    "Negage - Camabatela": "Uíge",
    "Uíge - Negage": "Uíge",
    "Camabatela - Lucala": "Uíge",
    "Uíge_CTR - Unipop_Oeste ODF 2": "Uíge",
    "Uíge_CTR - Unipop_Oeste ODF 1": "Uíge",

    // MALANGE (v3.38.0: Nomes padronizados com routesByPSM.FIBRASOL)
    "Malange (Vila Matilde) - Mulo": "Malanje",
    "Mulo - Cuango": "Malanje",
    "Mussende - Malange (Catepa)": "Malanje",
    "Calucinga - Mussende": "Malanje",
    "Malange (Lumbo) - Lucala": "Malanje",
    "BSC_Malange - Canambua": "Malanje",
    "Hospital - Lumbo": "Malanje",
    "Malange_CTR - Lumbo e Bsc": "Malanje",
    "Lumbo - BSC_Malange": "Malanje",
    "Canambua - Vila_Matilde": "Malanje",
    "Vila_Matilde - Hospital": "Malanje",
    "Maxinde (Expansão) - Lumbo": "Malanje",
    "Maxinde (Expansão) - BSC": "Malanje",

    // CUANZA NORTE (v3.40.1: 7 rotas - conforme imagem de referência)
    "Maria teresa Gulungo_Alto - Nadalatando": "Cuanza Norte",
    "Alto Dondo - Quibala": "Cuanza Norte",
    "Ndalatando - Alto_Dondo": "Cuanza Norte",
    "Lucala - Ndalatando": "Cuanza Norte",
    "Ndala Norte - Ndala_Leste": "Cuanza Norte",
    "Ndala Norte - KN_Azul": "Cuanza Norte",
    "Ndala_CTR(BSC Ndalatando) - KN_Azul": "Cuanza Norte",

    // v3.35.0: CUANGO transferido para MALANJE (conforme imagem de referência)
    "Cuango - Cafunfo": "Malanje",
    "Cuango - Caungula": "Malanje",

    // LUNDA NORTE
    "Aeroporto - Estadio": "Lunda Norte",
    "Cambacumba - Dundo": "Lunda Norte",
    "Camissombo (Lucapa) - Dundo": "Lunda Norte",
    "Caungula - Cuilo": "Lunda Norte",
    "Chitato - Luachimo": "Lunda Norte",
    "Cuilo - Cambacumba": "Lunda Norte",
    "Dundo_CRT - Dundo_Norte": "Lunda Norte",
    "Dundo_CRT - Samanhonga": "Lunda Norte",
    "Dundo_CRT ODF1 - Dundo_CRT ODF2": "Lunda Norte",
    "Dundo_Norte - Chitato": "Lunda Norte",
    "Estadio - Loja_Dundo": "Lunda Norte",
    "Loja_Dundo - Dundo_CRT": "Lunda Norte",
    "Luachimo - Dundo_CRT": "Lunda Norte",
    "Lucapa - Dundo": "Lunda Norte",
    "Samanhonga - Aeroporto": "Lunda Norte",

    // LUNDA SUL
    "Cazombo -- Karipande": "Lunda Sul",
    "Cazombo - Karipande": "Lunda Sul",
    "Dala - Saurimo": "Lunda Sul",
    "Luau -- Massibi": "Lunda Sul",
    "Luau - Massibi": "Lunda Sul",
    "Massibi -- Cazombo": "Lunda Sul",
    "Massibi - Cazombo": "Lunda Sul",
    "Muconda -- Luau": "Lunda Sul",
    "Muconda - Luau": "Lunda Sul",
    "Neto - Santo Antonio": "Lunda Sul",
    "Neto - Terra_Nova (Saurimo_Sul)": "Lunda Sul",
    "Santo Antonio - Terra Nova": "Lunda Sul",
    "Saurimo - Muconda": "Lunda Sul",
    "Saurimo - Lucapa": "Lunda Sul",
    "Saurimo - Dala": "Lunda Sul",
    "Saurimo(Br_Muconda) - Muconda": "Lunda Sul",
    "Saurimo Norte -- IEIA": "Lunda Sul",
    "Saurimo_CRT - IEIA": "Lunda Sul",
    "Saurimo_Norte - Neto": "Lunda Sul",
    "Stº António - Saurimo_sul": "Lunda Sul",
    "Terra_Nova - Saurimo_CRT": "Lunda Sul",

    // MOXICO
    "Br_Capango_Sul - Sacalunda": "Moxico",
    "Cangumbe - Luena": "Moxico",
    "Cuemba - Cangumbe": "Moxico",
    "Dom_Bosco - Luena_CTR": "Moxico",
    "Lucusse - Lutembo": "Moxico",
    "Luena - Dala": "Moxico",
    "Luena - Lucusse": "Moxico",
    "Luena_CTR - Luena_Largo": "Moxico",
    "Luena_Largo - Zorro": "Moxico",
    "Lumbala Nguimbo - Ninda": "Moxico",
    "Lutembo - Lumbala Nguimbo": "Moxico",
    "Ninda - Malundo": "Moxico",
    "Sacalunda - Dom_Bosco": "Moxico",
    "Zorro - Br_Capango_Sul": "Moxico",
  };

  // MAPEAMENTO DE PROVÍNCIA PARA PSM
  // v3.37.0: Lunda Norte agora é exclusiva da ANGLOBAL
  const provinceToOperator = {
    Cabinda: "ISISTEL",
    Zaire: "FIBRASOL",
    Uíge: "FIBRASOL",
    Malange: "FIBRASOL",
    "Cuanza Norte": "FIBRASOL",
    "Lunda Norte": "ANGLOBAL",
    "Lunda Sul": "ANGLOBAL",
    Moxico: "ANGLOBAL",
  };

  // MAPEAMENTO DE PSM PARA PROVÍNCIAS DISPONÍVEIS
  // v3.37.0: Lunda Norte REMOVIDA da FIBRASOL (Cuango está em Malanje)
  const operatorToProvinces = {
    ISISTEL: ["Cabinda"],
    FIBRASOL: ["Zaire", "Uíge", "Malanje", "Cuanza Norte"],
    ANGLOBAL: ["Lunda Norte", "Lunda Sul", "Moxico"],
  };

  // ============================================================================
  // FASE 7: ESTRUTURA DE DADOS CENTRAL
  // ============================================================================

  // Configuração de quadrimestres
  const quarterConfig = {
    Q1: { start: 1, end: 18, weeks: 18 }, // W1-W18
    Q2: { start: 19, end: 35, weeks: 17 }, // W19-W35
    Q3: { start: 36, end: 52, weeks: 17 }, // W36-W52
  };

  // Gerar array de semanas [W1, W2, ..., W52]
  const allWeeks = Array.from({ length: 52 }, (_, i) => `W${i + 1}`);

  // Definição das 8 categorias de status
  const statusCategories = [
    "Transporte",
    "Indisponíveis",
    "Total Reparadas",
    "Reconhecidas",
    "Dep. de Passagem de Cabo",
    "Dep. de Licença",
    "Dep. de Cutover",
    "Fibras Dependentes", // Será "Fibras dependentes da [PSM]"
  ];

  // Definição das rotas por PSM (Total: 104 rotas)
  const routesByPSM = {
    // ISISTEL: 17 rotas (Cabinda) - ORDEM ALFABÉTICA
    ISISTEL: [
      "BSC_Cabinda - Quatro",
      "BSC_Cabinda - Resistencia (Cabo_1)",
      "BSC_Cabinda - Resistencia (Cabo_2)",
      "Cine_Popular - BSC_Cabinda",
      "Corda_Expansão_Cabassango",
      "Hoji_Cacongo - Belize",
      "Hoji_Cacongo - Massabe_Fronteira",
      "Lucola - Hoji_Cacongo",
      "Lucola - Tchizu_O",
      "Massabi_Fronteira - Belize",
      "PV_Grande_NT - Tchizu_O",
      "PV_Grande_NT - Yema_Fronteira",
      "Quatro - PV_Grande_NT",
      "Quatro - Tchizu_O",
      "Resistencia - Cine_Popular",
      "Resistencia - Lucola",
      "Tchizu_O - Cine_Popular",
    ],

    // FIBRASOL: 53 rotas (Norte/Leste) - ORDEM ALFABÉTICA
    FIBRASOL: [
      "Alto Dondo - Quibala",
      "Ambriz - N'zeto",
      "BSC_Malange - Canambua",
      "Calucinga - Mussende",
      "Camabatela - Lucala",
      "Canambua - Vila_Matilde",
      "Cuango - Cafunfo",
      "Cuango - Caungula",
      "Cuimba - Nguabi",
      "Damba - Uige(Negage_CRT)",
      "Hospital - Lumbo",
      "Kimbumba - Soyo_Centro",
      "Kimbundo - Uige (Inca)",
      "Kwanada_O (ODFB2)- JFO11 Porto",
      "Kwanda_DCS - Kwanda_O",
      "Kwanda_DCS - Loja",
      "Kwanda_DCS - Porto",
      "Kwanda_DCS- ODFB1- JFO(288)ALNG",
      "Kwanda_O (ODFB3)- JFO(288)- Azul Energi",
      "Kwanda_O - Loja",
      "Kwanda_O - Porto",
      "Lucala - Ndalatando",
      "Lucenga - Mucula",
      "Lumbo - BSC_Malange",
      "Malange (Lumbo) - Lucala",
      "Malange (Vila Matilde) - Mulo",
      "Malange_CTR - Lumbo e Bsc",
      "Maria teresa Gulungo_Alto - Nadalatando",
      "Maxinde (Expansão) - BSC",
      "Maxinde (Expansão) - Lumbo",
      "Mbanza Congo - Noqui",
      "Mbanza Congo_Sul - BSC ODF 3 (11 de Novembro)",
      "Mbanza Congo_Sul - BSC ODF 4",
      "Mbaza Centro - Cuimba",
      "Mucula - Soyo",
      "Mulo - Cuango",
      "Muquiama - Kimbundo",
      "Mussende - Malange (Catepa)",
      "Ndala Norte - KN_Azul",
      "Ndala Norte - Ndala_Leste",
      "Ndala_CTR(BSC Ndalatando) - KN_Azul",
      "Ndalatando - Alto_Dondo",
      "Negage - Camabatela",
      "Nguabi - Damba",
      "Nzeto - Lussenga",
      "Nzeto - Mucula",
      "Nzeto - Soyo",
      "Tomboco - Lussenga",
      "Tomboco - Mbanza Congo",
      "Uíge - Negage",
      "Uíge_CTR - Unipop_Oeste ODF 1",
      "Uíge_CTR - Unipop_Oeste ODF 2",
      "Vila_Matilde - Hospital",
    ],

    // ANGLOBAL: 34 rotas (Leste/Sul) - ORDEM ALFABÉTICA
    ANGLOBAL: [
      "Br_Capango_Sul - Sacalunda",
      "Cambacumba - Dundo",
      "Camissombo (Lucapa) - Dundo",
      "Cangumbe - Luena",
      "Caungula - Cuilo",
      "Cazombo - Karipande",
      "Cuemba - Cangumbe",
      "Cuilo - Cambacumba",
      "Dom_Bosco - Luena_CTR",
      "Dundo_CRT ODF1 - Dundo_CRT ODF2",
      "Luau - Massibi",
      "Lucusse - Lutembo",
      "Luena - Dala",
      "Luena - Lucusse",
      "Luena_CTR - Luena_Largo",
      "Luena_Largo - Zorro",
      "Lumbala Nguimbo - Ninda",
      "Lutembo - Lumbala Nguimbo",
      "Massibi - Cazombo",
      "Muconda - Luau",
      "Neto - Santo Antonio",
      "Neto - Terra_Nova (Saurimo_Sul)",
      "Ninda - Malundo",
      "Sacalunda - Dom_Bosco",
      "Santo Antonio - Terra Nova",
      "Saurimo - Dala",
      "Saurimo - Lucapa",
      "Saurimo(Br_Muconda) - Muconda",
      "Saurimo_CRT - IEIA",
      "Saurimo_Norte - Neto",
      "Stº António - Saurimo_sul",
      "Terra_Nova - Saurimo_CRT",
      "Terra_Nova - Saurimo_CRT",
      "Zorro - Br_Capango_Sul",
    ],
  };

  // ESTADO PRINCIPAL: DATA
  // Estrutura: { PSM: { SEMANA: { ROTA: { categoria: valor } } } }
  const [data, setData] = useState(() => {
    // Tentar carregar do localStorage
    const saved = window.localStorage.getItem("psm_rotas_data_v3");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    }

    // Inicializar estrutura vazia
    const initialData = {};
    Object.keys(routesByPSM).forEach((psm) => {
      initialData[psm] = {};
      allWeeks.forEach((week) => {
        initialData[psm][week] = {};
        routesByPSM[psm].forEach((route) => {
          initialData[psm][week][route] = {
            Transporte: "",
            Indisponíveis: "",
            "Total Reparadas": "",
            Reconhecidas: "",
            "Dep. de Passagem de Cabo": "",
            "Dep. de Licença": "",
            "Dep. de Cutover": "",
            [`Fibras dependentes da ${psm}`]: "",
          };
        });
      });
    });

    return initialData;
  });

  // ESTADO: JUSTIFICATIVAS
  // Estrutura: { 'PSM_Rota': { seccao, regiao, transporteQ2, indisponiveis, delta, justificativa } }
  const [justificativas, setJustificativas] = useState(() => {
    const saved = window.localStorage.getItem("psm_justificativas_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar justificativas:", e);
        return {};
      }
    }
    return {};
  });

  // ============================================================================
  // ESTADOS DE UI (mantidos da v1.5.0)
  // ============================================================================

  // Estados para os filtros e menu
  const [selectedOperator, setSelectedOperator] = useState("FIBRASOL");
  const [selectedWeek, setSelectedWeek] = useState("W50");
  const [selectedQuarter, setSelectedQuarter] = useState("Q3");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [menuOpen, setMenuOpen] = useState(false);

  // v3.40.27: Estados para sino de alertas
  const [alertasAbertos, setAlertasAbertos] = useState(false);
  const [alertasLidos, setAlertasLidos] = useState([]);

  // v3.40.73: Estado para toggle Efetividade (Global ou PSM)
  const [efetividadeMode, setEfetividadeMode] = useState("global"); // 'global' ou 'psm'

  // v3.42.00: Estado para painel Testes e Análises
  const [showTestesAnalises, setShowTestesAnalises] = useState(false);

  // v3.42.01: Estados para dados de Testes e Análises
  const [testesData, setTestesData] = useState({
    cadastradas: 0,
    testadas: 0,
    validadas: 0, // v3.49.10: Adicionar
    pendentes: 0,
    naoTestadas: 0, // v3.49.10: Adicionar
    semIndisponibilidade: 0,
    semIndisponibilidadeTecnica: 0, // v3.49.10: Adicionar
    estaveis: 0,
    concluidas: 0,
    comGanho: 0,
    degradadas: 0, // v3.49.10: Adicionar
    comIndisponibilidades: 0,
  });

  // v3.42.03: Estados para dados de todos os PSMs (comparação)
  const [todosTestesData, setTodosTestesData] = useState({
    FIBRASOL: null,
    ISISTEL: null,
    ANGLOBAL: null,
  });

  // v3.48.00: Estados para validação POR SEMANA
  // Estrutura: { PSM: { semana: { rota: { testada: true } } } }
  const [rotasTestadas, setRotasTestadas] = useState(() => {
    const saved = window.localStorage.getItem("psm_rotas_testadas_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar rotas testadas:", e);
      }
    }
    return {};
  });

  const [rotasValidadas, setRotasValidadas] = useState(() => {
    const saved = window.localStorage.getItem("psm_rotas_validadas_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar rotas validadas:", e);
      }
    }
    return {};
  });

  const [tabelaValidacaoAberta, setTabelaValidacaoAberta] = useState(false);

  // v3.48.00: Salvar validações no localStorage automaticamente
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "psm_rotas_testadas_v2",
        JSON.stringify(rotasTestadas)
      );
      window.localStorage.setItem(
        "psm_rotas_validadas_v2",
        JSON.stringify(rotasValidadas)
      );
    } catch (e) {
      console.error("Erro ao salvar validações:", e);
    }
  }, [rotasTestadas, rotasValidadas]);

  // v3.48.02: Função para obter quarter de uma semana
  const getQuarterFromWeek = (week) => {
    const weekNum = parseInt(week.substring(1));
    if (weekNum >= 1 && weekNum <= 18) return "Q1";
    if (weekNum >= 19 && weekNum <= 35) return "Q2";
    if (weekNum >= 36 && weekNum <= 52) return "Q3";
    return "Q1";
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

    quarterWeeks.forEach((semana) => {
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

    quarterWeeks.forEach((semana) => {
      if (rotasValidadas[psm][semana]?.[rota]?.validada === true) {
        semanas.push(semana);
      }
    });
    return semanas.sort();
  };

  const getSemanasTestadas = (psm, rota) => {
    if (!rotasTestadas[psm]) return [];
    const semanas = [];
    Object.keys(rotasTestadas[psm]).forEach((semana) => {
      if (rotasTestadas[psm][semana][rota]?.testada === true) {
        semanas.push(semana);
      }
    });
    return semanas.sort();
  };

  const getSemanasValidadas = (psm, rota) => {
    if (!rotasValidadas[psm]) return [];
    const semanas = [];
    Object.keys(rotasValidadas[psm]).forEach((semana) => {
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

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => container.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // v3.43.01: Calcular dados baseado em VALIDAÇÕES MANUAIS (lógica corrigida)
  useEffect(() => {
    if (!selectedOperator || selectedOperator === "Global") return;

    console.log(
      "🧪 Calculando dados de Testes e Análises para",
      selectedOperator
    );

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

    let testadas = 0; // Total com tick em "Testada"
    let validadas = 0; // Total com tick em "Validada"
    let pendentes = 0; // Testada ✓ + Validada ✗
    let naoTestadas = 0; // Testada ✗

    // v3.43.02: Métricas técnicas baseadas em dados
    let semIndisponibilidade = 0; // Zeradas (último indisp = 0)
    let estaveis = 0; // Sem variação
    let comGanho = 0; // Melhorando (reduzindo indisp)
    let degradadas = 0; // Piorando (aumentando indisp)
    let concluidas = 0;
    let comIndisponibilidades = 0;

    // Analisar cada rota
    rotas.forEach((rota) => {
      // v3.48.02: Verificar se foi testada/validada NO QUARTER SELECIONADO
      const foiTestada = isRotaTestadaGlobalNoQuarter(
        selectedOperator,
        rota,
        selectedQuarter
      );
      const foiValidada = isRotaValidadaGlobalNoQuarter(
        selectedOperator,
        rota,
        selectedQuarter
      );

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
        const semanasValidadas = getSemanasValidadasNoQuarter(
          selectedOperator,
          rota,
          selectedQuarter
        );

        console.log(
          `🔍 Analisando rota VALIDADA: ${rota} nas semanas: ${semanasValidadas.join(
            ", "
          )}`
        );

        // Analisar APENAS as semanas onde foi marcada como validada
        semanasValidadas.forEach((week) => {
          const weekData = data[selectedOperator]?.[week]?.[rota];

          if (weekData) {
            const transp = parseInt(weekData["Transporte"]) || 0;
            const indisp = parseInt(weekData["Indisponíveis"]) || 0;

            // v3.49.02: Classificar baseado nos dados DESTA semana específica
            // SEM INDISPONIBILIDADE (prioridade máxima)
            if (indisp === 0) {
              semIndisponibilidade++;
              console.log(
                `  ✅ ${week}: Sem Indisp (T=${transp}, I=${indisp})`
              );
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

    console.log("📊 TOTAIS:");
    console.log(`  🟢 Sem Indisponibilidade: ${semIndisponibilidade}`);
    console.log(`  📈 Com Ganho: ${comGanho}`);
    console.log(`  ⚪ Estável: ${estaveis}`);
    console.log(`  📉 Degradada: ${degradadas}`);

    setTestesData({
      cadastradas: totalRotas,
      testadas, // Rotas com tick em Testada
      validadas, // v3.49.10: Adicionar validadas
      pendentes, // v3.43.01: Testada ✓ + Validada ✗
      naoTestadas, // v3.49.10: CORRIGIDO - Rotas sem tick em Testada
      semIndisponibilidade: validadas, // Rotas com tick em Validada
      semIndisponibilidadeTecnica: semIndisponibilidade, // v3.43.02: Baseado em dados (zeradas)
      estaveis,
      concluidas,
      comGanho,
      degradadas, // v3.43.02: NOVO - Rotas piorando
      comIndisponibilidades,
    });

    console.log("✅ Dados calculados (nova lógica):", {
      cadastradas: totalRotas,
      naoTestadas, // Sem tick em Testada
      testadas, // Com tick em Testada (total)
      pendentes, // Testada ✓ mas Validada ✗
      validadas, // Testada ✓ e Validada ✓
    });
  }, [selectedOperator, selectedQuarter, data, rotasTestadas, rotasValidadas]);

  // v3.43.00: Calcular dados de TODOS os PSMs para comparação (com validação manual)
  useEffect(() => {
    console.log("🔄 Calculando dados de todos os PSMs para comparação...");

    const psms = ["FIBRASOL", "ISISTEL", "ANGLOBAL"];
    const novosDados = {};

    psms.forEach((psm) => {
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
      let degradadas = 0; // NOVO
      let concluidas = 0;
      let comIndisponibilidades = 0;

      rotas.forEach((rota) => {
        // v3.49.03: Usar funções que filtram por quarter
        const foiTestada = isRotaTestadaGlobalNoQuarter(
          psm,
          rota,
          selectedQuarter
        );
        const foiValidada = isRotaValidadaGlobalNoQuarter(
          psm,
          rota,
          selectedQuarter
        );

        // v3.43.01: CLASSIFICAÇÃO
        if (!foiTestada) {
          naoTestadas++;
        } else {
          testadas++;
          if (foiValidada) {
            validadas++;
          } else {
            pendentes++; // Testada ✓ mas Validada ✗
          }
        }

        // v3.49.03: Analisar STATUS TÉCNICO - apenas se VALIDADA
        if (foiValidada) {
          // Percorrer TODAS as semanas do quarter
          quarterWeeks.forEach((week) => {
            const weekData = data[psm]?.[week]?.[rota];

            if (weekData) {
              const transp = parseInt(weekData["Transporte"]) || 0;
              const indisp = parseInt(weekData["Indisponíveis"]) || 0;

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
        validadas, // v3.49.03: Adicionar
        pendentes,
        naoTestadas, // v3.49.03: Adicionar
        semIndisponibilidade: validadas, // Validação manual
        semIndisponibilidadeTecnica: semIndisponibilidade, // v3.49.03: Contagem de semanas
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
        indiceExcelencia:
          testadas > 0
            ? ((validadas / testadas) * 0.3 +
                (concluidas / testadas) * 0.25 +
                (comGanho / testadas) * 0.25 +
                (estaveis / testadas) * 0.2) *
              100
            : 0,
      };
    });

    setTodosTestesData(novosDados);
    console.log("✅ Dados de todos os PSMs calculados:", novosDados);
  }, [selectedQuarter, data, rotasTestadas, rotasValidadas]);

  // v3.40.27: Fechar dropdown de alertas ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertasAbertos && !event.target.closest(".relative")) {
        setAlertasAbertos(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [alertasAbertos]);

  // FASE 1: Filtro de província
  const [selectedProvince, setSelectedProvince] = useState("Todas"); // 'Todas' ou nome da província

  // v3.21.1: Removido showProvincialDashboard (dashboard redundante)

  // v3.17.4: Resetar província quando PSM muda e província não pertence ao novo PSM
  useEffect(() => {
    if (selectedProvince !== "Todas") {
      const provincesOfOperator = operatorToProvinces[selectedOperator];
      if (!provincesOfOperator.includes(selectedProvince)) {
        setSelectedProvince("Todas");
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

  const [viewMode, setViewMode] = useState("carousel"); // 'carousel' ou 'all'
  const [viewModeClassificacao, setViewModeClassificacao] = useState("all"); // PADRÃO: Ver Resumo (all=resumo, carousel=detalhado)
  const [currentGraph, setCurrentGraph] = useState(0); // 0=Degradadas, 1=Com Ganho, 2=Estáveis
  const [currentGraphClassificacao, setCurrentGraphClassificacao] = useState(0); // para carrossel de classificação

  // ============================================================================
  // FASE 8: ESTADOS DE FEEDBACK DE SALVAMENTO
  // ============================================================================

  const [saveStatus, setSaveStatus] = useState("");
  const [lastSaveTime, setLastSaveTime] = useState(null);

  // FASE 1: Estados do modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRota, setSelectedRota] = useState(null);

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

  const goToNextGraphClassificacao = () =>
    setCurrentGraphClassificacao((prev) => (prev + 1) % 3);
  const goToPrevGraphClassificacao = () =>
    setCurrentGraphClassificacao((prev) => (prev - 1 + 3) % 3);
  const goToGraphClassificacao = (index) => setCurrentGraphClassificacao(index);
  const toggleViewMode = () =>
    setViewMode((prev) => (prev === "carousel" ? "all" : "carousel"));
  const toggleViewModeClassificacao = () =>
    setViewModeClassificacao((prev) =>
      prev === "carousel" ? "all" : "carousel"
    );

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
        console.log("✅ Encontrado em", psm, "(match exato)");
        return psm;
      }

      // TENTATIVA 2: Comparação normalizada (case-insensitive)
      const foundRoute = routes.find(
        (r) =>
          r.toLowerCase().replace(/\s+/g, " ").trim() ===
          normalizedRoute.toLowerCase().replace(/\s+/g, " ").trim()
      );

      if (foundRoute) {
        console.log(
          "✅ Encontrado em",
          psm,
          "(match normalizado):",
          foundRoute
        );
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

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      script.onload = () => resolve(window.XLSX);
      script.onerror = () =>
        reject(new Error("Falha ao carregar biblioteca XLSX"));
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
        type: "array",
        codepage: 65001, // UTF-8
        cellFormula: true, // Preservar fórmulas
        cellStyles: true, // Preservar estilos
      });

      // 3. Pegar primeira aba
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // 4. Converter para JSON (array de arrays) COM VALORES CALCULADOS
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false, // Valores como string
        defval: "", // Default vazio
        blankrows: false, // Ignorar linhas vazias
      });

      // 5. Validar arquivo
      if (jsonData.length < 2) {
        alert("Arquivo Excel vazio ou inválido");
        return;
      }

      // 6. Buscar linha de cabeçalho (nas primeiras 5 linhas)
      const newJustificativas = {};
      let headerRow = -1;

      for (let i = 0; i < Math.min(5, jsonData.length); i++) {
        const row = jsonData[i];
        if (
          row &&
          row.some(
            (cell) =>
              cell &&
              (String(cell).toLowerCase().includes("secç") ||
                String(cell).toLowerCase().includes("rota") ||
                String(cell).toLowerCase().includes("secc"))
          )
        ) {
          headerRow = i;

          break;
        }
      }

      if (headerRow === -1) {
        alert(
          'Não foi possível encontrar os cabeçalhos.\n\nVerifique se o arquivo contém uma coluna "Secções" ou "Rota".'
        );
        return;
      }

      // 7. Extrair headers
      const headers = jsonData[headerRow].map((h) =>
        String(h || "")
          .toLowerCase()
          .trim()
      );

      // 8. Encontrar índices das colunas (OTIMIZADO)
      const seccaoIdx = headers.findIndex(
        (h) => h.includes("secç") || h.includes("rota") || h.includes("secc")
      );
      const regiaoIdx = headers.findIndex(
        (h) => h.includes("região") || h.includes("regiao")
      );
      // OTIMIZADO: aceita "Transporte Q 2" (com espaços)
      const transporteIdx = headers.findIndex(
        (h) => h.includes("transporte") && (h.includes("q") || h.includes("2"))
      );
      // OTIMIZADO: aceita "Indisponíveis" simples
      const indisponiveisIdx = headers.findIndex(
        (h) => h.includes("indispon") && !h.includes("delta")
      );
      // OTIMIZADO: aceita "Delta Indisponibilidade" com espaço
      const deltaIdx = headers.findIndex((h) => h.includes("delta"));
      // OTIMIZADO: aceita "JUSTIFICATIVA DEGRADAÇÃO" (maiúsculas)
      const justificativaIdx = headers.findIndex((h) =>
        h.includes("justifica")
      );

      // 9. Validar coluna obrigatória
      if (seccaoIdx === -1) {
        alert(
          'Não foi possível encontrar a coluna "Secções".\n\nColunas encontradas:\n' +
            headers.filter((h) => h).join(", ")
        );
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

        const seccao = row[seccaoIdx] ? String(row[seccaoIdx]).trim() : "";

        // Ignorar linhas vazias ou com fórmulas não resolvidas
        if (
          !seccao ||
          seccao === "" ||
          seccao === "#REF!" ||
          seccao === "#N/A"
        ) {
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
        const regiao =
          regiaoIdx !== -1 && row[regiaoIdx]
            ? String(row[regiaoIdx]).trim()
            : "";

        // OTIMIZADO: converter valores que podem ser fórmulas ou strings
        const parseValue = (val) => {
          if (!val) return 0;
          const str = String(val).trim();
          if (str === "" || str === "#REF!" || str === "#N/A") return 0;
          const num = parseFloat(str);
          return isNaN(num) ? 0 : Math.round(num);
        };

        const transporte =
          transporteIdx !== -1 ? parseValue(row[transporteIdx]) : 0;
        const indisponiveis =
          indisponiveisIdx !== -1 ? parseValue(row[indisponiveisIdx]) : 0;
        const delta = deltaIdx !== -1 ? parseValue(row[deltaIdx]) : 0;

        const justificativa =
          justificativaIdx !== -1 && row[justificativaIdx]
            ? String(row[justificativaIdx]).trim()
            : "";

        // 13. Importar APENAS se tiver pelo menos UM valor diferente de zero
        // REGRA: Se Transporte=0 E Indisponíveis=0 E Delta=0 → NÃO IMPORTAR
        const temDadosValidos =
          transporte > 0 || indisponiveis > 0 || delta !== 0;

        if (temDadosValidos) {
          const key = detectedPSM + "_" + seccao;
          newJustificativas[key] = {
            seccao: seccao,
            regiao: regiao,
            transporte: transporte,
            indisponiveis: indisponiveis,
            delta: delta,
            justificativa: justificativa,
            psm: detectedPSM,
            quarter: selectedQuarter,
          };
          totalImported++;
        } else {
          console.log("  ⚠️ Ignorado (todos valores = 0)");
          skippedRows++;
        }
      }

      // 14. Logs de estatísticas
      console.log("=".repeat(60));

      console.log("=".repeat(60));

      console.log(
        "   ISISTEL:",
        Object.values(newJustificativas).filter((j) => j.psm === "ISISTEL")
          .length
      );
      console.log(
        "   FIBRASOL:",
        Object.values(newJustificativas).filter((j) => j.psm === "FIBRASOL")
          .length
      );
      console.log(
        "   ANGLOBAL:",
        Object.values(newJustificativas).filter((j) => j.psm === "ANGLOBAL")
          .length
      );
      console.log("=".repeat(60));

      // 15. Atualizar estado
      setJustificativas((prev) => {
        const updated = { ...prev, ...newJustificativas };
        console.log(
          "💾 Estado de justificativas atualizado. Total:",
          Object.keys(updated).length
        );
        return updated;
      });

      // 16. Feedback ao usuário (OTIMIZADO)
      if (totalImported === 0) {
        alert(
          "⚠️ Nenhuma justificativa foi importada!\n\n" +
            "Possíveis causas:\n" +
            "• Nenhuma rota foi encontrada no sistema\n" +
            "• Todas as linhas estão vazias ou sem dados válidos\n\n" +
            `Linhas processadas: ${processedRows}\n` +
            `Rotas não encontradas: ${notFoundRoutes.length}`
        );
        return;
      }

      let message = "✅ Excel importado com sucesso!\n\n";
      message += `📊 ESTATÍSTICAS:\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `Linhas processadas: ${processedRows}\n`;
      message += `Total importado: ${totalImported} secções\n`;
      message += `Linhas ignoradas: ${skippedRows}\n`;
      message += `Trimestre: ${selectedQuarter}\n\n`;
      message += `📈 POR PSM:\n`;
      message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
      message += `• ISISTEL: ${
        Object.values(newJustificativas).filter((j) => j.psm === "ISISTEL")
          .length
      }\n`;
      message += `• FIBRASOL: ${
        Object.values(newJustificativas).filter((j) => j.psm === "FIBRASOL")
          .length
      }\n`;
      message += `• ANGLOBAL: ${
        Object.values(newJustificativas).filter((j) => j.psm === "ANGLOBAL")
          .length
      }`;

      if (notFoundRoutes.length > 0) {
        message += `\n\n⚠️ ROTAS NÃO ENCONTRADAS (${notFoundRoutes.length}):\n`;
        message += `━━━━━━━━━━━━━━━━━━━━━━\n`;
        message += notFoundRoutes.slice(0, 10).join("\n");
        if (notFoundRoutes.length > 10) {
          message += `\n... e mais ${notFoundRoutes.length - 10} rotas`;
        }
      }

      alert(message);
    } catch (error) {
      console.error("❌ Erro ao processar Excel:", error);
      alert(
        "❌ Erro ao processar Excel!\n\n" +
          "Detalhes: " +
          error.message +
          "\n\n" +
          "Verifique se o arquivo está correto e tente novamente."
      );
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
          if (text.charCodeAt(0) === 0xfeff) {
            text = text.substring(1);
          }

          const lines = text.split("\n");

          // 2. Validar arquivo
          if (lines.length < 2) {
            alert("Arquivo CSV vazio ou inválido");
            reject(new Error("Arquivo vazio"));
            return;
          }

          // 3. Extrair headers (linha 0)
          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, "").toLowerCase());

          const newJustificativas = {};

          // 4. Encontrar índices das colunas
          const seccaoIdx = headers.findIndex(
            (h) =>
              h.includes("secç") ||
              h.includes("rota") ||
              h.includes("troço") ||
              h.includes("secc")
          );
          const regiaoIdx = headers.findIndex(
            (h) => h.includes("região") || h.includes("regiao")
          );
          const transporteIdx = headers.findIndex((h) =>
            h.includes("transporte")
          );
          const indisponiveisIdx = headers.findIndex(
            (h) => h.includes("indispon") && !h.includes("delta")
          );
          const deltaIdx = headers.findIndex((h) => h.includes("delta"));
          const justificativaIdx = headers.findIndex((h) =>
            h.includes("justifica")
          );

          if (seccaoIdx === -1) {
            alert('Arquivo deve conter a coluna "Secções" ou "Rota"');
            reject(new Error("Coluna Secções não encontrada"));
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
            let currentValue = "";
            let insideQuotes = false;

            for (let char of line) {
              if (char === '"') {
                insideQuotes = !insideQuotes;
              } else if (char === "," && !insideQuotes) {
                values.push(currentValue.trim().replace(/^"|"$/g, ""));
                currentValue = "";
              } else {
                currentValue += char;
              }
            }
            values.push(currentValue.trim().replace(/^"|"$/g, ""));

            // 7. Extrair secção/rota
            const seccao = values[seccaoIdx]?.trim();
            if (!seccao || seccao === "") continue;

            // 8. Detectar PSM automaticamente
            const detectedPSM = findPSMForRoute(seccao);

            if (!detectedPSM) {
              notFoundRoutes.push(seccao);
              continue;
            }

            // 9. Extrair valores
            const regiao = regiaoIdx !== -1 ? values[regiaoIdx]?.trim() : "";
            const transporte =
              transporteIdx !== -1 ? parseInt(values[transporteIdx]) || 0 : 0;
            const indisponiveis =
              indisponiveisIdx !== -1
                ? parseInt(values[indisponiveisIdx]) || 0
                : 0;
            const delta = deltaIdx !== -1 ? parseInt(values[deltaIdx]) || 0 : 0;
            const justificativa =
              justificativaIdx !== -1 ? values[justificativaIdx]?.trim() : "";

            // 10. Importar APENAS se tiver pelo menos UM valor diferente de zero
            // REGRA: Se Transporte=0 E Indisponíveis=0 E Delta=0 → NÃO IMPORTAR
            const temDadosValidos =
              transporte > 0 || indisponiveis > 0 || delta !== 0;

            if (temDadosValidos) {
              const key = detectedPSM + "_" + seccao;
              newJustificativas[key] = {
                seccao: seccao,
                regiao: regiao,
                transporte: transporte,
                indisponiveis: indisponiveis,
                delta: delta,
                justificativa: justificativa,
                psm: detectedPSM,
                quarter: selectedQuarter,
              };
              totalImported++;
            } else {
              console.log("⚠️ Ignorado (todos valores = 0):", seccao);
            }
          }

          // 11. Atualizar estado
          setJustificativas((prev) => {
            const updated = { ...prev, ...newJustificativas };
            console.log(
              "💾 Estado de justificativas atualizado. Total:",
              Object.keys(updated).length
            );
            return updated;
          });

          // 12. Feedback
          let message = "✅ CSV importado com sucesso!\n";
          message += "Linhas processadas: " + processedLines + "\n";
          message += "Total importado: " + totalImported + " secções\n";
          message += "Trimestre: " + selectedQuarter;

          if (notFoundRoutes.length > 0) {
            message +=
              "\n\n⚠️ Rotas não encontradas (" + notFoundRoutes.length + "):\n";
            message += notFoundRoutes.slice(0, 10).join("\n");
            if (notFoundRoutes.length > 10) {
              message +=
                "\n... e mais " + (notFoundRoutes.length - 10) + " rotas";
            }
          }

          alert(message);
          resolve();
        } catch (error) {
          console.error("❌ Erro ao processar CSV:", error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("Erro ao ler o arquivo"));
      };

      // 13. Ler arquivo com UTF-8
      reader.readAsText(file, "UTF-8");
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
      const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

      // Processar baseado no tipo
      if (isExcel) {
        await processExcelFile(file);
      } else {
        await processCSVFile(file);
      }
    } catch (error) {
      console.error("❌ Erro ao importar:", error);
      alert("Erro ao importar arquivo: " + error.message);
    }

    // Limpar input (permite reimportar)
    event.target.value = "";
  };

  /**
   * FUNÇÃO LIMPAR JUSTIFICATIVAS
   * Remove todas as justificativas importadas do PSM e Quarter selecionados
   */
  const handleLimparJustificativas = () => {
    const countBefore = Object.keys(justificativas).length;
    const countFiltered = Object.values(justificativas).filter(
      (j) => j.psm === selectedOperator && j.quarter === selectedQuarter
    ).length;

    if (countFiltered === 0) {
      alert(
        "⚠️ Não há justificativas para limpar!\n\n" +
          `PSM: ${selectedOperator}\n` +
          `Quarter: ${selectedQuarter}\n\n` +
          "Nenhum dado encontrado."
      );
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

    console.log("✅ Limpeza concluída:", {
      antes: countBefore,
      removidas: removed,
      depois: Object.keys(updated).length,
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

  // useEffect #1: Salvar estado 'data' no localStorage automaticamente
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setSaveStatus("saving");

      try {
        window.localStorage.setItem("psm_rotas_data_v3", JSON.stringify(data));

        // Feedback visual de sucesso
        setSaveStatus("saved");
        setLastSaveTime(new Date());

        // Limpar status após 2 segundos
        const timer = setTimeout(() => {
          setSaveStatus("");
        }, 2000);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
        setSaveStatus("error");

        // Limpar status de erro após 3 segundos
        const timer = setTimeout(() => {
          setSaveStatus("");
        }, 3000);

        return () => clearTimeout(timer);
      }
    }
  }, [data]); // Executar sempre que 'data' mudar

  // useEffect #2: Salvar estado 'justificativas' no localStorage automaticamente
  useEffect(() => {
    if (Object.keys(justificativas).length > 0) {
      try {
        window.localStorage.setItem(
          "psm_justificativas_v1",
          JSON.stringify(justificativas)
        );
        console.log(
          "✓ Justificativas salvas:",
          Object.keys(justificativas).length,
          "registros"
        );
      } catch (error) {
        console.error("Erro ao salvar justificativas:", error);
      }
    }
  }, [justificativas]); // Executar sempre que 'justificativas' mudar

  // useEffect #3: Log de inicialização (apenas uma vez)
  useEffect(() => {}, []); // Executar apenas no mount do componente

  // ============================================================================
  // FASE 7.1: FUNÇÕES DOS BOTÕES DO MENU
  // ============================================================================

  // v3.13.8: Função CORRIGIDA - Salvar Dados PSM (localStorage + CSV)
  const handleSaveData = () => {
    try {
      // 1. Salvar no localStorage
      window.localStorage.setItem("psm_rotas_data_v3", JSON.stringify(data));
      window.localStorage.setItem(
        "psm_justificativas_v1",
        JSON.stringify(justificativas)
      );

      setSaveStatus("saved");
      setLastSaveTime(new Date());

      // 2. Exportar para CSV (igual handleDownloadCSV)
      // Header do CSV
      let csv =
        "PSM,Semana,Rota,Transporte,Indisponíveis,Total Reparadas,Reconhecidas,Dep. Passagem Cabo,Dep. Licença,Dep. Cutover,Fibras Dependentes\n";

      // Obter semanas do quadrimestre selecionado
      const quarterWeeks = allWeeks.slice(
        quarterConfig[selectedQuarter].start - 1,
        quarterConfig[selectedQuarter].end
      );

      // Iterar sobre PSM selecionado, semanas do quadrimestre e rotas
      quarterWeeks.forEach((week) => {
        if (data[selectedOperator] && data[selectedOperator][week]) {
          routesByPSM[selectedOperator].forEach((route) => {
            const routeData = data[selectedOperator][week][route];
            if (routeData) {
              csv += `${selectedOperator},${week},"${route}",`;
              csv += `${routeData["Transporte"] || ""},`;
              csv += `${routeData["Indisponíveis"] || ""},`;
              csv += `${routeData["Total Reparadas"] || ""},`;
              csv += `${routeData["Reconhecidas"] || ""},`;
              csv += `${routeData["Dep. de Passagem de Cabo"] || ""},`;
              csv += `${routeData["Dep. de Licença"] || ""},`;
              csv += `${routeData["Dep. de Cutover"] || ""},`;
              csv += `${
                routeData[`Fibras dependentes da ${selectedOperator}`] || ""
              }\n`;
            }
          });
        }
      });

      // Criar e baixar arquivo CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PSM_${selectedOperator}_${selectedQuarter}_${selectedYear}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      alert(
        "✓ Dados salvos e exportados com sucesso!\n\n" +
          `💾 LocalStorage: Salvo\n` +
          `📄 CSV exportado: PSM_${selectedOperator}_${selectedQuarter}_${selectedYear}.csv\n\n` +
          `PSM: ${selectedOperator}\n` +
          `Quadrimestre: ${selectedQuarter}\n` +
          `Semanas: ${quarterWeeks.length}\n` +
          `Rotas: ${routesByPSM[selectedOperator].length}\n` +
          `Justificativas: ${Object.keys(justificativas).length}\n` +
          `Horário: ${new Date().toLocaleString("pt-BR")}`
      );

      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error("Erro ao salvar/exportar:", error);
      alert("✗ Erro ao salvar/exportar dados!\n\n" + error.message);
      setSaveStatus("error");
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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";

    input.onchange = (event) => {
      // 1. Pegar arquivo selecionado
      const file = event.target.files[0];
      if (!file) return; // Se cancelou, sair

      // 2. Criar leitor de arquivo
      const reader = new FileReader();

      // 3. Quando arquivo for lido
      reader.onload = (e) => {
        try {
          // 4. Pegar conteúdo do arquivo
          const text = e.target.result;

          // 5. Dividir em linhas
          const lines = text.split("\n");

          // 6. Validar: precisa ter pelo menos 2 linhas (header + 1 dado)
          if (lines.length < 2) {
            alert("Arquivo CSV vazio ou inválido");
            return;
          }

          // 7. Função para parsear linha CSV (respeita aspas)
          const parseCSVLine = (line) => {
            const values = [];
            let current = "";
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
              const char = line[i];

              if (char === '"') {
                inQuotes = !inQuotes;
              } else if (char === "," && !inQuotes) {
                values.push(current.trim());
                current = "";
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
          const newData = JSON.parse(JSON.stringify(data));

          let rowCount = 0;
          let errorCount = 0;

          // 10. Processar cada linha de dados (a partir da linha 1)
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Pular linhas vazias

            try {
              // 11. Parsear valores da linha (respeitando aspas)
              const values = parseCSVLine(line);

              // v3.40.98: DETECTAR FORMATO DO CSV (com ou sem Ano/Quarter)
              const hasAnoColumn = headers[0] === "Ano" || headers[0] === "ano";

              let week, rota, dataStartIndex;

              if (hasAnoColumn) {
                // FORMATO NOVO: Ano,Quarter,Semana,Rota,...
                // Ignorar Ano e Quarter
                week = values[2]?.trim(); // Coluna 2: Semana
                rota = values[3]?.trim(); // Coluna 3: Rota
                dataStartIndex = 4; // Dados começam na coluna 4

                console.log(
                  `  📋 Formato NOVO detectado: Ano=${values[0]}, Quarter=${values[1]}, Semana=${week}`
                );
              } else {
                // FORMATO ANTIGO: Semana,Rota,...
                week = values[0]?.trim(); // Coluna 0: Semana
                rota = values[1]?.trim(); // Coluna 1: Rota
                dataStartIndex = 2; // Dados começam na coluna 2

                console.log(`  📋 Formato ANTIGO detectado: Semana=${week}`);
              }

              // 12. Validar dados essenciais
              if (!week || !rota) {
                console.warn(
                  `⚠️ Linha ${i} ignorada: week='${week}', rota='${rota}'`
                );
                continue;
              }

              // 13. Criar estrutura se não existir
              if (!newData[selectedOperator]) newData[selectedOperator] = {};
              if (!newData[selectedOperator][week])
                newData[selectedOperator][week] = {};
              if (!newData[selectedOperator][week][rota])
                newData[selectedOperator][week][rota] = {};

              // 14. Importar cada status (a partir da coluna dataStartIndex)
              for (
                let j = dataStartIndex;
                j < headers.length && j < values.length;
                j++
              ) {
                let statusHeader = headers[j]; // Ex: 'Transporte' ou 'Fibras dependentes da FIBRASOL'
                const valueStr = values[j]?.trim() || "0";
                const value = parseInt(valueStr) || 0; // Ex: 10

                // v3.13.22: NORMALIZAR "Fibras dependentes da [QUALQUER_PSM]"
                // para usar o PSM atualmente selecionado
                if (statusHeader.startsWith("Fibras dependentes da ")) {
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
            alert(
              "⚠️ Nenhum dado foi importado!\n\n" +
                "Verifique:\n" +
                "- Formato do CSV\n" +
                "- PSM selecionado\n" +
                "- Conteúdo do arquivo\n\n" +
                "Veja o console (F12) para mais detalhes."
            );
            return;
          }

          // 17. Atualizar estado global (salva automaticamente no localStorage)
          setData(newData);

          // v3.48.00: PROCESSAR VALIDAÇÕES POR SEMANA
          console.log("🔍 INICIANDO PROCESSAMENTO DE VALIDAÇÕES POR SEMANA...");
          console.log("  Headers:", headers);

          const novasTestadas = {};
          const novasValidadas = {};

          if (!novasTestadas[selectedOperator])
            novasTestadas[selectedOperator] = {};
          if (!novasValidadas[selectedOperator])
            novasValidadas[selectedOperator] = {};

          let validacoesImportadas = 0;

          // Encontrar índices das colunas
          const testadaIdx = headers.findIndex(
            (h) => h === "Testada" || h === "testada" || h.includes("Testada")
          );
          const validadaIdx = headers.findIndex(
            (h) =>
              h === "Validada" || h === "validada" || h.includes("Validada")
          );

          console.log(
            "  📊 ÍNDICES: Testada:",
            testadaIdx,
            "Validada:",
            validadaIdx
          );

          if (testadaIdx >= 0 || validadaIdx >= 0) {
            console.log("  ✅ Colunas encontradas, processando...");

            // Processar TODAS as linhas (cada linha = uma semana)
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;

              try {
                const values = parseCSVLine(line);
                const hasAnoColumn =
                  headers[0] === "Ano" || headers[0] === "ano";

                let semana, rota;
                if (hasAnoColumn) {
                  semana = values[2]?.trim(); // Ano,Quarter,Semana
                  rota = values[3]?.trim();
                } else {
                  semana = values[0]?.trim(); // Semana,Rota
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
                  const testadaVal = (values[testadaIdx] || "")
                    .toString()
                    .trim()
                    .toUpperCase();

                  if (
                    testadaVal === "SIM" ||
                    testadaVal === "TRUE" ||
                    testadaVal === "1"
                  ) {
                    novasTestadas[selectedOperator][semana][rota] = {
                      testada: true,
                    };
                    validacoesImportadas++;
                  }
                }

                // Importar validada
                if (validadaIdx >= 0) {
                  const validadaVal = (values[validadaIdx] || "")
                    .toString()
                    .trim()
                    .toUpperCase();

                  if (
                    validadaVal === "SIM" ||
                    validadaVal === "TRUE" ||
                    validadaVal === "1"
                  ) {
                    novasValidadas[selectedOperator][semana][rota] = {
                      validada: true,
                    };
                    validacoesImportadas++;
                  }
                }
              } catch (e) {
                console.error("  ❌ Erro na linha", i, ":", e);
              }
            }

            // Atualizar estados
            setRotasTestadas(novasTestadas);
            setRotasValidadas(novasValidadas);

            console.log("  ✅ Validações importadas:", validacoesImportadas);

            // Contar semanas e rotas
            const semanasTest = Object.keys(
              novasTestadas[selectedOperator] || {}
            ).length;
            const semanasValid = Object.keys(
              novasValidadas[selectedOperator] || {}
            ).length;
            console.log("  📅 Semanas com testadas:", semanasTest);
            console.log("  📅 Semanas com validadas:", semanasValid);
          }

          // 18. DEBUG: Verificar dados importados

          // Pegar primeira semana e primeira rota para debug
          const firstWeek = Object.keys(newData[selectedOperator] || {})[0];
          const firstRoute = firstWeek
            ? Object.keys(newData[selectedOperator][firstWeek])[0]
            : null;

          if (firstWeek && firstRoute) {
            const sampleData = newData[selectedOperator][firstWeek][firstRoute];

            console.log("  Campos importados:", Object.keys(sampleData));

            // Verificar campos específicos - TODOS

            console.log(
              "  Transporte:",
              sampleData["Transporte"],
              "(tipo:",
              typeof sampleData["Transporte"],
              ")"
            );
            console.log(
              "  Indisponíveis:",
              sampleData["Indisponíveis"],
              "(tipo:",
              typeof sampleData["Indisponíveis"],
              ")"
            );
            console.log(
              "  Total Reparadas:",
              sampleData["Total Reparadas"],
              "(tipo:",
              typeof sampleData["Total Reparadas"],
              ")"
            );
            console.log(
              "  Reconhecidas:",
              sampleData["Reconhecidas"],
              "(tipo:",
              typeof sampleData["Reconhecidas"],
              ")"
            );
            console.log(
              "  Dep. de Passagem de Cabo:",
              sampleData["Dep. de Passagem de Cabo"],
              "(tipo:",
              typeof sampleData["Dep. de Passagem de Cabo"],
              ")"
            );
            console.log(
              "  Dep. de Licença:",
              sampleData["Dep. de Licença"],
              "(tipo:",
              typeof sampleData["Dep. de Licença"],
              ")"
            );
            console.log(
              "  Dep. de Cutover:",
              sampleData["Dep. de Cutover"],
              "(tipo:",
              typeof sampleData["Dep. de Cutover"],
              ")"
            );
            console.log(
              "  Fibras dependentes da " + selectedOperator + ":",
              sampleData[`Fibras dependentes da ${selectedOperator}`],
              "(tipo:",
              typeof sampleData[`Fibras dependentes da ${selectedOperator}`],
              ")"
            );

            // Verificar se campo existe
          } else {
            console.warn("⚠️ Nenhum dado encontrado após importação!");
          }

          // 19. Contar detalhes da importação
          let semanasCont = new Set();
          let rotasCont = new Set();

          if (newData[selectedOperator]) {
            Object.keys(newData[selectedOperator]).forEach((week) => {
              semanasCont.add(week);
              if (newData[selectedOperator][week]) {
                Object.keys(newData[selectedOperator][week]).forEach((rota) => {
                  rotasCont.add(rota);
                });
              }
            });
          }

          console.log("  Semanas:", Array.from(semanasCont).sort().join(", "));

          // 19. Contar validações por semana
          let rotasTestCount = 0;
          let rotasValidCount = 0;

          Object.keys(novasTestadas[selectedOperator] || {}).forEach(
            (semana) => {
              rotasTestCount += Object.keys(
                novasTestadas[selectedOperator][semana]
              ).length;
            }
          );

          Object.keys(novasValidadas[selectedOperator] || {}).forEach(
            (semana) => {
              rotasValidCount += Object.keys(
                novasValidadas[selectedOperator][semana]
              ).length;
            }
          );

          // 20. Confirmar sucesso
          alert(
            `✓ Dados importados com sucesso!\n\n` +
              `PSM: ${selectedOperator}\n` +
              `Linhas CSV: ${rowCount}\n` +
              `Semanas com dados: ${semanasCont.size}\n` +
              `Rotas únicas: ${rotasCont.size}\n` +
              `🧪 Marcações testadas: ${rotasTestCount}\n` +
              `✅ Marcações validadas: ${rotasValidCount}\n` +
              (errorCount > 0 ? `Linhas com erro: ${errorCount}\n` : "") +
              `Arquivo: ${file.name}\n\n` +
              `💡 Use os dropdowns para navegar entre semanas!`
          );
        } catch (error) {
          // 19. Capturar erros de parsing
          console.error("✗ Erro ao importar CSV:", error);
          console.error("Stack:", error.stack);
          alert(
            "✗ Erro ao importar CSV!\n\n" +
              error.message +
              "\n\n" +
              "Abra o console (F12) para mais detalhes."
          );
        }
      };

      // 20. Tratar erro de leitura do arquivo
      reader.onerror = () => {
        alert("Erro ao ler o arquivo");
      };

      // 21. Iniciar leitura como texto
      reader.readAsText(file);

      // 22. Limpar input (permite importar o mesmo arquivo novamente)
      event.target.value = "";
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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const fileName = file.name.toLowerCase();

        if (!fileName.endsWith(".csv")) {
          alert(
            "⚠️ Formato não suportado!\n\n" +
              "Apenas arquivos CSV são suportados para justificativas.\n\n" +
              "Formato esperado:\n" +
              "PSM,Semana,Rota,Justificativa"
          );
          return;
        }

        // Ler arquivo CSV
        const text = await file.text();

        // Detectar delimitador
        const firstLine = text.split("\n")[0];
        let delimiter = ",";
        if (firstLine.split(";").length > firstLine.split(",").length) {
          delimiter = ";";
        } else if (firstLine.split("\t").length > firstLine.split(",").length) {
          delimiter = "\t";
        }

        // Parsear CSV
        const lines = text.split("\n").filter((line) => line.trim());
        const headers = lines[0]
          .split(delimiter)
          .map((h) => h.trim().replace(/['"]/g, "").toLowerCase());

        // Validar headers necessários
        const hasPSM = headers.some((h) => h.includes("psm"));
        const hasSemana = headers.some(
          (h) => h.includes("semana") || h.includes("week")
        );
        const hasRota = headers.some(
          (h) => h.includes("rota") || h.includes("route")
        );
        const hasJustificativa = headers.some(
          (h) =>
            h.includes("justif") || h.includes("observ") || h.includes("coment")
        );

        if (!hasPSM || !hasSemana || !hasRota || !hasJustificativa) {
          alert(
            "⚠️ Estrutura CSV inválida!\n\n" +
              "Headers obrigatórios:\n" +
              "- PSM\n" +
              "- Semana (ou Week)\n" +
              "- Rota (ou Route)\n" +
              "- Justificativa (ou Observação/Comentário)\n\n" +
              `Headers encontrados:\n${headers.join(", ")}`
          );
          return;
        }

        // Mapear índices das colunas
        const colIndexes = {
          psm: headers.findIndex((h) => h.includes("psm")),
          semana: headers.findIndex(
            (h) => h.includes("semana") || h.includes("week")
          ),
          rota: headers.findIndex(
            (h) => h.includes("rota") || h.includes("route")
          ),
          justificativa: headers.findIndex(
            (h) =>
              h.includes("justif") ||
              h.includes("observ") ||
              h.includes("coment")
          ),
        };

        let importedJustificativas = {};
        let rowCount = 0;

        // Processar linhas
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Split respeitando aspas
          const values = [];
          let current = "";
          let inQuotes = false;

          for (let char of line) {
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
              values.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          values.push(current.trim());

          // Extrair dados
          const psm = values[colIndexes.psm]?.trim();
          const semana = values[colIndexes.semana]?.trim();
          const rota = values[colIndexes.rota]?.trim().replace(/['"]/g, "");
          const justificativa = values[colIndexes.justificativa]
            ?.trim()
            .replace(/['"]/g, "");

          if (!psm || !semana || !rota || !justificativa) continue;

          // Criar chave única: PSM_Semana_Rota
          const key = `${psm}_${semana}_${rota}`;
          importedJustificativas[key] = justificativa;
          rowCount++;
        }

        if (rowCount > 0) {
          // Mesclar com justificativas existentes
          const newJustificativas = {
            ...justificativas,
            ...importedJustificativas,
          };
          setJustificativas(newJustificativas);

          console.log(
            "  Total justificativas:",
            Object.keys(newJustificativas).length
          );

          alert(
            `✓ Importação de justificativas bem-sucedida!\n\n` +
              `📂 Arquivo: ${file.name}\n` +
              `📝 Justificativas importadas: ${rowCount}\n` +
              `📊 Total no sistema: ${
                Object.keys(newJustificativas).length
              }\n\n` +
              `As justificativas foram mescladas com as existentes.\n` +
              `Acesse a "Tabela de Acompanhamento" para visualizar.`
          );
        } else {
          alert(
            "⚠️ Nenhuma justificativa foi importada!\n\n" +
              "Verifique:\n" +
              "- Arquivo tem dados (além do header)\n" +
              "- Colunas obrigatórias preenchidas\n" +
              "- Formato correto"
          );
        }
      } catch (error) {
        console.error("✗ Erro ao importar justificativas:", error);
        alert(
          `✗ Erro ao importar justificativas!\n\n` +
            `Erro: ${error.message}\n\n` +
            `Verifique:\n` +
            `- Formato do arquivo (CSV com header)\n` +
            `- Codificação (UTF-8)\n` +
            `- Estrutura: PSM,Semana,Rota,Justificativa`
        );
      }
    };

    input.click();
  };

  // Função: Exportar JSON Backup
  const handleExportJSON = () => {
    try {
      const backup = {
        version: "1.7.1",
        timestamp: new Date().toISOString(),
        data: data,
        justificativas: justificativas,
        metadata: {
          totalRoutes: Object.values(routesByPSM).reduce(
            (acc, r) => acc + r.length,
            0
          ),
          psms: Object.keys(routesByPSM),
          weeks: allWeeks.length,
          quarters: Object.keys(quarterConfig),
        },
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PSM_Backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      alert(
        "✓ Backup JSON exportado com sucesso!\n\n" +
          `Arquivo: PSM_Backup_${
            new Date().toISOString().split("T")[0]
          }.json\n` +
          `Tamanho: ${Math.round(blob.size / 1024)} KB`
      );
    } catch (error) {
      console.error("Erro ao exportar JSON:", error);
      alert("✗ Erro ao exportar backup!\n\n" + error.message);
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
        if (weekNum >= 1 && weekNum <= 18) return "Q1";
        if (weekNum >= 19 && weekNum <= 35) return "Q2";
        if (weekNum >= 36 && weekNum <= 52) return "Q3";
        return "Q1";
      };

      // 2. Criar cabeçalho CSV
      const statusCategorias = [
        "Transporte",
        "Indisponíveis",
        "Total Reparadas",
        "Reconhecidas",
        "Dep. de Passagem de Cabo",
        "Dep. de Licença",
        "Dep. de Cutover",
        "Fibras dependentes",
      ];

      const statusHeaders = statusCategorias.map((status) =>
        status === "Fibras dependentes"
          ? "Fibras dependentes da " + psm
          : status
      );

      // v3.48.00: Header com 2 colunas de validação (POR SEMANA)
      const csvHeader =
        "Ano,Quarter,Semana,Rota," +
        statusHeaders.join(",") +
        ",Testada,Validada\n";

      // v3.40.88: Coletar dados do ANO ATUAL (W1-W52 do ano selecionado)
      const weeks = allWeeks;
      const rotas = routesByPSM[selectedOperator];
      let dadosAnoAtual = [];

      weeks.forEach((week) => {
        const quarter = getQuarterFromWeek(week);

        rotas.forEach((rota) => {
          const rotaData = data[psm]?.[week]?.[rota] || {};
          const valores = statusHeaders.map((header) => rotaData[header] || 0);

          // v3.48.00: Verificar ESTA semana específica
          const testada = isRotaTestada(psm, week, rota) ? "SIM" : "";
          const validada = isRotaValidada(psm, week, rota) ? "SIM" : "";

          // Criar linha: Ano,Quarter,Semana,Rota,...,Testada,Validada
          const linha =
            anoAtual +
            "," +
            quarter +
            "," +
            week +
            "," +
            rota +
            "," +
            valores.join(",") +
            "," +
            testada +
            "," +
            validada;
          dadosAnoAtual.push(linha);
        });
      });

      // v3.40.88: Perguntar se quer manter histórico de outros anos
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";

      input.onchange = async (e) => {
        const file = e.target.files[0];
        let dadosOutrosAnos = [];

        if (file) {
          // Ler arquivo existente
          const text = await file.text();
          const linhas = text.split("\n");

          // v3.40.88: Manter apenas dados de OUTROS anos (não do ano atual)
          for (let i = 1; i < linhas.length; i++) {
            const linha = linhas[i].trim();
            if (!linha) continue;

            const anoLinha = linha.split(",")[0];

            // Manter apenas se for de outro ano
            if (anoLinha !== anoAtual.toString()) {
              dadosOutrosAnos.push(linha);
            }
          }

          console.log(
            `✓ Mantendo ${dadosOutrosAnos.length} linhas de outros anos`
          );
          console.log(
            `✓ Atualizando ${dadosAnoAtual.length} linhas de ${anoAtual}`
          );
        }

        // v3.40.88: Montar CSV: Header + Outros anos + Ano atual
        let csvFinal = csvHeader;

        // Adicionar outros anos (ordenados)
        if (dadosOutrosAnos.length > 0) {
          csvFinal += dadosOutrosAnos.join("\n") + "\n";
        }

        // Adicionar ano atual (atualiza ou adiciona)
        csvFinal += dadosAnoAtual.join("\n") + "\n";

        // Salvar arquivo
        const blob = new Blob(["\uFEFF" + csvFinal], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const hoje = new Date();
        const dataExportacao = hoje.toISOString().split("T")[0];
        const nomeArquivo = `${psm}_Historico_${dataExportacao}.csv`;

        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const totalLinhas = dadosOutrosAnos.length + dadosAnoAtual.length;
        const anosUnicos = new Set([
          ...dadosOutrosAnos.map((l) => l.split(",")[0]),
          anoAtual.toString(),
        ]);

        alert(
          `✅ CSV salvo com sucesso!\n\n` +
            `📊 Anos no arquivo: ${Array.from(anosUnicos)
              .sort()
              .join(", ")}\n` +
            `📊 Total de linhas: ${totalLinhas}\n` +
            `📊 Ano ${anoAtual}: ${dadosAnoAtual.length} linhas (atualizado)\n\n` +
            `Arquivo: ${nomeArquivo}`
        );
      };

      // Mostrar dialog
      const mensagem =
        `📁 Salvar dados de ${anoAtual}\n\n` +
        `Deseja manter histórico de outros anos?\n\n` +
        `SIM: Selecione o CSV anterior\n` +
        `→ Dados de ${anoAtual} serão atualizados\n` +
        `→ Outros anos serão mantidos\n\n` +
        `NÃO: Cancelar e salvar apenas ${anoAtual}`;

      if (confirm(mensagem)) {
        input.click();
      } else {
        // Salvar apenas ano atual
        let csvFinal = csvHeader + dadosAnoAtual.join("\n") + "\n";

        const blob = new Blob(["\uFEFF" + csvFinal], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const hoje = new Date();
        const dataExportacao = hoje.toISOString().split("T")[0];
        const nomeArquivo = `${psm}_${anoAtual}_${dataExportacao}.csv`;

        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert(
          `✅ CSV salvo com sucesso!\n\n` +
            `📊 Ano ${anoAtual}: ${dadosAnoAtual.length} linhas\n\n` +
            `Arquivo: ${nomeArquivo}`
        );
      }
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      alert("❌ Erro ao exportar CSV: " + error.message);
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
      let csv = "PSM,Semana,Rota,Justificativa\n";

      // Iterar sobre justificativas
      let count = 0;
      Object.entries(justificativas).forEach(([key, justificativa]) => {
        // Chave formato: PSM_Semana_Rota
        const parts = key.split("_");
        if (parts.length >= 3) {
          const psm = parts[0];
          const semana = parts[1];
          const rota = parts.slice(2).join("_"); // Rota pode ter underscore no nome

          // Escapar aspas na justificativa
          const justificativaEscaped = justificativa.replace(/"/g, '""');

          csv += `${psm},${semana},"${rota}","${justificativaEscaped}"\n`;
          count++;
        }
      });

      if (count === 0) {
        alert(
          "⚠️ Nenhuma justificativa para exportar!\n\n" +
            "Adicione justificativas primeiro:\n" +
            "- Edite na Tabela de Acompanhamento\n" +
            "- Ou importe via CSV"
        );
        return;
      }

      // Criar e baixar arquivo
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Formato: PSM_Justificativas_2025-12-28_15-30-45.csv
      const hoje = new Date();
      const dataExportacao = hoje.toISOString().split("T")[0]; // 2025-12-28
      const horaExportacao = hoje
        .toTimeString()
        .split(" ")[0]
        .replace(/:/g, "-"); // 15-30-45
      a.download = `PSM_Justificativas_${dataExportacao}_${horaExportacao}.csv`;

      a.click();
      URL.revokeObjectURL(url);

      alert(
        `✓ Justificativas exportadas com sucesso!\n\n` +
          `📝 Total exportado: ${count} justificativas\n` +
          `📂 Arquivo: ${a.download}\n\n` +
          `Use este arquivo para backup ou reimportação.`
      );
    } catch (error) {
      console.error("Erro ao exportar justificativas:", error);
      alert("✗ Erro ao exportar justificativas!\n\n" + error.message);
    }
  };

  // Função: Ver Estado no Console
  const handleViewState = () => {
    console.clear();

    console.log("Total PSMs:", Object.keys(routesByPSM).length);
    console.log(
      "Total Rotas:",
      Object.values(routesByPSM).reduce((acc, r) => acc + r.length, 0)
    );

    console.log(
      "Justificativas carregadas:",
      Object.keys(justificativas).length
    );

    console.log(
      "Tamanho data:",
      new Blob([localStorage.getItem("psm_rotas_data_v3") || ""]).size,
      "bytes"
    );
    console.log(
      "Tamanho justificativas:",
      new Blob([localStorage.getItem("psm_justificativas_v1") || ""]).size,
      "bytes"
    );

    alert(
      "✓ Estado completo exibido no console!\n\nAbra o DevTools (F12) para visualizar."
    );
  };

  // Função: Selecionar Semanas para Comparação
  const handleSelectWeeks = () => {
    alert(
      "📅 Comparação de Semanas\n\n" +
        "⚠️ Esta funcionalidade será implementada na Fase 24.\n\n" +
        "Recursos planejados:\n" +
        "- Selecionar até 4 semanas\n" +
        "- Comparação lado a lado\n" +
        "- Destaque de diferenças\n" +
        "- Gráficos comparativos"
    );
  };

  // Função: Ver Top 5 Semanas
  const handleViewTop5 = () => {
    alert(
      "📊 Top 5 Semanas com Mais Indisponíveis\n\n" +
        "⚠️ Esta funcionalidade será implementada em breve.\n\n" +
        "Mostrará:\n" +
        "- Ranking de semanas críticas\n" +
        "- Total de indisponíveis por semana\n" +
        "- Rotas mais afetadas\n" +
        "- Tendências de degradação"
    );
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
    if (value !== "" && !/^\d+$/.test(value)) {
      console.warn(
        "⚠️ Valor inválido ignorado:",
        value,
        "(apenas números são aceitos)"
      );
      return;
    }

    // ============================================================================
    // FASE 10: LÓGICA DE NEGÓCIO - REDUÇÃO AUTOMÁTICA DE FIBRAS DEPENDENTES
    // ============================================================================

    // Atualizar o estado 'data' de forma imutável
    setData((prevData) => {
      // Criar cópia profunda da estrutura
      const newData = JSON.parse(JSON.stringify(prevData));

      // Garantir que a estrutura existe
      if (!newData[psm]) newData[psm] = {};
      if (!newData[psm][week]) newData[psm][week] = {};
      if (!newData[psm][week][route]) {
        newData[psm][week][route] = {
          Transporte: "",
          Indisponíveis: "",
          "Total Reparadas": "",
          Reconhecidas: "",
          "Dep. de Passagem de Cabo": "",
          "Dep. de Licença": "",
          "Dep. de Cutover": "",
          [`Fibras dependentes da ${psm}`]: "",
        };
      }

      // Obter valores atuais
      const currentData = newData[psm][week][route];
      const oldTotalReparadas = parseInt(currentData["Total Reparadas"]) || 0;
      const newTotalReparadas =
        category === "Total Reparadas"
          ? parseInt(value) || 0
          : oldTotalReparadas;

      // LÓGICA DE NEGÓCIO: Redução Automática de Fibras Dependentes
      if (category === "Total Reparadas" && value !== "") {
        const diferenca = newTotalReparadas - oldTotalReparadas;

        if (diferenca > 0) {
          // Total Reparadas AUMENTOU → Reduzir Fibras Dependentes
          const fibrasDependentesKey = `Fibras dependentes da ${psm}`;
          const currentFibrasDep =
            parseInt(currentData[fibrasDependentesKey]) || 0;
          const newFibrasDep = Math.max(0, currentFibrasDep - diferenca); // Não pode ficar negativo

          currentData[fibrasDependentesKey] = newFibrasDep.toString();

          console.log(
            `   Total Reparadas: ${oldTotalReparadas} → ${newTotalReparadas} (+${diferenca})`
          );
          console.log(
            `   Fibras Dependentes: ${currentFibrasDep} → ${newFibrasDep} (-${diferenca})`
          );
        } else if (diferenca < 0) {
          // Total Reparadas DIMINUIU → Aumentar Fibras Dependentes
          const fibrasDependentesKey = `Fibras dependentes da ${psm}`;
          const currentFibrasDep =
            parseInt(currentData[fibrasDependentesKey]) || 0;
          const newFibrasDep = currentFibrasDep + Math.abs(diferenca);

          currentData[fibrasDependentesKey] = newFibrasDep.toString();

          console.log("🔄 LÓGICA DE NEGÓCIO APLICADA (REVERSA):");
          console.log(
            `   Total Reparadas: ${oldTotalReparadas} → ${newTotalReparadas} (${diferenca})`
          );
          console.log(
            `   Fibras Dependentes: ${currentFibrasDep} → ${newFibrasDep} (+${Math.abs(
              diferenca
            )})`
          );
        }
      }

      // Atualizar o valor específico
      currentData[category] = value;

      return newData;
    });

    // Log de confirmação
    console.log(
      `✓ Atualizado: ${route} -> ${category} = ${value || "(vazio)"}`
    );
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
      return data[psm]?.[week]?.[route]?.[category] || "";
    } catch (e) {
      return "";
    }
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
  const routesToProcess =
    selectedProvince !== "Todas"
      ? routesByPSM[selectedOperator].filter(
          (route) => routeToProvince[route] === selectedProvince
        )
      : routesByPSM[selectedOperator];

  // v3.17.8: Log de debug
  console.log("📊 EXECUTIVO DASHBOARD (CALCULADO DIRETO):");
  console.log("  PSM:", selectedOperator);
  console.log("  Província:", selectedProvince);
  console.log("  Total rotas do PSM:", routesByPSM[selectedOperator].length);
  console.log("  Rotas após filtro:", routesToProcess.length);

  let stats = {
    transporteSum: 0, // v3.13.25: Transporte do quadrimestre SELECIONADO
    indisponiveisSum: 0, // SOMA do quadrimestre
    totalReparadasSum: 0, // SOMA acumulada
    reconhecidasSum: 0, // SOMA
    depPassagensSum: 0, // SOMA
    depLicencaSum: 0, // SOMA
    depCutoverSum: 0, // SOMA
    fibrasDependentesLast: 0, // Última semana do quadrimestre
  };

  // CÁLCULO 1: Transporte - último valor de cada rota no quadrimestre

  console.log("🔍 DEBUG TRANSPORTE (ÚLTIMO VALOR POR ROTA):");

  let transporteCount = 0;
  let transporteDebugSamples = [];

  // Para cada rota, pegar último valor de Transporte
  routesToProcess.forEach((route) => {
    let ultimoTransporte = 0;

    quarterWeeks.forEach((week) => {
      const routeData = data[selectedOperator]?.[week]?.[route];
      if (routeData) {
        const transporte = parseInt(routeData["Transporte"]) || 0;
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

  transporteDebugSamples.forEach((sample) => console.log("    -", sample));

  // CÁLCULO 2-7: Para cada rota, pegar ÚLTIMO VALOR de cada status (exceto Total Reparadas que acumula)
  const routeLastValues = {}; // Armazena último valor de cada rota

  routesToProcess.forEach((route) => {
    routeLastValues[route] = {
      indisponiveis: 0,
      totalReparadas: 0, // Este ACUMULA
      reconhecidas: 0,
      depPassagem: 0,
      depLicenca: 0,
      depCutover: 0,
      fibrasDep: 0,
    };

    // Percorrer semanas do quadrimestre
    quarterWeeks.forEach((week) => {
      const routeData = data[selectedOperator]?.[week]?.[route];
      if (routeData) {
        // Pegar último valor diferente de zero
        const indispVal = parseInt(routeData["Indisponíveis"]) || 0;
        const reconhVal = parseInt(routeData["Reconhecidas"]) || 0;
        const depPassVal = parseInt(routeData["Dep. de Passagem de Cabo"]) || 0;
        const depLicVal = parseInt(routeData["Dep. de Licença"]) || 0;
        const depCutVal = parseInt(routeData["Dep. de Cutover"]) || 0;
        const fibrasVal =
          parseInt(routeData[`Fibras dependentes da ${selectedOperator}`]) || 0;

        if (indispVal > 0) routeLastValues[route].indisponiveis = indispVal;
        if (reconhVal > 0) routeLastValues[route].reconhecidas = reconhVal;
        if (depPassVal > 0) routeLastValues[route].depPassagem = depPassVal;
        if (depLicVal > 0) routeLastValues[route].depLicenca = depLicVal;
        if (depCutVal > 0) routeLastValues[route].depCutover = depCutVal;
        if (fibrasVal > 0) routeLastValues[route].fibrasDep = fibrasVal;

        // Total Reparadas ACUMULA (soma)
        const reparadasVal = parseInt(routeData["Total Reparadas"]) || 0;
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
    fibrasDependentesLast: 0,
  };

  // Calcular somas ORIGINAIS (sem redução) - TODAS SEMANAS DO QUADRIMESTRE
  Object.values(routeLastValues).forEach((values) => {
    const indisponiveisOriginais =
      values.reconhecidas +
      values.depPassagem +
      values.depLicenca +
      values.depCutover +
      values.fibrasDep;

    statsOriginais.indisponiveisSum += indisponiveisOriginais;
    statsOriginais.reconhecidasSum += values.reconhecidas;
    statsOriginais.depPassagensSum += values.depPassagem;
    statsOriginais.depLicencaSum += values.depLicenca;
    statsOriginais.depCutoverSum += values.depCutover;
    statsOriginais.fibrasDependentesLast += values.fibrasDep;
  });

  // v3.40.72: CÁLCULO SEPARADO PARA GRUPO 2 - APENAS ATÉ SEMANA SELECIONADA
  const selectedWeekNum = parseInt(selectedWeek.substring(1)); // W49 -> 49
  const weeksAteSelecao = quarterWeeks.filter((week) => {
    const weekNum = parseInt(week.substring(1));
    return weekNum <= selectedWeekNum;
  });

  console.log(
    `📅 GRUPO 2: Calculando até semana ${selectedWeek} (${weeksAteSelecao.length} semanas)`
  );

  const routeValuesAteSelecao = {}; // Valores até a semana selecionada

  routesToProcess.forEach((route) => {
    routeValuesAteSelecao[route] = {
      totalReparadas: 0,
      reconhecidas: 0,
      depPassagem: 0,
      depLicenca: 0,
      depCutover: 0,
      fibrasDep: 0,
    };

    // Percorrer APENAS até a semana selecionada
    weeksAteSelecao.forEach((week) => {
      const routeData = data[selectedOperator]?.[week]?.[route];
      if (routeData) {
        const reconhVal = parseInt(routeData["Reconhecidas"]) || 0;
        const depPassVal = parseInt(routeData["Dep. de Passagem de Cabo"]) || 0;
        const depLicVal = parseInt(routeData["Dep. de Licença"]) || 0;
        const depCutVal = parseInt(routeData["Dep. de Cutover"]) || 0;
        const fibrasVal =
          parseInt(routeData[`Fibras dependentes da ${selectedOperator}`]) || 0;

        if (reconhVal > 0)
          routeValuesAteSelecao[route].reconhecidas = reconhVal;
        if (depPassVal > 0)
          routeValuesAteSelecao[route].depPassagem = depPassVal;
        if (depLicVal > 0) routeValuesAteSelecao[route].depLicenca = depLicVal;
        if (depCutVal > 0) routeValuesAteSelecao[route].depCutover = depCutVal;
        if (fibrasVal > 0) routeValuesAteSelecao[route].fibrasDep = fibrasVal;

        // Total Reparadas ACUMULA (soma)
        const reparadasVal = parseInt(routeData["Total Reparadas"]) || 0;
        routeValuesAteSelecao[route].totalReparadas += reparadasVal;
      }
    });
  });

  // v3.40.70: APLICAR REDUÇÃO POR PRIORIDADE (mesma lógica da Distribuição por Status)
  // Somar os valores LÍQUIDOS após aplicar redução por prioridade - PARA GRUPO 2
  // USA routeValuesAteSelecao (até semana selecionada)
  Object.values(routeValuesAteSelecao).forEach((values) => {
    // Calcular indisponíveis originais (soma das subcategorias)
    const indisponiveisOriginais =
      values.reconhecidas +
      values.depPassagem +
      values.depLicenca +
      values.depCutover +
      values.fibrasDep;

    // Se reparadas >= indisponíveis originais → ZERA TUDO (100% reparadas)
    if (values.totalReparadas >= indisponiveisOriginais) {
      // Tudo foi reparado: só conta reparadas
      stats.totalReparadasSum += values.totalReparadas;
      stats.indisponiveisSum += 0; // Zerado
      // Subcategorias zeradas (não adiciona nada)
    } else {
      // Ainda há indisponíveis: subtrair por ORDEM DE PRIORIDADE
      // PRIORIDADE: 1.Dep.PSM → 2.Dep.Cutover → 3.Dep.Licença → 4.Dep.Passagem → 5.Reconhecidas

      let reparadasRestantes = values.totalReparadas;
      let fibrasDep_liquido = values.fibrasDep;
      let depCutover_liquido = values.depCutover;
      let depLicenca_liquido = values.depLicenca;
      let depPassagem_liquido = values.depPassagem;
      let reconhecidas_liquido = values.reconhecidas;

      // 1. PRIORIDADE MÁXIMA: Dep. PSM
      if (reparadasRestantes > 0 && fibrasDep_liquido > 0) {
        const reduzir = Math.min(reparadasRestantes, fibrasDep_liquido);
        fibrasDep_liquido -= reduzir;
        reparadasRestantes -= reduzir;
      }

      // 2. Dep. Cutover
      if (reparadasRestantes > 0 && depCutover_liquido > 0) {
        const reduzir = Math.min(reparadasRestantes, depCutover_liquido);
        depCutover_liquido -= reduzir;
        reparadasRestantes -= reduzir;
      }

      // 3. Dep. Licença
      if (reparadasRestantes > 0 && depLicenca_liquido > 0) {
        const reduzir = Math.min(reparadasRestantes, depLicenca_liquido);
        depLicenca_liquido -= reduzir;
        reparadasRestantes -= reduzir;
      }

      // 4. Dep. Passagem
      if (reparadasRestantes > 0 && depPassagem_liquido > 0) {
        const reduzir = Math.min(reparadasRestantes, depPassagem_liquido);
        depPassagem_liquido -= reduzir;
        reparadasRestantes -= reduzir;
      }

      // 5. ÚLTIMA PRIORIDADE: Reconhecidas
      if (reparadasRestantes > 0 && reconhecidas_liquido > 0) {
        const reduzir = Math.min(reparadasRestantes, reconhecidas_liquido);
        reconhecidas_liquido -= reduzir;
        reparadasRestantes -= reduzir;
      }

      const indisponiveisLiquidos =
        fibrasDep_liquido +
        depCutover_liquido +
        depLicenca_liquido +
        depPassagem_liquido +
        reconhecidas_liquido;

      stats.totalReparadasSum += values.totalReparadas;
      stats.indisponiveisSum += indisponiveisLiquidos;
      stats.fibrasDependentesLast += fibrasDep_liquido;
      stats.depCutoverSum += depCutover_liquido;
      stats.depLicencaSum += depLicenca_liquido;
      stats.depPassagensSum += depPassagem_liquido;
      stats.reconhecidasSum += reconhecidas_liquido;
    }
  });

  console.log(
    `  ✓ Soma Fibras Dependentes (último valor de cada rota): ${stats.fibrasDependentesLast}`
  );

  // v3.40.71: GRUPO 1 (Header) - USA VALORES ORIGINAIS (exceto Total Reparadas que é dinâmico)
  const headerCardsData = {
    transporteQ2: {
      label: (() => {
        if (selectedQuarter === "Q1") {
          const anoAnterior = parseInt(selectedYear) - 1;
          return `Transporte Q3 (${anoAnterior})`;
        } else if (selectedQuarter === "Q2") {
          return `Transporte Q1 (${selectedYear})`;
        } else {
          return `Transporte Q2 (${selectedYear})`;
        }
      })(),
      value: statsOriginais.transporteSum, // Original
      color: "bg-slate-700",
      textColor: "text-white",
    },
    indisponiveis: {
      label: "Indisponíveis",
      value: statsOriginais.indisponiveisSum, // Original (sem redução)
      color: "bg-red-500",
      textColor: "text-white",
    },
    totalReparadas: {
      label: "Total Reparadas",
      value: stats.totalReparadasSum, // Dinâmico ✅
      color: "bg-green-500",
      textColor: "text-white",
    },
    reconhecidas: {
      label: "Reconhecidas",
      value: statsOriginais.reconhecidasSum, // Original (sem redução)
      color: "bg-cyan-500",
      textColor: "text-white",
    },
    depPassagens: {
      label: "Dep. Passagens",
      value: statsOriginais.depPassagensSum, // Original (sem redução)
      color: "bg-blue-500",
      textColor: "text-white",
    },
    depLicenca: {
      label: "Dep. Licença",
      value: statsOriginais.depLicencaSum, // Original (sem redução)
      color: "bg-orange-500",
      textColor: "text-white",
    },
    depCutover: {
      label: "Dep. Cutover",
      value: statsOriginais.depCutoverSum, // Original (sem redução)
      color: "bg-purple-600",
      textColor: "text-white",
    },
    fibrasDep: {
      label: `Fibras Dep. ${selectedOperator}`,
      value: statsOriginais.fibrasDependentesLast, // Original (sem redução)
      color: "bg-slate-600",
      textColor: "text-white",
    },
  };

  // v3.17.8: GRUPO 2 (Dashboard Executivo) - USA VALORES COM REDUÇÃO POR PRIORIDADE
  const executiveDashboard = {
    transporteQ2: {
      label: (() => {
        if (selectedQuarter === "Q1") {
          const anoAnterior = parseInt(selectedYear) - 1;
          return `Transporte Q3 (${anoAnterior})`;
        } else if (selectedQuarter === "Q2") {
          return `Transporte Q1 (${selectedYear})`;
        } else {
          return `Transporte Q2 (${selectedYear})`;
        }
      })(),
      value: stats.transporteSum, // Com redução
      color: "bg-slate-700",
      textColor: "text-white",
    },
    indisponiveis: {
      label: "Indisponíveis",
      value: stats.indisponiveisSum, // Com redução ✅
      color: "bg-red-500",
      textColor: "text-white",
    },
    totalReparadas: {
      label: "Total Reparadas",
      value: stats.totalReparadasSum, // Dinâmico ✅
      color: "bg-green-500",
      textColor: "text-white",
    },
    reconhecidas: {
      label: "Reconhecidas",
      value: stats.reconhecidasSum, // Com redução ✅
      color: "bg-cyan-500",
      textColor: "text-white",
    },
    depPassagens: {
      label: "Dep. Passagens",
      value: stats.depPassagensSum, // Com redução ✅
      color: "bg-blue-500",
      textColor: "text-white",
    },
    depLicenca: {
      label: "Dep. Licença",
      value: stats.depLicencaSum, // Com redução ✅
      color: "bg-orange-500",
      textColor: "text-white",
    },
    depCutover: {
      label: "Dep. Cutover",
      value: stats.depCutoverSum, // Com redução ✅
      color: "bg-purple-600",
      textColor: "text-white",
    },
    fibrasDep: {
      label: `Fibras Dep. ${selectedOperator}`,
      value: stats.fibrasDependentesLast, // Com redução ✅
      color: "bg-slate-600",
      textColor: "text-white",
    },
  };

  // v3.13.20: Dados DINÂMICOS para os cards superiores (GRUPO 1 - Header)
  // v3.40.71: USA headerCardsData (valores ORIGINAIS, exceto Total Reparadas)
  const summaryCards = [
    {
      label: headerCardsData.transporteQ2.label,
      value: headerCardsData.transporteQ2.value, // ORIGINAL
      bgColor: headerCardsData.transporteQ2.color,
      icon: <TrendingUp className="w-3 h-3" />,
    },
    {
      label: headerCardsData.indisponiveis.label,
      value: headerCardsData.indisponiveis.value, // ORIGINAL (sem redução)
      bgColor: headerCardsData.indisponiveis.color,
      icon: <XCircle className="w-3 h-3" />,
    },
    {
      label: headerCardsData.totalReparadas.label,
      value: headerCardsData.totalReparadas.value, // DINÂMICO ✅
      bgColor: headerCardsData.totalReparadas.color,
      icon: <CheckCircle className="w-3 h-3" />,
    },
    {
      label: headerCardsData.reconhecidas.label,
      value: headerCardsData.reconhecidas.value, // ORIGINAL (sem redução)
      bgColor: headerCardsData.reconhecidas.color,
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    {
      label: headerCardsData.depPassagens.label,
      value: headerCardsData.depPassagens.value, // ORIGINAL (sem redução)
      bgColor: headerCardsData.depPassagens.color,
      icon: <Users className="w-3 h-3" />,
    },
    {
      label: headerCardsData.depLicenca.label,
      value: headerCardsData.depLicenca.value, // ORIGINAL (sem redução)
      bgColor: headerCardsData.depLicenca.color,
      icon: <Clock className="w-3 h-3" />,
    },
    {
      label: headerCardsData.depCutover.label,
      value: headerCardsData.depCutover.value, // ORIGINAL (sem redução)
      bgColor: headerCardsData.depCutover.color,
      icon: <MapPin className="w-3 h-3" />,
    },
    {
      label: headerCardsData.fibrasDep.label,
      value: headerCardsData.fibrasDep.value, // ORIGINAL (sem redução)
      bgColor: headerCardsData.fibrasDep.color,
      icon: <TrendingUp className="w-3 h-3" />,
    },
  ];

  // ============================================================================
  // FASE 12: TOP 5 ROTAS CRÍTICAS DINÂMICO COM useMemo
  // ============================================================================

  /**
   * Calcula Top 5 rotas com mais indisponíveis no quadrimestre
   * Usa useMemo para otimização - recalcula apenas quando data, selectedOperator ou selectedQuarter mudam
   */
  const topRotasCriticas = useMemo(() => {
    // Obter semanas do quadrimestre selecionado
    const quarterWeeks = allWeeks.slice(
      quarterConfig[selectedQuarter].start - 1,
      quarterConfig[selectedQuarter].end
    );

    // v3.18.0 FASE 2: Filtrar rotas por província
    const routesToProcess =
      selectedProvince !== "Todas"
        ? routesByPSM[selectedOperator].filter(
            (route) => routeToProvince[route] === selectedProvince
          )
        : routesByPSM[selectedOperator];

    console.log("📊 TOP 5 CRÍTICAS - Filtro Provincial:", {
      provincia: selectedProvince,
      totalRotasPSM: routesByPSM[selectedOperator].length,
      rotasFiltradas: routesToProcess.length,
    });

    // Objeto para acumular indisponíveis por rota
    const routeStats = {};

    // Inicializar rotas filtradas
    routesToProcess.forEach((route) => {
      routeStats[route] = {
        rota: route,
        totalIndisponiveis: 0,
        maxIndisponiveis: 0,
        totalReparadas: 0,
        semanas: [],
      };
    });

    // Iterar sobre semanas do quadrimestre e acumular indisponíveis
    quarterWeeks.forEach((week) => {
      if (data[selectedOperator]?.[week]) {
        routesToProcess.forEach((route) => {
          const routeData = data[selectedOperator][week][route];
          if (routeData) {
            const indisponiveis = parseInt(routeData["Indisponíveis"]) || 0;
            const reparadas = parseInt(routeData["Total Reparadas"]) || 0;

            if (indisponiveis > 0) {
              routeStats[route].totalIndisponiveis += indisponiveis;
              routeStats[route].maxIndisponiveis = Math.max(
                routeStats[route].maxIndisponiveis,
                indisponiveis
              );
              routeStats[route].semanas.push({ week, value: indisponiveis });
            }

            if (reparadas > 0) {
              routeStats[route].totalReparadas += reparadas;
            }
          }
        });
      }
    });

    // Converter para array e ordenar por máximo de indisponíveis (decrescente)
    const sortedRoutes = Object.values(routeStats)
      .filter((r) => r.maxIndisponiveis > 0) // Apenas rotas com indisponíveis
      .sort((a, b) => b.maxIndisponiveis - a.maxIndisponiveis);

    // Pegar top 5
    const top5 = sortedRoutes.slice(0, 5).map((route, index) => ({
      rank: index + 1,
      rota: route.rota,
      value: route.maxIndisponiveis,
      total: route.totalIndisponiveis,
      reparadas: route.totalReparadas,
      semanas: route.semanas,
    }));

    // Se não houver dados, retornar array vazio
    if (top5.length === 0) {
      return [
        {
          rank: 1,
          rota: "Sem dados",
          value: 0,
          total: 0,
          reparadas: 0,
          semanas: [],
        },
        {
          rank: 2,
          rota: "Sem dados",
          value: 0,
          total: 0,
          reparadas: 0,
          semanas: [],
        },
        {
          rank: 3,
          rota: "Sem dados",
          value: 0,
          total: 0,
          reparadas: 0,
          semanas: [],
        },
        {
          rank: 4,
          rota: "Sem dados",
          value: 0,
          total: 0,
          reparadas: 0,
          semanas: [],
        },
        {
          rank: 5,
          rota: "Sem dados",
          value: 0,
          total: 0,
          reparadas: 0,
          semanas: [],
        },
      ];
    }

    // Se houver menos de 5, preencher com vazios
    while (top5.length < 5) {
      top5.push({
        rank: top5.length + 1,
        rota: "-",
        value: 0,
        total: 0,
        reparadas: 0,
        semanas: [],
      });
    }

    return top5;
  }, [data, selectedOperator, selectedQuarter, selectedProvince]);

  // FASE 3: Função busca TODOS os dados da rota
  const handleRotaClick = (rota) => {
    // Buscar últimos valores de cada status do quadrimestre
    const quarterLimits = quarterConfig[selectedQuarter];
    const stats = {};

    statusCategories.forEach((status) => {
      let key = status;
      if (status === "Fibras Dependentes") {
        key = "Fibras dependentes da " + selectedOperator;
      }

      let lastValue = 0;
      let lastWeek = null;

      // EXCEÇÃO: Total Reparadas deve ser ACUMULADO
      if (status === "Total Reparadas") {
        let acumulado = 0;

        // Somar todas as reparadas do quadrimestre
        for (let i = quarterLimits.start; i <= quarterLimits.end; i++) {
          const week = "W" + i;
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
          const week = "W" + i;
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
    const justKey = selectedOperator + "_" + rota;
    const rawJust = justificativas[justKey];

    // IMPORTANTE: Só usar a justificativa se for do quarter selecionado
    const just =
      rawJust && rawJust.quarter === selectedQuarter ? rawJust : null;

    console.log("📝 Justificativa (filtrada por quarter):", just);

    setSelectedRota({ name: rota, stats, justification: just });
    setShowModal(true);
  };

  // ============================================================================
  // FUNÇÃO DE DRILL-DOWN: Detalhamento por Status
  // ============================================================================

  const handleStatusClick = (statusLabel) => {
    const quarterLimits = quarterConfig[selectedQuarter];
    const routesDetail = [];

    // ✅ MAPEAMENTO CORRETO: Label do card → Chave nos dados
    const labelToKeyMap = {
      // Labels dos cards (podem variar)
      Indisponíveis: "Indisponíveis",
      "Total Reparadas": "Total Reparadas",
      Reconhecidas: "Reconhecidas",
      "Dep. Passagens": "Dep. de Passagem de Cabo",
      "Dep. Licença": "Dep. de Licença",
      "Dep. Cutover": "Dep. de Cutover",
      "Fibras Dependentes": `Fibras dependentes da ${selectedOperator}`,
      // Transporte pode ter ano no label
      [`Transporte ${selectedQuarter} (${selectedYear})`]: "Transporte",
      Transporte: "Transporte",
    };

    // Verificar se o label contém "Transporte" (pode ter ano)
    let key = labelToKeyMap[statusLabel];
    if (!key && statusLabel.includes("Transporte")) {
      key = "Transporte";
    }

    // Se ainda não encontrou, tentar buscar por "Fibras Dep."
    if (!key && statusLabel.includes("Fibras Dep.")) {
      key = `Fibras dependentes da ${selectedOperator}`;
    }

    // Fallback: usar o próprio label
    if (!key) {
      key = statusLabel;
    }

    console.log("🔍 handleStatusClick:", {
      statusLabel,
      key,
      selectedOperator,
    });

    // Iterar sobre todas as rotas do PSM
    routesByPSM[selectedOperator].forEach((route) => {
      // Buscar último valor não-zero do status para esta rota
      let lastValue = 0;
      let lastWeek = null;

      // Para Total Reparadas: acumular
      if (key === "Total Reparadas") {
        for (let i = quarterLimits.start; i <= quarterLimits.end; i++) {
          const week = "W" + i;
          const val = data[selectedOperator]?.[week]?.[route]?.[key];
          if (val !== undefined && val > 0) {
            lastValue += parseInt(val) || 0;
            lastWeek = week;
          }
        }
      } else {
        // Para outros: buscar último valor não-zero
        for (let i = quarterLimits.end; i >= quarterLimits.start; i--) {
          const week = "W" + i;
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
          semana: lastWeek,
        });
      }
    });

    // Ordenar por valor (decrescente)
    routesDetail.sort((a, b) => b.valor - a.valor);

    // Calcular total
    const total = routesDetail.reduce((sum, r) => sum + r.valor, 0);

    console.log("✅ Resultado:", { total, rotas: routesDetail.length });

    setSelectedStatusDrilldown({
      label: statusLabel,
      total: total,
      rotas: routesDetail,
    });
    setCurrentPageDrilldown(0); // Reset para primeira página
    setShowStatusDrilldown(true);
  };

  // ============================================================================
  // FASE 13: INTERVENÇÕES RECENTES DINÂMICO COM useMemo
  // ============================================================================

  /**
   * Calcula as intervenções mais recentes (rotas com reparos)
   * Usa useMemo para otimização - recalcula apenas quando data, selectedOperator ou selectedQuarter mudam
   */
  const intervencoesRecentes = useMemo(() => {
    // v3.22.2: Obter apenas semanas ATÉ a semana selecionada (não incluir futuras)
    const quarterWeeks = allWeeks.slice(
      quarterConfig[selectedQuarter].start - 1,
      quarterConfig[selectedQuarter].end
    );

    // Filtrar apenas semanas até a selecionada
    const selectedWeekNum = parseInt(selectedWeek.substring(1)); // W49 -> 49
    const weeksAteSelecao = quarterWeeks
      .filter((week) => {
        const weekNum = parseInt(week.substring(1));
        return weekNum <= selectedWeekNum;
      })
      .reverse(); // Inverter para começar pela semana mais recente

    console.log("🔵 INTERVENÇÕES RECENTES - Filtro de Semanas:", {
      semanaSelecionada: selectedWeek,
      totalSemanasQuadrimestre: quarterWeeks.length,
      semanasConsideradas: weeksAteSelecao.length,
      semanas: weeksAteSelecao.slice(0, 5),
    });

    // v3.18.0 FASE 2: Filtrar rotas por província
    const routesToProcess =
      selectedProvince !== "Todas"
        ? routesByPSM[selectedOperator].filter(
            (route) => routeToProvince[route] === selectedProvince
          )
        : routesByPSM[selectedOperator];

    // Array para armazenar intervenções
    const intervencoes = [];

    // Iterar sobre rotas filtradas
    routesToProcess.forEach((route) => {
      let routeIntervencao = {
        rota: route,
        semanas: [],
        totalReparadas: 0,
        ultimaSemana: null,
      };

      // Iterar sobre semanas ATÉ a selecionada (da mais recente para mais antiga)
      weeksAteSelecao.forEach((week) => {
        if (data[selectedOperator]?.[week]?.[route]) {
          const routeData = data[selectedOperator][week][route];
          const reparadas = parseInt(routeData["Total Reparadas"]) || 0;

          if (reparadas > 0) {
            routeIntervencao.semanas.push(week);
            routeIntervencao.totalReparadas += reparadas;

            // Guardar a primeira semana encontrada (mais recente)
            if (!routeIntervencao.ultimaSemana) {
              routeIntervencao.ultimaSemana = week;
            }
          }
        }
      });

      // Se teve reparos, adicionar à lista
      if (routeIntervencao.totalReparadas > 0) {
        intervencoes.push(routeIntervencao);
      }
    });

    // Ordenar por:
    // 1. Semana mais recente (W49 antes de W40)
    // 2. Total de reparadas (em caso de empate)
    intervencoes.sort((a, b) => {
      // Extrair número da semana (W50 -> 50)
      const weekNumA = parseInt(a.ultimaSemana.substring(1));
      const weekNumB = parseInt(b.ultimaSemana.substring(1));

      if (weekNumB !== weekNumA) {
        return weekNumB - weekNumA; // Mais recente primeiro
      }
      return b.totalReparadas - a.totalReparadas; // Mais reparos primeiro
    });

    // v3.20.2: Retornar TODAS as intervenções (removido .slice(0, 4))
    const allIntervencoes = intervencoes.map((item) => ({
      rota: item.rota,
      status: item.semanas.slice(0, 3).join(" "), // Mostrar até 3 semanas
      reps: item.totalReparadas,
      semanas: item.semanas,
      ultimaSemana: item.ultimaSemana,
    }));

    console.log("📋 INTERVENÇÕES RECENTES:", {
      provincia: selectedProvince,
      totalIntervencoes: allIntervencoes.length,
      amostra: allIntervencoes.slice(0, 3).map((i) => i.rota),
    });

    return allIntervencoes;
  }, [data, selectedOperator, selectedQuarter, selectedProvince, selectedWeek]); // v3.22.2: Adicionar selectedWeek

  // ============================================================================
  // FASE 14: ROTAS NORMALIZADAS DINÂMICO COM useMemo
  // ============================================================================

  /**
   * Calcula rotas que foram normalizadas (tinham indisponíveis e agora têm zero)
   * Usa useMemo para otimização - recalcula apenas quando data, selectedOperator ou selectedQuarter mudam
   */
  const rotasNormalizadas = useMemo(() => {
    console.log(
      "🔄 FASE 14: Calculando Rotas Normalizadas (Critérios Corretos)..."
    );

    // Definir limites do quadrimestre
    const quarterLimits = quarterConfig[selectedQuarter];

    // v3.18.0 FASE 2: Filtrar rotas por província
    const routesToProcess =
      selectedProvince !== "Todas"
        ? routesByPSM[selectedOperator].filter(
            (route) => routeToProvince[route] === selectedProvince
          )
        : routesByPSM[selectedOperator];

    // Array para armazenar rotas normalizadas
    const normalizadas = [];

    // Iterar sobre rotas filtradas
    routesToProcess.forEach((route) => {
      let wasNormalized = false;
      let normalizationWeek = null;
      let normalizationCondition = null;

      // Loop: Verificar cada semana do quadrimestre
      for (
        let checkWeek = quarterLimits.start;
        checkWeek <= quarterLimits.end;
        checkWeek++
      ) {
        const week = "W" + checkWeek;

        // 1. Calcular Total Reparadas ACUMULADO desde início do quadrimestre
        let totalReparadas = 0;
        for (let i = quarterLimits.start; i <= checkWeek; i++) {
          const w = "W" + i;
          const weekData = data[selectedOperator]?.[w]?.[route];
          if (weekData && weekData["Total Reparadas"]) {
            totalReparadas += parseInt(weekData["Total Reparadas"]) || 0;
          }
        }

        // Se não há reparações, pular esta semana
        if (totalReparadas === 0) continue;

        // 2. Buscar cada campo INDEPENDENTEMENTE (busca REVERSA até checkWeek)
        let fibrasDependentes = null;
        let transporte = null;
        let indisponiveis = null;

        const depKey = "Fibras dependentes da " + selectedOperator;

        // Buscar de trás para frente (da semana atual até início do quadrimestre)
        for (let i = checkWeek; i >= quarterLimits.start; i--) {
          const w = "W" + i;
          const weekData = data[selectedOperator]?.[w]?.[route];

          if (!weekData) continue;

          // Buscar Fibras Dependentes (primeiro valor não-nulo encontrado)
          if (fibrasDependentes === null && depKey in weekData) {
            const val = weekData[depKey];
            if (val !== undefined && val !== null && val !== "") {
              fibrasDependentes = parseInt(val) || 0;
            }
          }

          // Buscar Transporte (primeiro valor não-nulo encontrado)
          if (transporte === null && "Transporte" in weekData) {
            const val = weekData["Transporte"];
            if (val !== undefined && val !== null && val !== "") {
              transporte = parseInt(val) || 0;
            }
          }

          // Buscar Indisponíveis (primeiro valor não-nulo encontrado)
          if (indisponiveis === null && "Indisponíveis" in weekData) {
            const val = weekData["Indisponíveis"];
            if (val !== undefined && val !== null && val !== "") {
              indisponiveis = parseInt(val) || 0;
            }
          }
        }

        // Se não encontrou nenhum campo, pular
        const foundAnyField =
          fibrasDependentes !== null ||
          transporte !== null ||
          indisponiveis !== null;
        if (!foundAnyField) continue;

        // 3. Converter null para 0 (para comparação)
        const depFinal = fibrasDependentes !== null ? fibrasDependentes : 0;
        const transpFinal = transporte !== null ? transporte : 0;
        const indispFinal = indisponiveis !== null ? indisponiveis : 0;

        // 4. VERIFICAR CONDIÇÕES DE NORMALIZAÇÃO

        // CONDIÇÃO 1 (Mais Restritiva): Todos os 4 campos iguais e > 0
        // TR = FD = Transp = Indisp e TR > 0
        const condition1 =
          depFinal === transpFinal &&
          transpFinal === indispFinal &&
          indispFinal === totalReparadas &&
          totalReparadas > 0;

        // CONDIÇÃO 2 (Menos Restritiva): 3 campos iguais (ignora Transporte) e > 0
        // TR = FD = Indisp e TR > 0
        const condition2 =
          depFinal === indispFinal &&
          indispFinal === totalReparadas &&
          totalReparadas > 0;

        // CONDIÇÃO 3: Transporte = Indisponíveis = Total Reparadas (ignora Fibras Dep)
        // Transp = Indisp = TR e TR > 0
        const condition3 =
          transpFinal === indispFinal &&
          indispFinal === totalReparadas &&
          totalReparadas > 0;

        // CONDIÇÃO 4 (Comparação Temporal): Tinha problemas → Zerou tudo + Reparou EXATAMENTE
        // Buscar se TEVE problemas anteriormente E somar total de Indisponíveis
        let hadProblemsEarlier = false;
        let totalIndisponiveisAntes = 0;

        for (let i = quarterLimits.start; i < checkWeek; i++) {
          const prevWeek = "W" + i;
          const prevData = data[selectedOperator]?.[prevWeek]?.[route];
          if (prevData) {
            const prevIndisp = parseInt(prevData["Indisponíveis"]) || 0;
            const prevTransp = parseInt(prevData["Transporte"]) || 0;
            const prevDep = parseInt(prevData[depKey]) || 0;

            // Somar indisponíveis anteriores
            if (prevIndisp > 0) {
              totalIndisponiveisAntes += prevIndisp;
              hadProblemsEarlier = true;
            }

            // Verificar se teve outros problemas
            if (prevTransp > 0 || prevDep > 0) {
              hadProblemsEarlier = true;
            }
          }
        }

        // Condição 4: Teve problemas antes E agora está tudo zerado E Total Reparadas = Total Indisponíveis anteriores
        const condition4 =
          hadProblemsEarlier &&
          depFinal === 0 &&
          transpFinal === 0 &&
          indispFinal === 0 &&
          totalReparadas === totalIndisponiveisAntes &&
          totalReparadas > 0;

        // 5. Se normalizada, registrar e PARAR (primeira normalização vale - PERSISTÊNCIA)
        if (condition1 || condition2 || condition3 || condition4) {
          wasNormalized = true;
          normalizationWeek = week;
          normalizationCondition = condition1
            ? "Condição 1"
            : condition2
            ? "Condição 2"
            : condition3
            ? "Condição 3"
            : "Condição 4";

          console.log(`✅ ${route} normalizada em ${week}:`, {
            totalReparadas,
            fibrasDependentes: depFinal,
            transporte: transpFinal,
            indisponiveis: indispFinal,
            condition: normalizationCondition,
            hadProblemsEarlier: condition4 ? hadProblemsEarlier : undefined,
            totalIndisponiveisAntes: condition4
              ? totalIndisponiveisAntes
              : undefined,
            reparadasIgualIndisp: condition4
              ? totalReparadas === totalIndisponiveisAntes
              : undefined,
          });

          break; // PERSISTÊNCIA: Primeira normalização vale!
        }
      }

      // 6. Se foi normalizada, adicionar à lista
      if (wasNormalized) {
        normalizadas.push({
          rota: route,
          status: `Normalizada em ${normalizationWeek}`,
          semanaNormalizacao: normalizationWeek,
          condition: normalizationCondition,
          icon: "✓",
        });
      }
    });

    // Ordenar por semana de normalização (mais recente primeiro)
    normalizadas.sort((a, b) => {
      const weekNumA = parseInt(a.semanaNormalizacao.substring(1));
      const weekNumB = parseInt(b.semanaNormalizacao.substring(1));
      return weekNumB - weekNumA; // Mais recente primeiro
    });

    // Se não houver rotas normalizadas
    if (normalizadas.length === 0) {
      return [
        { rota: "Nenhuma rota normalizada", status: "-", icon: "○" },
        { rota: "Nenhuma rota normalizada", status: "-", icon: "○" },
        { rota: "Nenhuma rota normalizada", status: "-", icon: "○" },
      ];
    }

    // Retornar TODAS as rotas normalizadas (sem limitar)
    return normalizadas;
  }, [data, selectedOperator, selectedQuarter, selectedProvince]); // Recalcular quando estas variáveis mudarem

  // ============================================================================
  // v3.40.28: SISTEMA DE ALERTAS - Reparadas ACUMULADO > Indisponíveis ÚLTIMO
  // ============================================================================
  const alertas = useMemo(() => {
    console.log("🔔 FASE 1: Calculando alertas...");

    const alertasDetectados = [];
    const quarterWeeks = allWeeks.slice(
      quarterConfig[selectedQuarter].start - 1,
      quarterConfig[selectedQuarter].end
    );

    // Filtrar rotas por província se necessário
    const routesToCheck =
      selectedProvince !== "Todas"
        ? routesByPSM[selectedOperator].filter(
            (route) => routeToProvince[route] === selectedProvince
          )
        : routesByPSM[selectedOperator];

    console.log(`🔔 FASE 2: Verificando ${routesToCheck.length} rotas`);

    const selectedWeekNum = parseInt(selectedWeek.substring(1));

    // Para cada rota, encontrar PRIMEIRA semana onde condição é verdadeira
    routesToCheck.forEach((route) => {
      // 1. CALCULAR ACUMULADO TOTAL do quadrimestre até selectedWeek
      let totalReparadasAcumulado = 0;
      const selectedWeekNum = parseInt(selectedWeek.substring(1));

      for (
        let i = quarterConfig[selectedQuarter].start;
        i <= selectedWeekNum;
        i++
      ) {
        const w = `W${i}`;
        const wData = data[selectedOperator]?.[w]?.[route];
        if (wData && wData["Total Reparadas"]) {
          totalReparadasAcumulado += parseInt(wData["Total Reparadas"]) || 0;
        }
      }

      // Se não há reparadas acumuladas, pular
      if (totalReparadasAcumulado === 0) return;

      // 2. BUSCAR MAIOR VALOR DE INDISPONÍVEIS no quadrimestre até selectedWeek
      let maiorIndisponiveis = null;
      let temIndisponiveisRegistrado = false;

      for (
        let i = quarterConfig[selectedQuarter].start;
        i <= selectedWeekNum;
        i++
      ) {
        const w = `W${i}`;
        const wData = data[selectedOperator]?.[w]?.[route];

        if (
          wData &&
          wData["Indisponíveis"] !== undefined &&
          wData["Indisponíveis"] !== null &&
          wData["Indisponíveis"] !== ""
        ) {
          temIndisponiveisRegistrado = true;
          const indispAtual = parseInt(wData["Indisponíveis"]) || 0;

          if (maiorIndisponiveis === null || indispAtual > maiorIndisponiveis) {
            maiorIndisponiveis = indispAtual;
          }
        }
      }

      // Se não há Indisponíveis registrado em nenhuma semana, pular
      if (!temIndisponiveisRegistrado) return;

      // 3. VERIFICAR CONDIÇÕES DE ALERTA
      let deveAlertar = false;
      let motivoAlerta = "";

      // REGRA 1: Acumulado > Maior Indisponíveis
      if (totalReparadasAcumulado > maiorIndisponiveis) {
        deveAlertar = true;
        motivoAlerta = `Acumulado(${totalReparadasAcumulado}) > Maior Indisponíveis(${maiorIndisponiveis})`;
      }

      // REGRA 2: Indisponíveis = 0 em todas as semanas E Acumulado > 0
      if (maiorIndisponiveis === 0 && totalReparadasAcumulado > 0) {
        deveAlertar = true;
        motivoAlerta = `Indisponíveis=0 mas Acumulado=${totalReparadasAcumulado}`;
      }

      // 4. SE DEVE ALERTAR, criar alerta
      if (deveAlertar) {
        const alertaId = `alerta-${route}-${selectedQuarter}`;
        const alertaJaLido = alertasLidos.includes(alertaId);

        console.log(`🔔 ALERTA: ${route} - ${motivoAlerta}`);

        // Só mostrar se não foi marcado como lido
        if (!alertaJaLido) {
          alertasDetectados.push({
            id: alertaId,
            tipo: "info",
            rota: route,
            provincia: routeToProvince[route],
            reparadasAcumulado: totalReparadasAcumulado,
            indisponiveis: maiorIndisponiveis,
            diferenca: totalReparadasAcumulado - maiorIndisponiveis,
            semanaDeteccao: selectedWeek,
            timestamp: new Date().toISOString(),
            lido: false,
          });
        }
      }
    });

    // Ordenar alertas: mais recentes primeiro (por semana de detecção)
    alertasDetectados.sort((a, b) => {
      const weekNumA = parseInt(a.semanaDeteccao.substring(1));
      const weekNumB = parseInt(b.semanaDeteccao.substring(1));
      return weekNumB - weekNumA;
    });

    console.log(`🔔 FASE 3: ${alertasDetectados.length} alertas detectados`);
    return alertasDetectados;
  }, [
    data,
    selectedOperator,
    selectedQuarter,
    selectedWeek,
    selectedProvince,
    alertasLidos,
  ]);

  // ============================================================================
  // v3.23.0: ROTAS MAIS INTERVENCIONADAS (TOP 5 com mais reparadas)
  // ============================================================================
  const rotasMaisIntervencionadas = useMemo(() => {
    const quarterWeeks = allWeeks.slice(
      quarterConfig[selectedQuarter].start - 1,
      quarterConfig[selectedQuarter].end
    );

    const routesToProcess =
      selectedProvince !== "Todas"
        ? routesByPSM[selectedOperator].filter(
            (route) => routeToProvince[route] === selectedProvince
          )
        : routesByPSM[selectedOperator];

    // Calcular total de reparadas por rota
    const rotasComReparadas = [];

    routesToProcess.forEach((route) => {
      let totalReparadas = 0;

      quarterWeeks.forEach((week) => {
        if (data[selectedOperator]?.[week]?.[route]) {
          const routeData = data[selectedOperator][week][route];
          totalReparadas += parseInt(routeData["Total Reparadas"]) || 0;
        }
      });

      if (totalReparadas > 0) {
        rotasComReparadas.push({
          rota: route,
          totalReparadas: totalReparadas,
        });
      }
    });

    // Ordenar por total de reparadas (maior para menor) e pegar top 5
    const top5 = rotasComReparadas
      .sort((a, b) => b.totalReparadas - a.totalReparadas)
      .slice(0, 5)
      .map((item, idx) => ({
        rank: idx + 1,
        rota: item.rota,
        value: item.totalReparadas,
      }));

    // Preencher até 5 se necessário
    while (top5.length < 5) {
      top5.push({
        rank: top5.length + 1,
        rota: "-",
        value: 0,
      });
    }

    return top5;
  }, [data, selectedOperator, selectedQuarter, selectedProvince]);

  // ============================================================================
  // v3.23.0: ROTAS SEM INTERVENÇÃO (sem nenhuma reparada no quadrimestre)
  // ============================================================================
  const rotasSemIntervencao = useMemo(() => {
    const quarterWeeks = allWeeks.slice(
      quarterConfig[selectedQuarter].start - 1,
      quarterConfig[selectedQuarter].end
    );

    const routesToProcess =
      selectedProvince !== "Todas"
        ? routesByPSM[selectedOperator].filter(
            (route) => routeToProvince[route] === selectedProvince
          )
        : routesByPSM[selectedOperator];

    // Encontrar rotas SEM reparadas
    const rotasSemReparadas = [];

    routesToProcess.forEach((route) => {
      let totalReparadas = 0;
      let temDados = false;

      quarterWeeks.forEach((week) => {
        if (data[selectedOperator]?.[week]?.[route]) {
          const routeData = data[selectedOperator][week][route];
          totalReparadas += parseInt(routeData["Total Reparadas"]) || 0;

          // Verificar se rota tem outros dados
          const transporte = parseInt(routeData["Transporte"]) || 0;
          const indisponiveis = parseInt(routeData["Indisponíveis"]) || 0;
          if (transporte > 0 || indisponiveis > 0) {
            temDados = true;
          }
        }
      });

      // Adicionar se tem dados MAS zero reparadas
      if (temDados && totalReparadas === 0) {
        rotasSemReparadas.push({
          rota: route,
        });
      }
    });

    return rotasSemReparadas;
  }, [data, selectedOperator, selectedQuarter, selectedProvince]);

  // ============================================================================
  // FASE 15: CLASSIFICAÇÃO DE ROTAS (DEGRADADAS/GANHO/ESTÁVEIS) COM useMemo
  // ============================================================================

  /**
   * Classifica rotas em 3 categorias baseado na comparação Q2 vs Quadrimestre Atual
   * - DEGRADADAS: Indisponíveis aumentou
   * - COM GANHO: Total Reparadas > Indisponíveis (melhorou)
   * - ESTÁVEIS: Manteve-se similar
   */
  // ============================================================================
  // FASE 15: CLASSIFICAÇÃO DE ROTAS (conforme documentação original)
  // ============================================================================
  /**
   * v3.13.27: Corrigido para seguir documentação original
   * Usa selectedWeek e compara Transporte vs Indisponíveis
   * Não compara Q2 vs quadrimestre atual
   */
  const classificacaoRotas = useMemo(() => {
    console.log("🔄 FASE 15: Classificando Rotas (DOCUMENTAÇÃO ORIGINAL)...");

    const classificacao = {
      degradadas: [],
      comGanho: [],
      estaveis: [],
    };

    // Percorrer todas as rotas do PSM selecionado
    routesByPSM[selectedOperator].forEach((rota) => {
      let mostRecentWeek = null;
      const weekNum = parseInt(selectedWeek.substring(1)); // Ex: "W15" → 15

      // 1. BUSCAR SEMANA MAIS RECENTE COM DADOS
      // Loop reverso da semana selecionada até W1
      for (let i = weekNum; i >= 1; i--) {
        const checkWeek = "W" + i;
        const weekData = data[selectedOperator]?.[checkWeek]?.[rota] || {};

        // Verificar se tem dados (Transporte OU Indisponíveis > 0)
        const hasData =
          (weekData["Transporte"] || 0) > 0 ||
          (weekData["Indisponíveis"] || 0) > 0;

        if (hasData) {
          mostRecentWeek = checkWeek; // Encontrou! Guardar e sair do loop
          break;
        }
      }

      // 2. SE NÃO TEM DADOS, IGNORAR ESTA ROTA
      if (!mostRecentWeek) return;

      // 3. PEGAR VALORES DA SEMANA MAIS RECENTE
      const rotaData = data[selectedOperator]?.[mostRecentWeek]?.[rota] || {};
      const transporte = parseInt(rotaData["Transporte"]) || 0;
      const indisponiveis = parseInt(rotaData["Indisponíveis"]) || 0;

      // 4. CALCULAR TOTAL REPARADAS (ACUMULADO ATÉ SEMANA SELECIONADA)
      let totalReparadasAcumulado = 0;
      for (let i = 1; i <= weekNum; i++) {
        const checkWeek = "W" + i;
        const weekData = data[selectedOperator]?.[checkWeek]?.[rota] || {};
        totalReparadasAcumulado += parseInt(weekData["Total Reparadas"]) || 0;
      }

      // 5. VERIFICAR SE FOI REPARADA NA SEMANA ATUAL
      const currentWeekData =
        data[selectedOperator]?.[selectedWeek]?.[rota] || {};
      const isRepairedThisWeek =
        (parseInt(currentWeekData["Total Reparadas"]) || 0) > 0;

      // 6. IGNORAR SE AMBOS SÃO ZERO
      if (transporte === 0 && indisponiveis === 0) return;

      // 7. CRIAR OBJETO COM INFORMAÇÕES DA ROTA
      const routeInfo = {
        rota, // Nome da rota
        transporte, // Valor de Transporte
        indisponiveis, // Valor de Indisponíveis
        totalReparadas: totalReparadasAcumulado, // Acumulado
        isRepaired: isRepairedThisWeek, // Flag: reparada esta semana?
      };

      // 8. CLASSIFICAR A ROTA (conforme documentação)
      if (indisponiveis > transporte) {
        // DEGRADADA: mais problemas que o esperado
        classificacao.degradadas.push(routeInfo);
      } else if (transporte > indisponiveis) {
        // COM GANHO: menos problemas que o esperado
        classificacao.comGanho.push(routeInfo);
      } else if (transporte === indisponiveis) {
        // ESTÁVEL: mesma quantidade
        classificacao.estaveis.push(routeInfo);
      }
    });

    console.log("✓ Classificação calculada (DOCUMENTAÇÃO ORIGINAL):", {
      degradadas: classificacao.degradadas.length,
      comGanho: classificacao.comGanho.length,
      estaveis: classificacao.estaveis.length,
    });

    return classificacao;
  }, [data, selectedOperator, selectedWeek, selectedQuarter, routesByPSM]);
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
    return routesList.map((routeInfo) => {
      const rotaData = { name: routeInfo.rota };

      // Adicionar cada status ao objeto
      const statusCategorias = [
        "Transporte",
        "Indisponíveis",
        "Total Reparadas",
        "Reconhecidas",
        "Dep. de Passagem de Cabo",
        "Dep. de Licença",
        "Dep. de Cutover",
        `Fibras dependentes da ${selectedOperator}`,
      ];

      statusCategorias.forEach((status) => {
        // Buscar semana mais recente com dados
        let mostRecentWeek = null;
        const weekNum = parseInt(selectedWeek.substring(1));

        for (let i = weekNum; i >= 1; i--) {
          const checkWeek = "W" + i;
          const weekData =
            data[selectedOperator]?.[checkWeek]?.[routeInfo.rota] || {};

          if ((weekData[status] || 0) > 0) {
            mostRecentWeek = checkWeek;
            break;
          }
        }

        // Pegar valor ou zero
        if (mostRecentWeek) {
          const weekData =
            data[selectedOperator]?.[mostRecentWeek]?.[routeInfo.rota] || {};
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

    const maxLength = Math.max(...routesList.map((r) => r.rota.length));
    return Math.max(80, 80 + Math.floor((maxLength - 20) / 4) * 8);
  };

  /**
   * Calcular margem inferior
   */
  const getBottomMargin = (routesList) => {
    if (routesList.length === 0) return 90;

    const maxLength = Math.max(...routesList.map((r) => r.rota.length));
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
    const routeInfo = allRoutes.find((r) => r.rota === payload.value);
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
    Transporte: "#475569", // Cinza escuro (slate-600)
    Indisponíveis: "#EF4444", // Vermelho (red-500)
    "Total Reparadas": "#22C55E", // Verde (green-500)
    Reconhecidas: "#06B6D4", // Ciano/Azul claro (cyan-500)
    "Dep. de Passagem de Cabo": "#3B82F6", // Azul (blue-500)
    "Dep. de Licença": "#F97316", // Laranja (orange-500)
    "Dep. de Cutover": "#A855F7", // Roxo (purple-500)
    [`Fibras dependentes da ${selectedOperator}`]: "#64748B", // Cinza médio (slate-500)
  };

  // ============================================================================
  // FASE 16: GRÁFICOS DE TENDÊNCIAS DINÂMICOS COM useMemo
  // ============================================================================

  /**
   * Calcula dados para os gráficos de tendências (evolução temporal)
   * Mostra a evolução semana a semana do quadrimestre selecionado
   */
  const trendData = useMemo(() => {
    console.log(
      "🔄 FASE 16: Calculando Evolução Temporal (v3.40.77: Fibras Dep do card)..."
    );

    // Obter semanas do quadrimestre selecionado
    const quarterWeeks = allWeeks.slice(
      quarterConfig[selectedQuarter].start - 1,
      quarterConfig[selectedQuarter].end
    );

    // v3.40.76: Validação inicial
    if (!quarterWeeks || quarterWeeks.length === 0) {
      console.warn("⚠️ quarterWeeks vazio ou inválido");
      return [];
    }

    // v3.19.0 FASE 3: Filtrar rotas por província
    const routesToProcess =
      selectedProvince !== "Todas"
        ? routesByPSM[selectedOperator].filter(
            (route) => routeToProvince[route] === selectedProvince
          )
        : routesByPSM[selectedOperator];

    console.log("📊 EVOLUÇÃO TEMPORAL - Filtro Provincial:", {
      provincia: selectedProvince,
      rotasFiltradas: routesToProcess.length,
      quarter: selectedQuarter,
      quarterWeeks: `${quarterWeeks[0]} - ${
        quarterWeeks[quarterWeeks.length - 1]
      }`,
    });

    // v3.40.77: APENAS as semanas ATÉ a selecionada (não estende mais)
    const selectedWeekNum = parseInt(selectedWeek.substring(1));
    const weeksAteSelecao = quarterWeeks.filter((week) => {
      const weekNum = parseInt(week.substring(1));
      return weekNum <= selectedWeekNum;
    });

    // v3.40.76: Validação de weeksAteSelecao
    if (weeksAteSelecao.length === 0) {
      console.warn(
        `⚠️ weeksAteSelecao vazio - selectedWeek ${selectedWeek} não está no quarter ${selectedQuarter}`
      );
      return [];
    }

    console.log(
      `📅 Semanas no gráfico: ${weeksAteSelecao[0]} até ${selectedWeek} (${weeksAteSelecao.length} semanas)`
    );

    // v3.40.78: Calcular Fibras Dep com REDUÇÃO (mesma lógica Grupo 2)
    // Para cada semana, aplicar redução acumulada até essa semana
    const trends = [];

    weeksAteSelecao.forEach((week, weekIdx) => {
      let weekStats = {
        week: week,
        indisponiveis: 0, // v3.40.80: ORIGINAL (Grupo 1)
        totalReparadas: 0, // Semanal
        reparadasGlobal: 0, // Soma total
        fibrasDep: 0, // Reduzido (Grupo 2)
      };

      // v3.40.80: INDISPONÍVEIS = valores ORIGINAIS (Grupo 1)
      // Buscar último valor de cada rota até esta semana
      routesToProcess.forEach((route) => {
        let ultimoIndisp = 0;

        // Percorrer até esta semana para pegar último valor
        for (let i = 0; i <= weekIdx; i++) {
          const w = weeksAteSelecao[i];
          const routeData = data[selectedOperator]?.[w]?.[route];
          if (routeData) {
            const indisp = parseInt(routeData["Indisponíveis"]) || 0;
            if (indisp > 0) {
              ultimoIndisp = indisp; // Último valor não-zero
            }
          }
        }

        weekStats.indisponiveis += ultimoIndisp;
      });

      // Pegar ÚLTIMOS valores de cada rota ATÉ esta semana (para Fibras Dep)
      let routeLastValues = {};

      routesToProcess.forEach((route) => {
        routeLastValues[route] = {
          totalReparadas: 0,
          reconhecidas: 0,
          depPassagem: 0,
          depLicenca: 0,
          depCutover: 0,
          fibrasDep: 0,
        };

        // Percorrer semanas ATÉ a semana atual
        for (let i = 0; i <= weekIdx; i++) {
          const w = weeksAteSelecao[i];
          const routeData = data[selectedOperator]?.[w]?.[route];

          if (routeData) {
            // Últimos valores (não zero)
            const reconh = parseInt(routeData["Reconhecidas"]) || 0;
            const depPass =
              parseInt(routeData["Dep. de Passagem de Cabo"]) || 0;
            const depLic = parseInt(routeData["Dep. de Licença"]) || 0;
            const depCut = parseInt(routeData["Dep. de Cutover"]) || 0;
            const fibras =
              parseInt(
                routeData[`Fibras dependentes da ${selectedOperator}`]
              ) || 0;

            if (reconh > 0) routeLastValues[route].reconhecidas = reconh;
            if (depPass > 0) routeLastValues[route].depPassagem = depPass;
            if (depLic > 0) routeLastValues[route].depLicenca = depLic;
            if (depCut > 0) routeLastValues[route].depCutover = depCut;
            if (fibras > 0) routeLastValues[route].fibrasDep = fibras;

            // Acumular reparadas
            routeLastValues[route].totalReparadas +=
              parseInt(routeData["Total Reparadas"]) || 0;
          }
        }
      });

      // v3.40.79: Total Reparadas = reparadas DA SEMANA (não acumulado)
      // Pegar apenas da semana atual (week)
      let reparadasDaSemana = 0;
      routesToProcess.forEach((route) => {
        const routeData = data[selectedOperator]?.[week]?.[route];
        if (routeData) {
          reparadasDaSemana += parseInt(routeData["Total Reparadas"]) || 0;
        }
      });
      weekStats.totalReparadas = reparadasDaSemana; // v3.40.79: Semanal!

      // v3.40.78: Aplicar REDUÇÃO POR PRIORIDADE (mesma lógica Grupo 2)
      Object.values(routeLastValues).forEach((values) => {
        const indisponiveisOriginais =
          values.reconhecidas +
          values.depPassagem +
          values.depLicenca +
          values.depCutover +
          values.fibrasDep;

        // Se reparadas >= indisponíveis → ZERA TUDO
        if (values.totalReparadas >= indisponiveisOriginais) {
          // Tudo zerado (não adiciona nada aos indisponíveis)
        } else {
          // Aplicar redução por ORDEM DE PRIORIDADE
          let reparadasRestantes = values.totalReparadas;
          let fibrasDep_liquido = values.fibrasDep;
          let depCutover_liquido = values.depCutover;
          let depLicenca_liquido = values.depLicenca;
          let depPassagem_liquido = values.depPassagem;
          let reconhecidas_liquido = values.reconhecidas;

          // 1. PRIORIDADE MÁXIMA: Dep. PSM
          if (reparadasRestantes > 0 && fibrasDep_liquido > 0) {
            const reduzir = Math.min(reparadasRestantes, fibrasDep_liquido);
            fibrasDep_liquido -= reduzir;
            reparadasRestantes -= reduzir;
          }

          // 2. Dep. Cutover
          if (reparadasRestantes > 0 && depCutover_liquido > 0) {
            const reduzir = Math.min(reparadasRestantes, depCutover_liquido);
            depCutover_liquido -= reduzir;
            reparadasRestantes -= reduzir;
          }

          // 3. Dep. Licença
          if (reparadasRestantes > 0 && depLicenca_liquido > 0) {
            const reduzir = Math.min(reparadasRestantes, depLicenca_liquido);
            depLicenca_liquido -= reduzir;
            reparadasRestantes -= reduzir;
          }

          // 4. Dep. Passagem
          if (reparadasRestantes > 0 && depPassagem_liquido > 0) {
            const reduzir = Math.min(reparadasRestantes, depPassagem_liquido);
            depPassagem_liquido -= reduzir;
            reparadasRestantes -= reduzir;
          }

          // 5. Reconhecidas
          if (reparadasRestantes > 0 && reconhecidas_liquido > 0) {
            const reduzir = Math.min(reparadasRestantes, reconhecidas_liquido);
            reconhecidas_liquido -= reduzir;
            reparadasRestantes -= reduzir;
          }

          // v3.40.80: Indisponíveis JÁ calculado acima (valores ORIGINAIS do Grupo 1)
          // Aqui só acumula Fibras Dep REDUZIDO
          weekStats.fibrasDep += fibrasDep_liquido; // Grupo 2 (reduzido)
        }
      });

      trends.push(weekStats);
    });

    // v3.40.79: Calcular Reparadas Global = SOMA TOTAL de todas reparadas até cada semana
    let somaTotal = 0;
    trends.forEach((weekData) => {
      somaTotal += weekData.totalReparadas; // Acumula as reparadas semanais
      weekData.reparadasGlobal = somaTotal; // Soma total
    });

    console.log(
      `✓ Evolução Temporal: ${trends.length} semanas até ${selectedWeek}`
    );

    return trends;
  }, [data, selectedOperator, selectedQuarter, selectedWeek, selectedProvince]);

  // Dados para o Gráfico de Pizza
  // ============================================================================
  // FASE 14: PIE CHART (DISTRIBUIÇÃO POR STATUS) DINÂMICO COM useMemo
  // ============================================================================

  /**
   * v3.13.23: Calcula percentagens DINÂMICAS para o gráfico de pizza
   * Baseado nos dados reais do quadrimestre selecionado
   * Recalcula quando data, selectedOperator ou selectedQuarter mudam
   */
  const pieChartData = useMemo(() => {
    // v3.13.25: Obter semanas do quadrimestre SELECIONADO
    const quarterWeeks = allWeeks.slice(
      quarterConfig[selectedQuarter].start - 1,
      quarterConfig[selectedQuarter].end
    );

    // v3.19.0 FASE 3: Filtrar rotas por província
    const routesToProcess =
      selectedProvince !== "Todas"
        ? routesByPSM[selectedOperator].filter(
            (route) => routeToProvince[route] === selectedProvince
          )
        : routesByPSM[selectedOperator];

    console.log("📊 DISTRIBUIÇÃO POR STATUS - Filtro Provincial:", {
      provincia: selectedProvince,
      totalRotasPSM: routesByPSM[selectedOperator].length,
      rotasFiltradas: routesToProcess.length,
    });

    // Acumuladores
    let totals = {
      transporte: 0,
      indisponiveis: 0,
      totalReparadas: 0,
      reconhecidas: 0,
      depPassagem: 0,
      depLicenca: 0,
      depCutover: 0,
      fibrasDep: 0,
    };

    // Para cada rota, calcular indisponíveis LÍQUIDOS (após reparações)
    routesToProcess.forEach((route) => {
      let ultimoTransporte = 0;
      let somaReparadas = 0; // Total Reparadas ACUMULA
      let ultimoReconhecidas = 0;
      let ultimoDepPassagem = 0;
      let ultimoDepLicenca = 0;
      let ultimoDepCutover = 0;
      let ultimoFibrasDep = 0;

      // Percorrer semanas do quadrimestre em ordem
      quarterWeeks.forEach((week) => {
        const routeData = data[selectedOperator]?.[week]?.[route];
        if (routeData) {
          // Pegar último valor diferente de zero
          const transVal = parseInt(routeData["Transporte"]) || 0;
          const reconhVal = parseInt(routeData["Reconhecidas"]) || 0;
          const depPassVal =
            parseInt(routeData["Dep. de Passagem de Cabo"]) || 0;
          const depLicVal = parseInt(routeData["Dep. de Licença"]) || 0;
          const depCutVal = parseInt(routeData["Dep. de Cutover"]) || 0;
          const fibrasVal =
            parseInt(routeData[`Fibras dependentes da ${selectedOperator}`]) ||
            0;

          if (transVal > 0) ultimoTransporte = transVal;
          if (reconhVal > 0) ultimoReconhecidas = reconhVal;
          if (depPassVal > 0) ultimoDepPassagem = depPassVal;
          if (depLicVal > 0) ultimoDepLicenca = depLicVal;
          if (depCutVal > 0) ultimoDepCutover = depCutVal;
          if (fibrasVal > 0) ultimoFibrasDep = fibrasVal;

          // Total Reparadas SEMPRE soma
          somaReparadas += parseInt(routeData["Total Reparadas"]) || 0;
        }
      });

      // LÓGICA CORRETA: Indisponíveis = soma das subcategorias
      const indisponiveisOriginais =
        ultimoReconhecidas +
        ultimoDepPassagem +
        ultimoDepLicenca +
        ultimoDepCutover +
        ultimoFibrasDep;

      // Se reparadas >= indisponíveis originais → ZERA TUDO (100% reparadas)
      if (somaReparadas >= indisponiveisOriginais) {
        // Tudo foi reparado: só conta reparadas
        totals.totalReparadas += somaReparadas;
        totals.indisponiveis += 0; // Zerado
        // Subcategorias zeradas (não adiciona nada)
      } else {
        // Ainda há indisponíveis: subtrair por ORDEM DE PRIORIDADE
        // PRIORIDADE: 1.Dep.PSM → 2.Dep.Cutover → 3.Dep.Licença → 4.Dep.Passagem → 5.Reconhecidas

        let reparadasRestantes = somaReparadas;
        let fibrasDep_liquido = ultimoFibrasDep;
        let depCutover_liquido = ultimoDepCutover;
        let depLicenca_liquido = ultimoDepLicenca;
        let depPassagem_liquido = ultimoDepPassagem;
        let reconhecidas_liquido = ultimoReconhecidas;

        // 1. PRIORIDADE MÁXIMA: Dep. PSM (FIBRASOL)
        if (reparadasRestantes > 0 && fibrasDep_liquido > 0) {
          const reduzir = Math.min(reparadasRestantes, fibrasDep_liquido);
          fibrasDep_liquido -= reduzir;
          reparadasRestantes -= reduzir;
        }

        // 2. Dep. Cutover
        if (reparadasRestantes > 0 && depCutover_liquido > 0) {
          const reduzir = Math.min(reparadasRestantes, depCutover_liquido);
          depCutover_liquido -= reduzir;
          reparadasRestantes -= reduzir;
        }

        // 3. Dep. Licença
        if (reparadasRestantes > 0 && depLicenca_liquido > 0) {
          const reduzir = Math.min(reparadasRestantes, depLicenca_liquido);
          depLicenca_liquido -= reduzir;
          reparadasRestantes -= reduzir;
        }

        // 4. Dep. Passagem
        if (reparadasRestantes > 0 && depPassagem_liquido > 0) {
          const reduzir = Math.min(reparadasRestantes, depPassagem_liquido);
          depPassagem_liquido -= reduzir;
          reparadasRestantes -= reduzir;
        }

        // 5. ÚLTIMA PRIORIDADE: Reconhecidas
        if (reparadasRestantes > 0 && reconhecidas_liquido > 0) {
          const reduzir = Math.min(reparadasRestantes, reconhecidas_liquido);
          reconhecidas_liquido -= reduzir;
          reparadasRestantes -= reduzir;
        }

        const indisponiveisLiquidos =
          fibrasDep_liquido +
          depCutover_liquido +
          depLicenca_liquido +
          depPassagem_liquido +
          reconhecidas_liquido;

        totals.totalReparadas += somaReparadas;
        totals.indisponiveis += indisponiveisLiquidos;
        totals.fibrasDep += fibrasDep_liquido;
        totals.depCutover += depCutover_liquido;
        totals.depLicenca += depLicenca_liquido;
        totals.depPassagem += depPassagem_liquido;
        totals.reconhecidas += reconhecidas_liquido;
      }

      totals.transporte += ultimoTransporte;
    });

    // Calcular total geral
    const totalGeral = Object.values(totals).reduce((sum, val) => sum + val, 0);

    // Se não houver dados, retornar estrutura hierárquica zerada
    if (totalGeral === 0) {
      return {
        outer: [
          {
            label: "Total Reparadas",
            percentage: 0,
            value: 0,
            color: "#22c55e",
          },
          { label: "Indisponíveis", percentage: 0, value: 0, color: "#ef4444" },
        ],
        inner: [
          { label: "Reconhecidas", percentage: 0, value: 0, color: "#06b6d4" },
          { label: "Dep. Passagem", percentage: 0, value: 0, color: "#3b82f6" },
          { label: "Dep. Licença", percentage: 0, value: 0, color: "#f97316" },
          { label: "Dep. Cutover", percentage: 0, value: 0, color: "#9333ea" },
          {
            label: `Dep. ${selectedOperator}`,
            percentage: 0,
            value: 0,
            color: "#64748b",
          },
        ],
      };
    }

    // FASE 1: Calcular percentagens para ANEL EXTERNO (Reparadas e Indisponíveis)
    const totalPrincipal = totals.totalReparadas + totals.indisponiveis;

    const outerData = [
      {
        label: "Total Reparadas",
        percentage: parseFloat(
          ((totals.totalReparadas / totalPrincipal) * 100).toFixed(1)
        ),
        value: totals.totalReparadas,
        color: "#22c55e", // Verde (era cor das reparadas)
      },
      {
        label: "Indisponíveis",
        percentage: parseFloat(
          ((totals.indisponiveis / totalPrincipal) * 100).toFixed(1)
        ),
        value: totals.indisponiveis,
        color: "#ef4444",
      },
    ];

    // FASE 1: Calcular percentagens para ANEL INTERNO (subcategorias de Indisponíveis, SEM Total Reparadas)
    const totalSubcategorias =
      totals.reconhecidas +
      totals.depPassagem +
      totals.depLicenca +
      totals.depCutover +
      totals.fibrasDep;

    const innerData =
      totalSubcategorias > 0
        ? [
            {
              label: "Reconhecidas",
              percentage: parseFloat(
                ((totals.reconhecidas / totalSubcategorias) * 100).toFixed(1)
              ),
              value: totals.reconhecidas,
              color: "#06b6d4",
            },
            {
              label: "Dep. Passagem",
              percentage: parseFloat(
                ((totals.depPassagem / totalSubcategorias) * 100).toFixed(1)
              ),
              value: totals.depPassagem,
              color: "#3b82f6",
            },
            {
              label: "Dep. Licença",
              percentage: parseFloat(
                ((totals.depLicenca / totalSubcategorias) * 100).toFixed(1)
              ),
              value: totals.depLicenca,
              color: "#f97316",
            },
            {
              label: "Dep. Cutover",
              percentage: parseFloat(
                ((totals.depCutover / totalSubcategorias) * 100).toFixed(1)
              ),
              value: totals.depCutover,
              color: "#9333ea",
            },
            {
              label: `Dep. ${selectedOperator}`,
              percentage: parseFloat(
                ((totals.fibrasDep / totalSubcategorias) * 100).toFixed(1)
              ),
              value: totals.fibrasDep,
              color: "#64748b",
            },
          ]
        : [];

    // FASE 1: Retornar estrutura hierárquica {outer, inner}
    return { outer: outerData, inner: innerData };
  }, [data, selectedOperator, selectedQuarter, selectedYear, selectedProvince]); // Recalcular quando mudar

  // ============================================================================

  // FASE 16: trendData agora é dinâmico (calculado via useMemo acima)

  // Dados para a Tabela de Introdução Manual
  const manualDataRows = [
    {
      rota: "Alto Dondo - Quiela",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "Ambriz - N'zeto",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "BSC Malange - Cazenga",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "Calunga - Mussureda",
      transporte: "",
      indisponiveis: 6,
      totalReparadas: 6,
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: 6,
    },
    {
      rota: "Camalamba - Lucala",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "Caxambua - Vila Matibie",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "Guango - Cafurifo",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "Guango - Camipala",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "Cuimba - Ngunhi",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "Damião - Uíge(Negage-CTR)",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
    {
      rota: "Hospital - Lumbo",
      transporte: "",
      indisponiveis: "",
      totalReparadas: "",
      reconhecidas: "",
      depPassagem: "",
      depLicenca: "",
      depCutover: "",
      fibrasDep: "",
    },
  ];

  // FASE 15: Arrays de classificação agora são dinâmicos (calculados via useMemo acima)
  // rotasDegradadasData, rotasComGanhoData, rotasEstaveisData

  // NOVO: Dados para Tabela de Acompanhamento Transporte vs Degradação (Página 4 do PDF)
  // Combina dados mock com justificativas importadas
  const acompanhamentoData = useMemo(() => {
    console.log(
      "📊 Justificativas disponíveis:",
      Object.keys(justificativas).length
    );

    // Converter justificativas importadas para formato da tabela
    const importedData = Object.entries(justificativas)
      .filter(([key, just]) => {
        // Filtrar por PSM e Quarter selecionados
        return (
          just.psm === selectedOperator && just.quarter === selectedQuarter
        );
      })
      .map(([key, just]) => {
        // Calcular delta com sinal correto
        const deltaValue = just.delta || 0;
        const deltaStr =
          deltaValue > 0
            ? `+${deltaValue}`
            : deltaValue === 0
            ? "0"
            : `${deltaValue}`;

        return {
          seccao: just.seccao,
          regiao: just.regiao || "",
          transporteQ2: just.transporte || 0,
          indisponiveis: just.indisponiveis || 0,
          deltaIndisponibilidade: deltaStr,
          justificativa: just.justificativa || "",
          origem: "importado",
        };
      });

    console.log("✅ Mostrando APENAS dados importados (sem mock)");

    return importedData;
  }, [justificativas, selectedOperator, selectedQuarter]);

  // Paginação do Acompanhamento
  const totalPagesAcomp = Math.ceil(
    acompanhamentoData.length / itemsPerPageAcomp
  );
  const startIndexAcomp = currentPageAcomp * itemsPerPageAcomp;
  const endIndexAcomp = startIndexAcomp + itemsPerPageAcomp;
  const currentDataAcomp = acompanhamentoData.slice(
    startIndexAcomp,
    endIndexAcomp
  );

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
  const totalPagesNormalizadas = Math.ceil(
    rotasNormalizadas.length / itemsPerPageNormalizadas
  );
  const startIndexNormalizadas =
    currentPageNormalizadas * itemsPerPageNormalizadas;
  const endIndexNormalizadas =
    startIndexNormalizadas + itemsPerPageNormalizadas;
  const currentDataNormalizadas = rotasNormalizadas.slice(
    startIndexNormalizadas,
    endIndexNormalizadas
  );

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
    const totalPagesIntervencoes = Math.ceil(
      intervencoesRecentes.length / itemsPerPageIntervencoes
    );
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
    const totalPagesSemIntervencao = Math.ceil(
      rotasSemIntervencao.length / itemsPerPageSemIntervencao
    );
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
  const createPieSlice = (
    startAngle,
    endAngle,
    radius = 100,
    innerRadius = 0
  ) => {
    const start = polarToCartesian(120, 120, radius, endAngle);
    const end = polarToCartesian(120, 120, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    if (innerRadius === 0) {
      return [
        "M",
        120,
        120,
        "L",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
        "Z",
      ].join(" ");
    }
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Mapeamento de cores por categoria
  const categoryColors = {
    transporte: "#1e293b",
    indisponiveis: "#ef4444",
    totalReparadas: "#22c55e",
    depPassagem: "#3b82f6",
    depLicenca: "#f97316",
    depCutover: "#a855f7",
    fibrasDep: "#64748b",
  };

  // ============================================================================
  // DEBUG: Informações da Estrutura de Dados (Fases 7-14)
  // ============================================================================

  console.log("📊 Total PSMs:", Object.keys(routesByPSM).length);

  console.log(
    "📊 Total Rotas:",
    Object.values(routesByPSM).reduce((acc, r) => acc + r.length, 0)
  );

  console.log("💾 Estado `data` keys:", Object.keys(data));

  console.log(
    "📝 Justificativas:",
    Object.keys(justificativas).length,
    "registros"
  );

  console.log("🔍 TESTE: Abra console (F12) e clique em uma rota do Top 5");

  console.log("✓ Lógica bidirecional (↑↓): ATIVO");

  console.log("✓ Acumulado progressivo (reparadasGlobal): ATIVO");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {showModal && selectedRota && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 py-3 flex justify-between items-center rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold">Detalhes da Rota Crítica</h2>
                <p className="text-sm mt-0.5">{selectedRota.name}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-3xl leading-none hover:bg-white/20 px-3 py-1 rounded"
              >
                ×
              </button>
            </div>

            <div className="p-5">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 mb-4 border-2 border-orange-200">
                <p className="text-sm font-bold text-orange-900">
                  PSM: {selectedOperator} | {selectedQuarter} ({selectedYear}) -
                  Últimos valores registrados
                </p>
              </div>

              <div className="grid grid-cols-8 gap-2 mb-4">
                {[
                  {
                    status: "Transporte",
                    label: (() => {
                      if (selectedQuarter === "Q1") {
                        return `Transporte Q3 (${parseInt(selectedYear) - 1})`;
                      } else if (selectedQuarter === "Q2") {
                        return `Transporte Q1`;
                      } else {
                        return `Transporte Q2`;
                      }
                    })(),
                    bg: "from-slate-700 to-slate-900",
                    icon: "🔄",
                  },
                  {
                    status: "Indisponíveis",
                    label: "Indisponíveis",
                    bg: "from-red-500 to-red-600",
                    icon: "🚫",
                  },
                  {
                    status: "Total Reparadas",
                    label: "Total Reparadas",
                    bg: "from-green-500 to-green-600",
                    icon: "✅",
                    highlight: true,
                  },
                  {
                    status: "Reconhecidas",
                    label: "Reconhecidas",
                    bg: "from-teal-500 to-teal-600",
                    icon: "🤝",
                  },
                  {
                    status: "Dep. de Passagem de Cabo",
                    label: "Dep. Passagem",
                    bg: "from-blue-500 to-blue-600",
                    icon: "🧵",
                  },
                  {
                    status: "Dep. de Licença",
                    label: "Dep. Licença",
                    bg: "from-orange-500 to-orange-600",
                    icon: "📄",
                  },
                  {
                    status: "Dep. de Cutover",
                    label: "Dep. Cutover",
                    bg: "from-purple-500 to-purple-600",
                    icon: "✂️",
                  },
                  {
                    status: "Fibras Dependentes",
                    label: `Fibras Dep. ${selectedOperator}`,
                    bg: "from-slate-600 to-slate-700",
                    icon: "⏳",
                  },
                ].map((item, idx) => {
                  const st = selectedRota.stats[item.status] || {
                    value: 0,
                    week: null,
                  };
                  const isReparadas = item.highlight;
                  return (
                    <div
                      key={idx}
                      className={`bg-gradient-to-br ${
                        item.bg
                      } rounded-lg p-2 text-white shadow-md ${
                        isReparadas ? "ring-2 ring-green-300 ring-offset-2" : ""
                      }`}
                    >
                      <div className="flex flex-col items-center text-center mb-1">
                        <span className="text-sm mb-0.5">{item.icon}</span>
                        <p className="text-[11px] font-semibold leading-tight">
                          {item.label}
                        </p>
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-2xl font-bold ${
                            isReparadas ? "text-green-100" : ""
                          }`}
                        >
                          {st.value}
                        </p>
                        {st.week && (
                          <p className="text-[7px] opacity-80 mt-0.5">
                            {st.week}
                          </p>
                        )}
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
                      {selectedRota.justification.justificativa || "Sem texto"}
                    </p>
                  </div>
                  <div className="grid grid-cols-5 gap-2.5">
                    {selectedRota.justification.regiao && (
                      <div className="bg-white rounded p-2 border border-gray-200">
                        <p className="text-[9px] text-gray-600 font-semibold mb-0.5">
                          Região
                        </p>
                        <p className="text-xs font-bold text-gray-900">
                          {selectedRota.justification.regiao}
                        </p>
                      </div>
                    )}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded p-2 border border-gray-200">
                      <p className="text-[9px] text-gray-600 font-semibold mb-0.5">
                        {selectedQuarter === "Q1"
                          ? `Transporte Q3 (${parseInt(selectedYear) - 1})`
                          : selectedQuarter === "Q2"
                          ? "Transporte Q1"
                          : "Transporte Q2"}
                      </p>
                      <p className="text-base font-bold text-gray-900">
                        {selectedRota.justification.transporteQ2 ||
                          selectedRota.justification.transporte ||
                          0}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded p-2 border border-red-200">
                      <p className="text-[9px] text-red-700 font-semibold mb-0.5">
                        Indisponíveis
                      </p>
                      <p className="text-base font-bold text-red-700">
                        {selectedRota.justification.indisponiveis || 0}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded p-2 border border-green-200 ring-2 ring-green-300">
                      <p className="text-[9px] text-green-700 font-semibold mb-0.5">
                        ✅ Reparadas
                      </p>
                      <p className="text-base font-bold text-green-700">
                        {selectedRota.stats["Total Reparadas"]?.value || 0}
                      </p>
                    </div>
                    <div
                      className={`bg-gradient-to-br rounded p-2 border ${
                        (selectedRota.justification.delta || 0) > 0
                          ? "from-red-50 to-red-100 border-red-200"
                          : (selectedRota.justification.delta || 0) < 0
                          ? "from-green-50 to-green-100 border-green-200"
                          : "from-gray-50 to-gray-100 border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-[9px] font-semibold mb-0.5 ${
                          (selectedRota.justification.delta || 0) > 0
                            ? "text-red-700"
                            : (selectedRota.justification.delta || 0) < 0
                            ? "text-green-700"
                            : "text-gray-600"
                        }`}
                      >
                        Delta Δ
                      </p>
                      <p
                        className={`text-base font-bold ${
                          (selectedRota.justification.delta || 0) > 0
                            ? "text-red-700"
                            : (selectedRota.justification.delta || 0) < 0
                            ? "text-green-700"
                            : "text-gray-900"
                        }`}
                      >
                        {(selectedRota.justification.delta || 0) > 0 ? "+" : ""}
                        {selectedRota.justification.delta || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-xl p-6 border-2 border-dashed border-blue-300 text-center">
                  <p className="text-base text-blue-800 font-medium">
                    ℹ️ Nenhuma justificativa registrada para esta rota no
                    trimestre {selectedQuarter}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DRILL-DOWN: Detalhamento por Status - COM CARROSSEL */}
      {showStatusDrilldown &&
        selectedStatusDrilldown &&
        (() => {
          // Calcular paginação (16 rotas por página = 4 linhas × 4 colunas)
          const totalPages = Math.ceil(
            selectedStatusDrilldown.rotas.length / itemsPerPageDrilldown
          );
          const startIdx = currentPageDrilldown * itemsPerPageDrilldown;
          const endIdx = startIdx + itemsPerPageDrilldown;
          const currentRotas = selectedStatusDrilldown.rotas.slice(
            startIdx,
            endIdx
          );

          const goToNextPage = () => {
            if (currentPageDrilldown < totalPages - 1) {
              setCurrentPageDrilldown(currentPageDrilldown + 1);
            }
          };

          const goToPrevPage = () => {
            if (currentPageDrilldown > 0) {
              setCurrentPageDrilldown(currentPageDrilldown - 1);
            }
          };

          return (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8"
              onClick={() => setShowStatusDrilldown(false)}
            >
              <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[50vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 flex justify-between items-center flex-shrink-0">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold truncate">
                      📊 {selectedStatusDrilldown.label}
                    </h2>
                    <p className="text-[10px] text-blue-100 truncate">
                      {selectedOperator} • {selectedQuarter} • Total:{" "}
                      {selectedStatusDrilldown.total} • Página{" "}
                      {currentPageDrilldown + 1}/{totalPages}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStatusDrilldown(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 ml-2 transition-colors flex-shrink-0"
                  >
                    <span className="text-2xl leading-none">×</span>
                  </button>
                </div>

                {/* Conteúdo - GRID 4 COLUNAS × 4 LINHAS = 16 rotas */}
                <div className="flex-1 overflow-hidden p-2 flex items-center">
                  {currentRotas.length > 0 ? (
                    <div className="w-full grid grid-cols-4 gap-2">
                      {currentRotas.map((rota, idx) => {
                        const percentage = (
                          (rota.valor / selectedStatusDrilldown.total) *
                          100
                        ).toFixed(1);
                        return (
                          <div
                            key={idx}
                            className="bg-gray-50 rounded px-2 py-1.5 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer flex flex-col h-full"
                            onClick={() => {
                              setShowStatusDrilldown(false);
                              handleRotaClick(rota.rota);
                            }}
                          >
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-[10px] font-medium text-gray-800 truncate leading-tight"
                                  title={rota.rota}
                                >
                                  {rota.rota}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-sm font-bold text-blue-600">
                                  {rota.valor}
                                </p>
                              </div>
                            </div>

                            <p className="text-[8px] text-gray-500 leading-tight mb-1">
                              {rota.semana} • {percentage}%
                            </p>

                            {/* Barra de progresso */}
                            <div className="bg-gray-200 rounded-full h-1 overflow-hidden mt-auto">
                              <div
                                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 w-full">
                      <p className="text-xs">Nenhuma rota nesta página</p>
                    </div>
                  )}
                </div>

                {/* Footer com navegação de carrossel */}
                <div className="border-t border-gray-200 px-3 py-2 bg-gray-50 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600">
                      {selectedStatusDrilldown.rotas.length} rotas • Mostrando{" "}
                      {startIdx + 1}-
                      {Math.min(endIdx, selectedStatusDrilldown.rotas.length)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botão Anterior */}
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPageDrilldown === 0}
                      className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-1 ${
                        currentPageDrilldown === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      <span>←</span> Anterior
                    </button>

                    {/* Indicador de página */}
                    <span className="text-xs text-gray-600 font-medium px-2">
                      {currentPageDrilldown + 1} / {totalPages}
                    </span>

                    {/* Botão Próximo */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPageDrilldown >= totalPages - 1}
                      className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-1 ${
                        currentPageDrilldown >= totalPages - 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Próximo <span>→</span>
                    </button>

                    {/* Botão Fechar */}
                    <button
                      onClick={() => setShowStatusDrilldown(false)}
                      className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors ml-2"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Menu Lateral */}
      <div
        className={`${
          menuOpen ? "w-64" : "w-0"
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <div className="p-4">
          <nav className="space-y-1">
            <button
              onClick={handleDownloadCSV}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors border-2 border-blue-500"
            >
              <Download className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                💾 Salvar Dados PSM (CSV)
              </span>
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
              <span className="text-sm font-medium text-yellow-600">
                📥 Importar Justificativas
              </span>
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
              <span className="text-sm font-medium">
                Exportar Justificativas
              </span>
            </button>
            <div className="py-2">
              <div className="border-t border-gray-200"></div>
              <p className="text-xs font-semibold text-gray-400 mt-3 mb-2 px-4">
                RECURSOS FUTUROS
              </p>
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
              <p className="text-xs font-semibold text-gray-400 mt-3 mb-2 px-4">
                RECURSOS FUTUROS
              </p>
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span className="text-sm font-medium">
                Transferir Responsabilidade
              </span>
            </button>

            <button
              disabled
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed opacity-60"
              title="Funcionalidade em desenvolvimento - Projeção de custos de manutenção"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm font-medium">Previsão de Custos</span>
            </button>

            <div className="py-2">
              <div className="border-t border-gray-200"></div>
              <p className="text-xs font-semibold text-gray-500 mt-3 mb-2 px-4">
                DEBUG
              </p>
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
          className={`sticky top-0 z-50 bg-white shadow-md transition-all duration-300 ${
            headerVisible ? "translate-y-0" : "-translate-y-[60px]"
          }`}
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
                  <h1 className="text-2xl font-bold text-gray-800">
                    Performance Clean Up Advanced
                  </h1>
                  <p className="text-xs text-gray-500">
                    v3.40.9 - Scroll Inteligente UNIFICADO! ✅🎯
                  </p>
                </div>
              </div>
              {/* Indicador de Salvamento */}
              <div className="flex items-center space-x-3">
                {saveStatus === "saving" && (
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-blue-700">
                      Salvando...
                    </span>
                  </div>
                )}
                {saveStatus === "saved" && (
                  <div className="flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 animate-fade-in">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">
                      Dados salvos
                    </span>
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="flex items-center space-x-2 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-medium text-red-700">
                      Erro ao salvar
                    </span>
                  </div>
                )}
                {lastSaveTime && saveStatus === "" && (
                  <div className="text-xs text-gray-500">
                    Último salvamento:{" "}
                    {lastSaveTime.toLocaleTimeString("pt-BR")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FILTROS E CARDS DE RESUMO */}
          <div className="border-b border-gray-200 px-5 py-2.5">
            <div className="flex items-center justify-between mb-4">
              {/* Filtros */}
              <div className="flex items-center space-x-3">
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
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
                  {operatorToProvinces[selectedOperator].map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {getWeeksForQuarter(selectedQuarter).map((week) => (
                    <option key={week} value={week}>
                      {week}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Q3">Q3</option>
                  <option value="Q2">Q2</option>
                  <option value="Q1">Q1</option>
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
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

              {/* v3.42.00: BOTÃO TESTES E ANÁLISES */}
              <button
                onClick={() => setShowTestesAnalises(!showTestesAnalises)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  showTestesAnalises
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
                }`}
                title="Abrir painel de Testes e Análises"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Testes e Análises</span>
                {showTestesAnalises && (
                  <span className="ml-1 text-xs opacity-75">(aberto)</span>
                )}
              </button>

              {/* v3.40.27: SINO DE ALERTAS */}
              <div className="relative">
                <button
                  onClick={() => setAlertasAbertos(!alertasAbertos)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={`${
                    alertas.filter((a) => !alertasLidos.includes(a.id)).length
                  } alertas`}
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
                  {alertas.filter((a) => !alertasLidos.includes(a.id)).length >
                    0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {
                        alertas.filter((a) => !alertasLidos.includes(a.id))
                          .length
                      }
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
                          🔔 Alertas (
                          {
                            alertas.filter((a) => !alertasLidos.includes(a.id))
                              .length
                          }{" "}
                          não lidos)
                        </h3>
                        <button
                          onClick={() => {
                            setAlertasLidos(alertas.map((a) => a.id));
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
                                !isLido ? "bg-blue-50/50" : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {/* Ícone de info */}
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-5 h-5 text-blue-600"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </div>
                                </div>

                                {/* Conteúdo */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-blue-600 uppercase">
                                      Inconsistência de Dados
                                    </span>
                                    {!isLido && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-gray-800 mb-1">
                                    {alerta.rota}
                                  </p>
                                  <p className="text-xs text-gray-600 mb-2">
                                    Reparadas Acumulado (
                                    {alerta.reparadasAcumulado}) {">"}{" "}
                                    Indisponíveis ({alerta.indisponiveis}) em{" "}
                                    {alerta.semanaDeteccao}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      {alerta.provincia} • Diferença: +
                                      {alerta.diferenca}
                                    </span>
                                    <button
                                      onClick={() => {
                                        if (!isLido) {
                                          setAlertasLidos([
                                            ...alertasLidos,
                                            alerta.id,
                                          ]);
                                        }
                                      }}
                                      className="text-xs text-blue-600 hover:text-blue-800"
                                    >
                                      {isLido ? "✓ Lido" : "Marcar como lido"}
                                    </button>
                                  </div>
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
                          Total: {alertas.length} alerta
                          {alertas.length !== 1 ? "s" : ""} detectado
                          {alertas.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cards de Resumo Superiores - COMPACTOS EM UMA LINHA (8 cards) */}
            <div className="grid grid-cols-8 gap-2">
              {summaryCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.bgColor} text-white rounded-lg p-2 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200`}
                  onClick={() => handleStatusClick(card.label)}
                  title={`Clique para ver detalhes de ${card.label}`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-medium opacity-90 leading-tight">
                      {card.label}
                    </span>
                    <div className="w-3 h-3">{card.icon}</div>
                  </div>
                  <div className="flex items-end space-x-1">
                    <span className="text-xl font-bold leading-none">
                      {card.value}
                    </span>
                    {card.total && (
                      <span className="text-[10px] opacity-75 mb-0.5">
                        de {card.total}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>{" "}
        {/* Fim do div HEADER + FILTROS UNIFICADOS */}
        {/* v3.42.00: PAINEL TESTES E ANÁLISES */}
        {showTestesAnalises && (
          <div className="px-5 py-3">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg border-2 border-blue-200 relative">
              {/* Botão Fechar (X) */}
              <button
                onClick={() => setShowTestesAnalises(false)}
                className="absolute top-3 right-3 w-8 h-8 bg-white hover:bg-red-50 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                title="Fechar painel"
              >
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header do Painel */}
              <div className="py-4 px-4 border-b-2 border-blue-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-blue-900">
                      Testes e Análises - {selectedOperator}
                    </h2>
                    <p className="text-sm text-blue-700">
                      {selectedQuarter} {selectedYear} •{" "}
                      {routesByPSM[selectedOperator]?.length || 0} rotas
                      cadastradas
                    </p>
                  </div>
                </div>
              </div>

              {/* Conteúdo do Painel */}
              <div className="p-6">
                {/* v3.49.07: PRIMEIRA LINHA - Resumo de Rotas e Status Técnico */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* COLUNA 1: Resumo de Rotas */}
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      📊 Resumo de Rotas
                    </h3>

                    {/* v3.49.06: Estatísticas em Cards (sem gráfico, sem percentagens) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">
                            Rotas Cadastradas
                          </span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                          {testesData.cadastradas}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">
                            Rotas Testadas
                          </span>
                        </div>
                        <span className="text-xl font-bold text-yellow-600">
                          {testesData.testadas}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">
                            Rotas Validadas
                          </span>
                        </div>
                        <span className="text-xl font-bold text-green-600">
                          {testesData.semIndisponibilidade}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">
                            Pendentes
                          </span>
                        </div>
                        <span className="text-xl font-bold text-red-600">
                          {testesData.pendentes}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">
                            Não Testadas
                          </span>
                        </div>
                        <span className="text-xl font-bold text-gray-600">
                          {testesData.naoTestadas}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* COLUNA 2: Status Técnico das Rotas */}
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      🔧 Status Técnico das Rotas
                    </h3>
                    <p className="text-xs text-gray-500 text-center mb-4">
                      Baseado em Transporte vs Indisponíveis
                    </p>

                    <div className="space-y-3">
                      {/* 1. SEM INDISPONIBILIDADE (zeradas) */}
                      <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">✅</span>
                            <span className="text-sm font-medium text-gray-700">
                              Sem Indisponibilidade
                            </span>
                          </div>
                          <span className="text-lg font-bold text-green-600">
                            {testesData.semIndisponibilidadeTecnica || 0}
                          </span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                testesData.testadas > 0
                                  ? ((testesData.semIndisponibilidadeTecnica ||
                                      0) /
                                      testesData.testadas) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-green-700 mt-1">
                          {testesData.testadas > 0
                            ? (
                                ((testesData.semIndisponibilidadeTecnica || 0) /
                                  testesData.testadas) *
                                100
                              ).toFixed(1)
                            : 0}
                          % das testadas • Indisponíveis = 0
                        </div>
                      </div>

                      {/* 2. COM GANHO (melhorando) */}
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📈</span>
                            <span className="text-sm font-medium text-gray-700">
                              Com Ganho (Melhorando)
                            </span>
                          </div>
                          <span className="text-lg font-bold text-blue-600">
                            {testesData.comGanho || 0}
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                testesData.testadas > 0
                                  ? ((testesData.comGanho || 0) /
                                      testesData.testadas) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          {testesData.testadas > 0
                            ? (
                                ((testesData.comGanho || 0) /
                                  testesData.testadas) *
                                100
                              ).toFixed(1)
                            : 0}
                          % das testadas • Reduzindo indisponíveis
                        </div>
                      </div>

                      {/* 3. ESTÁVEIS */}
                      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">⚖️</span>
                            <span className="text-sm font-medium text-gray-700">
                              Rotas Estáveis
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-600">
                            {testesData.estaveis || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                testesData.testadas > 0
                                  ? ((testesData.estaveis || 0) /
                                      testesData.testadas) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-700 mt-1">
                          {testesData.testadas > 0
                            ? (
                                ((testesData.estaveis || 0) /
                                  testesData.testadas) *
                                100
                              ).toFixed(1)
                            : 0}
                          % das testadas • Sem variação
                        </div>
                      </div>

                      {/* 4. DEGRADADAS (piorando) - NOVO! */}
                      <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">📉</span>
                            <span className="text-sm font-medium text-gray-700">
                              Rotas Degradadas (Piorando)
                            </span>
                          </div>
                          <span className="text-lg font-bold text-red-600">
                            {testesData.degradadas || 0}
                          </span>
                        </div>
                        <div className="w-full bg-red-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                testesData.testadas > 0
                                  ? ((testesData.degradadas || 0) /
                                      testesData.testadas) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-red-700 mt-1">
                          {testesData.testadas > 0
                            ? (
                                ((testesData.degradadas || 0) /
                                  testesData.testadas) *
                                100
                              ).toFixed(1)
                            : 0}
                          % das testadas • Aumentando indisponíveis ⚠️
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* v3.49.06: TERCEIRA LINHA - Gráficos de Barras (LADO A LADO SEMPRE) */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Gráfico 1: Comparação de Status */}
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      🔄 Comparação de Status
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          label: "Rotas Cadastradas",
                          value: testesData.cadastradas,
                          max: testesData.cadastradas,
                          color: "bg-blue-500",
                          bgColor: "bg-blue-100",
                        },
                        {
                          label: "Rotas Testadas",
                          value: testesData.testadas,
                          max: testesData.cadastradas,
                          color: "bg-cyan-500",
                          bgColor: "bg-cyan-100",
                        },
                        {
                          label: "Rotas Validadas",
                          value: testesData.semIndisponibilidade,
                          max: testesData.cadastradas,
                          color: "bg-green-500",
                          bgColor: "bg-green-100",
                        },
                        {
                          label: "Rotas Pendentes",
                          value: testesData.pendentes,
                          max: testesData.cadastradas,
                          color: "bg-orange-500",
                          bgColor: "bg-orange-100",
                        },
                        {
                          label: "Não Testadas",
                          value: testesData.naoTestadas,
                          max: testesData.cadastradas,
                          color: "bg-gray-500",
                          bgColor: "bg-gray-100",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-32 text-sm font-medium text-gray-700">
                            {item.label}
                          </div>
                          <div className="flex-1">
                            <div
                              className={`w-full ${item.bgColor} rounded-full h-8 relative`}
                            >
                              <div
                                className={`${item.color} h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{
                                  width: `${
                                    item.max > 0
                                      ? (item.value / item.max) * 100
                                      : 0
                                  }%`,
                                }}
                              >
                                <span className="text-xs font-bold text-white">
                                  {item.value}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="w-16 text-sm font-bold text-gray-700 text-right">
                            {item.max > 0
                              ? ((item.value / item.max) * 100).toFixed(0)
                              : 0}
                            %
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Legenda */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-600 text-center">
                        Base de cálculo: {testesData.cadastradas} rotas
                        cadastradas
                      </div>
                    </div>
                  </div>

                  {/* Gráfico 2: Performance Detalhada */}
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                      📈 Performance Detalhada
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          label: "Taxa de Testes",
                          value:
                            testesData.cadastradas > 0
                              ? (testesData.testadas / testesData.cadastradas) *
                                100
                              : 0,
                          color: "bg-blue-500",
                          bgColor: "bg-blue-100",
                          icon: "🧪",
                        },
                        {
                          label: "Taxa de Validação",
                          value:
                            testesData.testadas > 0
                              ? (testesData.semIndisponibilidade /
                                  testesData.testadas) *
                                100
                              : 0,
                          color: "bg-green-500",
                          bgColor: "bg-green-100",
                          icon: "✅",
                        },
                        {
                          label: "Taxa de Conclusão",
                          value:
                            testesData.testadas > 0
                              ? (testesData.concluidas / testesData.testadas) *
                                100
                              : 0,
                          color: "bg-purple-500",
                          bgColor: "bg-purple-100",
                          icon: "🎯",
                        },
                        {
                          label: "Taxa de Melhoria",
                          value:
                            testesData.testadas > 0
                              ? (testesData.comGanho / testesData.testadas) *
                                100
                              : 0,
                          color: "bg-orange-500",
                          bgColor: "bg-orange-100",
                          icon: "📈",
                        },
                        {
                          label: "Taxa de Estabilidade",
                          value:
                            testesData.testadas > 0
                              ? (testesData.estaveis / testesData.testadas) *
                                100
                              : 0,
                          color: "bg-cyan-500",
                          bgColor: "bg-cyan-100",
                          icon: "⚖️",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <div className="w-6 text-center">{item.icon}</div>
                          <div className="w-36 text-sm font-medium text-gray-700">
                            {item.label}
                          </div>
                          <div className="flex-1">
                            <div
                              className={`w-full ${item.bgColor} rounded-full h-8 relative`}
                            >
                              <div
                                className={`${item.color} h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                style={{
                                  width: `${Math.min(item.value, 100)}%`,
                                }}
                              >
                                <span className="text-xs font-bold text-white">
                                  {item.value.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Indicador de Excelência */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <div className="text-sm font-bold text-gray-800">
                              Índice de Excelência
                            </div>
                            <div className="text-xs text-gray-600">
                              Média ponderada de performance
                            </div>
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-amber-600">
                          {testesData.testadas > 0
                            ? (
                                ((testesData.semIndisponibilidade /
                                  testesData.testadas) *
                                  0.3 +
                                  (testesData.concluidas /
                                    testesData.testadas) *
                                    0.25 +
                                  (testesData.comGanho / testesData.testadas) *
                                    0.25 +
                                  (testesData.estaveis / testesData.testadas) *
                                    0.2) *
                                100
                              ).toFixed(0)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* v3.42.03: COMPARAÇÃO ENTRE PSMs */}
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-purple-900">
                          Comparação entre PSMs
                        </h3>
                        <p className="text-sm text-purple-700">
                          {selectedQuarter} {selectedYear}
                        </p>
                      </div>
                    </div>

                    {/* Botão Exportar */}
                    <button
                      onClick={() => {
                        // Preparar dados para exportação
                        const relatorio = `RELATÓRIO DE TESTES E ANÁLISES
════════════════════════════════════════════════════════════
Período: ${selectedQuarter} ${selectedYear}
Data: ${new Date().toLocaleString("pt-BR")}

PSM ATUAL: ${selectedOperator}
════════════════════════════════════════════════════════════
Rotas Cadastradas: ${testesData.cadastradas}
Rotas Testadas: ${testesData.testadas} (${
                          testesData.cadastradas > 0
                            ? (
                                (testesData.testadas / testesData.cadastradas) *
                                100
                              ).toFixed(1)
                            : 0
                        }%)
Rotas Validadas: ${testesData.semIndisponibilidade} (${
                          testesData.testadas > 0
                            ? (
                                (testesData.semIndisponibilidade /
                                  testesData.testadas) *
                                100
                              ).toFixed(1)
                            : 0
                        }%)
Rotas Pendentes: ${testesData.pendentes}

PERFORMANCE:
- Taxa de Testes: ${
                          testesData.cadastradas > 0
                            ? (
                                (testesData.testadas / testesData.cadastradas) *
                                100
                              ).toFixed(1)
                            : 0
                        }%
- Taxa de Validação: ${
                          testesData.testadas > 0
                            ? (
                                (testesData.semIndisponibilidade /
                                  testesData.testadas) *
                                100
                              ).toFixed(1)
                            : 0
                        }%
- Taxa de Conclusão: ${
                          testesData.testadas > 0
                            ? (
                                (testesData.concluidas / testesData.testadas) *
                                100
                              ).toFixed(1)
                            : 0
                        }%
- Taxa de Melhoria: ${
                          testesData.testadas > 0
                            ? (
                                (testesData.comGanho / testesData.testadas) *
                                100
                              ).toFixed(1)
                            : 0
                        }%
- Índice de Excelência: ${
                          testesData.testadas > 0
                            ? (
                                ((testesData.semIndisponibilidade /
                                  testesData.testadas) *
                                  0.3 +
                                  (testesData.concluidas /
                                    testesData.testadas) *
                                    0.25 +
                                  (testesData.comGanho / testesData.testadas) *
                                    0.25 +
                                  (testesData.estaveis / testesData.testadas) *
                                    0.2) *
                                100
                              ).toFixed(1)
                            : 0
                        }%

COMPARAÇÃO ENTRE TODOS OS PSMs:
════════════════════════════════════════════════════════════
${Object.keys(todosTestesData)
  .filter((psm) => todosTestesData[psm])
  .map((psm) => {
    const dados = todosTestesData[psm];
    return `
${psm}:
- Cadastradas: ${dados.cadastradas} | Testadas: ${
      dados.testadas
    } | Pendentes: ${dados.pendentes}
- Taxa Testes: ${dados.taxaTestes.toFixed(1)}%
- Taxa Validação: ${dados.taxaValidacao.toFixed(1)}%
- Índice Excelência: ${dados.indiceExcelencia.toFixed(1)}%
`;
  })
  .join("")}

════════════════════════════════════════════════════════════
Gerado por: PSM Monitor v3.42.03
════════════════════════════════════════════════════════════`;

                        // Criar arquivo e baixar
                        const blob = new Blob([relatorio], {
                          type: "text/plain",
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `Testes_Analises_${selectedOperator}_${selectedQuarter}_${selectedYear}_${new Date().getTime()}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);

                        console.log("📄 Relatório exportado!");
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>Exportar Relatório</span>
                    </button>
                  </div>

                  {/* Tabela de Comparação */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-purple-100 border-b-2 border-purple-300">
                          <th className="text-left p-3 font-bold text-purple-900">
                            Métrica
                          </th>
                          {Object.keys(todosTestesData).map((psm) => (
                            <th
                              key={psm}
                              className={`text-center p-3 font-bold ${
                                psm === selectedOperator
                                  ? "bg-purple-200 text-purple-900"
                                  : "text-purple-800"
                              }`}
                            >
                              {psm}
                              {psm === selectedOperator && (
                                <span className="ml-1 text-xs">✓</span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          {
                            label: "Rotas Cadastradas",
                            key: "cadastradas",
                            format: (v) => v,
                          },
                          {
                            label: "Rotas Testadas",
                            key: "testadas",
                            format: (v) => v,
                          },
                          {
                            label: "Rotas Validadas",
                            key: "semIndisponibilidade",
                            format: (v) => v,
                          },
                          {
                            label: "Rotas Pendentes",
                            key: "pendentes",
                            format: (v) => v,
                          },
                          {
                            label: "Taxa de Testes",
                            key: "taxaTestes",
                            format: (v) => `${v.toFixed(1)}%`,
                            isPercentage: true,
                          },
                          {
                            label: "Taxa de Validação",
                            key: "taxaValidacao",
                            format: (v) => `${v.toFixed(1)}%`,
                            isPercentage: true,
                          },
                          {
                            label: "Taxa de Conclusão",
                            key: "taxaConclusao",
                            format: (v) => `${v.toFixed(1)}%`,
                            isPercentage: true,
                          },
                          {
                            label: "Taxa de Melhoria",
                            key: "taxaMelhoria",
                            format: (v) => `${v.toFixed(1)}%`,
                            isPercentage: true,
                          },
                          {
                            label: "Índice de Excelência",
                            key: "indiceExcelencia",
                            format: (v) => `${v.toFixed(1)}%`,
                            isPercentage: true,
                            highlight: true,
                          },
                        ].map((metrica, idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-purple-100 hover:bg-purple-50 ${
                              metrica.highlight ? "bg-amber-50 font-bold" : ""
                            }`}
                          >
                            <td className="p-3 text-gray-700">
                              {metrica.highlight && (
                                <span className="mr-2">🏆</span>
                              )}
                              {metrica.label}
                            </td>
                            {Object.keys(todosTestesData).map((psm) => {
                              const dados = todosTestesData[psm];
                              if (!dados)
                                return (
                                  <td
                                    key={psm}
                                    className="text-center p-3 text-gray-400"
                                  >
                                    -
                                  </td>
                                );

                              const valor = dados[metrica.key];
                              const melhor =
                                metrica.isPercentage &&
                                Math.max(
                                  ...Object.values(todosTestesData)
                                    .filter((d) => d)
                                    .map((d) => d[metrica.key])
                                );
                              const isMelhor =
                                metrica.isPercentage &&
                                valor === melhor &&
                                valor > 0;

                              return (
                                <td
                                  key={psm}
                                  className={`text-center p-3 ${
                                    psm === selectedOperator
                                      ? "bg-purple-50"
                                      : ""
                                  }`}
                                >
                                  <span
                                    className={`${
                                      isMelhor
                                        ? "text-green-600 font-bold"
                                        : metrica.highlight
                                        ? "text-amber-600"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {metrica.format(valor)}
                                    {isMelhor && (
                                      <span className="ml-1">👑</span>
                                    )}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Legenda */}
                  <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-purple-200 rounded"></div>
                      <span>PSM Selecionado</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>👑</span>
                      <span>Melhor Performance</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>🏆</span>
                      <span>Índice Global</span>
                    </div>
                  </div>
                </div>

                {/* v3.42.02: RESUMO EXECUTIVO */}
                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-2 border-indigo-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-indigo-900 mb-2">
                        Resumo Executivo
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 mb-1">Status Geral</div>
                          <div className="font-bold text-lg">
                            {testesData.pendentes === 0 ? (
                              <span className="text-green-600">
                                ✅ Completo
                              </span>
                            ) : testesData.testadas === 0 ? (
                              <span className="text-red-600">
                                ⏳ Não Iniciado
                              </span>
                            ) : (
                              <span className="text-blue-600">
                                🔄 Em Progresso
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 mb-1">Próxima Ação</div>
                          <div className="font-bold text-lg text-orange-600">
                            {testesData.pendentes > 0 ? (
                              <span>Testar {testesData.pendentes} rotas</span>
                            ) : testesData.comIndisponibilidades > 0 ? (
                              <span>
                                Resolver {testesData.comIndisponibilidades}{" "}
                                rotas
                              </span>
                            ) : (
                              <span>✅ Nenhuma</span>
                            )}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 mb-1">Período</div>
                          <div className="font-bold text-lg text-gray-800">
                            {selectedQuarter} {selectedYear}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* v3.43.00: TABELA DE VALIDAÇÃO DE ROTAS */}
                <div className="mt-6 bg-white rounded-lg shadow-md border-2 border-green-200">
                  {/* Header da Tabela - Clicável para expandir/colapsar */}
                  <div
                    className="p-4 cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-between"
                    onClick={() =>
                      setTabelaValidacaoAberta(!tabelaValidacaoAberta)
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-green-900">
                          Tabela de Validação de Rotas
                        </h3>
                        <p className="text-sm text-green-700">
                          {testesData.cadastradas} rotas cadastradas •{" "}
                          {testesData.testadas} testadas •{" "}
                          {testesData.semIndisponibilidade} validadas
                        </p>
                      </div>
                    </div>

                    {/* Ícone expandir/colapsar */}
                    <svg
                      className={`w-6 h-6 text-green-600 transition-transform duration-200 ${
                        tabelaValidacaoAberta ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {/* Conteúdo da Tabela - Expansível */}
                  {tabelaValidacaoAberta && (
                    <div className="p-4 border-t-2 border-green-200">
                      {/* Ações em Massa */}
                      <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold">
                            {routesByPSM[selectedOperator]?.length || 0}
                          </span>{" "}
                          rotas do PSM{" "}
                          <span className="font-bold text-green-700">
                            {selectedOperator}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const novasTestadas = { ...rotasTestadas };
                              if (!novasTestadas[selectedOperator])
                                novasTestadas[selectedOperator] = {};
                              if (
                                !novasTestadas[selectedOperator][selectedWeek]
                              )
                                novasTestadas[selectedOperator][selectedWeek] =
                                  {};

                              routesByPSM[selectedOperator]?.forEach((rota) => {
                                novasTestadas[selectedOperator][selectedWeek][
                                  rota
                                ] = {
                                  testada: true,
                                };
                              });
                              setRotasTestadas(novasTestadas);
                              console.log(
                                "✅ Todas as rotas marcadas como testadas em",
                                selectedWeek
                              );
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            ✓ Marcar Todas Testadas ({selectedWeek})
                          </button>
                          <button
                            onClick={() => {
                              const novasValidadas = { ...rotasValidadas };
                              if (!novasValidadas[selectedOperator])
                                novasValidadas[selectedOperator] = {};
                              if (
                                !novasValidadas[selectedOperator][selectedWeek]
                              )
                                novasValidadas[selectedOperator][selectedWeek] =
                                  {};

                              routesByPSM[selectedOperator]?.forEach((rota) => {
                                // Só validar se estiver testada NESTA semana
                                if (
                                  isRotaTestada(
                                    selectedOperator,
                                    selectedWeek,
                                    rota
                                  )
                                ) {
                                  novasValidadas[selectedOperator][
                                    selectedWeek
                                  ][rota] = {
                                    validada: true,
                                  };
                                }
                              });
                              setRotasValidadas(novasValidadas);
                              console.log(
                                "✅ Todas as rotas testadas em",
                                selectedWeek,
                                "marcadas como validadas"
                              );
                            }}
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                          >
                            ✓ Validar Todas Testadas ({selectedWeek})
                          </button>
                          <button
                            onClick={() => {
                              // v3.48.02: FIX - Limpar semana com deep clone
                              if (
                                !confirm(
                                  `⚠️ Tem certeza que deseja limpar TODAS as validações da semana ${selectedWeek}?\n\nEsta ação não pode ser desfeita.`
                                )
                              ) {
                                return;
                              }

                              // Deep clone para forçar re-render
                              const novasTestadas = JSON.parse(
                                JSON.stringify(rotasTestadas)
                              );
                              const novasValidadas = JSON.parse(
                                JSON.stringify(rotasValidadas)
                              );

                              // Limpar APENAS esta semana
                              if (
                                novasTestadas[selectedOperator]?.[selectedWeek]
                              ) {
                                delete novasTestadas[selectedOperator][
                                  selectedWeek
                                ];
                                console.log(
                                  `🗑️ Testadas da semana ${selectedWeek} deletadas`
                                );
                              }
                              if (
                                novasValidadas[selectedOperator]?.[selectedWeek]
                              ) {
                                delete novasValidadas[selectedOperator][
                                  selectedWeek
                                ];
                                console.log(
                                  `🗑️ Validadas da semana ${selectedWeek} deletadas`
                                );
                              }

                              setRotasTestadas(novasTestadas);
                              setRotasValidadas(novasValidadas);
                              console.log(
                                `✅ Validações da semana ${selectedWeek} limpas com sucesso`
                              );
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            ✗ Limpar Semana ({selectedWeek})
                          </button>
                        </div>
                      </div>

                      {/* Tabela de Rotas */}
                      <div className="overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                          <thead className="bg-green-100 sticky top-0">
                            <tr>
                              <th className="text-left p-3 font-bold text-green-900 w-12">
                                #
                              </th>
                              <th className="text-left p-3 font-bold text-green-900">
                                Rota
                              </th>
                              <th className="text-center p-3 font-bold text-blue-900 w-24">
                                🧪 Testada
                              </th>
                              <th className="text-center p-3 font-bold text-blue-700 w-24">
                                Semana
                              </th>
                              <th className="text-center p-3 font-bold text-green-900 w-24">
                                ✅ Validada
                              </th>
                              <th className="text-center p-3 font-bold text-green-700 w-24">
                                Semana
                              </th>
                              <th className="text-center p-3 font-bold text-gray-700 w-32">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(routesByPSM[selectedOperator] || []).map(
                              (rota, idx) => {
                                // v3.48.00: Verificar APENAS semana atual (para checkboxes)
                                const testada = isRotaTestada(
                                  selectedOperator,
                                  selectedWeek,
                                  rota
                                );
                                const validada = isRotaValidada(
                                  selectedOperator,
                                  selectedWeek,
                                  rota
                                );

                                // v3.48.02: Obter semanas APENAS DO QUARTER SELECIONADO
                                const semanasTestadas =
                                  getSemanasTestadasNoQuarter(
                                    selectedOperator,
                                    rota,
                                    selectedQuarter
                                  );
                                const semanasValidadas =
                                  getSemanasValidadasNoQuarter(
                                    selectedOperator,
                                    rota,
                                    selectedQuarter
                                  );

                                // v3.48.03: Status persiste no quarter inteiro após validação
                                const statusValidadaNoQuarter =
                                  isRotaValidadaNoQuarter(
                                    selectedOperator,
                                    rota,
                                    selectedQuarter
                                  );
                                const statusTestadaNoQuarter =
                                  isRotaTestadaNoQuarter(
                                    selectedOperator,
                                    rota,
                                    selectedQuarter
                                  );

                                return (
                                  <tr
                                    key={rota}
                                    className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${
                                      statusValidadaNoQuarter
                                        ? "bg-green-50"
                                        : statusTestadaNoQuarter
                                        ? "bg-yellow-50"
                                        : ""
                                    }`}
                                  >
                                    <td className="p-3 text-gray-600">
                                      {idx + 1}
                                    </td>
                                    <td className="p-3 font-medium text-gray-800">
                                      {rota}
                                    </td>

                                    {/* Checkbox Testada */}
                                    <td className="text-center p-3">
                                      <button
                                        onClick={() => {
                                          const novas = { ...rotasTestadas };
                                          if (!novas[selectedOperator])
                                            novas[selectedOperator] = {};
                                          if (
                                            !novas[selectedOperator][
                                              selectedWeek
                                            ]
                                          )
                                            novas[selectedOperator][
                                              selectedWeek
                                            ] = {};

                                          if (testada) {
                                            // Desmarcar APENAS desta semana
                                            delete novas[selectedOperator][
                                              selectedWeek
                                            ][rota];

                                            // Limpar semana vazia
                                            if (
                                              Object.keys(
                                                novas[selectedOperator][
                                                  selectedWeek
                                                ]
                                              ).length === 0
                                            ) {
                                              delete novas[selectedOperator][
                                                selectedWeek
                                              ];
                                            }

                                            // Desmarcar validada desta semana
                                            const novasVal = {
                                              ...rotasValidadas,
                                            };
                                            if (
                                              novasVal[selectedOperator]?.[
                                                selectedWeek
                                              ]
                                            ) {
                                              delete novasVal[selectedOperator][
                                                selectedWeek
                                              ][rota];
                                              if (
                                                Object.keys(
                                                  novasVal[selectedOperator][
                                                    selectedWeek
                                                  ]
                                                ).length === 0
                                              ) {
                                                delete novasVal[
                                                  selectedOperator
                                                ][selectedWeek];
                                              }
                                            }
                                            setRotasValidadas(novasVal);
                                          } else {
                                            // Marcar APENAS nesta semana
                                            novas[selectedOperator][
                                              selectedWeek
                                            ][rota] = {
                                              testada: true,
                                            };
                                          }

                                          setRotasTestadas(novas);
                                          console.log(
                                            `🧪 ${rota} ${
                                              testada ? "desmarcada" : "marcada"
                                            } em ${selectedWeek}`
                                          );
                                        }}
                                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                                          testada
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white border-gray-300 hover:border-blue-400"
                                        }`}
                                      >
                                        {testada && (
                                          <span className="text-lg">✓</span>
                                        )}
                                      </button>
                                    </td>

                                    {/* Semanas Testadas */}
                                    <td className="text-center p-3">
                                      {semanasTestadas.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 justify-center">
                                          {semanasTestadas.map((sem) => (
                                            <span
                                              key={sem}
                                              className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                                                sem === selectedWeek
                                                  ? "bg-blue-600 text-white font-bold"
                                                  : "bg-blue-100 text-blue-700"
                                              }`}
                                            >
                                              {sem}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-xs text-gray-400">
                                          -
                                        </span>
                                      )}
                                    </td>

                                    {/* Checkbox Validada */}
                                    <td className="text-center p-3">
                                      <button
                                        onClick={() => {
                                          // Só pode validar se estiver testada NESTA semana
                                          if (!testada) {
                                            alert(
                                              `⚠️ A rota precisa estar marcada como Testada em ${selectedWeek} primeiro!`
                                            );
                                            return;
                                          }

                                          const novas = { ...rotasValidadas };
                                          if (!novas[selectedOperator])
                                            novas[selectedOperator] = {};
                                          if (
                                            !novas[selectedOperator][
                                              selectedWeek
                                            ]
                                          )
                                            novas[selectedOperator][
                                              selectedWeek
                                            ] = {};

                                          if (validada) {
                                            // Desmarcar APENAS desta semana
                                            delete novas[selectedOperator][
                                              selectedWeek
                                            ][rota];

                                            // Limpar semana vazia
                                            if (
                                              Object.keys(
                                                novas[selectedOperator][
                                                  selectedWeek
                                                ]
                                              ).length === 0
                                            ) {
                                              delete novas[selectedOperator][
                                                selectedWeek
                                              ];
                                            }
                                          } else {
                                            // Marcar APENAS nesta semana
                                            novas[selectedOperator][
                                              selectedWeek
                                            ][rota] = {
                                              validada: true,
                                            };
                                          }

                                          setRotasValidadas(novas);
                                          console.log(
                                            `✅ ${rota} ${
                                              validada
                                                ? "desmarcada"
                                                : "marcada"
                                            } em ${selectedWeek}`
                                          );
                                        }}
                                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                                          validada
                                            ? "bg-green-600 border-green-600 text-white"
                                            : testada
                                            ? "bg-white border-gray-300 hover:border-green-400"
                                            : "bg-gray-100 border-gray-200 cursor-not-allowed"
                                        }`}
                                        disabled={!testada}
                                      >
                                        {validada && (
                                          <span className="text-lg">✓</span>
                                        )}
                                      </button>
                                    </td>

                                    {/* Semanas Validadas */}
                                    <td className="text-center p-3">
                                      {semanasValidadas.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 justify-center">
                                          {semanasValidadas.map((sem) => (
                                            <span
                                              key={sem}
                                              className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                                                sem === selectedWeek
                                                  ? "bg-green-600 text-white font-bold"
                                                  : "bg-green-100 text-green-700"
                                              }`}
                                            >
                                              {sem}
                                            </span>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="text-xs text-gray-400">
                                          -
                                        </span>
                                      )}
                                    </td>

                                    {/* Status - v3.48.03: Persiste após validação no quarter */}
                                    <td className="text-center p-3">
                                      {statusValidadaNoQuarter ? (
                                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                          ✅ Validada
                                        </span>
                                      ) : statusTestadaNoQuarter ? (
                                        <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                                          ⏳ Pendente
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">
                                          ⚪ Não Testada
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Resumo da Tabela */}
                      <div className="mt-4 flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div className="flex space-x-6 text-sm">
                          <div>
                            <span className="text-gray-600">Total: </span>
                            <span className="font-bold text-gray-800">
                              {routesByPSM[selectedOperator]?.length || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">🧪 Testadas: </span>
                            <span className="font-bold text-blue-700">
                              {testesData.testadas}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              (
                              {testesData.cadastradas > 0
                                ? (
                                    (testesData.testadas /
                                      testesData.cadastradas) *
                                    100
                                  ).toFixed(0)
                                : 0}
                              %)
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              ✅ Validadas:{" "}
                            </span>
                            <span className="font-bold text-green-700">
                              {testesData.semIndisponibilidade}
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              (
                              {testesData.testadas > 0
                                ? (
                                    (testesData.semIndisponibilidade /
                                      testesData.testadas) *
                                    100
                                  ).toFixed(0)
                                : 0}
                              %)
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              ⏳ Pendentes:{" "}
                            </span>
                            <span className="font-bold text-red-700">
                              {testesData.pendentes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Dashboard Executivo */}
        <div className="px-5 py-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="py-4 px-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Dashboard Executivo
                </h2>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                <h3 className="text-md font-semibold text-gray-700">
                  Dados Gerais - PSM {selectedOperator}
                  {selectedProvince !== "Todas" && (
                    <span className="text-blue-600"> | {selectedProvince}</span>
                  )}
                </h3>
              </div>
              <div
                className="grid grid-cols-4 gap-1 mb-6"
                key={`dashboard-${selectedOperator}-${selectedProvince}-${selectedQuarter}`}
              >
                {(() => {
                  console.log("🎨 RENDERIZANDO CARDS:", {
                    provincia: selectedProvince,
                    psm: selectedOperator,
                    transporte: executiveDashboard.transporteQ2?.value,
                    indisponiveis: executiveDashboard.indisponiveis?.value,
                  });
                  return Object.values(executiveDashboard).map((item, idx) => (
                    <div
                      key={`${idx}-${item.value}`}
                      className={`${item.color} ${item.textColor} rounded p-1.5 shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200`}
                      onClick={() => handleStatusClick(item.label)}
                      title={`Clique para ver detalhes de ${item.label}`}
                    >
                      <div className="text-[10px] font-medium opacity-90 mb-0.5 flex items-center gap-0.5">
                        <span>
                          {
                            ["📦", "⚠️", "✅", "🔍", "👥", "📋", "🔄", "🔌"][
                              idx
                            ]
                          }
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="text-lg font-bold leading-tight">
                        {item.value}
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* v3.41.02: 4 CARDS DE ANÁLISE - Por PROVÍNCIA (modo PSM) ou por PSM (modo Global) */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {(() => {
                  // v3.41.02: LÓGICA DIFERENTE para Global vs PSM específico
                  const isGlobalMode = selectedOperator === "Global";

                  let entidadesDados = [];

                  if (isGlobalMode) {
                    // MODO GLOBAL: Calcular por PSM
                    console.log("🌍 CARDS MODO GLOBAL - Calculando por PSM");

                    const psmsDisponiveis = ["FIBRASOL", "ISISTEL", "ANGLOBAL"];

                    entidadesDados = psmsDisponiveis.map((psm) => {
                      let indisponiveis = 0;
                      let reparadas = 0;
                      let reconhecidas = 0;
                      let depPassagem = 0;
                      let depLicenca = 0;
                      let depCutover = 0;

                      routesByPSM[psm].forEach((route) => {
                        let ultimoIndisp = 0;
                        let somaReparadas = 0;
                        let ultimaReconh = 0;
                        let ultimoDepPass = 0;
                        let ultimoDepLic = 0;
                        let ultimoDepCut = 0;

                        quarterWeeks.forEach((week) => {
                          const weekNum = parseInt(week.substring(1));
                          const selectedWeekNum = parseInt(
                            selectedWeek.substring(1)
                          );

                          if (weekNum <= selectedWeekNum) {
                            const weekData = data[psm]?.[week]?.[route];

                            if (weekData) {
                              const indisp =
                                parseInt(weekData["Indisponíveis"]) || 0;
                              const rep =
                                parseInt(weekData["Total Reparadas"]) || 0;
                              const reconh =
                                parseInt(weekData["Reconhecidas"]) || 0;
                              const depPass =
                                parseInt(
                                  weekData["Dep. de Passagem de Cabo"]
                                ) || 0;
                              const depLic =
                                parseInt(weekData["Dep. de Licença"]) || 0;
                              const depCut =
                                parseInt(weekData["Dep. de Cutover"]) || 0;

                              if (indisp > 0) ultimoIndisp = indisp;
                              if (reconh > 0) ultimaReconh = reconh;
                              if (depPass > 0) ultimoDepPass = depPass;
                              if (depLic > 0) ultimoDepLic = depLic;
                              if (depCut > 0) ultimoDepCut = depCut;

                              somaReparadas += rep;
                            }
                          }
                        });

                        indisponiveis += ultimoIndisp;
                        reparadas += somaReparadas;
                        reconhecidas += ultimaReconh;
                        depPassagem += ultimoDepPass;
                        depLicenca += ultimoDepLic;
                        depCutover += ultimoDepCut;
                      });

                      const indisponibilidadeLiquida = Math.max(
                        0,
                        Math.round(indisponiveis - reparadas)
                      );
                      const efetividadeGlobal =
                        indisponiveis > 0
                          ? (reparadas / indisponiveis) * 100
                          : 0;
                      const indisponiveisPSM =
                        indisponiveis -
                        (reconhecidas + depPassagem + depLicenca + depCutover);
                      const efetividadePSM =
                        indisponiveisPSM > 0
                          ? (reparadas / indisponiveisPSM) * 100
                          : 0;

                      console.log(
                        `  📊 ${psm}: Efet.Global=${efetividadeGlobal.toFixed(
                          1
                        )}%, Efet.PSM=${efetividadePSM.toFixed(1)}%`
                      );

                      return {
                        provincia: psm, // Nome da entidade (será PSM neste caso)
                        indisponiveis: indisponibilidadeLiquida,
                        indisponiveisOriginal: indisponiveis,
                        reparadas,
                        efetividade: efetividadeGlobal,
                        efetividadeGlobal,
                        efetividadePSM,
                        indisponiveisPSM,
                      };
                    });
                  } else {
                    // MODO PSM: Calcular por PROVÍNCIA (código original)
                    const provinciasParaCalcular =
                      selectedProvince !== "Todas"
                        ? [selectedProvince]
                        : operatorToProvinces[selectedOperator];

                    console.log("🗺️ CARDS MODO PSM - Calculando por Província");
                    console.log("  PSM:", selectedOperator);
                    console.log("  Província filtrada:", selectedProvince);
                    console.log(
                      "  Províncias a calcular:",
                      provinciasParaCalcular
                    );

                    entidadesDados = provinciasParaCalcular.map((prov) => {
                      const rotasProv = routesByPSM[selectedOperator].filter(
                        (route) => routeToProvince[route] === prov
                      );

                      console.log(`  📍 ${prov}:`);
                      console.log(`     Total rotas: ${rotasProv.length}`);

                      // v3.36.0: Debug específico para Cuango
                      const rotasCuango = rotasProv.filter((r) =>
                        r.includes("Cuango")
                      );
                      if (rotasCuango.length > 0) {
                        console.log(
                          `     🔍 Rotas Cuango encontradas:`,
                          rotasCuango
                        );
                      }

                      let indisponiveis = 0;
                      let reparadas = 0;

                      // v3.40.73: Coletar subcategorias para calcular Efetividade PSM
                      let reconhecidas = 0;
                      let depPassagem = 0;
                      let depLicenca = 0;
                      let depCutover = 0;

                      rotasProv.forEach((route) => {
                        // Para cada rota, pegar ÚLTIMO valor de Indisponíveis e ACUMULAR Total Reparadas
                        let ultimoIndisp = 0;
                        let somaReparadas = 0;

                        // v3.40.73: Últimos valores das subcategorias
                        let ultimaReconh = 0;
                        let ultimoDepPass = 0;
                        let ultimoDepLic = 0;
                        let ultimoDepCut = 0;

                        // Percorrer todas as semanas do quadrimestre até a semana selecionada
                        quarterWeeks.forEach((week) => {
                          const weekNum = parseInt(week.substring(1));
                          const selectedWeekNum = parseInt(
                            selectedWeek.substring(1)
                          );

                          if (weekNum <= selectedWeekNum) {
                            const weekData =
                              data[selectedOperator]?.[week]?.[route];

                            // Debug para Cuango (apenas na semana selecionada)
                            if (
                              route.includes("Cuango") &&
                              week === selectedWeek
                            ) {
                              console.log(`     🔍 ${route}:`);
                              console.log(
                                `        selectedWeek: ${selectedWeek}`
                              );
                              console.log(`        Tem dados?: ${!!weekData}`);
                              if (weekData) {
                                console.log(
                                  `        Indisponíveis: ${weekData["Indisponíveis"]}`
                                );
                                console.log(
                                  `        Total Reparadas acumulado: ${somaReparadas}`
                                );
                              }
                            }

                            if (weekData) {
                              const indisp =
                                parseInt(weekData["Indisponíveis"]) || 0;
                              const rep =
                                parseInt(weekData["Total Reparadas"]) || 0;

                              // v3.40.73: Coletar subcategorias
                              const reconh =
                                parseInt(weekData["Reconhecidas"]) || 0;
                              const depPass =
                                parseInt(
                                  weekData["Dep. de Passagem de Cabo"]
                                ) || 0;
                              const depLic =
                                parseInt(weekData["Dep. de Licença"]) || 0;
                              const depCut =
                                parseInt(weekData["Dep. de Cutover"]) || 0;

                              // Indisponíveis: último valor
                              if (indisp > 0) ultimoIndisp = indisp;

                              // Subcategorias: último valor
                              if (reconh > 0) ultimaReconh = reconh;
                              if (depPass > 0) ultimoDepPass = depPass;
                              if (depLic > 0) ultimoDepLic = depLic;
                              if (depCut > 0) ultimoDepCut = depCut;

                              // Total Reparadas: ACUMULA
                              somaReparadas += rep;
                            }
                          }
                        });

                        indisponiveis += ultimoIndisp;
                        reparadas += somaReparadas;

                        // v3.40.73: Somar subcategorias
                        reconhecidas += ultimaReconh;
                        depPassagem += ultimoDepPass;
                        depLicenca += ultimoDepLic;
                        depCutover += ultimoDepCut;

                        if (ultimoIndisp > 0 || somaReparadas > 0) {
                          console.log(
                            `     ${route}: ${ultimoIndisp} indisp (último), ${somaReparadas} reparadas (acumulado quadrimestre)`
                          );
                        }
                      });

                      console.log(
                        `  ✅ ${prov} TOTAL: ${indisponiveis} indisp (último), ${reparadas} reparadas (acumulado)`
                      );

                      // Calcular indisponibilidade LÍQUIDA = Indisponíveis - Total Reparadas
                      // Garantir que seja exatamente 0 se negativo ou muito pequeno
                      const indisponibilidadeLiquida = Math.max(
                        0,
                        Math.round(indisponiveis - reparadas)
                      );

                      console.log(
                        `  💡 ${prov} INDISPONIBILIDADE LÍQUIDA: ${indisponibilidadeLiquida} (${indisponiveis} - ${reparadas})`
                      );

                      // v3.40.73: CALCULAR DUAS EFETIVIDADES

                      // 1. Efetividade Global (ATUAL - já existia)
                      const efetividadeGlobal =
                        indisponiveis > 0
                          ? (reparadas / indisponiveis) * 100
                          : 0;

                      // 2. Efetividade PSM (NOVA)
                      // Indisponíveis do PSM = Total - (Reconhecidas + Dep.Pass + Dep.Lic + Dep.Cut)
                      const indisponiveisPSM =
                        indisponiveis -
                        (reconhecidas + depPassagem + depLicenca + depCutover);
                      const efetividadePSM =
                        indisponiveisPSM > 0
                          ? (reparadas / indisponiveisPSM) * 100
                          : 0;

                      console.log(
                        `  📊 ${prov} Efetividade Global: ${efetividadeGlobal.toFixed(
                          1
                        )}% (${reparadas}/${indisponiveis})`
                      );
                      console.log(
                        `  📊 ${prov} Efetividade PSM: ${efetividadePSM.toFixed(
                          1
                        )}% (${reparadas}/${indisponiveisPSM})`
                      );

                      return {
                        provincia: prov,
                        indisponiveis: indisponibilidadeLiquida, // Usar valor líquido para o gráfico
                        indisponiveisOriginal: indisponiveis, // Guardar original para referência
                        reparadas,
                        efetividade: efetividadeGlobal, // GLOBAL (compatibilidade)
                        efetividadeGlobal, // v3.40.73: GLOBAL explícito
                        efetividadePSM, // v3.40.73: PSM (nova)
                        indisponiveisPSM, // Para referência
                      };
                    });
                  } // Fim do else (modo PSM)

                  // v3.41.03: Usar efetividade correta baseada no modo selecionado
                  const totalIndisponiveisProv = entidadesDados.reduce(
                    (acc, p) => acc + p.indisponiveis,
                    0
                  );
                  const maisProdutiva = entidadesDados.reduce(
                    (max, p) => (p.reparadas > max.reparadas ? p : max),
                    entidadesDados[0] || {}
                  );

                  // v3.41.03: maisEfetiva e emAlerta usam efetividade baseada no modo
                  const maisEfetiva = entidadesDados.reduce((max, p) => {
                    const efetAtual =
                      efetividadeMode === "psm"
                        ? p.efetividadePSM
                        : p.efetividadeGlobal;
                    const efetMax =
                      efetividadeMode === "psm"
                        ? max.efetividadePSM
                        : max.efetividadeGlobal;
                    return efetAtual > efetMax ? p : max;
                  }, entidadesDados[0] || {});

                  const emAlerta = entidadesDados.reduce((min, p) => {
                    const efetAtual =
                      efetividadeMode === "psm"
                        ? p.efetividadePSM
                        : p.efetividadeGlobal;
                    const efetMin =
                      efetividadeMode === "psm"
                        ? min.efetividadePSM
                        : min.efetividadeGlobal;
                    return efetAtual < efetMin && p.indisponiveisOriginal > 0
                      ? p
                      : min;
                  }, entidadesDados[0] || {});

                  // v3.41.04: LOGS DETALHADOS DE DEBUG
                  console.log(
                    "═══════════════════════════════════════════════"
                  );
                  console.log('🔍 DEBUG CARD "PRECISA ATENÇÃO"');
                  console.log(
                    "═══════════════════════════════════════════════"
                  );
                  console.log(
                    `📊 Modo Efetividade Selecionado: "${efetividadeMode}"`
                  );
                  console.log(
                    `📊 Total de Entidades: ${entidadesDados.length}`
                  );
                  console.log("");

                  // Mostrar ranking completo
                  console.log(
                    "📋 RANKING COMPLETO (por efetividade selecionada):"
                  );
                  entidadesDados
                    .filter((p) => p.indisponiveisOriginal > 0)
                    .sort((a, b) => {
                      const efetA =
                        efetividadeMode === "psm"
                          ? a.efetividadePSM
                          : a.efetividadeGlobal;
                      const efetB =
                        efetividadeMode === "psm"
                          ? b.efetividadePSM
                          : b.efetividadeGlobal;
                      return efetB - efetA;
                    })
                    .forEach((p, idx) => {
                      const efet =
                        efetividadeMode === "psm"
                          ? p.efetividadePSM
                          : p.efetividadeGlobal;
                      const emoji =
                        idx === 0
                          ? "🥇"
                          : idx ===
                            entidadesDados.filter(
                              (x) => x.indisponiveisOriginal > 0
                            ).length -
                              1
                          ? "🚨"
                          : "  ";
                      console.log(
                        `  ${emoji} ${idx + 1}º ${p.provincia}: ${efet.toFixed(
                          1
                        )}% (Indisp: ${p.indisponiveisOriginal}, Rep: ${
                          p.reparadas
                        })`
                      );
                    });
                  console.log("");

                  // Mostrar cards calculados
                  console.log("🎯 CARDS CALCULADOS:");
                  console.log(`  ✅ Mais Efetiva: ${maisEfetiva.provincia}`);
                  console.log(
                    `     - Efet. Global: ${maisEfetiva.efetividadeGlobal?.toFixed(
                      1
                    )}%`
                  );
                  console.log(
                    `     - Efet. PSM: ${maisEfetiva.efetividadePSM?.toFixed(
                      1
                    )}%`
                  );
                  console.log(
                    `     - Usando: ${
                      efetividadeMode === "psm"
                        ? maisEfetiva.efetividadePSM?.toFixed(1)
                        : maisEfetiva.efetividadeGlobal?.toFixed(1)
                    }%`
                  );
                  console.log("");
                  console.log(`  ⚠️ Precisa Atenção: ${emAlerta.provincia}`);
                  console.log(
                    `     - Efet. Global: ${emAlerta.efetividadeGlobal?.toFixed(
                      1
                    )}%`
                  );
                  console.log(
                    `     - Efet. PSM: ${emAlerta.efetividadePSM?.toFixed(1)}%`
                  );
                  console.log(
                    `     - Usando: ${
                      efetividadeMode === "psm"
                        ? emAlerta.efetividadePSM?.toFixed(1)
                        : emAlerta.efetividadeGlobal?.toFixed(1)
                    }%`
                  );
                  console.log(
                    `     - Indisponíveis: ${emAlerta.indisponiveisOriginal}`
                  );
                  console.log(`     - Reparadas: ${emAlerta.reparadas}`);
                  console.log(
                    "═══════════════════════════════════════════════"
                  );
                  console.log("");

                  // Cores para o gráfico pizza
                  const cores = [
                    "#3b82f6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#8b5cf6",
                    "#ec4899",
                    "#14b8a6",
                    "#f97316",
                  ];

                  return (
                    <>
                      {/* Card 1: Indisponibilidade por Província (Gráfico Pizza) */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-sm font-semibold text-blue-900">
                            Peso de Indisponibilidade por Província
                          </h4>
                        </div>

                        {/* v3.39.0: Gráfico de Pizza ORDENADO (menor → maior) */}
                        <div className="flex justify-center items-center">
                          {(() => {
                            // CALCULAR TOTAL DE TODAS AS PROVÍNCIAS DO PSM (não só as filtradas)
                            const todasProvinciasPSM =
                              operatorToProvinces[selectedOperator];
                            const totalGeralIndisponiveis =
                              todasProvinciasPSM.reduce((sum, prov) => {
                                const rotasProv = routesByPSM[
                                  selectedOperator
                                ].filter(
                                  (route) => routeToProvince[route] === prov
                                );
                                let indisponiveisProvTotal = 0;

                                rotasProv.forEach((route) => {
                                  let ultimoIndisp = 0;
                                  quarterWeeks.forEach((week) => {
                                    const routeData =
                                      data[selectedOperator]?.[week]?.[route];
                                    if (routeData) {
                                      const indisp =
                                        parseInt(routeData["Indisponíveis"]) ||
                                        0;
                                      if (indisp > 0) ultimoIndisp = indisp;
                                    }
                                  });
                                  indisponiveisProvTotal += ultimoIndisp;
                                });

                                return sum + indisponiveisProvTotal;
                              }, 0);

                            // Dados para o GRÁFICO: apenas províncias com indisponibilidade > 0
                            const dadosPizzaGrafico = entidadesDados
                              .filter((p) => p.indisponiveis > 0)
                              .sort(
                                (a, b) => a.indisponiveis - b.indisponiveis
                              ); // Crescente

                            // Dados para a LEGENDA: TODAS as províncias do filtro (incluindo 0)
                            const dadosPizzaLegenda = entidadesDados.sort(
                              (a, b) => b.indisponiveis - a.indisponiveis
                            ); // Decrescente para legenda

                            if (dadosPizzaGrafico.length === 0)
                              return (
                                <p className="text-xs text-gray-500">
                                  Sem dados
                                </p>
                              );

                            // Usar total do gráfico para desenhar (províncias filtradas)
                            // mas totalGeralIndisponiveis para calcular percentagens
                            const totalGrafico = dadosPizzaGrafico.reduce(
                              (acc, p) => acc + p.indisponiveis,
                              0
                            );
                            let currentAngle = 0;
                            const radius = 68; // Reduzido 15%: 80 × 0.85 = 68
                            const centerX = 90; // Ajustado proporcionalmente: 105 × 0.857 ≈ 90
                            const centerY = 90; // Ajustado proporcionalmente: 105 × 0.857 ≈ 90

                            return (
                              <div className="flex flex-col">
                                {/* Gráfico centralizado com altura fixa */}
                                <div
                                  className="flex justify-center items-center"
                                  style={{ height: "180px" }}
                                >
                                  <svg
                                    width="180"
                                    height="180"
                                    viewBox="0 0 180 180"
                                  >
                                    {dadosPizzaGrafico.map((prov, idx) => {
                                      // Usar totalGrafico para desenhar (mantém proporções visuais)
                                      const percentage =
                                        (prov.indisponiveis / totalGrafico) *
                                        100;
                                      const angle = (percentage / 100) * 360;
                                      const startAngle = currentAngle;
                                      const endAngle = currentAngle + angle;
                                      currentAngle = endAngle;

                                      // Converter ângulos para coordenadas
                                      const startRad =
                                        (startAngle - 90) * (Math.PI / 180);
                                      const endRad =
                                        (endAngle - 90) * (Math.PI / 180);

                                      const x1 =
                                        centerX + radius * Math.cos(startRad);
                                      const y1 =
                                        centerY + radius * Math.sin(startRad);
                                      const x2 =
                                        centerX + radius * Math.cos(endRad);
                                      const y2 =
                                        centerY + radius * Math.sin(endRad);

                                      const largeArc = angle > 180 ? 1 : 0;

                                      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

                                      return (
                                        <g key={prov.provincia}>
                                          <path
                                            d={path}
                                            fill={cores[idx % cores.length]}
                                            stroke="white"
                                            strokeWidth="2"
                                          />
                                        </g>
                                      );
                                    })}
                                    {/* Círculo branco no centro para efeito donut */}
                                    <circle
                                      cx={centerX}
                                      cy={centerY}
                                      r="30"
                                      fill="white"
                                    />
                                    <text
                                      x={centerX}
                                      y={centerY - 6}
                                      textAnchor="middle"
                                      fontSize="17"
                                      fontWeight="bold"
                                      fill="#1e40af"
                                    >
                                      {totalGrafico}
                                    </text>
                                    <text
                                      x={centerX}
                                      y={centerY + 10}
                                      textAnchor="middle"
                                      fontSize="12"
                                      fill="#64748b"
                                    >
                                      fibras
                                    </text>
                                  </svg>
                                </div>

                                {/* Legenda - TODAS as províncias (incluindo 0%) */}
                                <div className="mt-2 space-y-1 w-full">
                                  {dadosPizzaLegenda.map((prov, idx) => {
                                    // Percentual sobre o TOTAL GERAL do PSM (não apenas filtradas)
                                    const percentual =
                                      totalGeralIndisponiveis > 0
                                        ? (
                                            (prov.indisponiveis /
                                              totalGeralIndisponiveis) *
                                            100
                                          ).toFixed(1)
                                        : "0.0";
                                    // Encontrar índice da cor no gráfico (apenas para províncias com valor > 0)
                                    const graficoIdx =
                                      dadosPizzaGrafico.findIndex(
                                        (p) => p.provincia === prov.provincia
                                      );
                                    const cor =
                                      graficoIdx >= 0
                                        ? cores[graficoIdx % cores.length]
                                        : "#d1d5db"; // Cinza para 0

                                    return (
                                      <div
                                        key={prov.provincia}
                                        className="flex items-center justify-between text-[10px]"
                                      >
                                        <div className="flex items-center space-x-1.5">
                                          <div
                                            className="w-2.5 h-2.5 rounded-sm"
                                            style={{ backgroundColor: cor }}
                                          ></div>
                                          <span
                                            className={`font-medium ${
                                              prov.indisponiveis > 0
                                                ? "text-blue-800"
                                                : "text-gray-400"
                                            }`}
                                          >
                                            {prov.provincia}
                                          </span>
                                        </div>
                                        <span
                                          className={`font-bold ${
                                            prov.indisponiveis > 0
                                              ? "text-blue-600"
                                              : "text-gray-400"
                                          }`}
                                        >
                                          {percentual}% ({prov.indisponiveis})
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Card 2: Província Mais Produtiva */}
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-sm font-semibold text-emerald-900">
                            Mais Produtiva
                          </h4>
                        </div>

                        {/* PROVÍNCIA MAIS PRODUTIVA CENTRALIZADA com altura fixa */}
                        <div
                          className="flex flex-col items-center justify-center"
                          style={{ height: "180px" }}
                        >
                          <div className="text-2xl font-bold text-emerald-700 mb-1">
                            {maisProdutiva?.provincia || "N/A"}
                          </div>
                          <div className="text-3xl font-bold text-emerald-600 mb-1">
                            {maisProdutiva?.reparadas || 0}
                          </div>
                          <div className="text-xs text-emerald-700">
                            fibras reparadas em {selectedQuarter}
                          </div>
                        </div>

                        {/* Lista das outras províncias - ORDEM DECRESCENTE com espaçamento dinâmico */}
                        <div className="mt-2 pt-3 border-t border-emerald-200">
                          {(() => {
                            const outrasProvincias = entidadesDados
                              .filter(
                                (p) =>
                                  p.provincia !== maisProdutiva?.provincia &&
                                  p.reparadas > 0
                              )
                              .sort((a, b) => b.reparadas - a.reparadas); // DECRESCENTE: maior → menor

                            // Espaçamento dinâmico: aumenta conforme mais províncias aparecem
                            const numProvincias = outrasProvincias.length;
                            let marginTop = "mt-3"; // Padrão

                            if (numProvincias >= 6) {
                              marginTop = "mt-1"; // Muito próximo (6+ províncias)
                            } else if (numProvincias >= 4) {
                              marginTop = "mt-2"; // Próximo (4-5 províncias)
                            } else if (numProvincias >= 2) {
                              marginTop = "mt-3"; // Médio (2-3 províncias)
                            } else {
                              marginTop = "mt-4"; // Mais longe (1 província)
                            }

                            // Ajustar altura máxima dinamicamente baseado na quantidade
                            const maxHeight =
                              numProvincias > 5 ? "max-h-28" : "max-h-20";

                            return (
                              <div
                                className={`${marginTop} space-y-1 ${maxHeight} overflow-y-auto`}
                              >
                                {outrasProvincias.map((prov, idx) => (
                                  <div
                                    key={prov.provincia}
                                    className="flex items-center justify-between text-[10px]"
                                  >
                                    <div className="flex items-center space-x-1.5">
                                      <span className="font-medium text-emerald-700">
                                        #{idx + 2} {prov.provincia}
                                      </span>
                                    </div>
                                    <span className="font-bold text-emerald-600">
                                      {prov.reparadas}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Card 3: Taxa de Efetividade - VELOCÍMETRO */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                              </svg>
                            </div>
                            <h4 className="text-sm font-semibold text-purple-900">
                              Efetividade
                            </h4>
                          </div>
                          {/* v3.40.73: Toggle Global/PSM */}
                          <select
                            value={efetividadeMode}
                            onChange={(e) => setEfetividadeMode(e.target.value)}
                            className="text-[10px] px-2 py-1 border border-purple-300 rounded bg-white text-purple-700 font-medium cursor-pointer hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
                          >
                            <option value="global">Global</option>
                            <option value="psm">PSM</option>
                          </select>
                        </div>

                        {/* VELOCÍMETRO AJUSTADO com altura fixa */}
                        <div
                          className="flex justify-center items-center"
                          style={{ height: "180px" }}
                        >
                          {(() => {
                            // v3.40.73: Filtrar províncias e calcular média baseado no modo
                            const provinciasComDados = entidadesDados.filter(
                              (p) => p.indisponiveisOriginal > 0
                            );

                            // Usar efetividade baseada no modo selecionado
                            const somaEfetividade = provinciasComDados.reduce(
                              (sum, p) => {
                                const efet =
                                  efetividadeMode === "psm"
                                    ? p.efetividadePSM
                                    : p.efetividadeGlobal;
                                return sum + efet;
                              },
                              0
                            );

                            const mediaEfetividade =
                              provinciasComDados.length > 0
                                ? somaEfetividade / provinciasComDados.length
                                : 0;

                            // Configuração do velocímetro (aumentado para melhor visibilidade)
                            const percentage = Math.min(
                              Math.max(mediaEfetividade, 0),
                              100
                            );
                            const centerX = 105; // Aumentado de 84
                            const centerY = 105; // Aumentado de 84
                            const radius = 80; // Aumentado de 63
                            const startAngle = -135;
                            const endAngle = 135;
                            const totalAngle = endAngle - startAngle;

                            // Calcular ângulo da agulha baseado na percentagem
                            const needleAngle =
                              startAngle + (percentage / 100) * totalAngle;

                            // Função para criar arco de cor
                            const createColorArc = (start, end, color) => {
                              const startRad = ((start - 90) * Math.PI) / 180;
                              const endRad = ((end - 90) * Math.PI) / 180;
                              const x1 = centerX + radius * Math.cos(startRad);
                              const y1 = centerY + radius * Math.sin(startRad);
                              const x2 = centerX + radius * Math.cos(endRad);
                              const y2 = centerY + radius * Math.sin(endRad);
                              const largeArc = end - start > 180 ? 1 : 0;

                              return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                            };

                            // Calcular ponto da agulha
                            const needleRad =
                              ((needleAngle - 90) * Math.PI) / 180;
                            const needleLength = radius - 9;
                            const needleX =
                              centerX + needleLength * Math.cos(needleRad);
                            const needleY =
                              centerY + needleLength * Math.sin(needleRad);

                            // Calcular posições dos labels 0% e 100%
                            const labelRadius = radius + 2; // Pouco abaixo do arco
                            const label0Rad =
                              ((startAngle - 90) * Math.PI) / 180;
                            const label100Rad =
                              ((endAngle - 90) * Math.PI) / 180;
                            const label0X =
                              centerX + labelRadius * Math.cos(label0Rad);
                            const label0Y =
                              centerY + labelRadius * Math.sin(label0Rad) + 8;
                            const label100X =
                              centerX + labelRadius * Math.cos(label100Rad);
                            const label100Y =
                              centerY + labelRadius * Math.sin(label100Rad) + 8;

                            return (
                              <div className="flex flex-col items-center">
                                <svg
                                  width="210"
                                  height="150"
                                  viewBox="0 0 210 150"
                                  className="w-full"
                                >
                                  {/* Background cinza claro */}
                                  <path
                                    d={createColorArc(
                                      startAngle,
                                      endAngle,
                                      "#e5e7eb"
                                    )}
                                    fill="#e5e7eb"
                                    opacity="0.3"
                                  />

                                  {/* Gradiente de cores: Vermelho -> Laranja -> Amarelo -> Verde claro -> Verde */}
                                  {/* Vermelho: 0-20% */}
                                  <path
                                    d={createColorArc(
                                      startAngle,
                                      startAngle + totalAngle * 0.2,
                                      "#ef4444"
                                    )}
                                    fill="#ef4444"
                                  />

                                  {/* Laranja: 20-40% */}
                                  <path
                                    d={createColorArc(
                                      startAngle + totalAngle * 0.2,
                                      startAngle + totalAngle * 0.4,
                                      "#f97316"
                                    )}
                                    fill="#f97316"
                                  />

                                  {/* Amarelo: 40-60% */}
                                  <path
                                    d={createColorArc(
                                      startAngle + totalAngle * 0.4,
                                      startAngle + totalAngle * 0.6,
                                      "#eab308"
                                    )}
                                    fill="#eab308"
                                  />

                                  {/* Verde-amarelo: 60-80% */}
                                  <path
                                    d={createColorArc(
                                      startAngle + totalAngle * 0.6,
                                      startAngle + totalAngle * 0.8,
                                      "#84cc16"
                                    )}
                                    fill="#84cc16"
                                  />

                                  {/* Verde: 80-100% */}
                                  <path
                                    d={createColorArc(
                                      startAngle + totalAngle * 0.8,
                                      endAngle,
                                      "#22c55e"
                                    )}
                                    fill="#22c55e"
                                  />

                                  {/* Círculo interno roxo transparente */}
                                  <circle
                                    cx={centerX}
                                    cy={centerY}
                                    r={radius - 27}
                                    fill="rgba(243, 232, 255, 0.5)"
                                  />

                                  {/* Marcações brancas */}
                                  {[0, 25, 50, 75, 100].map((mark) => {
                                    const angle =
                                      startAngle + (mark / 100) * totalAngle;
                                    const rad = ((angle - 90) * Math.PI) / 180;
                                    const x1 =
                                      centerX + (radius - 30) * Math.cos(rad);
                                    const y1 =
                                      centerY + (radius - 30) * Math.sin(rad);
                                    const x2 =
                                      centerX + (radius - 4) * Math.cos(rad);
                                    const y2 =
                                      centerY + (radius - 4) * Math.sin(rad);
                                    return (
                                      <line
                                        key={mark}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="white"
                                        strokeWidth="2.5"
                                      />
                                    );
                                  })}

                                  {/* Agulha */}
                                  <line
                                    x1={centerX}
                                    y1={centerY}
                                    x2={needleX}
                                    y2={needleY}
                                    stroke="#1f2937"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                  />

                                  {/* Centro da agulha */}
                                  <circle
                                    cx={centerX}
                                    cy={centerY}
                                    r="7"
                                    fill="#374151"
                                  />
                                  <circle
                                    cx={centerX}
                                    cy={centerY}
                                    r="4.5"
                                    fill="#6b7280"
                                  />

                                  {/* Percentagem no centro */}
                                  <text
                                    x={centerX}
                                    y={centerY + 38}
                                    textAnchor="middle"
                                    className="text-2xl font-bold"
                                    fill="#7c3aed"
                                  >
                                    {percentage.toFixed(1)}%
                                  </text>

                                  {/* Labels 0% e 100% nas extremidades (abaixo das cores) */}
                                  <text
                                    x={label0X}
                                    y={label0Y}
                                    textAnchor="middle"
                                    className="text-[11px]"
                                    fill="#dc2626"
                                    fontWeight="700"
                                  >
                                    0%
                                  </text>
                                  <text
                                    x={label100X}
                                    y={label100Y}
                                    textAnchor="middle"
                                    className="text-[11px]"
                                    fill="#16a34a"
                                    fontWeight="700"
                                  >
                                    100%
                                  </text>
                                </svg>
                                <div className="text-center -mt-2">
                                  <div className="text-[10px] text-purple-700 font-medium">
                                    Média {selectedOperator}
                                  </div>
                                  <div className="text-[9px] text-purple-600">
                                    {provinciasComDados.length} províncias
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* RANKING DAS PROVÍNCIAS - ALINHADO com mt-2 */}
                        <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                          {entidadesDados
                            .filter((p) => p.indisponiveisOriginal > 0) // Usar original, não o líquido
                            .sort((a, b) => {
                              // v3.40.73: Ordenar baseado no modo selecionado
                              const efetA =
                                efetividadeMode === "psm"
                                  ? a.efetividadePSM
                                  : a.efetividadeGlobal;
                              const efetB =
                                efetividadeMode === "psm"
                                  ? b.efetividadePSM
                                  : b.efetividadeGlobal;
                              return efetB - efetA;
                            })
                            .map((prov, idx) => {
                              // v3.40.73: Usar efetividade do modo selecionado
                              const efetividade =
                                efetividadeMode === "psm"
                                  ? prov.efetividadePSM
                                  : prov.efetividadeGlobal;
                              const efetividadeValor = efetividade.toFixed(0);
                              const percentage = Math.min(
                                Math.max(efetividade, 0),
                                100
                              );

                              // Função para determinar a cor baseada na percentagem (mesmo do velocímetro)
                              const getColorFromPercentage = (pct) => {
                                if (pct >= 80)
                                  return { bg: "#22c55e", text: "#15803d" }; // Verde: 80-100%
                                if (pct >= 60)
                                  return { bg: "#84cc16", text: "#4d7c0f" }; // Verde-amarelo: 60-80%
                                if (pct >= 40)
                                  return { bg: "#eab308", text: "#a16207" }; // Amarelo: 40-60%
                                if (pct >= 20)
                                  return { bg: "#f97316", text: "#c2410c" }; // Laranja: 20-40%
                                return { bg: "#ef4444", text: "#b91c1c" }; // Vermelho: 0-20%
                              };

                              const colors = getColorFromPercentage(percentage);

                              return (
                                <div
                                  key={prov.provincia}
                                  className="flex items-center justify-between text-[10px]"
                                >
                                  <span className="font-medium text-purple-800">
                                    #{idx + 1} {prov.provincia}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                      <div
                                        className="h-1.5 rounded-full transition-colors"
                                        style={{
                                          width: `${percentage}%`,
                                          backgroundColor: colors.bg,
                                        }}
                                      ></div>
                                    </div>
                                    <span
                                      className="font-bold w-9 text-right"
                                      style={{ color: colors.text }}
                                    >
                                      {efetividadeValor}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>

                        <div className="text-[9px] text-purple-700 mt-2 pt-2 border-t border-purple-200 text-center">
                          {efetividadeMode === "psm"
                            ? "Reparadas / Dep. PSM"
                            : "Reparadas / Indisponíveis"}
                        </div>
                      </div>

                      {/* Card 4: Província em Alerta */}
                      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-sm font-semibold text-red-900">
                            Precisa Atenção
                          </h4>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600 mb-1">
                            {emAlerta?.provincia || "N/A"}
                          </div>
                          <div className="flex justify-center items-center space-x-2 mb-2">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-700">
                                {emAlerta?.indisponiveisOriginal || 0}
                              </div>
                              <div className="text-[9px] text-red-600">
                                Indisponíveis
                              </div>
                            </div>
                            <div className="text-red-400">|</div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {emAlerta?.reparadas || 0}
                              </div>
                              <div className="text-[9px] text-green-700">
                                Reparadas
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-bold text-red-700">
                            Efetividade:{" "}
                            {efetividadeMode === "psm"
                              ? emAlerta?.efetividadePSM?.toFixed(1) || 0
                              : emAlerta?.efetividadeGlobal?.toFixed(1) || 0}
                            %
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Performance das Rotas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="py-4 px-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingDown className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Performance das Rotas
                  {selectedProvince !== "Todas" && (
                    <span className="text-blue-600"> | {selectedProvince}</span>
                  )}
                </h2>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-4">
                {/* Top 5 Rotas Críticas - ULTRA COMPACTO */}
                <div className="bg-red-50 rounded-lg border border-red-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <h3 className="text-xs font-semibold text-red-700">
                        Top 5 Rotas Críticas - {selectedQuarter}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {topRotasCriticas.map((item) => (
                      <div
                        key={item.rank}
                        className="bg-white rounded p-1.5 border border-red-100 cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors"
                        onClick={() => handleRotaClick(item.rota)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 flex-1">
                            <span className="text-sm font-bold text-red-600 w-5">
                              #{item.rank}
                            </span>
                            <div className="flex flex-col">
                              <p className="text-xs font-medium text-gray-700 leading-tight">
                                {item.rota}
                              </p>
                              {item.reparadas > 0 && (
                                <p className="text-[9px] font-semibold text-green-600 leading-tight mt-0.5">
                                  {item.reparadas} Fibras Reparadas
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-lg font-bold text-red-600 ml-2">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-red-200">
                    <div className="text-xs text-red-700 font-medium text-center">
                      {topRotasCriticas.filter((r) => r.value > 0).length} rotas
                      com indisponíveis
                    </div>
                  </div>
                </div>

                {/* Intervenções Recentes - ULTRA COMPACTO COM PAGINAÇÃO */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-semibold text-blue-700">
                        Intervenções Recentes - {selectedQuarter}
                      </h3>
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
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <span className="text-[9px] text-blue-600 font-medium px-1">
                          {currentPageIntervencoes + 1}/
                          {Math.ceil(
                            intervencoesRecentes.length /
                              itemsPerPageIntervencoes
                          )}
                        </span>
                        <button
                          onClick={goToNextPageIntervencoes}
                          disabled={
                            currentPageIntervencoes >=
                            Math.ceil(
                              intervencoesRecentes.length /
                                itemsPerPageIntervencoes
                            ) -
                              1
                          }
                          className="text-blue-600 hover:text-blue-800 disabled:text-blue-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Próxima"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {(() => {
                      // Paginação
                      const startIdx =
                        currentPageIntervencoes * itemsPerPageIntervencoes;
                      const endIdx = startIdx + itemsPerPageIntervencoes;
                      const paginatedItems = intervencoesRecentes.slice(
                        startIdx,
                        endIdx
                      );

                      console.log("📄 PAGINAÇÃO INTERVENÇÕES:", {
                        totalItems: intervencoesRecentes.length,
                        currentPage: currentPageIntervencoes,
                        itemsPerPage: itemsPerPageIntervencoes,
                        startIdx,
                        endIdx,
                        itemsNaPagina: paginatedItems.length,
                      });

                      if (paginatedItems.length === 0) {
                        return (
                          <div className="bg-white rounded p-3 border border-blue-100 text-center">
                            <p className="text-xs text-gray-500">
                              Sem intervenções neste quadrimestre
                            </p>
                          </div>
                        );
                      }

                      return paginatedItems.map((item, idx) => {
                        // v3.22.1: Calcular reparações na semana selecionada
                        const weekData =
                          data[selectedOperator]?.[selectedWeek]?.[item.rota];
                        const reparadasNaSemana = weekData
                          ? parseInt(weekData["Total Reparadas"]) || 0
                          : 0;

                        return (
                          <div
                            key={idx}
                            className="bg-white rounded p-1.5 border border-blue-100"
                          >
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
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-medium px-1 py-0.5 rounded inline-block mt-0.5">
                                  {item.status}
                                </span>
                              </div>
                              <span className="text-lg font-bold text-blue-600 flex-shrink-0">
                                {item.reps}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-blue-200">
                    {(() => {
                      // v3.20.5: Calcular intervenções e reparações das 2 últimas semanas
                      const routesToProcess =
                        selectedProvince !== "Todas"
                          ? routesByPSM[selectedOperator].filter(
                              (route) =>
                                routeToProvince[route] === selectedProvince
                            )
                          : routesByPSM[selectedOperator];

                      // Semana atual - contar intervenções e total de reparações
                      let totalSemanaSelecionada = 0;
                      let intervencoesSemanaAtual = 0;
                      routesToProcess.forEach((route) => {
                        if (data[selectedOperator]?.[selectedWeek]?.[route]) {
                          const routeData =
                            data[selectedOperator][selectedWeek][route];
                          const reparadas =
                            parseInt(routeData["Total Reparadas"]) || 0;
                          if (reparadas > 0) {
                            intervencoesSemanaAtual++;
                            totalSemanaSelecionada += reparadas;
                          }
                        }
                      });

                      // Semana anterior
                      const selectedWeekNum = parseInt(
                        selectedWeek.substring(1)
                      ); // W50 -> 50
                      const previousWeekNum = selectedWeekNum - 1;
                      const previousWeek =
                        previousWeekNum >= 1 ? `W${previousWeekNum}` : null;

                      let totalSemanaAnterior = 0;
                      if (previousWeek) {
                        routesToProcess.forEach((route) => {
                          if (data[selectedOperator]?.[previousWeek]?.[route]) {
                            const routeData =
                              data[selectedOperator][previousWeek][route];
                            totalSemanaAnterior +=
                              parseInt(routeData["Total Reparadas"]) || 0;
                          }
                        });
                      }

                      const total2Semanas =
                        totalSemanaSelecionada + totalSemanaAnterior;

                      return (
                        <div className="text-xs text-blue-700 font-medium text-center">
                          <div>
                            {intervencoesSemanaAtual > 0
                              ? `${intervencoesSemanaAtual} intervenções na ${selectedWeek}`
                              : `Sem intervenções na ${selectedWeek}`}
                          </div>
                          <div className="text-[10px] mt-0.5">
                            {previousWeek && (
                              <span>
                                {previousWeek}: {totalSemanaAnterior} |{" "}
                              </span>
                            )}
                            {selectedWeek}: {totalSemanaSelecionada}
                            <span className="font-bold ml-1">
                              ({total2Semanas} total)
                            </span>
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
                      <h3 className="text-xs font-semibold text-green-700">
                        Rotas Normalizadas - {selectedQuarter}
                      </h3>
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
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <span className="text-[9px] text-green-600 font-medium px-1">
                          {currentPageNormalizadas + 1}/{totalPagesNormalizadas}
                        </span>
                        <button
                          onClick={goToNextPageNormalizadas}
                          disabled={
                            currentPageNormalizadas >=
                            totalPagesNormalizadas - 1
                          }
                          className="text-green-600 hover:text-green-800 disabled:text-green-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Próximo"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {currentDataNormalizadas.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded p-1.5 border border-green-100"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-700 leading-tight truncate">
                              {item.rota}
                            </p>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-[10px] text-green-600 font-medium">
                                {item.status}
                              </span>
                              {item.condition && (
                                <span className="text-[9px] text-gray-500 italic">
                                  {item.condition}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                            {item.icon}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-green-200">
                    <div className="text-xs text-green-700 font-medium text-center">
                      {rotasNormalizadas.filter((r) => r.icon === "✓").length}{" "}
                      rotas normalizadas
                    </div>
                  </div>
                </div>

                {/* v3.23.0: ROTAS MAIS INTERVENCIONADAS - TOP 5 */}
                <div className="bg-purple-50 rounded-lg border border-purple-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <h3 className="text-xs font-semibold text-purple-700">
                        Top 5 Mais Intervencionadas - {selectedQuarter}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {rotasMaisIntervencionadas.map((item) => (
                      <div
                        key={item.rank}
                        className="bg-white rounded p-1.5 border border-purple-100 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors"
                        onClick={() =>
                          item.rota !== "-" && handleRotaClick(item.rota)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 flex-1">
                            <span className="text-sm font-bold text-purple-600 w-5">
                              #{item.rank}
                            </span>
                            <div className="flex flex-col">
                              <p className="text-xs font-medium text-gray-700 leading-tight">
                                {item.rota}
                              </p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-purple-600 ml-2">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-1.5 border-t border-purple-200">
                    <div className="text-xs text-purple-700 font-medium text-center">
                      {
                        rotasMaisIntervencionadas.filter((r) => r.value > 0)
                          .length
                      }{" "}
                      rotas com reparações
                    </div>
                  </div>
                </div>

                {/* v3.23.0: ROTAS SEM INTERVENÇÃO - CARROSSEL */}
                <div className="bg-orange-50 rounded-lg border border-orange-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <h3 className="text-xs font-semibold text-orange-700">
                        Rotas Sem Intervenção - {selectedQuarter}
                      </h3>
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
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <span className="text-[9px] text-orange-600 font-medium px-1">
                          {currentPageSemIntervencao + 1}/
                          {Math.ceil(
                            rotasSemIntervencao.length /
                              itemsPerPageSemIntervencao
                          )}
                        </span>
                        <button
                          onClick={goToNextPageSemIntervencao}
                          disabled={
                            currentPageSemIntervencao >=
                            Math.ceil(
                              rotasSemIntervencao.length /
                                itemsPerPageSemIntervencao
                            ) -
                              1
                          }
                          className="text-orange-600 hover:text-orange-800 disabled:text-orange-300 disabled:cursor-not-allowed transition-colors p-0.5"
                          title="Próximo"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {rotasSemIntervencao.length > 0 ? (
                      rotasSemIntervencao
                        .slice(
                          currentPageSemIntervencao *
                            itemsPerPageSemIntervencao,
                          (currentPageSemIntervencao + 1) *
                            itemsPerPageSemIntervencao
                        )
                        .map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded p-1.5 border border-orange-100 cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors"
                            onClick={() => handleRotaClick(item.rota)}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-medium text-gray-700 leading-tight truncate flex-1">
                                {item.rota}
                              </p>
                              <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                                0
                              </span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="bg-white rounded p-3 border border-orange-100 text-center">
                        <p className="text-xs text-gray-500">
                          Todas as rotas tiveram intervenção
                        </p>
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
                  {selectedProvince !== "Todas" && (
                    <span className="text-blue-600"> | {selectedProvince}</span>
                  )}
                </h2>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* COLUNA 1: Distribuição por Status - ESQUERDA - COMPACTO */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <PieChart className="w-4 h-4 text-blue-600" />
                      <h3 className="text-xs font-semibold text-blue-700">
                        Distribuição por Status - {selectedQuarter}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-blue-600 font-medium">
                        Dinâmico
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    {/* Altura reduzida de 340px para 280px */}
                    <div
                      className="relative mb-2 w-full"
                      style={{ height: "280px" }}
                    >
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 400 280"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <defs>
                          <filter id="shadow2">
                            <feDropShadow
                              dx="0"
                              dy="2"
                              stdDeviation="3"
                              floodOpacity="0.15"
                            />
                          </filter>
                        </defs>

                        {(() => {
                          const centerX = 200;
                          const centerY = 160;

                          // FASE 2: Definir raios para DOIS ANÉIS
                          // ANEL EXTERNO (Outer - Transporte e Indisponíveis)
                          const outerRingOuter = 120; // Raio externo do anel externo
                          const outerRingInner = 95; // Raio interno do anel externo

                          // ANEL INTERNO (Inner - Subcategorias)
                          const innerRingOuter = 90; // Raio externo do anel interno
                          const innerRingInner = 60; // Raio interno do anel interno

                          return (
                            <>
                              {/* ========== ANEL EXTERNO (OUTER) ========== */}
                              {(() => {
                                let currentAngle = 0;
                                return pieChartData.outer.map(
                                  (slice, index) => {
                                    const startAngle = currentAngle;
                                    const sliceAngle =
                                      (slice.percentage / 100) * 180;
                                    const endAngle = startAngle + sliceAngle;
                                    currentAngle = endAngle;

                                    const startRadians =
                                      (startAngle * Math.PI) / 180;
                                    const endRadians =
                                      (endAngle * Math.PI) / 180;

                                    // Pontos do arco EXTERNO
                                    const x1 =
                                      centerX +
                                      outerRingOuter * Math.cos(startRadians);
                                    const y1 =
                                      centerY -
                                      outerRingOuter * Math.sin(startRadians);
                                    const x2 =
                                      centerX +
                                      outerRingOuter * Math.cos(endRadians);
                                    const y2 =
                                      centerY -
                                      outerRingOuter * Math.sin(endRadians);

                                    const x3 =
                                      centerX +
                                      outerRingInner * Math.cos(endRadians);
                                    const y3 =
                                      centerY -
                                      outerRingInner * Math.sin(endRadians);
                                    const x4 =
                                      centerX +
                                      outerRingInner * Math.cos(startRadians);
                                    const y4 =
                                      centerY -
                                      outerRingInner * Math.sin(startRadians);

                                    const largeArcFlag =
                                      sliceAngle > 180 ? 1 : 0;

                                    const pathData = [
                                      `M ${x1} ${y1}`,
                                      `A ${outerRingOuter} ${outerRingOuter} 0 ${largeArcFlag} 0 ${x2} ${y2}`,
                                      `L ${x3} ${y3}`,
                                      `A ${outerRingInner} ${outerRingInner} 0 ${largeArcFlag} 1 ${x4} ${y4}`,
                                      "Z",
                                    ].join(" ");

                                    const isHovered =
                                      hoveredPieSlice === `outer-${index}`;

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
                                            opacity:
                                              hoveredPieSlice === null
                                                ? 0.95
                                                : isHovered
                                                ? 1
                                                : 0.4,
                                            transform: isHovered
                                              ? "scale(1.03)"
                                              : "scale(1)",
                                            transformOrigin: `${centerX}px ${centerY}px`,
                                          }}
                                          onMouseEnter={() =>
                                            setHoveredPieSlice(`outer-${index}`)
                                          }
                                          onMouseLeave={() =>
                                            setHoveredPieSlice(null)
                                          }
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
                                            <text
                                              x={centerX}
                                              y={centerY - 72}
                                              fontSize="12"
                                              fontWeight="bold"
                                              fill="#374151"
                                              textAnchor="middle"
                                            >
                                              {slice.label}
                                            </text>
                                            <text
                                              x={centerX}
                                              y={centerY - 50}
                                              fontSize="22"
                                              fontWeight="bold"
                                              fill={slice.color}
                                              textAnchor="middle"
                                            >
                                              {slice.percentage}%
                                            </text>
                                            <text
                                              x={centerX}
                                              y={centerY - 30}
                                              fontSize="11"
                                              fill="#6b7280"
                                              textAnchor="middle"
                                            >
                                              {slice.value} fibras
                                            </text>
                                          </g>
                                        )}
                                      </g>
                                    );
                                  }
                                );
                              })()}

                              {/* ========== ANEL INTERNO (INNER) ========== */}
                              {(() => {
                                let currentAngle = 0;
                                return pieChartData.inner.map(
                                  (slice, index) => {
                                    const startAngle = currentAngle;
                                    const sliceAngle =
                                      (slice.percentage / 100) * 180;
                                    const endAngle = startAngle + sliceAngle;
                                    currentAngle = endAngle;

                                    const startRadians =
                                      (startAngle * Math.PI) / 180;
                                    const endRadians =
                                      (endAngle * Math.PI) / 180;

                                    // Pontos do arco INTERNO
                                    const x1 =
                                      centerX +
                                      innerRingOuter * Math.cos(startRadians);
                                    const y1 =
                                      centerY -
                                      innerRingOuter * Math.sin(startRadians);
                                    const x2 =
                                      centerX +
                                      innerRingOuter * Math.cos(endRadians);
                                    const y2 =
                                      centerY -
                                      innerRingOuter * Math.sin(endRadians);

                                    const x3 =
                                      centerX +
                                      innerRingInner * Math.cos(endRadians);
                                    const y3 =
                                      centerY -
                                      innerRingInner * Math.sin(endRadians);
                                    const x4 =
                                      centerX +
                                      innerRingInner * Math.cos(startRadians);
                                    const y4 =
                                      centerY -
                                      innerRingInner * Math.sin(startRadians);

                                    const largeArcFlag =
                                      sliceAngle > 180 ? 1 : 0;

                                    const pathData = [
                                      `M ${x1} ${y1}`,
                                      `A ${innerRingOuter} ${innerRingOuter} 0 ${largeArcFlag} 0 ${x2} ${y2}`,
                                      `L ${x3} ${y3}`,
                                      `A ${innerRingInner} ${innerRingInner} 0 ${largeArcFlag} 1 ${x4} ${y4}`,
                                      "Z",
                                    ].join(" ");

                                    const isHovered =
                                      hoveredPieSlice === `inner-${index}`;

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
                                            opacity:
                                              hoveredPieSlice === null
                                                ? 0.85
                                                : isHovered
                                                ? 1
                                                : 0.3,
                                            transform: isHovered
                                              ? "scale(1.05)"
                                              : "scale(1)",
                                            transformOrigin: `${centerX}px ${centerY}px`,
                                          }}
                                          onMouseEnter={() =>
                                            setHoveredPieSlice(`inner-${index}`)
                                          }
                                          onMouseLeave={() =>
                                            setHoveredPieSlice(null)
                                          }
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
                                            <text
                                              x={centerX}
                                              y={centerY - 70}
                                              fontSize="11"
                                              fontWeight="bold"
                                              fill="#374151"
                                              textAnchor="middle"
                                            >
                                              {slice.label}
                                            </text>
                                            <text
                                              x={centerX}
                                              y={centerY - 50}
                                              fontSize="18"
                                              fontWeight="bold"
                                              fill={slice.color}
                                              textAnchor="middle"
                                            >
                                              {slice.percentage}%
                                            </text>
                                            <text
                                              x={centerX}
                                              y={centerY - 32}
                                              fontSize="10"
                                              fill="#6b7280"
                                              textAnchor="middle"
                                            >
                                              {slice.value} fibras
                                            </text>
                                          </g>
                                        )}
                                      </g>
                                    );
                                  }
                                );
                              })()}

                              <text
                                x="200"
                                y="190"
                                fontSize="22"
                                fontWeight="bold"
                                fill="#374151"
                                textAnchor="middle"
                              >
                                Status
                              </text>
                              <text
                                x="200"
                                y="210"
                                fontSize="11"
                                fill="#6b7280"
                                textAnchor="middle"
                              >
                                {selectedQuarter} {selectedYear}
                              </text>
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
                          const isHovered =
                            hoveredPieSlice === `outer-${index}`;

                          return (
                            <div
                              key={`legend-outer-${index}`}
                              className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-white border-2 rounded-lg transition-all duration-200 cursor-pointer"
                              style={{
                                borderColor: isHovered ? item.color : "#e5e7eb",
                                transform: isHovered
                                  ? "scale(1.05)"
                                  : "scale(1)",
                                boxShadow: isHovered
                                  ? `0 2px 8px ${item.color}40`
                                  : "none",
                              }}
                              onMouseEnter={() =>
                                setHoveredPieSlice(`outer-${index}`)
                              }
                              onMouseLeave={() => setHoveredPieSlice(null)}
                            >
                              <div
                                className="w-4 h-4 rounded transition-transform duration-200"
                                style={{
                                  backgroundColor: item.color,
                                  transform: isHovered
                                    ? "scale(1.2)"
                                    : "scale(1)",
                                }}
                              ></div>
                              <span className="font-bold text-gray-800">
                                {item.label}
                              </span>
                              <span
                                className="font-bold"
                                style={{ color: item.color }}
                              >
                                {item.percentage}%
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* INNER (Subcategorias) - COMPACTO */}
                      <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {pieChartData.inner.map((item, index) => {
                          const isHovered =
                            hoveredPieSlice === `inner-${index}`;

                          return (
                            <div
                              key={`legend-inner-${index}`}
                              className="flex items-center space-x-1 px-2 py-0.5 bg-white border rounded transition-all duration-200 cursor-pointer"
                              style={{
                                borderColor: isHovered ? item.color : "#e5e7eb",
                                opacity:
                                  hoveredPieSlice === null || isHovered
                                    ? 1
                                    : 0.5,
                                transform: isHovered
                                  ? "scale(1.05)"
                                  : "scale(1)",
                              }}
                              onMouseEnter={() =>
                                setHoveredPieSlice(`inner-${index}`)
                              }
                              onMouseLeave={() => setHoveredPieSlice(null)}
                            >
                              <div
                                className="w-2.5 h-2.5 rounded transition-transform duration-200"
                                style={{
                                  backgroundColor: item.color,
                                  transform: isHovered
                                    ? "scale(1.2)"
                                    : "scale(1)",
                                }}
                              ></div>
                              <span className="text-gray-600 text-[10px]">
                                {item.label}:
                              </span>
                              <span
                                className="font-semibold text-[10px]"
                                style={{ color: item.color }}
                              >
                                {item.percentage}%
                              </span>
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
                      <h3 className="text-xs font-semibold text-green-700">
                        Evolução Temporal - Até {selectedWeek}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] text-green-600 font-medium">
                        Plateau até W52
                      </span>
                    </div>
                  </div>

                  <div className="w-full" style={{ height: "320px" }}>
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 600 320"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <pattern
                          id="grid"
                          width="30"
                          height="30"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 30 0 L 0 0 0 30"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                        </pattern>
                      </defs>
                      <rect width="600" height="280" fill="url(#grid)" />

                      {(() => {
                        // v3.40.81: EIXO Y SEMPRE COMEÇA DO ZERO
                        const allValues = trendData.flatMap((item) => [
                          item.indisponiveis,
                          item.totalReparadas,
                          item.reparadasGlobal,
                          item.fibrasDep,
                        ]);

                        const maxValue = Math.max(...allValues, 0);

                        // v3.41.01: ESCALA DINÂMICA FLEXÍVEL - mais espaço entre linhas
                        // Adicionar margem proporcional ao valor máximo (20-50%)
                        const marginPercent =
                          maxValue < 20 ? 0.5 : maxValue < 50 ? 0.3 : 0.2;
                        const maxY = Math.ceil(maxValue * (1 + marginPercent));

                        // v3.40.81: Garantir que eixo começa do 0 (não do mínimo)
                        const minY = 0; // SEMPRE zero

                        // Calcular intervalo dos ticks (divisões do eixo Y)
                        const numTicks = 5;
                        const tickInterval =
                          Math.ceil(maxY / (numTicks - 1) / 10) * 10; // Arredondar para múltiplo de 10
                        const yAxisMax = tickInterval * (numTicks - 1);

                        // Fator de escala: mapear valores para pixels (altura útil reduzida)
                        // v3.40.81: Escala de 0 até yAxisMax
                        const scaleFactor = 240 / yAxisMax; // 240px de altura útil (320 - 80 margens)

                        // Gerar ticks do eixo Y (começa do 0)
                        const yTicks = [];
                        for (let i = 0; i < numTicks; i++) {
                          yTicks.push(i * tickInterval); // 0, tickInterval, 2*tickInterval, ...
                        }

                        return yTicks.map((val, idx) => {
                          const y = 270 - val * scaleFactor; // Ajustado para altura 320px
                          return (
                            <g key={idx}>
                              <line
                                x1="60"
                                y1={y}
                                x2="570"
                                y2={y}
                                stroke="#d1d5db"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                              />
                              <text
                                x="48"
                                y={y + 5}
                                fontSize="10"
                                fill="#6b7280"
                                textAnchor="end"
                                fontWeight="600"
                              >
                                {val}
                              </text>
                            </g>
                          );
                        });
                      })()}

                      {(() => {
                        // v3.40.81: Calcular valores para escala dinâmica (COMEÇA DO ZERO)
                        const allValues = trendData.flatMap((item) => [
                          item.indisponiveis,
                          item.totalReparadas,
                          item.reparadasGlobal,
                          item.fibrasDep,
                        ]);

                        const maxValue = Math.max(...allValues, 0);

                        // v3.41.01: ESCALA DINÂMICA FLEXÍVEL
                        const marginPercent =
                          maxValue < 20 ? 0.5 : maxValue < 50 ? 0.3 : 0.2;
                        const maxY = Math.ceil(maxValue * (1 + marginPercent));

                        const numTicks = 5;
                        const tickInterval =
                          Math.ceil(maxY / (numTicks - 1) / 10) * 10;
                        const yAxisMax = tickInterval * (numTicks - 1);
                        const scaleFactor = 240 / yAxisMax; // Altura útil (escala de 0 a yAxisMax)

                        // Calcular espaçamento dinâmico para ocupar todo o espaço
                        const totalWidth = 510; // 570 - 60 (espaço disponível)
                        const numWeeks = trendData.length;
                        const spacing = totalWidth / (numWeeks - 1); // Espaçamento entre pontos

                        return (
                          <>
                            {/* Labels das semanas */}
                            {trendData.map((item, idx) => {
                              const x = 60 + idx * spacing;
                              return (
                                <text
                                  key={idx}
                                  x={x}
                                  y="295"
                                  fontSize="11"
                                  fill="#374151"
                                  fontWeight="600"
                                  textAnchor="middle"
                                >
                                  {item.week}
                                </text>
                              );
                            })}

                            {/* Linha Indisponíveis (VERMELHA) */}
                            <path
                              d={trendData
                                .map((item, idx) => {
                                  const x = 60 + idx * spacing;
                                  const y =
                                    270 - item.indisponiveis * scaleFactor;
                                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                                })
                                .join(" ")}
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="3.5"
                            />
                            {trendData.map((item, idx) => {
                              const x = 60 + idx * spacing;
                              const y = 270 - item.indisponiveis * scaleFactor;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="5"
                                  fill="#ef4444"
                                  stroke="#fff"
                                  strokeWidth="2"
                                />
                              );
                            })}

                            {/* Linha Total Reparadas (LARANJA) */}
                            <path
                              d={trendData
                                .map((item, idx) => {
                                  const x = 60 + idx * spacing;
                                  const y =
                                    270 - item.totalReparadas * scaleFactor;
                                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                                })
                                .join(" ")}
                              fill="none"
                              stroke="#f97316"
                              strokeWidth="3"
                              strokeDasharray="6 6"
                            />
                            {trendData.map((item, idx) => {
                              const x = 60 + idx * spacing;
                              const y = 270 - item.totalReparadas * scaleFactor;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="4.5"
                                  fill="#f97316"
                                  stroke="#fff"
                                  strokeWidth="2"
                                />
                              );
                            })}

                            {/* Linha Reparadas Global (VERDE) */}
                            <path
                              d={trendData
                                .map((item, idx) => {
                                  const x = 60 + idx * spacing;
                                  const y =
                                    270 - item.reparadasGlobal * scaleFactor;
                                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                                })
                                .join(" ")}
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="3"
                            />
                            {trendData.map((item, idx) => {
                              const x = 60 + idx * spacing;
                              const y =
                                270 - item.reparadasGlobal * scaleFactor;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="4.5"
                                  fill="#22c55e"
                                  stroke="#fff"
                                  strokeWidth="2"
                                />
                              );
                            })}

                            {/* Linha Fibras Dep (ROXO) - v3.40.77: valores diretos do card */}
                            <path
                              d={trendData
                                .map((item, idx) => {
                                  const x = 60 + idx * spacing;
                                  const y = 270 - item.fibrasDep * scaleFactor;
                                  return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                                })
                                .join(" ")}
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="2.5"
                              strokeDasharray="5 3"
                            />
                            {trendData.map((item, idx) => {
                              const x = 60 + idx * spacing;
                              const y = 270 - item.fibrasDep * scaleFactor;
                              return (
                                <circle
                                  key={idx}
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#8b5cf6"
                                  stroke="#fff"
                                  strokeWidth="2"
                                />
                              );
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
                                const mudancaPercentual =
                                  prev !== 0
                                    ? Math.abs((curr - prev) / prev)
                                    : 1;

                                // Mostrar se mudança >= 3 unidades OU >= 5%
                                return (
                                  mudancaAbsoluta >= 3 ||
                                  mudancaPercentual >= 0.05
                                );
                              };

                              // Coletar todas as anotações
                              const allAnnotations = [];

                              // Série 1: Indisponíveis (Vermelho)
                              trendData.forEach((item, idx) => {
                                if (
                                  isVariation(trendData, idx, "indisponiveis")
                                ) {
                                  const x = 60 + idx * spacing;
                                  const y =
                                    270 - item.indisponiveis * scaleFactor;
                                  allAnnotations.push({
                                    x,
                                    y,
                                    value: item.indisponiveis,
                                    color: "#ef4444",
                                    series: "indisponiveis",
                                    idx,
                                  });
                                }
                              });

                              // Série 2: Total Reparadas (Laranja)
                              trendData.forEach((item, idx) => {
                                if (
                                  isVariation(trendData, idx, "totalReparadas")
                                ) {
                                  const x = 60 + idx * spacing;
                                  const y =
                                    270 - item.totalReparadas * scaleFactor;
                                  allAnnotations.push({
                                    x,
                                    y,
                                    value: item.totalReparadas,
                                    color: "#f97316",
                                    series: "totalReparadas",
                                    idx,
                                  });
                                }
                              });

                              // Série 3: Reparadas Global (Verde)
                              trendData.forEach((item, idx) => {
                                if (
                                  isVariation(trendData, idx, "reparadasGlobal")
                                ) {
                                  const x = 60 + idx * spacing;
                                  const y =
                                    270 - item.reparadasGlobal * scaleFactor;
                                  allAnnotations.push({
                                    x,
                                    y,
                                    value: item.reparadasGlobal,
                                    color: "#22c55e",
                                    series: "reparadasGlobal",
                                    idx,
                                  });
                                }
                              });

                              // Série 4: Fibras Dep (Roxo)
                              trendData.forEach((item, idx) => {
                                if (isVariation(trendData, idx, "fibrasDep")) {
                                  const x = 60 + idx * spacing;
                                  const y = 270 - item.fibrasDep * scaleFactor;
                                  allAnnotations.push({
                                    x,
                                    y,
                                    value: item.fibrasDep,
                                    color: "#8b5cf6",
                                    series: "fibrasDep",
                                    idx,
                                  });
                                }
                              });

                              // Agrupar anotações por posição X (mesma semana)
                              const groupedByX = {};
                              allAnnotations.forEach((ann) => {
                                if (!groupedByX[ann.x]) groupedByX[ann.x] = [];
                                groupedByX[ann.x].push(ann);
                              });

                              // v3.40.97: SISTEMA ROBUSTO ANTI-COLISÃO
                              const finalAnnotations = [];
                              const minSpacing = 18; // Distância mínima entre textos (altura do texto + margem)

                              Object.keys(groupedByX).forEach((x) => {
                                const group = groupedByX[x];
                                // Ordenar por Y (de cima para baixo)
                                group.sort((a, b) => a.y - b.y);

                                // v3.41.01: POSICIONAMENTO INTELIGENTE sem colisões
                                group.forEach((ann, i) => {
                                  // v3.41.01: ESPAÇAMENTO MAIOR - 45px
                                  const offsetY = i % 2 === 0 ? -45 : 45;
                                  let labelY = ann.y + offsetY;

                                  // Garantir limites do gráfico
                                  if (labelY > 275) labelY = ann.y - 45; // Proteger eixo X
                                  if (labelY < 20) labelY = 20; // Limite superior

                                  // v3.41.01: ANTI-COLISÃO MELHORADO
                                  let hasCollision = true;
                                  let attempts = 0;
                                  const maxAttempts = 30; // Mais tentativas

                                  while (
                                    hasCollision &&
                                    attempts < maxAttempts
                                  ) {
                                    hasCollision = false;

                                    // Verificar colisão com todas as anotações já posicionadas
                                    for (const existing of finalAnnotations) {
                                      const xDistance = Math.abs(
                                        existing.x - ann.x
                                      );
                                      const yDistance = Math.abs(
                                        existing.labelY - labelY
                                      );

                                      // v3.41.01: Detecção mais sensível
                                      // Colisão se textos muito próximos (mesmo em colunas diferentes)
                                      if (
                                        xDistance < 50 &&
                                        yDistance < minSpacing
                                      ) {
                                        hasCollision = true;

                                        // Ajustar com espaçamento maior
                                        if (labelY < existing.labelY) {
                                          labelY =
                                            existing.labelY - minSpacing - 2; // +2px extra
                                        } else {
                                          labelY =
                                            existing.labelY + minSpacing + 2; // +2px extra
                                        }

                                        // Re-aplicar limites
                                        if (labelY > 275) {
                                          labelY =
                                            existing.labelY - minSpacing - 2;
                                        }
                                        if (labelY < 20) {
                                          labelY =
                                            existing.labelY + minSpacing + 2;
                                        }

                                        break;
                                      }
                                    }

                                    attempts++;
                                  }

                                  // Se ainda houver colisão após tentativas, usar estratégia de empilhamento
                                  if (hasCollision) {
                                    // Empilhar verticalmente com espaçamento fixo
                                    const stackPosition =
                                      finalAnnotations.length * minSpacing + 20;
                                    labelY = Math.min(stackPosition, 275);
                                  }

                                  finalAnnotations.push({
                                    ...ann,
                                    labelY,
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
                              const x = 60 + idx * spacing;
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
                            {hoveredWeekIndex !== null &&
                              (() => {
                                const x = 60 + hoveredWeekIndex * spacing;
                                const weekData = trendData[hoveredWeekIndex];

                                // v3.40.84: Cálculo inteligente de posição
                                const tooltipWidth = 145;
                                const tooltipHeight = 135;
                                const svgWidth = 600;
                                const padding = 10;

                                // Calcular posição ideal
                                let tooltipX = x + padding; // Padrão: direita do ponto

                                // Se não cabe à direita, coloca à esquerda
                                if (
                                  tooltipX + tooltipWidth >
                                  svgWidth - padding
                                ) {
                                  tooltipX = x - tooltipWidth - padding;
                                }

                                // Garantir que não sai pela esquerda
                                if (tooltipX < padding) {
                                  tooltipX = padding;
                                }

                                // Garantir que não sai pela direita
                                if (
                                  tooltipX + tooltipWidth >
                                  svgWidth - padding
                                ) {
                                  tooltipX = svgWidth - tooltipWidth - padding;
                                }

                                return (
                                  <g
                                    style={{ transition: "all 0.2s ease-out" }}
                                  >
                                    {/* Sombra para tooltip */}
                                    <defs>
                                      <filter
                                        id="tooltipShadow"
                                        x="-50%"
                                        y="-50%"
                                        width="200%"
                                        height="200%"
                                      >
                                        <feGaussianBlur
                                          in="SourceAlpha"
                                          stdDeviation="3"
                                        />
                                        <feOffset
                                          dx="0"
                                          dy="2"
                                          result="offsetblur"
                                        />
                                        <feComponentTransfer>
                                          <feFuncA type="linear" slope="0.3" />
                                        </feComponentTransfer>
                                        <feMerge>
                                          <feMergeNode />
                                          <feMergeNode in="SourceGraphic" />
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
                                      style={{
                                        transition: "all 0.2s ease-out",
                                      }}
                                    />

                                    {/* Círculos nos pontos das linhas com transição */}
                                    <circle
                                      cx={x}
                                      cy={
                                        270 -
                                        weekData.indisponiveis * scaleFactor
                                      }
                                      r="5"
                                      fill="#ef4444"
                                      stroke="white"
                                      strokeWidth="2"
                                      style={{
                                        transition: "all 0.2s ease-out",
                                      }}
                                    />
                                    <circle
                                      cx={x}
                                      cy={
                                        270 -
                                        weekData.totalReparadas * scaleFactor
                                      }
                                      r="5"
                                      fill="#f97316"
                                      stroke="white"
                                      strokeWidth="2"
                                      style={{
                                        transition: "all 0.2s ease-out",
                                      }}
                                    />
                                    <circle
                                      cx={x}
                                      cy={
                                        270 -
                                        weekData.reparadasGlobal * scaleFactor
                                      }
                                      r="5"
                                      fill="#22c55e"
                                      stroke="white"
                                      strokeWidth="2"
                                      style={{
                                        transition: "all 0.2s ease-out",
                                      }}
                                    />
                                    <circle
                                      cx={x}
                                      cy={
                                        270 - weekData.fibrasDep * scaleFactor
                                      }
                                      r="5"
                                      fill="#8b5cf6"
                                      stroke="white"
                                      strokeWidth="2"
                                      style={{
                                        transition: "all 0.2s ease-out",
                                      }}
                                    />

                                    {/* Tooltip box com transição suave */}
                                    <g
                                      filter="url(#tooltipShadow)"
                                      style={{
                                        transition: "all 0.2s ease-out",
                                      }}
                                    >
                                      <rect
                                        x={tooltipX}
                                        y={35}
                                        width={tooltipWidth}
                                        height={tooltipHeight}
                                        rx="8"
                                        fill="white"
                                        stroke="#e5e7eb"
                                        strokeWidth="1.5"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      />

                                      {/* Header com semana */}
                                      <rect
                                        x={tooltipX}
                                        y={35}
                                        width={tooltipWidth}
                                        height="32"
                                        rx="8"
                                        fill="#374151"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      />
                                      <text
                                        x={tooltipX + tooltipWidth / 2}
                                        y={56}
                                        fontSize="14"
                                        fontWeight="bold"
                                        fill="white"
                                        textAnchor="middle"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
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
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      />

                                      {/* Indisponíveis */}
                                      <circle
                                        cx={tooltipX + 15}
                                        cy={87}
                                        r="5"
                                        fill="#ef4444"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      />
                                      <text
                                        x={tooltipX + 25}
                                        y={91}
                                        fontSize="11"
                                        fill="#6b7280"
                                        fontWeight="600"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
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
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      >
                                        {weekData.indisponiveis}
                                      </text>

                                      {/* Rep. Semanal */}
                                      <circle
                                        cx={tooltipX + 15}
                                        cy={107}
                                        r="5"
                                        fill="#f97316"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      />
                                      <text
                                        x={tooltipX + 25}
                                        y={111}
                                        fontSize="11"
                                        fill="#6b7280"
                                        fontWeight="600"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
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
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      >
                                        {weekData.totalReparadas}
                                      </text>

                                      {/* Reparadas Global */}
                                      <circle
                                        cx={tooltipX + 15}
                                        cy={127}
                                        r="5"
                                        fill="#22c55e"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      />
                                      <text
                                        x={tooltipX + 25}
                                        y={131}
                                        fontSize="11"
                                        fill="#6b7280"
                                        fontWeight="600"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
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
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      >
                                        {weekData.reparadasGlobal}
                                      </text>

                                      {/* Fibras Dep. PSM */}
                                      <circle
                                        cx={tooltipX + 15}
                                        cy={147}
                                        r="5"
                                        fill="#8b5cf6"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
                                      />
                                      <text
                                        x={tooltipX + 25}
                                        y={151}
                                        fontSize="11"
                                        fill="#6b7280"
                                        fontWeight="600"
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
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
                                        style={{
                                          transition: "all 0.2s ease-out",
                                        }}
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
                  {selectedProvince !== "Todas" && (
                    <span className="text-blue-600"> | {selectedProvince}</span>
                  )}
                </h2>

                <button
                  onClick={toggleViewModeClassificacao}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all duration-200"
                >
                  {viewModeClassificacao === "carousel" ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                      <span className="text-sm font-medium">Ver Resumo</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
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
                const routesData = routesByPSM[selectedOperator]
                  .map((rota) => {
                    // Encontrar primeira semana com dados para esta rota no quadrimestre
                    const quarterWeeks = allWeeks.slice(
                      quarterConfig[selectedQuarter].start - 1,
                      quarterConfig[selectedQuarter].end
                    );

                    let primeiraSemanaDados = null;
                    let weekNumSelecionada = parseInt(
                      selectedWeek.substring(1)
                    ); // W50 -> 50

                    // Procurar primeira semana com dados
                    for (let week of quarterWeeks) {
                      const weekNum = parseInt(week.substring(1));
                      if (weekNum > weekNumSelecionada) break; // Parar se passou da semana selecionada

                      const weekData = data[selectedOperator]?.[week]?.[rota];
                      if (weekData) {
                        const temDados =
                          (parseInt(weekData["Transporte"]) || 0) > 0 ||
                          (parseInt(weekData["Indisponíveis"]) || 0) > 0 ||
                          (parseInt(weekData["Total Reparadas"]) || 0) > 0;
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
                      if (
                        weekData &&
                        weekNum >= parseInt(primeiraSemanaDados.substring(1))
                      ) {
                        // Transporte e Indisponíveis: pegar último valor (não somar)
                        const transporteVal =
                          parseInt(weekData["Transporte"]) || 0;
                        const indisponiveisVal =
                          parseInt(weekData["Indisponíveis"]) || 0;
                        if (transporteVal > 0) transporte = transporteVal;
                        if (indisponiveisVal > 0)
                          indisponiveis = indisponiveisVal;

                        // Total Reparadas: SOMAR (acumulado) - ÚNICO QUE ACUMULA
                        totalReparadas +=
                          parseInt(weekData["Total Reparadas"]) || 0;

                        // Reconhecidas, Dependências e Fibras Dep.: pegar último valor (não somar)
                        const reconhecidasVal =
                          parseInt(weekData["Reconhecidas"]) || 0;
                        const depPassagemVal =
                          parseInt(weekData["Dep. de Passagem de Cabo"]) || 0;
                        const depLicencaVal =
                          parseInt(weekData["Dep. de Licença"]) || 0;
                        const depCutoverVal =
                          parseInt(weekData["Dep. de Cutover"]) || 0;
                        const fibrasDepVal =
                          parseInt(
                            weekData[
                              `Fibras dependentes da ${selectedOperator}`
                            ]
                          ) || 0;

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
                      primeiraSemanaDados, // Para debug
                    };
                  })
                  .filter((r) => r !== null) // Remover rotas sem dados até semana selecionada
                  .filter(
                    (r) =>
                      r.transporte +
                        r.indisponiveis +
                        r.totalReparadas +
                        r.reconhecidas +
                        r.depPassagem +
                        r.depLicenca +
                        r.depCutover +
                        r.fibrasDep >
                      0
                  )
                  // v3.20.0 FASE 4: Filtrar por província ANTES da classificação (afeta DADOS GERAIS)
                  .filter(
                    (r) =>
                      selectedProvince === "Todas" ||
                      routeToProvince[r.rota] === selectedProvince
                  );

                console.log(
                  "📊 GRÁFICOS POR CLASSIFICAÇÃO - Acumulado desde introdução:",
                  {
                    provincia: selectedProvince,
                    semanaSelecionada: selectedWeek,
                    totalRotas: routesByPSM[selectedOperator].length,
                    rotasComDados: routesData.length,
                    amostra: routesData.slice(0, 2).map((r) => ({
                      rota: r.rota,
                      primeira: r.primeiraSemanaDados,
                      reparadas: r.totalReparadas,
                    })),
                  }
                );

                // CLASSIFICAR ROTAS BASEADO EM: Transporte vs Indisponíveis
                let rotasDegradadas = routesData.filter(
                  (r) => r.transporte < r.indisponiveis
                );
                let rotasComGanho = routesData.filter(
                  (r) => r.transporte > r.indisponiveis
                );
                let rotasEstaveis = routesData.filter(
                  (r) => r.transporte === r.indisponiveis
                );

                // FASE 1: Filtro adicional removido - já filtrado acima
                // (mantido para compatibilidade mas não faz nada pois routesData já está filtrado)

                // FASE 2: Renderizar Dashboard Provincial (se província selecionada)
                const renderProvincialDashboard = () => {
                  if (selectedProvince === "Todas") return null;

                  const rotasProvincia = Object.entries(routeToProvince)
                    .filter(([_, prov]) => prov === selectedProvince)
                    .map(([rota]) => rota);

                  const rotasDegradadasProv = routesData.filter(
                    (r) =>
                      r.transporte < r.indisponiveis &&
                      routeToProvince[r.rota] === selectedProvince
                  );
                  const rotasGanhoProv = routesData.filter(
                    (r) =>
                      r.transporte > r.indisponiveis &&
                      routeToProvince[r.rota] === selectedProvince
                  );
                  const rotasEstaveisProv = routesData.filter(
                    (r) =>
                      r.transporte === r.indisponiveis &&
                      routeToProvince[r.rota] === selectedProvince
                  );

                  const totalTransporte = routesData
                    .filter((r) => routeToProvince[r.rota] === selectedProvince)
                    .reduce((sum, r) => sum + r.transporte, 0);
                  const totalIndisponiveis = routesData
                    .filter((r) => routeToProvince[r.rota] === selectedProvince)
                    .reduce((sum, r) => sum + r.indisponiveis, 0);
                  const totalReparadas = routesData
                    .filter((r) => routeToProvince[r.rota] === selectedProvince)
                    .reduce((sum, r) => sum + r.totalReparadas, 0);
                  const totalGeral =
                    totalTransporte + totalIndisponiveis + totalReparadas;

                  return (
                    <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span className="text-lg font-bold text-blue-900">
                            {selectedProvince}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-3 text-sm">
                        <div className="bg-white p-2 rounded border border-gray-200">
                          <span className="text-gray-600 block text-xs">
                            Total Rotas
                          </span>
                          <span className="font-bold text-xl text-gray-900">
                            {rotasProvincia.length}
                          </span>
                        </div>
                        <div className="bg-red-50 p-2 rounded border border-red-200">
                          <span className="text-gray-600 block text-xs">
                            Degradadas
                          </span>
                          <span className="font-bold text-xl text-red-600">
                            {rotasDegradadasProv.length}
                          </span>
                        </div>
                        <div className="bg-green-50 p-2 rounded border border-green-200">
                          <span className="text-gray-600 block text-xs">
                            Com Ganho
                          </span>
                          <span className="font-bold text-xl text-green-600">
                            {rotasGanhoProv.length}
                          </span>
                        </div>
                        <div className="bg-blue-50 p-2 rounded border border-blue-200">
                          <span className="text-gray-600 block text-xs">
                            Estáveis
                          </span>
                          <span className="font-bold text-xl text-blue-600">
                            {rotasEstaveisProv.length}
                          </span>
                        </div>
                        <div className="bg-purple-50 p-2 rounded border border-purple-200">
                          <span className="text-gray-600 block text-xs">
                            Total Fibras
                          </span>
                          <span className="font-bold text-xl text-purple-600">
                            {totalGeral}
                          </span>
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
                  fibrasDep:
                    colorMap[`Fibras dependentes da ${selectedOperator}`],
                };

                // Função para renderizar gráfico com ROTAS INDIVIDUAIS (nome completo, barras alinhadas)
                const renderCompactRoutesChart = (
                  routes,
                  title,
                  borderColor,
                  maxNameWidth
                ) => {
                  const containerClass =
                    borderColor === "red"
                      ? "bg-white rounded-lg border-2 border-red-400 p-3 shadow-lg h-full flex flex-col overflow-hidden"
                      : borderColor === "green"
                      ? "bg-white rounded-lg border-2 border-green-400 p-3 shadow-lg h-full flex flex-col overflow-hidden"
                      : "bg-white rounded-lg border-2 border-blue-400 p-3 shadow-lg h-full flex flex-col overflow-hidden";

                  const headerClass =
                    borderColor === "red"
                      ? "bg-gradient-to-r from-red-50 to-red-100 -mx-3 -mt-3 px-3 py-2 mb-2 border-b-2 border-red-300"
                      : borderColor === "green"
                      ? "bg-gradient-to-r from-green-50 to-green-100 -mx-3 -mt-3 px-3 py-2 mb-2 border-b-2 border-green-300"
                      : "bg-gradient-to-r from-blue-50 to-blue-100 -mx-3 -mt-3 px-3 py-2 mb-2 border-b-2 border-blue-300";

                  if (!routes || routes.length === 0) {
                    return (
                      <div className={containerClass}>
                        <div className={headerClass}>
                          <h3 className="text-center text-xs font-bold text-gray-800">
                            {title}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                          <p className="text-gray-500 text-xs">Sem rotas</p>
                        </div>
                      </div>
                    );
                  }

                  // Calcular valor máximo para escala (incluindo Total Reparadas)
                  const maxValue = Math.max(
                    ...routes.map(
                      (r) => r.transporte + r.indisponiveis + r.totalReparadas
                    )
                  );

                  // Altura dinâmica baseada no número de rotas
                  const barHeight =
                    routes.length <= 3
                      ? "h-6"
                      : routes.length <= 5
                      ? "h-5"
                      : routes.length <= 8
                      ? "h-4"
                      : "h-3.5";
                  const fontSize =
                    routes.length <= 5 ? "text-[10px]" : "text-[9px]";

                  return (
                    <div className={containerClass}>
                      <div className={headerClass}>
                        <h3 className="text-center text-xs font-bold text-gray-800">
                          {title}
                        </h3>
                      </div>
                      <p className="text-center text-[10px] font-semibold mb-2">
                        Total: {routes.length} rotas
                      </p>

                      {/* Legenda COMPLETA - 3 status */}
                      <div className="flex justify-center gap-3 mb-2 text-[9px]">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2"
                            style={{ backgroundColor: colors.transporte }}
                          ></div>
                          <span>Transp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2"
                            style={{ backgroundColor: colors.indisponiveis }}
                          ></div>
                          <span>Indisp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2"
                            style={{ backgroundColor: colors.totalReparadas }}
                          ></div>
                          <span>Reparadas</span>
                        </div>
                      </div>

                      {/* Todas as rotas - Barras alinhadas após nome mais longo */}
                      <div className="flex-1 flex flex-col justify-evenly min-h-0 gap-0.5">
                        {routes.map((route, idx) => {
                          const transpWidth =
                            maxValue > 0
                              ? (route.transporte / maxValue) * 100
                              : 0;
                          const indispWidth =
                            maxValue > 0
                              ? (route.indisponiveis / maxValue) * 100
                              : 0;
                          const reparadasWidth =
                            maxValue > 0
                              ? (route.totalReparadas / maxValue) * 100
                              : 0;

                          // v3.22.1: Verificar se tem reparação na semana selecionada
                          const weekData =
                            data[selectedOperator]?.[selectedWeek]?.[
                              route.rota
                            ];
                          const reparadasNaSemana = weekData
                            ? parseInt(weekData["Total Reparadas"]) || 0
                            : 0;
                          const temReparacao = reparadasNaSemana > 0;

                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 min-w-0"
                            >
                              {/* Nome COMPLETO - VERDE se tem reparação */}
                              <div
                                className={`${fontSize} font-medium flex-shrink-0 ${
                                  temReparacao
                                    ? "text-green-600 font-bold"
                                    : "text-gray-700"
                                }`}
                                style={{ width: `${maxNameWidth}px` }}
                                title={route.rota}
                              >
                                {route.rota}
                              </div>

                              {/* Barra empilhada - 3 segmentos: T + I + R */}
                              <div
                                className={`flex ${barHeight} bg-gray-100 rounded overflow-hidden border border-gray-300 flex-1 min-w-0`}
                              >
                                {/* Segmento Transporte */}
                                {route.transporte > 0 && (
                                  <div
                                    className={`flex items-center justify-center text-white font-bold ${fontSize}`}
                                    style={{
                                      width: `${transpWidth}%`,
                                      backgroundColor: colors.transporte,
                                      minWidth: "0",
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
                                      minWidth: "0",
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
                                      minWidth: "0",
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
                  const containerClass =
                    "bg-white rounded-lg border-2 border-gray-400 p-3 shadow-lg h-full flex flex-col";
                  const headerClass =
                    "bg-gradient-to-r from-gray-50 to-gray-100 -mx-3 -mt-3 px-3 py-2 mb-3 border-b-2 border-gray-300";

                  if (!routes || routes.length === 0) {
                    return (
                      <div className={containerClass}>
                        <div className={headerClass}>
                          <h3 className="text-center text-sm font-bold text-gray-800">
                            {title}
                          </h3>
                        </div>
                        <div className="flex items-center justify-center flex-1">
                          <p className="text-gray-500 text-sm">Sem dados</p>
                        </div>
                      </div>
                    );
                  }

                  // Calcular totais
                  const totals = {
                    transporte: routes.reduce(
                      (sum, r) => sum + r.transporte,
                      0
                    ),
                    indisponiveis: routes.reduce(
                      (sum, r) => sum + r.indisponiveis,
                      0
                    ),
                    totalReparadas: routes.reduce(
                      (sum, r) => sum + r.totalReparadas,
                      0
                    ),
                    reconhecidas: routes.reduce(
                      (sum, r) => sum + r.reconhecidas,
                      0
                    ),
                    depPassagem: routes.reduce(
                      (sum, r) => sum + r.depPassagem,
                      0
                    ),
                    depLicenca: routes.reduce(
                      (sum, r) => sum + r.depLicenca,
                      0
                    ),
                    depCutover: routes.reduce(
                      (sum, r) => sum + r.depCutover,
                      0
                    ),
                    fibrasDep: routes.reduce((sum, r) => sum + r.fibrasDep, 0),
                  };

                  const totalSum = Object.values(totals).reduce(
                    (a, b) => a + b,
                    0
                  );

                  const statusLabels = {
                    transporte: "Transporte",
                    indisponiveis: "Indisponíveis",
                    totalReparadas: "Total Reparadas",
                    reconhecidas: "Reconhecidas",
                    depPassagem: "Dep. Passagem",
                    depLicenca: "Dep. Licença",
                    depCutover: "Dep. Cutover",
                    fibrasDep: "Fibras Dep.",
                  };

                  return (
                    <div className={containerClass}>
                      <div className={headerClass}>
                        <h3 className="text-center text-sm font-bold text-gray-800">
                          {title}
                        </h3>
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <p className="text-center text-xs font-semibold mb-3">
                          Total: {routes.length} rotas
                        </p>

                        {/* Barra horizontal empilhada com 8 segmentos */}
                        <div className="mb-4 px-2">
                          <div className="flex h-10 bg-gray-100 rounded overflow-hidden border-2 border-gray-300 shadow-sm">
                            {Object.entries(totals).map(([key, value]) => {
                              if (value === 0) return null;
                              const width = (value / totalSum) * 100;
                              // v3.22.3: Garantir largura mínima de 3% para segmentos muito pequenos
                              const minWidth = Math.max(width, 3);
                              return (
                                <div
                                  key={key}
                                  className="flex items-center justify-center text-white font-bold text-xs"
                                  style={{
                                    width: `${width}%`,
                                    minWidth: `${minWidth}%`,
                                    backgroundColor: colors[key],
                                  }}
                                  title={`${statusLabels[key]}: ${value}`}
                                >
                                  <span>{value}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Legenda em 2 colunas com percentagem */}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10px] mx-auto max-w-xs">
                          {Object.entries(totals).map(([key, value]) => {
                            const percentage =
                              totalSum > 0
                                ? ((value / totalSum) * 100).toFixed(1)
                                : 0;
                            return (
                              <div
                                key={key}
                                className="flex items-center gap-1.5"
                              >
                                <div
                                  className="w-2.5 h-2.5 flex-shrink-0 rounded-sm"
                                  style={{ backgroundColor: colors[key] }}
                                ></div>
                                <span className="truncate font-medium">
                                  {statusLabels[key]}: <strong>{value}</strong>{" "}
                                  <span className="text-gray-500">
                                    ({percentage}%)
                                  </span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                };

                // Função para renderizar um gráfico
                const renderChart = (
                  routes,
                  title,
                  borderColor,
                  bgColor,
                  dotColor
                ) => {
                  if (routes.length === 0) {
                    return (
                      <div
                        className={
                          bgColor === "red"
                            ? "bg-red-50 rounded-lg border-2 border-red-200 p-8 text-center"
                            : bgColor === "green"
                            ? "bg-green-50 rounded-lg border-2 border-green-200 p-8 text-center"
                            : "bg-blue-50 rounded-lg border-2 border-blue-200 p-8 text-center"
                        }
                      >
                        <p
                          className={
                            borderColor === "red"
                              ? "text-red-600 font-semibold"
                              : borderColor === "green"
                              ? "text-green-600 font-semibold"
                              : "text-blue-600 font-semibold"
                          }
                        >
                          ✓ Sem rotas {title.toLowerCase()} em {selectedWeek}
                        </p>
                      </div>
                    );
                  }

                  const maxValue = Math.max(
                    ...routes.map((r) =>
                      Math.max(
                        r.transporte,
                        r.indisponiveis,
                        r.totalReparadas,
                        r.reconhecidas,
                        r.depPassagem,
                        r.depLicenca,
                        r.depCutover,
                        r.fibrasDep
                      )
                    )
                  );

                  // LARGURAS DINÂMICAS baseadas no número de rotas
                  const numRotas = routes.length;
                  const containerWidth = 1200; // Largura fixa do container
                  const margins = 200; // Margens lateral
                  const availableWidth = containerWidth - margins;

                  // Calcular largura de cada grupo dinamicamente
                  const groupGap =
                    numRotas <= 5 ? 40 : numRotas <= 10 ? 20 : 10;
                  const totalGaps = (numRotas - 1) * groupGap;
                  const widthPerGroup = (availableWidth - totalGaps) / numRotas;

                  // Calcular largura de cada barra (8 barras por grupo)
                  const barGap = 2;
                  const totalBarGaps = 7 * barGap; // 7 gaps entre 8 barras
                  const barWidth = Math.max(
                    3,
                    (widthPerGroup - totalBarGaps) / 8
                  ); // Mínimo 3px

                  const groupWidth = barWidth * 8 + totalBarGaps;
                  const svgWidth = containerWidth;

                  // v3.24.1: Altura dinâmica baseada no número de rotas
                  // Menos rotas = menos espaço para nomes oblíquos
                  const labelSpaceNeeded =
                    numRotas <= 3
                      ? 60
                      : numRotas <= 6
                      ? 80
                      : numRotas <= 10
                      ? 100
                      : 110;
                  const svgHeight = 280 + labelSpaceNeeded; // Base 280 + espaço para labels

                  const chartTop = 50;
                  const chartBottom = svgHeight - labelSpaceNeeded;
                  const chartHeight = chartBottom - chartTop;

                  // Classes fixas por cor
                  const containerClass =
                    borderColor === "red"
                      ? "bg-white rounded-lg shadow-xl border-2 border-red-400 p-6"
                      : borderColor === "green"
                      ? "bg-white rounded-lg shadow-xl border-2 border-green-400 p-6"
                      : "bg-white rounded-lg shadow-xl border-2 border-blue-400 p-6";

                  const headerClass =
                    borderColor === "red"
                      ? "bg-gradient-to-r from-red-50 to-white border-b-2 border-red-300 pb-4 mb-4 -mx-6 -mt-6 px-6 pt-4"
                      : borderColor === "green"
                      ? "bg-gradient-to-r from-green-50 to-white border-b-2 border-green-300 pb-4 mb-4 -mx-6 -mt-6 px-6 pt-4"
                      : "bg-gradient-to-r from-blue-50 to-white border-b-2 border-blue-300 pb-4 mb-4 -mx-6 -mt-6 px-6 pt-4";

                  const dotClass =
                    borderColor === "red"
                      ? "w-3 h-3 bg-red-500 rounded-full"
                      : borderColor === "green"
                      ? "w-3 h-3 bg-green-500 rounded-full"
                      : "w-3 h-3 bg-blue-500 rounded-full";

                  const totalClass =
                    borderColor === "red"
                      ? "font-bold text-sm text-red-600"
                      : borderColor === "green"
                      ? "font-bold text-sm text-green-600"
                      : "font-bold text-sm text-blue-600";

                  return (
                    <div
                      className={containerClass}
                      style={{ position: "relative" }}
                    >
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
                            <h3 className="text-lg font-bold text-gray-800">
                              {title} - {selectedOperator}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            {selectedWeek} - Quadrimestre {selectedQuarter}{" "}
                            {selectedYear}
                          </p>
                        </div>
                      </div>

                      <div className="text-center mb-3">
                        <p className="text-xs text-gray-600">
                          Total de rotas:{" "}
                          <span className={totalClass}>{routes.length}</span>
                        </p>
                      </div>

                      {/* v3.24.0: LEGENDA NO TOPO para otimizar espaço */}
                      <div className="mb-4 flex justify-center">
                        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                          {[
                            { label: "Transporte", color: colors.transporte },
                            {
                              label: "Indisponíveis",
                              color: colors.indisponiveis,
                            },
                            {
                              label: "Total Reparadas",
                              color: colors.totalReparadas,
                            },
                            {
                              label: "Reconhecidas",
                              color: colors.reconhecidas,
                            },
                            {
                              label: "Dep. Passagem",
                              color: colors.depPassagem,
                            },
                            { label: "Dep. Licença", color: colors.depLicenca },
                            { label: "Dep. Cutover", color: colors.depCutover },
                            {
                              label: `Fibras Dep. ${selectedOperator}`,
                              color: colors.fibrasDep,
                            },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div
                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-[10px] text-gray-600">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SEM overflow-x-auto - Tudo cabe na largura fixa */}
                      <div className="flex justify-center">
                        <svg
                          width={svgWidth}
                          height={svgHeight}
                          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {/* Grid horizontal */}
                          {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                            const y = chartBottom - pct * chartHeight;
                            const value = Math.round(pct * maxValue);
                            return (
                              <g key={pct}>
                                <line
                                  x1="80"
                                  y1={y}
                                  x2={svgWidth - 40}
                                  y2={y}
                                  stroke="#e5e7eb"
                                  strokeWidth="1"
                                  strokeDasharray="3 3"
                                />
                                <text
                                  x="70"
                                  y={y + 4}
                                  fontSize="10"
                                  fill="#6b7280"
                                  textAnchor="end"
                                >
                                  {value}
                                </text>
                              </g>
                            );
                          })}

                          {/* Barras agrupadas */}
                          {routes.map((route, idx) => {
                            const x = 100 + idx * (groupWidth + groupGap);
                            const bars = [
                              {
                                value: route.transporte,
                                color: colors.transporte,
                                label: "Transporte",
                              },
                              {
                                value: route.indisponiveis,
                                color: colors.indisponiveis,
                                label: "Indisponíveis",
                              },
                              {
                                value: route.totalReparadas,
                                color: colors.totalReparadas,
                                label: "Total Reparadas",
                              },
                              {
                                value: route.reconhecidas,
                                color: colors.reconhecidas,
                                label: "Reconhecidas",
                              },
                              {
                                value: route.depPassagem,
                                color: colors.depPassagem,
                                label: "Dep. Passagem",
                              },
                              {
                                value: route.depLicenca,
                                color: colors.depLicenca,
                                label: "Dep. Licença",
                              },
                              {
                                value: route.depCutover,
                                color: colors.depCutover,
                                label: "Dep. Cutover",
                              },
                              {
                                value: route.fibrasDep,
                                color: colors.fibrasDep,
                                label: "Fibras Dep.",
                              },
                            ];

                            return (
                              <g
                                key={idx}
                                className="rota-group"
                                style={{ cursor: "pointer" }}
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
                                    fibrasDep: route.fibrasDep,
                                  });
                                }}
                                onMouseMove={(e) => {
                                  // v3.26.0: Capturar posição do mouse relativa ao SVG
                                  const svg = e.currentTarget.ownerSVGElement;
                                  const pt = svg.createSVGPoint();
                                  pt.x = e.clientX;
                                  pt.y = e.clientY;
                                  const svgP = pt.matrixTransform(
                                    svg.getScreenCTM().inverse()
                                  );
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
                                  const barX = x + barIdx * (barWidth + barGap);
                                  const barHeight =
                                    (bar.value / maxValue) * chartHeight;
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
                                  const weekData =
                                    data[selectedOperator]?.[selectedWeek]?.[
                                      route.rota
                                    ];
                                  const reparadasNaSemana = weekData
                                    ? parseInt(weekData["Total Reparadas"]) || 0
                                    : 0;
                                  const temReparacao = reparadasNaSemana > 0;
                                  const textColor = temReparacao
                                    ? "#16a34a"
                                    : "#4b5563"; // Verde ou cinza
                                  const fontWeight = temReparacao
                                    ? "bold"
                                    : "normal";

                                  // Quebrar no hífen
                                  const parts = route.rota.split(" - ");
                                  const parte1 = parts[0] || "";
                                  const parte2 = parts[1] || "";

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
                                          transform={`rotate(-45 ${
                                            baseX + deltaX
                                          } ${anchorY + deltaY})`}
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
                          {tooltipData &&
                            tooltipPosition &&
                            (() => {
                              // v3.26.1: Largura maior para evitar sobreposição
                              const tooltipWidth = 240;
                              const tooltipPadding = 10;
                              const isRightSide =
                                tooltipPosition.x > svgWidth / 2;
                              const tooltipX = isRightSide
                                ? tooltipPosition.x -
                                  tooltipWidth -
                                  tooltipPadding
                                : tooltipPosition.x + tooltipPadding;
                              const tooltipY = tooltipPosition.y - 10;

                              // v3.26.1: Quebrar nome no hífen
                              const rotaParts = tooltipData.rota.split(" - ");
                              const rotaParte1 = rotaParts[0] || "";
                              const rotaParte2 = rotaParts[1] || "";

                              // Contar quantos status têm valor > 0 com cores corretas
                              const statusList = [];
                              if (tooltipData.transporte > 0)
                                statusList.push({
                                  label: "Transporte",
                                  value: tooltipData.transporte,
                                  textColor: "#fff",
                                  dotColor: colors.transporte,
                                });
                              if (tooltipData.indisponiveis > 0)
                                statusList.push({
                                  label: "Indisponíveis",
                                  value: tooltipData.indisponiveis,
                                  textColor: "#ef4444",
                                  dotColor: colors.indisponiveis,
                                });
                              if (tooltipData.totalReparadas > 0)
                                statusList.push({
                                  label: "Total Reparadas",
                                  value: tooltipData.totalReparadas,
                                  textColor: "#22c55e",
                                  dotColor: colors.totalReparadas,
                                });
                              if (tooltipData.reconhecidas > 0)
                                statusList.push({
                                  label: "Reconhecidas",
                                  value: tooltipData.reconhecidas,
                                  textColor: "#fff",
                                  dotColor: colors.reconhecidas,
                                });
                              if (tooltipData.depPassagem > 0)
                                statusList.push({
                                  label: "Dep. de Passagem de Cabo",
                                  value: tooltipData.depPassagem,
                                  textColor: "#fff",
                                  dotColor: colors.depPassagem,
                                });
                              if (tooltipData.depLicenca > 0)
                                statusList.push({
                                  label: "Dep. de Licença",
                                  value: tooltipData.depLicenca,
                                  textColor: "#fff",
                                  dotColor: colors.depLicenca,
                                });
                              if (tooltipData.depCutover > 0)
                                statusList.push({
                                  label: "Dep. de Cutover",
                                  value: tooltipData.depCutover,
                                  textColor: "#fff",
                                  dotColor: colors.depCutover,
                                });
                              if (tooltipData.fibrasDep > 0)
                                statusList.push({
                                  label: `Fibras dependentes da ${selectedOperator}`,
                                  value: tooltipData.fibrasDep,
                                  textColor: "#fff",
                                  dotColor: colors.fibrasDep,
                                });

                              const lineHeight = 16;
                              const headerHeight = rotaParte2 ? 38 : 24; // Mais alto se tem 2 linhas
                              const tooltipHeight =
                                headerHeight +
                                statusList.length * lineHeight +
                                16;

                              return (
                                <g style={{ transition: "all 0.15s ease-out" }}>
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
                                        cy={
                                          tooltipY +
                                          headerHeight +
                                          8 +
                                          idx * lineHeight
                                        }
                                        r="4"
                                        fill={status.dotColor}
                                      />

                                      {/* Label */}
                                      <text
                                        x={tooltipX + 24}
                                        y={
                                          tooltipY +
                                          headerHeight +
                                          12 +
                                          idx * lineHeight
                                        }
                                        fontSize="10"
                                        fill="#9ca3af"
                                      >
                                        {status.label}:
                                      </text>

                                      {/* Valor alinhado à direita */}
                                      <text
                                        x={tooltipX + tooltipWidth - 10}
                                        y={
                                          tooltipY +
                                          headerHeight +
                                          12 +
                                          idx * lineHeight
                                        }
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
                      if (viewModeClassificacao === "all") {
                        // Calcular nome mais longo em TODAS as rotas
                        const allRouteNames = [
                          ...rotasDegradadas.map((r) => r.rota),
                          ...rotasComGanho.map((r) => r.rota),
                          ...rotasEstaveis.map((r) => r.rota),
                        ];
                        const longestName = allRouteNames.reduce(
                          (a, b) => (a.length > b.length ? a : b),
                          ""
                        );
                        // Estimar largura: 7px por caractere
                        const maxNameWidth = Math.min(
                          Math.max(longestName.length * 7, 120),
                          250
                        );

                        // Criar array apenas dos 3 cards de rotas (excluir DADOS GERAIS)
                        const routeCards = [
                          {
                            component: renderCompactRoutesChart(
                              rotasDegradadas,
                              "ROTAS DEGRADADAS",
                              "red",
                              maxNameWidth
                            ),
                            count: rotasDegradadas.length,
                            type: "degradadas",
                          },
                          {
                            component: renderCompactRoutesChart(
                              rotasComGanho,
                              "ROTAS COM GANHO",
                              "green",
                              maxNameWidth
                            ),
                            count: rotasComGanho.length,
                            type: "ganho",
                          },
                          {
                            component: renderCompactRoutesChart(
                              rotasEstaveis,
                              "ROTAS ESTÁVEIS",
                              "blue",
                              maxNameWidth
                            ),
                            count: rotasEstaveis.length,
                            type: "estaveis",
                          },
                        ];

                        // Ordenar por quantidade (crescente) para pegar o menor
                        const sortedByCount = [...routeCards].sort(
                          (a, b) => a.count - b.count
                        );
                        const cardComMenosRotas = sortedByCount[0]; // Menor
                        const outrosCards = sortedByCount
                          .slice(1)
                          .sort((a, b) => b.count - a.count); // Outros 2, ordenados decrescente

                        return (
                          <div className="grid grid-cols-2 gap-4">
                            {/* LINHA 1: DADOS GERAIS (fixo) + Card com MENOS rotas */}
                            <div key="dados">
                              {renderCompactChart(
                                routesData,
                                `DADOS GERAIS - PSM ${selectedOperator}${
                                  selectedProvince !== "Todas"
                                    ? ` | ${selectedProvince}`
                                    : ""
                                }`,
                                "gray"
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
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>

                          {/* Container do Carrossel */}
                          <div className="overflow-hidden">
                            <div
                              className="flex transition-transform duration-500 ease-in-out"
                              style={{
                                transform: `translateX(-${
                                  currentGraphClassificacao * 100
                                }%)`,
                              }}
                            >
                              {/* Slide 1: ROTAS DEGRADADAS */}
                              <div className="w-full flex-shrink-0 px-4">
                                {renderChart(
                                  rotasDegradadas,
                                  "ROTAS DEGRADADAS",
                                  "red",
                                  "red"
                                )}
                              </div>

                              {/* Slide 2: ROTAS COM GANHO */}
                              <div className="w-full flex-shrink-0 px-4">
                                {renderChart(
                                  rotasComGanho,
                                  "ROTAS COM GANHO",
                                  "green",
                                  "green"
                                )}
                              </div>

                              {/* Slide 3: ROTAS ESTÁVEIS */}
                              <div className="w-full flex-shrink-0 px-4">
                                {renderChart(
                                  rotasEstaveis,
                                  "ROTAS ESTÁVEIS",
                                  "blue",
                                  "blue"
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Botão Próximo */}
                          <button
                            onClick={goToNextGraphClassificacao}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 rounded-full p-3 shadow-lg border hover:bg-white hover:scale-110 transition-all disabled:opacity-30"
                            disabled={currentGraphClassificacao === 2}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
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
                                    ? "bg-blue-600 w-8"
                                    : "bg-gray-300 hover:bg-gray-400"
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
                  📋 Acompanhamento Transporte vs Degradação -{" "}
                  {selectedOperator} {selectedQuarter} {selectedYear}
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
                    Nenhuma justificativa importada para {selectedOperator} -{" "}
                    {selectedQuarter}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Use o botão "📥 Importar Justificativas" no menu lateral
                    para carregar os dados.
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
                  style={{
                    maxHeight: acompanhamentoData.length > 7 ? "420px" : "none",
                  }}
                >
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 z-20">
                      <tr className="bg-yellow-100 border-b-2 border-yellow-300">
                        <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-800 border-r border-yellow-200 sticky left-0 bg-yellow-100 z-30">
                          Secção
                        </th>
                        <th className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-yellow-200">
                          Região
                        </th>
                        <th className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-yellow-200 bg-slate-100">
                          Transp. Q2
                        </th>
                        <th className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-yellow-200 bg-red-100">
                          Indisp.
                        </th>
                        <th className="px-2 py-1.5 text-center text-xs font-bold text-gray-800 border-r border-yellow-200">
                          Delta
                        </th>
                        <th className="px-2 py-1.5 text-left text-xs font-bold text-gray-800">
                          Justificativa
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDataAcomp.map((row, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition-colors`}
                        >
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
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                row.deltaIndisponibilidade.startsWith("+")
                                  ? "bg-red-100 text-red-700"
                                  : row.deltaIndisponibilidade === "0"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
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
                      <span className="text-xs font-semibold text-blue-700">
                        Anterior
                      </span>
                    </button>

                    {/* Indicador Central */}
                    <div className="flex flex-col items-center">
                      <p className="text-xs text-gray-600 mb-1">
                        Mostrando <strong>{startIndexAcomp + 1}</strong> a{" "}
                        <strong>
                          {Math.min(endIndexAcomp, acompanhamentoData.length)}
                        </strong>{" "}
                        de <strong>{acompanhamentoData.length}</strong> secções
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-blue-700">
                          Página {currentPageAcomp + 1} de {totalPagesAcomp}
                        </span>
                        {/* Bolinhas indicadoras */}
                        <div className="flex space-x-1 ml-3">
                          {Array.from(
                            { length: Math.min(totalPagesAcomp, 5) },
                            (_, i) => {
                              let pageIndex;
                              if (totalPagesAcomp <= 5) {
                                pageIndex = i;
                              } else if (currentPageAcomp < 2) {
                                pageIndex = i;
                              } else if (
                                currentPageAcomp >
                                totalPagesAcomp - 3
                              ) {
                                pageIndex = totalPagesAcomp - 5 + i;
                              } else {
                                pageIndex = currentPageAcomp - 2 + i;
                              }
                              return (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    pageIndex === currentPageAcomp
                                      ? "bg-blue-600 w-6"
                                      : "bg-blue-300"
                                  }`}
                                />
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botão Próximo */}
                    <button
                      onClick={goToNextPageAcomp}
                      disabled={currentPageAcomp >= totalPagesAcomp - 1}
                      className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white transition-all shadow-sm"
                    >
                      <span className="text-xs font-semibold text-blue-700">
                        Próximo
                      </span>
                      <span className="text-lg">→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabela de Introdução Manual - FASE 9: INPUTS CONTROLADOS */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  📝 Introdução Manual dos Dados - {selectedOperator}{" "}
                  {selectedWeek} {selectedQuarter} {selectedYear}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600 font-medium">
                  Editável
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                <p className="text-xs text-blue-800">
                  💡 <strong>Dica:</strong> Digite valores numéricos. Salvamento
                  automático.
                </p>
                <p className="text-xs text-purple-800 mt-1">
                  🔄 <strong>Lógica:</strong> Total Reparadas ↑ → Fibras
                  Dependentes ↓
                </p>
              </div>

              {/* Container com scroll após 10 rotas */}
              <div
                className="overflow-auto border border-gray-200 rounded-lg"
                style={{
                  maxHeight:
                    routesByPSM[selectedOperator].length > 10
                      ? "500px"
                      : "none",
                }}
              >
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-yellow-50 border-b-2 border-yellow-200">
                      <th className="px-1 py-1 text-left text-xs font-semibold text-gray-700 border-r border-yellow-200 sticky left-0 bg-yellow-50 z-30">
                        Rota
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">
                        Transporte
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">
                        Indisponíveis
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200 bg-green-100">
                        <div className="flex items-center justify-center space-x-1">
                          <span>Total Reparadas</span>
                          <span
                            className="text-green-600"
                            title="Conectado a Fibras Dependentes"
                          >
                            🔗
                          </span>
                        </div>
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">
                        Reconhecidas
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">
                        Dep. de Passagem de Cabo
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">
                        Dep. de Licença
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 border-r border-yellow-200">
                        Dep. de Cutover
                      </th>
                      <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 bg-purple-100">
                        <div className="flex items-center justify-center space-x-1">
                          <span>Fibras dependentes da {selectedOperator}</span>
                          <span
                            className="text-purple-600"
                            title="Reduz automaticamente"
                          >
                            🔗
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {routesByPSM[selectedOperator].map((route, index) => (
                      <tr
                        key={index}
                        className={`h-4 border-b border-gray-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-1 py-0 text-[10px] leading-none text-gray-700 font-medium border-r border-gray-200 sticky left-0 bg-inherit z-10 max-h-5">
                          {route}
                        </td>
                        <td className="px-1.5 py-0 text-center text-xs text-gray-600 border-r border-gray-200">
                          <input
                            type="text"
                            value={getInputValue(
                              selectedOperator,
                              selectedWeek,
                              route,
                              "Transporte"
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                selectedOperator,
                                selectedWeek,
                                route,
                                "Transporte",
                                e.target.value
                              )
                            }
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-1.5 py-0 text-center text-xs text-gray-600 border-r border-gray-200">
                          <input
                            type="text"
                            value={getInputValue(
                              selectedOperator,
                              selectedWeek,
                              route,
                              "Indisponíveis"
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                selectedOperator,
                                selectedWeek,
                                route,
                                "Indisponíveis",
                                e.target.value
                              )
                            }
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-1.5 py-0 text-center text-xs text-gray-600 border-r border-gray-200 bg-green-50">
                          <input
                            type="text"
                            value={getInputValue(
                              selectedOperator,
                              selectedWeek,
                              route,
                              "Total Reparadas"
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                selectedOperator,
                                selectedWeek,
                                route,
                                "Total Reparadas",
                                e.target.value
                              )
                            }
                            className="w-full text-center border border-green-300 rounded px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-500 transition-colors bg-white"
                            placeholder="-"
                            maxLength="4"
                            title="🔄 Altera automaticamente as Fibras Dependentes"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                          <input
                            type="text"
                            value={getInputValue(
                              selectedOperator,
                              selectedWeek,
                              route,
                              "Reconhecidas"
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                selectedOperator,
                                selectedWeek,
                                route,
                                "Reconhecidas",
                                e.target.value
                              )
                            }
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                          <input
                            type="text"
                            value={getInputValue(
                              selectedOperator,
                              selectedWeek,
                              route,
                              "Dep. de Passagem de Cabo"
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                selectedOperator,
                                selectedWeek,
                                route,
                                "Dep. de Passagem de Cabo",
                                e.target.value
                              )
                            }
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                          <input
                            type="text"
                            value={getInputValue(
                              selectedOperator,
                              selectedWeek,
                              route,
                              "Dep. de Licença"
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                selectedOperator,
                                selectedWeek,
                                route,
                                "Dep. de Licença",
                                e.target.value
                              )
                            }
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 border-r border-gray-200">
                          <input
                            type="text"
                            value={getInputValue(
                              selectedOperator,
                              selectedWeek,
                              route,
                              "Dep. de Cutover"
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                selectedOperator,
                                selectedWeek,
                                route,
                                "Dep. de Cutover",
                                e.target.value
                              )
                            }
                            className="w-full h-4 text-center border border-gray-300 rounded px-1 py-0 text-[10px] leading-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-400 transition-colors"
                            placeholder="-"
                            maxLength="4"
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600 bg-purple-50">
                          <input
                            type="text"
                            value={getInputValue(
                              selectedOperator,
                              selectedWeek,
                              route,
                              `Fibras dependentes da ${selectedOperator}`
                            )}
                            onChange={(e) =>
                              handleInputChange(
                                selectedOperator,
                                selectedWeek,
                                route,
                                `Fibras dependentes da ${selectedOperator}`,
                                e.target.value
                              )
                            }
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
                Mostrando todas as {routesByPSM[selectedOperator].length} rotas
                do PSM {selectedOperator}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PSMMonitorApp;
