'use client';

import { useState } from 'react';
import { getItemsByPedidoId } from '@/services/pedidosCRUD';


interface Step {
  label: string;
  icon: string;
}

interface OrderItem {
  Id: string;
  Title?: string;  // Usamos Title en lugar de NombreProducto según tu JSON
  TotalProdcutos?: number;
  PrecioItem?: number;
  estado?: string;
}

interface OrderStatusProps {
  id: number;
  orderNumber: string;
  orderDate: string;
  shippingAddress: string;
  nombreCliente: string;
  total: number;
  estadoPedido: string;
  items?: OrderItem[];
  steps: Step[];
}





export default function OrderStatus({
  id,
  orderNumber,
  orderDate,
  shippingAddress,
  nombreCliente,
  total,
  estadoPedido,
  items = [],
  steps,
}: OrderStatusProps) {
  const [open, setOpen] = useState(false);
  const [pedidoItems, setPedidoItems] = useState<OrderItem[]>([]);
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '$0';
    try {
      return `$${price.toLocaleString('es-CO')}`;
    } catch {
      return `$${price}`;
    }
  };

  const handleToggle = async () => {
    setOpen(!open);
    console.log('ID del pedido-----:', id);

    if (!open) {
      console.log('Abriendo pedido:', id);
      const fetchedItems = await getItemsByPedidoId(Number(orderNumber));
      setPedidoItems(fetchedItems);
    }
  };

  // Función para obtener el nombre del producto
  const getProductName = (item: OrderItem) => {
    return item.Title || 'Producto sin nombre';
  };

  // Función para obtener la cantidad
  const getQuantity = (quantity?: number) => {
    return quantity !== undefined ? quantity : 0;
  };

  // Mapeo de estados del backend a índices de pasos
  const estadoToStepIndex: Record<string, number> = {
    'Recibido': 0,
    'Confirmado': 1,
    'Procesando': 2,
    'Enviado': 3,
    'Entregado': 4,
    'Estado no disponible': 0
  };

  const currentStep = estadoToStepIndex[estadoPedido] || 0;

  return (
    <div className="border rounded-lg shadow-sm bg-orange-400 text-white">
      <button
  className="w-full flex justify-between items-center p-4 font-semibold text-left cursor-pointer"
  onClick={handleToggle}
>
  Pedido #{orderNumber}
  <span>{open ? '▲' : '▼'}</span>
</button>


      {open && (
        <div className="p-4 border-t text-sm text-gray-700 bg-white">
          <div className="mb-4">
            <p className="font-semibold">Nro. Pedido: {orderNumber}</p>
            <p>Fecha: {orderDate}</p>
            <p>Dirección: {shippingAddress}</p>
            <p>Nombre del Destinatario: {nombreCliente}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Productos:</h3>
            {pedidoItems.length === 0 ? (
              <p>No hay productos en este pedido</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {pedidoItems.map((item) => (
                  <li key={item.Id}>
                    {getProductName(item)} - 
                    Cantidad: {getQuantity(item.TotalProdcutos)} - 
                    Precio: {formatPrice(item.PrecioItem)}
                  </li>
                ))}
              </ul>
            )}

          </div>

          <p className="font-semibold mb-4">
            Total: {formatPrice(total)}
          </p>

          <div className="mb-4">
            <p>
              Estado del pedido:{' '}
              <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">
                {estadoPedido}
              </span>
            </p>
          </div>

          <div className="flex justify-between items-center gap-2 overflow-x-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-xs font-semibold min-w-[60px]"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-xl ${
                    index <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {step.icon}
                </div>
                <p
                  className={`mt-1 text-center ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}