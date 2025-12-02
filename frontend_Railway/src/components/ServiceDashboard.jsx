import React, { useState } from 'react';
import Modal from './Modal';
import ComplaintModalContent from './ComplaintModalContent';
import FoodMenuModalContent from './FoodMenuModalContent';
import EmergencyHelpModalContent from './EmergencyHelpModalContent';
import { FaUtensils, FaExclamationTriangle, FaHeadset } from 'react-icons/fa'; // Icons
import './ServiceDashboard.css';

const ServiceDashboard = () => {
    const [modalType, setModalType] = useState(null); // 'food', 'complaint', 'help', or null

    const openModal = (type) => setModalType(type);
    const closeModal = () => setModalType(null);

    return (
        <>
            <div className="service-dashboard">
                <h2>In-Train Services</h2>
                <div className="service-buttons">
                    <button onClick={() => openModal('food')} className="service-button food">
                        <FaUtensils size={24} />
                        <span>Order Food</span>
                    </button>
                    <button onClick={() => openModal('complaint')} className="service-button complaint">
                        <FaExclamationTriangle size={24} />
                        <span>Raise Complaint</span>
                    </button>
                    <button onClick={() => openModal('help')} className="service-button help">
                        <FaHeadset size={24} />
                        <span>Emergency Help</span>
                    </button>
                </div>
            </div>

            <Modal isOpen={modalType === 'food'} onClose={closeModal} title="Order Food">
                <FoodMenuModalContent onClose={closeModal} />
            </Modal>

            <Modal isOpen={modalType === 'complaint'} onClose={closeModal} title="Raise a Complaint">
                <ComplaintModalContent onClose={closeModal} />
            </Modal>

            <Modal isOpen={modalType === 'help'} onClose={closeModal} title="Emergency Help">
                <EmergencyHelpModalContent />
            </Modal>
        </>
    );
};

export default ServiceDashboard;