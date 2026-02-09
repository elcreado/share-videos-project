import { supabase } from "@/lib/supabaseClient";

export async function addVote(videoId: string, userId: string, tipo: 1 | -1) {
    // Check if user already voted
    const { data: existingVote } = await supabase
        .from("votos")
        .select("*")
        .eq("video_id", videoId)
        .eq("user_id", userId)
        .maybeSingle();

    if (existingVote) {
        // If same vote type, remove it (toggle off)
        if (existingVote.tipo === tipo) {
            return await removeVote(videoId, userId);
        }
        // Otherwise update to new vote type
        const { error } = await supabase
            .from("votos")
            .update({ tipo, creado_en: new Date().toISOString() })
            .eq("video_id", videoId)
            .eq("user_id", userId);

        if (error) throw error;
        return { tipo };
    }

    // Create new vote
    const { error } = await supabase.from("votos").insert({
        video_id: videoId,
        user_id: userId,
        tipo,
        creado_en: new Date().toISOString(),
    });

    if (error) throw error;
    return { tipo };
}

export async function removeVote(videoId: string, userId: string) {
    const { error } = await supabase
        .from("votos")
        .delete()
        .eq("video_id", videoId)
        .eq("user_id", userId);

    if (error) throw error;
    return { tipo: null };
}

export async function getVideoScore(videoId: string) {
    const { data, error } = await supabase
        .from("votos")
        .select("tipo")
        .eq("video_id", videoId);

    if (error) throw error;

    const score = data?.reduce((sum, vote) => sum + vote.tipo, 0) || 0;
    return score;
}

export async function getUserVote(videoId: string, userId: string) {
    const { data, error } = await supabase
        .from("votos")
        .select("tipo")
        .eq("video_id", videoId)
        .eq("user_id", userId)
        .maybeSingle();

    if (error) throw error;
    return data?.tipo || null;
}

export async function getUserVotesForVideos(
    videoIds: string[],
    userId: string
) {
    const { data, error } = await supabase
        .from("votos")
        .select("video_id, tipo")
        .in("video_id", videoIds)
        .eq("user_id", userId);

    if (error) throw error;

    // Return as a map for easy lookup
    const voteMap: Record<string, number> = {};
    data?.forEach((vote) => {
        if (vote.video_id) {
            voteMap[vote.video_id] = vote.tipo;
        }
    });
    return voteMap;
}
