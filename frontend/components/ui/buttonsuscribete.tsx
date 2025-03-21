import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ButtonSuscribete = () => {
    const [showSubscribe, setShowSubscribe] = useState(true);
    const router = useRouter();

    const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Evita que el clic en X propague al div padre
        setShowSubscribe(false);
    };

    return (
        <div 
            onClick={() => router.push("/register")}
            className={`fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-500 transform ${
                showSubscribe ? "opacity-100 scale-100" : "opacity-0 scale-0 pointer-events-none"
              } hover:scale-110`}
        >
            📩 SUSCRÍBETE!!!
            <button className="cursor-pointer" onClick={handleClose}>
                <X size={18} />
            </button>
        </div>
    );
};

export default ButtonSuscribete;
