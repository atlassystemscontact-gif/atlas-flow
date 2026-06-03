import React from "react";
import { Cpu, Sparkles, Heart, ArrowUpRight } from "lucide-react";
import { useApp } from "../AppContext";

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  accentColor: string;
  glowColor: string;
  badge: string;
  step: string;
}

export default function Features() {
  const { t, language } = useApp();

  const featuresData: FeatureCard[] = language === "pt" ? [
    {
      title: "O que é a Automação",
      description: "Uma tecnologia baseada em Inteligência Artificial que executa lógicas complexas e fluxos de trabalho recursivos sem necessidade de programação manual. Você define o objetivo, e ela conecta os sistemas de forma autônoma.",
      icon: Sparkles,
      accentColor: "text-amber-400",
      glowColor: "rgba(245,158,11,0.15)",
      badge: "Atlas Flow IA",
      step: "01",
    },
    {
      title: "O que a Automação faz",
      description: "Orquestra ações coordenadas: analisa logs, processa prompts, atualiza informações integradas de CRM (como Discord ou Slack) e toma decisões com base nos contextos que você fornecer.",
      icon: Cpu,
      accentColor: "text-neon-blue",
      glowColor: "rgba(56,189,248,0.12)",
      badge: "Execução Dinâmica",
      step: "02",
    },
    {
      title: "Como ela ajuda você",
      description: "Elimina cliques manuais exhaustivos, evita erros de digitação, automatiza comunicações com agilidade incomparável de forma contínua 24/7 e economiza centenas de horas de trabalho.",
      icon: Heart,
      accentColor: "text-neon-purple",
      glowColor: "rgba(129,140,248,0.12)",
      badge: "Produtividade Real",
      step: "03",
    },
  ] : [
    {
      title: "What is Atlas Automation",
      description: "An AI-powered technology that executes complex task logic and recursive workflows without manual coding. You provide the goal, and it establishes the connection points automatically.",
      icon: Sparkles,
      accentColor: "text-amber-400",
      glowColor: "rgba(245,158,11,0.15)",
      badge: "Atlas Flow AI",
      step: "01",
    },
    {
      title: "What the Automation does",
      description: "Orchestrates highly-coordinated business steps: processes prompt instructions, pushes live communication updates (to Slack or Discord), and makes smart decisions based on custom context.",
      icon: Cpu,
      accentColor: "text-neon-blue",
      glowColor: "rgba(56,189,248,0.12)",
      badge: "Dynamic Execution",
      step: "02",
    },
    {
      title: "How it helps you save time",
      description: "Eliminates tedious manual clicks, guarantees error-free business dispatch, automates communications with speed, and frees up precious resources to focus on creative tasks.",
      icon: Heart,
      accentColor: "text-neon-purple",
      glowColor: "rgba(129,140,248,0.12)",
      badge: "Real Productivity",
      step: "03",
    },
  ];

  return (
    <section
      className="relative py-28 px-6 border-t border-white/[0.05] overflow-hidden"
      id="features-anchor"
      style={{ background: 'linear-gradient(180deg, #050509 0%, #070710 50%, #050509 100%)' }}
    >
      {/* Ambient glows */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-neon-purple/[0.04] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-[0.18] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 badge-amber px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-widest mb-6">
            <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
            <span>{language === "pt" ? "Recursos de Alto Valor" : "High Value Benefits"}</span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-gradient-white mt-4 tracking-tight leading-tight">
            {language === "pt" ? "Como nossa Automação Funciona" : "How Our Automation Elevates You"}
          </h2>

          <p className="font-sans text-white/35 mt-5 leading-relaxed font-light text-base max-w-xl mx-auto">
            {language === "pt"
              ? "Confira os pilares essenciais do ecossistema inteligente concebido para simplificar a sua rotina diária."
              : "Discover the core principles of an intelligent ecosystem built to optimize and speed up your daily processes."}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto" id="features-container">
          {featuresData.map((feature, idx) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={idx}
                id={`feature-card-${idx}`}
                className="group relative premium-card rounded-2xl p-7 flex flex-col justify-between min-h-[260px] cursor-default select-none"
              >
                {/* Step number watermark */}
                <div className="absolute top-5 right-6 font-display font-black text-6xl text-white/[0.025] leading-none select-none pointer-events-none">
                  {feature.step}
                </div>

                {/* Top section */}
                <div className="flex-1 flex flex-col">

                  {/* Icon + Badge row */}
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/[0.07] group-hover:border-amber-500/30 transition-all duration-300 relative overflow-hidden"
                      style={{ background: `rgba(255,255,255,0.03)` }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                        style={{ background: `radial-gradient(circle at center, ${feature.glowColor} 0%, transparent 70%)` }}
                      />
                      <IconComponent className={`w-5 h-5 relative z-10 text-white/40 group-hover:${feature.accentColor} transition-colors duration-300`} />
                    </div>

                    <span className="font-mono text-[9px] px-2.5 py-1 rounded-lg border border-white/[0.07] text-white/30 bg-white/[0.025] uppercase tracking-widest group-hover:border-amber-500/20 group-hover:text-amber-400/60 transition-all duration-300">
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-[17px] text-white/80 group-hover:text-white mb-3 flex items-center gap-1.5 transition-colors duration-300 leading-tight">
                    {feature.title}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-amber-400 transition-all duration-300 flex-shrink-0" />
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-[13px] text-white/35 leading-relaxed font-light flex-1">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="mt-6 pt-5 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-px bg-amber-500/0 group-hover:bg-amber-500/60 transition-all duration-500 group-hover:w-10" />
                    <span className="font-mono text-[9px] text-white/20 group-hover:text-amber-400/50 uppercase tracking-widest transition-colors duration-300">
                      {language === "pt" ? "MÓDULO" : "MODULE"} {feature.step}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom divider */}
        <div className="mt-20 divider-gradient" />

      </div>
    </section>
  );
}
