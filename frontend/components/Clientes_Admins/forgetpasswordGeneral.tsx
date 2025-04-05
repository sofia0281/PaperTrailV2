"use client";
import Image from "next/image";
import { Mail} from "lucide-react";
import { useRouter } from "next/navigation";

const EditPasswordGeneral = () => {
    const router = useRouter();
return (
<div className="flex flex-col md:flex-row min-h-screen">
    {/* Sección izquierda - Logo, Beneficios */}
    <div className="w-full md:w-4/5 bg-[#3C88A3] flex flex-col items-center justify-center p-6 md:p-10 text-white">
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
    <div className="border border-gray-300 rounded-lg shadow-lg bg-white p-12 w-full max-w-md flex flex-col items-center">

        <h1 className="text-2xl md:text-3xl font-semibold text-orange-400 mb-6 text-center">
            RECUPERAR CONTRASEÑA
        </h1>

        <form className="w-full max-w-xs md:max-w-sm space-y-4" /*</div>onSubmit={handleLogin}*/>
            <div>
            <label className="block text-sm font-medium">Correo Electrónico</label>
            <div className="flex items-center border border-gray-200 rounded-md p-2 mt-1 focus-within:ring-2 focus-within:ring-orange-500">
                <Mail size={18} className="text-gray-500 mr-2" />
                <input 
                type="email"
                className="flex-1 outline-none text-sm"
                name="email"
                placeholder="Tu correo"
                />
            </div>
            </div>
            <div className=" w-full mt-4 justify-between">   
                <button 
                type="submit"
                className="w-full bg-orange-400 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                >
                CANCELAR
                </button>
                <button 
                type="submit"
                className="w-full bg-blue-400 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:scale-105 cursor-pointer"
                >
                RECUPERAR CONTRASEÑA
                </button>
            </div>

        </form>
        </div>
    </div>
</div>
);
}

export default EditPasswordGeneral;