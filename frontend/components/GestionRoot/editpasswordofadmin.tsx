const EditPasswordAdminByRoot = () =>{
    return(
        <>        
        <form className="items-center justify-center flex flex-col gap-4">
            <label className="block font-semibold">Nueva contraseña</label>
            <input 
            type="password" 
            name="password" 
            value="password"
            className="border border-gray-400 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
            <button 
            type="submit" 
            className="w-full bg-orange-500 text-white py-2 rounded-md mt-4 transition-transform duration-300 transform hover:bg-orange-600 active:scale-95 cursor-pointer">
            Cambiar Clave</button>
        </form>
      </>

    )
}

export default EditPasswordAdminByRoot;