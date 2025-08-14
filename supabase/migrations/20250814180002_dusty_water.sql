/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `title` (text, product name)
      - `slug` (text, URL-friendly identifier)
      - `image` (text, product image URL)
      - `description` (text, product description)
      - `tags` (text[], array of tags)
      - `protocols` (text[], array of supported protocols)
      - `compatible` (text[], array of compatible systems)
      - `video_code` (text, YouTube video ID)
      - `buy_links` (text[], array of purchase links)
      - `pub_date` (date, publication date)
      - `category` (text, product category)
      - `rating` (numeric, product rating out of 5)
      - `price` (numeric, product price)
      - `pros` (text[], array of positive points)
      - `cons` (text[], array of negative points)
      - `verdict` (text, final verdict)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access
    - Add policy for authenticated insert/update
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  image text NOT NULL,
  description text NOT NULL,
  tags text[] DEFAULT '{}',
  protocols text[] DEFAULT '{}',
  compatible text[] DEFAULT '{}',
  video_code text,
  buy_links text[] DEFAULT '{}',
  pub_date date NOT NULL,
  category text NOT NULL DEFAULT 'Domotique',
  rating numeric(2,1) DEFAULT 0,
  price numeric(10,2) DEFAULT 0,
  pros text[] DEFAULT '{}',
  cons text[] DEFAULT '{}',
  verdict text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_pub_date_idx ON products (pub_date DESC);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products (slug);
CREATE INDEX IF NOT EXISTS products_tags_idx ON products USING GIN (tags);

-- Insert the Roller Shade Driver E1 product
INSERT INTO products (
  title,
  slug,
  image,
  description,
  tags,
  protocols,
  compatible,
  video_code,
  buy_links,
  pub_date,
  category,
  rating,
  price,
  pros,
  cons,
  verdict
) VALUES (
  'Roller Shade Driver E1',
  'roller-shade-driver-e1',
  'https://cdn1.domadoo.fr/19199-large_default/aqara-motorisation-intelligente-pour-store-enrouleur-a-chainette-zigbee-30-znjlbl01lm.jpg',
  'Contrôlez la chaîne de perles de vos stores et rideaux de manières automatique grâce à ce module.',
  ARRAY['Ouvrant'],
  ARRAY['Zigbee 3.0'],
  ARRAY['Home Assistant', 'Zigbee2MQTT'],
  '24Hvo_K7puE',
  ARRAY['https://go.aylabs.fr/domadoo/roller-shade-driver-e1', 'https://amzn.to/3TzNatm'],
  '2024-08-28',
  'Domotique',
  4.5,
  89.99,
  ARRAY['Installation facile', 'Compatible Zigbee 3.0', 'Contrôle précis', 'Intégration Home Assistant'],
  ARRAY['Prix un peu élevé', 'Nécessite un hub Zigbee'],
  'Un excellent produit pour automatiser vos stores avec une installation simple et une intégration parfaite dans votre écosystème domotique.'
);