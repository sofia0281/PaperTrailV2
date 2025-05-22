"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getTienda, putTiendaData} from "@/services/tiendasCRUD";
import withAuthADMIN from '../Auth/withAuthADMIN';
import {XCircle } from "lucide-react";
import { motion } from "framer-motion";


const EditTienda =  ({ tiendaID }: { tiendaID: string }) => {

    const router = useRouter();

    const [showConfirm, setShowConfirm] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    


    const [formData, setFormData] = useState({
        Nombre: "",  
        Region: "",
        Departamento: "",
        Ciudad: "",
        Direction: "",
        idTienda: "",
    });



    const ConfirmSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(true);
    };





    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if(name === "Nombre" ||
        name === "Region" ||
        name === "Departamento" ||
        name === "Ciudad" ||
        name === "Direction" ||
        name === "idTienda") {


            if (name === "idTienda") {
            // Para el campo numero de paginas, solo permitir números y limitar a 5 dígitos
            formattedValue = value.replace(/\D/g, "").slice(0, 5) // Solo números, máximo 5 dígitos
                                    .replace(/^\s+/, ""); // Eliminar espacios al principio
            }

            if (name === "Nombre") {
            formattedValue = value.slice(0,100)// Solo 255 caracteres
                                    .replace(/^\s+/, "");// Eliminar espacios al principio
            }
        }
        setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
        }));
    }


    const loadTiendasData = async () => {
        try {
        console.log("ID de la tienda:", tiendaID);
        const tiendaData = await getTienda(tiendaID);
        console.log("Datos completos del libro:", tiendaData);
        if (tiendaData) {
            setFormData({
            idTienda: tiendaData.idTienda || "",
            Nombre: tiendaData.Nombre || "",
            Region: tiendaData.Region || "",
            Departamento: tiendaData.Departamento || "",
            Ciudad: tiendaData.Ciudad || "",
            Direction: tiendaData.Direction || ""
            });
                    }
        } catch (error) {
        console.error("Error al cargar datos de la tienda:", error);
        setErrorMessage("Error al cargar los datos de la tienda");
        }
    };

    useEffect(() => {
        // Variable para controlar si el componente está montado
        let isMounted = true;
    
        const loadData = async () => {
        try {
            await loadTiendasData();
        } catch (error) {
            if (isMounted) {
            console.error("Error al cargar los datos de la tienda:", error);
            }
        }
        };
    
        loadData();
    
        // Cleanup function
        return () => {
        isMounted = false;
        };
    }, [tiendaID]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirm(false);
    
        try {
        
            const updatedTiendaData = {
            idTienda: formData.idTienda,
            Nombre:  formData.Nombre,
            Region:  formData.Region,
            Departamento:  formData.Departamento,
            Ciudad:  formData.Ciudad,
            Direction: formData.Direction,
            };

    
            await putTiendaData(updatedTiendaData, tiendaID); // Nueva función
            
            setSuccessMessage("Tienda editada correctamente");
            setTimeout(() => {setSuccessMessage(null);router.push
            (          "/routes/adminshop");
            }, 2000);
        
        } catch (error: any) {
            const errorMessages = error.errors?.map(errorItem => {
            const field = errorItem.path?.[0];
            if (field === "idTienda") return `Este idTienda ya se encuentra registrado`;
            return `Error en el campo ${field || 'desconocido'}. Error al editar tienda`;
            });
        
            const fullMessage = errorMessages?.join('. ') || error.message || "Error al editar la tienda";
            setErrorMessage(fullMessage);
            setSuccessMessage(null);
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };
    

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      {/* Encabezado */}
      <div className="bg-orange-600 text-white p-9 rounded-t-lg ">
        <h1 className="text-2xl font-bold">EDITAR TIENDA</h1>
        
      </div>
      {(successMessage || errorMessage) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-17 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/3 h-auto flex items-center z-20 justify-between px-8 py-5 rounded-lg shadow-lg text-white text-sm ${
            successMessage ? "bg-orange-500" : "bg-black"
          }`}
        >
          <span>{successMessage || errorMessage}</span>
          <XCircle
            size={22}
            className="cursor-pointer hover:text-gray-200"
            onClick={() => {
              setSuccessMessage(null);
              setErrorMessage(null);
            }}
          />
        </motion.div>
      )} 

    {/* ------------------------Ventana modal de confirmación ----------------------------*/}
            {showConfirm && (
        <>
            <div className="fixed inset-0 bg-black/50 z-40"></div>
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 text-center border z-50 ">
                    <p className="text-lg font-semibold">¿Deseas continuar con los cambios?</p>
                    <div className="mt-4 flex justify-center space-x-4">
                        <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-gray-400 transition-transform transition-colors duration-150 
                            active:scale-95" onClick={() => setShowConfirm(false)}>
                        Cancelar
                        </button>
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-orange-600 transition-transform transition-colors duration-150 
                            active:scale-95" onClick={handleSubmit}>
                        Sí, editar
                        </button>
                    </div>
                </div>
        </>
      )}

      {/* Formulario */}
      <form onSubmit={ConfirmSubmit} className="grid grid-cols-2 md:grid-cols-2 gap-6 p-6 relative z-10 -mt-28">
        <div>
            <label className="block text-sm font-medium">Nombre de la tienda</label>
            <input 
            required
            type="text" 
            name="Nombre"
            onChange={handleChange}
            value={formData.Nombre} 
            className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Título" />
        </div>
        <div>
            <label className="block text-sm font-medium">Region</label>
            <input 
            required
            type="text" 
            name="Region"
            onChange={handleChange}
            value={formData.Region} 
            className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Título" />
        </div>
        <div>
            <label className="block text-sm font-medium">Departamento</label>
            <input 
            required
            type="text" 
            name="Departamento"
            onChange={handleChange}
            value={formData.Departamento}  
            className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Departamento" />
        </div>
        <div>
            <label className="block text-sm font-medium">Ciudad</label>
            <input 
            required
            type="text" 
            name="Ciudad"
            onChange={handleChange}
            value={formData.Ciudad}  
            className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Ciudad" />
        </div>
        <div>
            <label className="block text-sm font-medium">Dirección</label>
            <input 
            required
            type="text" 
            name="Direction"
            onChange={handleChange}
            value={formData.Direction}  
            className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Dirección" />
        </div>
        <div>
            <label className="block text-sm font-medium">ID de la tienda</label>
            <input 
            required
            type="text" 
            name="idTienda"
            onChange={handleChange}
            value={formData.idTienda}  
            className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ID de la tienda" />
        </div>
        {/* Botones */}
        <div className="col-span-2 flex justify-end gap-4 mt-6">
            <button
                type="button"
                onClick={() => router.push("/routes/adminshop")}
                className="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer transition-transform duration-300 transform hover:scale-105"
            >
                Cancelar
            </button>
            <button
                type="submit"
                className="bg-orange-500 text-white px-6 py-2 rounded-md cursor-pointer transition-transform duration-300 transform hover:scale-105"
            >
                Guardar cambios
            </button>
        </div>
    </form>
    </div>
    );
};

export default withAuthADMIN(EditTienda);