import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ButtonSuscribete = () => {
    const [showSubscribe, setShowSubscribe] = useState(true);
    const [popupVisible, setPopupVisible] = useState(false);

    const [animating, setAnimating] = useState(false);

    const router = useRouter();

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Evita que el clic en X propague al div padre
        setShowSubscribe(false);
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        {/*Esto lo puede borrar si quiere, solo era pa poner un lugar a enviar el form jaja*/}

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
        };
        console.log("Datos enviados:", data);
    }
         

    return (
        <>
        <div 
            className={`fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-500 transform ${
            showSubscribe ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
              } hover:scale-110`}
              onClick={() => {
                setPopupVisible(true);
                setTimeout(() => setAnimating(true), 10); // activa animación suave
              }}
        >
            📩 SUSCRÍBETE!!!
            <button className="cursor-pointer" onClick={handleClose}>
            <X size={18} />
            </button>
        </div>
        {popupVisible && (
            <div className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-opacity duration-500 ${
            animating ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => {
                setAnimating(false);
                setTimeout(() => {
                  setPopupVisible(false);
                }
                , 300); // Espera 300ms para que la animación de cierre se complete
                }}>
              <div className={`bg-white rounded-lg shadow-lg w-96 p-6 relative transform transition-all duration-500 ${
              animating ? "scale-100 opacity-100" : "scale-90 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()} // evita que se cierre al hacer clic dentro del modal
                >
                {/* Botón de cierre */}
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 cursor-pointer"
                  
                  onClick={() => {
                    setAnimating(false);
                    setTimeout(() => setPopupVisible(false), 300);
                    }}
                >
                  <X size={24} />
                </button>
      
                {/* Icono y título */}
                <div className="flex flex-col items-center">
                  <div className="bg-orange-600 p-4 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.94 6.94A2 2 0 014 6h12a2 2 0 011.06.94L10 12 2.94 6.94z" />
                      <path d="M18 8v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8l8 6 8-6z" />
                    </svg>
                  </div>
                  <h2 className="text-orange-700 text-2xl font-bold">¡SUSCRÍBETE!</h2>
                  <p className="text-center text-gray-600 text-sm">
                    Y recibe información a tu correo con nuestras novedades.
                  </p>
                </div>
      
                {/* Campos del formulario */}
                <div className="mt-4">
                 <form onSubmit={handleSubmit} className="flex flex-col">   
                  <input
                    required
                    type="text"
                    placeholder="Nombre"
                    className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Correo Electrónico"
                    className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                  />
                  <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer">
                    Enviar
                  </button>
                </form>
                </div>
              </div>
            </div>
          )}
        </>
    );
};

export default ButtonSuscribete;
