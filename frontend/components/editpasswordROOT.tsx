import React from "react";
import withAuthROOT from './withAuthROOT';

const EditarContrasena = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:items-start gap-6 p-6">
      {/* Sección izquierda con imagen y título */}
      <div className="flex flex-col items-center ">
            <h2 className="mt-10 text-xl font-bold italic text-center">EDITAR</h2>
            <h2 className="mb-8 text-xl font-bold italic text-center">ADMINISTRADOR</h2>
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full">
                <span className="justify-center text-gray-500 text-6xl">/</span>
            </div>
     </div>

      {/* Sección derecha con formulario */}
      <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">CAMBIO DE CONTRASEÑA</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input de Contraseña Actual */}
          <div className="col-span-2">
            <label className="text-sm font-semibold">
              Contraseña actual (déjalo en blanco para no cambiarla)
            </label>
            <input
              type="password"
              placeholder="Escribe aquí..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Input de Nueva Contraseña */}
          <div className="col-span-2">
            <label className="text-sm font-semibold">
              Nueva <i>contraseña</i> (déjalo en blanco para no cambiarla)
            </label>
            <input
              type="password"
              placeholder="Escribe aquí..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Input de Confirmar Nueva Contraseña */}
          <div className="col-span-2">
            <label className="text-sm font-semibold">
              Confirmar nueva contraseña (déjalo en blanco para no cambiarla)
            </label>
            <input
              type="password"
              placeholder="Escribe aquí..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">
              CAMBIAR CONTRASEÑA
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withAuthROOT(EditarContrasena);
