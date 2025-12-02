import React, { useState, useEffect, useCallback } from 'react';
import { useTrains } from '../context/TrainContext';
import api from '../api';
import '../components/Form.css';
import '../components/Card.css';

const AdminPage = () => {
    const { trains, fetchAllTrains, addTrain, cancelTrain } = useTrains();

    // State for Add Train
    const [newTrain, setNewTrain] = useState({
        name: '', fromStation: '', toStation: '', departure: '', arrival: '', duration: '', price: 0, seatsAvailable: 0
    });

    // State for Create Staff
    const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '', role: 'TTE' });

    // State for Assign Staff
    const [assignment, setAssignment] = useState({ staffEmail: '', trainId: '', journeyDate: '' });

    // State for messages
    const [message, setMessage] = useState({ type: '', text: '' });

    const memoizedFetchAllTrains = useCallback(() => {
        fetchAllTrains();
    }, [fetchAllTrains]);

    useEffect(() => {
        memoizedFetchAllTrains();
    }, [memoizedFetchAllTrains]);

    // --- FIX #1: This function is now used in the 'Add Train' form ---
    const handleTrainChange = (e) => {
        const { name, value } = e.target;
        setNewTrain(prev => ({ ...prev, [name]: name === 'price' || name === 'seatsAvailable' ? parseFloat(value) : value }));
    };

    const handleAddTrain = async (e) => {
        e.preventDefault();
        const success = await addTrain(newTrain);
        if (success) {
            setNewTrain({ name: '', fromStation: '', toStation: '', departure: '', arrival: '', duration: '', price: 0, seatsAvailable: 0 });
            setMessage({ type: 'success', text: 'Train added successfully!' });
        } else {
            setMessage({ type: 'error', text: 'Failed to add train.' });
        }
    };

    // --- FIX #2: This function is now used in the 'Manage Existing Trains' list ---
    const handleCancelTrain = async (trainId) => {
        if (window.confirm("Are you sure you want to cancel this train?")) {
            const success = await cancelTrain(trainId);
            if (success) {
                setMessage({ type: 'success', text: 'Train cancelled.' });
            } else {
                setMessage({ type: 'error', text: 'Failed to cancel train.' });
            }
        }
    };

    // --- Staff Handlers (keep these as they are) ---
    const handleStaffChange = (e) => {
        const { name, value } = e.target;
        setNewStaff(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/admin/create-staff?role=${newStaff.role}`, {
                name: newStaff.name,
                email: newStaff.email,
                password: newStaff.password
            });
            setNewStaff({ name: '', email: '', password: '', role: 'TTE' });
            setMessage({ type: 'success', text: 'Staff account created successfully!' });
        } catch (err) {
            console.error("Failed to create staff:", err);
            setMessage({ type: 'error', text: 'Failed to create staff. Email may be in use.' });
        }
    };

    const handleAssignmentChange = (e) => {
        const { name, value } = e.target;
        setAssignment(prev => ({ ...prev, [name]: value }));
    };

    const handleAssignStaff = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/assign-staff', assignment);
            setAssignment({ staffEmail: '', trainId: '', journeyDate: '' });
            setMessage({ type: 'success', text: 'Staff assigned successfully!' });
        } catch (err) {
            console.error("Failed to assign staff:", err);
            setMessage({ type: 'error', text: 'Failed to assign staff. Check details.' });
        }
    };

    return (
        <div className="page-container">
            <h1>Admin Panel</h1>

            {message.text && (
                <p className={message.type === 'success' ? 'form-success' : 'form-error'}>
                    {message.text}
                </p>
            )}

            {/* --- Create Staff Form --- */}
            <h2>Create Staff Account (TTE / Police)</h2>
            <form onSubmit={handleCreateStaff} className="form-container" style={{ margin: '0 auto 2rem auto' }}>
                <div className="form-row">
                    <input type="text" name="name" placeholder="Full Name" value={newStaff.name} onChange={handleStaffChange} required className="form-input" />
                    <input type="email" name="email" placeholder="Email" value={newStaff.email} onChange={handleStaffChange} required className="form-input" />
                </div>
                <div className="form-row">
                    <input type="password" name="password" placeholder="Password" value={newStaff.password} onChange={handleStaffChange} required className="form-input" />
                    <select name="role" value={newStaff.role} onChange={handleStaffChange} className="form-input">
                        <option value="TTE">TTE</option>
                        <option value="POLICE">Police</option>
                    </select>
                </div>
                <button type="submit" className="form-button form-button-full">Create Staff</button>
            </form>

            {/* --- Assign Staff Form --- */}
            <h2>Assign Staff to Journey</h2>
            <form onSubmit={handleAssignStaff} className="form-container" style={{ margin: '0 auto 2rem auto' }}>
                <div className="form-row">
                    <input type="email" name="staffEmail" placeholder="Staff Email" value={assignment.staffEmail} onChange={handleAssignmentChange} required className="form-input" />
                    <input type="text" name="trainId" placeholder="Train ID (e.g., T123)" value={assignment.trainId} onChange={handleAssignmentChange} required className="form-input" />
                    <input type="date" name="journeyDate" value={assignment.journeyDate} onChange={handleAssignmentChange} required className="form-input" />
                </div>
                <button type="submit" className="form-button form-button-full">Assign Staff</button>
            </form>

            {/* --- Add Train Form (NOW WIRED UP) --- */}
            <h2>Add New Train</h2>
            <form onSubmit={handleAddTrain} className="form-container" style={{ margin: '0 auto 2rem auto' }}>
                <div className="form-row">
                    {/* --- FIX #3: Added onChange={handleTrainChange} to all inputs --- */}
                    <input type="text" name="name" placeholder="Train Name" value={newTrain.name} onChange={handleTrainChange} required className="form-input" />
                </div>
                <div className="form-row">
                    <input type="text" name="fromStation" placeholder="From (e.g., NDLS)" value={newTrain.fromStation} onChange={handleTrainChange} required className="form-input" />
                    <input type="text" name="toStation" placeholder="To (e.g., BOM)" value={newTrain.toStation} onChange={handleTrainChange} required className="form-input" />
                </div>
                <div className="form-row">
                    <input type="text" name="departure" placeholder="Departure (17:00)" value={newTrain.departure} onChange={handleTrainChange} required className="form-input" />
                    <input type="text" name="arrival" placeholder="Arrival (09:00)" value={newTrain.arrival} onChange={handleTrainChange} required className="form-input" />
                    <input type="text" name="duration" placeholder="Duration (16h 0m)" value={newTrain.duration} onChange={handleTrainChange} required className="form-input" />
                </div>
                <div className="form-row">
                    <input type="number" name="price" placeholder="Price" value={newTrain.price} onChange={handleTrainChange} required className="form-input" />
                    <input type="number" name="seatsAvailable" placeholder="Seats Available" value={newTrain.seatsAvailable} onChange={handleTrainChange} required className="form-input" />
                </div>
                <button type="submit" className="form-button form-button-full">Add Train</button>
            </form>

            {/* --- Manage Trains List (NOW WIRED UP) --- */}
            <h2>Manage Existing Trains</h2>
            <div className="train-list-admin">
                {trains.map(train => (
                    <div key={train.id} className="card">
                        <div className="card-row">
                            <div className="card-details">
                                <h3>{train.name} ({train.id})</h3>
                                <p>{train.fromStation} → {train.toStation}</p>
                                <p><strong>Price:</strong> ₹{train.price} | <strong>Seats:</strong> {train.seatsAvailable}</p>
                            </div>
                            <div className="card-actions">
                                {/* --- FIX #4: Added onClick={handleCancelTrain} --- */}
                                <button
                                    className="form-button form-button-danger"
                                    onClick={() => handleCancelTrain(train.id)}
                                >
                                    Cancel Train
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;