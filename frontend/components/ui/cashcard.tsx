import { MdDelete, MdEdit } from "react-icons/md"

const CashCard = () =>{
    return(
    <div className="bg-blue-600 text-white p-4 rounded-lg relative w-70 max-w-xs transition-transform duration-300 transform hover:scale-105">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Débito</h3>
            <div className="flex gap-2">
            <MdEdit className="cursor-pointer transition-transform duration-300 transform hover:scale-120" />
            <MdDelete className="cursor-pointer transition-transform duration-300 transform hover:scale-120" />
            </div>
        </div>
        <p className="mt-4 text-lg">XXX.XXX.XXX.XXX</p>
        <div className="flex justify-between items-center mt-4">
            <p>Monto: $20.000</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="w-8" />
        </div>
    </div>
    )
}

export default CashCard;