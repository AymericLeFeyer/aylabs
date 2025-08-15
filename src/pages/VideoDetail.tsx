import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, Play } from "lucide-react";
import { useVideos } from "../hooks/useMarkdownContent";
import { useComments } from "../hooks/useComments";
import { MarkdownRenderer } from "../utils/markdownRenderer";
import { SEO } from "../components/SEO";
import { Comments } from "../components/Comments";

export const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { videos, loading: videosLoading } = useVideos();
  const video = videos.find((v) => v.id === id);

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
  } = useComments(id || "", "video");
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
          <h1 className="text-2xl font-bold text-[#141414] mb-4">
            Vidéo non trouvée
          </h1>
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
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const getThumbnailUrl = (url: string) => {
    const videoId = url.split("v=")[1] || url.split("/").pop();
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`${video.title} - AyLabs`}
        description={video.description}
        url={`https://aylabs.fr/video/${video.id}`}
        image={getThumbnailUrl(video.url)}
      />
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
    </div>
  );
};
