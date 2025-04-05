"use client";
import { Router, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ManageBooks = () => {
  const router =  useRouter();
  const books = [
    { title: "Libro 1", author: "NN", price: 130000, quantity: 200, status: "Disponible" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Encabezado */}
      <h1 className="text-3xl font-bold text-center mb-4">Administrar Libros</h1>
      
      {/* Barra de herramientas */}
      <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-4 gap-2 w-full">
        <button 
        onClick={() => router.push("/routes/createbook")} 
        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 whitespace-nowrap cursor-pointer">
          Agregar Libro
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
      
      {/* Tabla */}
      <div className="bg-white border rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4">Título</th>
              <th className="py-2 px-4">Autor</th>
              <th className="py-2 px-4">Precio</th>
              <th className="py-2 px-4">Cantidad</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{book.title}</td>
                <td className="py-2 px-4">{book.author}</td>
                <td className="py-2 px-4">${book.price.toLocaleString()}</td>
                <td className="py-2 px-4">{book.quantity}</td>
                <td className="py-2 px-4">{book.status}</td>
                <td className="py-2 px-4 text-center">
                  <span className="text-orange-500 cursor-pointer hover:underline">Editar</span>
                  <Trash2 size={18} className="inline ml-3 text-red-500 cursor-pointer hover:text-red-700" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBooks;