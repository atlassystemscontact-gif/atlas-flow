import React, { useState } from "react";
import { Play, Sparkles, ChevronRight, Activity, ArrowRight } from "lucide-react";
import { useApp } from "../AppContext";

interface HeroProps {
  onCompile: (prompt: string) => void;
  isLoading: boolean;
  onExploreLab: () => void;
}

export default function Hero({ onCompile, isLoading, onExploreLab }: HeroProps) {
  const { t, language } = useApp();
  const [userInput, setUserInput] = useState<string>("");
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const PRESET_PROMPTS = [
    { title: t("preset1Title"), prompt: t("preset1Desc") },
    { title: t("preset2Title"), prompt: t("preset2Desc") },
    { title: t("preset3Title"), prompt: t("preset3Desc") },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    onCompile(userInput);
  };

  const handleApplyPreset = (idx: number, text: string) => {
    setActivePreset(idx);
    setUserInput(text);
  };

  return (
    <section
      className="relative min-h-[92vh] py-24 px-6 z-10 flex flex-col justify-center overflow-hidden"
      id="hero-section"
    >
      {/* ── Ambient Glows ── */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-amber-500/[0.055] blur-[140px] -z-10 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-neon-blue/[0.045] blur-[110px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[280px] h-[280px] rounded-full bg-neon-purple/[0.04] blur-[100px] -z-10 pointer-events-none" />

      {/* ── Tech Grid ── */}
      <div className="absolute inset-0 tech-grid opacity-25 pointer-events-none -z-20" />

      {/* ── Top accent line ── */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* ── Left: Headline ── */}
        <div className="lg:col-span-7 flex flex-col items-start gap-7">

          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-amber text-[11px] font-mono font-semibold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            <span>{t("systemStatusOptimal")}</span>
          </div>

          {/* Main headline */}
          <h1
            className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.93] tracking-tight text-gradient-white"
            id="hero-title"
          >
            {t("heroTitle")}
          </h1>

          {/* Subtitle */}
          <p
            className="font-sans text-white/45 text-base sm:text-lg leading-relaxed font-light max-w-[500px]"
            id="hero-subtitle"
          >
            {t("heroSubtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-2">
            <button
              onClick={onExploreLab}
              className="btn-amber px-8 py-3.5 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer text-sm"
              id="hero-cta-btn-lab"
            >
              <Play className="w-4 h-4 fill-black stroke-none flex-shrink-0" />
              <span>{t("startAutomation")}</span>
            </button>

            <a
              href="#features-anchor"
              className="btn-glass px-8 py-3.5 rounded-xl flex items-center justify-center gap-2.5 cursor-pointer group text-sm font-semibold"
              id="hero-cta-btn-features"
            >
              <span>{t("explorePlatform")}</span>
              <ChevronRight className="w-4 h-4 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </a>
          </div>

          {/* Social proof metrics */}
          <div className="flex items-center gap-6 pt-4 border-t border-white/[0.07] mt-2 w-full max-w-md">
            {[
              { value: "99.96%", label: language === "pt" ? "Uptime" : "Uptime" },
              { value: "< 45ms", label: language === "pt" ? "Latência" : "Avg Latency" },
              { value: "10k+", label: language === "pt" ? "Automações" : "Workflows" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5">
                <span className="font-display font-bold text-lg text-white tabular-nums">{stat.value}</span>
                <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Compiler Panel ── */}
        <div className="lg:col-span-5 relative mt-4 lg:mt-0" id="hero-compiler-panel">

          {/* Glow behind panel */}
          <div className="absolute -inset-4 bg-amber-500/[0.04] rounded-3xl blur-2xl pointer-events-none" />

          <div className="relative rounded-2xl p-6 overflow-hidden bg-[#0a0a14]/90 border border-white/[0.08] shadow-2xl backdrop-blur-2xl">

            {/* Amber corner marks */}
            <div className="absolute top-0 left-0 w-10 h-px bg-gradient-to-r from-amber-500 to-transparent" />
            <div className="absolute top-0 left-0 w-px h-10 bg-gradient-to-b from-amber-500 to-transparent" />
            <div className="absolute bottom-0 right-0 w-10 h-px bg-gradient-to-l from-amber-500 to-transparent" />
            <div className="absolute bottom-0 right-0 w-px h-10 bg-gradient-to-t from-amber-500 to-transparent" />

            {/* Inner top accent */}
            <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

            {/* Panel header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="font-mono text-[11px] text-white/45 font-medium ml-1">{t("flowCompilerTitle")}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/30 bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/[0.06]">
                <Activity className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                <span>ONLINE</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-sans text-white/40 font-light mb-4 leading-relaxed">
              {t("flowCompilerSubtitle")}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="relative">
                <textarea
                  id="compiler-textarea"
                  value={userInput}
                  onChange={(e) => { setUserInput(e.target.value); setActivePreset(null); }}
                  className="w-full h-28 input-premium rounded-xl p-3.5 text-white/80 placeholder-white/20 text-[13px] leading-relaxed resize-none focus:outline-none font-sans"
                  placeholder={t("preset1Desc")}
                  required
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 pointer-events-none text-white/20 font-mono text-[9px] uppercase tracking-wider">
                  <span>{language === "pt" ? "Enviar" : "Submit"}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-sans font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isLoading
                    ? 'bg-white/[0.04] border border-white/[0.08] text-white/30 cursor-not-allowed'
                    : 'btn-amber'
                }`}
                id="compiler-submit-btn"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    <span>{t("calculating")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{t("compileBtn")}</span>
                  </>
                )}
              </button>
            </form>

            {/* Presets */}
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <span className="font-mono text-[9px] text-white/25 uppercase tracking-[0.18em] block mb-3">
                {t("presetHeading")}
              </span>
              <div className="flex flex-col gap-2">
                {PRESET_PROMPTS.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleApplyPreset(idx, preset.prompt)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                      activePreset === idx
                        ? 'bg-amber-500/[0.08] border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.08)]'
                        : 'bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.045] hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      {activePreset === idx && (
                        <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                      )}
                      <span className="text-[12px] font-semibold text-white/75">{preset.title}</span>
                    </div>
                    <p className="text-[10px] text-white/30 font-light line-clamp-1 leading-relaxed">
                      {preset.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Floating ambient dots */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-500/[0.1] rounded-full blur-xl pointer-events-none animate-float" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-neon-blue/[0.07] rounded-full blur-2xl pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
        </div>

      </div>
    </section>
  );
}
