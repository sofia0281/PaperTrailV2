"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function SubscriptionModal() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
          {/* Botón de cierre */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>

          {/* Icono y título */}
          <div className="flex flex-col items-center">
            <div className="bg-orange-600 p-4 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.94 6.94A2 2 0 014 6h12a2 2 0 011.06.94L10 12 2.94 6.94z" />
                <path d="M18 8v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8l8 6 8-6z" />
              </svg>
            </div>
            <h2 className="text-orange-700 text-2xl font-bold">¡SUSCRÍBETE!</h2>
            <p className="text-center text-gray-600 text-sm">
              Y recibe información a tu correo con nuestras novedades.
            </p>
          </div>

          {/* Campos del formulario */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full p-2 border rounded-md mb-3 focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              className="w-full p-2 border rounded-md mb-4 focus:ring-2 focus:ring-orange-500"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
              Enviar
            </button>
          </div>
        </div>
      </div>
    )
  );
}