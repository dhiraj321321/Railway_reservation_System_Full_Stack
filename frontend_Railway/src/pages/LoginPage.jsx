import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Form.css'; // Import the form styles
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const success = await login(username, password);

            if (success) {
                // Redirect based on role
                const token = localStorage.getItem('authToken');
                const decodedUser = jwtDecode(token);
                const roles = decodedUser.authorities.map(auth => auth.authority);

                if (roles.includes('ADMIN')) {
                    navigate('/admin');
                } else if (roles.includes('TTE') || roles.includes('POLICE')) {
                    navigate('/staff/dashboard');
                } else {
                    navigate('/'); // Default for USER
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid username or password');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '500px' }}>
            <h1>Login</h1>

            {/* --- THIS IS THE MISSING FORM --- */}
            <form onSubmit={handleSubmit} className="form-container" style={{margin: 0, border: 'none', padding: 0}}>
                {error && <p className="form-error">{error}</p>}

                <input
                    type="email" // Use 'email' type for better browser support
                    placeholder="Email (e.g., dhiraj@example.com)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    required
                />
                <button type="submit" className="form-button form-button-full">
                    Login
                </button>
            </form>
            {/* --- END OF FORM --- */}

            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Don't have an account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default LoginPage;