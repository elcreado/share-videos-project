export interface Profile {
    id: string;
    nombre: string | null;
    avatar_url: string | null;
    creado_en: string | null;
}

export interface Video {
    id: string;
    user_id: string | null;
    link: string;
    titulo: string | null;
    descripcion: string | null;
    creado_en: string | null;
}

export interface Voto {
    id: string;
    video_id: string | null;
    user_id: string | null;
    tipo: number; // 1 or -1
    creado_en: string | null;
}

export interface Comentario {
    id: string;
    video_id: string | null;
    user_id: string | null;
    comentarios: string;
    creado_en: string | null;
}

export interface VideoWithProfile extends Video {
    profiles: Profile;
    score: number;
    userVote: number | null;
}
