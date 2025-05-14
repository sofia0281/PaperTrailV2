// components/OrderStatus.tsx
'use client';

import { useState } from 'react';

interface Step {
  label: string;
  icon: string;
}

interface OrderStatusProps {
  orderNumber: string;
  orderDate: string;
  shippingAddress: string;
  total: number;
  currentStep: number;
  steps: Step[];
}

export default function OrderStatus({
  orderNumber,
  orderDate,
  shippingAddress,
  total,
  currentStep,
  steps,
}: OrderStatusProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg shadow-sm bg-orange-400 text-white">
      <button
        className="w-full flex justify-between items-center p-4 font-semibold text-left cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        Pedido activo {orderNumber}
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="p-4 border-t text-sm text-gray-700 bg-white">
          <p>Nro. Pedido: {orderNumber}</p>
          <p>Fecha del pedido: {orderDate}</p>
          <p>Dirección de envío: {shippingAddress}</p>
          <p>Total: ${total.toLocaleString('es-CO')}</p>
          <p className="mb-4">
            Estado del pedido:{' '}
            <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold">
              {steps[currentStep].label}
            </span>
          </p>

          <div className="flex justify-between items-center gap-2 overflow-x-auto">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-xs font-semibold"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-xl ${
                    index === currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {step.icon}
                </div>
                <p
                  className={`mt-1 text-center ${
                    index === currentStep ? 'text-blue-600' : 'text-gray-600'
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
