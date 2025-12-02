import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import all your pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import SearchResultsPage from './pages/SearchResultsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminPage from './pages/AdminPage';
import MyComplaintsPage from './pages/MyComplaintsPage';
import MyFoodOrdersPage from './pages/MyFoodOrdersPage';
import StaffDashboardPage from './pages/StaffDashboardPage';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/search" element={<SearchResultsPage />} />

                {/* --- Protected Routes for ROLE_USER (FIXED) --- */}
                <Route path="/book/:trainId" element={
                    <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}> <BookingPage /> </ProtectedRoute>
                } />
                <Route path="/confirmation" element={
                    <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}> <ConfirmationPage /> </ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                    <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}> <MyBookingsPage /> </ProtectedRoute>
                } />
                <Route path="/my-complaints" element={
                    <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}> <MyComplaintsPage /> </ProtectedRoute>
                } />
                <Route path="/my-food-orders" element={
                    <ProtectedRoute roles={['ROLE_USER', 'ROLE_ADMIN']}> <MyFoodOrdersPage /> </ProtectedRoute>
                } />

                {/* --- Protected Route for ROLE_ADMIN (FIXED) --- */}
                <Route path="/admin" element={
                    <ProtectedRoute roles={['ROLE_ADMIN']}> <AdminPage /> </ProtectedRoute>
                } />

                {/* --- Protected Route for TTE and POLICE (FIXED) --- */}
                <Route path="/staff/dashboard" element={
                    <ProtectedRoute roles={['ROLE_TTE', 'ROLE_POLICE']}> <StaffDashboardPage /> </ProtectedRoute>
                } />

            </Routes>
        </>
    );
}

export default App;