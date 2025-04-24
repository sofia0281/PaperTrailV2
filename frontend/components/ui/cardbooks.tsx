"use client";
import { useRouter } from "next/navigation";
import { MdAddShoppingCart } from "react-icons/md";

interface BookProps {
  title: string;
  price: number;
  author?: string;
  condition?: string;
  imageUrl?: string;
}


const CardBooks = ({ 
  title, 
  price, 
  author = "Autor desconocido", 
  condition = "Usado/Nuevo", 
  imageUrl 
}: BookProps) => {
  const router = useRouter()

  return (
    <div className="border rounded-md p-3 shadow-sm hover:scale-105 transition-transform cursor-pointer"
    >
      {/* Contenedor de imagen */}
      <div className="bg-gray-200 h-40 rounded-md flex items-center justify-center overflow-hidden"
      onClick={() => router.push("/routes/books")}>
        {imageUrl ? (
          <img 
            src={imageUrl.includes('http') ? imageUrl : `http://localhost:1337${imageUrl}`}
            alt={`Portada de ${title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-400">[ Portada no disponible ]</p>
        )}
      </div>

      {/* Detalles del libro */}
      <div className="mt-2">
        <h3 className="text-sm font-medium truncate">{title}</h3>
        <p className="text-xs text-gray-600">{author}</p>
        <p className="text-sm font-semibold text-gray-800 mt-1">
          ${price.toLocaleString('es-CO')}
        </p>
        <p className="text-xs text-gray-500">{condition}</p>
      </div>
      <div className="Botones flex gap-2 mt-2">
          {/* Botón ShoppingCart */}
          <button className="cursor-pointer border border-orange-500 text-orange-500 text-xs px-2 py-1 rounded-md hover:bg-orange-500 hover:text-white transition-colors">
            <MdAddShoppingCart/>
          </button>
          
          {/* Botón Comprar ya */}
          <button className="cursor-pointer bg-orange-500 text-white text-xs px-4 py-1 rounded-md hover:bg-orange-600 transition-colors w-full"
          onClick={() => router.push("/routes/previewshoppingcart")}>
            + Comprar ya
          </button>
        </div>

    </div>
  );
};

export default CardBooks;