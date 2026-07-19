export type CategoryType = 'aqui' | 'alla' | 'both'; // 'aqui' = Cosas Buenas (Neon Yellow), 'alla' = Cosas Malas (Neon Crimson/Red), 'both' = Ambos (Gradient)

export type ContentPlatform = 'youtube' | 'tiktok' | 'instagram' | 'linkedin' | 'web';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface CurationItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: CategoryType;
  contentType: ContentPlatform;
  createdAt: string;
  category_id?: string;
  subcategory_id?: string;
  user_id?: string;
  archived?: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  user_id?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  user_id?: string;
}

export interface HistoryItem extends CurationItem {
  categoryName?: string;
  subcategoryName?: string;
}
