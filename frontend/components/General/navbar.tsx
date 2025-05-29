"use client";
import { ShoppingCart, User, Search, Settings, Shield, LogOut, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import CartSidebar from "../compras/ShoppingCart/CartSideBar";
import { useAuth } from "@/context/AuthContext";

import SearchBar from "./SearchBar"; 
import axios from 'axios';











type UserType = {
    nombre: string;
} | null;

const Navbar = () => {

    const { cart } = useAuth(); // accede al contenido del carrito

    {/* Estado de menú plegable */}
    const [user, setUser] = useState<UserType>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    //Carrito de compras
    const [cartOpen, setCartOpen] = useState(false)
    const toggleCart = () => setCartOpen(!cartOpen)

    const [role, setRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [nuevosMensajesCount, setNuevosMensajesCount] = useState(0);


    const fetchNuevosMensajes = async () => {
        try {
          const res = await axios.get('http://localhost:1337/api/mensajes?populate=user');
          const mensajes = res.data.data;
      
          // Contar cuántos mensajes NO vistos hay
          const noVistos = mensajes.filter((msg: any) => msg.visto === false);
          setNuevosMensajesCount(noVistos.length);
        } catch (error) {
          console.error('Error al obtener mensajes no vistos:', error);
        }
      };
      useEffect(() => {
        fetchNuevosMensajes();
      }, []);

    useEffect(() => {
        const loadUserData = () => {
          const storedRole = localStorage.getItem('role');
          const userString = localStorage.getItem("user");
          const userObj = userString ? JSON.parse(userString) : null;
      
          setRole(storedRole?.replace(/"/g, '') || null);
          setUserName(userObj?.username || null);
        };
      
        loadUserData();
      
        // Escucha el evento de login
        window.addEventListener("userLoggedIn", loadUserData);
      
        return () => {
          window.removeEventListener("userLoggedIn", loadUserData);
        };
      }, []);
      
    
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
        
        <div className="flex items-center cursor-pointer transition-transform duration-300 transform hover:scale-105" onClick={() => router.push("/")}>
                <Image
                    src="/img/icono.png"
                    alt="Icono PaperTrail"
                    width={32}
                    height={32}
                    className="mr-2"
                />
                <h1 className="text-2xl text-white ">
                    PAPER <span className="font-bold">TRAIL</span>
                </h1>
        </div>

        {/*------------------------Barra de búsqueda-------------------------- */}
        <SearchBar />


    {/*--------------------------- Carrito de compras----------------------- */}
    <CartSidebar isOpen={cartOpen} toggleCart={toggleCart} />
    
    {/*------------------Íconos de usuario y carrito/ Root----------------*/}
    <div className="flex items-center space-x-4 text-white">
        
        {role === "ROOT" ? (
            <>

            {/* Íconos de ROOT y carrito ROOT*/}
            {/* <span className="font-bold uppercase">ROOT</span>
                <Shield
                    strokeWidth={1}
                    className="cursor-pointer"
                    // aqui no sé qué poner
                    onClick={() => router.push("/routes/editpasswordadmin")}
                /> */}
            <div className="relative flex items-center" ref={menuRef}>
                <span className="transition-transform duration-300 transform hover:scale-105">Hola, {userName}</span>

                <div
                    title="Perfil"
                    className="transition-transform duration-300 transform hover:scale-110 cursor-pointer ml-1"
                    onClick={() => setMenuOpen(!menuOpen)}>
                <User
                    strokeWidth={1}
                /> 
                </div> 
                {/*------------------Menú desplegable---------------------*/}
                {menuOpen && (
                            <div className="absolute right-0 mt-35 w-52 bg-[#5FAEC9] text-white shadow-lg rounded-lg overflow-hidden z-50">
                                {/* <button
                                    className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                    onClick={() => router.push("/routes/editpasswordroot")}
                                >
                                    PerfilROOT
                                </button> */}
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
        ) : (role === "Admin") ? (
            <>

            {/* Ícono de ADMIN con menú desplegable */}
            <div className="relative flex items-center" ref={menuRef}>
                <span className="transition-transform duration-300 transform hover:scale-105">Hola, {userName}</span>
                <div
                    title="Administración de libros"
                    className="transition-transform duration-300 transform hover:scale-110 cursor-pointer ml-1"
                    onClick={() => {
                        router.push("/routes/adminbooks");
                        setMenuOpen(false)
                    } }>
                <Settings
                    strokeWidth={1}
                /> 
                </div>
                <div
                    title="Mensajes"
                    className="relative transition-transform duration-300 transform hover:scale-110 cursor-pointer ml-1"
                    onClick={() => {
                        router.push("/routes/messageAdmin");
                        setMenuOpen(false);
                    }}
                    >
                    <Bell strokeWidth={1.5} className="w-6 h-6 text-white-700" />
                    
                    {nuevosMensajesCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {nuevosMensajesCount}
                        </span>
                    )}
                    </div>

                <div
                    title="Perfil"
                    className="transition-transform duration-300 transform hover:scale-110 cursor-pointer ml-1"
                    onClick={() => setMenuOpen(!menuOpen)}>
                <User
                    strokeWidth={1}
                /> 
                </div>  

                {/*--------------------Menú desplegable------------------*/}
                {menuOpen && (
                        <div className="absolute right-0 mt-60 w-52 bg-[#5FAEC9] text-white shadow-lg rounded-lg overflow-hidden z-50">
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => {
                                    router.push("/routes/editprofile");
                                    setMenuOpen(false)
                                }}
                            >
                                Editar Perfil
                            </button>
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => router.push("/routes/adminorderstatus")}
                            >
                                Administrar Pedidos
                            </button>

                            <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => router.push("/routes/requestadmin")}
                            >
                                Devoluciones
                            </button>

                            <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => router.push("/routes/adminshop")}
                            >
                                Administrar Tiendas
                            </button>
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
        ):(role  === "Authenticated") ? (
            <>

        <div className="relative flex items-center ">
            {/* Íconos de usuario y carrito LOGUEADO*/}
            <span className="transition-transform duration-300 transform hover:scale-105" >Hola, {userName}</span>
            <div
                    title="Carrito"
                    className="transition-transform duration-300 transform hover:scale-110 cursor-pointer ml-1">

                
                <ShoppingCart
                    strokeWidth={1}
                    onClick={toggleCart}
                />
                {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
                </span>
                )}
                
                </div> 

            {/*-----------Ícono de usuario con menú desplegable ---------*/}
            <div className="relative" ref={menuRef}>
                <div
                        title="Perfil"
                        className="transition-transform duration-300 transform hover:scale-110 cursor-pointer ml-1"
                        onClick={() => setMenuOpen(!menuOpen)}>
                    <User
                        strokeWidth={1}
                    /> 
                </div> 
                {/*------------------Menú desplegable---------------------*/}
                {menuOpen && (
                        <div className="absolute right-0 mt-4 w-52 bg-[#5FAEC9] text-white shadow-lg rounded-lg overflow-hidden z-50">
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => {
                                    router.push("/routes/editprofile");
                                    setMenuOpen(false)
                                }}
                            >
                                Editar 
                            </button>
                            { <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => router.push("/routes/wallet")}
                            >
                                Monedero
                            </button> }

                            <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => {
                                    router.push("/routes/message");
                                    setMenuOpen(false)
                                }}
                            >
                                Mensajerias
                            </button>
                            { <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => router.push("/routes/orderstatus")}
                            >
                                Estado de Compras
                            </button> }

                            <button
                                className="w-full px-4 py-2 text-left hover:bg-[#4D94AD] cursor-pointer"
                                onClick={() => {
                                    router.push("/routes/purchasehistory");
                                    setMenuOpen(false)
                                }}
                            >
                                Historial de compras
                            </button>


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
        </div>
            </>               
        ):( 
            
            <>
            {/* Íconos de usuario y carrito NO LOGUEADO*/}
            {/* <ShoppingCart 
                strokeWidth={1} 
                className="cursor-pointer" 
                // onClick={() => router.push("/cart")} 
            /> */}
            <div className="relative flex items-center transition-transform duration-300 transform hover:scale-105 cursor-pointer" 
            onClick={() => router.push("/routes/login")} 
            >
                <span>Inicia Sesión</span>
                <User 
                    strokeWidth={1} 
                />
            </div>
            </>
        )}
        </div>
    </div>
    );
};

export default Navbar;