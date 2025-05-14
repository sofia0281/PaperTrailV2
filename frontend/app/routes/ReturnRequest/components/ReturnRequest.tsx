'use client'
import { useState } from 'react';
import EncabezadoDevolucion from './EncabezadoDevolucion';

export default function ReturnRequest() {
  const [reason, setReason] = useState('No era lo que esperaba.');
  const [comments, setComments] = useState('');
  
  const productos = [
  { nombre: 'Libro 1', precio: '$150.000', cantidad: 1 },
  { nombre: 'Libro 2', precio: '$90.000', cantidad: 2 },
  // Puedes agregar más productos
];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* Encabezado */}
        <div className="w-full max-w-8xl min-h-[300px] relative overflow-hidden text-white mb-4 m-0">
            <img
                src="/img/banner.png"
                alt="Encabezado"
                className="absolute inset-0 w-full h-full object-fill"
            />
        <EncabezadoDevolucion
        numeroFactura="123456789"
        numeroPedido="987654321"
        fechaCompra="14/05/2025"
        />

    </div>

        {/* Contenido principal con Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pedido */}
        <div className="border-2 border-[#C14A20] rounded-lg p-4 m-6">
            <h3 className="text-lg font-bold mb-3">Tu pedido</h3>
              <div>
                {/* Encabezados */}
                <div className="grid grid-cols-3 font-semibold text-sm border-b pb-2 mb-2">
                <span>Productos</span>
                <span>Precio</span>
                <span>Cantidad</span>
                </div>

                {/* Productos dinámicos */}
                {productos.map((producto, index) => (
                <div key={index} className="grid grid-cols-3 text-sm mb-1">
                    <span>{producto.nombre}</span>
                    <span>{producto.precio}</span>
                    <span>{producto.cantidad}</span>
                </div>
                ))}
            </div>
        </div>

        {/* Motivo de devolución */}
        <div>
            <form className="space-y-4 m-6">
            <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name="reason"
                    value="No era lo que esperaba."
                    checked={reason === 'No era lo que esperaba.'}
                    onChange={(e) => setReason(e.target.value)}
                    className="accent-[#C14A20]"
                />
                No era lo que esperaba.
                </label>

                <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name="reason"
                    value="Llegó en mal estado."
                    checked={reason === 'Llegó en mal estado.'}
                    onChange={(e) => setReason(e.target.value)}
                    className="accent-[#C14A20]"
                />
                Llegó en mal estado.
                </label>

                <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name="reason"
                    value="Recibí un libro incorrecto."
                    checked={reason === 'Recibí un libro incorrecto.'}
                    onChange={(e) => setReason(e.target.value)}
                    className="accent-[#C14A20]"
                />
                Recibí un libro incorrecto.
                </label>
            </div>

            {/* Comentarios */}
            <textarea
                placeholder="Cuéntanos más sobre tu devolución (opcional)"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full h-24 border rounded px-3 py-2 text-sm resize-none"
            />

            {/* Botón de solicitud */}
            <button
                type="submit"
                className="bg-[#C14A20] hover:bg-[#a73e1a] text-white font-semibold px-6 py-2 rounded cursor-pointer"
            >
                Solicitar Devolución
            </button>
            </form>
         </div>
        </div>

        <div className='w-full max-w-6xl flex justify-start mt-8 ml-12 mb-8'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded cursor-pointer" >
                Cancelar
            </button>
        </div>
    </div>
  );
}
