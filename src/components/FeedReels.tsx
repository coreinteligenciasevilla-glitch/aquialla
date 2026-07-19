import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CardContenido } from './CardContenido';
import { FormularioIngreso } from './FormularioIngreso';
import { StatsModal } from './StatsModal';
import { AnalisisModal } from './AnalisisModal';
import { EdicionModal } from './EdicionModal';
import { CurationItem } from '../types';
import { 
  Compass, 
  Heart, 
  AlertTriangle, 
  Plus, 
  Sparkles,
  Layers,
  ArrowDown,
  Search,
  X,
  Sun,
  Moon,
  FolderKanban
} from 'lucide-react';

export const FeedReels: React.FC = () => {
  const { items, filter, setFilter, searchQuery, setSearchQuery, theme, toggleTheme } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isAnalisisOpen, setIsAnalisisOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [editingItem, setEditingItem] = useState<CurationItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter items based on active category, archived status, and text search query
  const filteredItems = items.filter((item) => {
    const isNotArchived = !item.archived;
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return isNotArchived && matchesCategory && matchesSearch;
  });

  // Scroll back to top smoothly when the filter or search changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [filter, searchQuery]);

  return (
    <div className={`relative w-full h-full flex flex-col select-none overflow-hidden transition-colors duration-500 ${
      theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-[#F3F4F6] text-zinc-900'
    }`}>
      
      {/* 1. EDITORIAL HEADER OVERLAY: Styled EXACTLY like the "DISCOVER" header from the screenshot */}
      <header className={`absolute top-0 left-0 right-0 z-30 pt-12 pb-5 px-6 flex items-center justify-between pointer-events-none transition-colors duration-500 bg-gradient-to-b ${
        theme === 'dark' 
          ? 'from-zinc-950 via-zinc-950/85 to-transparent' 
          : 'from-[#F3F4F6] via-[#F3F4F6]/85 to-transparent'
      }`}>
        
        {isSearchActive ? (
          <div className={`w-full pointer-events-auto flex items-center gap-2 border p-2 rounded-full shadow-lg transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-zinc-900 border-zinc-800 text-white' 
              : 'bg-white border-zinc-200 text-zinc-900'
          }`}>
            <Search className="w-4 h-4 text-zinc-400 ml-2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título o descripción..."
              className={`flex-grow bg-transparent text-xs font-sans placeholder-zinc-400 focus:outline-none ${
                theme === 'dark' ? 'text-white' : 'text-zinc-900'
              }`}
              autoFocus
            />
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchActive(false);
              }}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Left Side: Creative User Avatar circle - click to see Stats */}
            <div className="pointer-events-auto">
              <div 
                onClick={() => setIsStatsOpen(true)}
                className="relative w-11 h-11 rounded-full border border-white/80 shadow-md overflow-hidden bg-zinc-300 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                title="Ver estadísticas"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                  alt="Profile" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Online status indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-yellow-400 border border-white animate-pulse" />
              </div>
            </div>

            {/* Right Side: Theme, Search, Analysis and Add Buttons */}
            <div className="pointer-events-auto flex items-center gap-1.5 ml-auto">
              {/* Quick Theme Toggle inside the Feed */}
              <button
                onClick={toggleTheme}
                className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-yellow-400 hover:bg-zinc-800'
                    : 'bg-white border-zinc-200/80 text-zinc-700 hover:bg-zinc-50'
                }`}
                title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-zinc-700 stroke-[2]" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-400 stroke-[2]" />
                )}
              </button>

              <button
                onClick={() => setIsSearchActive(true)}
                className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800' 
                    : 'bg-white border-zinc-200/80 text-zinc-950 hover:bg-zinc-50'
                }`}
                title="Buscar recursos"
              >
                <Search className="w-5 h-5 stroke-[2]" />
              </button>

              {/* [NEW] Analysis and Categories Button */}
              <button
                onClick={() => setIsAnalisisOpen(true)}
                className={`w-11 h-11 rounded-full border flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-900 border-zinc-800 text-[#fca5a5] hover:bg-zinc-800'
                    : 'bg-white border-zinc-200/80 text-[#f77070] hover:bg-zinc-50'
                }`}
                title="Historial de análisis y categorías"
              >
                <FolderKanban className="w-5 h-5 stroke-[2]" />
              </button>

              <button
                onClick={() => setIsFormOpen(true)}
                className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                    : 'bg-zinc-950 text-white hover:bg-zinc-800'
                }`}
                title="Añadir nuevo recurso"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </>
        )}
      </header>

      {/* 2. THE MAIN STREAMING FEED AREA */}
      <div 
        ref={containerRef}
        className={`flex-grow w-full h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth scrollbar-none pt-24 pb-28 transition-colors duration-500 ${
          theme === 'dark' ? 'bg-zinc-950' : 'bg-[#F3F4F6]'
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <CardContenido key={item.id} item={item} onEditClick={setEditingItem} />
          ))
        ) : (
          /* Custom centered empty state matching the clean, light aesthetic */
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative">
            <div className={`absolute inset-0 [background-size:16px_16px] opacity-40 pointer-events-none ${
              theme === 'dark' 
                ? 'bg-[radial-gradient(#27272a_1px,transparent_1px)]' 
                : 'bg-[radial-gradient(#e4e4e7_1px,transparent_1px)]'
            }`} />
            
            <div className="relative z-10 space-y-4 max-w-xs">
              <div className={`w-20 h-20 rounded-full border shadow-md flex items-center justify-center mx-auto transition-colors ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
              }`}>
                <Compass className="w-9 h-9 text-zinc-400 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <h3 className={`font-display text-xl font-bold tracking-widest uppercase ${
                theme === 'dark' ? 'text-white' : 'text-zinc-950'
              }`}>
                COLECCIÓN VACÍA
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                No hay elementos catalogados bajo la categoría de{' '}
                <span className={`font-bold uppercase font-mono px-2 py-0.5 rounded ${
                  theme === 'dark' ? 'text-white bg-zinc-800' : 'text-zinc-900 bg-zinc-200'
                }`}>
                  {filter === 'all' ? 'Ver todo' : filter === 'aqui' ? 'Aquí' : 'Allá'}
                </span>
                . ¡Sé el primero en documentar un hallazgo!
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                  theme === 'dark' ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Agregar ahora</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. TRANS-GLASSMORPHIC FLOATING DOCK: Positioned and styled EXACTLY like the bottom dock in the screenshot */}
      <div className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none flex justify-center">
        <nav className={`w-full max-w-[340px] h-16 rounded-[28px] backdrop-blur-xl border flex items-center justify-around px-4 pointer-events-auto transition-colors duration-500 ${
          theme === 'dark' 
            ? 'bg-zinc-900/80 border-zinc-800 shadow-[0_15px_35px_rgba(0,0,0,0.5)] text-white' 
            : 'bg-white/60 border-white/50 shadow-[0_15px_35px_rgba(0,0,0,0.12)] text-zinc-900'
        }`}>
          
          {/* Item 1: Compass icon (VER TODO) */}
          <button
            onClick={() => setFilter('all')}
            className={`flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-300 relative cursor-pointer ${
              filter === 'all' 
                ? (theme === 'dark' ? 'bg-white text-zinc-950 shadow-md scale-105' : 'bg-zinc-950 text-white shadow-md scale-105')
                : (theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/50')
            }`}
            title="Ver Todo"
          >
            <Compass className="w-5 h-5 stroke-[2]" />
            <span className="text-[7px] font-mono font-bold tracking-widest absolute -bottom-3 uppercase">
              TODO
            </span>
          </button>

          {/* Item 2: Heart icon (AQUÍ - COSAS BUENAS) */}
          <button
            onClick={() => setFilter('aqui')}
            className={`flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-300 relative cursor-pointer ${
              filter === 'aqui' 
                ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)] scale-105' 
                : (theme === 'dark' ? 'text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10' : 'text-zinc-500 hover:text-yellow-600 hover:bg-yellow-400/10')
            }`}
            title="Filtrar Aquí (Buenas)"
          >
            <Heart className="w-5 h-5 stroke-[2] fill-current" />
            <span className="text-[7px] font-mono font-bold tracking-widest absolute -bottom-3 uppercase">
              AQUÍ
            </span>
          </button>

          {/* Item 3: Highlighted Central Adding Button */}
          <button
            onClick={() => setIsFormOpen(true)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer relative -translate-y-1 border ${
              theme === 'dark' 
                ? 'bg-white text-zinc-950 hover:bg-zinc-100 border-white/20' 
                : 'bg-zinc-950 text-white hover:bg-zinc-800 border-white/20'
            }`}
            title="Agregar Registro"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Item 4: Alert icon (ALLÁ - COSAS MALAS) */}
          <button
            onClick={() => setFilter('alla')}
            className={`flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-300 relative cursor-pointer ${
              filter === 'alla' 
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-105' 
                : (theme === 'dark' ? 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10' : 'text-zinc-500 hover:text-red-600 hover:bg-red-500/10')
            }`}
            title="Filtrar Allá (Malas)"
          >
            <AlertTriangle className="w-5 h-5 stroke-[2]" />
            <span className="text-[7px] font-mono font-bold tracking-widest absolute -bottom-3 uppercase">
              ALLÁ
            </span>
          </button>

          {/* Item 5: Small Stats Capsule Counter (Click to open metrics modal) */}
          <button
            onClick={() => setIsStatsOpen(true)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-mono font-bold cursor-pointer transition-all ${
              theme === 'dark' 
                ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300' 
                : 'bg-zinc-200/50 hover:bg-zinc-200/80 border-white/40 text-zinc-700'
            }`}
            title="Ver estadísticas y métricas"
          >
            <Layers className="w-3 h-3 text-zinc-500" />
            <span>{filteredItems.length}</span>
          </button>

        </nav>
      </div>

      {/* 4. FLOATING SCROLL-DOWN INDICATOR */}
      {filteredItems.length > 1 && (
        <div className={`absolute top-28 right-6 z-20 pointer-events-none animate-bounce p-2 rounded-full border shadow-md transition-colors ${
          theme === 'dark' 
            ? 'bg-zinc-900 border-zinc-800 text-zinc-300' 
            : 'bg-white/80 border-zinc-200/80 text-zinc-600'
        }`}>
          <ArrowDown className="w-4 h-4" />
        </div>
      )}

      {/* Slide-Up Bottom Sheet Entry Form */}
      <FormularioIngreso isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      
      {/* Analytics & Stats Breakdown Overlay Modal */}
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />

      {/* Categories Structure & History Analysis Modal */}
      <AnalisisModal isOpen={isAnalisisOpen} onClose={() => setIsAnalisisOpen(false)} />

      {/* Item Editing Modal Overlay */}
      <EdicionModal item={editingItem} onClose={() => setEditingItem(null)} />
    </div>
  );
};
