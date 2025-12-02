import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // --- THIS IS THE CORRECTED LOGIC ---
    // We now check for the full role name, including 'ROLE_'
    const isAdmin = user && user.authorities &&
        user.authorities.some(auth => auth.authority === 'ROLE_ADMIN');

    const isStaff = user && user.authorities &&
        user.authorities.some(auth => auth.authority === 'ROLE_TTE' || auth.authority === 'ROLE_POLICE');

    const isUser = user && user.authorities &&
        user.authorities.some(auth => auth.authority === 'ROLE_USER');
    // --- END OF FIX ---

    const getNavLinkClass = ({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link';

    return (
        <nav className="navbar">
            <NavLink to="/" className="navbar-brand">TrainSystem</NavLink>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span className="navbar-welcome">Welcome, {user.sub}!</span>

                        {/* These links will now appear for regular users */}
                        {isUser && <NavLink to="/my-bookings" className={getNavLinkClass}>My Bookings</NavLink>}
                        {isUser && <NavLink to="/my-complaints" className={getNavLinkClass}>My Complaints</NavLink>}
                        {isUser && <NavLink to="/my-food-orders" className={getNavLinkClass}>My Food Orders</NavLink>}

                        {isAdmin && <NavLink to="/admin" className={getNavLinkClass}>Admin Panel</NavLink>}

                        {isStaff && <NavLink to="/staff/dashboard" className={getNavLinkClass}>Staff Dashboard</NavLink>}

                        <button onClick={handleLogout} className="navbar-button logout">Logout</button>
                    </>
                ) : (
                    <>
                        <NavLink to="/register" className={getNavLinkClass}>Register</NavLink>
                        <NavLink to="/login" className="navbar-button login">Login</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;