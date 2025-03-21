const NewAdmin = () =>{
    return (
      <div className="space-y-4">
        <div className="flex items-center bg-white p-4 rounded-lg shadow-md border">
          {/* Imagen */}
          <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-400">📷</span>
          </div>

          {/* Nombre del administrador */}
          <div className="flex-1 ml-4">
            <p className="font-semibold">Admin</p>
          </div>
          {/* Botones */}

          <div className="flex space-x-2">
            <button className="bg-red-500 text-white px-3 py-1 rounded-md text-sm transition-transform duration-300 transform hover:scale-105 cursor-pointer">ELIMINAR</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm transition-transform duration-300 transform hover:scale-105 cursor-pointer">EDITAR</button>
          </div>
        </div>
    </div>
    )
}

export default NewAdmin;