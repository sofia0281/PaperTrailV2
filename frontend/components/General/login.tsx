"use client";
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginUser } from '@/services/userCRUD';
import { useAuth } from '@/context/AuthContext';



console.log("URL del backend:", process.env.NEXT_PUBLIC_BACKEND_URL);

const Login = () => {
  const { setAuthToken, setAuthRole, setUserData } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [EmailError, setEmailError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Configuración de validación
  const maxLengths = {
    email: 30,
    password: 20
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailError(emailPattern.test(value) ? null : "Por favor, ingresa un correo válido.");
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "email") {
      formattedValue = value.replace(/\s+/g, "");
    } else if (name === "password") {
      formattedValue = value.trim();
    }

    if (maxLengths[name]) {
      formattedValue = formattedValue.slice(0, maxLengths[name]);
    }

    name === "email" ? setEmail(formattedValue) : setPassword(formattedValue);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const { jwt, user } = await loginUser(email, password);
      
      if (!jwt || !user) {
        throw new Error("Credenciales incorrectas");
      }
  
      // Guardar datos en localStorage (sin cambios)
      localStorage.setItem("authToken", jwt);
      localStorage.setItem("user", JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role?.name || user.role?.data?.attributes?.name,
        ...user
      }));
  
      // Actualizar contexto (modificado para evitar el error)
      setAuthToken(jwt);
      if (setAuthRole) {
        setAuthRole(user.role?.name || user.role?.data?.attributes?.name);
      }
      
      // Si no existe setUserData, lo omitimos
      try {
        if (setUserData) {
          setUserData(user);
        }
      } catch (e) {
        console.log("setUserData no está disponible en el contexto");
      }
  
      window.dispatchEvent(new Event("userLoggedIn"));
  
      // Redirección (sin cambios)
      const role = user.role?.name || user.role?.data?.attributes?.name;
      switch(role) {
        case "Admin":
          router.push("/routes/adminbooks");
          break;
        case "ROOT":
          router.push("/routes/gestionroot");
          break;
        default:
          router.push("/routes/loginHome");
      }
  
    } catch (error) {
      console.error("Error completo:", error);
      setMessage(error.message || "Error al conectar con el servidor");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sección izquierda - Logo, Beneficios */}
      <div className="w-full md:w-3/5 bg-[#3C88A3] flex flex-col items-center justify-center p-6 md:p-10 text-white">
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
            <p className="flex items-center justify-center md:justify-start">
              <span className="mr-2">💳</span> Múltiples medios de pago
            </p>
            <p className="flex items-center justify-center md:justify-start">
              <span className="mr-2">✅</span> Garantía de devolución
            </p>
            <p className="flex items-center justify-center md:justify-start">
              <span className="mr-2">🚚</span> Envíos a todo Colombia
            </p>
          </div>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-orange-400 mb-6 text-center">
          TE DAMOS LA BIENVENIDA
        </h1>

        <form className="w-full max-w-xs md:max-w-sm space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium">Correo Electrónico</label>
            <div className="flex items-center border border-gray-200 rounded-md p-2 mt-1 focus-within:ring-2 focus-within:ring-orange-500">
              <Mail size={18} className="text-gray-500 mr-2" />
              <input 
                type="email"
                className="flex-1 outline-none text-sm"
                name="email"
                placeholder="Tu correo"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/\s+/g, "");
                }}
                required
              />
            </div>
            {EmailError && <p className="text-red-500 text-sm">{EmailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <div className="flex items-center border border-gray-200 rounded-md p-2 mt-1 focus-within:ring-2 focus-within:ring-orange-500">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input 
                type={showPassword ? "text" : "password"}
                className="flex-1 outline-none text-sm"
                name="password"
                placeholder="Tu contraseña"
                value={password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={handleTogglePasswordVisibility}
                className="ml-2"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {message && (
            <p className={`text-sm text-center ${
              message.includes("éxito") ? "text-green-500" : "text-red-500"
            }`}>
              {message}
            </p>
          )}

          <button 
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer"
          >
            Ingresar
          </button>

          <p 
            className="text-xs md:text-sm text-gray-600 text-center mt-2 transition-transform duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => router.push("/routes/changepassword")}
          >
            ¿Olvidaste tu contraseña?
          </p>

          <p className="text-xs md:text-sm text-gray-600 text-center mt-4">
            ¿No tienes cuenta? 
            <span 
              className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline transition-colors duration-300 ml-1"
              onClick={() => router.push("/routes/register")}
            >
              REGÍSTRATE
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;