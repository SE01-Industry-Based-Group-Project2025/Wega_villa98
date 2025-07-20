// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Log from "./pages/Auth";
import TourGuide from "./pages/travel";
import TourPlaces from "./pages/GuideDetail";
import Gallery from "./pages/gallery";
import About from "./pages/About";
import Room from "./pages/RoomBooking";
import GuideBook from "./pages/TourGuidBook";
import Event from "./pages/EventBooking";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import GuideDashboard from "./pages/GuideDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import Facilities from "./pages/Facilities";


// Protected Route Component for any authenticated user (for bookings)
const ProtectedBookingRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Show login prompt component instead of redirecting
    return <LoginPrompt />;
  }
  return children;
};

// Login Prompt Component
const LoginPrompt = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-4a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zM12 1v6m0 0L8 3m4 4l4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to your account to access booking services and write reviews.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/auth')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Go to Login
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component for Admin and Manager
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  if (!token) return <Navigate to="/auth" replace />;
  const roleUpper = (userRole || "").toUpperCase();
  if (!roleUpper.includes('ADMIN') && !roleUpper.includes('MANAGER')) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

// Protected Route Component for Guide
const ProtectedGuideRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  if (!token) return <Navigate to="/auth" replace />;
  if (!userRole || !userRole.toUpperCase().includes('GUIDE')) return <Navigate to="/auth" replace />;
  return children;
};

// Protected Route Component for Client/User
const ProtectedClientRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  if (!token) return <Navigate to="/auth" replace />;
  if (!userRole || userRole.toUpperCase() !== 'USER') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/guides/:id" element={<TourPlaces />} />
        <Route path="/tour-guide" element={<TourGuide />} />
        <Route path="/tour-book" element={
          <ProtectedBookingRoute>
            <GuideBook />
          </ProtectedBookingRoute>
        } />
        <Route path="/auth" element={<Log />} />        
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/event-booking" element={<Event/>} />
        <Route path="/rooms-booking" element={<Room />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
      <Routes>
        <Route path="/admin-dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/guide-dashboard" element={
          <ProtectedGuideRoute>
            <GuideDashboard />
          </ProtectedGuideRoute>
        } />
        <Route path="/client-dashboard" element={
          <ProtectedClientRoute>
            <ClientDashboard />
          </ProtectedClientRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
