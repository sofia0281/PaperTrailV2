"use client";
import Image from "next/image";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { getMaxListeners } from "events";

const EditPasswordGeneral = () => {
    const router = useRouter();
    const form = useRef<HTMLFormElement>(null);
    const [email, setEmail] = useState("");

    const sendEmail = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) return alert("Por favor, ingresa un correo válido.");

        emailjs
          .send(
            "service_30fn5q3",          
            "template_dzxw43h",         
            {
              name: "Usuario",
              user_email: email,
              message: "Has solicitado recuperar tu contraseña. Este mensaje confirma que tu solicitud fue registrada correctamente.",
              time: new Date().toLocaleString(),
            },
            "d5YC1eFJ4pBINv06z"
          )


            .then(() => {
                alert("Correo enviado correctamente.");
                setEmail("");
            })
            .catch((error) => {
                console.error("Error al enviar correo:", error);
                alert("Error al enviar el correo. Inténtalo de nuevo.");
            });
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Izquierda */}
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

            {/* Derecha */}
            <div className="w-full md:w-2/5 flex flex-col items-center justify-center p-6 md:p-10">
                <div className="border border-gray-300 rounded-lg shadow-lg bg-white p-12 w-full max-w-md flex flex-col items-center">
                    <h1 className="text-2xl md:text-3xl font-semibold text-orange-400 mb-6 text-center">
                        RECUPERAR CONTRASEÑA
                    </h1>

                    <form ref={form} onSubmit={sendEmail} className="w-full max-w-xs md:max-w-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Correo Electrónico</label>
                            <div className="flex items-center border border-gray-200 rounded-md p-2 mt-1 focus-within:ring-2 focus-within:ring-orange-500">
                                <Mail size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="email"
                                    className="flex-1 outline-none text-sm"
                                    name="user_email"
                                    placeholder="Tu correo"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="w-full mt-4 justify-between">
                            <button
                                type="button"
                                onClick={() => router.back()}
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
};

export default EditPasswordGeneral;