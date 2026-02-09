"use client";

import { useState } from "react";
import { parseVideoUrl, getPlatformName } from "@/lib/utils/videoEmbed";
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";

interface VideoEmbedProps {
    url: string;
}

export default function VideoEmbed({ url }: VideoEmbedProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const embedInfo = parseVideoUrl(url);

    // If we can't embed this URL, return null
    if (!embedInfo.embedUrl || embedInfo.platform === "unknown") {
        return null;
    }

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div className="mt-3 mb-2">
            {/* Embed container */}
            <div
                className={`relative bg-black rounded-lg overflow-hidden transition-all ${isExpanded ? "aspect-[9/16]" : "aspect-video"
                    }`}
            >
                {/* Loading state */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#2A2A2A]">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-400 text-sm">
                                Cargando {getPlatformName(embedInfo.platform)}...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {hasError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#2A2A2A]">
                        <div className="text-center p-4">
                            <p className="text-gray-400 mb-2">
                                No se pudo cargar el video
                            </p>
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm"
                            >
                                Ver en {getPlatformName(embedInfo.platform)}
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Iframe embed */}
                <iframe
                    src={embedInfo.embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleLoad}
                    onError={handleError}
                    style={{ border: "none" }}
                />

                {/* Expand/Collapse button */}
                {!isLoading && !hasError && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg transition-colors backdrop-blur-sm"
                        title={isExpanded ? "Vista compacta" : "Vista expandida"}
                    >
                        {isExpanded ? (
                            <Minimize2 className="w-4 h-4" />
                        ) : (
                            <Maximize2 className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>

            {/* Platform badge */}
            <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                    {getPlatformName(embedInfo.platform)} embed
                </span>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                    Ver original
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}
