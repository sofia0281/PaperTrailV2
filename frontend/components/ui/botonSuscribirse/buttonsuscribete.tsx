import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { suscribeUser } from "@/services/userCRUD";
import { useAuth } from '@/context/AuthContext';

// Componente Toast
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`}>
            {message}
        </div>
    );
};

const ButtonSuscribete = () => {
  const [showSubscribe, setShowSubscribe] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const { authUser } = useAuth();
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [closing, setClosing] = useState(false); // Nuevo estado para controlar el cierre

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowSubscribe(false);
  };

  const shootConfetti = () => {
    const defaults = {
      spread: 60,
      ticks: 100,
      gravity: 0.8,
      origin: { y: 0.6 },
      colors: ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#F06595"],
    };

    confetti({ ...defaults, particleCount: 100, angle: 60, origin: { x: 0, y: 0.6 } });
    confetti({ ...defaults, particleCount: 100, angle: 120, origin: { x: 1, y: 0.6 } });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
  
    try {
      const result = await suscribeUser(email);
  
      if (!result.success) {
        setToastMessage(result.message || "Error en la suscripción");
        setToastType('error');
        return;
      }

      if (result.alreadySubscribed) {
        setToastMessage("📬 Ya estabas suscrito. ¡Gracias por tu entusiasmo!");
        setToastType('success');
      } else {
        setToastMessage("✅ Suscripción realizada exitosamente. ¡Bienvenido!");
        setToastType('success');
        shootConfetti();
      }

      // Cierra el popup después de 2 segundos
      setTimeout(() => {
        handlePopupClose();
      }, 2000);

    } catch (err: any) {
      setToastMessage(err.message || "❌ Error al suscribirte. Intenta de nuevo.");
      setToastType('error');
    }
  };

  const handlePopupOpen = () => {
    setPopupVisible(true);
    setToastMessage("");
    setClosing(false);
    setTimeout(() => setAnimating(true), 10);
  };

  const handlePopupClose = () => {
    setClosing(true); // Activa el estado de cierre
    setAnimating(false);
    setTimeout(() => {
      setPopupVisible(false);
      setToastMessage("");
      setClosing(false); // Restablece el estado de cierre
    }, 500); // Ajusta este tiempo según la duración de tu animación
  };

  return (
    <>
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage("")} 
        />
      )}

      <div
        className={`fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-500 transform ${
          showSubscribe ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
        } hover:scale-110`}
        onClick={handlePopupOpen}
      >
        📩 SUSCRÍBETE!!!
        <button className="cursor-pointer" onClick={handleClose}>
          <X size={18} />
        </button>
      </div>

      {popupVisible && (
        <div
          className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm transition-opacity duration-500 ${
            animating ? "opacity-100" : "opacity-0"
          }`}
          onClick={handlePopupClose}
        >
          <div
            className={`bg-white rounded-lg shadow-lg w-96 p-6 relative transform transition-all duration-500 ${
              animating 
                ? closing 
                  ? "animate-implosion" // Clase para la animación de implosión
                  : "scale-100 opacity-100" 
                : "scale-90 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 cursor-pointer"
              onClick={handlePopupClose}
            >
              <X size={24} />
            </button>

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

            <form onSubmit={handleSubmit} className="flex flex-col">
              <input
                required
                name="name"
                type="text"
                placeholder="Nombre"
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
              />
              <input
                required
                name="email"
                type="email"
                placeholder="Correo Electrónico"
                className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonSuscribete;