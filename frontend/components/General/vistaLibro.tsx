"use client";
import { useState, useEffect } from "react";
import { getBookByIdLibro } from "@/services/bookCRUD";
import { Minus, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Books = ({ idLibro }: { idLibro: string }) => {
  const [count, setCount] = useState(1);
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
  const { addToCart, authRole } = useAuth();

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
    }
  };

  useEffect(() => {
    loadBookData();
  }, [idLibro]);

  const handleAdd = () => setCount(count + 1);
  const handleSubtract = () => count > 1 && setCount(count - 1);

  const handleAddToCart = () => {
    if (authRole !== "Authenticated") {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    addToCart({
      idLibro,
      title: formData.titulo,
      price: parseFloat(formData.precio),
      quantity: count,
      // imageUrl: formData.coverUrl,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
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
        {formData.coverUrl ? (
          <img
            src={
              formData.coverUrl.includes("http")
                ? formData.coverUrl
                : `http://localhost:1337${formData.coverUrl}`
            }
            alt={formData.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">Imagen no disponible</span>
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
              onClick={handleAddToCart}
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
                onClick={handleAdd}
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
  );
};

export default Books;