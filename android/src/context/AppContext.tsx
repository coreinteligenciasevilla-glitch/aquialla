import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurationItem, CategoryType, Category, Subcategory, User } from '../types';
import { LocalDb } from './LocalDb';

interface AppContextProps {
  currentUser: User | null;
  login: (email: string, PIN: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, PIN: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  items: CurationItem[];
  addItem: (item: Omit<CurationItem, 'id' | 'createdAt'>) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, updatedFields: Omit<CurationItem, 'id' | 'createdAt' | 'user_id' | 'archived'>) => Promise<void>;
  toggleArchiveItem: (id: string) => Promise<void>;
  filter: 'all' | CategoryType;
  setFilter: (filter: 'all' | CategoryType) => void;
  layoutMode: 'mobile' | 'desktop';
  setLayoutMode: (mode: 'mobile' | 'desktop') => void;
  likes: string[];
  toggleLike: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetDatabase: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  categories: Category[];
  subcategories: Subcategory[];
  addCategory: (name: string, type: CategoryType) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addSubcategory: (category_id: string, name: string) => Promise<void>;
  deleteSubcategory: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('curador_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [items, setItems] = useState<CurationItem[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filter, setFilter] = useState<'all' | CategoryType>('all');
  const [layoutMode, setLayoutMode] = useState<'mobile' | 'desktop'>('mobile');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('curador_theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  // Sync theme class list on mount/theme state change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('curador_theme', theme);
  }, [theme]);

  // Sync user state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('curador_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('curador_user');
    }
  }, [currentUser]);

  // Load initial data from the database simulation LocalDb (Scoped by User)
  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      const resItems = LocalDb.getItems(currentUser.id);
      const resLikes = LocalDb.getLikes(currentUser.id);
      const resTheme = LocalDb.getTheme(currentUser.id);
      const resCategories = LocalDb.getCategories(currentUser.id);
      const resSubcategories = LocalDb.getSubcategories(currentUser.id);
      
      setItems(resItems);
      setLikes(resLikes);
      if (resTheme === 'light' || resTheme === 'dark') {
        setTheme(resTheme);
      }
      setCategories(resCategories);
      setSubcategories(resSubcategories);
    } catch (err) {
      console.error('Error al cargar datos locales:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const login = async (email: string, PIN: string): Promise<{ success: boolean; error?: string }> => {
    const result = LocalDb.login(email, PIN);
    if (result.success && result.data) {
      setCurrentUser(result.data);
      return { success: true };
    }
    return { success: false, error: result.error || 'Credenciales incorrectas' };
  };

  const register = async (email: string, PIN: string): Promise<{ success: boolean; error?: string }> => {
    const result = LocalDb.register(email, PIN);
    if (result.success && result.data) {
      setCurrentUser(result.data);
      return { success: true };
    }
    return { success: false, error: result.error || 'Error al registrarse' };
  };

  const logout = () => {
    setCurrentUser(null);
    setItems([]);
    setLikes([]);
    setCategories([]);
    setSubcategories([]);
    setFilter('all');
    setSearchQuery('');
  };

  const addItem = async (newItem: Omit<CurationItem, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    try {
      const createdItem = LocalDb.addItem(currentUser.id, newItem);
      setItems((prev) => [createdItem, ...prev]);
    } catch (err) {
      console.error('Error local al agregar item:', err);
    }
  };

  const deleteItem = async (id: string) => {
    if (!currentUser) return;
    try {
      LocalDb.deleteItem(currentUser.id, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setLikes((prev) => prev.filter((likedId) => likedId !== id));
    } catch (err) {
      console.error('Error local al eliminar item:', err);
    }
  };

  const updateItem = async (id: string, updatedFields: Omit<CurationItem, 'id' | 'createdAt' | 'user_id' | 'archived'>) => {
    if (!currentUser) return;
    try {
      LocalDb.updateItem(currentUser.id, id, updatedFields);
      setItems((prev) => prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updatedFields };
        }
        return item;
      }));
    } catch (err) {
      console.error('Error local al actualizar item:', err);
    }
  };

  const toggleArchiveItem = async (id: string) => {
    if (!currentUser) return;
    try {
      const archived = LocalDb.toggleArchiveItem(currentUser.id, id);
      setItems((prev) => prev.map((item) => {
        if (item.id === id) {
          return { ...item, archived };
        }
        return item;
      }));
    } catch (err) {
      console.error('Error local al archivar item:', err);
    }
  };

  const toggleLike = async (id: string) => {
    if (!currentUser) return;
    try {
      const liked = LocalDb.toggleLike(currentUser.id, id);
      if (liked) {
        setLikes((prev) => [...prev, id]);
      } else {
        setLikes((prev) => prev.filter((likedId) => likedId !== id));
      }
    } catch (err) {
      console.error('Error local al cambiar favorito:', err);
    }
  };

  const toggleTheme = async () => {
    if (!currentUser) return;
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    try {
      LocalDb.setTheme(currentUser.id, nextTheme);
      setTheme(nextTheme);
    } catch (err) {
      console.error('Error local al cambiar tema:', err);
    }
  };

  const addCategory = async (name: string, type: CategoryType) => {
    if (!currentUser) return;
    try {
      const newCat = LocalDb.addCategory(currentUser.id, name, type);
      setCategories((prev) => [...prev, newCat]);
    } catch (err) {
      console.error('Error local al agregar categoría:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!currentUser) return;
    try {
      LocalDb.deleteCategory(currentUser.id, id);
      setCategories((prev) => prev.filter(c => c.id !== id));
      setSubcategories((prev) => prev.filter(s => s.category_id !== id));
      setItems(LocalDb.getItems(currentUser.id));
    } catch (err) {
      console.error('Error local al eliminar categoría:', err);
    }
  };

  const addSubcategory = async (category_id: string, name: string) => {
    if (!currentUser) return;
    try {
      const newSub = LocalDb.addSubcategory(currentUser.id, category_id, name);
      setSubcategories((prev) => [...prev, newSub]);
    } catch (err) {
      console.error('Error local al agregar subcategoría:', err);
    }
  };

  const deleteSubcategory = async (id: string) => {
    if (!currentUser) return;
    try {
      LocalDb.deleteSubcategory(currentUser.id, id);
      setSubcategories((prev) => prev.filter(s => s.id !== id));
      setItems(LocalDb.getItems(currentUser.id));
    } catch (err) {
      console.error('Error local al eliminar subcategoría:', err);
    }
  };

  const resetDatabase = async () => {
    if (!currentUser) return;
    try {
      LocalDb.resetDatabase(currentUser.id);
      await loadData();
      setFilter('all');
      setSearchQuery('');
    } catch (err) {
      console.error('Error local al restablecer base de datos:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        items,
        addItem,
        deleteItem,
        updateItem,
        toggleArchiveItem,
        filter,
        setFilter,
        layoutMode,
        setLayoutMode,
        likes,
        toggleLike,
        searchQuery,
        setSearchQuery,
        resetDatabase,
        theme,
        toggleTheme,
        categories,
        subcategories,
        addCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};
