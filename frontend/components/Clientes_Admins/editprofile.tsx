"use client";
import { useState, useEffect } from "react";
import withAuth from '@/components/Auth/withAuth';
import { fetchUserData, putUserData } from "@/services/userCRUD";
import { putUsuarioData } from "@/services/usuarioCRUD";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import EditPassword from "@/components/Clientes_Admins/editpassword";
import { AutocompleteLocation } from "@/components/ui/register/AutocompleteLocation";

const EditProfile = () => {
  const maxLengths: Record<string, number> = {
    nombre: 20,
    apellido: 30,
    direccion: 80,
    email: 30,
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

  const router = useRouter();
  const role = localStorage.getItem("role");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const[SeccionMenu, setSeccionMenu] = useState("Principal")

  const [userId, setUserId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


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

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setUserId(userData.id);
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
          preferencia1: userData.TemaL_1 || "",
          preferencia2: userData.TemaL_2 || "",
          passwordActual: "",
          passwordNueva: "",
          passwordConfirmar: "",
        });
      }
    };

    loadUserData();
  }, []);
  const [EmailError, setEmailError] = useState<string | null>(null);

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
  const updatePassword = async (userId: number, newPassword: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_STRAPI_ADMIN_TOKEN}`
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error detallado:", data);
        throw new Error(data.error?.message || "Error al actualizar contraseña");
      }

      return true;
    } catch (error) {
      console.error("Error completo:", error);
      return false;
    }
  };

  const handlePasswordChange = async () => {
    if (!userId) return;

    // Validaciones
    if (formData.passwordNueva && formData.passwordNueva.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (formData.passwordNueva !== formData.passwordConfirmar) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    try {
      const success = await updatePassword(userId, formData.passwordNueva);
      if (success) {
        setMessage("Contraseña actualizada correctamente");
        setPasswordError(null);
        // Limpiar campos
        setFormData(prev => ({
          ...prev,
          passwordActual: "",
          passwordNueva: "",
          passwordConfirmar: ""
        }));
      } else {
        setPasswordError("Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);
      setPasswordError("Ocurrió un error al cambiar la contraseña");
    }
  };


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

    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nacimiento === "fechaNacimiento") {
      const selectedDate = new Date(formData.nacimiento);
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
      const updatedUserData = {
        username: formData.usuario,
        email: formData.email,
        Nombre: formData.nombre,
        Apellido: formData.apellido,
        cedula: formData.cedula,
        Genero: formData.genero,
        Fecha_nacimiento: formData.nacimiento,
        Lugar_nacimiento: formData.lugarNacimiento,
        TemaL_1: formData.preferencia1,
        TemaL_2: formData.preferencia2,
        Direccion: formData.direccion,
        // password: formData.passwordConfirmar,
      };

      await putUsuarioData(updatedUserData)
      try {
                
                const actualizado = await putUserData(updatedUserData);
                console.log('Usuario actualizado en tabla user:', actualizado);
                setSuccessMessage("Usuario editado exitosamente.");
                setErrorMessage(null);
                setTimeout(() => {
                    setSuccessMessage(null);
                    // router.push("/routes/login");
                }, 3000);
      } catch (userError) {
        console.error('Error al EDITAR en tabla user:', userError);
        
        setSuccessMessage("Update completado con observaciones");
        setErrorMessage(null);
        setTimeout(() => {
            setSuccessMessage(null);
            // router.push("/routes/login");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Error:", error.message);
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

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const user_Name = user?.username;

  return (
    <div className="flex justify-center gap-2 p-4">


{/*--------------------Menu lateral de edición de perfil-------------------- */}
      <div className="items-center max-w-xl p-6 bg-white shadow-md rounded-md">
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
        <div className="text-gray-400 border-b border-gray pb-1 hover:border-black hover:text-black">
                  <p className="cursor-pointer "
                  onClick={()=>{
                      router.push('/routes/editprofile')
                      setSeccionMenu("Principal")
                  }}>Editar perfil </p>
          </div>
          <div className="mt-4 text-gray-400 border-b border-gray pb-1 hover:border-black hover:text-black">
                  <p className="cursor-pointer"
                  onClick={()=>{
                    setSeccionMenu("Password")
                  }}>Cambiar contraseña </p>
          </div>
      </div>
{/*--------------------Menu lateral de edición de perfil-------------------- */}

    <div className="max-w-6xl p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Hola, {user_Name} </h2>
      {SeccionMenu === "Principal" ? (
      <>
      <p className="text-xs text-gray-400 text-center mt-4">Los campos con (<span className="text-red-500">*</span>) son editables.</p>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 ">
          {/* Sección Izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nombre <span className="text-red-500">*</span></label>
              <input
                required
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Apellido <span className="text-red-500">*</span></label>
              <input
                required
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"               />
            </div>
            <div>
              <label className="block text-sm font-medium">Cédula</label>
              <input
                required
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange} 
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"               
                />
            </div>
            <div>
              <label className="block text-sm font-medium">Género <span className="text-red-500">*</span></label>
              <select
                required
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option>Masculino</option>
                <option>Femenino</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
            <label className="block text-sm font-semibold">Lugar de nacimiento</label>
                <AutocompleteLocation
                          value={formData.lugarNacimiento}
                          onChange={(value) => setFormData({...formData, lugarNacimiento: value})}
                          placeholder="Lugar de nacimiento"
                          required
            />
            </div>
            <div>
            <label className="block text-sm font-semibold">Fecha de nacimiento</label>
            <input 
              min={minDate}
              max={maxDate}
              type="date" 
              name="fechaNacimiento" 
              value={formData.nacimiento} 
              onChange={handleChange} 
              onBlur={handleBlur} // Llamar a handleBlur al perder el foco
              className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>

          {/* Sección Derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Dirección de Envío <span className="text-red-500">*</span></label>
              <input
                required
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"               />
            </div>
            <div>
              <label className="block text-sm font-medium">Correo Electrónico</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange} 
                onBlur={handleBlur} // Llamar a handleBlur al perder el foco
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                onInput={(e) => e.target.value = e.target.value.replace(/\s+/g, "")} />
                {EmailError && <p className="text-red-500 text-sm">{EmailError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Usuario</label>
              <input
                required
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange} 
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
            </div>
            <div>
            {role && role.toString().replace(/"/g, '') === "Authenticated" && (
                <>
              <label className="block text-sm font-medium">Tema Literario de Preferencia 1 <span className="text-red-500">*</span></label>
              <select
                required
                name="preferencia1"
                value={formData.preferencia1}
                onChange={handleChange}
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
              </>
                )}
            </div>
            <div>
            {role && role.toString().replace(/"/g, '') === "Authenticated" && (
                <>
              <label className="block text-sm font-medium">Tema Literario de Preferencia 2 <span className="text-red-500">*</span></label>
              <select
                required
                name="preferencia2"
                value={formData.preferencia2}
                onChange={handleChange}
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
              </>
                )}
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end w-full gap-4 mt-6">
          {/* sacar este boton de aqui para poder cancelar la edición del usuario */}
          <button 
          type="button" 
          className="bg-blue-500 text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer"
          onClick={() => router.push("/")}>
            CANCELAR
          </button>
          <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">
            GUARDAR CAMBIOS
          </button>
        </div>
      </form>
      {/* Modal de confirmación */}
      {showConfirm && (
        <>
        <div className="fixed inset-0 bg-black/50 z-40"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 text-center border z-50 ">
          <p className="text-lg font-semibold">¿Deseas continuar con los cambios?</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-400" onClick={() => setShowConfirm(false)}>
              Cancelar
            </button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-orange-600" onClick={confirmSubmit}>
              Sí, editar
            </button>
          </div>
        </div>
        </>
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
{/*-------------------------Cambio de seccion----------------------*/}
  </>) : SeccionMenu === "Password" ? (
    <>
    <EditPassword 
      userId={userId} 
      userEmail={formData.email} // O de donde tengas el email del usuario
    />
    </>
  ): null
  }
    
    </div>
  </div>
)
  ;
};

export default withAuth(EditProfile);