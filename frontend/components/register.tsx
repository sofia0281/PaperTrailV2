"use client";
import { Mail, Lock, Calendar, User } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createUser} from "@/services/userCRUD";
const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    genero: "",
    fechaNacimiento: "",
    lugarNacimiento: "",
    direccion: "",
    email: "",
    usuario: "",
    password: "",
    confirmarPassword: "",
    temaLiterario1: "",
    temaLiterario2: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log("Campo cambiado:", e.target.name, "Nuevo valor:", e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Crear una copia de formData sin los campos no deseados
        const createUserData = {
          "username":formData.usuario,
          "password":formData.password,
          "email":formData.email,
          "Nombre":formData.nombre,
          "Apellido":formData.apellido,
          "cedula":formData.cedula,
          "Genero":formData.genero,
          "Fecha_nacimiento":formData.fechaNacimiento,
          "Lugar_nacimiento":formData.lugarNacimiento,
          "TemaL_1":formData.temaLiterario1,
          "TemaL_2":formData.temaLiterario2,
          "Direccion":formData.direccion,
          "resetPasswordToken":"null",
          "confirmationToken":"null",
          "confirmed":true,
          "blocked":true,
          "role":null,
          "provider":"null"
        };
      const creado = await createUser(createUserData);
      console.log('Usuario creado:', creado);
    } catch (error) {
    console.error('Error:', error.message);
    alert('Error al actualizar los datos');
    }
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sección izquierda - Logo, Beneficios */}
      <div className="w-full md:w-3/5 bg-[#3C88A3] flex flex-col items-center justify-center p-6 md:p-10 text-white md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <Image 
          src="/img/icono.png"
          alt="Logo" 
          width={150} 
          height={150} 
          className="md:w-[180px] md:h-[180px]"
        />
        <div className="border border-orange-400 p-4 md:p-6 rounded-md mt-6 text-center md:text-left">
          <h2 className="text-lg font-semibold">
            Beneficios de comprar en <span className="text-orange-400">PaperTrail.com</span>
          </h2>
          <div className="mt-4 space-y-3">
            <p className="flex items-center justify-center md:justify-start"><span className="mr-2">💳</span> Múltiples medios de pago</p>
            <p className="flex items-center justify-center md:justify-start"><span className="mr-2">✅</span> Garantía de devolución</p>
            <p className="flex items-center justify-center md:justify-start"><span className="mr-2">🚚</span> Envíos a todo Colombia</p>
          </div>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-orange-400 mb-6 text-center">CREAR UN USUARIO</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inputs en dos columnas desde móviles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
                placeholder="Tu nombre"
                required
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
                placeholder="Tu apellido"
                required
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
                placeholder="Tu cédula"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
                required
              >
                <option value="">Selecciona tu género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium">Fecha de nacimiento</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <Calendar size={18} className="text-gray-500 mr-2" />
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="flex-1 outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Lugar de nacimiento */}
          <div>
            <label className="block text-sm font-medium">Lugar de Nacimiento</label>
            <input
              type="text"
              name="lugarNacimiento"
              value={formData.lugarNacimiento}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              placeholder="Ciudad o país"
              required
            />
          </div>

          {/* Dirección de envío */}
          <div>
            <label className="block text-sm font-medium">Dirección de envío</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
              placeholder="Tu dirección"
              required
            />
          </div>

          {/* Correo electrónico y usuario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Correo Electrónico</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <Mail size={18} className="text-gray-500 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm"
                  placeholder="Tu correo"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Usuario</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <User size={18} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm"
                  placeholder="Tu usuario"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contraseña y validar contraseña */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Contraseña</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <Lock size={18} className="text-gray-500 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm"
                  placeholder="Tu contraseña"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Validar Contraseña</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <Lock size={18} className="text-gray-500 mr-2" />
                <input
                  type="password"
                  name="confirmarPassword"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm"
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>
            </div>
          </div>

          {/* Preferencias literarias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Tema Literario de preferencia 1</label>
              <select
                name="temaLiterario1"
                value={formData.temaLiterario1}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
                required
              >
                <option value="">Selecciona un tema</option>
                <option value="ficcion">Ficción</option>
                <option value="no-ficcion">No Ficción</option>
                <option value="fantasia">Fantasía</option>
                <option value="ciencia">Ciencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Tema Literario de preferencia 2</label>
              <select
                name="temaLiterario2"
                value={formData.temaLiterario2}
                onChange={handleChange}
                className="w-full border rounded-md p-2 mt-1 outline-none text-sm"
                required
              >
                <option value="">Selecciona un tema</option>
                <option value="ficcion">Ficción</option>
                <option value="no-ficcion">No Ficción</option>
                <option value="fantasia">Fantasía</option>
                <option value="ciencia">Ciencia</option>
              </select>
            </div>
          </div>

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer"
          >
            Registrarse
          </button>
        </form>
          <p className="text-xs text-gray-600 text-center mt-4">
            ¿Ya tienes una cuenta? <span className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline transition-colors duration-300" onClick={()=>router.push("/login")}>INICIA SESIÓN</span>
          </p>
        </div>
      </div>
  );
};

export default Register;
