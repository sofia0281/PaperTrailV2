"use client"

import { Minus, Plus } from "lucide-react"

const CardSideBarShoppingCart = () =>{
    return(
    <div className="flex items-center gap-3 border-b pb-4">
        <div className="w-16 h-16 bg-white rounded" />
            <div className="flex-1">
                <p>Libro </p>
                <p className="text-sm">$50.000</p>
            </div>
        <div className="flex items-center border rounded-full px-2 py-1 space-x-2">
            <button 
                className='cursor-pointer hover:text-orange-500 transition duration-200 ease-in-out'>
            <Minus size={16} />
            </button>
            <span>1</span>
            <button 
                className='cursor-pointer hover:text-orange-500 hover:scale-140 transition duration-200 ease-in-out cursor-pointer'>
            <Plus size={16} 
            />
            </button>
        </div>
    </div>
    )
}

export default CardSideBarShoppingCart