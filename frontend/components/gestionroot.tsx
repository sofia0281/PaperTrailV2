"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuthROOT from '@/components/withAuthROOT';
import { getAdminsData, deleteAdmin } from '@/services/adminCRUD';
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

interface Admin {
  id: number;
  username: string;
  Nombre: string;
  Apellido: string;
  createdAt: string;
}

const GestionRoot = () => {
  useEffect(() => {
    router.refresh(); // Esto forzará la recarga de los componentes del layout/navbar
  }, []);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await getAdminsData();
        setAdmins(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleEditar = (adminID: number) => {
    console.log(adminID)
    router.push(`/routes/editadmin/${adminID}`);
  };

  const handleDelete = async () => {
    if (selectedAdmin === null) return;
    try {
      await deleteAdmin(selectedAdmin);
      setAdmins(prev => prev.filter(admin => admin.id !== selectedAdmin));
      setMessage("Administrador eliminado exitosamente");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    } finally {
      setShowConfirm(false);
      setSelectedAdmin(null);
    }
  };


  if (loading) {
    return <div className="p-6 max-w-4xl mx-auto"><p>Cargando administradores...</p></div>;
  }

  if (error) {
    return <div className="p-6 max-w-4xl mx-auto"><p className="text-red-500">Error: {error}</p></div>;
 }


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">GESTION ROOT</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600"><strong>Administradores</strong> · Cantidad: {admins.length}</p>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            onClick={() => router.push('/routes/createadmin')}
          >
            Crear administrador
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-80 text-center border z-50">
          <p className="text-lg font-semibold">¿Estás seguro?</p>
          <p className="text-gray-600 text-sm mt-2">Esta acción no se puede deshacer.</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm" onClick={() => setShowConfirm(false)}>Cancelar</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm" onClick={handleDelete}>Sí, eliminar</button>
          </div>
        </div>
      )}

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-red-500 text-white p-6 rounded-lg shadow-lg text-center text-sm z-50 flex items-center justify-between"
        >
          <span className="flex-1 text-center">{message}</span>
          <XCircle size={20} className="cursor-pointer hover:text-gray-200" onClick={() => setMessage(null)} />
        </motion.div>
      )}

      <div className="space-y-4">
        {admins.map(admin => (
          <div key={admin.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{admin.Nombre}</h3>
                <p className="text-gray-500 text-sm">@{admin.username}</p>
                <p className="text-gray-500 text-sm">Creado: {admin.createdAt}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="text-red-600 border border-red-600 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  onClick={() => { setShowConfirm(true); setSelectedAdmin(admin.id); }}
                >
                  ELIMINAR
                </button>
                <button 
                  className="text-blue-600 border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  onClick={() => handleEditar(admin.id)}
                >
                  EDITAR
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuthROOT(GestionRoot);