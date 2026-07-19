import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurationItem, CategoryType, Category, Subcategory, User } from '../types';

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

  // Load initial data from the database via backend Express API (Scoped by User)
  const loadData = async () => {
    if (!currentUser) return;
    
    try {
      const headers = { 'x-user-id': currentUser.id };
      const [resItems, resLikes, resTheme, resCategories, resSubcategories] = await Promise.all([
        fetch('/api/items', { headers }).then(r => r.json()),
        fetch('/api/likes', { headers }).then(r => r.json()),
        fetch('/api/theme', { headers }).then(r => r.json()),
        fetch('/api/categories', { headers }).then(r => r.json()),
        fetch('/api/subcategories', { headers }).then(r => r.json())
      ]);
      
      if (Array.isArray(resItems)) {
        setItems(resItems);
      }
      if (Array.isArray(resLikes)) {
        setLikes(resLikes);
      }
      if (resTheme && (resTheme.theme === 'light' || resTheme.theme === 'dark')) {
        setTheme(resTheme.theme);
      }
      if (Array.isArray(resCategories)) {
        setCategories(resCategories);
      }
      if (Array.isArray(resSubcategories)) {
        setSubcategories(resSubcategories);
      }
    } catch (err) {
      console.error('Error al cargar datos de la base de datos:', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const login = async (email: string, PIN: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: PIN })
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error al iniciar sesión' };
      }
    } catch (e) {
      return { success: false, error: 'Error de red al conectar con el servidor' };
    }
  };

  const register = async (email: string, PIN: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: PIN })
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Error al registrarse' };
      }
    } catch (e) {
      return { success: false, error: 'Error de red al conectar con el servidor' };
    }
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
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify(newItem)
      });
      if (response.ok) {
        const createdItem = await response.json();
        setItems((prev) => [createdItem, ...prev]);
      } else {
        console.error('Error al guardar el item en la base de datos:', response.statusText);
      }
    } catch (err) {
      console.error('Error de red al agregar item:', err);
    }
  };

  const deleteItem = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setLikes((prev) => prev.filter((likedId) => likedId !== id));
      } else {
        console.error('Error al eliminar el item de la base de datos:', response.statusText);
      }
    } catch (err) {
      console.error('Error de red al eliminar item:', err);
    }
  };

  const updateItem = async (id: string, updatedFields: Omit<CurationItem, 'id' | 'createdAt' | 'user_id' | 'archived'>) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify(updatedFields)
      });
      if (response.ok) {
        setItems((prev) => prev.map((item) => {
          if (item.id === id) {
            return { ...item, ...updatedFields };
          }
          return item;
        }));
      } else {
        console.error('Error al actualizar el item en la base de datos:', response.statusText);
      }
    } catch (err) {
      console.error('Error de red al actualizar item:', err);
    }
  };

  const toggleArchiveItem = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/items/${id}/toggle-archive`, {
        method: 'POST',
        headers: { 'x-user-id': currentUser.id }
      });
      if (response.ok) {
        const data = await response.json();
        setItems((prev) => prev.map((item) => {
          if (item.id === id) {
            return { ...item, archived: data.archived };
          }
          return item;
        }));
      } else {
        console.error('Error al archivar el item en la base de datos:', response.statusText);
      }
    } catch (err) {
      console.error('Error de red al archivar item:', err);
    }
  };

  const toggleLike = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/likes/${id}/toggle`, {
        method: 'POST',
        headers: { 'x-user-id': currentUser.id }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.liked) {
          setLikes((prev) => [...prev, id]);
        } else {
          setLikes((prev) => prev.filter((likedId) => likedId !== id));
        }
      } else {
        console.error('Error al cambiar el estado de favorito en la base de datos:', response.statusText);
      }
    } catch (err) {
      console.error('Error de red al cambiar favorito:', err);
    }
  };

  const toggleTheme = async () => {
    if (!currentUser) return;
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    try {
      const response = await fetch('/api/theme', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ theme: nextTheme })
      });
      if (response.ok) {
        setTheme(nextTheme);
      } else {
        console.error('Error al guardar el tema en la base de datos:', response.statusText);
      }
    } catch (err) {
      console.error('Error de red al cambiar tema:', err);
    }
  };

  const addCategory = async (name: string, type: CategoryType) => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ name, type })
      });
      if (response.ok) {
        const newCat = await response.json();
        setCategories((prev) => [...prev, newCat]);
      }
    } catch (err) {
      console.error('Error al agregar categoría:', err);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      if (response.ok) {
        setCategories((prev) => prev.filter(c => c.id !== id));
        setSubcategories((prev) => prev.filter(s => s.category_id !== id));
        // Recargar los items ya que sus referencias habrán cambiado a NULL
        const resItems = await fetch('/api/items', { headers: { 'x-user-id': currentUser.id } }).then(r => r.json());
        if (Array.isArray(resItems)) setItems(resItems);
      }
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
    }
  };

  const addSubcategory = async (category_id: string, name: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ category_id, name })
      });
      if (response.ok) {
        const newSub = await response.json();
        setSubcategories((prev) => [...prev, newSub]);
      }
    } catch (err) {
      console.error('Error al agregar subcategoría:', err);
    }
  };

  const deleteSubcategory = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/subcategories/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-id': currentUser.id }
      });
      if (response.ok) {
        setSubcategories((prev) => prev.filter(s => s.id !== id));
        // Recargar los items ya que sus referencias habrán cambiado a NULL
        const resItems = await fetch('/api/items', { headers: { 'x-user-id': currentUser.id } }).then(r => r.json());
        if (Array.isArray(resItems)) setItems(resItems);
      }
    } catch (err) {
      console.error('Error al eliminar subcategoría:', err);
    }
  };

  const resetDatabase = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: { 'x-user-id': currentUser.id }
      });
      if (response.ok) {
        await loadData();
        setFilter('all');
        setSearchQuery('');
      } else {
        console.error('Error al restablecer la base de datos:', response.statusText);
      }
    } catch (err) {
      console.error('Error de red al restablecer base de datos:', err);
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

