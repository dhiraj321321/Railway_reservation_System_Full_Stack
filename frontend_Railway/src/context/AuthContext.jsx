import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api.js'; // Your central axios file
import { jwtDecode } from 'jwt-decode'; // You must install this: npm install jwt-decode

// 1. Create Context
const AuthContext = createContext();

// 2. Create custom hook
export const useAuth = () => useContext(AuthContext);

// 3. Create Provider
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('authToken')); // Get token from storage

    // This effect runs when the app loads or when the token changes
    useEffect(() => {
        if (token) {
            try {
                // 1. Decode user info from the token
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
                // 2. Set the token for all future API requests
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (e) {
                // If token is invalid (expired/etc), clear it
                localStorage.removeItem('authToken');
                setToken(null);
            }
        }
    }, [token]);

    // Connects to POST /api/auth/login
    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', {
                username: username,
                password: password
            });

            const { token } = response.data;
            localStorage.setItem('authToken', token);
            setToken(token); // This will trigger the useEffect to set the user

            return true; // Success
        } catch (error) {
            console.error('Login failed:', error);
            return false; // Failure
        }
    };

    // Connects to POST /api/auth/register
    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', {
                name: name,
                email: email,
                password: password
            });

            const { token } = response.data; // Auto-login after registering
            localStorage.setItem('authToken', token);
            setToken(token); // This will trigger the useEffect to set the user

            return true; // Success
        } catch (error) {
            console.error('Registration failed:', error);
            return false; // Failure
        }
    };

    // Clears all user data
    const logout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
    };

    // Note: bookTicket and userBookings were removed.
    // That logic belongs in your TrainContext, not here.

    const value = {
        user,     // The decoded user object
        token,    // The raw JWT
        login,
        logout,
        register  // Add the register function
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};