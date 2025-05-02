"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdmin } from '@/services/adminCRUD';
import { createUsuarioAdmin } from '@/services/usuarioAdminCRUD';
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import withAuthROOT from '@/components/Auth/withAuthROOT';
import { AutocompleteLocation } from "@/components/ui/register/AutocompleteLocation";

const CreateAdmin = () => {

  const maxLengths: Record<string, number> = {
    nombre: 20,
    apellido: 30,
    direccion: 80,
    correo: 30,
    usuario: 15,
    password: 20,
    confirmarPassword: 20
  };

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const minDate = "1900-01-01";

  // Calcular fecha máxima dinámica (hoy menos 18 años)
  const today = new Date();
  const maxDateObj = new Date(today);
  maxDateObj.setFullYear(today.getFullYear() - 18);
  const maxDate = maxDateObj.toISOString().split("T")[0]; // YYYY-MM-DD

  const router = useRouter()

  {/*Estados para las ventanas de confirmación */}
  const [showConfirm, setShowConfirm] = useState(false);

    const [EmailError, setEmailError] = useState<string | null>(null);

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
    correo: "",
    usuario: "",
    password: "",
    // confirmarPassword: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    
    const { name, value } = e.target;

    let formattedValue = value;

    if (
      name === "nombre" || 
      name === "apellido" || 
      name === "direccion" || 
      name === "correo" || 
      name === "usuario"
    ) {
      if (name === "correo") {
        // Para el campo email, eliminar los espacios
        formattedValue = value.replace(/\s+/g, "");
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
    if(name === "direccion" || name === "usuario"){
      // Para el campo dirección, eliminar caracteres no deseados y los espacios al principio
      formattedValue = value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s.,#-]/g, "") // Solo letras, números, espacios y caracteres permitidos
                             .replace(/^\s+/, ""); // Eliminar espacios al principio
    }
    // Aplicar límite de longitud a los inputs
    if (maxLengths[name]) {
      formattedValue = formattedValue.slice(0, maxLengths[name]);
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

    if (name === "correo") {
      
      // Verificamos si el correo es válido
      if (!emailPattern.test(value)) {
        setEmailError("Por favor, ingresa un correo válido.");
      } else {
        setEmailError(null); // Limpiar mensaje de error si es válido
      }
    }
    
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
    setShowConfirm(true);
  };

  const ConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    if (!emailPattern.test(formData.correo)) {
      setErrorMessage("Por favor, ingresa un correo válido.");
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
    setShowConfirm(false);
    try {
        // Crear una copia de formData sin los campos no deseados
        const createAdminData = {
          "username":formData.usuario,
          "password":formData.password,
          "email":formData.correo,
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
      
      await createUsuarioAdmin(createAdminData);


      
try {
          const creadoUser =await createAdmin(createAdminData);;
          console.log('Usuario  admin creado en tabla user:', creadoUser);
          setSuccessMessage("Registro  de administrador completado exitosamente");
          setErrorMessage(null);
          setTimeout(() => {
              setSuccessMessage(null);
              router.push('/routes/gestionroot')
          }, 3000);
          
        } catch (userError) {
          console.error('Error al crear el admin  en tabla user:', userError);
          
          setSuccessMessage("Registro completado con observaciones");
          setErrorMessage(null);
          setTimeout(() => {
              setSuccessMessage(null);
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
            <input 
            min={minDate}
            max={maxDate}
            type="date" 
            name="fechaNacimiento" 
            value={formData.fechaNacimiento} 
            onChange={handleChange} 
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />

            <label className="block text-sm font-semibold">Lugar de nacimiento</label>
                        <AutocompleteLocation
                          value={formData.lugarNacimiento}
                          onChange={(value) => setFormData({...formData, lugarNacimiento: value})}
                          placeholder="Lugar de nacimiento"
                          required
                        />
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
            <input type="email" 
            name="correo" 
            value={formData.correo} 
            onChange={handleChange}
            onBlur={handleBlur} 
            onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, "")}
              className={"border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" + (EmailError ? " border-red-500" : "")} />
            {EmailError && <p className="text-red-500 text-sm">{EmailError}</p>}
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
            <button type="submit" className="cursor-pointer w-full bg-orange-500 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:bg-orange-600 active:scale-95">
              CREAR ADMINISTRADOR
            </button>
            <button 
            type="button" 
            className="cursor-pointer w-full bg-blue-500 text-white py-2 rounded-md mt-2 transition-transform duration-300 transform hover:bg-blue-600 active:scale-95"
            onClick={() => router.push("/routes/gestionroot")}>
              CANCELAR
            </button>
          </div>
        </form>
        
      </div>
              {/* Modal de confirmación */}
              {showConfirm && (
        <>
        <div className="fixed inset-0 bg-black/50 z-40"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 text-center border z-50">
          <p className="text-lg font-semibold">¿Deseas continuar con los cambios?</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-400 active:scale-95" onClick={() => setShowConfirm(false)}>
              Cancelar
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-orange-600 active:scale-95" onClick={ConfirmSubmit}>
              Sí, editar
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default withAuthROOT(CreateAdmin);