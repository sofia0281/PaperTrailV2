"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    nuip: "",
    genero: "",
    correo: "",
    direccion: "",
    usuario: "",
    contraseña: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  const router = useRouter()
  return (
    <div className="flex w-full max-w-5xl mx-auto p-6 justify-center">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Sección Izquierda */}
        <div className="flex flex-col items-center">
            <h2 className="mt-10 text-xl font-bold italic text-center">CREAR</h2>
            <h2 className="mb-8 text-xl font-bold italic text-center">ADMINISTRADOR</h2>
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full">
                <span className="justify-center text-gray-500 text-6xl">+</span>
            </div>
        </div>

        {/* Separador */}
        <div className="hidden md:block w-px bg-gray-300 h-full"></div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Columna 1 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Nombre</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Apellido</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Fecha de nacimiento</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Lugar de nacimiento</label>
            <input type="text" name="lugarNacimiento" value={formData.lugarNacimiento} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          {/* Columna 2 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">NUIP</label>
            <input type="text" name="nuip" value={formData.nuip} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Género</label>
            <input type="text" name="genero" value={formData.genero} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Correo</label>
            <input type="email" name="correo" value={formData.correo} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          {/* Columna 3 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Usuario</label>
            <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Contraseña</label>
            <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            {/* Botón de Enviar */}
            <button type="submit" className="cursor-pointer w-full bg-orange-500 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105" onClick={() => router.push('/gestionroot')}>
              CREAR ADMINISTRADOR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
