"use client";
import { useState } from "react";
import NewAdmin from "./ui/newadmin";
import { useRouter } from "next/navigation";

const GestionRoot = () => {
  const router = useRouter()
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Título */}
      <h1 className="text-2xl font-bold text-center mb-6">GESTION ROOT</h1>

      {/* Sección de Administradores */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="font-semibold">Administradores</p>
          <p className="text-sm text-gray-600">Cantidad: </p>
        </div>
        <button
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm transition-transform duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => router.push("/createadmin")}
          >
            Crear administrador
        </button>
        </div>

      {/* Lista de administradores */}
      <NewAdmin />

    </div>
  );
};

export default GestionRoot;
