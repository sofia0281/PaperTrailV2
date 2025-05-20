'use client';

import { MdDelete, MdEdit } from "react-icons/md";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const CashCard = ({ numero, titular, vencimiento, banco, tipo, monto, onEdit, onDelete }) => {
  // Formatear fecha de vencimiento a MMYY
  const formattedExpiry = vencimiento
    ? vencimiento.slice(5, 7) + vencimiento.slice(2, 4)
    : '';

  return (
    <div className="relative p-4 rounded-lg shadow-md bg-white w-80 transition-transform duration-300 transform hover:scale-105">
      {/* Íconos de acción en la esquina superior derecha */}
      <p className="text-sm font-semibold">{banco} ({tipo})</p>
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <MdEdit
          className="cursor-pointer text-gray-700 hover:text-blue-600 transition-transform transform hover:scale-110"
          onClick={onEdit}
        />
        <MdDelete
          className="cursor-pointer text-gray-700 hover:text-red-600 transition-transform transform hover:scale-110"
          onClick={onDelete}
        />
      </div>

      <Cards
        number={numero}
        name={titular}
        expiry={formattedExpiry}
        cvc="123"
        preview={true}
      />

      <div className="mt-2 text-center">
        <p className="text-md font-bold text-green-600">
          ${Number(monto || 0).toLocaleString('es-CO')}
        </p>
      </div>
    </div>
  );
};

export default CashCard;
