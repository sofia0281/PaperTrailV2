"use client";
import { Mail, Lock, Calendar, User, Eye, EyeOff, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createUser} from "@/services/userCRUD";
import {createUsuario} from "@/services/usuarioCRUD";
import { motion } from "framer-motion";
import { AutocompleteLocation } from "@/components/ui/register/AutocompleteLocation"; // Importación directa desde la misma carpeta
// Importación directa desde la misma carpeta


const Register = () => {

  const maxLengths: Record<string, number> = {
    nombre: 20,
    apellido: 30,
    direccion: 80,
    email: 30,
    usuario: 15,
    password: 20,
    confirmarPassword: 20
  };

  const minDate = "1900-01-01"; // Fecha mínima fija

  // Fecha máxima dinámica (hoy menos 18 años)
  const today = new Date();
  const maxYear = today.getFullYear() - 18;
  const maxMonth = String(today.getMonth() + 1).padStart(2, "0"); // Asegurar formato MM
  const maxDay = String(today.getDate()).padStart(2, "0"); // Asegurar formato DD
  const maxDate = `${maxYear}-${maxMonth}-${maxDay}`; // Generar fecha máxima exacta

  const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Alternar la visibilidad
  };
  
  {/*Confirmar contraseña en tiempo real */}
  const [passwordError, setPasswordError] = useState<string | null>(null);

  {/*Confirmar correo en tiempo real */}
  const [EmailError, setEmailError] = useState<string | null>(null);

  {/*Estados para la ventana emergente */}
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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
    
    const { name, value } = e.target;

    let formattedValue = value;
    
    if (
      name === "nombre" || 
      name === "apellido" || 
      name === "direccion" || 
      name === "email" || 
      name === "usuario" || 
      name === "password" || 
      name === "confirmarPassword"
    ) {
      if (name === "email") {
        // Para el campo email, eliminar los espacios
        formattedValue = value.replace(/\s+/g, "");

      } else if (name === "password" || name === "confirmarPassword" || name === "usuario") {
        // Para contraseñas, no aplicamos ningún filtro, solo eliminamos espacios al principio y al final
        formattedValue = value.trim();
      } else {
        // Para los otros campos, eliminar caracteres no deseados y los espacios al principio
        formattedValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, "") // Solo letras y espacios
                               .replace(/^\s+/, ""); // Eliminar espacios al principio
      }
    } else if (name === "cedula") {
      // Para el campo cédula, solo permitir números y limitar a 10 dígitos
      formattedValue = value.replace(/\D/g, "").slice(0, 10) // Solo números, máximo 10 dígitos
                             .replace(/^\s+/, ""); // Eliminar espacios al principio
    }
    if(name === "direccion"){
      // Para el campo dirección, eliminar caracteres no deseados y los espacios al principio
      formattedValue = value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s.,#-]/g, "") // Solo letras, números, espacios y caracteres permitidos
                             .replace(/^\s+/, ""); // Eliminar espacios al principio
    }
    // Aplicar límite de longitud a los inputs
    if (maxLengths[name]) {
      formattedValue = formattedValue.slice(0, maxLengths[name]);
    }
    
    // Verificar si las contraseñas coinciden
    if (name === "password" || name === "confirmarPassword") {
      const newPassword = (name === "password" ? formattedValue : formData.password);
      const confirmPassword = (name === "confirmarPassword" ? formattedValue : formData.confirmarPassword);
    
      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden");

      } else {
        setPasswordError(null); // Eliminar mensaje si coinciden
      }
    }
    
    // Validación para fecha de nacimiento
    if (name === "fechaNacimiento") {
      formattedValue = value; // Aceptar la fecha si es válida
    }
    // Actualizar el estado con el valor formateado
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
    
    
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      // Expresión regular para validar el formato del correo
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      // Verificamos si el correo es válido
      if (!emailPattern.test(value)) {
        setEmailError("Por favor, ingresa un correo válido.");
      } else {
        setEmailError(null); // Limpiar mensaje de error si es válido
      }
    }

    if (name === "password" || name === "confirmarPassword") {
      if (value.length < 8) {
        setPasswordError("La contraseña debe tener al menos 8 caracteres");
        setTimeout(() => setPasswordError(null), 3000);
      }else {
        setPasswordError(null); // Limpiar mensaje de error si es válido
      }
    }
    
    const minDate = "1900-01-01";

    // Calcular fecha máxima dinámica (hoy menos 18 años)
    const today = new Date();
    const maxDateObj = new Date(today);
    maxDateObj.setFullYear(today.getFullYear() - 18);
    const maxDate = maxDateObj.toISOString().split("T")[0]; // YYYY-MM-DD
    
    if (name === "fechaNacimiento") {
      const selectedDate = new Date(value);
      const minDateObj = new Date(minDate);
      const selectedDateOnly = new Date(selectedDate.toISOString().split("T")[0]);
      
      if (selectedDateOnly < minDateObj || selectedDateOnly > maxDateObj) {
        setErrorMessage(`Debes tener al menos 18 años (nacido antes del ${maxDate})`);
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const minDate = "1900-01-01";

    // Calcular fecha máxima dinámica (hoy menos 18 años)
    const today = new Date();
    const maxDateObj = new Date(today);
    maxDateObj.setFullYear(today.getFullYear() - 18);
    const maxDate = maxDateObj.toISOString().split("T")[0]; // YYYY-MM-DD
    
    if (formData.fechaNacimiento === "fechaNacimiento") {
      const selectedDate = new Date(formData.fechaNacimiento);
      const minDateObj = new Date(minDate);
      const selectedDateOnly = new Date(selectedDate.toISOString().split("T")[0]);
      
      if (selectedDateOnly < minDateObj || selectedDateOnly > maxDateObj) {
        setErrorMessage(`Debes tener al menos 18 años (nacido antes del ${maxDate})`);
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
    }

    // Verificamos si el correo es válido
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("Por favor, ingresa un correo válido.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    // Validar la longitud de la contraseña
    if (formData.password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmarPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    if (formData.nombre.length < 2) {
      setErrorMessage("El nombre debe tener al menos 2 caracteres.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    if (formData.apellido.length < 2) {
      setErrorMessage("El apellido debe tener al menos 2 caracteres.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    if (formData.cedula.length < 6) {
      setErrorMessage("La cédula debe tener al menos 6 caracteres.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    if (formData.direccion.length < 10) {
      setErrorMessage("La dirección debe tener al menos 10 caracteres.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    if(formData.usuario.length < 4){
      setErrorMessage("El usuario debe tener al menos 4 caracteres.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
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
          "blocked":false,
          "role":null,
          "provider":"null"
        };

        // const creado = await createUser(createUserData);
        // console.log('Usuario creado:', creado);
        const creado2 = await createUsuario(createUserData);
        console.log('Usuario creado:', creado2);
        
        try {
          const creadoUser = await createUser(createUserData);
          console.log('Usuario creado en tabla user:', creadoUser);
          
          setSuccessMessage("Registro completado exitosamente. Pro favor, inicia sesión");
          setErrorMessage(null);
          setTimeout(() => {
              setSuccessMessage(null);
              router.push("/routes/login");
          }, 3000);
          
      } catch (userError) {
          console.error('Error al crear en tabla user:', userError);
          
          setSuccessMessage("Registro completado con observaciones. Por favor inicia sesión.");
          setErrorMessage(null);
          setTimeout(() => {
              setSuccessMessage(null);
              router.push("/routes/login");
          }, 3000);
      }
    } catch (error) {
      // console.error('Error completo:', error);
      const errorMessages = error.errors.map(errorItem => {
        const field = errorItem.path[0];
        if (field === "username")
        {
          return `Este nombre de usuario ya se encuentra registrado`;
        }
        else if (field === "email"){
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
          router.push("/routes/login");
        }, 3000);
      } else {
        const fullMessage = errorMessages.join('. ');
        setErrorMessage(fullMessage);
        setSuccessMessage(null);
        setTimeout(() => setErrorMessage(null), 3000);
      }
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
      <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-6 md:p-10 relative">
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
        <h1 className="text-2xl md:text-3xl font-semibold text-orange-400 mb-2 text-center">CREAR UN USUARIO</h1>
        <p className="text-xs text-gray-400 text-center mb-6">Los campos con (<span className="text-red-500">*</span>) son obligatorios.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inputs en dos columnas desde móviles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nombre <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Apellido <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tu apellido"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Cédula <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tu cédula"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Género <span className="text-red-500">*</span></label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <label className="block text-sm font-medium">Fecha de nacimiento <span className="text-red-500">*</span></label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <Calendar size={18} className="text-gray-500 mr-2" />
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                min={minDate}
                max={maxDate}
                required
              />
            </div>
          </div>

          {/* Lugar de nacimiento */}
          <div>
            <label className="block text-sm font-medium">Ciudad de Nacimiento</label>
            <AutocompleteLocation
              value={formData.lugarNacimiento}
              onChange={(value) => setFormData({...formData, lugarNacimiento: value})}
              placeholder="Lugar de nacimiento"
              required
            />
          </div>

          {/* Dirección de envío */}
          <div>
            <label className="block text-sm font-medium">Dirección de envío <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Tu dirección"
              required
            />
          </div>

          {/* Correo electrónico y usuario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Correo Electrónico <span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-md p-2 mt-1 focus-within:ring-2 focus-within:ring-orange-500">
                <Mail size={18} className="text-gray-500 mr-2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur} // Validar al salir del campo
                  onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, "")} // Elimina espacios en tiempo real
                  className="flex-1 outline-none text-sm"
                  placeholder="Tu correo"
                  required
                />
              </div>
              {EmailError && <p className="text-red-500 text-sm">{EmailError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Usuario <span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-md p-2 mt-1 focus-within:ring-2 focus-within:ring-orange-500">
                <User size={18} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  className="flex-1 outline-none text-sm "
                  placeholder="Tu usuario"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contraseña y validar contraseña */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Contraseña <span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-md p-2 mt-1 focus-within:ring-2 focus-within:ring-orange-500">
                <Lock size={14} className="text-gray-500 mr-1" />
                <input
                  type={showPassword ? "text" : "password"} // Cambiar el tipo según la visibilidad
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur} // Validar al salir del campo
                  className="flex-1 outline-none text-sm"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  >
                  {showPassword ? (
                    <EyeOff size={14} className="text-gray-500" />
                  ) : (
                    <Eye size={14} className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Validar Contraseña <span className="text-red-500">*</span></label>
              <div className="flex items-center border border-gray-200 rounded-md p-2 mt-1 focus-within:ring-2 focus-within:ring-orange-500">
                <Lock size={14} className="text-gray-500 mr-1" />
                <input
                  type={showPassword ? "text" : "password"} // Cambiar el tipo según la visibilidad
                  name="confirmarPassword"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  onBlur={handleBlur} // Validar al salir del campo
                  className="flex-1 outline-none text-sm"
                  placeholder="Repite tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  >
                  {showPassword ? (
                    <EyeOff size={14} className="text-gray-500" />
                  ) : (
                    <Eye size={14} className="text-gray-500" />
                  )}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
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
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
            ¿Ya tienes una cuenta? <span className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline transition-colors duration-300" onClick={()=>router.push("/routes/login")}>INICIA SESIÓN</span>
          </p>
        </div>
      </div>
  );
};

export default Register;