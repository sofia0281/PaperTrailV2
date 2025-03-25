"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import withAuth from '@/components/withAuth';
import { getAdminsData, deleteAdmin } from '@/services/adminCRUD';

interface Admin {
  id: number;
  username: string;
  Nombre: string;
  Apellido: string;
  createdAt: string;
}

const GestionRoot = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  if (loading) {
    setAdmins(prev => prev.filter(admin => admin.id !== adminID));
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p>Cargando administradores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  const handleEditar = (adminID) => {
    console.log("id:", adminID)
    router.push(`/routes/editadmin/${adminID}`);

  };
  const handleDelete = async (adminID) => {
    try {
    const dataEliminado = await deleteAdmin(adminID);
    console.log('Administrador eliminado:', dataEliminado);
    setAdmins(prev => prev.filter(admin => admin.id !== adminID));
    

    }catch(error) {
      console.error("Error al eliminar usuario:", error);
    }
  }
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">GESTION ROOT</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            <strong>Administradores</strong> · Cantidad: {admins.length}
          </p>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            onClick={() => router.push('/routes/createadmin')}
          >
            Crear administrador
          </button>
        </div>
      </div>

      {/* Lista de administradores */}
      <div className="space-y-4">
        {admins.map(admin => (
          <div key={admin.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">
                  {admin.Nombre}
                </h3>
                <p className="text-gray-500 text-sm">@{admin.username}</p>
                <p className="text-gray-500 text-sm">Creado: {admin.createdAt}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="text-red-600 border border-red-600 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                  onClick={() => handleDelete(admin.id)}
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

export default withAuth(GestionRoot);