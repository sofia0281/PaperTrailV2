'use client';
import { useAuth } from "@/context/AuthContext";
import CardPreviewShoppingCart from "../../ui/cardpreviewshoppingcart";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createPedido, createItemPedido } from "@/services/pedidosCRUD";
import { getPedidosByUser } from "@/services/pedidosCRUD";
import {XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getBookByIdLibro , putBookData } from "@/services/bookCRUD";


const PreviewShoppingCart = () => {
  const { cart, authUser, clearCart } = useAuth();
  const [showError, setShowError] = useState(false);
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Calcular el total del carrito
  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Función para manejar el clic en "IR A PAGAR"
  const handleCheckout = async () => {

    if (cart.length === 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Verificar stock antes de hacer cualquier otra operación
      for (const item of cart) {
        const bookData = await getBookByIdLibro(item.idLibro);
        console.log(bookData)
        const available = bookData.cantidad;
        const requested = item.quantity;
  
        if (available < requested) {
          setErrorMessage(`Lo sentimos. El libro: ${item.title} solo tiene disponibles: ${available} unidades.`);
          setTimeout(() => setErrorMessage(null), 3000);
          throw new Error("stock-insuficiente"); // 🔥 Fuerza la salida del try-catch
        }
      }
      router.push("/routes/procesopago");
      setIsLoading(false);
    } catch (error) {
      if (error.message === "stock-insuficiente") {
        // Ya se mostró mensaje
      } else {
        console.error("Error al crear pedido:", error);
        setErrorMessage("Error al realizar el pedido");
        setTimeout(() => setErrorMessage(null), 3000);
      }
    } 
  };
  

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
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
        <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50"
          >
            ¡Tu carrito está vacío! Añade productos antes de pagar.
          </motion.div>
        )}
      </AnimatePresence>
      {/* Div 1: Productos */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-6">
          Hola!, <span className="text-orange-500">{authUser?.username || "Usuario"}</span> Este es tu carrito
        </h2>
        <CardPreviewShoppingCart />
      </div>

      {/* Div 2: Total y botón */}
      <div className="w-full md:w-1/3 flex flex-col justify-between h-full space-y-6">
        <div className="mt-14 border rounded-xl p-4 bg-white shadow-sm flex justify-between items-center font-semibold text-lg">
          <span>Total</span>
          <span>${total.toLocaleString('es-CO')}</span>
        </div>

        <div className="mt-auto">
        <button
          onClick={handleCheckout}
          disabled={isLoading || cart.length === 0}
          className={`w-full py-2 rounded-lg font-medium ${
            isLoading || cart.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-green-500 text-white"
          }`}
        >
          {isLoading ? "Procesando..." : "IR A PAGAR"}
        </button>
        </div>
      </div>
    </div>
    </>

  );
};

export default PreviewShoppingCart;
