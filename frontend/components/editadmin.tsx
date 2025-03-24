"use client";
import { useState, useEffect } from "react";
import withAuth from '@/components/withAuth';
import { getAdminData, putAdminData } from "@/services/adminCRUD";


const EditAdmin =  ({ adminID }: { adminID: string }) => {
  console.log(adminID)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    cedula: "",
    genero: "",
    correo: "",
    direccion: "",
    usuario: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log("Campo cambiado:", e.target.name, "Nuevo valor:", e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Datos guardados:", formData);
      const userData = await getAdminData(adminID);
      try {
          const updatedUserData = {
            "username":formData.usuario,
            "email":formData.correo,
            "Nombre":formData.nombre,
            "Apellido":formData.apellido,
            "cedula":formData.cedula,
            "Genero":formData.genero,
            "Fecha_nacimiento":formData.fechaNacimiento,
            "Lugar_nacimiento":formData.lugarNacimiento,
            "Direccion":formData.direccion,
            "password":formData.password
          };
        const actualizado = await putAdminData(updatedUserData,adminID);
        console.log('Usuario actualizado:', actualizado);
      } catch (error) {
      console.error('Error:', error.message);
      alert('Error al actualizar los datos');
      }
    };

  useEffect(() => {
      const loadAdminData = async () => {
        const userData = await getAdminData(adminID);
        if (userData) {
          setFormData({
            nombre: userData.Nombre || "",
            apellido: userData.Apellido || "",
            cedula: userData.cedula || "",  // Nota: 'cedula' en minúscula (como en tu API)
            genero: userData.Genero || "",
            fechaNacimiento: userData.Fecha_nacimiento || "",
            lugarNacimiento: userData.Lugar_nacimiento || "",
            direccion: userData.Direccion || "",
            correo: userData.email || "",  // Añadido para consistencia
            usuario: userData.username || "",
            password: ""  // Siempre vacío por seguridad
          });
        }
      };
  
      loadAdminData();
    }, []);
    const handleCancelar = () => {
      router.push('/loginHome');  // Redirecciona a la página "About"
    };
  return (
    <div className="flex w-full max-w-5xl mx-auto p-6 justify-center">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Sección Izquierda */}
        <div className="flex flex-col items-center">
            <h2 className="mt-10 text-xl font-bold italic text-center">EDITAR</h2>
            <h2 className="mb-8 text-xl font-bold italic text-center">ADMINISTRADOR</h2>
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full">
                <span className="justify-center text-gray-500 text-6xl">/</span>
            </div>
        </div>

        {/* Separador */}
        <div className="hidden md:block w-px bg-gray-300 h-full"></div>
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Columna 1 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Nombre</label>
            <input                 
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Apellido</label>
            <input 
                type="text" 
                name="apellido" 
                value={formData.apellido} 
                onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Fecha de nacimiento</label>
            <input 
              type="date" 
              name="fechaNacimiento" 
              value={formData.fechaNacimiento} 
              onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Lugar de nacimiento</label>
            <input type="text" name="lugarNacimiento" value={formData.lugarNacimiento} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          {/* Columna 2 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Cedula</label>
            <input 
              type="text" 
              name="cedula" 
              value={formData.cedula} 
              onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Género</label>
            <input 
              type="text" 
              name="genero" 
              value={formData.genero} 
              onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Correo</label>
            <input 
              type="email" 
              name="correo" 
              value={formData.correo} onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Dirección</label>
            <input type="text" 
                name="direccion" 
                value={formData.direccion} 
                onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          {/* Columna 3 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Usuario</label>
            <input 
              type="text" 
              name="usuario"
              value={formData.usuario} 
              onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            {/* Botón de Enviar */}
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer">
              EDITAR ADMINISTRADOR
            </button>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdmin;
