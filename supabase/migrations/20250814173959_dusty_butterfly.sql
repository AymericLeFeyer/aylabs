/*
  # Création de la table des commentaires

  1. Nouvelles Tables
    - `comments`
      - `id` (uuid, clé primaire)
      - `article_id` (text, référence à l'article)
      - `author` (text, nom de l'auteur)
      - `email` (text, email de l'auteur - optionnel)
      - `content` (text, contenu du commentaire)
      - `created_at` (timestamp, date de création)
      - `avatar` (text, URL de l'avatar)

  2. Sécurité
    - Activation de RLS sur la table `comments`
    - Politique pour permettre la lecture à tous
    - Politique pour permettre l'insertion à tous (commentaires publics)
*/

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id text NOT NULL,
  author text NOT NULL,
  email text,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  avatar text DEFAULT 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150'
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture des commentaires à tous
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politique pour permettre l'insertion de commentaires à tous
CREATE POLICY "Anyone can insert comments"
  ON comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Index pour améliorer les performances des requêtes par article
CREATE INDEX IF NOT EXISTS comments_article_id_idx ON comments(article_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);