'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getItemsByPedido } from '@/services/pedidosCRUD';
import { useAuth } from '@/context/AuthContext';

const PurchaseStatus = () => {
  const searchParams = useSearchParams();
  const { authUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [estadoPedido, setEstadoPedido] = useState('');

  const pedidoId = searchParams.get('id');

  useEffect(() => {
    const fetchData = async () => {
      if (!pedidoId) {
        setError('No se proporcionó ID de pedido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Obtener los items
        const response = await getItemsByPedido(pedidoId);
        const itemsData = Array.isArray(response?.data) ? response.data : [];

        // Extraer estado desde el primer ítem
        const estadoDesdeItems = itemsData[0]?.estado || 'Estado no disponible';
        setEstadoPedido(estadoDesdeItems);

        const calculatedTotal = itemsData.reduce((sum, item) => {
          return sum + (item.PrecioItem * item.Cantidad);
        }, 0);

        setItems(itemsData);
        setTotal(calculatedTotal);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos');
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pedidoId]);

  if (loading) return <div>Cargando detalles del pedido...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pedidoId) return <div>No se especificó un pedido</div>;

  return (
    <div>
      <h2>Detalles del pedido #{pedidoId}</h2>
      <p>Cliente: {authUser?.Nombre || "Usuario no identificado"}</p>
      <p><strong>Estado del pedido:</strong> {estadoPedido}</p>

      <h3>Productos:</h3>
      {items.length === 0 ? (
        <p>No hay productos en este pedido</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.IdItem}>
              {item.NombreProducto || 'Producto sin nombre'} - 
              Cantidad: {item.Cantidad} - 
              Precio: ${item.PrecioItem}
            </li>
          ))}
        </ul>
      )}
      
      <h3>Total: ${total.toLocaleString('es-CO')}</h3>
    </div>
  );
};

export default PurchaseStatus;
