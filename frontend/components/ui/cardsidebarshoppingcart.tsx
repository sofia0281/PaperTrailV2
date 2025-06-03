"use client";
import { Minus, Plus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import {XCircle } from "lucide-react";
import { motion } from "framer-motion";

const CardSideBarShoppingCart = ({ item }) => {
  const { updateQuantity, removeFromCart } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleupdateQuantity =  () => {
   const comprobacion = updateQuantity(item.idLibro, item.quantity + 1);
   if (comprobacion === false)
   {
    setErrorMessage("Limite de unidades permitidas");
    setTimeout(() => setErrorMessage(null), 3000);

   }

  }

  return (
    <>
          {(successMessage || errorMessage) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-17 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/3 h-auto flex items-center z-20 justify-between px-8 py-5 rounded-lg shadow-lg text-white text-sm ${
            successMessage ? "bg-orange-500" : "bg-black"
          }`}
        >
          <span>{successMessage || errorMessage}</span>
          <XCircle
            size={22}
            className="cursor-pointer hover:text-gray-200"
            onClick={() => {
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
          />
        </motion.div>
      )} 
    
    <div className="flex items-center gap-3 border-b pb-4">
      {/* Imagen del libro */}
      <div className="w-16 h-16 bg-white rounded overflow-hidden">
        {item.imageUrl && (
          <img
            src={item.imageUrl.includes('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.imageUrl}`}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Detalles del libro */}
      <div className="flex-1">
        <p className="font-medium">{item.title}</p>
        <p className="text-sm">${item.totalPrice.toLocaleString('es-CO')}</p>
      </div>

      {/* Contador de cantidad */}
      <div className="flex items-center border rounded-full px-2 py-1 space-x-2">
        <button
          onClick={() => updateQuantity(item.idLibro, item.quantity - 1)}
          className="cursor-pointer hover:text-orange-500 transition duration-200 ease-in-out"
        >
          <Minus size={16} />
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => handleupdateQuantity()}
          className="cursor-pointer hover:text-orange-500 hover:scale-140 transition duration-200 ease-in-out"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Botón para eliminar */}
      <button
        onClick={() => removeFromCart(item.idLibro)}
        className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
      >
        <X size={16} />
      </button>
    </div>
    </>
  );
};

export default CardSideBarShoppingCart;