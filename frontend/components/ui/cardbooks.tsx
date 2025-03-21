const CardBooks = () => {
    return (
        <div className="border rounded-md p-3 shadow-sm transition-transform duration-300 transform hover:scale-105">
            <div className="bg-gray-200 h-40 rounded-md flex items-center justify-center">
                <p className="text-gray-400">[ Imagen ]</p>
            </div>
            <h3 className="text-sm font-medium mt-2">Título del libro</h3>
            <p className="text-sm font-semibold text-gray-600">$50.000</p>
            <p className="text-xs text-gray-500">Usado/Nuevo</p>
            <button className="bg-orange-500 text-white text-xs px-2 py-1 mt-2 w-full rounded-md transition-transform duration-300 transform hover:scale-110">
             + Comprar ya
            </button>
        </div>
    );
}

export default CardBooks;
