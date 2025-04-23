"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getBookByIdLibro, putBookData } from "@/services/bookCRUD";

const EditBook =  ({ bookID }: { bookID: string }) => {
  const router = useRouter();

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

  const [errorMessage, setErrorMessage] = useState("");
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
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // Validar el ISSN
  //   if (!validarISSN(formData.issn)) {
  //     alert("El ISSN no es válido");
  //     return;
  //   }
  // }

  const handleSubmit = async () => {
      // setShowConfirm(false);
      try {
        const updatedBookData = {
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
        }

        await putAdminData(updatedBookData, adminID);
        await putUsuarioAdminData(updatedUserData);
        setMessage("Administrador editado correctamente");
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error("Error:", error.message);
        setMessage("Error al actualizar los datos");
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
       name === "editorial" ||
       name === "genero" ||
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
        if(name === "genero") {
          formattedValue = value.slice(0,50)// Solo 50 caracteres
                                .replace(/^\s+/, "");// Eliminar espacios al principio
        }
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


    const loadBookData = async () => {
        const bookData = await getBookByIdLibro(bookID);
        console.log("Datos recibidos:", bookData);
        if (bookData) {
          setFormData({
            issn: bookData.ISBN_ISSN ?? "",  
            fechaPublicacion: bookData.fecha_publicacion?.split('T')[0] ?? "",
            titulo: bookData.title ?? "",
            estado: bookData.condition ?? "nuevo",
            autor: bookData.author ?? "",
            precio: bookData.price?.toString() ?? "",
            editorial: bookData.editorial ?? "",
            numeroPaginas: bookData.numero_paginas?.toString() ?? "",
            genero: bookData.genero ?? "",
            idioma: bookData.idioma ?? "",
            cantidad: bookData.cantidad?.toString() ?? ""
          });
        }
      };
    // Asegúrate de que el useEffect tenga bookID como dependencia
    useEffect(() => {
      loadBookData();
    }, [bookID]); 


  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Encabezado */}
      <div className="bg-orange-600 text-white p-9 rounded-t-lg relative">
        <h1 className="text-2xl font-bold">EDITAR LIBRO</h1>
        <div className="absolute top-10 right-5 transform translate-x-0 bg-gray-200 p-2 rounded-md shadow-md mb-10
                        sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:right-auto">
            <img 
            src="https://media.istockphoto.com/id/1023006620/es/vector/pila-de-libros-ilustraci%C3%B3n-vectorial-plana-simple-libros-de-tapa-dura-con-cubiertas-de.jpg?s=612x612&w=0&k=20&c=VaCciK2-WVgwpDtFEU6cTY1XEQ0B5wp1T-4sgqu1XlA=" 
            alt="Imagen de ejemplo"
            className="w-full max-w-[100px] h-auto mx-auto"
            />
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 p-6">
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
          <select
                required
                name="preferencia1"
                value={formData.estado}
                onChange={handleChange}
                className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
              <option value="Nuevo">Nuevo</option>
              <option value="Usado"> Usado </option>
            </select>
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
          <input 
          required
          type="text" 
          name="genero"
          onChange={handleChange}
          value={formData.genero}  
          className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Género" />
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
        <div className="col-span-2 flex justify-end gap-4 mt-6">
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
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBook;