// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseConfig'; // Importa la instancia de auth de tu configuración
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Suscribe al observador de estado de autenticación de Firebase
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Limpia la suscripción cuando el componente se desmonta
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading
        // Aquí podrías añadir funciones de login, logout, register si quieres gestionarlas desde el contexto
        // Aunque por simplicidad, las pondremos en los componentes de Login/Signup por ahora.
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Renderiza los hijos solo cuando el estado de autenticación se ha cargado */}
        </AuthContext.Provider>
    );
};
