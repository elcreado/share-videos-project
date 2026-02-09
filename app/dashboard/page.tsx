"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import SocialFeed from "@/components/SocialFeed";
import AnimatedBackground from "@/components/AnimatedBackground";
import { LogOut, User } from "lucide-react";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            try {
                const { user } = await getCurrentUser();
                if (!user) {
                    router.push("/");
                    return;
                }
                setUser(user);

                // Load profile
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                setProfile(profileData);
            } catch (error) {
                console.error("Error loading user:", error);
                router.push("/");
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, [router]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white bg-[#121212]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#121212] text-white">
            <AnimatedBackground />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">🎬</div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            VideoFeed
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* User info */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.nombre || user.email}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    profile?.nombre?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"
                                )}
                            </div>
                            <span className="text-sm text-gray-300 hidden sm:inline">
                                {profile?.nombre || user.email}
                            </span>
                        </div>

                        {/* Logout button */}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Cerrar sesión"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="relative">
                <SocialFeed userId={user.id} />
            </main>
        </div>
    );
}
