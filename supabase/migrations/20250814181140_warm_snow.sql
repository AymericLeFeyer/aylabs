/*
  # Create comments table

  1. New Tables
    - `comments`
      - `id` (uuid, primary key)
      - `page_id` (text, not null) - ID of the page being commented on
      - `page_type` (text, not null) - Type of page (article, product, video, tutorial)
      - `author` (text, not null) - Name of the comment author
      - `email` (text, not null) - Email of the comment author
      - `content` (text, not null) - Comment content
      - `created_at` (timestamptz, default now()) - Creation timestamp
      - `avatar` (text, nullable) - Avatar URL with default

  2. Security
    - Enable RLS on `comments` table
    - Add policy for public read access
    - Add policy for public insert access

  3. Performance
    - Add indexes for efficient querying by page_id and page_type
    - Add composite index for common query patterns
*/

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id text NOT NULL,
  page_type text NOT NULL CHECK (page_type IN ('article', 'product', 'video', 'tutorial')),
  author text NOT NULL,
  email text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  avatar text DEFAULT 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format'
);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to comments
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public insert access to comments
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS comments_page_id_idx ON comments (page_id);
CREATE INDEX IF NOT EXISTS comments_page_type_idx ON comments (page_type);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments (created_at DESC);
CREATE INDEX IF NOT EXISTS comments_page_composite_idx ON comments (page_id, page_type, created_at DESC);