import React, { useState } from 'react';
import { useTrains } from '../context/TrainContext'; // Use TrainContext
import '../components/Form.css'; // Re-use form styles

const ComplaintModalContent = ({ onClose }) => {
    const [bookingPnr, setBookingPnr] = useState(''); // Allow user to enter PNR
    const [complaintType, setComplaintType] = useState('OTHER');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { submitComplaint } = useTrains(); // Get function from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!description || !bookingPnr) {
            setMessage('Please enter your PNR and a description.');
            return;
        }
        setIsLoading(true);

        try {
            const success = await submitComplaint({
                bookingPnr,
                complaintType,
                description,
            });

            if (success) {
                setMessage('Complaint submitted successfully!');
                setBookingPnr('');
                setDescription('');
                // Optional: close modal after a delay
                setTimeout(onClose, 2000);
            } else {
                setMessage('Failed to submit complaint. Please try again.');
            }
        } catch (error) {
            console.error("Complaint submission failed:", error);
            setMessage('Failed to submit complaint. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container modal-form">
            {message && <p className={message.includes('success') ? 'form-success' : 'form-error'}>{message}</p>}
            <input
                type="text"
                placeholder="Enter Booking PNR"
                value={bookingPnr}
                onChange={(e) => setBookingPnr(e.target.value.toUpperCase())}
                className="form-input"
                required
            />
            <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
                className="form-input"
            >
                <option value="SEAT_ISSUE">Seat Issue</option>
                <option value="ATTENDANT_BEHAVIOR">Attendant Behavior</option>
                <option value="FOOD_QUALITY">Food Quality</option>
                <option value="OTHER">Other</option>
            </select>
            <textarea
                placeholder="Describe your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                rows="4"
                required
            />
            <button type="submit" className="form-button form-button-full" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Complaint'}
            </button>
        </form>
    );
};

export default ComplaintModalContent;