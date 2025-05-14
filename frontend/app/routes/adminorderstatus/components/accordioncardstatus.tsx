// components/OrderAccordion.tsx
'use client'
import { useState } from 'react';

const statusOptions = ['Recibido', 'Confirmado', 'Procesando', 'Enviado', 'Entregado'];

interface OrderAccordionProps {
  orderTitle: string;
  initialStatus: string;
  orderNumber: string;
  orderDate: string;
  shippingAddress: string;
  totalAmount: string;
}

export default function OrderAccordion({
  orderTitle,
  initialStatus,
  orderNumber,
  orderDate,
  shippingAddress,
  totalAmount,
}: OrderAccordionProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(initialStatus);

  const handleSave = () => {
    console.log(`Guardando estado para ${orderTitle}: ${status}`);
    // Aquí puedes conectar con una API para guardar
  };

  return (
    <div className="border rounded-lg shadow-sm mb-4 bg-orange-400 text-white">
      <button
        onClick={() => setOpen(!open)}
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

          <div className="mt-2">
            <label className="block mb-1 font-medium">Cambiar Estado del Pedido</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border px-3 py-1 rounded w-full sm:w-1/2 cursor-pointer"
            >
              {statusOptions.map((opt, i) => (
                <option key={i} value={opt} >{opt}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="mt-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded cursor-pointer"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
}
