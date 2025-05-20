'use client'
import { useState } from 'react';
import { updatePedidoStatus, getItemsByPedido } from '@/services/pedidosCRUD';

const statusOptions = ['Recibido', 'Confirmado', 'Procesando', 'Enviado', 'Entregado'];

interface OrderAccordionProps {
  orderId: string | number;
  orderTitle: string;
  initialStatus: string;
  orderNumber: string;
  orderDate: string;
  shippingAddress: string;
  totalAmount: string;
}

export default function OrderAccordion({
  orderId,
  orderTitle,
  initialStatus,
  orderNumber,
  orderDate,
  shippingAddress,
  totalAmount,
}: OrderAccordionProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(
    statusOptions.includes(initialStatus) ? initialStatus : statusOptions[0]
  );
  
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    try {
      await updatePedidoStatus(orderId, status);
      console.log(`Estado actualizado para pedido ${orderId}: ${status}`);
      // Podrías añadir aquí una notificación de éxito
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado');
      console.error("Error updating status:", err);
    }
  };

  const fetchItems = async () => {
    if (!open) {
      setOpen(true);
      return;
    }

    try {
      setLoadingItems(true);
      console.log("Fetching items for order ID:", orderId); 
      const response = await getItemsByPedido(orderId);
      console.log("Items response:", response);
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los items');
      console.error("Error fetching items:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleToggle = () => {
    if (open) {
      setOpen(false);
    } else {
      fetchItems();
    }
  };

  return (
    <div
      className={`border rounded-lg shadow-sm mb-4 text-white ${
        status === 'Entregado' ? 'bg-green-500' : 'bg-orange-400'
      }`}
    >

      <button
        onClick={handleToggle}
        className="w-full p-4 text-left font-semibold flex justify-between items-center cursor-pointer"
      >
        {orderTitle}
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-4 border-t text-sm text-gray-700 space-y-2 bg-white">
          <p><strong>Nro. Pedido:</strong> {orderNumber}</p>
          <p><strong>Fecha del pedido:</strong> {orderDate}</p>
          <p><strong>Dirección de envío:</strong> {shippingAddress}</p>
          <p><strong>Total:</strong> {totalAmount}</p>

          {loadingItems ? (
            <div className="py-4 text-center">Cargando detalles del pedido...</div>
          ) : error ? (
            <div className="text-red-500 py-2">{error}</div>
          ) : (
            <>
              {items.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Productos:</h4>
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li key={index} className="border-b pb-2">
                        {item.nombre} - Cantidad: {item.cantidad} - ${item.precio?.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <div className="mt-4">
            <label className="block mb-1 font-medium">Cambiar Estado del Pedido</label>
            <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={status === 'Entregado'}
            className={`border px-3 py-1 rounded w-full sm:w-1/2 cursor-pointer ${
              status === 'Entregado' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''
            }`}
          >

              {statusOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={status === 'Entregado'}
            className={`mt-3 px-4 py-2 rounded cursor-pointer text-white ${
              status === 'Entregado'
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            Guardar Cambios
          </button>

        </div>
      )}
    </div>
  );
}