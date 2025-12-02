import React, { useEffect, useCallback } from 'react'; // 1. Import useEffect and useCallback
import { useTrains } from '../context/TrainContext';
import '../components/Card.css';
import '../index.css'; // For status badges

const MyComplaintsPage = () => {
    const { myComplaints, fetchComplaints } = useTrains();

    // 2. Wrap in useCallback
    const memoizedFetchComplaints = useCallback(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    // 3. Add this useEffect hook
    useEffect(() => {
        memoizedFetchComplaints();
    }, [memoizedFetchComplaints]);

    return (
        <div className="page-container">
            <h1>My Complaints</h1>
            {myComplaints.length === 0 ? (
                <p style={{ textAlign: 'center' }}>You have not submitted any complaints.</p>
            ) : (
                myComplaints.map(complaint => (
                    <div key={complaint.id} className="card">
                        <div className="card-details">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
                                <h3 style={{ margin: 0 }}>PNR: {complaint.bookingPnr || 'N/A'}</h3>
                                <span className={`status-badge status-${complaint.status?.toLowerCase()}`}>{complaint.status}</span>
                            </div>
                            <p><strong>Type:</strong> {complaint.complaintType?.replace('_', ' ')}</p>
                            <p><strong>Description:</strong> {complaint.description}</p>
                            <p style={{fontSize: '0.8rem', color: '#888', marginTop: '1rem'}}>
                                Submitted: {new Date(complaint.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyComplaintsPage;