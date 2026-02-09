"use client";

import { VideoWithProfile } from "@/types/database";
import { addVote } from "@/lib/services/votos";
import { deleteVideo } from "@/lib/services/videos";
import { useState } from "react";
import {
    ArrowUp,
    ArrowDown,
    ExternalLink,
    Trash2,
    Clock,
} from "lucide-react";
import VideoEmbed from "./VideoEmbed";

interface VideoCardProps {
    video: VideoWithProfile;
    currentUserId: string;
    onDelete?: () => void;
    onVoteChange?: () => void;
}

export default function VideoCard({
    video,
    currentUserId,
    onDelete,
    onVoteChange,
}: VideoCardProps) {
    const [score, setScore] = useState(video.score);
    const [userVote, setUserVote] = useState<number | null>(video.userVote);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleVote = async (tipo: 1 | -1) => {
        try {
            const result = await addVote(video.id, currentUserId, tipo);

            // Update local state based on result
            if (result.tipo === null) {
                // Vote was removed
                setScore((prev) => prev - userVote!);
                setUserVote(null);
            } else if (userVote === null) {
                // New vote
                setScore((prev) => prev + tipo);
                setUserVote(tipo);
            } else {
                // Vote changed
                setScore((prev) => prev - userVote + tipo);
                setUserVote(tipo);
            }

            onVoteChange?.();
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar este video?")) return;

        setIsDeleting(true);
        try {
            await deleteVideo(video.id, currentUserId);
            onDelete?.();
        } catch (error) {
            console.error("Error deleting video:", error);
            setIsDeleting(false);
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

    const getPlatformIcon = (url: string) => {
        if (url.includes("tiktok")) return "🎵";
        if (url.includes("youtube") || url.includes("youtu.be")) return "▶️";
        if (url.includes("instagram")) return "📸";
        return "🎬";
    };

    const isOwner = video.user_id === currentUserId;

    return (
        <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5 hover:border-purple-500/30 transition-all shadow-lg">
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {video.profiles?.avatar_url ? (
                        <img
                            src={video.profiles.avatar_url}
                            alt={video.profiles.nombre || "Usuario"}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        video.profiles?.nombre?.charAt(0).toUpperCase() || "U"
                    )}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                            {video.profiles?.nombre || "Usuario"}
                        </span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(video.creado_en)}
                        </span>
                    </div>
                </div>

                {/* Delete button */}
                {isOwner && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg disabled:opacity-50"
                        title="Eliminar"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="mb-3">
                {video.titulo && (
                    <h3 className="text-white font-semibold mb-1">{video.titulo}</h3>
                )}
                {video.descripcion && (
                    <p className="text-gray-300 text-sm mb-2">{video.descripcion}</p>
                )}

                {/* Video Embed */}
                <VideoEmbed url={video.link} />

                {/* Link */}
                <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm group transition-colors"
                >
                    <span className="text-lg">{getPlatformIcon(video.link)}</span>
                    <span className="group-hover:underline truncate max-w-[400px]">
                        {video.link}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </a>
            </div>

            {/* Voting */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <button
                    onClick={() => handleVote(1)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${userVote === 1
                        ? "bg-purple-500/20 text-purple-400"
                        : "text-gray-400 hover:bg-purple-500/10 hover:text-purple-400"
                        }`}
                >
                    <ArrowUp className="w-4 h-4" />
                </button>

                <span
                    className={`font-semibold min-w-[30px] text-center ${score > 0
                        ? "text-purple-400"
                        : score < 0
                            ? "text-pink-400"
                            : "text-gray-400"
                        }`}
                >
                    {score}
                </span>

                <button
                    onClick={() => handleVote(-1)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${userVote === -1
                        ? "bg-pink-500/20 text-pink-400"
                        : "text-gray-400 hover:bg-pink-500/10 hover:text-pink-400"
                        }`}
                >
                    <ArrowDown className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
