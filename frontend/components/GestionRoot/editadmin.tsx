
"use client";
import { useState, useEffect } from "react";
import withAuthROOT from '@/components/Auth/withAuthROOT';
import { getAdminData, putAdminData } from "@/services/adminCRUD";
import { putUsuarioAdminData } from '@/services/usuarioAdminCRUD';
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const EditAdmin =  ({ adminID }: { adminID: number }) => {

  const router = useRouter();

  {/*Estados para las ventanas de confirmación */}
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


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
    
    const { name, value } = e.target;

    let formattedValue = value;

    // Validación para fecha de nacimiento
    if (name === "fechaNacimiento") {
      const selectedDate = new Date(value);
      const minDate = new Date("2006-01-01"); // Fecha mínima (1 de enero de 2006)
      
      if (selectedDate > minDate) {
        // Si la fecha seleccionada es posterior a 2006, mostrar error
        setMessage("Debes tener al menos 18 años (nacido antes de 2006)");
        setTimeout(() => setMessage(null), 3000);
        return; // No actualizar el estado
      }
      
      formattedValue = value; // Aceptar la fecha si es válida
    }

    if (name === "nombre" || name === "apellido" || name === "lugarNacimiento") {
      formattedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, "") // Solo letras y espacios
      .replace(/^\s+/, ""); 
    }

    if (name === "cedula") {
      formattedValue = value.replace(/\D/g, "").slice(0, 10) // Solo números, máximo 10 dígitos
      .replace(/^\s+/, "")
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    try {
      const updatedUserData = {
        "username": formData.usuario,
        "email": formData.correo,
        "Nombre": formData.nombre,
        "Apellido": formData.apellido,
        "cedula": formData.cedula,
        "Genero": formData.genero,
        "Fecha_nacimiento": formData.fechaNacimiento,
        "Lugar_nacimiento": formData.lugarNacimiento,
        "Direccion": formData.direccion,
        // "password": formData.password 
      };
      await putAdminData(updatedUserData, adminID);
      // await putUsuarioAdminData(updatedUserData);
      setMessage("Administrador editado correctamente");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      // console.error('Error completo:', error);
      const errorMessages = error.errors.map(errorItem => {
        const field = errorItem.path[0];
        if (field === "username")
        {
          return `Este nombre de usuario ya se encuentra registrado`;
        }
        else if (field === "Email"){
          return `Este correo electrónico ya se encuentra registrado`;
        }
        else if (field === "cedula"){
          return `Esta cédula ya se encuentra registrada`;
        }
        return `Error en el  campo ${field}. Error al registrar usuario`;
        
      });
      if (error.status === 400 ) {
        const fullMessage = errorMessages.join('. ');
        setErrorMessage(fullMessage);
        setSuccessMessage(null);
  	    setTimeout(() => {
          setErrorMessage(null);
          // router.push("/routes/login");
        }, 3000);
      } else {
        const fullMessage = errorMessages.join('. ');
        setErrorMessage(fullMessage);
        setSuccessMessage(null);
        setTimeout(() => setErrorMessage(null), 3000);
      }
    }
  };

  useEffect(() => {
    const loadAdminData = async () => {
      const userData = await getAdminData(adminID);
      if (userData) {
        setFormData({
          nombre: userData.Nombre || "",
          apellido: userData.Apellido || "",
          cedula: userData.cedula || "",
          genero: userData.Genero || "",
          fechaNacimiento: userData.Fecha_nacimiento || "",
          lugarNacimiento: userData.Lugar_nacimiento || "",
          direccion: userData.Direccion || "",
          correo: userData.email || "",
          usuario: userData.username || "",
          password: userData.password || ""
        });
      }
    };
    loadAdminData();
  }, []);
  
  return (
    <div className="flex w-full max-w-5xl mx-auto p-6 justify-center">
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

            {/* <label className="block text-sm font-semibold">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" /> */}

            {/* Botón de Enviar */}
            <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer">
              EDITAR ADMINISTRADOR
            </button>
            <button 
              type="button" 
              className="w-full bg-blue-500 text-white py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={()=>router.push("/routes/gestionroot")}>
              CANCELAR
            </button>
          </div>
        </form>

      </div>
        {/* Modal de confirmación */}
        {showConfirm && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 text-center border z-50">
          <p className="text-lg font-semibold">¿Deseas continuar con los cambios?</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm" onClick={() => setShowConfirm(false)}>
              Cancelar
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm" onClick={confirmSubmit}>
              Sí, editar
            </button>
          </div>
        </div>
      )}
      {/* Notificación emergente */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-orange-500 text-white p-6 rounded-lg shadow-lg text-center text-sm z-50 flex items-center justify-between"
        >
          <span className="flex-1 text-center">{message}</span>
          <XCircle size={20} className="cursor-pointer hover:text-gray-200" onClick={() => setMessage(null)} />
        </motion.div>
      )}
    </div>
  );
};

export default withAuthROOT(EditAdmin);