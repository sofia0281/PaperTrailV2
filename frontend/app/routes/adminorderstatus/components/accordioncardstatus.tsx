'use client'
import { useState, useRef, useEffect } from 'react';
import { updatePedidoStatus, getItemsByPedido } from '@/services/pedidosCRUD';
import { useRouter } from "next/navigation";
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
  const [savedStatus, setSavedStatus] = useState(status); // Nuevo estado para rastrear el estado guardado
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState(null);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false); // Estado para controlar el guardado
  const router =  useRouter();
  
  useEffect(() => {
    router.refresh(); // Esto forzará la recarga de los componentes del layout/navbar
  }, []);
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(open ? contentRef.current.scrollHeight : 0);
    }
  }, [open, items, loadingItems, error]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePedidoStatus(orderId, status);
      console.log(`Estado actualizado para pedido ${orderId}: ${status}`);
      setSavedStatus(status); // Actualizamos el estado guardado
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado');
      console.error("Error updating status:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const fetchItems = async () => {
    try {
      setLoadingItems(true);
      const response = await getItemsByPedido(orderId);
      setItems(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar los items');
      console.error("Error fetching items:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleToggle = () => {
    if (!open) {
      fetchItems();
    }
    setOpen(!open);
  };

  // Verificamos si hay cambios no guardados
  const hasUnsavedChanges = status !== savedStatus;

  return (
    <div
      className={`border rounded-lg shadow-sm mb-4 overflow-hidden transition-all duration-300 ${
        savedStatus === 'Entregado' ? 'bg-green-500' : 'bg-orange-400'
      }`}
    >
      <button
        onClick={handleToggle}
        className="w-full p-4 text-left font-semibold flex justify-between items-center cursor-pointer text-white"
      >
        {orderTitle}
        <span className="transition-transform duration-300">
          {open ? '▲' : '▼'}
        </span>
      </button>

      <div
        ref={contentRef}
        className="bg-white transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: `${contentHeight}px`,
          opacity: open ? 1 : 0.8,
        }}
      >
        <div className="p-4 border-t text-sm text-gray-700 space-y-2">
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
              disabled={savedStatus === 'Entregado'} // Solo deshabilitar si el estado guardado es Entregado
              className={`border px-3 py-1 rounded w-full sm:w-1/2 cursor-pointer ${
                savedStatus === 'Entregado' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : ''
              }`}
            >
              {statusOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={savedStatus === 'Entregado' || !hasUnsavedChanges || isSaving}
            className={`mt-3 px-4 py-2 rounded cursor-pointer text-white ${
              savedStatus === 'Entregado' || !hasUnsavedChanges
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          {hasUnsavedChanges && savedStatus !== 'Entregado' && (
            <div className="text-sm text-yellow-600 mt-2">
              Tienes cambios sin guardar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}