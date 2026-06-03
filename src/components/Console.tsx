import { useState } from "react";
import { AutomationLog } from "../types";
import { Terminal as TermIcon, ShieldAlert, Trash2, Download, Search, Check, AlertTriangle, Info, RefreshCw } from "lucide-react";
import { useApp } from "../AppContext";

interface ConsoleProps {
  logs: AutomationLog[];
  onClear: () => void;
  onRunDiagnostic: () => void;
}

export default function Console({ logs, onClear, onRunDiagnostic }: ConsoleProps) {
  const { t, language } = useApp();
  const [filter, setFilter] = useState<'all' | 'success' | 'info' | 'error' | 'warning'>('all');
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.status === filter;
    const matchesSearch =
      log.nodeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDownloadLogs = () => {
    const logText = logs
      .map((l) => `[${l.timestamp}] [${l.status.toUpperCase()}] [${l.nodeLabel}]: ${l.message}`)
      .join("\n");
    const blob = new Blob([logText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "atlas-flow-console-logs.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const filterConfig = [
    { key: 'all',     label: language === "pt" ? "todos" : "all",  activeClass: 'bg-white/10 border-white/20 text-white' },
    { key: 'success', label: 'success', activeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
    { key: 'info',    label: 'info',    activeClass: 'bg-neon-blue/10 border-neon-blue/25 text-neon-blue' },
    { key: 'warning', label: 'warning', activeClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
    { key: 'error',   label: 'error',   activeClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400' },
  ] as const;

  return (
    <div
      className="relative rounded-2xl flex flex-col h-[520px] overflow-hidden font-mono shadow-2xl"
      id="terminal-log-panel"
      style={{ background: 'rgb(4, 4, 10)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/35 to-transparent" />

      {/* ── Terminal Title Bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b z-10"
        style={{ background: 'rgba(6,6,14,0.95)', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/75" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/75" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/75" />
          </div>
          <div className="w-px h-4 bg-white/[0.08]" />
          <TermIcon className="w-3.5 h-3.5 text-amber-400/60" />
          <span className="text-[11px] text-white/45 font-medium">{t("systemTerminalActive")}</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[9px]">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-white/25">{language === "pt" ? "CONCORRÊNCIA:" : "CONCURRENCY:"}</span>
          <span className="text-emerald-400/70">{language === "pt" ? "NORMAL [TCP/IP]" : "NORMAL [TCP/IP]"}</span>
        </div>
      </div>

      {/* ── Controls Bar ── */}
      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-5 py-2.5 border-b z-10 text-[10px]"
        style={{ background: 'rgba(5,5,12,0.7)', borderColor: 'rgba(255,255,255,0.04)' }}
      >
        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-1">
          {filterConfig.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-2.5 py-1 rounded-lg transition-all duration-150 uppercase font-semibold border text-[9px] tracking-wider ${
                filter === f.key
                  ? f.activeClass
                  : 'bg-transparent border-transparent text-white/25 hover:text-white/50 hover:bg-white/[0.04]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + Actions */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-3 h-3 text-white/20 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === "pt" ? "Buscar registros..." : "Search logs..."}
              className="pl-7 pr-3 py-1.5 rounded-lg text-white/60 text-[10px] focus:outline-none w-full sm:w-44 transition-all"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(245,158,11,0.35)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.06)'; }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onRunDiagnostic}
              title={language === "pt" ? "Executar diagnóstico" : "Run diagnostics"}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white/30 hover:text-amber-400 border border-white/[0.06] hover:border-amber-500/30 transition-all text-[9px] uppercase font-semibold hover:bg-amber-500/[0.05]"
            >
              <RefreshCw className="w-3 h-3 flex-shrink-0" />
              <span>{language === "pt" ? "Diagnóstico" : "Diagnostic"}</span>
            </button>
            <button
              onClick={handleDownloadLogs}
              title={language === "pt" ? "Baixar logs" : "Download logs"}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/60 border border-transparent hover:border-white/[0.08] transition-all hover:bg-white/[0.04]"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClear}
              title={language === "pt" ? "Limpar terminal" : "Clear terminal"}
              className="p-1.5 rounded-lg text-white/25 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all hover:bg-rose-500/[0.05]"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Log Content ── */}
      <div
        className="flex-1 overflow-y-auto p-5 space-y-1.5 text-[11px] leading-relaxed text-left font-mono select-text"
        style={{ background: 'rgba(3,3,9,0.95)' }}
      >
        {/* Connection header */}
        <div
          className="text-white/15 pb-3 mb-4 font-mono text-[9px] uppercase tracking-wider border-b"
          style={{ borderColor: 'rgba(255,255,255,0.04)' }}
        >
          {language === "pt"
            ? "SISTEMA: AUTOMATIZADO CONECTADO // REGIONAL: US-EAST4"
            : "SYSTEM: AUTOMATION ACTIVE // REGION: US-EAST4"}
          <br />
          <span className="text-amber-400/40">[ADMIN_ROUTINE]</span>
          <span className="text-white/20">@ATLAS_FLOW:~$ connect_active_nodes --verbose</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="text-center py-20 text-white/15 font-mono text-xs">
            {language === "pt" ? (
              <>
                [CONSOLE: NENHUM REGISTRO COM TERMO: &quot;{searchTerm || filter.toUpperCase()}&quot;]
                <br />
                <span className="text-white/10">Acione simulações para transmitir parâmetros em tempo real.</span>
              </>
            ) : (
              <>
                [CONSOLE: NO METRICS CAPTURED FOR QUERY: &quot;{searchTerm || filter.toUpperCase()}&quot;]
                <br />
                <span className="text-white/10">Trigger simulations or build workflows to stream live parameters.</span>
              </>
            )}
          </div>
        ) : (
          filteredLogs.map((log) => {
            const statusMap = {
              success: { color: 'text-emerald-400', Icon: Check,         border: 'rgba(16,185,129,0.5)',  bg: 'rgba(16,185,129,0.03)' },
              error:   { color: 'text-rose-400',    Icon: ShieldAlert,    border: 'rgba(244,63,94,0.5)',   bg: 'rgba(244,63,94,0.03)'  },
              warning: { color: 'text-amber-400',   Icon: AlertTriangle,  border: 'rgba(245,158,11,0.5)',  bg: 'rgba(245,158,11,0.03)' },
              info:    { color: 'text-neon-blue',   Icon: Info,           border: 'rgba(56,189,248,0.4)',  bg: 'rgba(56,189,248,0.02)' },
            };
            const s = statusMap[log.status as keyof typeof statusMap] ?? statusMap.info;
            const LogIcon = s.Icon;

            return (
              <div
                key={log.id}
                className="group py-1.5 px-3 rounded-lg flex items-start gap-3 transition-all duration-150 border-l-2 cursor-default"
                style={{
                  borderLeftColor: 'transparent',
                  background: 'transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = s.bg;
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = s.border;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent';
                }}
              >
                <span className="text-white/20 text-[9px] mt-0.5 flex-shrink-0 tabular-nums">
                  [{log.timestamp}]
                </span>

                <div className={`flex items-center gap-1.5 min-w-[130px] font-semibold tracking-wider text-[10px] flex-shrink-0 ${s.color}`}>
                  <LogIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{log.nodeLabel.toUpperCase()}</span>
                </div>

                <div className="flex-1 text-white/45 text-[11px]">
                  {log.message}
                </div>

                {log.latency > 0 && (
                  <span className="text-[9px] text-white/15 flex-shrink-0 tabular-nums">
                    {log.latency}ms
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Terminal Footer Input Sim ── */}
      <div
        className="px-5 py-3 border-t flex items-center gap-2 z-10 select-none"
        style={{ background: 'rgba(5,5,12,0.95)', borderColor: 'rgba(255,255,255,0.04)' }}
      >
        <span className="text-amber-400 font-bold text-sm leading-none">&gt;_</span>
        <span className="font-mono text-[10px] text-white/20">
          {language === "pt"
            ? "Ouvindo transmissão... clique em 'Simular Execuções' para transmitir registros."
            : "Stream listening... press 'Trigger Run Simulation' to broadcast event logs."}
        </span>
        <span className="ml-auto font-mono text-[9px] text-white/15 tabular-nums">
          {filteredLogs.length} {language === "pt" ? "linhas" : "lines"}
        </span>
      </div>
    </div>
  );
}
