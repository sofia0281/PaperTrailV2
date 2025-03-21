"use client";
import { Mail, Lock, Calendar, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sección izquierda - Logo, Beneficios */}
      <div className="w-full md:w-3/5 bg-[#3C88A3] flex flex-col items-center justify-center p-6 md:p-10 text-white md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <Image 
          src="/images/icono.png" 
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

        <div className="w-full max-w-xs sm:max-w-md md:max-w-sm space-y-4">
          {/* Inputs en dos columnas desde móviles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input type="text" className="w-full border rounded-md p-2 mt-1 outline-none text-sm" placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-sm font-medium">Apellido</label>
              <input type="text" className="w-full border rounded-md p-2 mt-1 outline-none text-sm" placeholder="Tu apellido" />
            </div>
            <div>
              <label className="block text-sm font-medium">Cédula</label>
              <input type="text" className="w-full border rounded-md p-2 mt-1 outline-none text-sm" placeholder="Tu cédula" />
            </div>
            <div>
              <label className="block text-sm font-medium">Género</label>
              <select className="w-full border rounded-md p-2 mt-1 outline-none text-sm">
                <option value="">Selecciona tu género</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha de nacimiento</label>
            <div className="flex items-center border rounded-md p-2 mt-1">
              <Calendar size={18} className="text-gray-500 mr-2" />
              <input type="date" className="flex-1 outline-none text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Lugar de Nacimiento</label>
            <input type="text" className="w-full border rounded-md p-2 mt-1 outline-none text-sm" placeholder="Ciudad o país" />
          </div>
          <div>
            <label className="block text-sm font-medium">Dirección de envío</label>
            <input type="text" className="w-full border rounded-md p-2 mt-1 outline-none text-sm" placeholder="Tu dirección" />
          </div>

          {/* Inputs en dos columnas desde móviles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Correo Electrónico</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <Mail size={18} className="text-gray-500 mr-2" />
                <input type="email" className="flex-1 outline-none text-sm" placeholder="Tu correo" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Usuario</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <User size={18} className="text-gray-500 mr-2" />
                <input type="text" className="flex-1 outline-none text-sm" placeholder="Tu usuario" />
              </div>
            </div>
          </div>

          {/* Inputs en dos columnas desde móviles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Contraseña</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <Lock size={18} className="text-gray-500 mr-2" />
                <input type="password" className="flex-1 outline-none text-sm" placeholder="Tu contraseña" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Validar Contraseña</label>
              <div className="flex items-center border rounded-md p-2 mt-1">
                <Lock size={18} className="text-gray-500 mr-2" />
                <input type="password" className="flex-1 outline-none text-sm" placeholder="Repite tu contraseña" />
              </div>
            </div>
          </div>

          {/* Preferencias literarias en dos columnas desde móviles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Tema Literario de preferencia 1</label>
              <select className="w-full border rounded-md p-2 mt-1 outline-none text-sm">
                <option value="">Selecciona un tema</option>
                <option value="ficcion">Ficción</option>
                <option value="no-ficcion">No Ficción</option>
                <option value="fantasia">Fantasía</option>
                <option value="ciencia">Ciencia</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Tema Literario de preferencia 2</label>
              <select className="w-full border rounded-md p-2 mt-1 outline-none text-sm">
                <option value="">Selecciona un tema</option>
                <option value="ficcion">Ficción</option>
                <option value="no-ficcion">No Ficción</option>
                <option value="fantasia">Fantasía</option>
                <option value="ciencia">Ciencia</option>
              </select>
            </div>
          </div>

          <button className="w-full bg-orange-400 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer" onClick={()=>router.push("/")}>Registrarse</button>
          <p className="text-xs text-gray-600 text-center mt-4">
            ¿Ya tienes una cuenta? <span className="text-blue-500 cursor-pointer hover:text-blue-700 hover:underline transition-colors duration-300" onClick={()=>router.push("/login")}>INICIA SESIÓN</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
