"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

interface EditPasswordProps {
  userId: number | null;
  userEmail: string; // Nuevo prop para el email del usuario
}

const EditPassword = ({ userId, userEmail }: EditPasswordProps) => {
  const router = useRouter();
  
  // Estados para mostrar/ocultar contraseñas
  const [showPasswordActual, setShowPasswordActual] = useState(false);
  const [showPasswordNueva, setShowPasswordNueva] = useState(false);
  const [showPasswordConfirmar, setShowPasswordConfirmar] = useState(false);
  
  // Estados para manejo de errores y mensajes
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: ""
  });

  // Función para verificar la contraseña actual
  const verifyCurrentPassword = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.jwt) {
        return true;
      } else {
        throw new Error(data.error?.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error("Error verificando contraseña:", error);
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError("Error al verificar la contraseña actual");
      }
      return false;
    }
  };

  // Función para actualizar la contraseña
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

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value.trim();

    // Validar coincidencia de contraseñas
    if (name === "passwordNueva" || name === "passwordConfirmar") {
      const newPassword = name === "passwordNueva" ? formattedValue : formData.passwordNueva;
      const confirmPassword = name === "passwordConfirmar" ? formattedValue : formData.passwordConfirmar;

      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden");
      } else {
        setPasswordError(null);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError(null);
    setMessage(null);

    try {
      // 1. Validaciones básicas
      if (!formData.passwordActual) {
        throw new Error("Debes ingresar tu contraseña actual");
      }

      if (!formData.passwordNueva) {
        throw new Error("Debes ingresar una nueva contraseña");
      }

      if (formData.passwordNueva.length < 8) {
        throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
      }

      if (formData.passwordNueva !== formData.passwordConfirmar) {
        throw new Error("Las contraseñas no coinciden");
      }

      // 2. Verificar contraseña actual
      const isPasswordValid = await verifyCurrentPassword(userEmail, formData.passwordActual);
      if (!isPasswordValid) {
        // El error ya fue establecido por verifyCurrentPassword
        return;
      }

      // 3. Validar que tenemos userId
      if (!userId) {
        throw new Error("No se pudo identificar al usuario");
      }

      // 4. Actualizar contraseña
      const success = await updatePassword(userId, formData.passwordNueva);
      if (!success) {
        throw new Error("Error al actualizar la contraseña");
      }

      // Éxito
      setMessage("Contraseña actualizada correctamente");
      setFormData({
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: ""
      });
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        setPasswordError(error.message);
      } else {
        setPasswordError("Ocurrió un error al cambiar la contraseña");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Sección Cambio de Contraseña */}
      <form onSubmit={handleSubmit}>
        <div className="mt-6 p-4 border rounded-md bg-gray-100">
          <h3 className="font-semibold">CAMBIO DE CONTRASEÑA</h3>
          
          {/* Mensajes de error/éxito */}
          {passwordError && (
            <div className="text-red-500 text-sm mb-2">{passwordError}</div>
          )}
          {message && (
            <div className="text-green-500 text-sm mb-2">{message}</div>
          )}
          
          <p className="text-xs text-gray-600 mb-2">
            Contraseña actual
          </p>
          <div className="relative">
            <input
              type={showPasswordActual ? "text" : "password"}
              name="passwordActual"
              value={formData.passwordActual}
              onChange={handleChange}
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPasswordActual(!showPasswordActual)}
            >
              {showPasswordActual ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <p className="text-xs text-gray-600 mt-2">
            Nueva contraseña
          </p>
          <div className="relative">
            <input
              type={showPasswordNueva ? "text" : "password"}
              name="passwordNueva"
              value={formData.passwordNueva}
              onChange={handleChange}
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPasswordNueva(!showPasswordNueva)}
            >
              {showPasswordNueva ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <p className="text-xs text-gray-600 mt-2">
            Confirmar nueva contraseña
          </p>
          <div className="relative">
            <input
              type={showPasswordConfirmar ? "text" : "password"}
              name="passwordConfirmar"
              value={formData.passwordConfirmar}
              onChange={handleChange}
              className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-500"
              onClick={() => setShowPasswordConfirmar(!showPasswordConfirmar)}
            >
              {showPasswordConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        {/* Botones */}
        <div className="flex justify-end w-full gap-4 mt-6">
          <button 
            type="button" 
            className="bg-blue-500 text-white px-4 py-1 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => router.push("/routes/editprofile")}
            disabled={isLoading}
          >
            CANCELAR
          </button>
          <button 
            type="submit" 
            className="bg-orange-500 text-white px-4 py-1 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "PROCESANDO..." : "CAMBIAR CONTRASEÑA"}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditPassword;