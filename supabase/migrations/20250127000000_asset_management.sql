/*
  # Create asset management schema

  1. New Tables
    - `asset_categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `created_at` (timestamp)
    - `assets`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `file_path` (text)
      - `public_url` (text)
      - `category_id` (uuid, references asset_categories)
      - `tags` (text[])
      - `file_size` (bigint)
      - `mime_type` (text)
      - `uploaded_by` (uuid, references auth.users)
      - `is_public` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `user_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `asset_id` (uuid, references assets)
      - `created_at` (timestamp)

  2. Storage Buckets
    - `assets` bucket for asset files
    - `user-uploads` bucket for user uploaded files

  3. Security
    - Enable RLS on all tables
    - Add policies for asset access and management
    - Set up storage policies for file access
*/

-- Create asset categories table
CREATE TABLE asset_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create assets table
CREATE TABLE assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  file_path text NOT NULL,
  public_url text NOT NULL,
  category_id uuid REFERENCES asset_categories ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  file_size bigint,
  mime_type text,
  uploaded_by uuid REFERENCES auth.users ON DELETE CASCADE,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user favorites table
CREATE TABLE user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  asset_id uuid REFERENCES assets ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, asset_id)
);

-- Enable RLS
ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for asset_categories
CREATE POLICY "Anyone can view asset categories"
  ON asset_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage asset categories"
  ON asset_categories
  FOR ALL
  TO authenticated
  USING (false); -- We'll implement admin check later

-- Policies for assets
CREATE POLICY "Anyone can view public assets"
  ON assets
  FOR SELECT
  TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can view their own assets"
  ON assets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can create assets"
  ON assets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own assets"
  ON assets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own assets"
  ON assets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Policies for user_favorites
CREATE POLICY "Users can view their own favorites"
  ON user_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON user_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON user_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', true);

-- Storage policies for assets bucket
CREATE POLICY "Anyone can view assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'assets');

CREATE POLICY "Users can update their own assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for user-uploads bucket
CREATE POLICY "Users can view their own uploads"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload to their own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own uploads"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert default asset categories
INSERT INTO asset_categories (name, description, icon) VALUES
  ('Characters', 'Human and animal characters for your comics', '👤'),
  ('Backgrounds', 'Scenes and environments for comic panels', '🏞️'),
  ('Objects', 'Props, items, and decorative elements', '📦'),
  ('Effects', 'Visual effects, particles, and overlays', '✨'),
  ('Text Elements', 'Speech balloons, text boxes, and typography', '💬'),
  ('UI Elements', 'Interface elements and decorative graphics', '🎨');

-- Create indexes for better performance
CREATE INDEX idx_assets_category_id ON assets(category_id);
CREATE INDEX idx_assets_uploaded_by ON assets(uploaded_by);
CREATE INDEX idx_assets_is_public ON assets(is_public);
CREATE INDEX idx_assets_tags ON assets USING GIN(tags);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_asset_id ON user_favorites(asset_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for assets table
CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
