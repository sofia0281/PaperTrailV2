"use client";
import { Router, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {getAllTiendasData, deleteTienda} from '@/services/tiendasCRUD';
import withAuthADMIN from '@/components/Auth/withAuthADMIN';
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
interface Tienda {
  id: number;
  Nombre: string;
  Departamento: string;
  Ciudad: string;
  idTienda: string;
  Region: string;
  Direction: string;
}

const ShopStore = () => {
  const router =  useRouter();
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTienda, setSelectedTienda] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  useEffect(() => {
    router.refresh(); // Esto forzará la recarga de los componentes del layout/navbar
  }, []);

    useEffect(() => {
        const fetchBooks = async () => {
          try {
            const data = await getAllTiendasData();
            console.log("tiendas data:", data)
            setTiendas(data);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
          } finally {
            setLoading(false);
          }
        };
    
        fetchBooks();
    }, []);

    if (loading) {
    return <div className="p-6 max-w-4xl mx-auto"><p>Cargando Tiendas...</p></div>;
    }

    if (error) {
      return <div className="p-6 max-w-4xl mx-auto"><p className="text-red-500">Error: {error}</p></div>;
    }

  const handleDelete = async () => {
    if (selectedTienda === null) return;
    try {
      await deleteTienda(selectedTienda);
      setTiendas(prev => prev.filter(book => book.idTienda !== selectedTienda));
      setMessage("Tienda eliminada exitosamente");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al eliminar la tienda:", error);
    } finally {
      setShowConfirm(false);
      setSelectedTienda(null);
    }
  };

  const handleEditar = (tiendaID: string) => {
    console.log("este es el id de la tienda:")
    console.log(tiendaID)
    router.push(`/routes/edittienda/${tiendaID}`);
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
              onClick={() => router.push("/routes/createtienda")} 
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 whitespace-nowrap cursor-pointer">
              Agregar Tienda
            </button>
            <div className="relative flex-grow md:flex-grow-0 md:w-64">
              <input 
                  type="text" 
                  placeholder="Buscar tienda..." 
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
              <th className="py-2 px-4">Región</th>
              <th className="py-2 px-4">Departamento</th>
              <th className="py-2 px-4">Ciudad</th>
              {/* <th className="py-2 px-4">Estado</th> */}
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiendas.map(tienda => ( 
                <tr key={tienda.id} className="border-t">
                  <td className="py-2 px-4">{tienda.Nombre}</td>
                  <td className="py-2 px-4">{tienda.Region}</td>
                  <td className="py-2 px-4">{tienda.Departamento}</td>
                  <td className="py-2 px-4">{tienda.Ciudad}</td>
                  <td className="py-2 px-4 text-center">
                    <span className="text-orange-500 cursor-pointer hover:underline"
                    onClick={() => handleEditar(tienda.idTienda)}>
                        Editar</span>
                    <Trash2 size={18} className="inline ml-3 text-red-500 cursor-pointer hover:text-red-700" onClick={() => { setShowConfirm(true); setSelectedTienda(tienda.idTienda);}} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuthADMIN(ShopStore);