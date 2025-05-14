'use client';

import ConfirmedOrders from './activeorders';

const steps = [
  { label: 'Pedido Recibido', icon: '🛍️' },
  { label: 'Pedido Confirmado', icon: '✔️' },
  { label: 'Procesando Pedido', icon: '📦' },
  { label: 'Pedido Enviado', icon: '📤' },
  { label: 'Entregado', icon: '🏁' },
];

const orders = [
  {
    orderNumber: '2',
    orderDate: '2025-05-14',
    shippingAddress: 'Cra 10 #23-45, Bogotá',
    total: 240000,
    currentStep: 2,
  },
  {
    orderNumber: '1',
    orderDate: '2025-05-12',
    shippingAddress: 'Cl 45 #12-34, Medellín',
    total: 180000,
    currentStep: 1,
  },
];

export default function ActiveOrders() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-5xl font-bold">
        Hola, <span className="text-orange-600">Usuario</span>
      </h1>
      <p className="text-gray-600 mt-2">Estos son tus pedidos activos</p>

      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <ConfirmedOrders
            key={order.orderNumber}
            orderNumber={order.orderNumber}
            orderDate={order.orderDate}
            shippingAddress={order.shippingAddress}
            total={order.total}
            currentStep={order.currentStep}
            steps={steps}
          />
        ))}
      </div>
    </div>
  );
}
