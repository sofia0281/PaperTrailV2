import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

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
    const [products, setProducts] = useState<Product[]>(initialProducts);

    const handleQuantity = (id: number, change: number) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                quantity: Math.max(1, product.quantity + change),
              }
            : product
        )
      );
    };
  
    const handleRemove = (id: number) => {
      setProducts((prev) => prev.filter((product) => product.id !== id));
    };
  
    const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  
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
      </div>
    )
    
}

export default CardMoreInfoPurchase;