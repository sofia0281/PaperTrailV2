"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdmin } from '@/services/adminCRUD';
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import withAuthROOT from '@/components/withAuthROOT';

const CreateAdmin = () => {
  const router = useRouter()
  {/*Estados para la ventana emergente */}
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
    // confirmarPassword: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "nombre" || name === "apellido" || name === "lugarNacimiento") {
      formattedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, ""); // Solo letras y espacios
    }

    if (name === "cedula") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10); // Solo números, máximo 10 dígitos
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Crear una copia de formData sin los campos no deseados
        const createAdminData = {
          "username":formData.usuario,
          "password":formData.password,
          "email":formData.email,
          "Nombre":formData.nombre,
          "Apellido":formData.apellido,
          "cedula":formData.cedula,
          "Genero":formData.genero,
          "Fecha_nacimiento":formData.fechaNacimiento,
          "Lugar_nacimiento":formData.lugarNacimiento,
          "Direccion":formData.direccion,
          "resetPasswordToken":null,
          "confirmationToken":null,
          "confirmed":true,
          "blocked":false,
          "role":null,
          "provider":null
        };
      const creado = await createAdmin(createAdminData);
      console.log('Usuario creado:', creado);
      
      setSuccessMessage("Usuario creado exitosamente.");
      setErrorMessage(null);
      setTimeout(() => {
        setSuccessMessage(null);
        router.push("/routes/gestionroot");
      }, 3000);

    } catch (error) {
      //console.error('Error:', error.message);
      setErrorMessage("Error al crear usuario.");
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 3000);
    }

  }
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
        {/* Notificación emergente */}
        {(successMessage || errorMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-17 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/3 h-auto flex items-center z-20 justify-between px-8 py-5 rounded-lg shadow-lg text-white text-sm ${
              successMessage ? "bg-orange-500" : "bg-black"
            }`}
          >
            <span>{successMessage || errorMessage}</span>
            <XCircle
              size={22}
              className="cursor-pointer hover:text-gray-200"
              onClick={() => {
                setSuccessMessage(null);
                setErrorMessage(null);
              }}
            />
          </motion.div>
        )} 
        {/* Separador */}
        <div className="hidden md:block w-px bg-gray-300 h-full"></div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Columna 1 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Nombre</label>
            <input 
            type="text"
            pattern="[A-Za-z]+"
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Apellido</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Fecha de nacimiento</label>
            <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Lugar de nacimiento</label>
            <input type="text" name="lugarNacimiento" value={formData.lugarNacimiento} onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          {/* Columna 2 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Cédula</label>
            <input type="text"
              name="cedula"
              value={formData.cedula} onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-medium">Género</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Selecciona tu género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            <label className="block text-sm font-semibold">Correo</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>

          {/* Columna 3 */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold">Usuario</label>
            <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            {/* Botón de Enviar */}
            <button type="submit" className="cursor-pointer w-full bg-orange-500 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105">
              CREAR ADMINISTRADOR
            </button>
            <button 
            type="button" 
            className="cursor-pointer w-full bg-blue-500 text-white py-2 rounded-md mt-2 transition-transform duration-300 transform hover:scale-105"
            onClick={() => router.push("/routes/gestionroot")}>
              CANCELAR
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default withAuthROOT(CreateAdmin);