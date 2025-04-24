'use client';
import CardMoreInfoPurchase from '@/components/ui/cardmoreinfopurchase'

const MorePurchaseHistory = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10">
      {/* Div 1: Productos */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Detalles del pedido</h2>
        <CardMoreInfoPurchase/>
      </div>

      {/* Div 2: Total y botón */}
      <div className="w-full md:w-1/3 flex flex-col justify-between h-full space-y-6">
        <div className="mt-14 border rounded-xl p-4 bg-white shadow-sm flex justify-between items-center font-semibold text-lg">
            <span>Total</span>
            <span>$50.000</span>
        </div>

        <div className="mt-auto">
            <button className="cursor-pointer bg-red-700 hover:bg-red-800 text-white w-full py-2 rounded-lg font-medium">
            Solicitar Devolución
            </button>
        </div>
     </div>

    </div>
  );
};

export default MorePurchaseHistory;
