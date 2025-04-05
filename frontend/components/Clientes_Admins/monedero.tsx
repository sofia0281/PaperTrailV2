import { FaUserCircle } from "react-icons/fa";
import CashCard from "../ui/cashcard";
const Wallet = () => {
  return (
    <div className="w-full bg-white shadow-lg overflow-hidden">
      {/* Encabezado con onda */}
      <div className="relative bg-orange-600 text-white p-6 pb-16">
        <div className="flex items-center">
          <FaUserCircle className="text-6xl mr-3" />
          <div>
            <h2 className="text-xl font-bold">Hola,</h2>
            <h2 className="text-xl font-bold">Usuario</h2>
          </div>
        </div>
        <div className="absolute top-6 right-6 text-right">
          <h3 className="text-lg">Monedero</h3>
          <p className="text-2xl font-bold">$100.000.00</p>
        </div>
      </div>

      {/* Contenedor de tarjetas con ancho fijo */}
      <div className="w-full flex flex-wrap items-start px-6 gap-6 py-6 justify-center lg:justify-start">

        {/*Tarjetas*/} 
        <CashCard />
      </div>

      {/* Botón agregar tarjeta */}
      <div className="px-6 pb-6 flex justify-end">
        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">
          Agregar Tarjeta
        </button>
      </div>
    </div>
  );
};

export default Wallet;
