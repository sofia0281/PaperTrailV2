"use client";

import { useRouter } from "next/navigation";
import {XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createBook } from "@/services/bookCRUD";
import { motion } from "framer-motion";

const CreateBook = () => {
  const router = useRouter();
  {/*Estados para la ventana emergente */}
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Función para formatear el precio
  const formatPrice = (value: string): string => {
    const [integer, decimal = ""] = value.split(".");
    const intFormatted = Number(integer).toLocaleString("en-US");
    return decimal ? `${intFormatted}.${decimal}` : intFormatted;
  };
  // Función para limpiar el precio
  const cleanPrice = (value: string): string => {
    return value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
  };

  const [formData, setFormData] = useState({
    issn: "",  
    fechaPublicacion: "",
    titulo: "",
    estado: "nuevo",
    autor: "",
    precio:  "",
    editorial: "",
    numeroPaginas: "",
    genero: "",
    idioma: "",
    cantidad: ""
  });
  // Validar el formato del ISSN
  const validarISSN = (issn: string): boolean => {
    if (!/^\d{4}-\d{3}[\dX]$/.test(issn)) return false;
  
    // Convertir la cadena en un array de números, tratando "X" como 10
    const numeros: number[] = issn.replace("-", "").split("").map((char) =>
      char === "X" || "x" ? 10 : Number(char)
    );
  
    // Aplicar la fórmula de verificación
    let suma = 0;
    for (let i = 0; i < 7; i++) {
      suma += numeros[i] * (8 - i);
    }
  

    // Calcular el dígito de control esperado
    const digitoControlEsperado = (11 - (suma % 11)) % 11;
    const digitoControl = digitoControlEsperado === 10 ? 10 : digitoControlEsperado;
  
    return numeros[7] === digitoControl;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validar el ISSN
    // if (!validarISSN(formData.issn)) {
    //   alert("El ISSN no es válido");
    //   return;
    // }
    try {
            const newBookData = {
              "ISBN_ISSN": formData.issn,
              "fecha_publicacion": formData.fechaPublicacion,
              "title": formData.titulo,
              "condition": formData.estado,
              "author": formData.autor,
              "price": formData.precio,
              "editorial": formData.editorial,
              "numero_paginas": formData.numeroPaginas,
              "genero": formData.genero,
              "idioma": formData.idioma ,
              "cantidad": formData.cantidad,
              "idLibro": formData.issn
            }
            await createBook(newBookData);
            //setMessage("Administrador editado correctamente");
            // setTimeout(() => setMessage(null), 3000);
      } catch (error) {
    // console.error('Error completo:', error);
    const errorMessages = error.errors.map(errorItem => {
      const field = errorItem.path[0];
      if (field === "ISBN_ISSN")
      {
        return `Este ISSN ya se encuentra registrado`;
      }
      // else {
      //   return `Error en el  campo ${field}. Error al crear Libro`;
      
      // }
      
    });
    if (error.status === 400 ) {
      const fullMessage = errorMessages.join('. ');
      setErrorMessage(fullMessage);
      setSuccessMessage(null);
      setTimeout(() => {
        setErrorMessage(null);
        router.push("/routes/createbook");
      }, 3000);
    } else {
      const fullMessage = errorMessages.join('. ');
      setErrorMessage(fullMessage);
      setSuccessMessage(null);
      setTimeout(() => setErrorMessage(null), 3000);
    }
          }
    };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if(name === "issn" ||
       name === "fechaPublicacion" || 
       name === "numeroPaginas" || 
       name === "cantidad" ||
       name === "precio" ||
       name === "titulo" ||
       name === "autor" ||
      //  name === "resena" ||
       name === "editorial" ||
      //  name === "genero" ||
       name === "idioma" ||
       name === "estado") {

        if (name === "issn") {
          const rawValue = value.replace(/[-\s]/g, "");
      
          if (rawValue.length > 8) return;
      
          formattedValue = rawValue.length > 4
            ? `${rawValue.slice(0, 4)}-${rawValue.slice(4)}`
            : rawValue;
      
          const partialRegex = /^\d{0,4}-?\d{0,3}[\dXx]?$/;

          if (!partialRegex.test(formattedValue))return;

          if(formattedValue.length < 9 && !validarISSN(formattedValue)) {
            setErrorMessage("El ISSN no es válido");
          }
          else {
            setErrorMessage("");
          }
        }

        // Formatear la fecha de publicación
        if (name === "fechaPublicacion") {
          formattedValue = value.replace(/[^0-9-]/g, "");
        }
        if (name === "numeroPaginas") {
          // Para el campo numero de paginas, solo permitir números y limitar a 5 dígitos
          formattedValue = value.replace(/\D/g, "").slice(0, 5) // Solo números, máximo 5 dígitos
                                .replace(/^\s+/, ""); // Eliminar espacios al principio
        }
        if (name === "precio") {

          const rawValue = cleanPrice(value);
          const formattedPrice = formatPrice(rawValue);
          formattedValue = formattedPrice;
          if (rawValue.replace(".", "").length > 12) return;
        }
        if(name === "cantidad") {
          // Para el campo cantidad, solo permitir números y limitar a 5 dígitos
          formattedValue = value.replace(/\D/g, "").slice(0, 5) // Solo números, máximo 5 dígitos
        }
        if (name === "titulo") {
          formattedValue = value.slice(0,100)// Solo 255 caracteres
                                .replace(/^\s+/, "");// Eliminar espacios al principio
        }
        if (name === "autor") {
          // Para el campo autor, solo permitir letras y espacios
          formattedValue = value.slice(0,100)// Solo 255 caracteres
                                .replace(/^\s+/, "")// Eliminar espacios al principio
        }
        // if(name === "resena") {
        //   formattedValue = value.slice(0,255)// Solo 1000 caracteres
        //                         .replace(/^\s+/, "");// Eliminar espacios al principio
        // }
        if(name === "editorial") {
          formattedValue = value.slice(0,50)// Solo 255 caracteres
                                .replace(/^\s+/, "");// Eliminar espacios al principio
        }
        // if(name === "genero") {
        //   formattedValue = value.slice(0,50)// Solo 50 caracteres
        //                         .replace(/^\s+/, "");// Eliminar espacios al principio
        // }
        if(name === "idioma") {
          formattedValue = value.slice(0,50)// Solo 50 caracteres
                                .replace(/^\s+/, "")// Eliminar espacios al principio
                                .replace(/[^a-zA-Z]/g, "");
        }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  }
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Encabezado */}
      <div className="bg-orange-600 text-white p-9 rounded-t-lg relative">
        <h1 className="text-2xl font-bold">CREAR LIBRO</h1>
        <div className="absolute top-10 right-5 transform translate-x-0 bg-gray-200 p-2 rounded-md shadow-md mb-10
                        sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:right-auto">
            <img 
            src="https://media.istockphoto.com/id/1023006620/es/vector/pila-de-libros-ilustraci%C3%B3n-vectorial-plana-simple-libros-de-tapa-dura-con-cubiertas-de.jpg?s=612x612&w=0&k=20&c=VaCciK2-WVgwpDtFEU6cTY1XEQ0B5wp1T-4sgqu1XlA=" 
            alt="Imagen de ejemplo"
            className="w-full max-w-[100px] h-auto mx-auto"
            />
        </div>
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
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 p-6">
        <div>
          <label className="block text-sm font-medium">ISSN</label>
          <input 
          required
          type="text" 
          name="issn" 
          onChange={handleChange}
          value={formData.issn}
          //{`border ${validarISSN(formData.issn) ? "border-green-500" : "border-red-500"}`}

          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="ISSN" />
          {errorMessage&&<p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Fecha de Publicación</label>
          <input 
          required
          type="date" 
          name="fechaPublicacion"
          onChange={handleChange}
          value={formData.fechaPublicacion} 
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input 
          required
          type="text" 
          name="titulo"
          onChange={handleChange}
          value={formData.titulo} 
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Título" />
        </div>
        <div>
          <label className="block text-sm font-medium">Estado</label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center">
              <input
                required 
                type="radio" 
                name="estado"
                value="Nuevo"
                onChange={handleChange}
                checked={formData.estado === "Nuevo"}
                className="appearance-none w-4 h-4 border-2 border-orange-500 mr-1 rounded-full checked:bg-orange-500 checked:border-orange-500" /> Nuevo
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="estado" 
                value="Usado"
                onChange={handleChange}
                checked={formData.estado === "Usado"}
                className="appearance-none w-4 h-4 border-2 bg-white border-orange-500 mr-1 rounded-full checked:bg-orange-500 checked:border-orange-500" /> Usado
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Autor</label>
          <input 
          required
          type="text" 
          name="autor"
          onChange={handleChange}
          value={formData.autor}  
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Autor" />
        </div>
        <div>
          <label className="block text-sm font-medium">Precio</label>
          <input 
          required
          type="text" 
          name="precio"
          onChange={handleChange}
          value={formData.precio}  
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Precio" />
        </div>
        {/* <div>
          <label className="block text-sm font-medium">Reseña</label>
          <input 
          required
          type="text" 
          name="resena"
          onChange={handleChange}
          value={formData.resena} 
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Reseña" />
        </div> */}
        <div>
          <label className="block text-sm font-medium">Editorial</label>
          <input 
          required
          type="text" 
          name="editorial"
          onChange={handleChange}
          value={formData.editorial}  
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Editorial" />
        </div>
        <div>
          <label className="block text-sm font-medium">Número de Páginas</label>
          <input 
          required
          type="text" 
          name="numeroPaginas"
          onChange={handleChange}
          value={formData.numeroPaginas}  
          min={1} 
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Número de páginas" />
        </div>
        <div>
          <label className="block text-sm font-medium">Género</label>
          <select
                required
                name="genero"
                onChange={handleChange}
                value={formData.genero}  
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="Ficción">Ficción</option>
                <option value="No ficción">No ficción</option>
                <option value="Novela">Novela</option>
                <option value="Cuentos">Cuentos</option>
                <option value="Poesía">Poesía</option>
                <option value="Biografías y autobiografías">Biografías y autobiografías</option>
                <option value="Ensayos">Ensayos</option>
                <option value="Historia">Historia</option>
                <option value="Ciencia">Ciencia</option>
                <option value="Psicología y desarrollo personal">Psicología y desarrollo personal</option>
                <option value="Filosofía">Filosofía</option>
                <option value="Negocios y economía">Negocios y economía</option>
                <option value="Autoayuda y motivación">Autoayuda y motivación</option>
                <option value="Salud y bienestar">Salud y bienestar</option>
                <option value="Religión y espiritualidad">Religión y espiritualidad</option>
                <option value="Educación y pedagogía">Educación y pedagogía</option>
                <option value="Tecnología e informática">Tecnología e informática</option>
                <option value="Viajes y turismo">Viajes y turismo</option>
                <option value="Gastronomía y cocina">Gastronomía y cocina</option>
                <option value="Arte y fotografía">Arte y fotografía</option>
                <option value="Literatura infantil">Literatura infantil</option>
                <option value="Literatura juvenil">Literatura juvenil</option>
                <option value="Misterio y suspense">Misterio y suspense</option>
                <option value="Novela policíaca">Novela policíaca</option>
                <option value="Fantasía épica">Fantasía épica</option>
                <option value="Distopía">Distopía</option>
                <option value="Romance contemporáneo">Romance contemporáneo</option>
                <option value="Romance histórico">Romance histórico</option>
                <option value="Horror y terror">Horror y terror</option>
                <option value="Género gótico">Género gótico</option>
                <option value="Novela histórica">Novela histórica</option>
                <option value="Filosofía oriental">Filosofía oriental</option>
                <option value="Mitología y folclore">Mitología y folclore</option>
                <option value="Cómics y novelas gráficas">Cómics y novelas gráficas</option>
              </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Idioma</label>
          <input 
          required
          type="text" 
          name="idioma"
          onChange={handleChange}
          value={formData.idioma}  
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Idioma" />
        </div>
        <div>
          <label className="block text-sm font-medium">Cantidad</label>
          <input 
          required
          type="number" 
          name="cantidad"
          onChange={handleChange}
          value={formData.cantidad}  
          min={1} 
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Cantidad" />
        </div>

        {/* Botones */}
        <div className="col-span-2 flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/routes/adminbooks")}
            className="bg-blue-500 text-white px-6 py-2 rounded-md cursor-pointer transition-transform duration-300 transform hover:scale-105"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded-md cursor-pointer transition-transform duration-300 transform hover:scale-105"
          >
            Crear Libro
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBook;