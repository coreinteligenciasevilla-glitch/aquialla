import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Layers, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Zap, 
  Globe, 
  TrendingUp, 
  Heart, 
  AlertTriangle,
  LogOut
} from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const { items, likes, currentUser, logout } = useApp();

  const activeItems = items.filter(i => !i.archived);
  const total = activeItems.length;
  const aquiCount = activeItems.filter(i => i.category === 'aqui').length;
  const allaCount = activeItems.filter(i => i.category === 'alla').length;

  // Platform count helper
  const getPlatformCount = (platform: string) => activeItems.filter(i => i.contentType === platform).length;

  const youtubeCount = getPlatformCount('youtube');
  const instagramCount = getPlatformCount('instagram');
  const linkedinCount = getPlatformCount('linkedin');
  const tiktokCount = getPlatformCount('tiktok');
  const webCount = getPlatformCount('web');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md z-45 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="absolute top-[10%] left-6 right-6 max-h-[80%] bg-zinc-900 border border-zinc-800 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-y-auto flex flex-col p-6 text-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                <h2 className="font-display text-2xl font-bold tracking-wider uppercase">
                  Métricas Globales
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6 py-6">
              
              {/* User Session Info & Logout */}
              {currentUser && (
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/80 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">Sesión Activa</span>
                    <span className="text-xs font-bold text-white block truncate max-w-[180px] sm:max-w-[240px]" title={currentUser.email}>
                      {currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Salir</span>
                  </button>
                </div>
              )}
              {/* Top Big KPI Metrics Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80 text-center">
                  <span className="block text-2xl font-mono font-black text-white">{total}</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Registrados</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80 text-center">
                  <span className="block text-2xl font-mono font-black text-yellow-400">{aquiCount}</span>
                  <span className="text-[9px] font-mono text-yellow-500 uppercase tracking-wider">Aquí</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-2xl border border-zinc-800/80 text-center">
                  <span className="block text-2xl font-mono font-black text-red-500">{allaCount}</span>
                  <span className="text-[9px] font-mono text-red-400 uppercase tracking-wider">Allá</span>
                </div>
              </div>

              {/* Favorites summary */}
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">Elementos Favoritos</h4>
                    <p className="text-[10px] text-zinc-500">Guardados como referencia rápida</p>
                  </div>
                </div>
                <span className="text-xl font-mono font-bold text-rose-400">{likes.length}</span>
              </div>

              {/* Platforms Distribution */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Distribución de Fuentes
                </h4>

                <div className="space-y-2.5">
                  {/* YouTube */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Youtube className="w-4 h-4 text-red-500" />
                        <span>YouTube</span>
                      </div>
                      <span>{youtubeCount} ({total > 0 ? Math.round((youtubeCount/total)*100) : 0}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-500" 
                        style={{ width: `${total > 0 ? (youtubeCount/total)*100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span>Instagram</span>
                      </div>
                      <span>{instagramCount} ({total > 0 ? Math.round((instagramCount/total)*100) : 0}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-500 transition-all duration-500" 
                        style={{ width: `${total > 0 ? (instagramCount/total)*100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-teal-400 animate-pulse" />
                        <span>TikTok</span>
                      </div>
                      <span>{tiktokCount} ({total > 0 ? Math.round((tiktokCount/total)*100) : 0}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-400 transition-all duration-500" 
                        style={{ width: `${total > 0 ? (tiktokCount/total)*100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Linkedin className="w-4 h-4 text-blue-500" />
                        <span>LinkedIn</span>
                      </div>
                      <span>{linkedinCount} ({total > 0 ? Math.round((linkedinCount/total)*100) : 0}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500" 
                        style={{ width: `${total > 0 ? (linkedinCount/total)*100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Web */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-zinc-400" />
                        <span>Artículos Web</span>
                      </div>
                      <span>{webCount} ({total > 0 ? Math.round((webCount/total)*100) : 0}%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-zinc-500 transition-all duration-500" 
                        style={{ width: `${total > 0 ? (webCount/total)*100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote of the day */}
            <div className="mt-auto border-t border-zinc-800 pt-4 text-center">
              <p className="text-[10px] font-mono text-zinc-500 italic">
                &ldquo;Buenos patrones guían; malos patrones destruyen la usabilidad.&rdquo;
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
