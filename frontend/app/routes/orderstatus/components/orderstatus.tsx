'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPedidosByUser } from '@/services/pedidosCRUD';
import { useAuth } from '@/context/AuthContext';
import OrderStatus from './activeorders';

const steps = [
  { label: 'Pedido Recibido', icon: '🛍️' },
  { label: 'Pedido Confirmado', icon: '✔️' },
  { label: 'Procesando Pedido', icon: '📦' },
  { label: 'Pedido Enviado', icon: '📤' },
  { label: 'Entregado', icon: '🏁' },
];

export default function ActiveOrders() {
  const searchParams = useSearchParams();
  const { authUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  const pedidoId = searchParams.get('id');

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        
        if (!authUser?.id) {
          setError('Usuario no autenticado');
          return;
        }

        // Obtener todos los pedidos del usuario
        const response = await getPedidosByUser(authUser.id);
        console.log("ID del usuario:", authUser.id);
        const primerPedido = response.data[0];
        console.log("Pedidos response:", response);
  
 

        const pedidos = response.data || [];
        console.log("Pedidos:", pedidos);

        // Transformar los datos para mostrarlos
        const ordersData = pedidos.map(pedido => ({
          id: pedido.id,
          orderNumber: pedido.idPedido || `#${pedido.id.toString().padStart(4, '0')}`,
          orderDate: pedido.createdAt 
            ? new Date(pedido.createdAt).toLocaleDateString() 
            : new Date().toLocaleDateString(),
          shippingAddress: primerPedido.usuario.Direccion,
          total: pedido.TotalPrecio || 0,
          estadoPedido: pedido.estado || 'Estado no disponible',
          items: pedido.items || [] // Asumiendo que la API ya incluye los items
        }));
        

        setOrders(ordersData);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [authUser]);

  if (loading) return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
      <p className="mt-4">Cargando pedidos...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-8 text-center text-red-500">
      <p>Error: {error}</p>
      <button 
        className="mt-4 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
        onClick={() => window.location.reload()}
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-5xl font-bold">
        Hola, <span className="text-orange-600">{authUser?.Nombre || 'Usuario'}</span>
      </h1>
      <p className="text-gray-600 mt-2">
        {pedidoId ? 'Detalles de tu pedido' : 'Tus pedidos activos'}
      </p>

      <div className="mt-6 space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <OrderStatus
              key={order.orderNumber}
              id={order.id}
              orderNumber={order.orderNumber}
              orderDate={order.orderDate}
              shippingAddress={order.shippingAddress}
              total={order.total}
              estadoPedido={order.estadoPedido}
              items={order.items}
              steps={steps}
            />
          ))
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p>No hay pedidos para mostrar</p>
            
          </div>
        )}
      </div>

      <div className="mt-8">
        <button 
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded"
          onClick={() => window.location.href = '/'}
        >
          Volver al menú principal
        </button>
      </div>
    </div>
  );
}