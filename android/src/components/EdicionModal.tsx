import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CurationItem, CategoryType, ContentPlatform } from '../types';
import { X, Link2, FileText, Tag, ChevronDown, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EdicionModalProps {
  item: CurationItem | null;
  onClose: () => void;
}

export const EdicionModal: React.FC<EdicionModalProps> = ({ item, onClose }) => {
  const { updateItem, theme, categories, subcategories } = useApp();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryType, setCategoryType] = useState<CategoryType>('aqui');
  const [contentType, setContentType] = useState<ContentPlatform>('web');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load values when item changes
  useEffect(() => {
    if (item) {
      setUrl(item.url);
      setTitle(item.title);
      setDescription(item.description || '');
      setCategoryType(item.category);
      setContentType(item.contentType);
      setCategoryId(item.category_id || '');
      setSubcategoryId(item.subcategory_id || '');
      setErrorMsg('');
    }
  }, [item]);

  // Filter categories by type
  const filteredCats = categories.filter(c => c.type === categoryType || c.type === 'both');
  // Filter subcategories by selected category
  const filteredSubs = subcategories.filter(s => s.category_id === categoryId);

  // If category type changes, reset the selected category and subcategory to avoid mismatch
  const handleCategoryTypeChange = (type: CategoryType) => {
    setCategoryType(type);
    setCategoryId('');
    setSubcategoryId('');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setSubcategoryId(''); // Reset subcategory
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!url.trim() || !title.trim() || !categoryType || !contentType) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    try {
      await updateItem(item.id, {
        url,
        title,
        description,
        category: categoryType,
        contentType,
        category_id: categoryId || undefined,
        subcategory_id: subcategoryId || undefined
      });
      onClose();
    } catch (err) {
      setErrorMsg('Error al guardar los cambios.');
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-45 cursor-pointer"
          />

          {/* Floating glassmorphism card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="absolute top-[8%] left-5 right-5 max-h-[82%] bg-zinc-900 border border-zinc-800 rounded-[36px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-50 overflow-y-auto flex flex-col p-6 text-white"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800 shrink-0">
              <div>
                <h3 className="font-display text-lg font-bold tracking-wider uppercase flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Editar Registro
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Modificar parámetros de curación</p>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="space-y-4 py-4 shrink-0">
              
              {/* Classification toggle bar (Aquí vs Allá) */}
              <div className="flex p-1 bg-zinc-950 rounded-xl border border-zinc-850">
                <button
                  type="button"
                  onClick={() => handleCategoryTypeChange('aqui')}
                  className={`flex-grow py-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    categoryType === 'aqui'
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AQUÍ (Inspiración)
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryTypeChange('alla')}
                  className={`flex-grow py-2 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    categoryType === 'alla'
                      ? 'bg-red-500 text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  ALLÁ (Evitar)
                </button>
              </div>

              {/* URL Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 pl-1 uppercase">
                  <Link2 className="w-3.5 h-3.5 text-zinc-550" />
                  Enlace / URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://ejemplo.com/recurso"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-zinc-750 focus:outline-none transition-all"
                />
              </div>

              {/* Title Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 pl-1 uppercase">
                  <FileText className="w-3.5 h-3.5 text-zinc-550" />
                  Título
                </label>
                <input
                  type="text"
                  required
                  placeholder="Título breve y explicativo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-zinc-750 focus:outline-none transition-all"
                />
              </div>

              {/* Description Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 pl-1 uppercase">
                  <FileText className="w-3.5 h-3.5 text-zinc-550" />
                  Descripción / Análisis
                </label>
                <textarea
                  placeholder="Explica por qué pertenece a esta categoría..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 rounded-xl py-2.5 px-3 text-xs text-white placeholder-zinc-750 focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Platform Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 pl-1 uppercase">
                  <Tag className="w-3.5 h-3.5 text-zinc-550" />
                  Plataforma / Formato
                </label>
                <div className="relative">
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value as ContentPlatform)}
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 rounded-xl py-2.5 px-3 text-xs text-white appearance-none focus:outline-none transition-all font-mono"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="web">Artículo Web</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-3 w-4 h-4 text-zinc-550 pointer-events-none" />
                </div>
              </div>

              {/* Category & Subcategory cascade dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                {/* Category Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 pl-1 uppercase">
                    Categoría
                  </label>
                  <div className="relative">
                    <select
                      value={categoryId}
                      onChange={handleCategoryChange}
                      className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 rounded-xl py-2.5 px-3 text-xs text-white appearance-none focus:outline-none transition-all truncate"
                    >
                      <option value="">Sin Categoría</option>
                      {filteredCats.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 w-4 h-4 text-zinc-550 pointer-events-none" />
                  </div>
                </div>

                {/* Subcategory Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 pl-1 uppercase">
                    Subcategoría
                  </label>
                  <div className="relative">
                    <select
                      value={subcategoryId}
                      onChange={(e) => setSubcategoryId(e.target.value)}
                      disabled={!categoryId}
                      className="w-full bg-zinc-950 border border-zinc-850 focus:border-zinc-700 rounded-xl py-2.5 px-3 text-xs text-white appearance-none focus:outline-none transition-all disabled:opacity-50 truncate"
                    >
                      <option value="">Sin Subcategoría</option>
                      {filteredSubs.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 w-4 h-4 text-zinc-550 pointer-events-none" />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="text-[11px] font-mono text-red-400 bg-red-950/20 border border-red-900/40 p-2.5 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-2 border-t border-zinc-800 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    categoryType === 'aqui'
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : 'bg-red-500 text-white hover:bg-red-400'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
