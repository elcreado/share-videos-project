import { supabase } from "@/lib/supabaseClient";
import { Comment } from "@/types/database";

export async function createComment(
    userId: string,
    videoId: string,
    content: string,
    creado_en?: string
) {
    const { data, error } = await supabase
        .from("comentarios")
        .insert({
            user_id: userId,
            video_id: videoId,
            comentarios: content,
            creado_en: creado_en || new Date().toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return data as Comment;
}

export async function getComments(videoId: string) {
    const { data, error } = await supabase
        .from("comentarios")
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
        .eq("video_id", videoId)
        .order("creado_en", { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function deleteComment(commentId: string, userId: string) {
    const { error } = await supabase
        .from("comentarios")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId);

    if (error) throw error;
}