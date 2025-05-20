import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { useState } from 'react';
import Cards from 'react-credit-cards-2';
import { updateCard, checkCardExistsByNumber } from "@/services/cardCRUD";
import { useAuth } from "@/context/AuthContext";
import cardValidator from 'card-validator';

export default function EditCardModal({ isOpen, onClose, cardToEdit }) {
    const [number, setNumber] = useState(cardToEdit?.Numero || '');
    const [name, setName] = useState(cardToEdit?.Titular || '');
    const [error, setError] = useState('');

    const [expiry, setExpiry] = useState(() => {
      if (!cardToEdit?.FechaVencimiento) return '';
      const [year, month] = cardToEdit.FechaVencimiento.split('-');
      return `${month}/${year.slice(2)}`; // formato MM/YY
    });
    const [cvc, setCvc] = useState(cardToEdit?.Ultimos4Digitos || '');
    const [focus, setFocus] = useState('');
    const [tipo, setTipo] = useState(cardToEdit?.Tipo || 'Crédito');
    const [monto, setMonto] = useState(() => {
      const valor = Number(cardToEdit?.Monto || 0);
      return valor.toLocaleString('es-CO');
    });
    const formatNumber = (value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        if (!cleanValue) return '';
        return parseInt(cleanValue, 10).toLocaleString('es-CO');
      };
      

const handleUpdateCard = async () => {
    try {
        const [month, yearShort] = expiry.split('/');
        const yearFull = `20${yearShort}`;
        const fechaVencimiento = `${yearFull}-${month.padStart(2, '0')}-01`;

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
        Monto: montoNumerico,
        };

        await updateCard(cardToEdit.documentId, cardPayload); // Usa el ID real
        onClose();
    } catch (error) {
        console.error("Error al actualizar tarjeta:", error.message);
        setError('Error al actualizar tarjeta.');
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
            onChange={(e) => {
                let value = e.target.value;

            // Eliminar espacios al inicio
            value = value.replace(/^\s+/, '');
            // Permite solo letras y espacios, hasta 40 caracteres
            if (/^[a-zA-Z\s]{0,40}$/.test(value)) {
              setName(value);
            }
          }}
            onBlur={() => {
            // Validar longitud mínima en onBlur
            if (name.length < 2 || name.length > 40) {
              setError('El nombre debe tener entre 2 y 40 caracteres.');
              setTimeout(() => {
                setError('');
              }, 3000); // Limpia el error 3 segundos después de mostrarlo
            }
          }}
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
              onBlur={() => {
                const [month, year] = expiry.split('/');

                // Validación básica
                if (!month || !year || month.length !== 2 || year.length !== 2) {
        
                    setError('Formato de fecha inválido. Debe ser MM/AA.');
                    setTimeout(() => {
                      setError('');
                    }, 3000); // Limpia el error 3 segundos después de mostrarlo
                  return;
                }

                const monthNum = parseInt(month);
                if (monthNum < 1 || monthNum > 12) {
                    setError('El mes debe estar entre 01 y 12.');
                    setTimeout(() => {
                      setError('');
                    }, 3000); // Limpia el error 3 segundos después de mostrarlo
                  
                  return;
                }

                // Validación opcional: que no sea una fecha pasada
                const currentYear = new Date().getFullYear() % 100; // Solo los últimos dos dígitos
                const currentMonth = new Date().getMonth() + 1;
                const inputYear = parseInt(year);
                const inputMonth = parseInt(month);

                if (
                  inputYear < currentYear ||
                  (inputYear === currentYear && inputMonth < currentMonth)
                ) {

                setError('La tarjeta ya está vencida.');
                setTimeout(() => {
                  setError('');
                }, 3000); // Limpia el error 3 segundos después de mostrarlo
                }
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
            onClick={handleUpdateCard}
            className="bg-orange-600 hover:bg-orange-700 text-white w-full py-2 rounded mt-4"
          >
            Actualizar Tarjeta
          </button>
        </form>
      </div>
    </div>
  );
}
