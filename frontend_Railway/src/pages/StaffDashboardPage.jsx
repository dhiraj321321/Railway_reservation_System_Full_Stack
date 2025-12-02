import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import '../components/Card.css';
import '../index.css'; // For status badges

const StaffDashboardPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssignedComplaints = useCallback(async () => {
        try {
            // No need to set loading to true here, causes flicker
            const response = await api.get('/staff/my-complaints');
            setComplaints(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch complaints:", err);
            setError("Could not load complaints.");
        } finally {
            setIsLoading(false); // Only set loading false on first load
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchAssignedComplaints(); // Initial fetch

        // Poll for new complaints every 30 seconds
        const interval = setInterval(fetchAssignedComplaints, 30000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [fetchAssignedComplaints]);

    const handleResolve = async (id) => {
        try {
            await api.put(`/staff/complaints/${id}/resolve`);
            // Refresh the list immediately after resolving
            fetchAssignedComplaints();
        } catch (err) {
            console.error("Failed to resolve complaint:", err);
            alert("Could not resolve complaint.");
        }
    };

    if (isLoading) {
        return <div className="page-container"><p>Loading complaints...</p></div>;
    }

    if (error) {
        return <div className="page-container"><p style={{color: 'red'}}>{error}</p></div>;
    }

    return (
        <div className="page-container">
            <h1>Staff Dashboard: Assigned Complaints</h1>
            {complaints.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No active complaints for your assigned journey.</p>

            ) : (
                complaints.map(complaint => (
                    <div key={complaint.id} className="card">
                        <div className="card-details">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0 }}>PNR: {complaint.bookingPnr}</h3>
                                <span className={`status-badge status-${complaint.status?.toLowerCase()}`}>{complaint.status}</span>
                            </div>
                            <p><strong>Train:</strong> {complaint.trainId} | <strong>Date:</strong> {complaint.journeyDate}</p>
                            <p><strong>Type:</strong> {complaint.complaintType?.replace('_', ' ')}</p>
                            <p><strong>Description:</strong> {complaint.description}</p>
                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>
                                Submitted: {new Date(complaint.timestamp).toLocaleString()}
                            </p>
                            <p><strong>Description:</strong> {complaint.description}</p>

                            {/* --- NEW: Show who complained --- */}
                            <p><strong>Submitted By:</strong> {complaint.user.name} ({complaint.user.email})</p>

                            <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem' }}>
                                Submitted: {new Date(complaint.timestamp).toLocaleString()}
                            </p>
                            {complaint.status === 'PENDING' && (
                                <button
                                    onClick={() => handleResolve(complaint.id)}
                                    className="form-button"
                                    style={{backgroundColor: '#28a745', marginTop: '1rem'}}
                                >
                                    Mark as Resolved
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StaffDashboardPage;