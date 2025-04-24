// components/Books.tsx
"use client"
import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const Books = () => {
    const [count, setCount] = useState(1)

    const handleAdd = () =>{
        setCount(count + 1);
    }
    const handleSubtract = () => {
        if (count > 1) setCount(count - 1);
      };
  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white shadow-xl rounded-2xl">
      {/* Imagen del libro */}
      <div className="w-full aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">Imagen</span>
      </div>

      {/* Detalles del libro */}
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-semibold leading-tight mb-1">
            Los Sueños De Los Que Esta Hecha La Materia
          </h2>
          <p className="text-sm text-gray-600 mb-4">Stephen Hawking</p>
          <p className="text-xl font-semibold">$130.000</p>
          <p className="text-sm text-gray-500 mb-6">Nuevo</p>

          <div className="flex items-center space-x-4 mb-6">
            <button className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
              Agregar al Carrito
            </button>
            <div className="flex items-center space-x-2">
              <button className="cursor-pointer p-1 border rounded-full hover:bg-orange-200"
              onClick={handleSubtract}>
                <Minus size={16} />
              </button>
              <span>{count}</span>
              <button className="cursor-pointer p-1 border rounded-full hover:bg-orange-200"
              onClick={handleAdd}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Información técnica */}
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">Año de publicación</p>
              <p className='pl-2'>2011</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">Categoría</p>
              <p className='pl-2'>No Ficción, Ciencia y Divulgación Científica</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">Número de Páginas</p>
              <p className='pl-2'>124</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">Editorial</p>
              <p className='pl-2'>Crítica</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2" >ISBN</p>
              <p className='pl-2'>9788491998293</p>
            </div>
            <div>
              <p className="font-semibold bg-orange-500 border rounded-tl rounded-tr text-white pl-2">Idioma</p>
              <p className='pl-2'>Español</p>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="mt-6 bg-blue-100 p-4 rounded-md text-sm text-gray-800">
          <p>
            Dirigida e introducida por el difunto Stephen Hawking, el científico más célebre del pasado reciente,
            <strong> Los sueños de los que está hecha la materia</strong> reúne las obras esenciales de la física cuántica;
            textos que provocaron un cambio de paradigma que revolucionó la física para siempre.
          </p>
          <p className="mt-2">
            Reunidos en esta antología están los trabajos de la élite cuántica, entre otros:
            Max Planck, Niels Bohr, Werner Heisenberg, Max Born, Erwin Schrödinger, Paul Dirac, J. Robert Oppenheimer y Richard Feynman.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Books;
