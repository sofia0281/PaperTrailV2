"use client"
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getPedidosByUser } from "@/services/pedidosCRUD";

const PurchaseHistory = () => {
  const router = useRouter();
  const { authUser } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!authUser?.id) return;
      
      try {
        setLoading(true);
        const response = await getPedidosByUser(authUser.id);
        console.log ("pedidos del cliente: ",response)
        const formattedPurchases = response.data.map(pedido => ({
          idPedido: `#${pedido.idPedido.padStart(4, '0')}`,
          date: new Date(pedido.createdAt).toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          status: "Completado",
          total: pedido.TotalPrecio,
          originalData: pedido
        }));
        console.log("formattedPurchase", formattedPurchases)
        setPurchases(formattedPurchases);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [authUser]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center">
        <p>Cargando historial de compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 text-center text-red-500">
        <p>Error al cargar el historial: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <UserCircle size={28} />
          <span className="text-3xl font-semibold">Hola!, <span className="text-orange-500">{authUser?.username || "Usuario"}</span></span>
        </div>
        <h1 className="text-3xl font-bold mt-2 md:mt-0">Historial de compras</h1>
      </div>
      
      {/* Tabla */}
      <div className="bg-white border rounded-lg shadow-lg overflow-x-auto">
        {purchases.length === 0 ? (
          <div className="p-6 text-center">
            <p>No tienes pedidos registrados</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-orange-500 text-white">
                <th className="py-2 px-4">Orden de Compra</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Más Información</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.idPedido} className="border-t">
                  <td className="py-2 px-4">{purchase.idPedido}</td>
                  <td className="py-2 px-4">{purchase.date}</td>
                  <td className="py-2 px-4">{purchase.status}</td>
                  <td className="py-2 px-4">${purchase.total}</td>
                  <td className="py-2 px-4">
                    <button 
                      className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        router.push(`/routes/moreinfopurchase?id=${purchase.originalData.id}&documentId=${purchase.originalData.documentId}`);
                        
                      }}
                    >
                      Ver más
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;