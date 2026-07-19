import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CategoryType, HistoryItem } from '../types';
import { 
  X, 
  Trash2, 
  FolderPlus, 
  BarChart3, 
  Plus, 
  ExternalLink, 
  Calendar, 
  Layers, 
  FolderKanban, 
  Sparkles, 
  AlertTriangle,
  ArchiveRestore
} from 'lucide-react';

interface AnalisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalisisModal: React.FC<AnalisisModalProps> = ({ isOpen, onClose }) => {
  const { 
    categories, 
    subcategories, 
    addCategory, 
    deleteCategory, 
    addSubcategory, 
    deleteSubcategory,
    theme,
    currentUser,
    toggleArchiveItem
  } = useApp();

  const [activeTab, setActiveTab] = useState<'history' | 'categories'>('history');
  
  // History section states
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | CategoryType>('all');
  const [showArchivedOnly, setShowArchivedOnly] = useState(false);

  // Creation forms states
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<CategoryType>('aqui');
  const [newSubName, setNewSubName] = useState('');
  const [newSubParentId, setNewSubParentId] = useState('');

  // Load history joined data from the API
  const fetchHistory = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/history', {
        headers: { 'x-user-id': currentUser.id }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setHistoryItems(data);
        }
      }
    } catch (e) {
      console.error('Error al cargar historial:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
      // Set default parent category for subcategory form if none selected
      if (categories.length > 0 && !newSubParentId) {
        setNewSubParentId(categories[0].id);
      }
    }
  }, [isOpen, categories]);

  // Handle Category Creation
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory(newCatName.trim(), newCatType);
    setNewCatName('');
  };

  // Handle Subcategory Creation
  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentId = newSubParentId || (categories.length > 0 ? categories[0].id : '');
    if (!newSubName.trim() || !parentId) return;
    await addSubcategory(parentId, newSubName.trim());
    setNewSubName('');
  };

  // Filter history items
  const filteredHistory = historyItems.filter(item => {
    const matchType = selectedTypeFilter === 'all' || item.category === selectedTypeFilter;
    const matchCat = selectedCategoryFilter === 'all' || item.category_id === selectedCategoryFilter;
    const matchSub = selectedSubcategoryFilter === 'all' || item.subcategory_id === selectedSubcategoryFilter;
    const matchArchived = showArchivedOnly ? item.archived === true : !item.archived;
    return matchType && matchCat && matchSub && matchArchived;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 cursor-pointer"
          />

          {/* Sliding Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-0 left-0 right-0 max-h-[90%] bg-zinc-950 border-t border-zinc-800 rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.6)] z-50 overflow-y-auto flex flex-col font-sans"
          >
            {/* Top Drag Handle / Indicator */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-zinc-800 rounded-full" />
            </div>

            {/* Header / Tabs */}
            <div className="px-6 pb-2 border-b border-zinc-850 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#fca5a5]" />
                  <h2 className="text-lg font-mono font-bold text-white tracking-tight uppercase">
                    ESTRUCTURACIÓN Y ANÁLISIS
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex bg-zinc-900/60 p-1 rounded-xl border border-zinc-850">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeTab === 'history'
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Historial &amp; Análisis
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex-1 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Estructura (Árbol)
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto p-6 text-white min-h-[350px]">
              {activeTab === 'history' ? (
                /* TAB 1: HISTORY & ANALYSIS */
                <div className="space-y-5">
                  {/* Filters Console */}
                  <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-850 space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-[#fca5a5] uppercase font-bold block">
                      FILTRADO DE HISTORIAL
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Destino Filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-400 uppercase">Clasificación</label>
                        <select
                          value={selectedTypeFilter}
                          onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-700"
                        >
                          <option value="all">Ver Todos</option>
                          <option value="aqui">Aquí (Inspiración)</option>
                          <option value="alla">Allá (Evitar)</option>
                          <option value="both">Ambos (Los dos)</option>
                        </select>
                      </div>

                      {/* Category Filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-400 uppercase">Categoría</label>
                        <select
                          value={selectedCategoryFilter}
                          onChange={(e) => {
                            setSelectedCategoryFilter(e.target.value);
                            setSelectedSubcategoryFilter('all'); // Reset subcat on category change
                          }}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-700"
                        >
                          <option value="all">Todas las Categorías</option>
                          {categories
                            .filter(c => selectedTypeFilter === 'all' || c.type === selectedTypeFilter)
                            .map(c => (
                              <option key={c.id} value={c.id}>{c.name} ({c.type.toUpperCase()})</option>
                            ))}
                        </select>
                      </div>

                      {/* Subcategory Filter */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-zinc-400 uppercase">Subcategoría</label>
                        <select
                          value={selectedSubcategoryFilter}
                          onChange={(e) => setSelectedSubcategoryFilter(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-700"
                          disabled={selectedCategoryFilter === 'all'}
                        >
                          <option value="all">Todas las Subcategorías</option>
                          {subcategories
                            .filter(s => s.category_id === selectedCategoryFilter)
                            .map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1.5 px-1">
                      <input
                        type="checkbox"
                        id="show-archived"
                        checked={showArchivedOnly}
                        onChange={(e) => setShowArchivedOnly(e.target.checked)}
                        className="w-3.5 h-3.5 accent-yellow-405 bg-zinc-950 border border-zinc-800 rounded focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="show-archived" className="text-[10px] font-mono text-zinc-350 uppercase tracking-wider cursor-pointer select-none">
                        Ver elementos archivados únicamente
                      </label>
                    </div>
                  </div>

                  {/* Listings */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase font-bold">
                        REGISTROS HALLADOS ({filteredHistory.length})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {filteredHistory.length > 0 ? (
                        filteredHistory.map((item) => (
                          <div 
                            key={item.id}
                            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 ${
                              item.category === 'aqui'
                                ? 'bg-yellow-400/5 border-yellow-400/10 hover:border-yellow-400/20'
                                : 'bg-red-500/5 border-red-500/10 hover:border-red-500/20'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider ${
                                  item.category === 'aqui'
                                    ? 'bg-yellow-400/20 text-yellow-300'
                                    : 'bg-red-500/20 text-red-300'
                                }`}>
                                  {item.categoryName || 'Sin Categoría'}
                                  {item.subcategoryName ? ` // ${item.subcategoryName}` : ''}
                                </span>
                                
                                <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                                  {item.title}
                                </h4>
                                
                                {item.description && (
                                  <p className="text-xs text-zinc-400 font-light line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={async () => {
                                    await toggleArchiveItem(item.id);
                                    fetchHistory();
                                  }}
                                  className={`p-2 rounded-full bg-zinc-950 border transition-colors cursor-pointer ${
                                    item.archived
                                      ? 'border-sky-500/30 text-sky-400 hover:bg-sky-500 hover:text-white'
                                      : 'border-zinc-850 text-zinc-450 hover:bg-zinc-800 hover:text-white'
                                  }`}
                                  title={item.archived ? "Desarchivar del feed" : "Archivar de la colección"}
                                >
                                  <ArchiveRestore className="w-3.5 h-3.5" />
                                </button>

                                <a 
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-full bg-zinc-950 border border-zinc-850 text-zinc-450 hover:text-white transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>

                            <div className="flex justify-between items-center border-t border-zinc-900 pt-2.5 text-[9px] font-mono text-zinc-500">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                              <span className="uppercase tracking-widest">{item.contentType}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 bg-zinc-900/20 border border-dashed border-zinc-850 rounded-2xl p-6">
                          <Layers className="w-8 h-8 text-zinc-600 mx-auto mb-2 animate-pulse" />
                          <span className="block text-xs font-mono text-zinc-500 uppercase">Sin coincidencias</span>
                          <p className="text-[10px] text-zinc-600 mt-1 max-w-xs mx-auto">
                            No hay registros para los filtros seleccionados o la colección está vacía.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: STRUCTURE & CATEGORIES CREATION */
                <div className="space-y-6">
                  {/* Category Tree Visualization */}
                  <div className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-850 space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-[#fca5a5] uppercase font-bold block">
                      ÁRBOL ESTRUCTURAL ACTUAL
                    </span>

                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
                      {categories.length > 0 ? (
                        categories.map((cat) => {
                          const catSubs = subcategories.filter(s => s.category_id === cat.id);
                          return (
                            <div key={cat.id} className="space-y-2 border-l-2 border-zinc-800 pl-4">
                              <div className="flex justify-between items-center">
                                <span className={`text-xs font-bold font-mono tracking-wide uppercase flex items-center gap-1.5 ${
                                  cat.type === 'aqui' ? 'text-yellow-400' : cat.type === 'both' ? 'text-purple-400' : 'text-red-400'
                                }`}>
                                  {cat.type === 'aqui' ? (
                                    <Sparkles className="w-3.5 h-3.5" />
                                  ) : cat.type === 'both' ? (
                                    <Layers className="w-3.5 h-3.5" />
                                  ) : (
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                  )}
                                  {cat.name}
                                </span>
                                
                                <button
                                  onClick={() => deleteCategory(cat.id)}
                                  className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                                  title="Eliminar Categoría y Subcategorías"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="pl-4 space-y-1.5">
                                {catSubs.length > 0 ? (
                                  catSubs.map(sub => (
                                    <div key={sub.id} className="flex justify-between items-center text-xs text-zinc-400 font-sans">
                                      <span className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                                        {sub.name}
                                      </span>
                                      <button
                                        onClick={() => deleteSubcategory(sub.id)}
                                        className="text-zinc-700 hover:text-red-500 transition-colors p-1"
                                        title="Eliminar Subcategoría"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-[10px] text-zinc-600 font-mono italic block">
                                    [Sin subcategorías]
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-zinc-500 text-xs font-mono">
                          No hay categorías configuradas.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Creation Forms Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Create Category Form */}
                    <form onSubmit={handleCreateCategory} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-850 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5">
                          <FolderPlus className="w-4 h-4 text-yellow-400" />
                          <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase font-bold">
                            NUEVA CATEGORÍA
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase">Nombre</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Rendimiento, Visuals..."
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-700"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase">Grupo / Clasificación</label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setNewCatType('aqui')}
                              className={`py-2 rounded-lg font-mono text-[10px] font-bold border transition-all ${
                                newCatType === 'aqui'
                                  ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400'
                                  : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                              }`}
                            >
                              AQUÍ
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewCatType('alla')}
                              className={`py-2 rounded-lg font-mono text-[10px] font-bold border transition-all ${
                                newCatType === 'alla'
                                  ? 'bg-red-500/10 border-red-500 text-red-500'
                                  : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                              }`}
                            >
                              ALLÁ
                            </button>
                            <button
                              type="button"
                              onClick={() => setNewCatType('both')}
                              className={`py-2 rounded-lg font-mono text-[10px] font-bold border transition-all ${
                                newCatType === 'both'
                                  ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                                  : 'bg-zinc-950 border-zinc-850 text-zinc-500'
                              }`}
                            >
                              AMBOS
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!newCatName.trim()}
                        className="w-full py-2 bg-white text-zinc-950 hover:bg-zinc-100 disabled:bg-zinc-850 disabled:text-zinc-600 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all mt-4 cursor-pointer"
                      >
                        Crear Categoría
                      </button>
                    </form>

                    {/* Create Subcategory Form */}
                    <form onSubmit={handleCreateSubcategory} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-850 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5">
                          <Plus className="w-4 h-4 text-teal-400" />
                          <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase font-bold">
                            NUEVA SUBCATEGORÍA
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase">Nombre</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: Hooks, Tree-shaking..."
                            value={newSubName}
                            onChange={(e) => setNewSubName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-700"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase">Categoría Padre</label>
                          <select
                            value={newSubParentId}
                            onChange={(e) => setNewSubParentId(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-zinc-700"
                          >
                            <option value="">Selecciona una Categoría...</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name} ({c.type.toUpperCase()})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!newSubName.trim() || !newSubParentId}
                        className="w-full py-2 bg-white text-zinc-950 hover:bg-zinc-100 disabled:bg-zinc-850 disabled:text-zinc-600 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-all mt-4 cursor-pointer"
                      >
                        Crear Subcategoría
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom space holder */}
            <div className="h-6 shrink-0" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
