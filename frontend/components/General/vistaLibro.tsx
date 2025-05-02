"use client";
import { useState, useEffect } from "react";
import { getBookByIdLibro } from "@/services/bookCRUD";
import { Minus, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const Books = ({ idLibro }: { idLibro: string }) => {
  const [count, setCount] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    issn: "",
    fechaPublicacion: "",
    titulo: "",
    estado: "nuevo",
    autor: "",
    precio: "",
    editorial: "",
    numeroPaginas: "",
    genero: "",
    idioma: "",
    cantidad: "",
    // coverUrl: "", // Añadido para la imagen del libro
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { addToCart, authRole , updateQuantity} = useAuth();


  const handleupdateQuantity = () => {
    if (count < 20) {
      setCount(count + 1);
    } else {
      setErrorMessage("Máximo 20 unidades por libro.");
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };
  
    useEffect(() => {
      const storedRole = localStorage.getItem('role');
      setRole(storedRole?.replace(/"/g, '') || null);
    }, []);
  const handleMessage = () =>{
    const Mensaje = "Registrate o Inicia Sesión como cliente "
    setSuccessMessage(Mensaje);
    setTimeout(() => setSuccessMessage(null), 3000);
  }
  const handleAddToCart = () => {
    if (role !== "Authenticated") {
      handleMessage(); // Mensaje si no está autenticado
      return;
    }
  
    const wasAdded = addToCart({
      idLibro,
      title: formData.titulo,
      price: parseFloat(formData.precio),
      quantity: count,
      imageUrl: image,
    });
  
    if (!wasAdded) {
      setSuccessMessage("Solo puedes agregar hasta 20 unidades de este libro.");
    } else {
      setSuccessMessage("Tulibro se ha añadido exitosamente al carrito.");
    }
  
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  

  const loadBookData = async () => {
    const bookData = await getBookByIdLibro(idLibro);
    if (bookData) {
      setFormData({
        issn: bookData.ISBN_ISSN ?? "",
        fechaPublicacion: bookData.fecha_publicacion?.split("T")[0] ?? "",
        titulo: bookData.title ?? "",
        estado: bookData.condition ?? "nuevo",
        autor: bookData.author ?? "",
        precio: bookData.price?.toString() ?? "",
        editorial: bookData.editorial ?? "",
        numeroPaginas: bookData.numero_paginas?.toString() ?? "",
        genero: bookData.genero ?? "",
        idioma: bookData.idioma ?? "",
        cantidad: bookData.cantidad?.toString() ?? "",
        // coverUrl: bookData.cover?.url ?? "", // Asignar URL de la imagen
      });
      // Cargar la imagen si existe
      if (bookData.cover.url) {
        const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${bookData.cover.url}`;
        setImage(imageUrl);
        console.log("URL de la imagen cargada:", imageUrl);
      } else {
        console.log("No se encontró imagen para este libro");
        setImage(null);
      }
    }
  };

  useEffect(() => {
    loadBookData();
  }, [idLibro]);

  const handleAdd = () => setCount(count + 1);
  const handleSubtract = () => count > 1 && setCount(count - 1);


  return (
    <>
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
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-xl rounded-2xl relative">
      {/* Mensajes de feedback */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50"
          >
            ¡Libro añadido al carrito!
          </motion.div>
        )}
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50"
          >
            Debes iniciar sesión para añadir al carrito
          </motion.div>
        )}
      </AnimatePresence>

      {/* Imagen del libro */}
      <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden">
      {image ? (
              <>
                <img
                  src={image}
                  alt={formData.titulo}
                  className="w-full h-full object-cover"
                  onError={() => setImage(null)} // Si falla la carga de la imagen
                />
              </>
            ) : (
              <>
                <div className="w-[120px] h-[120px] bg-gray-100 flex items-center justify-center mx-auto">
                  <span className="text-gray-500 text-xs text-center">No hay imagen</span>
                </div>

              </>
            )}
      </div>

      {/* Detalles del libro */}
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold leading-tight mb-1">
            {formData.titulo}
          </h2>
          <p className="text-sm text-gray-600 mb-4">{formData.autor}</p>
          <p className="text-xl font-semibold">
            ${parseFloat(formData.precio).toLocaleString("es-CO")}
          </p>
          <p className="text-sm text-gray-500 mb-6 capitalize">
            {formData.estado}
          </p>

          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick = {() =>handleAddToCart()}
              className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Agregar al Carrito
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSubtract}
                className="cursor-pointer p-1 border rounded-full hover:bg-orange-200"
              >
                <Minus size={16} />
              </button>
              <span>{count}</span>
              <button
                onClick={() => handleupdateQuantity()}

                className="cursor-pointer p-1 border rounded-full hover:bg-orange-200"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Información técnica */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">
                Fecha de publicación
              </p>
              <p className="pl-2">{formData.fechaPublicacion}</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">
                Categoría
              </p>
              <p className="pl-2">{formData.genero}</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">
                Número de Páginas
              </p>
              <p className="pl-2">{formData.numeroPaginas}</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">
                Editorial
              </p>
              <p className="pl-2">{formData.editorial}</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">
                ISBN
              </p>
              <p className="pl-2">{formData.issn}</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">
                Idioma
              </p>
              <p className="pl-2">{formData.idioma}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Books;