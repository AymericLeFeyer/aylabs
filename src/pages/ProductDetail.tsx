import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  ThumbsUp,
  ThumbsDown,
  Award,
  Zap,
} from "lucide-react";
import { useProduct } from "../hooks/useMarkdownContent";
import { useComments } from "../hooks/useComments";
import { MarkdownRenderer } from "../utils/markdownRenderer";
import { SEO } from "../components/SEO";
import { Comments } from "../components/Comments";
import Cookies from "js-cookie";
import ReactGA from "react-ga4";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id || "");
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
  } = useComments(id || "", "product");
  const [newComment, setNewComment] = useState({
    author: "",
    content: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyForm, setReplyForm] = useState({
    author: "",
    content: "",
    email: "",
  });

  useEffect(() => {
    if (Cookies.get("cookie_consent") !== "true") return;

    const author = Cookies.get("author") || "";
    const email = Cookies.get("email") || "";
    setNewComment((prev) => ({
      ...prev,
      author,
      email,
    }));

    setReplyForm((prev) => ({
      ...prev,
      author,
      email,
    }));
  }, [submitting]);

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
            {error || "Produit non trouvé"}
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
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
                <span className="text-gray-600">
                  Testé le {formatDate(product.testedDate)}
                </span>
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
                      <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide text-center">
                        Acheter sur
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {product.amazonLink && (
                          <a
                            href={product.amazonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            onClick={() => {
                              ReactGA.gtag("event", "click_partner_link", {
                                partner: "Amazon",
                                product_id: product.id,
                                product_name: product.name,
                              });
                            }}
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
                            onClick={() => {
                              ReactGA.gtag("event", "click_partner_link", {
                                partner: "Domadoo",
                                product_id: product.id,
                                product_name: product.name,
                              });
                            }}
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
                            onClick={() => {
                              ReactGA.gtag("event", "click_partner_link", {
                                partner: "GeekBuying",
                                product_id: product.id,
                                product_name: product.name,
                              });
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>GeekBuying</span>
                          </a>
                        )}

                        {product.minixLink && (
                          <a
                            href={product.minixLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            onClick={() => {
                              ReactGA.gtag("event", "click_partner_link", {
                                partner: "Minix",
                                product_id: product.id,
                                product_name: product.name,
                              });
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>Minix</span>
                          </a>
                        )}

                        {product.reolinkLink && (
                          <a
                            href={product.reolinkLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            onClick={() => {
                              ReactGA.gtag("event", "click_partner_link", {
                                partner: "Reolink",
                                product_id: product.id,
                                product_name: product.name,
                              });
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <ShoppingCart className="h-4 w-4" />
                              <span>Reolink</span>
                            </div>
                          </a>
                        )}

                        {product.bambuLink && (
                          <a
                            href={product.bambuLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            onClick={() => {
                              ReactGA.gtag("event", "click_partner_link", {
                                partner: "BambuLab",
                                product_id: product.id,
                                product_name: product.name,
                              });
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>BambuLab</span>
                          </a>
                        )}
                      </div>
                    </div>
                    {product.reolinkLink && (
                      <p>
                        <strong>Code Reolink</strong>
                        <br />
                        <strong>AyLabs5</strong> pour -5%
                      </p>
                    )}
                    {/*{product.domadooLink && (
                      <>
                        <p>
                          <strong>Codes Domadoo jusqu'au 31/08/25</strong>
                          <br />
                          <strong>AYLABS15</strong> pour -15% sur certaines
                          marques <br />
                          <strong>AYLABS5</strong> pour -5% sur certaines
                          marques
                        </p>
                      </>
                    )}*/}
                  </div>
                </div>
              </div>
            </div>

            {/* Spécifications techniques */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Spécifications techniques
              </h3>
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
                      <h3 className="font-semibold text-gray-800">
                        Protocoles
                      </h3>
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
                      <h3 className="font-semibold text-gray-800">
                        Compatible
                      </h3>
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
              <h2 className="text-2xl font-bold text-gray-800">
                Points positifs
              </h2>
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
              <h2 className="text-2xl font-bold text-gray-800">
                Points négatifs
              </h2>
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
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Vidéo de test
              </h3>
              <div className="aspect-video">
                <iframe
                  src={getYouTubeEmbedUrl(
                    product.videoUrl.split("v=")[1] || product.videoUrl
                  )}
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

        <Comments
          comments={comments}
          commentsLoading={commentsLoading}
          commentsError={commentsError}
          addComment={addComment}
          submitting={submitting}
          setSubmitting={setSubmitting}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          newComment={newComment}
          setNewComment={setNewComment}
          replyForm={replyForm}
          setReplyForm={setReplyForm}
        />
      </div>
    </div>
  );
};
