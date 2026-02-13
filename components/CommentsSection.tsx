"use client";

import { useState, useEffect } from "react";
import { getComments } from "@/lib/services/comments";
import { CommentWithProfile } from "@/types/database";
import { MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";

interface CommentsSectionProps {
    videoId: string;
    currentUserId: string | null;
    onCommentSubmit: (content: string) => Promise<void>;
}

export default function CommentsSection({
    videoId,
    currentUserId,
    onCommentSubmit,
}: CommentsSectionProps) {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [comments, setComments] = useState<CommentWithProfile[]>([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    // Load comments when component mounts or when videoId changes
    useEffect(() => {
        loadComments();
    }, [videoId]);

    const loadComments = async () => {
        setIsLoadingComments(true);
        try {
            const data = await getComments(videoId);
            setComments(data as CommentWithProfile[]);
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleCommentClick = () => {
        if (!currentUserId) {
            alert("Debes iniciar sesión para comentar");
            return;
        }
        setShowCommentInput(!showCommentInput);
    };

    const handleSubmitComment = async () => {
        if (!currentUserId) {
            alert("Debes iniciar sesión para comentar");
            return;
        }

        if (!commentContent.trim()) {
            alert("El comentario no puede estar vacío");
            return;
        }

        setIsSubmitting(true);
        try {
            await onCommentSubmit(commentContent);
            setCommentContent("");
            setShowCommentInput(false);
            // Reload comments after submission
            await loadComments();
        } catch (error) {
            console.error("Error submitting comment:", error);
            alert("Error al enviar el comentario");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRelativeTime = (timestamp: string | null) => {
        if (!timestamp) return "Hace un momento";

        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Ahora mismo";
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return then.toLocaleDateString("es-ES", {
            month: "short",
            day: "numeric",
        });
    };

    const visibleComments = showAllComments ? comments : comments.slice(0, 1);
    const hasMoreComments = comments.length > 1;

    return (
        <div className="mt-3 pt-3 border-t border-white/5">
            {/* Comment button */}
            <button
                onClick={handleCommentClick}
                className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 text-sm"
            >
                <MessageCircle className="w-4 h-4" />
                <span>
                    {showCommentInput ? "Cancelar" : "Comentar"}
                    {comments.length > 0 && ` (${comments.length})`}
                </span>
            </button>

            {/* Comment input form */}
            {showCommentInput && (
                <div className="mt-3 bg-[#2A2A2A] rounded-lg p-3">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Escribe tu comentario..."
                        className="w-full bg-[#1E1E1E] text-white rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/5"
                        rows={3}
                        disabled={isSubmitting}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleSubmitComment}
                            disabled={isSubmitting || !commentContent.trim()}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Send className="w-4 h-4" />
                            {isSubmitting ? "Enviando..." : "Enviar comentario"}
                        </button>
                    </div>
                </div>
            )}

            {/* Comments list */}
            {isLoadingComments ? (
                <div className="mt-3 text-center text-gray-500 text-sm">
                    Cargando comentarios...
                </div>
            ) : comments.length > 0 ? (
                <div className="mt-3 space-y-3">
                    {visibleComments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-[#2A2A2A] rounded-lg p-3"
                        >
                            <div className="flex items-start gap-2">
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {comment.profiles?.avatar_url ? (
                                        <img
                                            src={comment.profiles.avatar_url}
                                            alt={comment.profiles.nombre || "Usuario"}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        comment.profiles?.nombre?.charAt(0).toUpperCase() || "U"
                                    )}
                                </div>

                                {/* Comment content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-white text-sm">
                                            {comment.profiles?.nombre || "Usuario"}
                                        </span>
                                        <span className="text-gray-500 text-xs">
                                            {getRelativeTime(comment.creado_en)}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm">
                                        {comment.comentarios}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Show more/less button */}
                    {hasMoreComments && (
                        <button
                            onClick={() => setShowAllComments(!showAllComments)}
                            className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            {showAllComments ? (
                                <>
                                    <ChevronUp className="w-4 h-4" />
                                    Ocultar comentarios
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4" />
                                    Mostrar {comments.length - 1} comentario
                                    {comments.length - 1 > 1 ? "s" : ""} más
                                </>
                            )}
                        </button>
                    )}
                </div>
            ) : null}
        </div>
    );
}
