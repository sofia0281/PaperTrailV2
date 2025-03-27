"use client";
import { ShoppingCart, User, Search, Settings, Shield, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

type UserType = {
    nombre: string;
} | null;

const Navbar = () => {
    {/* Estado de menú plegable */}
    const [user, setUser] = useState<UserType>(null);
    const [isClient, setIsClient] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const role = localStorage.getItem('role');
    console.log(role)

    // Cerrar el menú al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        } 
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logout = () => {
        localStorage.clear(); // Limpia TODO el localStorage
        window.location.href = '/'; // Redirección forzada
      };
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
                
                {role && role.toString().toUpperCase().replace(/"/g, '') === "ROOT" ? (
                    <>
                    {/* Íconos de usuario y carrito ROOT*/}
                    <span className="font-bold uppercase">ROOT</span>
                        <Shield
                            strokeWidth={1}
                            className="cursor-pointer"
                            // aqui no sé qué poner
                            onClick={() => router.push("/routes/editpasswordadmin")}
                        />
                    <div className="relative" ref={menuRef}>
                        <Settings
                            strokeWidth={1}
                            className="cursor-pointer"
                            onClick={() => setMenuOpen(!menuOpen)}
                        />
                        {/* Menú desplegable */}
                        {menuOpen && (
                                    <div className="absolute right-0 mt-5 mr-0 w-52 bg-[#5FAEC9] text-white shadow-lg rounded-lg overflow-hidden z-50">
                                        <button
                                            className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                            onClick={() => router.push("/routes/edipasswordadmin")}
                                        >
                                            PerfilROOT
                                        </button>
                                        <button
                                            className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                            onClick={() => router.push("/routes/gestionroot")}
                                        >
                                            Gestion Administradores
                                        </button>
                                        <button
                                            className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-500 flex items-center justify-between cursor-pointer"
                                            onClick={() => {
                                                setUser(null);
                                                setMenuOpen(false);
                                                logout();
                                            }}
                                        >
                                            Cerrar Sesión <LogOut size={16} />
                                        </button>
                                    </div>
                                )}
                    </div>
                    </>
                ) : (role && role.toString().replace(/"/g, '') === "Admin") ? (
                    <>

                    {/* Ícono de usuario con menú desplegable */}
                    <div className="relative" ref={menuRef}>
                        <User 
                            strokeWidth={1} 
                            className="cursor-pointer" 
                            onClick={() => setMenuOpen(!menuOpen)} 
                        />
                        {/* Menú desplegable */}
                        {menuOpen && (
                                <div className="absolute right-0 mt-5 mr-0 w-52 bg-[#5FAEC9] text-white shadow-lg rounded-lg overflow-hidden z-50">
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                        onClick={() => router.push("/routes/editprofile")}
                                    >
                                        Editar Perfil
                                    </button>
                                    {/* <button
                                        className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                        onClick={() => router.push("/settings")}
                                    >
                                        Opciones
                                    </button> */}
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-500 flex items-center justify-between cursor-pointer"
                                        onClick={() => {
                                            setUser(null);
                                            setMenuOpen(false);
                                            logout();
                                        }}
                                    >
                                        Cerrar sesión <LogOut size={16} />
                                    </button>
                                </div>
                            )}
                    </div>
                    </>
                ):(role && role.toString().replace(/"/g, '') === "Authenticated") ? (
                    <>

                    {/* Íconos de usuario y carrito LOGUEADO*/}

                    <ShoppingCart 
                                strokeWidth={1} 
                                className="cursor-pointer" 
                                // onClick={() => router.push("/cart")} 
                            />

                    {/* Ícono de usuario con menú desplegable */}
                    <div className="relative" ref={menuRef}>
                        <User 
                            strokeWidth={1} 
                            className="cursor-pointer" 
                            onClick={() => setMenuOpen(!menuOpen)} 
                        />
                        {/* Menú desplegable */}
                        {menuOpen && (
                                <div className="absolute right-0 mt-5 mr-0 w-52 bg-[#5FAEC9] text-white shadow-lg rounded-lg overflow-hidden z-50">
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                        onClick={() => router.push("/routes/editprofile")}
                                    >
                                        Editar Perfil
                                    </button>
                                    {/* <button
                                        className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                        onClick={() => router.push("/settings")}
                                    >
                                        Opciones
                                    </button> */}
                                    <button
                                        className="w-full px-4 py-2 text-left hover:bg-red-100 text-red-500 flex items-center justify-between cursor-pointer"
                                        onClick={() => {
                                            setUser(null);
                                            setMenuOpen(false);
                                            logout();
                                        }}
                                    >
                                        Cerrar sesión <LogOut size={16} />
                                    </button>
                                </div>
                            )}
                    </div>
                    </>               
                ):( 
                    
                    <>

                    {/* Íconos de usuario y carrito NO LOGUEADO*/}
                    <ShoppingCart 
                        strokeWidth={1} 
                        className="cursor-pointer" 
                        // onClick={() => router.push("/cart")} 
                    />
                    <User 
                        strokeWidth={1} 
                        className="cursor-pointer" 
                        onClick={() => router.push("/routes/login")} 
                    />
                    </>
                )}
                </div>
        </div>
    );
};

export default Navbar;