import { CurationItem, Category, Subcategory, User, CategoryType } from '../types';
import { INITIAL_ITEMS, INITIAL_CATEGORIES, INITIAL_SUBCATEGORIES } from '../initialData';

// Helper to generate UUID-like strings in frontend
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const LocalDb = {
  // Authentication
  register: (email: string, PIN: string): { success: boolean; data?: User; error?: string } => {
    const emailClean = email.toLowerCase().trim();
    if (!emailClean || !/^\d{4}$/.test(PIN)) {
      return { success: false, error: 'Email y PIN de 4 números requeridos.' };
    }
    
    const users: User[] = JSON.parse(localStorage.getItem('cap_users') || '[]');
    const userPasswords: Record<string, string> = JSON.parse(localStorage.getItem('cap_user_passwords') || '{}');
    
    if (users.some(u => u.email === emailClean)) {
      return { success: false, error: 'El correo electrónico ya se encuentra registrado.' };
    }
    
    const userId = 'usr_' + generateId();
    const newUser: User = {
      id: userId,
      email: emailClean,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    userPasswords[emailClean] = PIN;
    
    localStorage.setItem('cap_users', JSON.stringify(users));
    localStorage.setItem('cap_user_passwords', JSON.stringify(userPasswords));
    
    // Seed user-specific default sandbox data
    const userCategories: Category[] = INITIAL_CATEGORIES.map(cat => ({
      ...cat,
      id: `${cat.id}_${userId}`,
      user_id: userId
    }));
    
    const userSubcategories: Subcategory[] = INITIAL_SUBCATEGORIES.map(sub => ({
      ...sub,
      id: `${sub.id}_${userId}`,
      category_id: `${sub.category_id}_${userId}`,
      user_id: userId
    }));
    
    const userItems: CurationItem[] = INITIAL_ITEMS.map(item => ({
      ...item,
      id: `${item.id}_${userId}`,
      category_id: item.category_id ? `${item.category_id}_${userId}` : undefined,
      subcategory_id: item.subcategory_id ? `${item.subcategory_id}_${userId}` : undefined,
      user_id: userId,
      archived: false
    }));
    
    const defaultLikes = ['1', '3', '5'].map(id => `${id}_${userId}`);
    
    localStorage.setItem(`cap_categories_${userId}`, JSON.stringify(userCategories));
    localStorage.setItem(`cap_subcategories_${userId}`, JSON.stringify(userSubcategories));
    localStorage.setItem(`cap_items_${userId}`, JSON.stringify(userItems));
    localStorage.setItem(`cap_likes_${userId}`, JSON.stringify(defaultLikes));
    localStorage.setItem(`cap_theme_${userId}`, 'light');
    
    return { success: true, data: newUser };
  },

  login: (email: string, PIN: string): { success: boolean; data?: User; error?: string } => {
    const emailClean = email.toLowerCase().trim();
    const users: User[] = JSON.parse(localStorage.getItem('cap_users') || '[]');
    const userPasswords: Record<string, string> = JSON.parse(localStorage.getItem('cap_user_passwords') || '{}');
    
    const user = users.find(u => u.email === emailClean);
    if (!user || userPasswords[emailClean] !== PIN) {
      return { success: false, error: 'El correo electrónico o el PIN de 4 números son incorrectos.' };
    }
    
    return { success: true, data: user };
  },

  // Items
  getItems: (userId: string): CurationItem[] => {
    return JSON.parse(localStorage.getItem(`cap_items_${userId}`) || '[]');
  },

  addItem: (userId: string, newItem: Omit<CurationItem, 'id' | 'createdAt'>): CurationItem => {
    const items = LocalDb.getItems(userId);
    const createdItem: CurationItem = {
      ...newItem,
      id: 'item_' + generateId(),
      createdAt: new Date().toISOString(),
      user_id: userId,
      archived: false
    };
    items.unshift(createdItem);
    localStorage.setItem(`cap_items_${userId}`, JSON.stringify(items));
    return createdItem;
  },

  updateItem: (userId: string, id: string, updatedFields: Partial<CurationItem>): void => {
    const items = LocalDb.getItems(userId);
    const updated = items.map(item => {
      if (item.id === id) {
        return { ...item, ...updatedFields };
      }
      return item;
    });
    localStorage.setItem(`cap_items_${userId}`, JSON.stringify(updated));
  },

  toggleArchiveItem: (userId: string, id: string): boolean => {
    const items = LocalDb.getItems(userId);
    let newStatus = false;
    const updated = items.map(item => {
      if (item.id === id) {
        newStatus = !item.archived;
        return { ...item, archived: newStatus };
      }
      return item;
    });
    localStorage.setItem(`cap_items_${userId}`, JSON.stringify(updated));
    return newStatus;
  },

  deleteItem: (userId: string, id: string): void => {
    const items = LocalDb.getItems(userId);
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem(`cap_items_${userId}`, JSON.stringify(filtered));
    
    // Clean like
    const likes = LocalDb.getLikes(userId);
    localStorage.setItem(`cap_likes_${userId}`, JSON.stringify(likes.filter(likedId => likedId !== id)));
  },

  // Likes
  getLikes: (userId: string): string[] => {
    return JSON.parse(localStorage.getItem(`cap_likes_${userId}`) || '[]');
  },

  toggleLike: (userId: string, id: string): boolean => {
    const likes = LocalDb.getLikes(userId);
    let liked = false;
    let nextLikes: string[];
    
    if (likes.includes(id)) {
      nextLikes = likes.filter(likedId => likedId !== id);
    } else {
      nextLikes = [...likes, id];
      liked = true;
    }
    
    localStorage.setItem(`cap_likes_${userId}`, JSON.stringify(nextLikes));
    return liked;
  },

  // Theme
  getTheme: (userId: string): string => {
    return localStorage.getItem(`cap_theme_${userId}`) || 'light';
  },

  setTheme: (userId: string, theme: string): void => {
    localStorage.setItem(`cap_theme_${userId}`, theme);
  },

  // Categories
  getCategories: (userId: string): Category[] => {
    return JSON.parse(localStorage.getItem(`cap_categories_${userId}`) || '[]');
  },

  addCategory: (userId: string, name: string, type: CategoryType): Category => {
    const categories = LocalDb.getCategories(userId);
    const newCat: Category = {
      id: 'cat_' + generateId().substring(0, 8),
      name,
      type,
      user_id: userId
    };
    categories.push(newCat);
    localStorage.setItem(`cap_categories_${userId}`, JSON.stringify(categories));
    return newCat;
  },

  deleteCategory: (userId: string, id: string): void => {
    const categories = LocalDb.getCategories(userId);
    localStorage.setItem(`cap_categories_${userId}`, JSON.stringify(categories.filter(c => c.id !== id)));
    
    // Delete associated subcategories
    const subcategories = LocalDb.getSubcategories(userId);
    localStorage.setItem(`cap_subcategories_${userId}`, JSON.stringify(subcategories.filter(s => s.category_id !== id)));
    
    // Clear item references
    const items = LocalDb.getItems(userId);
    const updatedItems = items.map(item => {
      if (item.category_id === id) {
        return { ...item, category_id: undefined, subcategory_id: undefined };
      }
      return item;
    });
    localStorage.setItem(`cap_items_${userId}`, JSON.stringify(updatedItems));
  },

  // Subcategories
  getSubcategories: (userId: string): Subcategory[] => {
    return JSON.parse(localStorage.getItem(`cap_subcategories_${userId}`) || '[]');
  },

  addSubcategory: (userId: string, categoryId: string, name: string): Subcategory => {
    const subcategories = LocalDb.getSubcategories(userId);
    const newSub: Subcategory = {
      id: 'sub_' + generateId().substring(0, 8),
      category_id: categoryId,
      name,
      user_id: userId
    };
    subcategories.push(newSub);
    localStorage.setItem(`cap_subcategories_${userId}`, JSON.stringify(subcategories));
    return newSub;
  },

  deleteSubcategory: (userId: string, id: string): void => {
    const subcategories = LocalDb.getSubcategories(userId);
    localStorage.setItem(`cap_subcategories_${userId}`, JSON.stringify(subcategories.filter(s => s.id !== id)));
    
    // Clear item references
    const items = LocalDb.getItems(userId);
    const updatedItems = items.map(item => {
      if (item.subcategory_id === id) {
        return { ...item, subcategory_id: undefined };
      }
      return item;
    });
    localStorage.setItem(`cap_items_${userId}`, JSON.stringify(updatedItems));
  },

  // Reset Sandbox Database
  resetDatabase: (userId: string): void => {
    // Re-seed original states
    const userCategories: Category[] = INITIAL_CATEGORIES.map(cat => ({
      ...cat,
      id: `${cat.id}_${userId}`,
      user_id: userId
    }));
    
    const userSubcategories: Subcategory[] = INITIAL_SUBCATEGORIES.map(sub => ({
      ...sub,
      id: `${sub.id}_${userId}`,
      category_id: `${sub.category_id}_${userId}`,
      user_id: userId
    }));
    
    const userItems: CurationItem[] = INITIAL_ITEMS.map(item => ({
      ...item,
      id: `${item.id}_${userId}`,
      category_id: item.category_id ? `${item.category_id}_${userId}` : undefined,
      subcategory_id: item.subcategory_id ? `${item.subcategory_id}_${userId}` : undefined,
      user_id: userId,
      archived: false
    }));
    
    const defaultLikes = ['1', '3', '5'].map(id => `${id}_${userId}`);
    
    localStorage.setItem(`cap_categories_${userId}`, JSON.stringify(userCategories));
    localStorage.setItem(`cap_subcategories_${userId}`, JSON.stringify(userSubcategories));
    localStorage.setItem(`cap_items_${userId}`, JSON.stringify(userItems));
    localStorage.setItem(`cap_likes_${userId}`, JSON.stringify(defaultLikes));
    localStorage.setItem(`cap_theme_${userId}`, 'light');
  },

  getHistory: (userId: string) => {
    const items = LocalDb.getItems(userId);
    const categories = LocalDb.getCategories(userId);
    const subcategories = LocalDb.getSubcategories(userId);
    return items.map(item => {
      const cat = categories.find(c => c.id === item.category_id);
      const sub = subcategories.find(s => s.id === item.subcategory_id);
      return {
        ...item,
        categoryName: cat ? cat.name : undefined,
        subcategoryName: sub ? sub.name : undefined
      };
    });
  }
};
