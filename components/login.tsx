"use client";

import { useState } from "react";
import { login, register } from "@/lib/services/auth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");


    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (error) {
            setError("");
        }

        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "username") setUsername(value);
        if (name === "confirmPassword") setConfirmPassword(value);
    };

    console.log("SUBMIT disparado");


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegister && password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setError(""); // Clear previous errors

        try {
            if (isRegister) {
                await register(email, password, username);
            } else {
                await login(email, password);
            }
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Authentication error:", error);
            setError(error.message || "Ocurrió un error inesperado");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#121212] p-4 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#1E1E1E] rounded-2xl shadow-xl border border-white/5">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-purple-500">
                        {isRegister ? "Crear Cuenta" : "Bienvenido"}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isRegister
                            ? "Ingresa tus datos para registrarte"
                            : "Ingresa tus credenciales para continuar"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Tu email"
                            required
                            value={email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-600"
                        />
                    </div>

                    {isRegister && (
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="text-sm font-medium text-gray-300"
                            >
                                Usuario
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="Tu usuario"
                                value={username}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-600"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-300"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            value={password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-600"
                        />
                    </div>

                    {isRegister && (
                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-gray-300"
                            >
                                Confirmar Contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#2A2A2A] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-gray-600"
                            />
                        </div>
                    )}

                    {error && <p className="text-red-500">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3.5 mt-2 text-white font-semibold bg-purple-600 hover:bg-purple-500 rounded-lg shadow-lg shadow-purple-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isRegister ? "Registrarse" : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-2 bg-[#1E1E1E] text-gray-500">O</span>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline underline-offset-4"
                    >
                        {isRegister
                            ? "¿Ya tienes cuenta? Inicia sesión"
                            : "¿No tienes cuenta? Regístrate"}
                    </button>
                </div>
            </div>
        </div>
    );
}
