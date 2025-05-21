"use client";
import { Router, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
interface Book {
  id: number;
  title: string;
  price: number;
  author: string;
  cantidad: number;
  idLibro: string;
}

const ShopStore = () => {
  const router =  useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);


 const handleDelete = async () => {
  if (selectedBook === null) return;
  try {
    setBooks(prev => prev.filter(book => book.idLibro !== selectedBook));
    setMessage("Libro eliminado exitosamente");
    setTimeout(() => setMessage(null), 3000);
  } catch (error) {
    console.error("Error al eliminar libro:", error);
  } finally {
    setShowConfirm(false);
    setSelectedBook(null);
  }
};



  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Encabezado */}
      <h1 className="text-4xl font-bold text-start mb-4">Hola <span className="text-orange-500">ADMIN</span></h1>
      <p className="mb-6">Aquí podrás administrar la informacion de todas las tiendas</p>
      {showConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40"></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 text-center border z-50">
          <p className="text-lg font-semibold">¿Estás seguro?</p>
          <p className="text-gray-600 text-sm mt-2">Esta acción no se puede deshacer.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm cursor-pointer active:scale-95 hover:bg-gray-400" onClick={() => setShowConfirm(false)}>Cancelar</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm cursor-pointer active:scale-95 hover:bg-red-600" onClick={handleDelete}>Sí, eliminar</button>
          </div>
        </div>
        </>
      )}

      {message && (

        <>
        <div className="fixed inset-0 bg-black/50 z-40"></div>
        <motion.div 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-red-500 text-white p-6 rounded-lg shadow-lg text-center text-sm z-50 flex items-center justify-between"
        >
          <span className="flex-1 text-center">{message}</span>
          <XCircle size={20} className="cursor-pointer hover:text-gray-200" onClick={() => setMessage(null)} />
        </motion.div>
        </>

      )}
      
      {/* Barra de herramientas */}
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4 gap-2 w-full">
        <h2 className="text-2xl font-semibold">Administrador de tienda</h2>
        <div className="flex items-center gap-2">
            <button 
            onClick={() => router.push("/routes/createbook")} 
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 whitespace-nowrap cursor-pointer">
            Agregar Tienda
            </button>
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <input 
                type="text" 
                placeholder="Título, Autor, Año, ISSN" 
                className="rounded-md px-3 py-2 pl-10 w-full border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Search size={18} className="absolute left-3 top-3 text-gray-500" />
            </div>
        </div>
      </div>
      
      {/* Tabla */}
      <div className="bg-white border rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4">Nombre de la tienda</th>
              <th className="py-2 px-4">Ubicación</th>
              {/* el estado es para el próximo sprint */}
              {/* <th className="py-2 px-4">Estado</th> */}
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => ( 
                <tr key={book.id} className="border-t">
                  <td className="py-2 px-4">{book.title}</td>
                  <td className="py-2 px-4">{book.author}</td>
 
                  <td className="py-2 px-4 text-center">
                    <span className="text-orange-500 cursor-pointer hover:underline"
                    onClick={() => (book.idLibro)}>
                        Editar</span>
                    <Trash2 size={18} className="inline ml-3 text-red-500 cursor-pointer hover:text-red-700" 
                    onClick={() => { setShowConfirm(true); setSelectedBook(book.idLibro);}} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShopStore;