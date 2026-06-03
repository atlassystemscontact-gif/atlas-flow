import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Features from "./components/Features";
import WorkflowVisualizer from "./components/WorkflowVisualizer";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Console from "./components/Console";
import CTA from "./components/CTA";
import { WorkflowNode, WorkflowEdge, AutomationLog } from "./types";
import { Cpu, BarChart2, Terminal as TermIcon } from "lucide-react";
import { useApp } from "./AppContext";

export default function App() {
  const { language, t } = useApp();
  const [currentTab, setCurrentTab] = useState<'landing' | 'console'>('landing');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);

  const [nodes, setNodes] = useState<WorkflowNode[]>([
    { id: "node-1", type: "trigger",      label: "Customer Inbound Trigger",  description: "Listens for customer ticket inbound requests on live Zendesk webhooks.", status: "success", latency: 4 },
    { id: "node-2", type: "ai_model",     label: "Gemini Decisive Hub",       description: "Classifies ticket text sentiment state and scores client retention risk indices.", status: "running", latency: 18 },
    { id: "node-3", type: "action",       label: "Stripe Ledger Sync",        description: "Modifies transaction priority levels and coordinates proactive CRM follow-ups.", status: "idle", latency: 0 },
    { id: "node-4", type: "notification", label: "Slack Instant Broadcast",   description: "Dispatches escalation alerts to priority staff vectors for high-value friction customers.", status: "idle", latency: 0 },
  ]);

  const [edges, setEdges] = useState<WorkflowEdge[]>([
    { id: "edge-1", source: "node-1", target: "node-2", animated: true },
    { id: "edge-2", source: "node-2", target: "node-3", animated: true },
    { id: "edge-3", source: "node-3", target: "node-4", animated: false },
  ]);

  const [logs, setLogs] = useState<AutomationLog[]>([
    { id: "boot-1", timestamp: "12:00:01 AM", nodeLabel: "Atlas Core Boot",  status: "info",    message: "Orchestrator online. Establishing encrypted SSL TLS communication tunnels...", latency: 0 },
    { id: "boot-2", timestamp: "12:00:02 AM", nodeLabel: "Data Plane DB",    status: "success", message: "Sunk replication indexes with central cloud ledger in US-East-1.", latency: 14 },
    { id: "boot-3", timestamp: "12:00:03 AM", nodeLabel: "Atman Engine",     status: "warning", message: "Sandbox test environment limits detected. Gemini API running on server telemetry proxy.", latency: 0 },
  ]);

  const handleAddLog = (log: AutomationLog) => setLogs((prev) => [log, ...prev]);
  const handleClearLogs = () => setLogs([]);

  const handleRunDiagnostic = () => {
    const timestamp = new Date().toLocaleTimeString();
    const diagnosticLogs: AutomationLog[] = [
      { id: `diag-${Date.now()}-1`, timestamp, nodeLabel: "Diagnostic Engine", status: "info",    message: "Booting central system-wide diagnostic check...",                                               latency: 0 },
      { id: `diag-${Date.now()}-2`, timestamp, nodeLabel: "Memory Pipeline",   status: "success", message: "Memory allocation audit: stable. Total allocation: 44.1MB, GC latency 1.4ms.",                latency: 2 },
      { id: `diag-${Date.now()}-3`, timestamp, nodeLabel: "Edge SSL Tunnel",   status: "success", message: "Gateway connectivity score: 100%. Handshakes verified with Stripe & Salesforce CRM.",          latency: 12 },
      { id: `diag-${Date.now()}-4`, timestamp, nodeLabel: "Atlas Flow DB",     status: "warning", message: "Database index sync warning: Thread AF-11 locked. Automatically migrating pool threads.",       latency: 35 },
    ];
    setLogs((prev) => [...diagnosticLogs, ...prev]);
  };

  const handleCompileWorkflow = async (prompt: string) => {
    setIsLoading(true);
    handleAddLog({
      id: `compile-init-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      nodeLabel: "AI Compiler",
      status: "info",
      message: `Analyzing prompt variables: "${prompt}"...`,
      latency: 0,
    });

    try {
      const response = await fetch("/api/gemini/generate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error(`Compile server failure: ${response.statusText}`);

      const data = await response.json();
      setUsingFallback(!!data.usingFallback);
      setNodes(data.nodes || []);
      setEdges(data.edges || []);

      handleAddLog({
        id: `compile-done-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        nodeLabel: "AI Compiler",
        status: "success",
        message: `Successfully compiled automation workflow with ${data.nodes?.length} nodes and connected dependencies.`,
        latency: 45,
      });

      setCurrentTab('console');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } catch (error: any) {
      handleAddLog({
        id: `compile-err-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        nodeLabel: "AI Compiler",
        status: "error",
        message: `Workflow compiler critical error: ${error.message || "Parse exception"}. Fallback nodes retained.`,
        latency: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen text-slate-100 flex flex-col font-sans"
      id="atlas-flow-app-container"
      style={{ background: '#050509' }}
    >
      {/* Top scanline */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent pointer-events-none -z-10 animate-scanline" />

      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} usingFallback={usingFallback} />

      {currentTab === 'landing' ? (

        <div className="flex flex-col">

          {/* Hero */}
          <Hero onCompile={handleCompileWorkflow} isLoading={isLoading} onExploreLab={() => setCurrentTab('console')} />

          {/* Simulation Workspace */}
          <section
            className="py-20 px-6 relative overflow-hidden"
            id="landing-visualizer-container"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,8,18,0.5)' }}
          >
            <div className="absolute inset-0 tech-grid opacity-[0.15] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-neon-blue/[0.035] blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full relative z-10">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="inline-flex items-center gap-2 font-mono text-[9px] text-neon-blue/70 uppercase tracking-[0.18em] font-bold px-3.5 py-1.5 rounded-full badge-electric mb-5">
                  <span className="w-1 h-1 rounded-full bg-neon-blue flex-shrink-0" />
                  {language === "pt" ? "Espaço de Simulação" : "Simulation Workspace"}
                </span>
                <h3 className="font-display font-bold text-3xl sm:text-4xl text-gradient-white mt-4 tracking-tight leading-tight">
                  {language === "pt" ? "Inspecione operações compiladas." : "Inspect compiled operations."}
                </h3>
                <p className="font-sans text-white/30 text-sm mt-4 leading-relaxed font-light">
                  {language === "pt"
                    ? "Interaja com os nós do fluxo abaixo. Modifique parâmetros no configurador lateral ou clique em 'Simular Execuções'."
                    : "Interact with workflow nodes. Modify parameters in the side configurator or click 'Trigger Run Simulation'."}
                </p>
              </div>

              <WorkflowVisualizer nodes={nodes} edges={edges} onTriggerLog={handleAddLog} onUpdateNodes={setNodes} />
            </div>
          </section>

          {/* Features */}
          <Features />

          {/* CTA */}
          <CTA />

        </div>

      ) : (

        /* ── Console / Lab Tab ── */
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10" id="console-tab-stage">

          {/* Console header bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/[0.05]">
            <div>
              <div className="inline-flex items-center gap-2 badge-amber px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest mb-3 font-bold">
                <Cpu className="w-3.5 h-3.5 flex-shrink-0 animate-pulse-slow" />
                <span>{t("activeSimPlatform")}</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gradient-white tracking-tight leading-none">
                {t("consoleTitle")}
              </h2>
              <p className="font-sans text-white/30 text-sm mt-2 font-light">
                {t("consoleSubtitle")}
              </p>
            </div>

            {/* Live status indicators */}
            <div
              className="rounded-xl p-4 flex items-center gap-5 font-mono text-[10px] w-full md:w-auto flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div>
                <span className="text-white/20 block uppercase tracking-wider mb-0.5">{t("simPipeline")}</span>
                <span className="text-emerald-400/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  {t("readyToExec")}
                </span>
              </div>
              <div className="w-px h-8 bg-white/[0.06]" />
              <div>
                <span className="text-white/20 block uppercase tracking-wider mb-0.5">{t("dashboardRatings")}</span>
                <span className="text-amber-400/80 font-bold uppercase tracking-wider">
                  {t("fastTelemetry")}
                </span>
              </div>
            </div>
          </div>

          {/* Workflow Diagram */}
          <div className="space-y-5">
            <WorkflowVisualizer nodes={nodes} edges={edges} onTriggerLog={handleAddLog} onUpdateNodes={setNodes} />
          </div>

          <div className="divider-gradient" />

          {/* Analytics + Console split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Analytics */}
            <div className="lg:col-span-6 space-y-5">
              <div className="pb-3 border-b border-white/[0.05] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div>
                  <span className="font-mono text-[9px] text-amber-400/60 uppercase tracking-[0.15em] block">STATS</span>
                  <h4 className="font-display font-semibold text-sm text-white">{t("clusterTelemetry")}</h4>
                </div>
              </div>
              <AnalyticsDashboard logsCount={logs.length} />
            </div>

            {/* Terminal */}
            <div className="lg:col-span-6 space-y-5">
              <div className="pb-3 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg" style={{ background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)' }}>
                    <TermIcon className="w-3.5 h-3.5 text-neon-purple" />
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-neon-purple/60 uppercase tracking-[0.15em] block">LOGS</span>
                    <h4 className="font-display font-semibold text-sm text-white">{t("operationalNodeDispatch")}</h4>
                  </div>
                </div>
                <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                  {t("totalBufferedLines")} {logs.length}
                </span>
              </div>
              <Console logs={logs} onClear={handleClearLogs} onRunDiagnostic={handleRunDiagnostic} />
            </div>

          </div>

          {/* Back button */}
          <div className="pt-10 border-t border-white/[0.05] flex justify-center">
            <button
              id="return-landing-bot-btn"
              onClick={() => setCurrentTab('landing')}
              className="btn-glass px-7 py-2.5 rounded-xl font-semibold text-[13px] transition-all cursor-pointer"
            >
              {t("returnCapabilities")}
            </button>
          </div>

        </div>

      )}

      {/* ── Footer ── */}
      <footer
        className="border-t py-12 px-6 mt-auto font-sans text-xs"
        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(3,3,9,0.95)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-display font-extrabold text-white tracking-tight text-base flex items-center gap-0 leading-none">
              ATLAS<span className="text-gradient-amber">FLOW</span>
            </span>
            <span className="font-mono text-[9px] text-white/15 tracking-[0.18em] uppercase">
              CRAFTED WITH INTELLECTUAL MINIMALISM © 2026 ATLAS FLOW INC.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-white/20 font-mono text-[10px]">
            <a href="#hero-section"    className="hover:text-amber-400/70 transition-colors uppercase tracking-wider">ROOT</a>
            <span className="text-white/10">·</span>
            <a href="#features-anchor" className="hover:text-amber-400/70 transition-colors uppercase tracking-wider">CAPABILITIES</a>
            <span className="text-white/10">·</span>
            <span className="text-white/25 uppercase tracking-wider">
              STATUS: <strong className="text-emerald-400/70 font-semibold">OPERATIONAL</strong>
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
