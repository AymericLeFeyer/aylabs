import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Comment } from '../types';
import { generateAvatarUrl } from '../utils/avatarUtils';

export const useComments = (pageId: string, pageType: 'article' | 'product' | 'video' | 'tutorial' = 'article') => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('page_id', pageId)
        .eq('page_type', pageType)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Organiser les commentaires en arbre
      const commentsMap = new Map();
      const rootComments: Comment[] = [];
      
      // Première passe : créer tous les commentaires
      data.forEach(comment => {
        const formattedComment: Comment = {
          id: comment.id,
          author: comment.author,
          content: comment.content,
          publishedAt: comment.created_at,
          avatar: generateAvatarUrl(comment.email),
          parentId: comment.parent_id,
          replies: []
        };
        commentsMap.set(comment.id, formattedComment);
      });
      
      // Deuxième passe : organiser en arbre
      commentsMap.forEach(comment => {
        if (comment.parentId) {
          const parent = commentsMap.get(comment.parentId);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(comment);
          }
        } else {
          rootComments.push(comment);
        }
      });
      
      // Trier les réponses par date (plus anciennes en premier)
      const sortReplies = (comments: Comment[]) => {
        comments.forEach(comment => {
          if (comment.replies && comment.replies.length > 0) {
            comment.replies.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
            sortReplies(comment.replies);
          }
        });
      };
      
      sortReplies(rootComments);
      setComments(rootComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des commentaires');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (author: string, content: string, email: string, parentId?: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          page_id: pageId,
          page_type: pageType,
          author: author.trim(),
          content: content.trim(),
          email: email.trim(),
          parent_id: parentId || null
        })
        .select()
        .single();

      if (error) throw error;

      // Recharger tous les commentaires pour maintenir la structure
      await fetchComments();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout du commentaire';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchComments();
  }, [pageId, pageType]);

  return {
    comments,
    loading,
    error,
    addComment,
    refetch: fetchComments
  };
};