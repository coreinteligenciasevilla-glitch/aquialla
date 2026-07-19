import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CategoryType, ContentPlatform } from '../types';
import { 
  X, 
  Youtube, 
  Instagram, 
  Linkedin, 
  Globe, 
  Zap, 
  Plus,
  Link,
  Type,
  FileText
} from 'lucide-react';

interface FormularioIngresoProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormularioIngreso: React.FC<FormularioIngresoProps> = ({ isOpen, onClose }) => {
  const { addItem, categories, subcategories } = useApp();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('aqui');
  const [detectedType, setDetectedType] = useState<ContentPlatform>('web');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');

  const availableCategories = categories.filter(c => c.type === category || c.type === 'both');
  const availableSubcategories = subcategories.filter(s => s.category_id === selectedCategoryId);

  // Sync category selection on group type change
  useEffect(() => {
    const filtered = categories.filter(c => c.type === category || c.type === 'both');
    if (filtered.length > 0) {
      setSelectedCategoryId(filtered[0].id);
    } else {
      setSelectedCategoryId('');
    }
  }, [category, categories]);

  // Sync subcategory selection on category change
  useEffect(() => {
    const filtered = subcategories.filter(s => s.category_id === selectedCategoryId);
    if (filtered.length > 0) {
      setSelectedSubcategoryId(''); // Default to none/empty initially
    } else {
      setSelectedSubcategoryId('');
    }
  }, [selectedCategoryId, subcategories]);

  // Real-time URL type detection logic using RegEx
  useEffect(() => {
    const lowercaseUrl = url.toLowerCase().trim();
    if (!lowercaseUrl) {
      setDetectedType('web');
      return;
    }

    if (
      /youtube\.com/i.test(lowercaseUrl) || 
      /youtu\.be/i.test(lowercaseUrl)
    ) {
      setDetectedType('youtube');
    } else if (/tiktok\.com/i.test(lowercaseUrl)) {
      setDetectedType('tiktok');
    } else if (/instagram\.com/i.test(lowercaseUrl)) {
      setDetectedType('instagram');
    } else if (/linkedin\.com/i.test(lowercaseUrl)) {
      setDetectedType('linkedin');
    } else {
      setDetectedType('web');
    }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) {
      return;
    }

    addItem({
      url: url.trim(),
      title: title.trim(),
      description: description.trim(),
      category,
      contentType: detectedType,
      category_id: selectedCategoryId || undefined,
      subcategory_id: selectedSubcategoryId || undefined,
    });

    // Reset Form Fields
    setUrl('');
    setTitle('');
    setDescription('');
    setCategory('aqui');
    setSelectedCategoryId('');
    setSelectedSubcategoryId('');
    onClose();
  };

  // Helper to render platform icon inside URL field
  const renderDetectedIcon = () => {
    switch (detectedType) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-500 animate-pulse" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500 animate-pulse" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'tiktok':
        return <Zap className="w-5 h-5 text-teal-400 animate-pulse" />;
      default:
        return <Globe className="w-5 h-5 text-zinc-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent click-to-close backdrop that respects parent enclosure constraints */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 cursor-pointer"
          />

          {/* Sliding Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 max-h-[85%] bg-zinc-900 border-t border-zinc-800 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-50 overflow-y-auto"
          >
            {/* Cyberpunk Top Drag Handle / Aesthetics */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-zinc-700 rounded-full" />
            </div>

            {/* Form Header */}
            <div className="flex justify-between items-center px-6 pb-4 border-b border-zinc-800/60">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-mono font-bold text-white tracking-tight">
                  NUEVO REGISTRO // CURADOR
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* URL Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-400 flex items-center gap-1.5 uppercase">
                  <Link className="w-3.5 h-3.5 text-zinc-500" />
                  URL del contenido
                </label>
                <div className="relative flex items-center">
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all font-sans"
                  />
                  <div className="absolute right-4">
                    {renderDetectedIcon()}
                  </div>
                </div>
                {url.trim() && (
                  <p className="text-[10px] font-mono text-zinc-500">
                    Plataforma detectada:{' '}
                    <span className="text-zinc-300 font-semibold uppercase">
                      {detectedType === 'web' ? 'Web genérica' : detectedType}
                    </span>
                  </p>
                )}
              </div>

              {/* Title Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-400 flex items-center gap-1.5 uppercase">
                  <Type className="w-3.5 h-3.5 text-zinc-500" />
                  Título descriptivo
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Ej: Patrón de arquitectura limpia o Video Fails..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all font-sans"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-400 flex items-center gap-1.5 uppercase">
                  <FileText className="w-3.5 h-3.5 text-zinc-500" />
                  Notas / Descripción (Opcional)
                </label>
                <textarea
                  placeholder="¿Por qué vale la pena recordar este contenido o qué lección podemos extraer?"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all resize-none font-sans"
                />
              </div>

              {/* Category selector (Aquí vs Allá) */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-semibold text-zinc-400 uppercase block">
                  Categoría / Destino
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* AQUÍ button */}
                  <button
                    type="button"
                    onClick={() => setCategory('aqui')}
                    className={`p-4 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all duration-300 cursor-pointer ${
                      category === 'aqui'
                        ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                        : 'bg-zinc-950 border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-sm font-bold font-mono tracking-wider">AQUÍ</span>
                    <span className="text-[10px] opacity-70">Cosas Buenas</span>
                  </button>

                  {/* ALLÁ button */}
                  <button
                    type="button"
                    onClick={() => setCategory('alla')}
                    className={`p-4 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all duration-300 cursor-pointer ${
                      category === 'alla'
                        ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                        : 'bg-zinc-950 border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <span className="text-sm font-bold font-mono tracking-wider">ALLÁ</span>
                    <span className="text-[10px] opacity-70">Cosas Malas</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Category Dropdown Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-400 uppercase block">
                  Categoría de Estructura
                </label>
                {availableCategories.length > 0 ? (
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all font-sans"
                  >
                    {availableCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs font-mono text-zinc-500 italic p-3 bg-zinc-950 rounded-xl border border-zinc-900">
                    No hay categorías creadas para esta clasificación.
                  </p>
                )}
              </div>

              {/* Dynamic Subcategory Dropdown Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-zinc-400 uppercase block">
                  Subcategoría (Opcional)
                </label>
                {availableSubcategories.length > 0 ? (
                  <select
                    value={selectedSubcategoryId}
                    onChange={(e) => setSelectedSubcategoryId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all font-sans"
                  >
                    <option value="">Ninguna Subcategoría</option>
                    {availableSubcategories.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs font-mono text-zinc-500 italic p-3 bg-zinc-950 rounded-xl border border-zinc-900">
                    No hay subcategorías para esta categoría.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!url.trim() || !title.trim()}
                className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 mt-2 flex items-center justify-center gap-2 cursor-pointer ${
                  category === 'aqui'
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none'
                    : 'bg-red-500 text-white hover:bg-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none'
                }`}
              >
                <span>Guardar en Base de Datos</span>
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
