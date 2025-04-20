"use client";
import Image from "next/image";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import { useRef, useState, useEffect } from "react";

// Componente Toast
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
            {message}
        </div>
    );
};

// Generador de contraseña aleatoria
const generatePassword = (length = 15) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:',.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

const EditPasswordGeneral = () => {
    const router = useRouter();
    const form = useRef<HTMLFormElement>(null);
    const [email, setEmail] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    // Verifica si el correo existe en Strapi
    const checkEmailExists = async (email: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?filters[email][$eq]=${email}`
            );
            if (!response.ok) throw new Error("Error al verificar el correo");
            const data = await response.json();
            return data.length > 0 ? data[0] : null;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    
    const updatePassword = async (userId: number, newPassword: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    // Usa el token de administrador recién creado
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
    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setToastMessage("Por favor, ingresa un correo válido.");
            return;
        }

        const user = await checkEmailExists(email);

        if (!user) {
            setToastMessage("El correo no está registrado en nuestro sistema.");
            return;
        }

        const newPassword = generatePassword();

        const updated = await updatePassword(user.id, newPassword);

        if (!updated) {
            setToastMessage("Hubo un error actualizando la contraseña.");
            return;
        }

        // Enviar nueva contraseña por email
        emailjs
            .send(
                "service_30fn5q3",
                "template_dzxw43h",
                {
                    name: user.username || "Usuario",
                    user_email: email,
                    message: `Tu nueva contraseña es: ${newPassword}`,
                    time: new Date().toLocaleString(),
                },
                "d5YC1eFJ4pBINv06z"
            )
            .then(() => {
                setToastMessage("Correo enviado con nueva contraseña.");
                setEmail("");
            })
            .catch((error) => {
                console.error("Error al enviar correo:", error);
                setToastMessage("Error al enviar el correo. Inténtalo de nuevo.");
            });
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}

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
