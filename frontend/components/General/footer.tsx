"use client"
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer = () => {
    const router = useRouter();
    return (
        <footer className="bg-[#3C88A3] text-white py-6">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
                
                {/* Información de contacto a la izquierda */}
                <div className="text-left">
                    <h2 className="text-lg font-semibold">Contáctanos</h2>
                    <div className="flex items-center mt-2">
                        <Mail className="mr-2" size={18} />
                        <p>contacto@papertrail.com</p>
                    </div>
                    <div className="flex items-center mt-2">
                        <Phone className="mr-2" size={18} />
                        <p>+57 300 123 4567</p>
                    </div>
                    <div className="flex items-center mt-2">
                        <MapPin className="mr-2" size={18} />
                        <p>Pereira, Colombia</p>
                    </div>
                </div>

                {/* Logo y nombre a la derecha */}
                <div className="flex items-center mt-4 sm:mt-0">
                    <h1 className="text-2xl cursor-pointer" onClick={()=>router.push("/")}>
                        PAPER <span className="font-bold">TRAIL</span>
                    </h1>
                    <Image
                        src="/img/icono.png"
                        alt="Icono PaperTrail"
                        width={40}
                        height={40}
                        className="ml-2 cursor-pointer"
                        onClick={()=> router.push("/")}
                    />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
