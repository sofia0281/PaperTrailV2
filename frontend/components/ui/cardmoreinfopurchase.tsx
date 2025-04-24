import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

const initialProducts: Product[] = [
  { id: 1, name: 'Libro 1', price: 150000, quantity: 1 },
  { id: 2, name: 'Libro 2', price: 200000, quantity: 1 },
  { id: 3, name: 'Libro 3', price: 80000, quantity: 1 },
];

const CardMoreInfoPurchase = ()=>{

    const router = useRouter()
    const [products, setProducts] = useState<Product[]>(initialProducts);

    return(
        <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between border rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                Img
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">
                  ${product.price.toLocaleString('es-CO')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-orange-500 text-white flex items-center border rounded-full px-4 py-1 space-x-2 hover:bg-green-500 ">
                <span className='font-semibold'>{product.quantity}</span>
              </div>

            </div>
          </div>
        ))}
      <button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white p-2 mt-2 rounded-lg font-medium"
      onClick={()=>{
        router.push('/routes/purchasehistory')
      }
      }>
        Regresar
      </button>
      </div>
    )
    
}

export default CardMoreInfoPurchase;