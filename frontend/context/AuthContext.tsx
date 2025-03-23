// context/AuthContext.js
"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Verifica si hay un token y datos del usuario almacenados (por ejemplo, en localStorage)
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(storedUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, setUser, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);