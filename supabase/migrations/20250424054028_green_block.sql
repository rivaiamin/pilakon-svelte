/*
  # Create comics schema

  1. New Tables
    - `comics`
      - `id` (uuid, primary key)
      - `title` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `panels`
      - `id` (uuid, primary key)
      - `comic_id` (uuid, references comics)
      - `image_url` (text)
      - `text` (text)
      - `width` (text)
      - `text_position` (text)
      - `text_style` (text)
      - `order` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own comics
*/

-- Create comics table
CREATE TABLE comics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create panels table
CREATE TABLE panels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comic_id uuid REFERENCES comics ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  text text,
  width text NOT NULL,
  text_position text NOT NULL,
  text_style text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE comics ENABLE ROW LEVEL SECURITY;
ALTER TABLE panels ENABLE ROW LEVEL SECURITY;

-- Policies for comics
CREATE POLICY "Users can create their own comics"
  ON comics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own comics"
  ON comics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own comics"
  ON comics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comics"
  ON comics
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for panels
CREATE POLICY "Users can manage panels of their comics"
  ON panels
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM comics 
    WHERE comics.id = panels.comic_id 
    AND comics.user_id = auth.uid()
  ));