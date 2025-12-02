import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Form.css'; // Re-use the same form styles

const RegistrationPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth(); // You will need to create this function in AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            // The register function in AuthContext will call the backend API
            const success = await register(name, email, password);
            if (success) {
                navigate('/'); // On success, navigate to the home page
            } else {
                setError('Registration failed. The email might already be in use.');
            }
        } catch (err) {
            console.error('Registration failed:', err);
            setError('Registration failed. The email might already be in use.');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '500px' }}>
            <h1>Register</h1>
            <form onSubmit={handleSubmit} className="form-container" style={{margin: 0, border: 'none', padding: 0}}>
                {error && <p className="form-error">{error}</p>}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                />
                <button type="submit" className="form-button form-button-full">
                    Create Account
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RegistrationPage;