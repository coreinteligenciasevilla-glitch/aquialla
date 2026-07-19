/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { FeedReels } from './components/FeedReels';
import { FormularioIngreso } from './components/FormularioIngreso';
import { LoginScreen } from './components/LoginScreen';
import { 
  Smartphone, 
  Monitor, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  Database,
  ArrowRight,
  TrendingUp,
  Compass,
  Info,
  Download,
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';

function AppContent() {
  const { currentUser, layoutMode, setLayoutMode, items, filter, setFilter, resetDatabase, theme, toggleTheme } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);

  if (!currentUser) {
    return <LoginScreen />;
  }

  // Calculate stats excluding archived items
  const activeItems = items.filter((item) => !item.archived);
  const totalCount = activeItems.length;
  const aquiCount = activeItems.filter((item) => item.category === 'aqui').length;
  const allaCount = activeItems.filter((item) => item.category === 'alla').length;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "curacion-aqui-alla.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center relative font-sans overflow-x-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-[#f4f4f4] text-zinc-900'
    }`}>
      
      {/* BACKGROUND AESTHETICS - Subtle architectural clean grid */}
      <div className={`absolute inset-0 [background-size:20px_20px] pointer-events-none transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-[radial-gradient(#27272a_1px,transparent_1px)] opacity-40' 
          : 'bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] opacity-70'
      }`} />

      {/* 1. PERSISTENT LAYOUT CONTROLLER (Top right floating switcher with dark mode) */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-1 bg-white/85 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 p-1.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300">
        <button
          onClick={() => setLayoutMode('mobile')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            layoutMode === 'mobile'
              ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
          title="Vista Móvil (Aspecto 9:16)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Vista Móvil</span>
        </button>

        <button
          onClick={() => setLayoutMode('desktop')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
            layoutMode === 'desktop'
              ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
          title="Vista Escritorio"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Vista Escritorio</span>
        </button>

        {/* Divider line */}
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1" />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 cursor-pointer"
          title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-zinc-700" />
          ) : (
            <Sun className="w-4 h-4 text-yellow-400" />
          )}
        </button>
      </div>

      {layoutMode === 'mobile' ? (
        /* ==================== 1. MOBILE ASPECT RATIO SIMULATOR VIEW (9:16) ==================== */
        <div className="flex flex-col items-center justify-center p-4 py-10 z-10 w-full max-w-md h-screen">
          
          {/* Smartphone Frame Wrapper - Styled to match the realistic bezel & curved screens */}
          <div className={`relative w-full max-w-[390px] h-full max-h-[820px] aspect-[9/16] rounded-[52px] border-[12px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-500 flex flex-col ${
            theme === 'dark' 
              ? 'border-zinc-800 bg-zinc-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]' 
              : 'border-zinc-950 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)]'
          }`}>
            
            {/* Front-facing camera notch (Dynamic Island style) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-950 rounded-full z-40 flex items-center justify-center gap-2">
              <div className="w-8 h-0.5 bg-zinc-800 rounded-full" />
              <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full border border-zinc-800" />
            </div>

            {/* Status indicators */}
            <div className="absolute top-4 left-0 right-0 h-6 px-7 flex justify-between items-center text-[10px] font-sans font-bold text-zinc-400 z-30 pointer-events-none">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span className="w-3 h-1.5 bg-zinc-400 rounded-sm inline-block" />
              </div>
            </div>

            {/* Core Streaming Feed Inside */}
            <div className="flex-grow w-full h-full relative overflow-hidden">
              <FeedReels />
            </div>

            {/* Bottom Virtual Home Indicator bar */}
            <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full z-40 ${
              theme === 'dark' ? 'bg-zinc-800' : 'bg-zinc-300'
            }`} />
          </div>

          <p className="mt-4 text-center text-zinc-400 dark:text-zinc-500 text-[10px] font-mono tracking-widest uppercase">
            Simulador de Smartphone // Activar modo escritorio para pantalla completa
          </p>
        </div>
      ) : (
        /* ==================== 2. COMPLETE DESKTOP DASHBOARD VIEW ==================== */
        <div className="w-full h-screen z-10 flex overflow-hidden">
          
          {/* DESKTOP SIDEBAR - MOCKUP 1 (Welcome ROUTEMIND screen from photo) */}
          <aside className="w-[390px] h-full bg-zinc-950 text-white p-8 flex flex-col justify-between relative overflow-hidden shrink-0 select-none shadow-2xl border-r border-zinc-900">
            
            {/* Cyber Grid pattern for texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
            <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

            <div className="relative z-20 space-y-8">
              
              {/* Top abstract circle icon - Designed EXACTLY like the peach sunburst/pinwheel circle on Left phone mockup */}
              <div className="flex justify-center pt-4">
                <div className="w-14 h-14 rounded-full bg-[#fca5a5] text-zinc-950 flex items-center justify-center shadow-lg transform rotate-45 animate-spin" style={{ animationDuration: '40s' }}>
                  {/* Pinwheel vector bars */}
                  <svg className="w-8 h-8 stroke-current stroke-[2]" viewBox="0 0 24 24" fill="none">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
                  </svg>
                </div>
              </div>

              {/* Towering Display title - Styled like "ROUTEMIND" in ultra-condensed Oswald */}
              <div className="text-center">
                <h2 className="font-display text-5xl md:text-6xl font-extrabold tracking-[0.16em] text-white uppercase leading-none">
                  AQUÍ // ALLÁ
                </h2>
                <div className="h-0.5 w-12 bg-[#fca5a5]/50 mx-auto mt-4" />
              </div>

              {/* Minimal geometric vector graphic representing the mountain mesh from Left phone mockup */}
              <div className="w-full h-44 rounded-2xl bg-zinc-900/60 border border-zinc-800 relative overflow-hidden flex items-end justify-center p-4 shadow-inner">
                {/* Visual mountain peaks drawn with clean vector gradients */}
                <div className="absolute -bottom-4 left-4 w-36 h-28 bg-gradient-to-t from-zinc-800 to-zinc-900 transform rotate-45 border-t border-l border-zinc-700/60" />
                <div className="absolute -bottom-10 right-2 w-44 h-36 bg-gradient-to-t from-zinc-850 to-zinc-950 transform rotate-45 border-t border-l border-zinc-800" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
                
                <span className="relative z-10 text-[9px] font-mono tracking-widest text-zinc-400 uppercase">
                  Digital Space // Vector Grid
                </span>
              </div>

              {/* Typography block - Designed exactly like "Your Adventure Starts Here" */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-[#fca5a5] uppercase font-bold">
                  WELCOME TO THE PLATFORM
                </span>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
                  Your Curation <br />Starts Here
                </h3>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                  Documenta patrones de excelencia visual e ingeniería limpia junto a antipatrones críticos de usabilidad y código.
                </p>
              </div>

              {/* Action Pill - Designed exactly like the "Let's start" transparent button */}
              <div>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full py-3 px-6 rounded-full border border-white/25 hover:bg-white hover:text-black hover:border-white text-white text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md cursor-pointer"
                >
                  <span>Añadir Registro</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Bottom Database Statistics Console */}
            <div className="relative z-20 border-t border-zinc-900 pt-4 space-y-3">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase font-bold block">
                CONEXIÓN DE DATOS // LOCAL STORAGE
              </span>
              
              <div className="grid grid-cols-3 gap-2">
                <div 
                  onClick={() => setFilter('all')}
                  className="bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-850 text-center cursor-pointer hover:bg-zinc-800 transition-colors"
                  title="Ver todo el feed"
                >
                  <span className="block text-lg font-mono font-bold text-white">{totalCount}</span>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase">Total</span>
                </div>
                <div 
                  onClick={() => setFilter('aqui')}
                  className="bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-850 text-center cursor-pointer hover:border-yellow-400/40 hover:bg-zinc-800 transition-colors"
                  title="Filtrar por Aquí (Inspiración)"
                >
                  <span className="block text-lg font-mono font-bold text-yellow-400">{aquiCount}</span>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase">Aquí</span>
                </div>
                <div 
                  onClick={() => setFilter('alla')}
                  className="bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-850 text-center cursor-pointer hover:border-red-500/40 hover:bg-zinc-800 transition-colors"
                  title="Filtrar por Allá (Evitar)"
                >
                  <span className="block text-lg font-mono font-bold text-red-500">{allaCount}</span>
                  <span className="text-[8px] font-mono text-zinc-500 uppercase">Allá</span>
                </div>
              </div>

              {/* Advanced database curator triggers */}
              <div className="flex gap-2 pt-1 text-[9px] font-mono font-bold">
                <button
                  onClick={resetDatabase}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Reiniciar base de datos a los ejemplos por defecto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESTAURAR DEMO</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Exportar base de datos a archivo JSON"
                >
                  <Download className="w-3 h-3" />
                  <span>RESPALDO JSON</span>
                </button>
              </div>
            </div>
          </aside>

          {/* DESKTOP MAIN VIEWPORT - CENTERING THE REFINED DISCOVER FEED PANEL */}
          <main className={`flex-grow h-full flex items-center justify-center relative transition-colors duration-500 ${
            theme === 'dark' ? 'bg-zinc-900' : 'bg-[#F3F4F6]'
          }`}>
            
            {/* Highly polished floating panel bounds to look exactly like the second phone layout */}
            <div className={`w-full max-w-[430px] h-[92%] rounded-[48px] border-[10px] shadow-[0_30px_70px_rgba(0,0,0,0.25)] relative overflow-hidden flex flex-col transition-all duration-500 ${
              theme === 'dark' 
                ? 'border-zinc-800 bg-zinc-950' 
                : 'border-zinc-900 bg-white'
            }`}>
              
              {/* Simulated hardware elements */}
              <div className={`absolute top-0 left-0 right-0 h-10 z-40 border-b flex items-center justify-center transition-colors duration-500 ${
                theme === 'dark' ? 'bg-zinc-950 border-zinc-800/50' : 'bg-[#F3F4F6] border-zinc-200/50'
              }`}>
                <div className="w-20 h-4 bg-zinc-900 rounded-full flex items-center justify-center gap-1.5">
                  <div className="w-8 h-0.5 bg-zinc-700 rounded-full" />
                  <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                </div>
              </div>

              {/* Feed Content */}
              <div className="flex-grow w-full h-full relative overflow-hidden">
                <FeedReels />
              </div>
            </div>

            {/* Decorative metadata card floating outside to complete the aesthetic */}
            <div className={`absolute bottom-8 right-8 border p-4 rounded-2xl shadow-md hidden xl:flex items-center gap-3 select-none transition-all duration-500 ${
              theme === 'dark' 
                ? 'bg-zinc-900 border-zinc-800 text-white' 
                : 'bg-white border-zinc-200/80 text-zinc-900'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-800'
              }`}>
                <TrendingUp className="w-5 h-5 text-zinc-500" />
              </div>
              <div>
                <span className="block text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">CURATOR STATE</span>
                <span className="block text-xs font-bold uppercase">Interactive Layout Active</span>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Slide-Up Entry form modal mapped on App root for unified desktop triggers */}
      <FormularioIngreso isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
