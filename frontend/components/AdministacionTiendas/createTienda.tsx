"use client";

import { useRouter } from "next/navigation";
import {XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createTienda } from "@/services/tiendasCRUD";
import withAuthADMIN from '../Auth/withAuthADMIN';
import { motion } from "framer-motion";
import colombiaData from "@/components/ui/colombia/data_colombia.json";
import { AutocompleteColombia } from "@/components/ui/colombia/AutocompleteColombia";


import { geocodeAddress } from "@/services/geocoding";



const CreateTienda = () => {


  //Ventana modal de confirmación
    const [showConfirm, setShowConfirm] = useState(false);

    const router = useRouter();

  {/*Estados para la ventana emergente */}

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

    const [formErrors, setFormErrors] = useState({
      Region: false,
      Departamento: false,
      Ciudad: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setShowConfirm(false);
    
      if (!validateForm()) {
        setErrorMessage("Por favor complete correctamente los datos de ubicación");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
    
      if (formData.Direction.length < 10) {
        setErrorMessage("La dirección debe tener al menos 10 caracteres.");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }
    
      try {
        const fullAddress = `${formData.Direction}, ${formData.Ciudad}, ${formData.Departamento},  Colombia`;
        const coords = await geocodeAddress(fullAddress);
        console.log("Coordenadas obtenidas:", coords);
    
        const newTiendaData = {
          idTienda: formData.idTienda,
          Nombre: formData.Nombre,
          Region: formData.Region,
          Departamento: formData.Departamento,
          Ciudad: formData.Ciudad,
          Direction: formData.Direction,
          latitud: coords.latitud,
          longitud: coords.longitud
        };
    
        const response = await createTienda(newTiendaData);
    
        setSuccessMessage("Tienda creada correctamente");
      } catch (error: any) {
        const errorMessages = error.errors?.map(errorItem => {
          const field = errorItem.path?.[0];
          if (field === "idTienda") return `Este idTienda ya se encuentra registrado`;
          return `Error en el campo ${field || 'desconocido'}. Error al crear la tienda`;
        });
    
        const fullMessage = errorMessages?.join('. ') || error.message || "Error al crear la tienda";
        setErrorMessage(fullMessage);
        setSuccessMessage(null);
        setTimeout(() => setErrorMessage(null), 3000);
      }
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

                if(name === "Direction"){
                  // Para el campo dirección, eliminar caracteres no deseados y los espacios al principio
                  formattedValue = value.replace(/[^A-Za-z0-9ÁÉÍÓÚáéíóúñÑ\s.,#-]/g, "") // Solo letras, números, espacios y caracteres permitidos
                                        .replace(/^\s+/, ""); // Eliminar espacios al principio
                }
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

  const validateForm = (): boolean => {
    const errors = {
      Region: false,
      Departamento: false,
      Ciudad: false
    };
    
    // Validar región
    if (!formData.Region || !colombiaData.regiones.some(r => r.nombre === formData.Region)) {
      errors.Region = true;
    }
    
    // Validar departamento
    if (formData.Region && (!formData.Departamento || 
        !colombiaData.regiones.find(r => r.nombre === formData.Region)?.departamentos.some(d => d.nombre === formData.Departamento))) {
      errors.Departamento = true;
    }
    
    // Validar ciudad
    if (formData.Departamento && (!formData.Ciudad || 
        !colombiaData.regiones.find(r => r.nombre === formData.Region)
          ?.departamentos.find(d => d.nombre === formData.Departamento)
          ?.ciudades.includes(formData.Ciudad))) {
      errors.Ciudad = true;
    }
    
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

    return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      {/* Encabezado */}
      <div className="bg-orange-600 text-white p-9 rounded-t-lg ">
        <h1 className="text-2xl font-bold">CREAR TIENDA</h1>
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
      <form
        onSubmit={ConfirmSubmit}
        className="grid md:grid-cols-2 gap-6 mt-2"
      >
        {/* Sección de imagen - ahora dentro del formulario */}
        <div className="col-span-2 flex justify-center mb-6">
        </div>
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
          <label className="block text-sm font-medium">Región</label>
          <AutocompleteColombia
            value={formData.Region}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              Region: value,
              Departamento: "",
              Ciudad: ""
            }))}
            placeholder="Seleccione una región"
            required
            type="region"
          />
          {formErrors.Region && (
            <p className="text-red-500 text-xs mt-1">Seleccione una región válida</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Departamento</label>
          <AutocompleteColombia
            value={formData.Departamento}
            onChange={(value) => setFormData(prev => ({ 
              ...prev, 
              Departamento: value,
              Ciudad: ""
            }))}
            placeholder={formData.Region ? "Seleccione un departamento" : "Primero seleccione una región"}
            required
            type="departamento"
            dependencia={formData.Region}
            disabled={!formData.Region}
          />
          {formErrors.Departamento && (
            <p className="text-red-500 text-xs mt-1">Seleccione un departamento válido</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Ciudad</label>
          <AutocompleteColombia
            value={formData.Ciudad}
            onChange={(value) => setFormData(prev => ({ ...prev, Ciudad: value }))}
            placeholder={formData.Departamento ? "Seleccione una ciudad" : "Primero seleccione un departamento"}
            required
            type="ciudad"
            dependencia={formData.Departamento}
            disabled={!formData.Departamento}
          />
          {formErrors.Ciudad && (
            <p className="text-red-500 text-xs mt-1">Seleccione una ciudad válida</p>
          )}
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
        <div className="col-span-2 flex justify-center gap-4 mt-6">
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
            Crear Tienda
          </button>
        </div>
      </form>
      </div>
  );
};

export default withAuthADMIN(CreateTienda);