"use client";
import { useState, useEffect } from "react";
import withAuth from '@/components/withAuth';
import { fetchUserData } from "@/services/getLogin";

const EditProfile = () => {
    const [formData, setFormData] = useState({
      nombre: "",
      apellido: "",
      cedula: "",
      genero: "",
      nacimiento: "",
      lugarNacimiento: "",
      direccion: "",
      email: "",
      usuario: "",
      preferencia1: "",
      preferencia2: "",
      passwordActual: "",
      passwordNueva: "",
      passwordConfirmar: "",
    });

  // Obtener los datos del usuario al cargar la página
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setFormData({
          nombre: userData.Nombre || "",
          apellido: userData.Apellido || "",
          cedula: userData.cedula || "",
          genero: userData.Genero || "",
          nacimiento: userData.Fecha_nacimiento || "",
          lugarNacimiento: userData.Lugar_nacimiento || "",
          direccion: userData.Direccion || "",
          email: userData.email || "",
          usuario: userData.username || "",
          preferencia1: userData.TemaL1 || "",
          preferencia2: userData.TemaL2 || "",
          passwordActual: "",
          passwordNueva: "",
          passwordConfirmar: "",
        });
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos guardados:", formData);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar los datos del usuario');
      }

      const updatedUser = await response.json();
      console.log('Usuario actualizado:', updatedUser);
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error:', error.message);
      alert('Error al actualizar los datos');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Hola, Usuario!</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sección Izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Cédula</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              >
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Lugar de Nacimiento</label>
              <input
                type="text"
                name="lugarNacimiento"
                value={formData.lugarNacimiento}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Fecha de Nacimiento</label>
              <input
                type="date"
                name="nacimiento"
                value={formData.nacimiento}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              />
            </div>
          </div>

          {/* Sección Derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Dirección de Envío</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Usuario</label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Tema Literario de Preferencia 1</label>
              <select
                name="preferencia1"
                value={formData.preferencia1}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              >
                <option>Ciencia Ficción</option>
                <option>Drama</option>
                <option>Aventura</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Tema Literario de Preferencia 2</label>
              <select
                name="preferencia2"
                value={formData.preferencia2}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              >
                <option>Ciencia Ficción</option>
                <option>Drama</option>
                <option>Aventura</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección Cambio de Contraseña */}
        <div className="mt-6 p-4 border rounded-md bg-gray-100">
          <h3 className="font-semibold">CAMBIO DE CONTRASEÑA</h3>
          <p className="text-xs text-gray-600 mb-2">
            Contraseña actual (déjalo en blanco para no cambiarla)
          </p>
          <input
            type="password"
            name="passwordActual"
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
          />
          <p className="text-xs text-gray-600 mt-2">
            Nueva contraseña (déjalo en blanco para no cambiarla)
          </p>
          <input
            type="password"
            name="passwordNueva"
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
          />
          <p className="text-xs text-gray-600 mt-2">
            Confirmar nueva contraseña (déjalo en blanco para no cambiarla)
          </p>
          <input
            type="password"
            name="passwordConfirmar"
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-6">
          <button className="bg-gray-400 text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">
            CANCELAR
          </button>
          <button type="submit" className="bg-orange-400 text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">
            GUARDAR CAMBIOS
          </button>
        </div>
      </form>
    </div>
  );
};

export default withAuth(EditProfile);


