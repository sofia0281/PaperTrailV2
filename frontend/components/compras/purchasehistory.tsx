"use client"
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const PurchaseHistory = () => {

  const router = useRouter()
  const purchases = [
    { id: "#0001", 
        date: "28/02/2025", 
        status: "Completado", 
        total: 130000 },
        
    { id: "#0002", 
        date: "28/02/2025", 
        status: "Completado", 
        total: 130000 },
  ];
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-center md:text-left">
        <div className="flex items-center gap-2">
          <UserCircle size={28} />
          <span className="text-3xl font-semibold">Hola!, <span className="text-orange-500">[Nombre] </span></span>
        </div>
        <h1 className="text-3xl font-bold mt-2 md:mt-0">Historial de compras</h1>
      </div>
      
      {/* Tabla */}
      <div className="bg-white border rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="bg-orange-500 text-white">
              <th className="py-2 px-4">Orden de Compra</th>
              <th className="py-2 px-4">Fecha</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Más Información</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id} className="border-t">
                <td className="py-2 px-4">{purchase.id}</td>
                <td className="py-2 px-4">{purchase.date}</td>
                <td className="py-2 px-4">{purchase.status}</td>
                <td className="py-2 px-4">${purchase.total.toLocaleString()}</td>
                <td className="py-2 px-4">
                  <button className="bg-gray-700 text-white px-3 py-1 rounded-md hover:bg-gray-800 cursor-pointer"


                  onClick={() => {
                    router.push('/routes/moreinfopurchase');
                     }
                  }
                  >
                    Ver más
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseHistory;