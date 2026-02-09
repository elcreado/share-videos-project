/**
 * Utility functions for parsing video URLs and generating embed codes
 */

export interface VideoEmbedInfo {
    platform: "tiktok" | "youtube" | "instagram" | "unknown";
    embedUrl: string | null;
    videoId: string | null;
}

/**
 * Parse a video URL and extract embed information
 */
export function parseVideoUrl(url: string): VideoEmbedInfo {
    try {
        const urlObj = new URL(url);

        // TikTok
        if (urlObj.hostname.includes("tiktok.com")) {
            // TikTok URLs: https://www.tiktok.com/@username/video/1234567890
            const match = url.match(/\/video\/(\d+)/);
            if (match) {
                const videoId = match[1];
                return {
                    platform: "tiktok",
                    embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
                    videoId,
                };
            }
        }

        // YouTube (including Shorts)
        if (
            urlObj.hostname.includes("youtube.com") ||
            urlObj.hostname.includes("youtu.be")
        ) {
            let videoId: string | null = null;

            // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
            if (url.includes("/shorts/")) {
                const match = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
                if (match) videoId = match[1];
            }
            // Regular YouTube: https://www.youtube.com/watch?v=VIDEO_ID
            else if (urlObj.searchParams.has("v")) {
                videoId = urlObj.searchParams.get("v");
            }
            // Short URL: https://youtu.be/VIDEO_ID
            else if (urlObj.hostname === "youtu.be") {
                videoId = urlObj.pathname.slice(1);
            }

            if (videoId) {
                return {
                    platform: "youtube",
                    embedUrl: `https://www.youtube.com/embed/${videoId}`,
                    videoId,
                };
            }
        }

        // Instagram Reels
        if (urlObj.hostname.includes("instagram.com")) {
            // Instagram Reels: https://www.instagram.com/reel/CODE/ or /p/CODE/
            const match = url.match(/\/(reel|p)\/([a-zA-Z0-9_-]+)/);
            if (match) {
                const code = match[2];
                return {
                    platform: "instagram",
                    embedUrl: `https://www.instagram.com/p/${code}/embed/`,
                    videoId: code,
                };
            }
        }

        return {
            platform: "unknown",
            embedUrl: null,
            videoId: null,
        };
    } catch (error) {
        return {
            platform: "unknown",
            embedUrl: null,
            videoId: null,
        };
    }
}

/**
 * Get platform display name
 */
export function getPlatformName(
    platform: VideoEmbedInfo["platform"]
): string {
    switch (platform) {
        case "tiktok":
            return "TikTok";
        case "youtube":
            return "YouTube";
        case "instagram":
            return "Instagram";
        default:
            return "Video";
    }
}
