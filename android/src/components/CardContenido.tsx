import React from 'react';
import { CurationItem } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Youtube, 
  Instagram, 
  Linkedin, 
  Globe, 
  Zap, 
  ExternalLink, 
  Trash2, 
  Sparkles,
  AlertTriangle,
  Heart,
  Archive
} from 'lucide-react';

interface CardContenidoProps {
  item: CurationItem;
  onEditClick: (item: CurationItem) => void;
}

export const CardContenido: React.FC<CardContenidoProps> = ({ item, onEditClick }) => {
  const { deleteItem, likes, toggleLike, toggleArchiveItem, theme } = useApp();
  const isAqui = item.category === 'aqui';
  const isLiked = likes.includes(item.id);

  // Helper to select icon based on platform
  const getPlatformIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-white" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-white" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-white" />;
      case 'tiktok':
        return <Zap className="w-4 h-4 text-white animate-pulse" />;
      default:
        return <Globe className="w-4 h-4 text-white" />;
    }
  };

  // Helper to get stylized platform label
  const getPlatformLabel = (type: string) => {
    switch (type) {
      case 'youtube': return 'YouTube';
      case 'instagram': return 'Instagram';
      case 'linkedin': return 'LinkedIn';
      case 'tiktok': return 'TikTok';
      default: return 'Web';
    }
  };

  // Generate consistent color gradients depending strictly on the category: 'aqui' (Yellow) or 'alla' (Red)
  const getCardBackground = () => {
    if (isAqui) {
      return 'from-amber-500 via-yellow-500 to-zinc-900';
    } else {
      return 'from-red-600 via-rose-700 to-zinc-950';
    }
  };

  return (
    <div 
      id={`card-${item.id}`}
      className={`snap-start scroll-mt-24 w-full h-[88%] flex-shrink-0 flex flex-col justify-between p-5 py-1.5 relative overflow-hidden transition-colors duration-500 ${
        theme === 'dark' ? 'bg-zinc-950' : 'bg-[#F3F4F6]'
      }`}
    >
      {/* Editorial Card frame with hover scale transition and edit trigger */}
      <div 
        onClick={() => onEditClick(item)}
        className={`w-full h-full rounded-[36px] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.18)] relative flex flex-col justify-between p-6 transition-all duration-500 bg-gradient-to-tr cursor-pointer hover:shadow-[0_22px_45px_rgba(0,0,0,0.28)] hover:scale-[1.01] ${getCardBackground()}`}
      >
        {/* Abstract cyber grid graphic overlay for extra texture depth */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
        
        {/* Soft bottom vignette overlay to protect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />

        {/* TOP OF THE CARD: Category Tag & Quick Actions */}
        <div className="relative z-10 flex justify-between items-center w-full">
          {/* Custom category pill */}
          <div 
            className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-sans font-bold tracking-wider uppercase flex items-center gap-1.5 ${
              isAqui 
                ? 'bg-yellow-400/20 border-yellow-400/30 text-yellow-300' 
                : 'bg-red-500/20 border-red-500/30 text-red-300'
            }`}
          >
            {isAqui ? (
              <Sparkles className="w-3 h-3 text-yellow-400" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-red-400" />
            )}
            <span>{isAqui ? 'Aquí // Inspiración' : 'Allá // Evitar'}</span>
          </div>

          {/* Action buttons: Like, Archive, and Delete */}
          <div className="flex items-center gap-1.5">
            {/* Like / Bookmark button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(item.id);
              }}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer ${
                isLiked 
                  ? 'bg-rose-500 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]' 
                  : 'bg-white/15 border-white/20 text-white/80 hover:bg-white/30 hover:text-white'
              }`}
              title={isLiked ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            {/* Archive button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleArchiveItem(item.id);
              }}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer ${
                item.archived
                  ? 'bg-sky-500 border-sky-400 text-white shadow-[0_0_12px_rgba(14,165,233,0.5)]'
                  : 'bg-white/15 border-white/20 text-white/80 hover:bg-white/30 hover:text-white'
              }`}
              title={item.archived ? "Desarchivar del feed" : "Archivar de la colección"}
            >
              <Archive className="w-3.5 h-3.5" />
            </button>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteItem(item.id);
              }}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-red-500/80 hover:scale-105 active:scale-95 text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all duration-300 backdrop-blur-md cursor-pointer"
              title="Eliminar de mi colección"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MIDDLE-BOTTOM OF THE CARD: Context and Metadata Layout */}
        <div className="relative z-10 mt-auto pt-6 space-y-4">
          
          {/* Card Meta Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
              {getPlatformIcon(item.contentType)}
              <span className="text-[10px] font-mono tracking-widest text-white/90 uppercase">
                {getPlatformLabel(item.contentType)}
              </span>
            </div>

            <div className="text-right">
              <span className="block text-xs font-mono font-bold uppercase tracking-wider text-white/90">
                INFO // LINK
              </span>
              <span className="block text-[8px] font-mono text-white/60 tracking-widest uppercase">
                ORIGINAL SOURCE
              </span>
            </div>
          </div>

          {/* Title & Description stack */}
          <div className="space-y-1.5 text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight line-clamp-3">
              {item.title}
            </h3>
            
            {item.description && (
              <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-3 max-w-sm">
                {item.description}
              </p>
            )}
          </div>

          {/* BOTTOM PILL BUTTON: Link to content */}
          <div className="pt-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-3 px-4 rounded-full border border-white/30 hover:bg-white hover:text-black hover:border-white text-white text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <span>Ver contenido original</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
