import { MessageCircle, Send } from "lucide-react";
import React from "react";
import { AvatarImage } from "./AvatarImage";
import { Comment } from "../types";
import Cookies from "js-cookie";

interface NewComment {
  author: string;
  content: string;
  email: string;
}

interface CommentsProps {
  newComment: NewComment;
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>;
  comments: Comment[];
  commentsLoading: boolean;
  commentsError: string | null;
  addComment: (
    author: string,
    content: string,
    email: string,
    parentId?: string
  ) => Promise<
    | {
        success: boolean;
        error?: undefined;
      }
    | {
        success: boolean;
        error: string;
      }
  >;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  replyingTo: string | null;
  setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
  replyForm: NewComment;
  setReplyForm: React.Dispatch<React.SetStateAction<NewComment>>;
}

export const Comments: React.FC<CommentsProps> = ({
  newComment,
  setNewComment,
  comments,
  commentsLoading,
  commentsError,
  addComment,
  submitting,
  setSubmitting,
  replyingTo,
  setReplyingTo,
  replyForm,
  setReplyForm,
}) => {
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newComment.author.trim() &&
      newComment.content.trim() &&
      newComment.email.trim()
    ) {
      setSubmitting(true);
      const result = await addComment(
        newComment.author,
        newComment.content,
        newComment.email
      );

      if (Cookies.get("cookie_consent") === "true") {
        Cookies.set("author", newComment.author, { expires: 30 });
        Cookies.set("email", newComment.email, { expires: 30 });
      }

      if (result.success) {
        setNewComment({ author: "", content: "", email: "" });
      }
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (
      replyForm.author.trim() &&
      replyForm.content.trim() &&
      replyForm.email.trim()
    ) {
      setSubmitting(true);
      const result = await addComment(
        replyForm.author,
        replyForm.content,
        replyForm.email,
        parentId
      );

      if (result.success) {
        setReplyForm({ author: "", content: "", email: "" });
        setReplyingTo(null);
      }
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  const renderComment = (comment: Comment, depth: number = 0) => {
    const maxDepth = 3; // Limite la profondeur d'imbrication
    const indentClass = depth > 0 ? `ml-${Math.min(depth * 8, 24)}` : "";

    return (
      <div
        key={comment.id}
        className={`${indentClass} ${
          depth > 0 ? "border-l-2 border-gray-200 pl-4" : ""
        }`}
      >
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
                <h4 className="font-semibold text-gray-800">
                  {comment.author}
                </h4>
                <span className="text-sm text-gray-500">
                  {formatDate(comment.publishedAt)}
                </span>
                {depth < maxDepth && (
                  <button
                    onClick={() =>
                      setReplyingTo(
                        replyingTo === comment.id ? null : comment.id
                      )
                    }
                    className="text-sm text-[#398FBA] hover:text-[#2a6d94] opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                  >
                    Répondre
                  </button>
                )}
              </div>
              <p className="text-gray-700 mb-3">{comment.content}</p>

              {replyingTo === comment.id && (
                <form
                  onSubmit={(e) => handleSubmitReply(e, comment.id)}
                  className="mt-4 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Votre nom *"
                      value={replyForm.author}
                      onChange={(e) =>
                        setReplyForm({ ...replyForm, author: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent text-sm"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Votre email *"
                      value={replyForm.email}
                      onChange={(e) =>
                        setReplyForm({ ...replyForm, email: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Votre réponse *"
                    rows={3}
                    value={replyForm.content}
                    onChange={(e) =>
                      setReplyForm({ ...replyForm, content: e.target.value })
                    }
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
                      <span>{submitting ? "Publication..." : "Répondre"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyForm({ author: "", content: "", email: "" });
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
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-[#398FBA]" />
          <span>
            Commentaires ({commentsLoading ? "..." : comments.length})
          </span>
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
              onChange={(e) =>
                setNewComment({ ...newComment, author: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder="Votre email *"
              value={newComment.email}
              onChange={(e) =>
                setNewComment({ ...newComment, email: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent"
              required
            />
          </div>
          <textarea
            placeholder="Votre commentaire *"
            rows={4}
            value={newComment.content}
            onChange={(e) =>
              setNewComment({ ...newComment, content: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#398FBA] focus:border-transparent mb-4"
            required
          />
          <button
            type="submit"
            className="bg-[#398FBA] hover:bg-[#2a6d94] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            disabled={submitting}
          >
            <Send className="h-4 w-4" />
            <span>
              {submitting ? "Publication..." : "Publier le commentaire"}
            </span>
          </button>
        </form>

        <div className="space-y-6">
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#398FBA] mx-auto"></div>
              <p className="text-gray-500 mt-2">
                Chargement des commentaires...
              </p>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => renderComment(comment))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
