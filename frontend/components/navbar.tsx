"use client";
import { ShoppingCart, User, Search, Settings, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

type UserType = {
    nombre: string;
} | null;

const Navbar = () => {
    const router = useRouter();
    const role = localStorage.getItem('role');
    console.log(role)

    return (
        <div className="flex items-center justify-between w-full bg-[#3C88A3] p-3">
            {/* Logo e ícono */}
            <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
                <Image
                    src="/img/icono.png"
                    alt="Icono PaperTrail"
                    width={32}
                    height={32}
                    className="mr-2"
                />
                <h1 className="text-2xl text-white">
                    PAPER <span className="font-bold">TRAIL</span>
                </h1>
            </div>
            
            {/* Barra de búsqueda */}
            <div className="relative flex-grow mx-4 max-w-lg">
                <input
                    type="text"
                    placeholder="Título, Autor, Año, ISSN"
                    className="w-full p-2 pl-4 pr-10 rounded-lg bg-white text-black focus:outline-none shadow-md"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                    <Search size={20} />
                </button>
            </div> 

            {/* Íconos de usuario y carrito/ Root*/}
            <div className="flex items-center space-x-4 text-white">
                {role && role.toString().toUpperCase().replace(/"/g, '') === "ROOT" ?  (
                    <>
                    <span className="font-bold uppercase">ROOT</span>
                    <Shield
                        strokeWidth={1}
                        className="cursor-pointer"
                        onClick={() => router.push("/admin")}
                    />
                    <Settings
                        strokeWidth={1}
                        className="cursor-pointer"
                        onClick={() => router.push("/settings")}
                    />
                    </>
                ) : (
                    <>
                    <User 
                        strokeWidth={1} 
                        className="cursor-pointer" 
                        onClick={() => router.push("/routes/login")} 
                    />
                    <ShoppingCart 
                        strokeWidth={1} 
                        className="cursor-pointer" 
                        onClick={() => router.push("/cart")} 
                    />
                    </>
                )}
                </div>
        </div>
    );
};

export default Navbar;
