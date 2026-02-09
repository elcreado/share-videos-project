"use client";

import { useState, useEffect } from "react";
import { createVideo, getVideos } from "@/lib/services/videos";
import { getUserVotesForVideos } from "@/lib/services/votos";
import { VideoWithProfile } from "@/types/database";
import VideoCard from "./VideoCard";
import { Plus, Link as LinkIcon, Loader2 } from "lucide-react";

interface SocialFeedProps {
    userId: string | null;
}

export default function SocialFeed({ userId }: SocialFeedProps) {
    const [videos, setVideos] = useState<VideoWithProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [link, setLink] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const loadVideos = async () => {
        try {
            setLoading(true);
            const videosData = await getVideos(50);

            // Get user votes for all videos only if user is logged in
            if (userId) {

                const videoIds = videosData.map((v) => v.id);
                const userVotes = await getUserVotesForVideos(videoIds, userId);

                // Add user votes to videos
                const videosWithUserVotes = videosData.map((video) => ({
                    ...video,
                    userVote: userVotes[video.id] || null,
                }));

                setVideos(videosWithUserVotes);
            } else {
                // No user votes for unauthenticated users
                const videosWithoutUserVotes = videosData.map((video) => ({
                    ...video,
                    userVote: null,
                }));

                setVideos(videosWithoutUserVotes);
            }
        } catch (error) {
            console.error("Error loading videos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVideos();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert("Debes iniciar sesión para publicar un video");
            return;
        }

        if (!link.trim()) return;

        setSubmitting(true);
        try {
            await createVideo(userId, link.trim(), titulo.trim(), descripcion.trim());

            // Reset form
            setLink("");
            setTitulo("");
            setDescripcion("");
            setShowForm(false);

            // Reload videos
            await loadVideos();
        } catch (error: any) {
            console.error("Error creating video:", error);
            alert("Error al crear el video: " + (error.message || "Error desconocido"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {/* Create video section */}
            <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5 shadow-lg">
                {!showForm ? (
                    <button
                        onClick={() => {
                            if (!userId) {
                                alert("Debes iniciar sesión para publicar un video");
                                return;
                            }
                            setShowForm(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 text-gray-400 hover:text-purple-400 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Compartir un video</span>
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                            <LinkIcon className="w-5 h-5 text-purple-400" />
                            <h3 className="text-white font-semibold">Compartir Video</h3>
                        </div>

                        <div>
                            <input
                                type="url"
                                placeholder="Link del video (TikTok, YouTube Shorts, Instagram Reels...)"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                                className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-600 text-white"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Título (opcional)"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                maxLength={100}
                                className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-600 text-white"
                            />
                        </div>

                        <div>
                            <textarea
                                placeholder="Descripción (opcional)"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                rows={3}
                                maxLength={500}
                                className="w-full px-4 py-2.5 bg-[#2A2A2A] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-600 text-white resize-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={submitting || !link.trim()}
                                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Publicando...
                                    </>
                                ) : (
                                    "Publicar"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setLink("");
                                    setTitulo("");
                                    setDescripcion("");
                                }}
                                className="px-6 py-2.5 bg-[#2A2A2A] hover:bg-[#333] text-gray-300 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Videos feed - create and manage all videos */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
            ) : videos.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        No hay videos todavía. ¡Sé el primero en compartir!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            currentUserId={userId}
                            onDelete={loadVideos}
                            onVoteChange={loadVideos}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
