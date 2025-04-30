"use client";
import { Minus, Plus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const CardSideBarShoppingCart = ({ item }) => {
  const { updateQuantity, removeFromCart } = useAuth();

  return (
    <div className="flex items-center gap-3 border-b pb-4">
      {/* Imagen del libro */}
      <div className="w-16 h-16 bg-white rounded overflow-hidden">
        {item.imageUrl && (
          <img
            src={item.imageUrl.includes('http') ? item.imageUrl : `http://localhost:1337${item.imageUrl}`}
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
          onClick={() => updateQuantity(item.idLibro, item.quantity + 1)}
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
  );
};

export default CardSideBarShoppingCart;