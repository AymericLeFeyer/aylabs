import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, MessageCircle, Send, User, Play } from 'lucide-react';
import { useVideos } from '../hooks/useMarkdownContent';
import { useComments } from '../hooks/useComments';
import { MarkdownRenderer } from '../utils/markdownRenderer';
import { AvatarImage } from '../components/AvatarImage';

export const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { videos, loading: videosLoading } = useVideos();
  const video = videos.find(v => v.id === id);
  
  const { comments, loading, error, addComment } = useComments(id || '', 'video');
  const [newComment, setNewComment] = useState({
    author: '',
    content: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);

  if (videosLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement de la vidéo...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#141414] mb-4">Vidéo non trouvée</h1>
          <Link
            to="/videos"
            className="bg-[#398FBA] text-white px-6 py-3 rounded-lg hover:bg-[#2a6d94] transition-colors"
          >
            Retour aux vidéos
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.author.trim() && newComment.content.trim() && newComment.email.trim()) {
      setSubmitting(true);
      const result = await addComment(
        newComment.author,
        newComment.content,
        newComment.email
      );
      
      if (result.success) {
        setNewComment({ author: '', content: '', email: '' });
      }
      setSubmitting(false);
    }
  };


  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/videos"
          className="inline-flex items-center space-x-2 text-[#398FBA] hover:text-[#2a6d94] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux vidéos</span>
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={getYouTubeEmbedUrl(video.url)}
              title={video.title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#141414] mb-4">
              {video.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(video.publishedAt)}</span>
              </div>
            </div>

            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#398FBA]/10 text-[#398FBA] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {video.description}
              </p>
              <MarkdownRenderer content={video.content} />
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Play className="h-5 w-5" />
                <span>Regarder sur YouTube</span>
              </a>
            </div>
          </div>
        </article>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#141414] mb-6 flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-[#398FBA]" />
            <span>Commentaires ({loading ? '...' : comments.length})</span>
          </h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Votre nom *"
                value={newComment.author}
                onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Votre email *"
                value={newComment.email}
                onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent"
                required
              />
            </div>
            <textarea
              placeholder="Votre commentaire *"
              rows={4}
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent mb-4"
              required
            />
            <button
              type="submit"
              className="bg-[#398FBA] hover:bg-[#2a6d94] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
              disabled={submitting}
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? 'Publication...' : 'Publier le commentaire'}</span>
            </button>
          </form>
          
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398FBA] mx-auto"></div>
                <p className="text-gray-500 mt-2">Chargement des commentaires...</p>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun commentaire pour le moment. Soyez le premier à commenter !
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start space-x-4">
                    <AvatarImage
                      src={comment.avatar}
                      alt={comment.author}
                      name={comment.author}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-[#141414]">{comment.author}</h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.publishedAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};