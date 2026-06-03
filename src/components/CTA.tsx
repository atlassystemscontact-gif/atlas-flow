import React, { useState } from "react";
import { Sparkles, Calendar, ArrowRight, CheckCircle, ShieldCheck, Cpu, TrendingUp, Clock, Zap } from "lucide-react";
import { useApp } from "../AppContext";

export default function CTA() {
  const { t, language } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    companySize: "10-50",
    primaryGoal: "CRM & Support Integration",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [metrics, setMetrics] = useState({ hoursSaved: 2400, roi: 380, efficiency: "3.2x" });

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      let mult = 1;
      if (updated.companySize === "50-250")   mult = 3.5;
      if (updated.companySize === "250-1000") mult = 8.2;
      if (updated.companySize === "1000+")    mult = 18.5;
      let goalBias = 1.0;
      if (updated.primaryGoal === "Enterprise Ledger Syncing")       goalBias = 1.4;
      if (updated.primaryGoal === "Algorithmic Database Auditing")   goalBias = 1.25;
      setMetrics({
        hoursSaved: Math.floor(2100 * mult * goalBias),
        roi: Math.floor(340 + mult * 20 + goalBias * 30),
        efficiency: (2.5 + mult * 0.4).toFixed(1) + "x",
      });
      return updated;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setCalculating(true);
    setTimeout(() => { setCalculating(false); setSubmitted(true); }, 1500);
  };

  return (
    <section
      className="relative py-28 px-6 overflow-hidden"
      id="cta-section"
      style={{ background: 'linear-gradient(180deg, #070710 0%, #050509 100%)' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-amber-500/[0.05] blur-[150px] -z-10 animate-pulse-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full bg-neon-blue/[0.04] blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-[0.15] pointer-events-none -z-20" />

      {/* Top amber accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">

        {/* ── Left Copy ── */}
        <div className="lg:col-span-6 text-left flex flex-col items-start gap-7">

          <div className="inline-flex items-center gap-2 badge-amber px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{t("executiveDemoPlatform")}</span>
          </div>

          <h2
            className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-gradient-white tracking-tight leading-[0.95]"
            id="cta-headline"
          >
            {t("ctaTitle")}
          </h2>

          <p
            className="font-sans text-white/35 text-base leading-relaxed font-light max-w-md"
            id="cta-subtitle"
          >
            {t("ctaSubtitle")}
          </p>

          {/* Trust signals */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm pt-6 border-t border-white/[0.06] mt-2">
            {[
              { Icon: ShieldCheck, label: t("gdprSecure"),  desc: t("gdprDesc"),        color: "text-emerald-400" },
              { Icon: Cpu,         label: t("multiModel"),  desc: t("multiModelDesc"),  color: "text-neon-purple" },
            ].map(({ Icon, label, desc, color }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
                <div className="text-left font-sans text-xs">
                  <div className="font-semibold text-white/75">{label}</div>
                  <div className="text-white/25 font-light text-[10px] mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stat row */}
          <div className="flex items-center gap-6 mt-2">
            {[
              { Icon: Clock,      value: "< 2h",   label: language === "pt" ? "Setup" : "Setup Time" },
              { Icon: TrendingUp, value: "+380%",  label: language === "pt" ? "ROI médio" : "Avg ROI" },
              { Icon: Zap,        value: "24/7",   label: language === "pt" ? "Uptime" : "Always On" },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon className="w-4 h-4 text-amber-400/50 mb-0.5" />
                <span className="font-display font-bold text-base text-white tabular-nums">{value}</span>
                <span className="font-mono text-[9px] text-white/25 uppercase tracking-widest">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Form ── */}
        <div className="lg:col-span-6 relative">

          {/* Glow behind card */}
          <div className="absolute -inset-4 bg-amber-500/[0.04] rounded-3xl blur-2xl pointer-events-none" />

          <div
            className="relative rounded-2xl p-7 shadow-2xl overflow-hidden"
            id="cta-inquiry-box"
            style={{ background: 'rgba(8,8,18,0.90)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
          >
            {/* Corner accents */}
            <div className="absolute top-0 right-0 w-12 h-px bg-gradient-to-l from-amber-500 to-transparent" />
            <div className="absolute top-0 right-0 w-px h-12 bg-gradient-to-b from-amber-500 to-transparent" />
            <div className="absolute bottom-0 left-0 w-12 h-px bg-gradient-to-r from-neon-blue/60 to-transparent" />
            <div className="absolute bottom-0 left-0 w-px h-12 bg-gradient-to-t from-neon-blue/60 to-transparent" />

            {/* Inner top shimmer */}
            <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

            {submitted ? (
              <div className="py-14 text-center space-y-5 font-sans max-w-sm mx-auto">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 mb-6"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-xl text-white">Credentials Reserved!</h4>
                <p className="text-sm text-white/35 leading-relaxed font-light">
                  Our system flagged your email{" "}
                  <span className="text-amber-400 font-semibold">{formData.email}</span>. A Solutions Principal will reach out with customized credentials within 2 hours.
                </p>
                <div className="pt-4 font-mono text-[9px] text-white/15 uppercase tracking-widest">
                  Invitation UUID: AT-FLOW-D-{Math.floor(Math.random() * 9000) + 1000}
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-5">

                <div className="pb-4 border-b border-white/[0.05]">
                  <h4 className="font-display font-bold text-base text-white">{t("calculateEfficiency")}</h4>
                  <p className="text-[12px] text-white/30 font-sans font-light mt-1">{t("calculateDesc")}</p>
                </div>

                {/* Selects row */}
                <div className="grid grid-cols-2 gap-3 font-sans text-xs">
                  <div>
                    <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] block mb-1.5">
                      {t("companySize")}
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => handleInputChange("companySize", e.target.value)}
                      className="w-full input-premium rounded-xl p-2.5 text-white/70 focus:outline-none cursor-pointer"
                    >
                      <option value="10-50">10-50 {language === "pt" ? "colaboradores" : "employees"}</option>
                      <option value="50-250">50-250 {language === "pt" ? "colaboradores" : "employees"}</option>
                      <option value="250-1000">250-1000 {language === "pt" ? "colaboradores" : "employees"}</option>
                      <option value="1000+">{language === "pt" ? "Escala Global 1000+" : "1000+ Global scale"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] block mb-1.5">
                      {t("primaryGoal")}
                    </label>
                    <select
                      value={formData.primaryGoal}
                      onChange={(e) => handleInputChange("primaryGoal", e.target.value)}
                      className="w-full input-premium rounded-xl p-2.5 text-white/70 focus:outline-none cursor-pointer"
                    >
                      <option value="CRM & Support Integration">{language === "pt" ? "Integração CRM & Zendesk" : "CRM & Support Integration"}</option>
                      <option value="Enterprise Ledger Syncing">{language === "pt" ? "Sincronização Enterprise" : "Enterprise Ledger Syncing"}</option>
                      <option value="Algorithmic Database Auditing">{language === "pt" ? "Auditoria de Banco de Dados" : "Algorithmic DB Auditing"}</option>
                    </select>
                  </div>
                </div>

                {/* ROI Metrics */}
                <div
                  className="p-5 rounded-xl grid grid-cols-3 gap-3 text-center font-mono relative overflow-hidden"
                  style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 shimmer pointer-events-none" />

                  {[
                    { label: t("hoursReclaimed"), value: `${metrics.hoursSaved}`, unit: "hrs", color: "text-white" },
                    { label: t("targetRoi"),      value: `+${metrics.roi}%`,      unit: null,  color: "text-amber-400" },
                    { label: t("compEfficiency"), value: metrics.efficiency,      unit: null,  color: "text-neon-purple" },
                  ].map(({ label, value, unit, color }) => (
                    <div key={label} className="relative z-10">
                      <span className="block text-[8px] text-white/25 uppercase tracking-[0.14em] mb-1.5">{label}</span>
                      <strong className={`text-lg font-extrabold ${color} tracking-tight tabular-nums leading-none`}>
                        {value}{unit && <span className="text-sm ml-0.5">{unit}</span>}
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Email input */}
                <div>
                  <label className="font-mono text-[9px] text-white/25 uppercase tracking-[0.15em] block mb-1.5">
                    {t("businessEmail")}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. severo@atlasflow.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full input-premium rounded-xl p-3 text-white/75 text-[13px] focus:outline-none"
                    id="cta-email-input"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={calculating}
                  className={`w-full py-3.5 rounded-xl font-sans font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer mt-2 transition-all ${
                    calculating ? 'opacity-60 cursor-not-allowed' : 'btn-amber'
                  }`}
                  id="schedule-demo-btn"
                >
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{calculating ? t("calculatingCap") : t("scheduleDemo")}</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>

                <div className="text-center font-mono text-[9px] text-white/15 uppercase tracking-widest leading-snug">
                  {t("ctaDisclaimer")}
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
