import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrains } from '../context/TrainContext';
import './BookingPage.css';

const BookingPage = () => {
    const { trainId } = useParams();
    const navigate = useNavigate();

    // --- THIS IS THE FIX ---
    // Get 'searchResults' from context, not 'trains'
    const { searchResults, bookTicket } = useTrains();

    const [selectedTrain, setSelectedTrain] = useState(null);
    const [passengers, setPassengers] = useState([]);
    const [currentPassenger, setCurrentPassenger] = useState({ name: '', age: '', gender: 'Male' });

    // --- THIS IS THE FIX ---
    // Find the train in 'searchResults'
    useEffect(() => {
        // We use parseInt because the trainId from the URL is a string
        const train = searchResults.find(t => t.id === parseInt(trainId));
        setSelectedTrain(train);
    }, [trainId, searchResults]); // Dependency is now searchResults

    // Handle changes in the "Add Passenger" form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentPassenger(prev => ({ ...prev, [name]: value }));
    };

    // Add the passenger from the form to the passengers list
    const handleAddPassenger = (e) => {
        e.preventDefault();
        if (!currentPassenger.name || !currentPassenger.age || !currentPassenger.gender) {
            alert('Please fill all passenger details.');
            return;
        }
        setPassengers([...passengers, currentPassenger]);
        // Reset the form
        setCurrentPassenger({ name: '', age: '', gender: 'Male' });
    };

    // Final booking submission
    const handleConfirmBooking = async () => {
        if (!selectedTrain) {
            alert("Train data is missing. Please search again.");
            navigate('/');
            return;
        }
        if (passengers.length === 0) {
            alert('Please add at least one passenger.');
            return;
        }

        const newBooking = await bookTicket(selectedTrain, passengers);

        if (newBooking) {
            navigate('/confirmation', { state: { booking: newBooking } });
        } else {
            alert('Booking failed. Please try again.');
        }
    };

    // Calculate total price
    const totalPrice = selectedTrain ? selectedTrain.price * passengers.length : 0;

    // Show a loading message until the train details are found
    if (!selectedTrain) {
        return <div style={{ padding: '2rem' }}>Loading train details...</div>;
    }

    return (
        <div className="booking-page">
            <h2>Book Ticket for Train {selectedTrain.name} ({selectedTrain.id})</h2>

            <div className="train-details-summary">
                {/* Use backend field names (fromStation/toStation) */}
                <p><strong>From:</strong> {selectedTrain.fromStation}</p>
                <p><strong>To:</strong> {selectedTrain.toStation}</p>
                <p><strong>Price per Ticket:</strong> ₹{selectedTrain.price}</p>
            </div>

            <div className="booking-form-container">
                {/* Passenger Form */}
                <form onSubmit={handleAddPassenger} className="passenger-form">
                    <h3>Add Passenger</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={currentPassenger.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={currentPassenger.age}
                        onChange={handleChange}
                        required
                    />
                    <select name="gender" value={currentPassenger.gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <button type="submit">Add Passenger</button>
                </form>

                {/* Booking Summary */}
                <div className="booking-summary">
                    <h3>Booking Summary</h3>
                    {passengers.length === 0 ? (
                        <p>No passengers added yet.</p>
                    ) : (
                        <ul className="passenger-list">
                            {passengers.map((p, index) => (
                                <li key={index}>
                                    {index + 1}. {p.name} ({p.age}, {p.gender})
                                </li>
                            ))}
                        </ul>
                    )}

                    {passengers.length > 0 && (
                        <div className="total-price">
                            <h3>Total Price: ₹{totalPrice}</h3>
                            <button onClick={handleConfirmBooking} className="confirm-btn">
                                Confirm & Book
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;