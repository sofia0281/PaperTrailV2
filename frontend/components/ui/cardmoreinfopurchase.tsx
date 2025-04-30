import { useRouter } from 'next/navigation';

// Define el tipo basado en los datos reales de la API
type ItemPedido = {
  IdItem: number;
  title: string;
  unitprice: number;
  totalprice:number;
  quantity: number;
  // Agrega más campos si es necesario (ej: imagen)
};

// Define las props del componente
interface CardMoreInfoPurchaseProps {
  item: ItemPedido;
}

const CardMoreInfoPurchase = ({ item }: CardMoreInfoPurchaseProps) => {
  const router = useRouter();
  console.log(item.title)

  return (
    <div className="flex items-center justify-between border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Placeholder para la imagen (puedes reemplazarlo con una imagen real si existe en los datos) */}
        <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
          Img
        </div>
        <div>
          <p className="font-semibold">{item.Title}</p>
          <p className="text-sm text-gray-600">
            ${item.PrecioItem.toLocaleString('es-CO')} c/u
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-orange-500 text-white flex items-center border rounded-full px-4 py-1 space-x-2 hover:bg-green-500">
          <span className="font-semibold">{item.Cantidad}</span>
        </div>
        <p className="font-semibold">
          Total: ${(item.PrecioItem * item.Cantidad).toLocaleString('es-CO')}
        </p>
      </div>
    </div>
  );
};

export default CardMoreInfoPurchase;