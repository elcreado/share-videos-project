import { supabase } from "@/lib/supabaseClient";
import { Video, VideoWithProfile } from "@/types/database";

export async function createVideo(
    userId: string,
    link: string,
    titulo: string,
    descripcion?: string,
    creado_en?: string
) {
    // Verify user has a profile
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

    if (profileError || !profile) {
        throw new Error(
            "No se encontró el perfil del usuario. Por favor, cierra sesión y vuelve a iniciar sesión."
        );
    }

    const { data, error } = await supabase
        .from("videos")
        .insert({
            user_id: userId,
            link,
            titulo,
            descripcion: descripcion || null,
            creado_en: creado_en || new Date().toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return data as Video;
}

export async function getVideos(limit: number = 20, offset: number = 0) {
    // Get videos with profile info and calculate scores
    const { data: videos, error } = await supabase
        .from("videos")
        .select(`*,
      profiles (
        id,
        nombre,
        avatar_url,
        creado_en
      )
    `
        )
        .order("creado_en", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) throw error;

    // Get all votes for these videos
    const videoIds = videos?.map((v) => v.id) || [];
    const { data: votes } = await supabase
        .from("votos")
        .select("video_id, tipo")
        .in("video_id", videoIds);

    // Calculate scores
    const videosWithScores = videos?.map((video) => {
        const videoVotes = votes?.filter((v) => v.video_id === video.id) || [];
        const score = videoVotes.reduce((sum, v) => sum + v.tipo, 0);
        return {
            ...video,
            score,
            userVote: null, // Will be set separately if needed
        } as VideoWithProfile;
    });

    return videosWithScores || [];
}

export async function getUserVideos(userId: string) {
    const { data, error } = await supabase
        .from("videos")
        .select(
            `
      *,
      profiles (
        id,
        nombre,
        avatar_url,
        creado_en
      )
    `
        )
        .eq("user_id", userId)
        .order("creado_en", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function deleteVideo(videoId: string, userId: string) {
    const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", videoId)
        .eq("user_id", userId);

    if (error) throw error;
}
