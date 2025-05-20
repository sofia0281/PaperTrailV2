import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useState } from 'react';
import Cards from 'react-credit-cards-2';
import { createCard, checkCardExistsByNumber } from "@/services/cardCRUD";
import { useAuth } from "@/context/AuthContext";
import cardValidator from 'card-validator';

export default function AddCardModal({ isOpen, onClose }) {
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [focus, setFocus] = useState('');
  const [tipo, setTipo] = useState('Crédito'); // Default
  const [monto, setMonto] = useState('');


  const { authUser } = useAuth();
  const [error, setError] = useState('');

  const resetForm = () => {
    setNumber('');
    setName('');
    setExpiry('');
    setCvc('');
    setFocus('');
    setTipo('Crédito');
    setMonto('');
    setError('');
  };
  



  const formatNumber = (value: string) => {
    // Elimina todo lo que no sea dígito
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';
    
    // Convierte a número y aplica separador de miles
    return parseInt(cleanValue, 10).toLocaleString('es-CO');
  };
  

  if (!isOpen) return null;

  const handleSaveCard = async () => {
    try {
      // Formatear la fecha: MM/YY → YYYY-MM-DD
      const [month, yearShort] = expiry.split('/');
      const yearFull = `20${yearShort}`;
      const fechaVencimiento = `${yearFull}-${month.padStart(2, '0')}-01`;
      console.log("Fecha de vencimiento formateada:", fechaVencimiento);

      // Detectar banco usando card-validator
      const numberValidation = cardValidator.number(number);
      const bancoDetectado = numberValidation.card?.niceType || "Desconocido";
      const montoNumerico = parseInt(monto.replace(/\./g, ''), 10); 

      if (!number || !name || !expiry || !cvc || !tipo || !monto) {
        setError('Todos los campos son obligatorios.');
        return;
      }
      
      const rawNumber = number.replace(/\s/g, '');
      const exists = await checkCardExistsByNumber(rawNumber);
      if (exists) {
        setError('Este número de tarjeta ya está registrado.');
        return;
      }
      


      const cardPayload = {
        Numero: number,
        Titular: name,
        FechaVencimiento: fechaVencimiento,
        Ultimos4Digitos: cvc,
        Banco: bancoDetectado,
        Tipo: tipo,
        user: authUser?.id,
        Monto: montoNumerico,
      };

      console.log("Payload final:", cardPayload);
      await createCard(cardPayload);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error al guardar tarjeta:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 pt-36 relative">
        <button onClick={onClose} className="absolute top-4 right-4">✕</button>

        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[90%]">
          <Cards
            number={number}
            name={name}
            expiry={expiry}
            cvc={cvc}
            focused={focus}
          />
        </div>

        <form className="space-y-3">
        {error && (
            <p className="text-red-600 text-sm font-medium">{error}</p>
        )}

        <input
            type="text"
            name="number"
            placeholder="Número de tarjeta"
            value={number}
            onChange={(e) => {
            const input = e.target.value.replace(/\D/g, '').slice(0, 16);
            const formatted = input.replace(/(.{4})/g, '$1 ').trim();
            setNumber(formatted);
            setError('');
            }}
            onFocus={(e) => setFocus(e.target.name)}
            className="w-full border rounded p-2"
        />


          <input
            type="text"
            name="name"
            placeholder="Nombre en la tarjeta"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={(e) => setFocus(e.target.name)}
            className="w-full border rounded p-2"
          />
          <div className="flex gap-2">
            <input
              type="text"
              name="expiry"
              placeholder="MM/AA"
              value={expiry}
              onChange={(e) => {
                let input = e.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea número
              
                if (input.length > 4) input = input.slice(0, 4); // Máximo 4 dígitos (MMYY)
              
                if (input.length > 2) {
                  input = `${input.slice(0, 2)}/${input.slice(2)}`;
                }
              
                setExpiry(input);
              }}
              
              onFocus={(e) => setFocus(e.target.name)}
              className="w-1/2 border rounded p-2"
            />
            <input
              type="text"
              name="cvc"
              placeholder="CVV"
              value={cvc}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setCvc(val);
              }}
              onFocus={(e) => setFocus(e.target.name)}
              className="w-1/2 border rounded p-2"
            />
          </div>

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="Crédito">Crédito</option>
            <option value="Débito">Débito</option>
          </select>
          <input
            type="text"
            name="monto"
            placeholder="Monto a agregar"
            value={monto}
            onChange={(e) => setMonto(formatNumber(e.target.value))}
            className="w-full border rounded p-2"
            />

          

          <button
            type="button"
            onClick={handleSaveCard}
            className="bg-orange-600 hover:bg-orange-700 text-white w-full py-2 rounded mt-4"
          >
            Guardar Tarjeta
          </button>
        </form>
      </div>
    </div>
  );
}
