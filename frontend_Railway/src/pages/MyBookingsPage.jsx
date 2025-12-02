import React, { useEffect, useCallback } from 'react'; // 1. Import useEffect and useCallback
import { useTrains } from '../context/TrainContext';
import '../components/Card.css';

const MyBookingsPage = () => {
    // 2. Get 'myBookings' AND 'fetchMyBookings' from useTrains
    const { myBookings, fetchMyBookings } = useTrains();

    // 3. Wrap the fetch function in useCallback
    const memoizedFetchBookings = useCallback(() => {
        fetchMyBookings();
    }, [fetchMyBookings]);

    // 4. Add this useEffect hook
    useEffect(() => {
        // This runs once when the component loads
        memoizedFetchBookings();
    }, [memoizedFetchBookings]); // Use the memoized function

    return (
        <div className="page-container">
            <h1>My Bookings</h1>
            {myBookings.length === 0 ? (
                <p style={{ textAlign: 'center' }}>You have no bookings.</p>
            ) : (
                myBookings.map(booking => (
                    <div key={booking.id || booking.pnr} className="card"> {/* Use a stable key */}
                        <div className="card-details">
                            <h3>PNR: {booking.pnr}</h3>
                            <p><strong>Train:</strong> {booking.train?.name} ({booking.train?.id})</p>
                            <p><strong>From:</strong> {booking.train?.fromStation} <strong>To:</strong> {booking.train?.toStation}</p>
                            <p><strong>Date:</strong> {booking.journeyDate}</p>
                            <p><strong>Status:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>{booking.status}</span></p>

                            <h4 style={{marginTop: '1rem', marginBottom: '0.5rem'}}>Passengers:</h4>
                            {booking.passengers?.map((p, index) => (
                                <p key={index}>{index + 1}. {p.name} ({p.age})</p>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyBookingsPage;