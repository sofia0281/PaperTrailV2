// app/admin/page.tsx
'use client'
import OrderAccordion from './accordioncardstatus';

export default function AdminPedidos() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Administrar Pedidos</h1>
      <h2 className='text-2xl font-semibold mb-6'>Hola <span className='font-bold text-orange-500'>Admin,</span> aquí puedes administrar los pedidos</h2>

      <OrderAccordion 
        orderTitle="Pedido activo 2" 
        initialStatus="Procesando" 
        orderNumber="0002" 
        orderDate="2025-05-13" 
        shippingAddress="Cra. 15 #23-45, Bogotá" 
        totalAmount="$85.000" 
      />

      <OrderAccordion 
        orderTitle="Pedido activo 1" 
        initialStatus="Recibido" 
        orderNumber="0001" 
        orderDate="2025-05-12" 
        shippingAddress="Cl. 10 #20-30, Medellín" 
        totalAmount="$120.000" 
      />
      <div className='mt-16'>
            <button className="mt-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded cursor-pointer">
                Volver menu principal
            </button>
      </div>
    </div>
  );
}
