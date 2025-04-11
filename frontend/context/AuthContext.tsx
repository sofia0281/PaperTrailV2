// context/AuthContext.js
"use client";
import React, { useState, useEffect, useContext } from 'react';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [authRole, setAuthRole] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (storedToken) {
            setAuthToken(storedToken);
        }

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setAuthUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setAuthUser(null);
            }
        }

        if (storedRole) {
            try {
                const parsedRole = JSON.parse(storedRole);
                setAuthRole(parsedRole);
            } catch (error) {
                console.error("Error parsing role data:", error);
                setAuthRole(null);
            }
        }

        setLoading(false); // Marcar como cargado
    }, []);

    if (loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        ) 
    }

    return (
        <AuthContext.Provider value={{ authUser, authToken, authRole, loading, setAuthUser, setAuthToken, setAuthRole }}>
          {children}
        </AuthContext.Provider>
      );
};

export const useAuth = () => useContext(AuthContext);