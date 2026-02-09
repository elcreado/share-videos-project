import { supabase } from "@/lib/supabaseClient";

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw error;
    }
}

export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        throw error;
    }

    // Ensure user has a profile
    if (data.user) {
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", data.user.id)
            .single();

        // Create profile if it doesn't exist
        if (profileError || !profile) {
            const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                    id: data.user.id,
                    nombre: data.user.email?.split("@")[0] || "Usuario",
                });

            if (insertError) {
                console.error("Error creating profile:", insertError);
            }
        }
    }

    return data;
}


export async function register(email, password, username) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    const user = data.user;
    if (!user) throw new Error("No se pudo obtener el usuario");

    const { error: pErr } = await supabase
        .from("profiles")
        .insert({
            id: user.id,
            nombre: username,
        });

    if (pErr) throw pErr;

    return data;
}