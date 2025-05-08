// context/AuthContext.js
"use client";
import React, { useState, useEffect, useContext } from 'react';
type CartItem = {
    idLibro: string;
    quantity: number;
    title : string;
    unitPrice: number;
    totalPrice?: number;
};
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [authRole, setAuthRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]); // Estado para el carrito

    // Cargar datos del localStorage al iniciar
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');
        const storedCart = localStorage.getItem('cart'); // Obtener carrito guardado

        if (storedToken) setAuthToken(storedToken);
        
        if (storedUser) {
            try {
                setAuthUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user data:", error);
                setAuthUser(null);
            }
        }

        if (storedRole) {
            try {
                setAuthRole(JSON.parse(storedRole));
            } catch (error) {
                console.error("Error parsing role data:", error);
                setAuthRole(null);
            }
        }

        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart)); // Inicializar carrito
            } catch (error) {
                console.error("Error parsing cart data:", error);
                setCart([]);
            }
        }

        setLoading(false);
    }, []);

    // Guardar carrito en localStorage cuando cambie
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Función para añadir items al carrito
    const addToCart = (book) => {
        const { idLibro, title, price, quantity, imageUrl } = book;
      
        let wasAdded = true;
      
        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.idLibro === idLibro);
          const unitsToAdd = quantity && quantity > 0 ? quantity : 1;
          const currentQuantity = existingItem ? existingItem.quantity : 0;
          const newQuantity = currentQuantity + unitsToAdd;
      
          // Validar límite de 20 unidades por libro
          if (newQuantity > 20) {
            wasAdded = false;
            return prevCart; // No modificar el carrito
          }
      
          if (existingItem) {
            return prevCart.map(item =>
              item.idLibro === idLibro
                ? {
                    ...item,
                    quantity: newQuantity,
                    totalPrice: newQuantity * item.unitPrice,
                  }
                : item
            );
          } else {
            return [
              ...prevCart,
              {
                idLibro,
                title,
                unitPrice: price,
                quantity: unitsToAdd,
                totalPrice: price * unitsToAdd,
                imageUrl,
              },
            ];
          }
        });
      
        return wasAdded; // Devuelve true o false según si se pudo agregar
      };
      
      

    // Función para eliminar items del carrito
    const removeFromCart = (idLibro) => {
        setCart(prevCart => prevCart.filter(item => item.idLibro !== idLibro));
        setAddedItems(prev => prev.filter(id => id !== idLibro)); // quitarlo de la lista

    };

    // Función para actualizar cantidad manualmente
    const updateQuantity = (idLibro, newQuantity) => {
        if (newQuantity >= 20){
            return false;
        }
        if (newQuantity < 1) {
            removeFromCart(idLibro);
            return true;
        }

        setCart(prevCart =>
            prevCart.map(item =>
              item.idLibro === idLibro
                ? {
                    ...item,
                    quantity: newQuantity,
                    totalPrice: newQuantity * item.unitPrice, // Recalcula el precio
                  }
                : item
            )
        )
    }

    // Función para limpiar el carrito
    const clearCart = () => {
        setCart([]);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                authUser,
                authToken,
                authRole,
                loading,
                cart, // Añadir carrito al contexto
                addedItems, 
                setAuthUser,
                setAuthToken,
                setAuthRole,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);