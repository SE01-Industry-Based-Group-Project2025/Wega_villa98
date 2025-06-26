// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import Facilities from "./pages/Facilities";


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

function App() {
  return (
    <Router>
      
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/guides/:id" element={<TourPlaces />} />
        <Route path="/tour-guide" element={<TourGuide />} />
        <Route path="/tour-book" element={<GuideBook />} />
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
      </Routes>
    </Router>
  );
}

export default App;
