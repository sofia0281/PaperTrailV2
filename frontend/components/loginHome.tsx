"use client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ButtonSuscribete from "./ui/buttonsuscribete";
import CardBooks from "./ui/cardbooks";
import withAuth from '@/components/withAuth';

const LoginHome = () => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white">

            {/* Sección de destacados */}
            <section className="flex justify-center items-center py-8">
                <div className="bg-gray-200 w-3/4 h-32 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">[ Banner promocional ]</p>
                </div>
            </section>

            {/* Título principal */}
            <h2 className="text-center text-xl md:text-2xl font-semibold">
                ENCUENTRA TODOS TUS <span className="text-orange-500">LIBROS FAVORITOS</span>
            </h2>

            {/* Botones de categorías y novedades */}
            <div className="flex justify-center gap-4 my-4">
                <button className="bg-[#3C88A3] text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">📚 Categorías</button>
                <button className="bg-[#3C88A3] text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">✨ Novedades</button>
            </div>

            {/* Lista de libros */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 px-6 py-6">
                <CardBooks />
                <CardBooks />
            </div>
            {/* Sección de suscripción */}
                < ButtonSuscribete/>
        </div>
    );
};

export default LoginHome;