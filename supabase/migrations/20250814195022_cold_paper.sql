/*
  # Ajout du support des réponses aux commentaires

  1. Modifications
    - Ajouter la colonne `parent_id` à la table `comments`
    - Créer une contrainte de clé étrangère pour référencer le commentaire parent
    - Ajouter un index pour optimiser les requêtes de réponses

  2. Sécurité
    - Maintenir les politiques RLS existantes
    - La colonne parent_id peut être nulle (commentaires racine)
*/

-- Ajouter la colonne parent_id
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES comments(id) ON DELETE CASCADE;

-- Créer un index pour optimiser les requêtes de réponses
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);

-- Créer un index composite pour optimiser les requêtes par page et parent
CREATE INDEX IF NOT EXISTS comments_page_parent_idx ON comments(page_id, page_type, parent_id, created_at DESC);