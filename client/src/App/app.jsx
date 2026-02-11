import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";
import Footer from "../components/footer/Footer";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import Header from "../components/header/Header";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AIChat from "../components/AIChat/AIChat";
import Home from "../pages/home/Home";
import Contact from "../pages/ContactUs/ContactUs";
import Auth from "../pages/auth/Auth";
import Rooms from "../pages/rooms/Rooms";
import RoomDetails from "../pages/user/RoomDetails";
import MyBookings from "../pages/user/MyBookings";
import Dashboard from "../pages/admin/Dashboard";
import ManageRooms from "../pages/admin/ManageRooms";
import Halls from "../pages/halls/Halls";
import Gallery from "../pages/gallery/Gallery";
import Booking from "../pages/booking/Booking";
import Restaurant from "../pages/restaurant/Restaurant";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Header />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/halls" element={<Halls />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />

            {/* User Protected Routes */}
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/rooms"
              element={
                <ProtectedRoute adminOnly>
                  <ManageRooms />
                </ProtectedRoute>
              }
            />
          </Routes>

          <AIChat />
          <Footer />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
