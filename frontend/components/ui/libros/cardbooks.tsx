"use client";
// Crea un card por cada libro de la base de datos
import { useRouter} from "next/navigation";
import { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import {XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext"; 

interface BookProps {
  idLibro:string,
  title: string;
  price: number;
  author?: string;
  condition?: string;
  imageUrl?: string;
}




const CardBooks = ({ 
  idLibro,
  title, 
  price, 
  author, 
  condition, 
  imageUrl 
}: BookProps) => {

  // Estado para animación botones
  const [added, setAdded] = useState(false);

  const router = useRouter()
  
  const { addToCart } = useAuth();
  const { cart } = useAuth();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole?.replace(/"/g, '') || null);
  }, []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  
  const handleMessage = () =>{
    const Mensaje = "Registrate o Inicia Sesión como cliente "
    setSuccessMessage(Mensaje);
    setTimeout(() => setSuccessMessage(null), 3000);
  }
  // Función para añadir al carrito
  const handleAddToCart = () => {
    if (role !== "Authenticated") {
      handleMessage(); // Muestra mensaje si no está autenticado
      return;
    }
    addToCart({ idLibro, title, price }); // Añade el libro al carrito
    if(!added){
      const Mensaje = "Tu libro se añadió exitosamente al carrito "
      setSuccessMessage(Mensaje);
      setTimeout(() => setSuccessMessage(null), 2000);
  
      setAdded(added); // Cambia el estado para la animación
    }else{
      const Mensaje = "Libro eliminado exitosamente "
      setSuccessMessage(Mensaje);
      setTimeout(() => setSuccessMessage(null), 2000);
    }

    setAdded(!added); // Cambia el estado para la animación

  };

  const handleAddToCartAndRedirect = () => {
    if (role !== "Authenticated") {
      handleMessage(); // Muestra mensaje si no está autenticado
      return;
    }
    handleAddToCart(); // Primero añade al carrito
    router.push("/routes/previewshoppingcart"); // Luego redirige
  };
  return (
    <>
          {(successMessage) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-17 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/3 h-auto flex items-center z-20 justify-between px-8 py-5 rounded-lg shadow-lg text-white text-sm ${
            added ? "bg-orange-500" : "bg-red-500"
          }`}
        >
          <span>{successMessage}</span>
          <XCircle
            size={22}
            className="cursor-pointer hover:text-gray-200"
            onClick={() => {
              setSuccessMessage(null);
            }}
          />
        </motion.div>
      )} 
    
    <div className="border rounded-md p-3 shadow-sm hover:scale-105 transition-transform cursor-pointer"
    >
      {/* Contenedor de imagen */}
      <div className="bg-gray-200 h-40 rounded-md flex items-center justify-center overflow-hidden"
      onClick={() => router.push(`/routes/books/${idLibro}`)}>
        {imageUrl ? (
          <img 
            src={imageUrl.includes('http') ? imageUrl : `http://localhost:1337${imageUrl}`}
            alt={`Portada de ${title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-400">[ Portada no disponible ]</p>
        )}
      </div>

      {/* Detalles del libro */}
      <div className="mt-2">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <p className="text-xs text-gray-600">{author}</p>
        <p className="text-sm font-semibold text-gray-800 mt-1">
          ${price.toLocaleString('es-CO')}
        </p>
        <p className="text-xs text-gray-500">{condition}</p>
      </div>
      <div className="Botones flex gap-2 mt-2">

                {/* Botón ShoppingCart */}
                <button className={`cursor-pointer border text-xs px-2 py-1 rounded-md transition-transform transition-colors duration-150 
                active:scale-95
                ${added ? 'bg-orange-500 text-white border-orange-500' 
                  : 'border-orange-500 text-orange-500 hover:bg-orange-400 hover:text-white'}`}
                    onClick={handleAddToCart}>
                  <MdAddShoppingCart/>
                </button>
          
                {/* Botón Comprar ya */}
              <button className="cursor-pointer bg-orange-500 text-white text-xs px-4 py-1 rounded-md hover:bg-orange-600 transition-colors w-full"
              onClick={handleAddToCartAndRedirect}>
                + Comprar ya
              </button>


        </div>

    </div>
    </>
  );
};

export default CardBooks;