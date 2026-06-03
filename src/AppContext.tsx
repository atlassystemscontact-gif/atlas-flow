import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "pt";
export type Theme = "dark" | "light";

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    navCapabilities: "Capabilities",
    navAutomationLab: "Automation Lab",
    systemClock: "SYSTEM CLOCK:",
    sandboxMode: "SANDBOX",
    aiProdMode: "AI PROD",
    atlasConsoleBtn: "Atlas Console",
    workflowIntel: "WORKFLOW INTEL",

    // Hero
    systemStatusOptimal: "SYSTEM STATUS: OPTIMAL",
    heroTitle: "Automation powered by intelligence.",
    heroSubtitle: "Atlas Flow transforms complex business processes into intelligent automated systems powered by next-gen AI. Real-time telemetry, resilient routing, and generative decision nodes compiled instantly.",
    startAutomation: "Start Automation",
    explorePlatform: "Explore Platform",
    metricDailyOps: "Daily Operations",
    metricAvgLatency: "Average Latency",
    metricUptime: "Uptime Target",
    flowCompilerTitle: "FLOW COMPILER // v4.1",
    flowCompilerSubtitle: "Calculate, compile, and instantly route multi-platform nodes in real-time.",
    compileBtn: "Compile AI Logic Flow",
    presetHeading: "PRESETS / QUICK BENCHMARKS",
    preset1Title: "Zendesk Auto Classifier",
    preset1Desc: "Incoming client ticket classifier and CRM ledger prioritizer.",
    preset2Title: "Cloud DB Multi-Region Mirror",
    preset2Desc: "Schedules backup tasks, checks region latency, and broadcasts status.",
    preset3Title: "Stripe Payment Escalator",
    preset3Desc: "Monitors massive Stripe logs and triggers notifications for top priority tiers.",
    calculating: "Calculating capabilities...",

    // Features
    featuresTag: "Platform Capabilities // Core Architectures",
    featuresTitle: "Engineered to run enterprise-scale workflows.",
    featuresSubtitle: "Configure, deploy, and monitor self-healing logical structures capable of executing massive automated actions without human intervention.",
    diagnosticData: "DIAGNOSTIC DATA //",

    // CTA
    executiveDemoPlatform: "EXECUTIVE DEMO PLATFORM",
    ctaTitle: "The future belongs to automated companies.",
    ctaSubtitle: "Secure your invitation to schedule private sandbox credentials. Run test-compiles alongside our workflow experts and isolate structural multipliers for your sector.",
    gdprSecure: "GDPR Secure",
    gdprDesc: "Dual encryption vaults",
    multiModel: "Multi-Model",
    multiModelDesc: "Optimized for speed",
    calculateEfficiency: "Calculate Enterprise Efficiency",
    calculateDesc: "Select parameters to compute annual ROI hours and reserve your dedicated team sandbox demo.",
    companySize: "Company Size Scale",
    primaryGoal: "Primary Automatics Category",
    hoursReclaimed: "Hours Reclaimed / Yr",
    targetRoi: "Target ROI Factor",
    compEfficiency: "Comp Efficiency",
    businessEmail: "Business Email Address",
    ctaDisclaimer: "By clicking, you consent to compile high-stakes telemetry projections.",
    scheduleDemo: "Schedule a Demo",
    calculatingCap: "CALCULATING CAPABILITIES...",
    credentialsReservedHtml: "Our system dispatch has flagged your email",
    credentialsReservedTitle: "Credentials Reserved!",
    credentialsReservedBody: "One of our Solutions Principals will reach out with customized compile credentials within 2 hours.",
    invitationUuid: "Invitation UUID",

    // Console
    activeSimPlatform: "ACTIVE WORKSPACE",
    consoleTitle: "Atlas Lab Automation & Simulation",
    consoleSubtitle: "Inspect logical workflows, simulate automated executions, and review real productivity statistics in real time.",
    simPipeline: "WORKFLOW STATE",
    readyToExec: "READY TO EXECUTE",
    dashboardRatings: "ACTIVE METRICS",
    fastTelemetry: "LIVE AUDITING",
    clusterTelemetry: "Automation Productivity Report",
    operationalNodeDispatch: "Live Automation Log Stream",
    totalBufferedLines: "Buffered events count:",
    returnCapabilities: "Return to Capabilities",
    triggerRunSimulation: "Trigger Run Simulation",
    interactiveFlowArchitecture: "Interactive Flow Architecture",
    runDiagnostics: "Run Diagnostics",
    clearLogs: "Clear Logs",
    liveExecutionStream: "Live Execution Log Stream",
    systemTerminalActive: "SYSTEM TERMINAL ACTIVE",
    nodeTuningPlaceholder: "Select a node dynamically from the canvas flow to tune properties.",
    nodeTuningTitle: "Node Parameters Tuning",
    renameNode: "Rename Node",
    statusOverride: "Status Override",
    simulatedLatency: "Simulated Latency (ms)",
    applyChanges: "Apply Tuning Parameters",

    // Nodes and edges labels (fallbacks)
    node1Label: "Customer Inbound Trigger",
    node1Desc: "Listens for customer ticket inbound requests on live Zendesk webhooks.",
    node2Label: "Gemini Decisive Hub",
    node2Desc: "Classifies ticket text sentiment state and scores client retention risk indices.",
    node3Label: "Stripe Ledger Sync",
    node3Desc: "Modifies transaction priority levels and coordinates proactive CRM follow-ups.",
    node4Label: "Slack Instant Broadcast",
    node4Desc: "Dispatches escalation alerts to priority staff vectors for high-value friction customers.",

    // Toast and other elements
    runningSimulation: "Running simulation...",
    simulationComplete: "Simulation completed successfully.",
    simulationFailed: "Simulation failed. Check red nodes.",

    // Analytics
    throughputRatio: "PROCESSED TASKS",
    clusterLatency: "SAVED TIME",
    networkHealth: "TYPO ERRORS PREVENTED",
    simulatedEventsTitle: "ACTIVE INBOUNDS",
    throughputDesc: "Total actions triggered and resolved automatically by intelligent agents.",
    latencyDesc: "Working hours recovered by replacing repetitive keyboard typing with logic runs.",
    healthDesc: "Human data compilation errors prevented using intelligent validation models.",
    eventsDesc: "Connected external service APIs synced to this automation instance.",
    liveFeedRail: "REAL-TIME TASK VOLUME",
    throughputChartTitle: "Completed Automations Frequency",
    cognitiveCompiler: "COGNITIVE COMPILER",
    dynamicAiDiagnostics: "Dynamic AI Diagnostics",
    projectionConfidence: "PROJECTION CONFIDENCE:",
    activeHeuristicLabel: "Active System Heuristic Projection:",
    synthesizingMsg: "Generating real performance reports and loading metrics...",
    isolateLogsBtn: "Generate Reports",
    synthesizingBtn: "Analyzing Stats...",
    thisSession: "active integrations",

    // Theme tooltips / names
    settingsLabel: "SETTINGS // ESTADO",
    themeLight: "Light Theme",
    themeDark: "Dark Theme",
    langEn: "English",
    langPt: "Português",

    // Live Webhook Dispatch translations
    tabConfig: "Node Config",
    tabLiveTrigger: "Live Trigger 💬",
    triggerTitle: "Message Dispatch Center",
    triggerSubtitle: "Fire live integrations and dispatch real webhooks directly from this panel.",
    labelService: "Target Service Platform",
    labelWebhook: "Active Webhook / API URL",
    placeholderWebhook: "https://discord.com/api/webhooks/...",
    helpWebhook: "Insert a real Slack/Discord webhook URL or REST API endpoint to execute the flow for real. Leave empty to run a high-fidelity local simulation.",
    labelMessage: "Custom Message Body Payload",
    placeholderMessage: "⚡ ALERT: Atlas Flow automation loop completed successfully!",
    labelPayloadKey: "JSON Message Key Parameter",
    helpPayloadKey: "E.g.Use 'content' for Discord, 'text' for Slack, or custom key name for generic webhooks.",
    btnTriggerLive: "TRIGGER REAL DISPATCH",
    dispatchRunning: "DISPATCHING WORKFLOW",
    dispatchSuccessLog: "⚡ REAL WEBHOOK DISPATCHED SUCCESSFULLY! Protocol Status:",
    dispatchErrorLog: "❌ REAL WEBHOOK DISPATCH EXCEPTION: Server returned error status:",
    customKey: "Custom JSON Key"
  },
  pt: {
    // Header
    navCapabilities: "Recursos",
    navAutomationLab: "Laboratório",
    systemClock: "RELÓGIO DO SISTEMA:",
    sandboxMode: "SANDBOX",
    aiProdMode: "IA PROD",
    atlasConsoleBtn: "Console Atlas",
    workflowIntel: "INTELIGÊNCIA DE FLUXO",

    // Hero
    systemStatusOptimal: "STATUS DO SISTEMA: EXCELENTE",
    heroTitle: "Automação movida por inteligência.",
    heroSubtitle: "O Atlas Flow transforma processos de negócios complexos em sistemas automatizados inteligentes alimentados por IA de última geração. Telemetria em tempo real, roteamento resiliente e nós de decisão generativos compilados instantaneamente.",
    startAutomation: "Iniciar Automação",
    explorePlatform: "Explorar Plataforma",
    metricDailyOps: "Operações Diárias",
    metricAvgLatency: "Latência Média",
    metricUptime: "Meta de Uptime",
    flowCompilerTitle: "COMPILADOR DE FLUXO // v4.1",
    flowCompilerSubtitle: "Calcule, compile e roteie instantaneamente nós multiplataforma em tempo real.",
    compileBtn: "Compilar Fluxo de Lógica de IA",
    presetHeading: "MODELOS / BENCHMARKS RÁPIDOS",
    preset1Title: "Classificador Automatizado Zendesk",
    preset1Desc: "Classificador de tickets de clientes inbound e priorizador de registros de CRM.",
    preset2Title: "Espelhamento de Banco de Dados de Nuvem",
    preset2Desc: "Agenda tarefas de backup, calcula latência regional e transmite status.",
    preset3Title: "Escalonador de Pagamentos Stripe",
    preset3Desc: "Monitora logs massivos do Stripe e dispara alertas no Slack para de maior valor.",
    calculating: "Calculando capacidades...",

    // Features
    featuresTag: "Recursos da Plataforma // Arquiteturas Principais",
    featuresTitle: "Desenvolvido para executar fluxos em escala empresarial.",
    featuresSubtitle: "Configure, implante e monitore estruturas lógicas autorregenerativas capazes de executar ações automatizadas em massa sem intervenção humana.",
    diagnosticData: "DADOS DIAGNÓSTICOS //",

    // CTA
    executiveDemoPlatform: "PLATAFORMA DE TRABALHO EXECUTIVA",
    ctaTitle: "O futuro pertence às organizações automatizadas.",
    ctaSubtitle: "Garanta seu convite exclusivo para agendar credenciais de sandbox privadas. Execute testes de compilação em tempo real com nossos especialistas e isole multiplicadores estruturais para sua empresa.",
    gdprSecure: "Seguro LGPD / GDPR",
    gdprDesc: "Cofres de criptografia dupla",
    multiModel: "Multi-Modelo",
    multiModelDesc: "Otimizado para velocidade",
    calculateEfficiency: "Calcular Eficiência Operacional",
    calculateDesc: "Selecione parâmetros operacionais para computar as horas de ROI anual de retorno de investimento e reserve sua demonstração de equipe de sandbox dedicada.",
    companySize: "Tamanho da Empresa",
    primaryGoal: "Categoria de Automação Principal",
    hoursReclaimed: "Horas Recuperadas / Ano",
    targetRoi: "Fator de ROI Estimado",
    compEfficiency: "Eficiência Computada",
    businessEmail: "Endereço de E-mail Corporativo",
    ctaDisclaimer: "Ao clicar, você consente com a compilação paralela de projeções de simulação operacionais.",
    scheduleDemo: "Agendar uma Demo",
    calculatingCap: "CALCULANDO CAPACIDADES...",
    credentialsReservedHtml: "Nosso despacho do sistema marcou seu e-mail",
    credentialsReservedTitle: "Credenciais Reservadas!",
    credentialsReservedBody: "Um de nossos especialistas operacionais entrará em contato com suas credenciais de acesso exclusivas em até 2 horas.",
    invitationUuid: "UUID do Convite",

    // Console
    activeSimPlatform: "ESPAÇO DE TRABALHO ATIVO",
    consoleTitle: "Laboratório de Automação e Simulação Atlas",
    consoleSubtitle: "Inspecione fluxos de trabalho lógicos, simule execuções automatizadas e acompanhe estatísticas reais de produtividade.",
    simPipeline: "ESTADO DO FLUXO",
    readyToExec: "PRONTO PARA EXECUTAR",
    dashboardRatings: "MÉTRICAS ATIVAS",
    fastTelemetry: "AUDITORIA AO VIVO",
    clusterTelemetry: "Relatório de Produtividade da Automação",
    operationalNodeDispatch: "Fluxo de Transmissão de Log de Eventos",
    totalBufferedLines: "Eventos registrados em tempo real:",
    returnCapabilities: "Retornar para Recursos",
    triggerRunSimulation: "Disparar Simulação Teórica",
    interactiveFlowArchitecture: "Arquitetura Visual Interativa",
    runDiagnostics: "Executar Diagnóstico",
    clearLogs: "Limpar logs",
    liveExecutionStream: "Fluxo de Transmissão de Log Ativo",
    systemTerminalActive: "TERMINAL DE OPERAÇÕES ATIVADO",
    nodeTuningPlaceholder: "Selecione um nó de forma dinâmica no fluxo da tela acima para ajustar parâmetros de micro-serviço.",
    nodeTuningTitle: "Parâmetros de Ajuste Fino de Nó",
    renameNode: "Renomear Identificador",
    statusOverride: "Sobrescrita de Status",
    simulatedLatency: "Latência Simulada (ms)",
    applyChanges: "Gravar Modificações",

    // Nodes and edges labels (fallbacks)
    node1Label: "Trigger de Entrada de Clientes",
    node1Desc: "Escuta eventos de tickets recebidos em tempo real via webhook Zendesk.",
    node2Label: "Núcleo de Decisão Gemini",
    node2Desc: "Classifica sentimento do ticket, pontua riscos de cancelamento e extrai chaves.",
    node3Label: "Sincronizador Ledger Stripe",
    node3Desc: "Atualiza faturas e prioridades de cobrança no banco de dados corporativo.",
    node4Label: "Transmissão no Slack",
    node4Desc: "Dispara alertas de canais específicos para contas enterprise de alta fricção.",

    // Toast and other elements
    runningSimulation: "Iniciando simulação automatizada...",
    simulationComplete: "Simulação de fluxo completada com absoluto sucesso.",
    simulationFailed: "Fluxo falhou. Nós em estado crítico detectados.",

    // Analytics
    throughputRatio: "TAREFAS PROCESSADAS",
    clusterLatency: "TEMPO ECONOMIZADO",
    networkHealth: "ERROS PREVENIDOS",
    simulatedEventsTitle: "CANAIS ATIVOS",
    throughputDesc: "Ações totais disparadas e resolvidas de forma autônoma por agentes inteligentes.",
    latencyDesc: "Horas de trabalho recuperadas ao substituir tarefas repetitivas por fluxos inteligentes.",
    healthDesc: "Falhas de digitação e duplicidades de dados impedidas nas conexões de formulários.",
    eventsDesc: "Sistemas e aplicativos externos integrados em tempo real nesta instância de automação.",
    liveFeedRail: "VOLUME DE TAREFAS EM TEMPO REAL",
    throughputChartTitle: "Frequência de Automações Concluídas",
    cognitiveCompiler: "COMPILADOR GLOBAL",
    dynamicAiDiagnostics: "Relatórios de Produtividade Real",
    projectionConfidence: "CONFIANÇA DA PROJEÇÃO:",
    activeHeuristicLabel: "Análise Relevante de Desempenho Ativa:",
    synthesizingMsg: "Gerando análises reais do sistema de fluxo de trabalho...",
    isolateLogsBtn: "Gerar Relatório de Ganhos",
    synthesizingBtn: "Carregando Métricas...",
    thisSession: "conexões de automação",

    // Theme tooltips / names
    settingsLabel: "CONFIGURAÇÕES // IDIOMA",
    themeLight: "Modo Claro",
    themeDark: "Modo Escuro",
    langEn: "English",
    langPt: "Português",

    // Live Webhook Dispatch translations
    tabConfig: "Ajustar Nós",
    tabLiveTrigger: "Disparador Live 💬",
    triggerTitle: "Central de Disparo de Mensagens",
    triggerSubtitle: "Dispare integrações reais e envie webhooks ao vivo diretamente deste painel.",
    labelService: "Plataforma de Serviço Destino",
    labelWebhook: "Webhook Ativo / URL do Endpoint",
    placeholderWebhook: "https://discord.com/api/webhooks/...",
    helpWebhook: "Insira um webhook real do Slack/Discord ou endpoint REST para testar na prática. Deixe em branco para simulação local detalhada.",
    labelMessage: "Conteúdo Personalizado da Mensagem",
    placeholderMessage: "⚡ ALERTA: O fluxo de automação do Atlas Flow foi executado com sucesso!",
    labelPayloadKey: "Nome do Parâmetro JSON (Chave)",
    helpPayloadKey: "Ex: use 'content' para Discord, 'text' para Slack, ou nome personalizado para sua API.",
    btnTriggerLive: "DISPARAR INTEGRAÇÃO REAL",
    dispatchRunning: "INTEGRAÇÃO EM PROGRESSO",
    dispatchSuccessLog: "⚡ WEBHOOK REAL DISPARADO COM SUCESSO! Código de Status:",
    dispatchErrorLog: "❌ EXCEÇÃO NO DISPARO REAL: O servidor retornou o status de erro:",
    customKey: "Chave JSON Personalizada"
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("atlas_lang");
    return (saved === "pt" || saved === "en") ? saved : "en";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("atlas_theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("atlas_lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("atlas_theme", theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  const t = (key: string): string => {
    const userLangDict = translations[language];
    if (userLangDict && userLangDict[key]) {
      return userLangDict[key];
    }
    // Deep fallback
    return translations["en"][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
