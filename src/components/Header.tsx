import { useState, useEffect } from "react";
import { Terminal as TermIcon, ShieldAlert, Sun, Moon, Globe, Zap } from "lucide-react";
import { useApp } from "../AppContext";

interface HeaderProps {
  currentTab: 'landing' | 'console';
  setCurrentTab: (tab: 'landing' | 'console') => void;
  usingFallback?: boolean;
}

export default function Header({ currentTab, setCurrentTab, usingFallback = false }: HeaderProps) {
  const [systime, setSystime] = useState<string>("00:00:00 UTC");
  const { theme, setTheme, language, setLanguage, t } = useApp();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystime(now.toISOString().substring(11, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050509]/88 backdrop-blur-xl px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* ── Brand ── */}
        <div
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          id="brand-header"
        >
          {/* Logo mark — amber gradient */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-300/20 to-transparent"></div>
            <span className="relative font-display font-black text-black text-sm z-10 leading-none">A</span>
            <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"></div>
          </div>

          <div className="flex flex-col leading-none gap-0.5">
            <span className="font-display font-extrabold tracking-tight text-white text-[17px] leading-none flex items-baseline gap-0">
              ATLAS<span className="text-gradient-amber">FLOW</span>
            </span>
            <span className="font-mono text-[8px] text-white/25 tracking-[0.18em] uppercase">
              {t("workflowIntel")}
            </span>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav
          className="flex items-center gap-0.5 bg-white/[0.04] p-1 rounded-xl border border-white/[0.07] flex-shrink-0"
          id="navbar-links"
        >
          <button
            id="nav-btn-landing"
            onClick={() => setCurrentTab('landing')}
            className={`px-4 py-1.5 rounded-lg font-sans text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 ${
              currentTab === 'landing'
                ? 'bg-amber-500/15 border border-amber-500/35 text-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.12)]'
                : 'text-white/40 hover:text-white/75 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            {t("navCapabilities")}
          </button>

          <button
            id="nav-btn-console"
            onClick={() => setCurrentTab('console')}
            className={`px-4 py-1.5 rounded-lg font-sans text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${
              currentTab === 'console'
                ? 'bg-neon-blue/15 border border-neon-blue/35 text-neon-blue shadow-[0_0_14px_rgba(56,189,248,0.12)]'
                : 'text-white/40 hover:text-white/75 hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <TermIcon className="w-3 h-3 flex-shrink-0" />
            <span>{t("navAutomationLab")}</span>
          </button>
        </nav>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-2.5 flex-shrink-0">

          {/* System clock */}
          <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-white/30 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0"></span>
            <span className="text-white/20">{t("systemClock")}</span>
            <span className="text-white/50 tabular-nums">{systime}</span>
          </div>

          {/* Theme + Language toggles */}
          <div className="flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 hover:bg-white/10 rounded-md transition-all flex items-center justify-center cursor-pointer text-white/40 hover:text-white/80"
              title={theme === 'dark' ? t("themeLight") : t("themeDark")}
            >
              {theme === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse-slow" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neon-blue" />
              )}
            </button>

            <div className="w-px h-3.5 bg-white/[0.08]"></div>

            <button
              onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
              className="px-2 py-1 text-[9px] font-mono font-bold hover:bg-white/10 rounded-md transition-all flex items-center gap-1 cursor-pointer text-white/40 hover:text-white/80"
              title={t("settingsLabel")}
            >
              <Globe className="w-3 h-3 text-neon-blue/60" />
              <span className="tracking-wider">{language === 'en' ? 'EN' : 'PT'}</span>
            </button>
          </div>

          {/* AI status badge */}
          {usingFallback ? (
            <div
              title="Curated mode. Configure API Key to unlock live Generative AI compilation."
              className="flex items-center gap-1.5 badge-amber px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-semibold"
            >
              <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">{t("sandboxMode")}</span>
            </div>
          ) : (
            <div
              title="Gemini AI online and configured."
              className="flex items-center gap-1.5 badge-electric px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-semibold animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="hidden sm:inline">{t("aiProdMode")}</span>
            </div>
          )}

          {/* CTA — Lab */}
          {currentTab === 'landing' && (
            <button
              onClick={() => setCurrentTab('console')}
              className="hidden sm:flex btn-amber items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] cursor-pointer"
              id="cta-nav-button"
            >
              <span>{t("atlasConsoleBtn")}</span>
              <TermIcon className="w-3 h-3 flex-shrink-0" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
