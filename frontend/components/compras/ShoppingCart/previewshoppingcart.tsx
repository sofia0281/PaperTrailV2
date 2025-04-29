'use client';
import { useAuth } from "@/context/AuthContext";
import CardPreviewShoppingCart from "../../ui/cardpreviewshoppingcart";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
const PreviewShoppingCart = () => {
  const { cart, authUser } = useAuth();
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  // Calcular el total del carrito
  const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  // Función para manejar el clic en "IR A PAGAR"
  const handleCheckout = () => {
    console.log(cart.length)
    if (cart.length === 0) {
      setShowError(true); // Mostrar error si el carrito está vacío
      setTimeout(() => setShowError(false), 3000); // Ocultar después de 3 segundos
    } else {
      // router.push("/routes/payment"); 
    }
  };

  return (
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
            className="cursor-pointer w-full py-2 rounded-lg font-medium  bg-orange-500 hover:bg-green-500 text-white"
            onClick={handleCheckout}
            // disabled={cart.length === 0}
          >
            IR A PAGAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewShoppingCart;