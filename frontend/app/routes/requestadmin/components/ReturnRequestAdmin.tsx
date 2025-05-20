'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ReturnRequest = {
  id: number;
  numeroFactura: string;
  numeroPedido: string;
  fechaCompra: string;
  producto: string;
  precio: number;
  cantidad: number;
  motivo: string;
  comentarios?: string;
  estado: 'Pendiente' | 'Revisado' | 'Rechazado';
};

const mockData: ReturnRequest[] = [
  {
    id: 1,
    numeroFactura: '123456789',
    numeroPedido: '987654321',
    fechaCompra: '15/05/2025',
    producto: 'Libro 1',
    precio: 150000,
    cantidad: 1,
    motivo: 'Llegó en mal estado.',
    comentarios: 'La caja estaba abierta.',
    estado: 'Pendiente',
  },
  {
    id: 2,
    numeroFactura: '222222222',
    numeroPedido: '888888888',
    fechaCompra: '12/05/2025',
    producto: 'Libro 2',
    precio: 120000,
    cantidad: 2,
    motivo: 'No era lo que esperaba.',
    estado: 'Revisado',
  },
];

export default function AdminReturnRequests() {
  const [requests, setRequests] = useState<ReturnRequest[]>(mockData);
  const [openIds, setOpenIds] = useState<number[]>([]);

  const toggleOpen = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((openId) => openId !== id) : [...prev, id]
    );
  };

  const updateStatus = (id: number, newStatus: ReturnRequest['estado']) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, estado: newStatus } : req
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-5xl font-bold mb-6 text-center">Solicitudes de Devolución</h1>
      <h2 className="text-3xl font-bold mb-2 text-start">Hola <span className='text-orange-500'>ADMIN</span></h2>
      <p className="text-lg mb-6 text-start">
        Aquí puedes gestionar las solicitudes de devolución de productos.
        <br />
      </p>
      <div className="space-y-4">
        {requests.map((req) => {
          const isOpen = openIds.includes(req.id);
          return (
            <div key={req.id} className="border rounded-lg shadow bg-white">
              <button
                onClick={() => toggleOpen(req.id)}
                className={`cursor-pointer w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-100 ${
                      req.estado === 'Pendiente'
                        ? 'bg-yellow-100'
                        : req.estado === 'Revisado'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
              >
                <div>
                  <p className="text-sm font-semibold">
                    Pedido #{req.numeroPedido} - {req.producto}
                  </p>
                  <p className="text-xs text-gray-600">Motivo: {req.motivo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold ${
                      req.estado === 'Pendiente'
                        ? 'text-yellow-600'
                        : req.estado === 'Revisado'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {req.estado}
                  </span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t px-4 py-4 text-sm grid gap-2">
                  <p><strong>Factura:</strong> {req.numeroFactura}</p>
                  <p><strong>Fecha de Compra:</strong> {req.fechaCompra}</p>
                  <p><strong>Precio:</strong> ${req.precio.toLocaleString()}</p>
                  <p><strong>Cantidad:</strong> {req.cantidad}</p>
                  <p><strong>Comentarios:</strong> {req.comentarios || 'Ninguno'}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => updateStatus(req.id, 'Revisado')}
                      className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                    >
                      Marcar como Revisado
                    </button>
                    <button
                      onClick={() => updateStatus(req.id, 'Rechazado')}
                      className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
