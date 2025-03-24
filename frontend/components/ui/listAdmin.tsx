"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import withAuth from '@/components/withAuth';
import React from 'react';

const ListAdmins = () => {
  // Datos de ejemplo (deberías reemplazarlos con los datos reales de tu API)
  const admins = [
    { id: 1, name: 'ADMIN 1', createdAt: '2023-05-15' },
    { id: 2, name: 'ADMIN 2', createdAt: '2023-06-20' },
    { id: 3, name: 'ADMIN 3', createdAt: '2023-07-10' }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">GESTION ROOT</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600"><strong>Administradores</strong> · Cantidad: {admins.length}</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Crear administrador
          </button>
        </div>
      </div>

      {/* Lista de administradores */}
      <div className="space-y-4">
        {admins.map(admin => (
          <div key={admin.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{admin.name}</h3>
                <p className="text-gray-500 text-sm">Fecha de creación: {admin.createdAt}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-red-600 border border-red-600 px-3 py-1 rounded-md hover:bg-red-50 transition-colors">
                  ELIMINAR
                </button>
                <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors">
                  EDITAR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAdmins;