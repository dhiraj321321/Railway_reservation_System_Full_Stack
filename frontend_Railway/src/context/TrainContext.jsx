import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

// --- Helper function (no changes) ---
function getInitialState(key, defaultValue) {
    const savedItem = sessionStorage.getItem(key);
    if (savedItem) {
        try { return JSON.parse(savedItem); }
        catch (e) { console.error("Failed to parse session storage", e); return defaultValue; }
    }
    return defaultValue;
}

const TrainContext = createContext();
export const useTrains = () => useContext(TrainContext);

export const TrainProvider = ({ children }) => {
    const [trains, setTrains] = useState([]);
    const [searchResults, setSearchResults] = useState(() => getInitialState('searchResults', []));
    const [searchParams, setSearchParams] = useState(() => getInitialState('searchParams', {}));
    const [myBookings, setMyBookings] = useState([]);
    const [myComplaints, setMyComplaints] = useState([]);
    const [foodMenu, setFoodMenu] = useState([]);
    const [myFoodOrders, setMyFoodOrders] = useState([]);
    const [emergencyContacts, setEmergencyContacts] = useState({});

    const findTrains = async (from, to, date) => {
        try {
            const params = { from, to, date };
            setSearchParams(params);
            sessionStorage.setItem('searchParams', JSON.stringify(params));
            const response = await api.get(`/trains?from=${from}&to=${to}`);
            setSearchResults(response.data);
            sessionStorage.setItem('searchResults', JSON.stringify(response.data));
        } catch (error) { console.error('Failed to find trains:', error); setSearchResults([]); }
    };

    const fetchAllTrains = useCallback(async () => {
        try {
            const response = await api.get('/trains');
            setTrains(response.data);
        } catch (error) {
            console.error('Failed to fetch all trains:', error);
        }
    }, []);

    const addTrain = async (newTrain) => {
        try {
            await api.post('/trains', newTrain);
            await fetchAllTrains();
            return true;
        } catch (error) {
            console.error('Failed to add train:', error);
            return false;
        }
    };

    const cancelTrain = async (trainId) => {
        try {
            await api.delete(`/trains/${trainId}`);
            await fetchAllTrains();
            return true;
        } catch (error) {
            console.error('Failed to cancel train:', error);
            return false;
        }
    };

    const fetchMyBookings = useCallback(async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            setMyBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        }
    }, []);

    // --- THIS IS THE CORRECTED FUNCTION ---
    const bookTicket = async (train, passengers) => {
        try {
            const bookingRequest = {
                trainId: train.id,
                passengers: passengers.map(p => ({
                    name: p.name,
                    age: parseInt(p.age),
                    gender: p.gender
                })),
                // This 'searchParams.date' comes from the homepage search
                // and is correctly read from the context's state.
                journeyDate: searchParams.date
            };
            const response = await api.post('/bookings', bookingRequest);
            setMyBookings(prevBookings => [...prevBookings, response.data]);
            return response.data;
        } catch (error) {
            console.error('Failed to book ticket:', error);
            return null;
        }
    };
    // --- END OF FIX ---

    const submitComplaint = async (complaintData) => {
        try {
            await api.post('/complaints', complaintData);
            return true;
        } catch (error) { console.error('Failed to submit complaint:', error); return false; }
    };

    const fetchComplaints = useCallback(async () => {
        try {
            const response = await api.get('/complaints/my');
            setMyComplaints(response.data);
        } catch (error) { console.error('Failed to fetch complaints:', error); }
    }, []);

    const fetchFoodMenu = useCallback(async () => {
        try {
            if (foodMenu.length === 0) {
                const response = await api.get('/food/menu');
                setFoodMenu(response.data);
            }
        } catch (error) { console.error('Failed to fetch food menu:', error); }
    }, [foodMenu.length]);

    const submitFoodOrder = async (orderData) => {
        try {
            await api.post('/food/order', orderData);
            return true;
        } catch (error) { console.error('Failed to submit food order:', error); return false; }
    };

    const fetchFoodOrders = useCallback(async () => {
        try {
            const response = await api.get('/food/my-orders');
            setMyFoodOrders(response.data);
        } catch (error) { console.error('Failed to fetch food orders:', error); }
    }, []);

    const fetchContacts = useCallback(async () => {
        try {
            if (Object.keys(emergencyContacts).length === 0) {
                const response = await api.get('/contacts');
                setEmergencyContacts(response.data);
            }
        } catch (error) { console.error('Failed to fetch contacts:', error); }
    }, [emergencyContacts]);

    const value = {
        trains, searchResults, searchParams, myBookings,
        findTrains, fetchAllTrains, addTrain, cancelTrain, fetchMyBookings, bookTicket,
        myComplaints, foodMenu, myFoodOrders, emergencyContacts,
        submitComplaint, fetchComplaints, fetchFoodMenu, submitFoodOrder, fetchFoodOrders, fetchContacts
    };

    return <TrainContext.Provider value={value}>{children}</TrainContext.Provider>;
};