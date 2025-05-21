'use client';

import { useEffect, useState } from 'react';
import ReturnRequestAdmin from './ReturnRequestAdmin';
import { getAllPedidos } from '@/services/pedidosCRUD';

export type ReturnRequest = {
  id: number;
  numeroFactura: string;
  numeroPedido: string;
  fechaCompra: string;
  producto: string;
  precio: number;
  cantidad: number;
  motivo: string;
  comentario: string;
  estado: 'Pendiente' | 'Revisado' | 'Rechazado';
};

export default function AllReturnRequests() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = (id: number, newStatus: ReturnRequest['estado']) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, estado: newStatus } : req
      )
    );
  };

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        setLoading(true);
        const response = await getAllPedidos();
        const pedidos = response?.data || [];

        // Filtrar solo pedidos que tienen estado de devolución
        const devoluciones = pedidos.filter((pedido: any) =>
          ['Pendiente', 'Revisado', 'Rechazado'].includes(pedido.estado)
        );

        const formatted = devoluciones.map((pedido: any) => ({
          id: pedido.id,
          numeroFactura: pedido.factura || 'Sin factura',
          numeroPedido: pedido.idPedido || 'Sin número',
          fechaCompra: new Date(pedido.Date).toLocaleDateString('es-ES'),
          producto: pedido.producto || 'Producto desconocido',
          precio: pedido.total || 0,
          cantidad: pedido.cantidad || 1,
          motivo: pedido.motivo || 'Sin motivo',
          comentario: pedido.comentario || '',
          estado: pedido.estado,
        }));

        setRequests(formatted);
      } catch (err: any) {
        console.error('Error al obtener devoluciones:', err);
        setError('Error al cargar las devoluciones');
      } finally {
        setLoading(false);
      }
    };

    fetchReturnRequests();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Cargando solicitudes de devolución...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-5xl font-bold mb-6 text-center">Solicitudes de Devolución</h1>
      <h2 className="text-3xl font-bold mb-2 text-start">Hola <span className='text-orange-500'>ADMIN</span></h2>
      <p className="text-lg mb-6 text-start">
        Aquí puedes gestionar las solicitudes de devolución de productos.
      </p>
      <div className="space-y-4">
        {requests.map((req) => (
          <ReturnRequestAdmin key={req.id} data={req} onUpdateStatus={updateStatus} />
        ))}
      </div>
    </div>
  );
}
