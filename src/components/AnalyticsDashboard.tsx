import { useState, useEffect } from "react";
import { MetricPoint } from "../types";
import { TrendingUp, Zap, ShieldCheck, Layers, Sparkles, RefreshCw, ArrowUp } from "lucide-react";
import { useApp } from "../AppContext";

interface AnalyticsDashboardProps {
  logsCount: number;
}

const INSIGHTS_MOCK_EN = [
  "Slack trigger integration completed: 12 new premium clients were notified automatically in the #sales channel today.",
  "Stripe transaction audit complete: All invoice data synced securely. 100% processing success rate.",
  "Zendesk classification routine saved 45 minutes of manual sorting. AI automatically tagged priority tickets.",
  "Total weekly business performance saved over 32 hours of repetitive input work through active automations.",
  "Gemini AI decision logic successfully filtered 4 empty client submissions and requested clarifications.",
];

const INSIGHTS_MOCK_PT = [
  "Integração do Slack concluída: 12 novos clientes premium foram notificados automaticamente no canal #comercial hoje.",
  "Auditoria de transações Stripe concluída: Todos os dados de cobrança sincronizados. Taxa de 100% de sucesso de processamento.",
  "A triagem automatizada do Zendesk economizou 45 minutos de triagem manual. A IA classificou os tickets importantes.",
  "O desempenho semanal consolidado atingiu mais de 32 horas de trabalho manual poupados através de automações ativas.",
  "O núcleo operacional do Gemini barrou com sucesso 4 cadastros vazios e solicitou preenchimentos corretos de forma autônoma.",
];

const makeSvgPoints = (data: MetricPoint[], width: number, height: number, maxVal: number) => {
  if (data.length === 0) return "";
  return data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (point.throughput / maxVal) * height;
      return `${x},${y}`;
    })
    .join(" ");
};

const makeAreaPoints = (data: MetricPoint[], width: number, height: number, maxVal: number) => {
  if (data.length === 0) return "";
  const linePoints = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (point.throughput / maxVal) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return `${linePoints} ${width},${height} 0,${height}`;
};

export default function AnalyticsDashboard({ logsCount }: AnalyticsDashboardProps) {
  const { t, language } = useApp();
  const INSIGHTS_MOCK = language === "pt" ? INSIGHTS_MOCK_PT : INSIGHTS_MOCK_EN;
  const [metricData, setMetricData] = useState<MetricPoint[]>([]);
  const [activeInsight, setActiveInsight] = useState<string>(INSIGHTS_MOCK[0]);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  useEffect(() => {
    const initialPoints: MetricPoint[] = Array.from({ length: 15 }, (_, i) => ({
      time: `${12 + i}:00`,
      throughput: Math.floor(Math.random() * 40) + 120,
      latency: Math.floor(Math.random() * 10) + 20,
      errorRate: parseFloat((Math.random() * 0.1).toFixed(3)),
    }));
    setMetricData(initialPoints);

    const interval = setInterval(() => {
      setMetricData((prev) => {
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newPoint: MetricPoint = {
          time: nextTime,
          throughput: Math.floor(Math.random() * 50) + 125,
          latency: Math.floor(Math.random() * 8) + 22,
          errorRate: parseFloat((Math.random() * 0.08).toFixed(3)),
        };
        return [...prev.slice(1), newPoint];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSynthesizeInsight = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * INSIGHTS_MOCK.length);
      setActiveInsight(INSIGHTS_MOCK[idx]);
      setIsSynthesizing(false);
    }, 1200);
  };

  const currentThroughput = metricData[metricData.length - 1]?.throughput || 140;

  const statCards = [
    {
      label: t("throughputRatio"),
      value: (2480 + logsCount * 5).toLocaleString(),
      sub: "+12%",
      subColor: "text-emerald-400",
      icon: TrendingUp,
      iconBg: "rgba(245,158,11,0.08)",
      iconBorder: "rgba(245,158,11,0.2)",
      iconColor: "text-amber-400",
      desc: t("throughputDesc"),
      hoverBorder: "hover:border-amber-500/25",
    },
    {
      label: t("clusterLatency"),
      value: `${(45.5 + logsCount * 0.25).toFixed(2)} h`,
      sub: "+4.8h",
      subColor: "text-emerald-400",
      icon: Zap,
      iconBg: "rgba(56,189,248,0.08)",
      iconBorder: "rgba(56,189,248,0.2)",
      iconColor: "text-neon-blue",
      desc: t("latencyDesc"),
      hoverBorder: "hover:border-neon-blue/25",
    },
    {
      label: t("networkHealth"),
      value: "99.96%",
      sub: language === "pt" ? "SEGURO" : "SECURE",
      subColor: "text-emerald-400",
      icon: ShieldCheck,
      iconBg: "rgba(16,185,129,0.08)",
      iconBorder: "rgba(16,185,129,0.2)",
      iconColor: "text-emerald-400",
      desc: t("healthDesc"),
      hoverBorder: "hover:border-emerald-500/25",
    },
    {
      label: t("simulatedEventsTitle"),
      value: "4 / 4",
      sub: t("thisSession"),
      subColor: "text-white/30",
      icon: Layers,
      iconBg: "rgba(129,140,248,0.08)",
      iconBorder: "rgba(129,140,248,0.2)",
      iconColor: "text-neon-purple",
      desc: t("eventsDesc"),
      hoverBorder: "hover:border-neon-purple/25",
    },
  ];

  return (
    <div className="space-y-6" id="analytics-root">

      {/* ── 4 Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-dashboard-grid">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`relative bg-[#0a0a14]/60 border border-white/[0.06] rounded-2xl p-5 text-left transition-all duration-300 ${card.hoverBorder} hover:shadow-lg group overflow-hidden`}
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.03) 0%, transparent 60%)' }}
              />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.16em]">{card.label}</span>
                <div
                  className="p-1.5 rounded-lg border"
                  style={{ background: card.iconBg, borderColor: card.iconBorder }}
                >
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
              </div>

              <div className="flex items-baseline gap-2 relative z-10 mb-2">
                <span className="font-display font-extrabold text-2xl text-white tabular-nums leading-none">
                  {card.value}
                </span>
                <span className={`font-mono text-[10px] ${card.subColor} flex items-center gap-0.5`}>
                  {card.subColor === "text-emerald-400" && card.sub.startsWith("+") && (
                    <ArrowUp className="w-3 h-3" />
                  )}
                  {card.sub}
                </span>
              </div>

              <p className="font-sans text-[10px] text-white/25 font-light leading-relaxed relative z-10">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Chart + AI Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">

        {/* Real-time Chart */}
        <div
          className="lg:col-span-8 bg-[#0a0a14]/60 border border-white/[0.06] rounded-2xl p-6 flex flex-col"
          id="realtime-graph-panel"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-6">
            <div>
              <span className="font-mono text-[9px] text-amber-400/70 uppercase tracking-[0.16em] block mb-1">
                {t("liveFeedRail")}
              </span>
              <h4 className="font-display font-bold text-base text-white">{t("throughputChartTitle")}</h4>
            </div>
            <div className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06] text-[10px] text-white/35 font-mono">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse flex-shrink-0" />
              <span>100% LIVE</span>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative h-56 select-none">
            <div className="absolute inset-0 tech-grid-cyan opacity-[0.18]" />

            {/* Y-axis labels */}
            <div className="absolute left-0 top-1 font-mono text-[8px] text-white/20">100%</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-[8px] text-white/20">50%</div>
            <div className="absolute left-0 bottom-1 font-mono text-[8px] text-white/20">0%</div>

            <svg className="w-full h-full overflow-visible pl-6" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="40%"  stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="chart-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.14" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <polygon
                fill="url(#chart-area-grad)"
                points={makeAreaPoints(metricData, 500, 180, 200)}
                className="transition-all duration-1000"
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="url(#chart-line-grad)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={makeSvgPoints(metricData, 500, 180, 200)}
                className="transition-all duration-1000"
              />

              {/* Live dot at end */}
              {metricData.length > 0 && (() => {
                const last = metricData[metricData.length - 1];
                const x = 500;
                const y = 180 - (last.throughput / 200) * 180;
                return (
                  <g>
                    <circle cx={x} cy={y} r="5" fill="#818cf8" opacity="0.25" />
                    <circle cx={x} cy={y} r="3" fill="#818cf8" />
                  </g>
                );
              })()}
            </svg>

            {/* Live badge */}
            <div className="absolute bottom-0 right-0 font-mono text-[9px] badge-amber px-2.5 py-1 rounded-lg tracking-wider animate-pulse font-semibold">
              {language === "pt" ? "MONITORAMENTO ATIVO" : "ACTIVE MONITORING"}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.05] mt-5 flex justify-between font-mono text-[9px] text-white/20">
            <span>T-60 SECS</span>
            <span>T-30 SECS</span>
            <span>{language === "pt" ? "ANÁLISE ATUAL" : "CURRENT ANALYSIS"}</span>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div
          className="lg:col-span-4 bg-[#0a0a14]/60 border border-white/[0.06] rounded-2xl p-6 flex flex-col justify-between"
          id="ai-insights-panel"
        >
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-white/[0.05] mb-5">
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)' }}>
                <Sparkles className="w-3.5 h-3.5 text-neon-purple" />
              </div>
              <div>
                <span className="font-mono text-[9px] text-neon-purple/70 uppercase tracking-[0.15em] block">
                  {t("cognitiveCompiler")}
                </span>
                <h4 className="font-display font-bold text-sm text-white">{t("dynamicAiDiagnostics")}</h4>
              </div>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.14em] block">
                {t("activeHeuristicLabel")}
              </span>

              <div className="relative bg-black/30 border border-white/[0.06] rounded-xl p-4 min-h-[150px] flex flex-col justify-between overflow-hidden">
                {/* Left accent bar */}
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-neon-purple/60 via-neon-purple/30 to-transparent" />

                <p className="font-sans text-[12px] text-white/55 leading-relaxed font-light pl-3">
                  {isSynthesizing ? (
                    <span className="shimmer inline-block w-full h-4 rounded bg-white/5" />
                  ) : (
                    `"${activeInsight}"`
                  )}
                </p>

                <div className="font-mono text-[9px] text-white/20 tracking-wider mt-4 pl-3">
                  {t("projectionConfidence")} <strong className="text-neon-purple/70 font-semibold">99.4% CAPABILITY</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSynthesizeInsight}
              disabled={isSynthesizing}
              className={`w-full py-2.5 rounded-xl font-sans font-semibold text-[12px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isSynthesizing
                  ? 'bg-white/[0.04] border border-white/[0.07] text-white/25 cursor-not-allowed'
                  : 'btn-amber'
              }`}
              id="synthesize-insight-btn"
            >
              <RefreshCw className={`w-3.5 h-3.5 flex-shrink-0 ${isSynthesizing ? 'animate-spin' : ''}`} />
              <span>{isSynthesizing ? t("synthesizingBtn") : t("isolateLogsBtn")}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
