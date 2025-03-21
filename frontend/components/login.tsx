"use client";
import { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Evita el error de hidratación

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Limpia el mensaje previo

    if (!email || !password) {
      setMessage("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:1337/api/auth/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: email, // Strapi usa "identifier" en vez de "email"
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("¡Inicio de sesión exitoso!");
        localStorage.setItem("jwt", data.jwt); // Guardar token de sesión
        setTimeout(() => router.push("/home"), 2000); // Redirigir después de 2s
      } else {
        setMessage(data.error.message || "Error en el inicio de sesión.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setMessage("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sección izquierda - Logo, Beneficios */}
      <div className="w-full md:w-3/5 bg-[#3C88A3] flex flex-col items-center justify-center p-6 md:p-10 text-white">
        <Image src="/img/icono.png" alt="Logo" width={150} height={150} className="md:w-[180px] md:h-[180px]" />
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
            <div className="flex items-center border rounded-md p-2 mt-1">
              <Mail size={18} className="text-gray-500 mr-2" />
              <input 
                type="email"
                className="flex-1 outline-none text-sm"
                placeholder="Tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input 
                type="password"
                className="flex-1 outline-none text-sm"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {message && <p className="text-sm text-center" style={{ color: message.includes("exitoso") ? "green" : "red" }}>{message}</p>}

          <button 
            type="submit"
            className="w-full bg-orange-400 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer"
          >
            Ingresar
          </button>

          <p className="text-xs md:text-sm text-gray-600 text-center mt-2 transition-transform duration-300 transform hover:scale-105 cursor-pointer">
            ¿Olvidaste tu contraseña?
          </p>

          <p className="text-xs md:text-sm text-gray-600 text-center mt-4">
            ¿No tienes cuenta? 
            <span className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline transition-colors duration-300" onClick={() => router.push("/register")}>
              REGÍSTRATE
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
