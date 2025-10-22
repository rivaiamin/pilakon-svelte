// Type definitions for Pilakon application

export interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssetCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface Asset {
  id: string;
  name: string;
  description?: string;
  file_path: string;
  public_url: string;
  category_id?: string;
  tags: string[];
  file_size?: number;
  mime_type?: string;
  uploaded_by: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  category?: string; // For display purposes
  is_favorite?: boolean; // For UI state
  thumbnail?: string; // For mock data display
}

export interface UserFavorite {
  id: string;
  user_id: string;
  asset_id: string;
  created_at: string;
}

export interface Comic {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Panel {
  id: string;
  comic_id: string;
  image_url: string;
  text?: string;
  width: string;
  text_position: string;
  text_style: string;
  order: number;
  created_at: string;
}

export interface AuthResponse {
  data: {
    user: User | null;
    session: any | null;
  };
  error: any | null;
}

export interface AssetUploadResponse {
  data: {
    filePath: string;
    publicUrl: string;
  } | null;
  error: any | null;
}

export interface ViewMode {
  type: 'grid' | 'list';
}

export interface SearchFilters {
  query: string;
  category: string;
  tags: string[];
  isPublic: boolean;
}

// Supabase types
export interface Database {
  public: {
    Tables: {
      asset_categories: {
        Row: AssetCategory;
        Insert: Omit<AssetCategory, 'id' | 'created_at'>;
        Update: Partial<Omit<AssetCategory, 'id' | 'created_at'>>;
      };
      assets: {
        Row: Asset;
        Insert: Omit<Asset, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Asset, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_favorites: {
        Row: UserFavorite;
        Insert: Omit<UserFavorite, 'id' | 'created_at'>;
        Update: Partial<Omit<UserFavorite, 'id' | 'created_at'>>;
      };
      comics: {
        Row: Comic;
        Insert: Omit<Comic, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Comic, 'id' | 'created_at' | 'updated_at'>>;
      };
      panels: {
        Row: Panel;
        Insert: Omit<Panel, 'id' | 'created_at'>;
        Update: Partial<Omit<Panel, 'id' | 'created_at'>>;
      };
    };
  };
}
