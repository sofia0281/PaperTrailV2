const CreateBook = () => {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Encabezado */}
        <div className="bg-orange-600 text-white p-6 rounded-t-lg relative">
          <h1 className="text-2xl font-bold">CREAR LIBRO</h1>
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-gray-200 p-4 rounded-md shadow-md">
            <p className="text-gray-600 text-center">Anexar portada</p>
          </div>
        </div>
  
        {/* Formulario */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 p-6">
          <div>
            <label className="block text-sm font-medium">ISSN</label>
            <input type="text" className="border border-gray-200 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ISSN" />
          </div>
          <div>
            <label className="block text-sm font-medium">Fecha de Publicación</label>
            <input type="date" className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Título" />
          </div>
          <div>
            <label className="block text-sm font-medium">Estado</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center">
                <input 
                type="radio" 
                name="estado" 
                className="appearance-none w-4 h-4 border-2 border-orange-500 mr-1 rounded-full checked:bg-orange-500 checked:border-orange-500" /> Nuevo
              </label>
              <label className="flex items-center">
                <input 
                type="radio" 
                name="estado" 
                className="appearance-none w-4 h-4 border-2 bg-white border-orange-500 mr-1 rounded-full checked:bg-orange-500 checked:border-orange-500" /> Usado
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Autor</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Autor" />
          </div>
          <div>
            <label className="block text-sm font-medium">Precio</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Precio" />
          </div>
          <div>
            <label className="block text-sm font-medium">Reseña</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Reseña" />
          </div>
          <div>
            <label className="block text-sm font-medium">Editorial</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Editorial" />
          </div>
          <div>
            <label className="block text-sm font-medium">Número de Páginas</label>
            <input type="number" className="w-full p-2 border rounded-md" placeholder="Número de páginas" />
          </div>
          <div>
            <label className="block text-sm font-medium">Género</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Género" />
          </div>
          <div>
            <label className="block text-sm font-medium">Idioma</label>
            <input type="text" className="w-full p-2 border rounded-md" placeholder="Idioma" />
          </div>
          <div>
            <label className="block text-sm font-medium">Cantidad</label>
            <input type="number" className="w-full p-2 border rounded-md" placeholder="Cantidad" />
          </div>
        </form>
  
        {/* Botones */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="bg-gray-400 text-white px-6 py-2 rounded-md">Cancelar</button>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-md">Crear Libro</button>
        </div>
      </div>
    );
  };
  
  export default CreateBook;
  