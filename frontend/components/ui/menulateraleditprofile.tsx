import { useRouter } from "next/navigation"

const MenuLateralEditProfile = () => {

    const router = useRouter()
    
    return(
    <>
        <div className="text-gray-400 border-b border-gray pb-1 hover:border-black hover:text-black">
                <p className="cursor-pointer "
                onClick={()=>{
                    router.push('/routes/editprofile')
                }}>Editar perfil </p>
        </div>
        <div className="mt-4 text-gray-400 border-b border-gray pb-1 hover:border-black hover:text-black">
                <p className="cursor-pointer"
                onClick={()=>{
                    router.push('/routes/editpassword')
                }}>Cambiar contraseña </p>
        </div>
    </>
    )
}


export default MenuLateralEditProfile