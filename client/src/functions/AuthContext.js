import React, { createContext, useContext, useState } from 'react';
import { isLogin, clearToken, saveToken } from './TokenTools';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [logged, setLogged] = useState(isLogin());
    const [email, setEmail] = useState(localStorage.getItem("email"));

    const handleLogin = (tokenBody, email) => {
        setLogged(true);
        saveToken(tokenBody, email);
        setEmail(email);
    };

    const handleLogout = () => {
        clearToken();
        setLogged(false);
        setEmail(null);
    };

    return (
        <AuthContext.Provider value={{ logged, email, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};
