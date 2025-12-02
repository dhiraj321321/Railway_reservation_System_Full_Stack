import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrains } from '../context/TrainContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import ServiceDashboard from '../components/ServiceDashboard'; // Import the new component
import '../components/Form.css';
import './HomePage.css';

const HomePage = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate();
    const { findTrains } = useTrains();
    const { user } = useAuth(); // Get the current user

    const handleSearch = (e) => {
        e.preventDefault();
        if (!from || !to || !date) {
            alert('Please fill all fields');
            return;
        }
        findTrains(from.toUpperCase(), to.toUpperCase(), date);
        navigate('/search');
    };

    return (
        <div className="page-container">
            <div className="home-hero">
                <h1>Book Your Train Ticket</h1>
                <p>Safe, Secure, and Convenient</p>
                {/* Search Form */}
                <form onSubmit={handleSearch} className="form-container">
                    {/* ... (keep existing form inputs and button) ... */}
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="From (e.g., NDLS)"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="form-input"
                            required // Add required
                        />
                        <input
                            type="text"
                            placeholder="To (e.g., BOM)"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="form-input"
                            required // Add required
                        />
                    </div>
                    <div className="form-row">
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="form-input"
                            style={{flexGrow: 2}}
                            required // Add required
                        />
                        <button type="submit" className="form-button" style={{flexGrow: 1}}>
                            Search Trains
                        </button>
                    </div>
                </form>
            </div>

            {/* --- NEW: Show ServiceDashboard only if user is logged in --- */}
            {user && <ServiceDashboard />}
            {/* --- END NEW --- */}

        </div>
    );
};

export default HomePage;