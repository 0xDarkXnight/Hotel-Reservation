import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import BookRoom from './pages/BookRoom';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/hotels" element={<ProtectedRoute><Hotels /></ProtectedRoute>} />
            <Route path="/hotels/:id" element={<ProtectedRoute><HotelDetail /></ProtectedRoute>} />
            <Route path="/book/:roomId" element={<ProtectedRoute><BookRoom /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
