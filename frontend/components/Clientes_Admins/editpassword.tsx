import { useRouter } from "next/navigation";

const EditPassword = () => {
    const router = useRouter()
    return(
    <>
    {/* Sección Cambio de Contraseña */}
    <form>
     <div className="mt-6 p-4 border rounded-md bg-gray-100">
        <h3 className="font-semibold">CAMBIO DE CONTRASEÑA</h3>
        <p className="text-xs text-gray-600 mb-2">
            Contraseña actual (déjalo en blanco para no cambiarla)
        </p>
        <input
            type="password"
            name="passwordActual"
            //onChange={handleChange}
            className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        <p className="text-xs text-gray-600 mt-2">
            Nueva contraseña (déjalo en blanco para no cambiarla)
        </p>
        <input
            type="password"
            name="passwordNueva"
            //onChange={handleChange}
            className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        <p className="text-xs text-gray-600 mt-2">
            Confirmar nueva contraseña (déjalo en blanco para no cambiarla)
        </p>
        <input
            type="password"
            name="passwordConfirmar"
            //onChange={handleChange}
            className="border border-gray-200 border-solid rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        </div> 
        {/* Botones */}
        <div className="flex justify-end w-full gap-4 mt-6">
          {/* sacar este boton de aqui para poder cancelar la edición del usuario */}
          <button 
          type="button" 
          className="bg-blue-500 text-white px-4 py-1 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer"
          onClick={() => router.push("/routes/editprofile")}>
            CANCELAR
          </button>

          <button type="submit" className="bg-orange-500 text-white px-4 py-1 rounded-md transition-transform duration-300 transform hover:scale-105 cursor-pointer">
            CAMBIAR CONTRASEÑA
          </button>
        </div>
    </form>
    </>
    )
}

export default EditPassword;