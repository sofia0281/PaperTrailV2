'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReturnRequest } from './AllReturnRequests';

type Props = {
  data: ReturnRequest;
  onUpdateStatus: (id: number, newStatus: ReturnRequest['estado']) => void;
};

export default function ReturnRequestCard({ data, onUpdateStatus }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  return (
    <div className="border rounded-lg shadow bg-white">
      <button
        onClick={toggleOpen}
        className={`cursor-pointer w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-100 ${
          data.estado === 'Pendiente'
            ? 'bg-yellow-100'
            : data.estado === 'Revisado'
            ? 'bg-green-100'
            : 'bg-red-100'
        }`}
      >
        <div>
          <p className="text-sm font-semibold">
            Pedido #{data.numeroPedido} - {data.producto}
          </p>
          <p className="text-xs text-gray-600">Motivo: {data.motivo}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-bold ${
              data.estado === 'Pendiente'
                ? 'text-yellow-600'
                : data.estado === 'Revisado'
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {data.estado}
          </span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="border-t px-4 py-4 text-sm grid gap-2">
          <p><strong>Factura:</strong> {data.numeroFactura}</p>
          <p><strong>Fecha de Compra:</strong> {data.fechaCompra}</p>
          <p><strong>Precio:</strong> ${data.precio.toLocaleString()}</p>
          <p><strong>Cantidad:</strong> {data.cantidad}</p>
          <p><strong>Comentarios:</strong> {data.comentario || 'Ninguno'}</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => onUpdateStatus(data.id, 'Revisado')}
              className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Marcar como Revisado
            </button>
            <button
              onClick={() => onUpdateStatus(data.id, 'Rechazado')}
              className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Rechazar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
