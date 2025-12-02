import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useTrains } from '../context/TrainContext';
import { FiPhoneCall } from 'react-icons/fi'; // Phone icon
import './EmergencyHelp.css';

const EmergencyHelpModalContent = () => {
    const { emergencyContacts, fetchContacts } = useTrains();
    const [loading, setLoading] = useState(true);

    // Wrap fetchContacts in useCallback
    const memoizedFetchContacts = useCallback(() => {
        const loadContacts = async () => {
            setLoading(true);
            await fetchContacts();
            setLoading(false);
        };
        loadContacts();
    }, [fetchContacts]);

    useEffect(() => {
        memoizedFetchContacts();
    }, [memoizedFetchContacts]);

    if (loading) {
        return <p>Loading contact information...</p>;
    }

    if (!emergencyContacts || Object.keys(emergencyContacts).length === 0) {
        return <p>Emergency contact information is currently unavailable.</p>;
    }

    return (
        <div className="emergency-help-container">
            <p className="help-description">
                For immediate assistance, please use the contact numbers below.
            </p>
            <div className="contact-list">
                {emergencyContacts.tte && (
                    <div className="contact-item">
                        <h4>Travelling Ticket Examiner (TTE)</h4>
                        <a href={`tel:${emergencyContacts.tte}`} className="contact-link">
                            <FiPhoneCall /> {emergencyContacts.tte}
                        </a>
                    </div>
                )}
                {emergencyContacts.railwayPolice && (
                    <div className="contact-item">
                        <h4>Railway Protection Force (RPF)</h4>
                        <a href={`tel:${emergencyContacts.railwayPolice}`} className="contact-link">
                            <FiPhoneCall /> {emergencyContacts.railwayPolice}
                        </a>
                    </div>
                )}
                {/* Add more contacts if available in your backend */}
            </div>
        </div>
    );
};

export default EmergencyHelpModalContent;