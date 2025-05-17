'use client'
import OrderAccordion from './accordioncardstatus';
import { useEffect, useState } from 'react';
import { getAllPedidos } from '@/services/pedidosCRUD';
import { useAuth } from '@/context/AuthContext';

export default function AdminPedidos() {
  const { authUser } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (isoString: string) => {
    console.log("ISO String:", isoString);
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  
  // Luego en el componente
  
  

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await getAllPedidos();
        console.log("Pedidos response:", response);
        setPedidos(response.data || []);
      } catch (err) {
        setError(err.message || 'Error al cargar los pedidos');
        console.error("Error fetching pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Administrar Pedidos</h1>
        <div className="text-center">Cargando pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">Administrar Pedidos</h1>
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Administrar Pedidos</h1>
      <h2 className='text-2xl font-semibold mb-6'>Hola <span className='font-bold text-orange-500'>Admin,</span> aquí puedes administrar los pedidos</h2>

      {pedidos.length === 0 ? (
        <div className="text-center py-8">No hay pedidos para mostrar</div>
      ) : (
        pedidos.map((pedido) => (
          <OrderAccordion 
            key={pedido.id}
            orderId={pedido.id}
            orderTitle={`Pedido ${pedido.estado.toLowerCase()}`} 
            initialStatus={pedido.estado} 
            orderNumber={pedido.idPedido} 
            orderDate={formatDate(pedido.Date)}
            shippingAddress={pedido.direccionEnvio || 'Dirección no especificada'} 
            totalAmount={`$${pedido.total?.toLocaleString() || '0'}`} 
          />
        ))
      )}
      
      <div className='mt-16'>
        <button className="mt-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded cursor-pointer">
          Volver menu principal
        </button>
      </div>
    </div>
  );
}