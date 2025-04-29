// Carrito de compras pequeño, imprime a cada uno de los items en el array de carritos 
// con la card de cardsedebarshoppingcart 
'use client'
import { useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import CardSideBarShoppingCart from "../../ui/cardsidebarshoppingcart";
import { useRouter } from "next/navigation";

type CartSidebarProps = {
  isOpen: boolean;
  toggleCart: () => void;
};

const CartSidebar = ({ isOpen, toggleCart }: CartSidebarProps) => {
  const router = useRouter();
  const { cart, clearCart } = useAuth();

  // Calcular el total del carrito
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <>
      {/* Fondo oscuro */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[350px] bg-[#3C88A3] text-white z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
          >
            {/* Encabezado */}
            <div className="flex bg-orange-600 p-1 text-lg font-semibold justify-between">
              <p>Mi carrito ({cart.length})</p>
              <X className="cursor-pointer" onClick={toggleCart} />
            </div>

            {/* Contenido del carrito */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <p className="text-center py-10">Tu carrito está vacío</p>
              ) : (
                cart.map((item) => (
                  <CardSideBarShoppingCart key={item.idLibro} item={item} />
                ))
              )}
            </div>

            {/* Total + Botones */}
            <div className="bg-orange-500 text-white p-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${cartTotal.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <div className="flex gap-2 p-6">
              <button
                className="w-1/2 text-white hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                onClick={toggleCart}
              >
                ← Continuar comprando
              </button>
              <button
                className="w-1/2 bg-orange-600 text-white rounded hover:scale-110 transition duration-200 ease-in-out cursor-pointer"
                onClick={() => {
                  router.push("/routes/previewshoppingcart");
                  setTimeout(() => toggleCart(), 500);
                }}
                disabled={cart.length === 0}
              >
                Continuar con la compra →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;