"use client";
import { useState, useEffect } from "react";
import withAuth from '@/components/withAuth';
import { fetchUserData, putUserData } from "@/services/userCRUD";

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
    const handleCancelar = () => {
      router.push('/loginHome');  // Redirecciona a la página "About"
    };
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
          preferencia1: userData.TemaL_1 ,
          preferencia2: userData.TemaL_2 ,
          passwordActual: "",
          passwordNueva: "",
          passwordConfirmar: "",
        });
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log("Campo cambiado:", e.target.name, "Nuevo valor:", e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos guardados:", formData);
    const userData = await fetchUserData();
    try {
        // Crear una copia de formData sin los campos no deseados
        const updatedUserData = {
          "username":formData.usuario,
          "email":formData.email,
          "Nombre":formData.nombre,
          "Apellido":formData.apellido,
          "cedula":formData.cedula,
          "Genero":formData.genero,
          "Fecha_nacimiento":formData.nacimiento,
          "Lugar_nacimiento":formData.lugarNacimiento,
          "TemaL_1":formData.preferencia1,
          "TemaL_2":formData.preferencia2,
          "Direccion":formData.direccion,
        };
      const actualizado = await putUserData(updatedUserData);
      console.log('Usuario actualizado:', actualizado);
    } catch (error) {
    console.error('Error:', error.message);
    alert('Error al actualizar los datos');
    }
  };
  const userString = localStorage.getItem('user'); // Obtener el objeto user como cadena JSON
  const user = JSON.parse(userString); // Parsear la cadena JSON a un objeto
  const userName = user.username; // Acceder al campo id
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Hola, {userName}</h2>

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
                <option value="Ficción">Ficción</option>
                <option value="No ficción">No ficción</option>
                <option value="Novela">Novela</option>
                <option value="Cuentos">Cuentos</option>
                <option value="Poesía">Poesía</option>
                <option value="Biografías y autobiografías">Biografías y autobiografías</option>
                <option value="Ensayos">Ensayos</option>
                <option value="Historia">Historia</option>
                <option value="Ciencia">Ciencia</option>
                <option value="Psicología y desarrollo personal">Psicología y desarrollo personal</option>
                <option value="Filosofía">Filosofía</option>
                <option value="Negocios y economía">Negocios y economía</option>
                <option value="Autoayuda y motivación">Autoayuda y motivación</option>
                <option value="Salud y bienestar">Salud y bienestar</option>
                <option value="Religión y espiritualidad">Religión y espiritualidad</option>
                <option value="Educación y pedagogía">Educación y pedagogía</option>
                <option value="Tecnología e informática">Tecnología e informática</option>
                <option value="Viajes y turismo">Viajes y turismo</option>
                <option value="Gastronomía y cocina">Gastronomía y cocina</option>
                <option value="Arte y fotografía">Arte y fotografía</option>
                <option value="Literatura infantil">Literatura infantil</option>
                <option value="Literatura juvenil">Literatura juvenil</option>
                <option value="Misterio y suspense">Misterio y suspense</option>
                <option value="Novela policíaca">Novela policíaca</option>
                <option value="Fantasía épica">Fantasía épica</option>
                <option value="Distopía">Distopía</option>
                <option value="Romance contemporáneo">Romance contemporáneo</option>
                <option value="Romance histórico">Romance histórico</option>
                <option value="Horror y terror">Horror y terror</option>
                <option value="Género gótico">Género gótico</option>
                <option value="Novela histórica">Novela histórica</option>
                <option value="Filosofía oriental">Filosofía oriental</option>
                <option value="Mitología y folclore">Mitología y folclore</option>
                <option value="Cómics y novelas gráficas">Cómics y novelas gráficas</option>
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
                <option value="Ficción">Ficción</option>
                <option value="No ficción">No ficción</option>
                <option value="Novela">Novela</option>
                <option value="Cuentos">Cuentos</option>
                <option value="Poesía">Poesía</option>
                <option value="Biografías y autobiografías">Biografías y autobiografías</option>
                <option value="Ensayos">Ensayos</option>
                <option value="Historia">Historia</option>
                <option value="Ciencia">Ciencia</option>
                <option value="Psicología y desarrollo personal">Psicología y desarrollo personal</option>
                <option value="Filosofía">Filosofía</option>
                <option value="Negocios y economía">Negocios y economía</option>
                <option value="Autoayuda y motivación">Autoayuda y motivación</option>
                <option value="Salud y bienestar">Salud y bienestar</option>
                <option value="Religión y espiritualidad">Religión y espiritualidad</option>
                <option value="Educación y pedagogía">Educación y pedagogía</option>
                <option value="Tecnología e informática">Tecnología e informática</option>
                <option value="Viajes y turismo">Viajes y turismo</option>
                <option value="Gastronomía y cocina">Gastronomía y cocina</option>
                <option value="Arte y fotografía">Arte y fotografía</option>
                <option value="Literatura infantil">Literatura infantil</option>
                <option value="Literatura juvenil">Literatura juvenil</option>
                <option value="Misterio y suspense">Misterio y suspense</option>
                <option value="Novela policíaca">Novela policíaca</option>
                <option value="Fantasía épica">Fantasía épica</option>
                <option value="Distopía">Distopía</option>
                <option value="Romance contemporáneo">Romance contemporáneo</option>
                <option value="Romance histórico">Romance histórico</option>
                <option value="Horror y terror">Horror y terror</option>
                <option value="Género gótico">Género gótico</option>
                <option value="Novela histórica">Novela histórica</option>
                <option value="Filosofía oriental">Filosofía oriental</option>
                <option value="Mitología y folclore">Mitología y folclore</option>
                <option value="Cómics y novelas gráficas">Cómics y novelas gráficas</option>
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
          {/* sacar este boton de aqui para poder cancelar la edición del usuario */}
          <button className="bg-gray-400 text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer" >
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


