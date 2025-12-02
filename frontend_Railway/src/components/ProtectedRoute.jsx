import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Update to accept a 'roles' prop (an array of strings)
const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user) {
        // 1. Not logged in at all
        return <Navigate to="/login" replace />;
    }

    // 2. Get the user's roles from the JWT
    // The authorities object is like: { authority: "ROLE_ADMIN" }
    const userRoles = user.authorities.map(auth => auth.authority);

    // 3. Check if the user has AT LEAST ONE of the required roles
    // This now correctly checks for 'ROLE_ADMIN', 'ROLE_TTE', etc.
    const hasRequiredRole = roles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
        // 4. Logged in, but does not have permission
        return <Navigate to="/" replace />; // Redirect to home
    }

    // 5. User is logged in AND has the correct role
    return children;
};

export default ProtectedRoute;