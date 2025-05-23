'use client';

import { MdDelete, MdEdit } from "react-icons/md";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
interface CashCardPagoProps {
  numero: string;
  banco: string;
  tipo: string;
  titular: string;
  vencimiento: string;
  monto: number;
  isSelected?: boolean;
  onSelect?: () => void;
}
const CashCardPago: React.FC<CashCardPagoProps> = ({
    numero,
    banco,
    tipo,
    titular,
    vencimiento,
    monto,
    isSelected = false,
    onSelect = () => {},
}) => {
  // Formatear fecha de vencimiento a MMYY
  const formattedExpiry = vencimiento
    ? vencimiento.slice(5, 7) + vencimiento.slice(2, 4)
    : '';

  return (
    <div       
        onClick={onSelect}
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
      {/* Íconos de acción en la esquina superior derecha */}
      <p className="text-sm font-semibold">{banco} ({tipo})</p>

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

export default CashCardPago;
