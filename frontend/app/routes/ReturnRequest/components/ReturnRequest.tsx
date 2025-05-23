'use client'

import { useEffect, useState } from 'react';
import EncabezadoDevolucion from './EncabezadoDevolucion';
import { useSearchParams } from 'next/navigation';
import { getItemsFromPedido, getPedidoById, updatePedidoRequest } from '@/services/pedidosCRUD'; 
import { useRouter } from 'next/navigation';

export default function ReturnRequest() {
  const searchParams = useSearchParams();
  const factura = searchParams.get('id');
  const pedido = searchParams.get('pedido');
  const documentId = searchParams.get('documentId');

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('No era lo que esperaba.');
  const [comments, setComments] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      if (!factura) return;

      try {
        setLoading(true);
        const response = await getItemsFromPedido(factura);
        setProductos(response);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setToastMessage("❌ Error al obtener productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [factura]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePedidoRequest(documentId, 'Pendiente', reason, comments);
      setToastMessage('✅ Solicitud de devolución enviada correctamente.');
      setTimeout(() => {
        router.push('/routes/purchasehistory');
      }, 2000);
    } catch (err) {
      setToastMessage('❌ Error al enviar la solicitud: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-[#C14A20] text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      {/* Encabezado */}
      <div className="w-full max-w-8xl min-h-[300px] relative overflow-hidden text-white mb-4 m-0">
        <img
          src="/img/banner.png"
          alt="Encabezado"
          className="absolute inset-0 w-full h-full object-fill"
        />
        <EncabezadoDevolucion
          numeroFactura={factura}
          numeroPedido={pedido}
          fechaCompra="14/05/2025"
        />
      </div>

      {/* Contenido principal */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pedido */}
        <div className="border-2 border-[#C14A20] rounded-lg p-4 m-6">
          <h3 className="text-lg font-bold mb-3">Tu pedido</h3>
          <div>
            <div className="grid grid-cols-3 font-semibold text-sm border-b pb-2 mb-2">
              <span>Productos</span>
              <span>Precio</span>
              <span>Cantidad</span>
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Cargando productos del pedido...</p>
            ) : productos.length === 0 ? (
              <p className="text-sm text-red-500">No se encontraron productos en este pedido.</p>
            ) : (
              productos.map((producto, index) => (
                <div key={index} className="grid grid-cols-3 text-sm mb-1">
                  <span>{producto?.Title || 'Producto'}</span>
                  <span>${(producto?.PrecioItem || 0).toLocaleString('es-CO')}</span>
                  <span>{producto?.Cantidad || 0}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Motivo de devolución */}
        <div>
          <form className="space-y-4 m-6" onSubmit={handleSubmit}>
            <div className="space-y-2 text-sm">
              {["No era lo que esperaba.", "Llegó en mal estado.", "Recibí un libro incorrecto."].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="reason"
                    value={opt}
                    checked={reason === opt}
                    onChange={(e) => setReason(e.target.value)}
                    className="accent-[#C14A20]"
                  />
                  {opt}
                </label>
              ))}
            </div>

            <textarea
              placeholder="Cuéntanos más sobre tu devolución (opcional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full h-24 border rounded px-3 py-2 text-sm resize-none"
            />

            <button
              type="submit"
              className="bg-[#C14A20] hover:bg-[#a73e1a] text-white font-semibold px-6 py-2 rounded cursor-pointer"
            >
              Solicitar Devolución
            </button>
          </form>
        </div>
      </div>

      {/* Botón cancelar */}
      <div className='w-full max-w-6xl flex justify-start mt-8 ml-12 mb-8'>
        <button
          className="bg-[#C14A20] hover:bg-[#a73e1a] text-white font-semibold px-6 py-2 rounded cursor-pointer"
          onClick={() => router.back()}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
