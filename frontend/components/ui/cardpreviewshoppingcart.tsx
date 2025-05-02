"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const CardPreviewShoppingCart = () => {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart } = useAuth();

  return (
    <div className="space-y-4">
      {cart.length === 0 ? (
        <p className="text-center py-10">Tu carrito está vacío</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.idLibro}
            className="flex items-center justify-between border rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="flex items-center space-x-4">
              {/* Imagen del libro */}
              <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                {item.imageUrl && (
                  <img
                    src={
                      item.imageUrl.includes("http")"use client";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const CardPreviewShoppingCart = () => {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart } = useAuth();

  return (
    <div className="space-y-4">
      {cart.length === 0 ? (
        <p className="text-center py-10">Tu carrito está vacío</p>
      ) : (
        cart.map((item) => (
          <div
            key={item.idLibro}
            className="flex items-center justify-between border rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="flex items-center space-x-4">
              {/* Imagen del libro */}
              <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                {item.imageUrl && (
                  <img
                    src={
                      item.imageUrl.includes("http")
                        ? item.imageUrl
                        : `http://localhost:1337${item.imageUrl}`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">
                  ${item.unitPrice.toLocaleString("es-CO")} (c/u)
                </p>
                <p className="text-sm text-gray-600">
                  ${item.totalPrice.toLocaleString("es-CO")} (Total)
                </p>
              </div>
            </div>

            {/* Contador de cantidad y botón de eliminar */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-full px-2 py-1 space-x-2">
                <button
                  onClick={() => updateQuantity(item.idLibro, item.quantity - 1)}
                  className="cursor-pointer hover:text-orange-500"
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.idLibro, item.quantity + 1)}
                  className="cursor-pointer hover:text-orange-500"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.idLibro)}
                className="cursor-pointer text-gray-500 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Botón para seguir comprando */}
      <button
        className="cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium mt-4 p-2"
        onClick={() => router.push("/")}
      >
        ← Continuar comprando
      </button>
    </div>
  );
};

export default CardPreviewShoppingCart;
                        ? item.imageUrl
                        : `http://localhost:1337${item.imageUrl}`
                    }
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">
                  ${item.unitPrice.toLocaleString("es-CO")} (c/u)
                </p>
                <p className="text-sm text-gray-600">
                  ${item.totalPrice.toLocaleString("es-CO")} (Total)
                </p>
              </div>
            </div>

            {/* Contador de cantidad y botón de eliminar */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-full px-2 py-1 space-x-2">
                <button
                  onClick={() => updateQuantity(item.idLibro, item.quantity - 1)}
                  className="cursor-pointer hover:text-orange-500"
                >
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.idLibro, item.quantity + 1)}
                  className="cursor-pointer hover:text-orange-500"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.idLibro)}
                className="cursor-pointer text-gray-500 hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Botón para seguir comprando */}
      <button
        className="cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium mt-4 p-2"
        onClick={() => router.push("/")}
      >
        ← Continuar comprando
      </button>
    </div>
  );
};

export default CardPreviewShoppingCart;