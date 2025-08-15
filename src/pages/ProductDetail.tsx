import React from 'react';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ExternalLink, Play, ArrowLeft, ShoppingCart, MessageCircle, Send, User, Star, ThumbsUp, ThumbsDown, Award, Zap } from 'lucide-react';
import { useProduct } from '../hooks/useMarkdownContent';
import { useComments } from '../hooks/useComments';
import { MarkdownRenderer } from '../utils/markdownRenderer';
import { AvatarImage } from '../components/AvatarImage';
import { SEO } from '../components/SEO';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id || '');
  const { comments, loading: commentsLoading, error: commentsError, addComment } = useComments(id || '', 'product');
  const [newComment, setNewComment] = useState({
    author: '',
    content: '',
    email: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyForm, setReplyForm] = useState({
    author: '',
    content: '',
    email: ''
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#398FBA] mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#141414] mb-4">
            {error || 'Produit non trouvé'}
          </h1>
          <Link
            to="/produits-testes"
            className="bg-[#398FBA] text-white px-6 py-3 rounded-lg hover:bg-[#2a6d94] transition-colors"
          >
            Retour aux produits
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

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (replyForm.author.trim() && replyForm.content.trim() && replyForm.email.trim()) {
      setSubmitting(true);
      const result = await addComment(
        replyForm.author,
        replyForm.content,
        replyForm.email,
        parentId
      );
      
      if (result.success) {
        setReplyForm({ author: '', content: '', email: '' });
        setReplyingTo(null);
      }
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment, depth: number = 0) => {
    const maxDepth = 3; // Limite la profondeur d'imbrication
    const indentClass = depth > 0 ? `ml-${Math.min(depth * 8, 24)}` : '';
    
    return (
      <div key={comment.id} className={`${indentClass} ${depth > 0 ? 'border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="group hover:bg-gray-50 p-4 rounded-lg transition-colors">
          <div className="flex items-start space-x-4">
            <AvatarImage
              src={comment.avatar}
              alt={comment.author}
              name={comment.author}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-800">{comment.author}</h4>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.publishedAt)}
                </span>
                {depth < maxDepth && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-sm text-[#398FBA] hover:text-[#2a6d94] opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                  >
                    Répondre
                  </button>
                )}
              </div>
              <p className="text-gray-700 mb-3">{comment.content}</p>
              
              {replyingTo === comment.id && (
                <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Votre nom *"
                      value={replyForm.author}
                      onChange={(e) => setReplyForm({ ...replyForm, author: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent text-sm"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Votre email *"
                      value={replyForm.email}
                      onChange={(e) => setReplyForm({ ...replyForm, email: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Votre réponse *"
                    rows={3}
                    value={replyForm.content}
                    onChange={(e) => setReplyForm({ ...replyForm, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent mb-3 text-sm"
                    required
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-[#398FBA] hover:bg-[#2a6d94] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm"
                      disabled={submitting}
                    >
                      <Send className="h-3 w-3" />
                      <span>{submitting ? 'Publication...' : 'Répondre'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyForm({ author: '', content: '', email: '' });
                      }}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Réponses */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };
  const getYouTubeEmbedUrl = (videoCode: string) => {
    return `https://www.youtube.com/embed/${videoCode}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${product.name} - AyLabs`}
        description={product.description}
        url={`https://aylabs.fr/produit/${id}`}
        image={product.image}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/produits-testes"
          className="inline-flex items-center space-x-2 text-[#398FBA] hover:text-[#2a6d94] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux produits testés</span>
        </Link>

        {/* Main Content */}
        <div className="mb-12">
          {/* Product Image & Info */}
          <div>
            {/* Product Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-3">
                <span className="bg-[#398FBA] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">Testé le {formatDate(product.testedDate)}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
            </div>

            {/* Image et Sidebar côte à côte */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Image */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-lg leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Actions & Quick Info */}
              <div className="lg:col-span-1">
                <div>
                  {/* Prix et Achat */}
                  <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800 mb-1">
                        {product.price}€
                      </div>
                      <p className="text-gray-500 text-sm">Prix indicatif</p>
                    </div>

                    {/* Boutiques */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide text-center">Acheter sur</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {product.amazonLink && (
                          <a
                            href={product.amazonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Amazon</span>
                          </a>
                        )}
                        
                        {product.domadooLink && (
                          <a
                            href={product.domadooLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Domadoo</span>
                          </a>
                        )}


                        {product.geekbuyingLink && (
                          <a
                            href={product.geekbuyingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>GeekBuying</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spécifications techniques */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Spécifications techniques</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.tags && product.tags.length > 0 && (
                  <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="h-5 w-5 text-[#398FBA]" />
                    <h3 className="font-semibold text-gray-800">Tags</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#398FBA]/10 text-[#398FBA] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {product.protocols && product.protocols.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Protocoles</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.protocols.map((protocol, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {protocol}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {product.compatible && product.compatible.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Award className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Compatible</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.compatible.map((comp, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 rounded-full p-2">
                <ThumbsUp className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Points positifs</h2>
            </div>
            <ul className="space-y-4">
              {product.pros.map((pro, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 rounded-full p-2">
                <ThumbsDown className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Points négatifs</h2>
            </div>
            <ul className="space-y-4">
              {product.cons.map((con, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className="bg-red-100 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-700 leading-relaxed">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verdict */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-[#398FBA]/10 rounded-full p-2">
              <Star className="h-6 w-6 text-[#398FBA]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verdict final</h2>
          </div>
          <div className="prose max-w-none">
            <MarkdownRenderer content={product.verdict} />
          </div>
          
          {product.videoUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Vidéo de test</h3>
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(product.videoUrl.split('v=')[1] || product.videoUrl)}
                  title={`Test vidéo de ${product.name}`}
                  className="w-full h-full rounded-xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-[#398FBA]" />
            <span>Commentaires ({commentsLoading ? '...' : comments.length})</span>
          </h2>
          
          {commentsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {commentsError}
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
            {commentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398FBA] mx-auto"></div>
                <p className="text-gray-500 mt-2">Chargement des commentaires...</p>
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucun commentaire pour le moment. Soyez le premier à commenter !
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => renderComment(comment))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};