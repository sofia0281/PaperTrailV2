'use client';
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { getItemsFromPedido } from '@/services/pedidosCRUD';
import CardMoreInfoPurchase from '@/components/ui/cardmoreinfopurchase';
import { useAuth } from '@/context/AuthContext';

const MorePurchaseHistory = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { authUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Obtener el ID del pedido de la URL
  const pedidoId = searchParams.get('id');

  useEffect(() => {
    const fetchItems = async () => {
      if (!pedidoId) return;
      
      try {
        setLoading(true);
        const response = await getItemsFromPedido (pedidoId);
        console.log("Esto es lo que se extrajo ", response);
        // Calcular el total sumando todos los items
        const calculatedTotal = response.reduce((sum, item) => {
          return sum + (item.PrecioItem * item.Cantidad);
        }, 0);
        
        setItems(response);
        setTotal(calculatedTotal);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [pedidoId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p>Cargando detalles del pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-10 text-red-500">
        <p>Error al cargar el pedido: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
      {/* Div 1: Productos */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-6">
          Detalles de tu pedido, <span className='text-orange-500'>{authUser?.Nombre || "Usuario"}</span>
        </h2>
        
        {items.length === 0 ? (
          <p>No se encontraron productos en este pedido</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <CardMoreInfoPurchase 
                key={item.IdItem}
                item={item}
              />
            ))}
          </div>
        )}
      </div>

      {/* Div 2: Total y botón */}
      <div className="w-full md:w-1/3 flex flex-col justify-between h-full space-y-6">
        <div className="mt-14 border rounded-xl p-4 bg-white shadow-sm flex justify-between items-center font-semibold text-lg">
          <span>Total</span>
          <span>${total.toLocaleString('es-CO')}</span>
        </div>

        <div className="mt-auto">
          <button className="cursor-pointer bg-red-700 hover:bg-red-800 text-white w-full py-2 rounded-lg font-medium">
            Solicitar Devolución
          </button>
          <button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white p-2 mt-2 rounded-lg font-medium"
          onClick={()=>{router.push('/routes/purchasehistory')}}>
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MorePurchaseHistory;