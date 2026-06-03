import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { WorkflowNode, WorkflowEdge, AutomationLog } from "../types";
import { Sparkles, Shield, Layers, AlertCircle, CheckCircle, Clock, RefreshCw, Sliders, Copy, Download } from "lucide-react";
import { useApp } from "../AppContext";

interface WorkflowVisualizerProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onTriggerLog: (log: AutomationLog) => void;
  onUpdateNodes: (nodes: WorkflowNode[]) => void;
}

export default function WorkflowVisualizer({ nodes, edges, onTriggerLog, onUpdateNodes }: WorkflowVisualizerProps) {
  const { t, language } = useApp();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeSimulationIndex, setActiveSimulationIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [dispatchSuccessPulse, setDispatchSuccessPulse] = useState<boolean>(false);

  const [sidebarTab, setSidebarTab] = useState<'config' | 'trigger'>('config');
  const [service, setService] = useState<'slack' | 'discord' | 'custom' | 'email' | 'telegram'>('discord');
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [messageText, setMessageText] = useState<string>("");
  const [payloadKey, setPayloadKey] = useState<string>("content");

  useEffect(() => {
    if (service === 'discord') setPayloadKey('content');
    else if (service === 'slack') setPayloadKey('text');
    else setPayloadKey('message');
  }, [service]);

  useEffect(() => {
    if (nodes.length > 0 && !selectedNodeId) setSelectedNodeId(nodes[0].id);
  }, [nodes]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleLaunchSimulation = async () => {
    if (isSimulating || nodes.length === 0) return;
    setIsSimulating(true);
    let currentNodesState: WorkflowNode[] = nodes.map((n) => ({ ...n, status: 'idle' }));
    onUpdateNodes(currentNodesState);
    onTriggerLog({
      id: "sim-log-" + Date.now() + "-start",
      timestamp: new Date().toLocaleTimeString(),
      nodeLabel: "Atman Automata Core",
      status: "info",
      message: language === "pt" ? "Iniciando simulação de sequência de automação em todo o sistema..." : "Starting system-wide automation sequence simulation...",
      latency: 0,
    });

    for (let i = 0; i < nodes.length; i++) {
      setActiveSimulationIndex(i);
      currentNodesState = currentNodesState.map((n, idx) => idx === i ? { ...n, status: 'running' as const } : n);
      onUpdateNodes(currentNodesState);
      onTriggerLog({
        id: `sim-log-${Date.now()}-${i}-init`,
        timestamp: new Date().toLocaleTimeString(),
        nodeLabel: nodes[i].label,
        status: "info",
        message: language === "pt" ? `Ativando framework de subsistema para "${nodes[i].label}"` : `Activating target subsystem framework for "${nodes[i].label}"`,
        latency: 12,
      });

      await new Promise((r) => setTimeout(r, 1500));
      const isSuccess = Math.random() > 0.04;
      const finalStatus = isSuccess ? 'success' as const : 'error' as const;
      currentNodesState = currentNodesState.map((n, idx) => idx === i ? { ...n, status: finalStatus, latency: Math.floor(Math.random() * 45) + 5 } : n);
      onUpdateNodes(currentNodesState);
      onTriggerLog({
        id: `sim-log-${Date.now()}-${i}-done`,
        timestamp: new Date().toLocaleTimeString(),
        nodeLabel: nodes[i].label,
        status: isSuccess ? "success" : "error",
        message: isSuccess
          ? (language === "pt" ? `Sub-rotina executada com sucesso. Parâmetros atualizados.` : `Executed instruction sub-routine cleanly. Parameters updated.`)
          : (language === "pt" ? `Exceção: Limite TLS excedido. Iniciando autocura.` : `Execution exception: TLS timeout. Retrying healing heuristics.`),
        latency: Math.floor(Math.random() * 45) + 5,
      });
      if (!isSuccess) break;
    }
    setIsSimulating(false);
    setActiveSimulationIndex(null);
  };

  const handleUpdateNodeLabel = (id: string, newLabel: string) => {
    onUpdateNodes(nodes.map((n) => (n.id === id ? { ...n, label: newLabel } : n)));
  };

  const handleUpdateNodeDesc = (id: string, newDesc: string) => {
    onUpdateNodes(nodes.map((n) => (n.id === id ? { ...n, description: newDesc } : n)));
  };

  const handleLiveWebhookDispatch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (isSimulating || nodes.length === 0) return;
    setIsSimulating(true);
    onTriggerLog({
      id: "live-dispatch-" + Date.now() + "-start",
      timestamp: new Date().toLocaleTimeString(),
      nodeLabel: "Live Trigger Engine",
      status: "info",
      message: language === "pt"
        ? `Iniciando disparo live via: ${service.toUpperCase()}. Buscando endpoint...`
        : `Starting live dispatch via: ${service.toUpperCase()}. Querying destination...`,
      latency: 0,
    });
    let currentNodesState: WorkflowNode[] = nodes.map((n) => ({ ...n, status: 'idle' }));
    onUpdateNodes(currentNodesState);

    for (let i = 0; i < nodes.length; i++) {
      setActiveSimulationIndex(i);
      currentNodesState = currentNodesState.map((n, idx) => idx === i ? { ...n, status: 'running' as const } : n);
      onUpdateNodes(currentNodesState);

      let stepMessage = "";
      if (i === 0) {
        stepMessage = language === "pt"
          ? `Sinal capturado. Payload: "${messageText || 'Teste de automação'}"`
          : `Sensor intercepted signal. Payload: "${messageText || 'Automation speed test payload'}"`;
      } else if (i === 1) {
        stepMessage = language === "pt"
          ? `Análise cognitiva Gemini finalizada. Status heurístico: ÓTIMO.`
          : `Cognitive audit complete. Heuristic safety status: OPTIMAL.`;
      } else if (i === 2) {
        stepMessage = language === "pt"
          ? `Registro salvo com segurança nas tabelas do banco distribuído.`
          : `State synchronized inside distributed data registers.`;
      } else {
        stepMessage = language === "pt"
          ? `Executando disparo de transmissão corporativa...`
          : `Executing corporate message packet transmission...`;
      }

      onTriggerLog({
        id: `live-dispatch-${Date.now()}-${i}-init`,
        timestamp: new Date().toLocaleTimeString(),
        nodeLabel: nodes[i].label,
        status: "info",
        message: stepMessage,
        latency: 10,
      });

      await new Promise((resolve) => setTimeout(resolve, 1400));
      let nodeSuccess = true;

      if (i === nodes.length - 1) {
        if (webhookUrl) {
          try {
            onTriggerLog({
              id: `live-dispatch-${Date.now()}-${i}-real-init`,
              timestamp: new Date().toLocaleTimeString(),
              nodeLabel: nodes[i].label,
              status: "info",
              message: language === "pt"
                ? `Enviando POST real para: "${webhookUrl}"...`
                : `Sending real POST to webhook: "${webhookUrl}"...`,
              latency: 12,
            });
            const res = await fetch("/api/dispatch-message", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                service, webhookUrl,
                messageText: messageText || (language === "pt" ? "⚡ ALERTA: Automação Atlas Flow disparada!" : "⚡ ALERT: Atlas Flow automation triggered!"),
                payloadKey,
              }),
            });
            const data = await res.json();
            if (data.success) {
              nodeSuccess = true;
              onTriggerLog({
                id: `live-dispatch-${Date.now()}-${i}-real-success`,
                timestamp: new Date().toLocaleTimeString(),
                nodeLabel: nodes[i].label,
                status: "success",
                message: language === "pt"
                  ? `${t("dispatchSuccessLog")} ${data.status || 200}. Resposta: ${data.body || "OK"}`
                  : `${t("dispatchSuccessLog")} ${data.status || 200}. Response: ${data.body || "OK"}`,
                latency: 55,
              });
            } else {
              nodeSuccess = false;
              onTriggerLog({
                id: `live-dispatch-${Date.now()}-${i}-real-fail`,
                timestamp: new Date().toLocaleTimeString(),
                nodeLabel: nodes[i].label,
                status: "error",
                message: language === "pt"
                  ? `${t("dispatchErrorLog")} ${data.status || 500}. Detalhes: ${data.error || "Sem resposta"}`
                  : `${t("dispatchErrorLog")} ${data.status || 500}. Details: ${data.error || "No details"}`,
                latency: 60,
              });
            }
          } catch (err: any) {
            nodeSuccess = false;
            onTriggerLog({
              id: `live-dispatch-${Date.now()}-${i}-real-err`,
              timestamp: new Date().toLocaleTimeString(),
              nodeLabel: nodes[i].label,
              status: "error",
              message: `Outbound proxy exception: ${err.message || 'Network unreachable'}`,
              latency: 0,
            });
          }
        } else {
          onTriggerLog({
            id: `live-dispatch-${Date.now()}-${i}-local-done`,
            timestamp: new Date().toLocaleTimeString(),
            nodeLabel: nodes[i].label,
            status: "success",
            message: language === "pt"
              ? `📢 Transmissão simulada para ${service.toUpperCase()}! (Insira Webhook URL para disparo real)`
              : `📢 Simulated broadcast for ${service.toUpperCase()}! (Supply Webhook URL for real dispatch)`,
            latency: 15,
          });
        }
      }

      const finalStatus = nodeSuccess ? 'success' as const : 'error' as const;
      currentNodesState = currentNodesState.map((n, idx) =>
        idx === i ? { ...n, status: finalStatus, latency: Math.floor(Math.random() * 25) + 5 } : n
      );
      onUpdateNodes(currentNodesState);

      if (i === nodes.length - 1 && nodeSuccess) {
        setDispatchSuccessPulse(true);
        setTimeout(() => setDispatchSuccessPulse(false), 2200);
      }
      if (!nodeSuccess) break;
    }
    setIsSimulating(false);
    setActiveSimulationIndex(null);
  };

  const handleCopySchema = () => {
    const rawSchema = JSON.stringify({ nodes, edges }, null, 2);
    navigator.clipboard.writeText(rawSchema).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownloadSchema = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "atlas-automation-flow.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="visualizer-root">

      {/* ── Simulation Stage ── */}
      <div
        className="lg:col-span-8 relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden min-h-[500px]"
        id="sim-stage-container"
        style={{ background: 'rgba(6,6,16,0.7)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
      >
        {/* Success pulse overlay */}
        {dispatchSuccessPulse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0.45, 0] }}
            transition={{ duration: 2, times: [0, 0.25, 0.75, 1], ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl pointer-events-none z-20"
            style={{ background: 'rgba(16,185,129,0.04)', boxShadow: 'inset 0 0 60px rgba(16,185,129,0.2)' }}
          />
        )}

        {/* Grid background */}
        <div className="absolute inset-0 tech-grid-cyan opacity-20 pointer-events-none -z-10 animate-grid-move" />

        {/* Corner marks */}
        <div className="absolute top-0 left-0 w-4 h-px bg-amber-500/50" />
        <div className="absolute top-0 left-0 w-px h-4 bg-amber-500/50" />
        <div className="absolute top-0 right-0 w-4 h-px bg-amber-500/30" />
        <div className="absolute top-0 right-0 w-px h-4 bg-amber-500/30" />
        <div className="absolute bottom-0 left-0 w-4 h-px bg-neon-blue/30" />
        <div className="absolute bottom-0 left-0 w-px h-4 bg-neon-blue/30" />
        <div className="absolute bottom-0 right-0 w-4 h-px bg-neon-blue/30" />
        <div className="absolute bottom-0 right-0 w-px h-4 bg-neon-blue/30" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.05] mb-8 z-10">
          <div>
            <div className="text-[9px] font-mono text-amber-400/60 tracking-[0.18em] uppercase mb-1">
              {language === "pt" ? "INTEGRAÇÃO EM TEMPO REAL" : "REAL-TIME EXECUTION INTEGRATION"}
            </div>
            <h3 className="font-display font-bold text-xl text-white flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-amber-400 animate-pulse-slow flex-shrink-0" />
              {t("workflowStageTitle")}
            </h3>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Schema actions */}
            <div className="flex items-center rounded-lg p-1 gap-0.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={handleCopySchema}
                title={language === "pt" ? "Copiar schema JSON" : "Copy schema JSON"}
                className="p-1.5 hover:bg-white/[0.06] text-white/30 hover:text-white/60 rounded-md transition-colors text-xs"
              >
                {copied ? (
                  <span className="text-amber-400 text-[9px] uppercase font-mono px-1">{language === "pt" ? "Copiado!" : "Copied!"}</span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={handleDownloadSchema}
                title={language === "pt" ? "Baixar arquivo de fluxo" : "Download flow file"}
                className="p-1.5 hover:bg-white/[0.06] text-white/30 hover:text-white/60 rounded-md transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Simulate button */}
            <button
              onClick={handleLaunchSimulation}
              disabled={isSimulating}
              className={`px-5 py-2.5 rounded-xl font-sans font-bold text-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer w-full sm:w-auto ${
                isSimulating
                  ? 'border border-neon-purple/30 text-neon-purple cursor-not-allowed animate-pulse'
                  : 'btn-amber'
              }`}
              style={isSimulating ? { background: 'rgba(129,140,248,0.1)' } : {}}
              id="simulate-actions-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 flex-shrink-0 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>
                {isSimulating
                  ? (language === "pt" ? "SIMULAÇÃO EM CURSO" : "SIMULATION RUNNING")
                  : (language === "pt" ? "SIMULAR EXECUÇÕES" : "TRIGGER RUN SIMULATION")}
              </span>
            </button>
          </div>
        </div>

        {/* Nodes canvas */}
        <div
          className="my-auto py-10 overflow-x-auto select-none flex flex-col md:flex-row justify-around items-stretch md:items-center gap-8 relative z-10"
          id="nodes-canvas-stream"
        >
          {nodes.map((node, index) => {
            const isSelected = selectedNodeId === node.id;
            const isActive = activeSimulationIndex === index;

            return (
              <div key={node.id} className="flex-1 min-w-[190px] relative flex flex-col items-center">

                {/* SVG connector wire */}
                {index < nodes.length - 1 && (
                  <div className="hidden md:block absolute left-full top-[115px] -translate-y-1/2 w-[110%] h-4 pointer-events-none -z-10 overflow-visible">
                    <svg className="w-full h-full" style={{ overflow: 'visible' }}>
                      <line
                        x1="0" y1="10" x2="100%" y2="10"
                        stroke={
                          node.status === 'success' ? 'rgba(16,185,129,0.5)'
                          : node.status === 'running' ? 'rgba(129,140,248,0.45)'
                          : 'rgba(255,255,255,0.06)'
                        }
                        strokeWidth="1.5"
                        className={node.status === 'success' || node.status === 'running' ? 'wire-animated' : ''}
                      />
                      {(node.status === 'success' || node.status === 'running') && (
                        <circle cx="50%" cy="10" r="3.5" fill="#f59e0b" className="glow-amber">
                          <animate attributeName="cx" values="0%;100%" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      )}
                    </svg>
                  </div>
                )}

                {/* Step label */}
                <div className="font-mono text-[9px] mb-2.5 tracking-[0.15em] text-white/20 flex items-center gap-1.5 uppercase">
                  <span>STEP</span>
                  <span className="text-amber-400/70 font-bold">0{index + 1}</span>
                </div>

                {/* Node Card — motion.div with original animate props preserved */}
                <motion.div
                  layout
                  onClick={() => setSelectedNodeId(node.id)}
                  animate={{
                    borderColor: isSelected
                      ? "rgba(245, 158, 11, 0.8)"
                      : node.status === 'running'
                      ? "rgba(129, 140, 248, 0.7)"
                      : node.status === 'success'
                      ? "rgba(16, 185, 129, 0.55)"
                      : node.status === 'error'
                      ? "rgba(244, 63, 94, 0.7)"
                      : "rgba(255,255,255,0.06)",
                    boxShadow: isSelected
                      ? "0 0 24px rgba(245,158,11,0.18)"
                      : node.status === 'running'
                      ? "0 0 24px rgba(129,140,248,0.25)"
                      : node.status === 'success'
                      ? "0 0 16px rgba(16,185,129,0.12)"
                      : node.status === 'error'
                      ? "0 0 22px rgba(244,63,94,0.18)"
                      : "0 0 0px rgba(0,0,0,0)",
                    backgroundColor: isSelected
                      ? "rgba(12,12,24,0.95)"
                      : node.status === 'running'
                      ? "rgba(129,140,248,0.05)"
                      : "rgba(6,6,18,0.80)",
                    scale: isSelected ? 1.05 : 1.0,
                  }}
                  transition={{
                    borderColor: { duration: 0.35, ease: "easeInOut" },
                    boxShadow: { duration: 0.35, ease: "easeInOut" },
                    backgroundColor: { duration: 0.35, ease: "easeInOut" },
                    scale: { type: "spring", stiffness: 450, damping: 15 },
                  }}
                  className={`w-full p-4 rounded-xl border backdrop-blur-md cursor-pointer relative flex flex-col justify-between min-h-[145px] h-auto pb-4 ${
                    isActive ? 'ring-2 ring-neon-purple/50 ring-offset-1 ring-offset-transparent' : ''
                  }`}
                >
                  {/* Running pulse */}
                  {node.status === 'running' && (
                    <div className="absolute inset-0 rounded-xl border border-neon-purple/40 animate-pulse pointer-events-none" />
                  )}

                  <div>
                    {/* Card header row */}
                    <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-white/[0.05] mb-2.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-white/25 truncate">
                        {node.type}
                      </span>
                      <div className="flex items-center gap-1.5 relative w-3.5 h-3.5 justify-center">
                        <motion.div
                          animate={{
                            backgroundColor:
                              node.status === 'running'  ? "rgba(129,140,248,1)"
                              : node.status === 'success' ? "rgba(16,185,129,1)"
                              : node.status === 'error'   ? "rgba(244,63,94,1)"
                              : "rgba(71,85,105,1)",
                            boxShadow:
                              node.status === 'running'  ? "0 0 8px rgba(129,140,248,0.8)"
                              : node.status === 'success' ? "0 0 8px rgba(16,185,129,0.8)"
                              : node.status === 'error'   ? "0 0 8px rgba(244,63,94,0.8)"
                              : "0 0 0px rgba(0,0,0,0)",
                          }}
                          transition={{ duration: 0.25 }}
                          className="w-1.5 h-1.5 rounded-full absolute"
                        />
                        {node.status === 'running' && (
                          <motion.span
                            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 rounded-full bg-neon-purple absolute"
                          />
                        )}
                      </div>
                    </div>

                    <h4 className="font-display font-bold text-[13px] text-white leading-tight mb-2 truncate">
                      {node.label}
                    </h4>

                    <p className="font-sans text-[10px] text-white/30 font-light line-clamp-3 leading-relaxed">
                      {node.description}
                    </p>
                  </div>
                </motion.div>

                {/* Mobile vertical connector */}
                {index < nodes.length - 1 && (
                  <div className="md:hidden w-px h-8 border-l border-dashed border-amber-500/20 my-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/[0.05] mt-6 flex flex-wrap justify-between items-center gap-4 text-white/25 font-mono text-[9px] z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <span>ACTIVE MODEL: <strong className="text-white/40">gemini-3.5-flash</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400/60">{language === "pt" ? "SISTEMA OPERACIONAL" : "SYSTEM OPERATIONAL"}</span>
          </div>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div
        className="lg:col-span-4 rounded-2xl p-0 flex flex-col overflow-hidden"
        id="param-controller-sidebar"
        style={{ background: 'rgba(6,6,16,0.75)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}
      >
        {/* Sidebar Tabs */}
        <div className="flex border-b overflow-hidden" id="sidebar-tab-selectors" style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(4,4,12,0.6)' }}>
          <button
            onClick={() => setSidebarTab('config')}
            className={`flex-1 py-3 text-[10px] font-mono tracking-[0.14em] font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 uppercase ${
              sidebarTab === 'config'
                ? 'border-amber-500 text-amber-400 bg-amber-500/[0.05]'
                : 'border-transparent text-white/25 hover:text-white/50 hover:bg-white/[0.02]'
            }`}
          >
            <Sliders className={`w-3 h-3 ${sidebarTab === 'config' ? 'text-amber-400' : 'text-white/25'}`} />
            <span>{t("tabConfig")}</span>
          </button>
          <button
            onClick={() => setSidebarTab('trigger')}
            className={`flex-1 py-3 text-[10px] font-mono tracking-[0.14em] font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 uppercase ${
              sidebarTab === 'trigger'
                ? 'border-neon-purple text-neon-purple bg-neon-purple/[0.05]'
                : 'border-transparent text-white/25 hover:text-white/50 hover:bg-white/[0.02]'
            }`}
          >
            <Sparkles className={`w-3 h-3 ${sidebarTab === 'trigger' ? 'text-neon-purple' : 'text-white/25'}`} />
            <span>{t("tabLiveTrigger")}</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col p-5 overflow-y-auto">

          {sidebarTab === 'config' ? (
            selectedNode ? (
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                <div className="space-y-4 font-sans text-xs">

                  <div>
                    <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.16em] block mb-2">
                      {t("logicalId")}
                    </label>
                    <div className="rounded-xl p-2.5 font-mono text-amber-400 text-xs" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(245,158,11,0.15)' }}>
                      {selectedNode.id}
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.16em] block mb-1.5">
                      {t("subLabel")}
                    </label>
                    <input
                      type="text"
                      value={selectedNode.label}
                      onChange={(e) => handleUpdateNodeLabel(selectedNode.id, e.target.value)}
                      className="w-full input-premium rounded-xl p-2.5 text-white/80 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.16em] block mb-1.5">
                      {t("actionInstructions")}
                    </label>
                    <textarea
                      value={selectedNode.description}
                      onChange={(e) => handleUpdateNodeDesc(selectedNode.id, e.target.value)}
                      rows={4}
                      className="w-full input-premium rounded-xl p-2.5 text-white/80 text-xs focus:outline-none leading-relaxed resize-none"
                    />
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.16em] block mb-2">
                      {t("systemStatusDiagnostic")}
                    </span>
                    <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {selectedNode.status === 'success' && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
                          <CheckCircle className="w-4 h-4" />
                          <span>{t("healthyOperations")}</span>
                        </div>
                      )}
                      {selectedNode.status === 'running' && (
                        <div className="flex items-center gap-1.5 text-neon-purple font-mono text-[10px] animate-pulse">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{t("executingTransaction")}</span>
                        </div>
                      )}
                      {selectedNode.status === 'error' && (
                        <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[10px]">
                          <AlertCircle className="w-4 h-4" />
                          <span>{t("heuristicError")}</span>
                        </div>
                      )}
                      {selectedNode.status === 'idle' && (
                        <div className="flex items-center gap-1.5 text-white/30 font-mono text-[10px]">
                          <Clock className="w-4 h-4" />
                          <span>{t("standbyMode")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-white/20 font-sans text-xs flex-1">
                {t("noNodeSelected")}
              </div>
            )
          ) : (
            /* ── Live Dispatch Tab ── */
            <form onSubmit={handleLiveWebhookDispatch} className="space-y-4 font-sans text-xs flex-1 flex flex-col justify-between" id="live-webhook-form">
              <div className="space-y-4">

                <div className="pb-3 border-b border-white/[0.05] flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-neon-purple animate-pulse flex-shrink-0" />
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white">{t("triggerTitle")}</h4>
                    <p className="text-[10px] text-white/25 mt-0.5">{t("triggerSubtitle")}</p>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] block mb-1.5">
                    {t("labelService")}
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value as any)}
                    className="w-full input-premium rounded-xl p-2.5 text-white/70 text-xs focus:outline-none cursor-pointer font-mono"
                  >
                    <option value="discord">Discord Webhook</option>
                    <option value="slack">Slack Webhook</option>
                    <option value="custom">Custom Webhook / REST POST API</option>
                    <option value="telegram">Telegram Bot Alert (Simulated)</option>
                    <option value="email">E-mail SMTP Dispatcher (Simulated)</option>
                  </select>
                </div>

                {['discord', 'slack', 'custom'].includes(service) && (
                  <div>
                    <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] block mb-1.5">
                      {t("labelWebhook")}
                    </label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder={
                        service === 'discord' ? "https://discord.com/api/webhooks/..."
                        : service === 'slack' ? "https://hooks.slack.com/services/..."
                        : "https://my-api-server.com/api/alerts"
                      }
                      className="w-full input-premium rounded-xl p-2.5 text-white/60 text-[11px] focus:outline-none font-mono"
                    />
                    <p className="text-[9px] text-white/20 mt-1 leading-relaxed">{t("helpWebhook")}</p>
                  </div>
                )}

                {service === 'custom' && (
                  <div>
                    <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] block mb-1.5">
                      {t("labelPayloadKey")}
                    </label>
                    <input
                      type="text"
                      value={payloadKey}
                      onChange={(e) => setPayloadKey(e.target.value)}
                      placeholder="E.g. message, alarm, text, content"
                      className="w-full input-premium rounded-xl p-2.5 text-white/60 text-[11px] focus:outline-none font-mono"
                    />
                    <p className="text-[9px] text-white/20 mt-1">{t("helpPayloadKey")}</p>
                  </div>
                )}

                <div>
                  <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] block mb-1.5">
                    {t("labelMessage")}
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={t("placeholderMessage")}
                    rows={4}
                    className="w-full input-premium rounded-xl p-2.5 text-white/60 text-xs focus:outline-none leading-relaxed resize-none"
                  />
                </div>

                {/* JSON Preview */}
                <div className="rounded-xl p-3 font-mono text-[11px] text-white/35" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/[0.05] select-none">
                    <span className="text-[9px] text-amber-400/60 font-semibold uppercase tracking-wider">JSON Outbound Preview</span>
                    <span className="text-[8px] text-white/20 uppercase">POST / BODY</span>
                  </div>
                  <pre className="overflow-x-auto p-1 leading-5 text-white/30 font-mono text-xs select-text">
                    <span className="text-white/15">{"{"}</span>
                    <br />
                    {service === "email" ? (
                      <>
                        <span className="pl-4 text-neon-blue/60">"dispatcher"</span><span className="text-white/20">: </span><span className="text-amber-400/60">"SMTP_SERVER_MOCK"</span><span className="text-white/15">,</span><br />
                        <span className="pl-4 text-neon-blue/60">"recipient"</span><span className="text-white/20">: </span><span className="text-amber-400/60">"user@example.com"</span><span className="text-white/15">,</span><br />
                        <span className="pl-4 text-neon-blue/60">"body"</span><span className="text-white/20">: </span><span className="text-amber-400/60">"{messageText || "⚡ ALERT: Atlas Flow triggered!"}"</span>
                      </>
                    ) : service === "telegram" ? (
                      <>
                        <span className="pl-4 text-neon-blue/60">"chat_id"</span><span className="text-white/20">: </span><span className="text-amber-400/60">"telegram_simulated"</span><span className="text-white/15">,</span><br />
                        <span className="pl-4 text-neon-blue/60">"text"</span><span className="text-white/20">: </span><span className="text-amber-400/60">"{messageText || "⚡ ALERT: Atlas Flow triggered!"}"</span>
                      </>
                    ) : (
                      <>
                        <span className="pl-4 text-neon-blue/60">"{service === "slack" ? "text" : service === "discord" ? "content" : payloadKey || "message"}"</span>
                        <span className="text-white/20">: </span>
                        <span className="text-amber-400/60">"{messageText || "⚡ ALERT: Atlas Flow triggered!"}"</span>
                      </>
                    )}
                    <br />
                    <span className="text-white/15">{"}"}</span>
                  </pre>
                </div>
              </div>

              {/* Dispatch button */}
              <div className="pt-4 border-t border-white/[0.05]">
                <button
                  type="submit"
                  disabled={isSimulating}
                  className={`w-full py-3 rounded-xl font-sans font-bold text-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSimulating
                      ? 'border border-neon-purple/25 text-neon-purple cursor-not-allowed animate-pulse'
                      : 'btn-electric'
                  }`}
                  style={isSimulating ? { background: 'rgba(129,140,248,0.08)' } : {}}
                  id="submit-live-dispatch-btn"
                >
                  <RefreshCw className={`w-3.5 h-3.5 flex-shrink-0 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? t("dispatchRunning") : t("btnTriggerLive")}</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Sidebar footer */}
        <div className="px-5 pb-5 pt-4 border-t border-white/[0.05] grid grid-cols-2 gap-2 text-center font-mono text-[9px]">
          <div className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="block text-white/20 uppercase tracking-wider mb-0.5">SYSTEM STACK</span>
            <span className="text-white/50 font-medium">NodeJS 22</span>
          </div>
          <div className="rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="block text-white/20 uppercase tracking-wider mb-0.5">API CHAT</span>
            <span className="text-amber-400/60 font-medium">HTTP REST</span>
          </div>
        </div>
      </div>

    </div>
  );
}
