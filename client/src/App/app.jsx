import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "../context/AuthContext";
import { LanguageProvider } from "../context/LanguageContext";

import Footer from "../components/footer/Footer";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import Header from "../components/header/Header";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AIChat from "../components/AIChat/AIChat";

// pages
import Home from "../pages/home/Home";
import Contact from "../pages/ContactUs/ContactUs";
import Auth from "../pages/auth/Auth";
import Rooms from "../pages/rooms/Rooms";
import RoomDetails from "../components/RoomDetails/RoomDetails";
import MyBookings from "../pages/user/MyBookings";
import Dashboard from "../pages/admin/Dashboard";
import ManageRooms from "../pages/admin/ManageRooms";
import ManageBookings from "../pages/admin/ManageBookings";
import Halls from "../pages/halls/Halls";
import Gallery from "../pages/gallery/Gallery";
import Booking from "../pages/booking/Booking";
import Restaurant from "../pages/restaurant/Restaurant";

/* ================= EMPLOYEE ================= */
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import MyTasks from "../pages/employee/MyTasks";
import MySchedule from "../pages/employee/MySchedule";
import GuestServices from "../pages/employee/GuestServices";
import MySalary from "../pages/employee/MySalary";
import EmployeeMessages from "../pages/employee/EmployeeMessages";

/* ================= MANAGER ================= */
import ManagerDashboard from "../pages/Dept Manager/ManagerDashboard";
import ManagerEmployees from "../pages/Dept Manager/employees";
import ManagerMessages from "../pages/Dept Manager/messages";
import ManagerRequests from "../pages/Dept Manager/requests";
import ManagerSalaries from "../pages/Dept Manager/salaries";
import ManagerSchedule from "../pages/Dept Manager/schedule";
import ManagerTasks from "../pages/Dept Manager/tasks";

function AppContent() {
  return (
    <>
      <ScrollToTop />

      <Header />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/halls" element={<Halls />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />

        {/* ================= USER ================= */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
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
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <ManageBookings />
            </ProtectedRoute>
          }
        />

        {/* ================= EMPLOYEE ================= */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute employeeOnly>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/tasks"
          element={
            <ProtectedRoute employeeOnly>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/schedule"
          element={
            <ProtectedRoute employeeOnly>
              <MySchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/services"
          element={
            <ProtectedRoute employeeOnly>
              <GuestServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/salary"
          element={
            <ProtectedRoute employeeOnly>
              <MySalary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/messages"
          element={
            <ProtectedRoute employeeOnly>
              <EmployeeMessages />
            </ProtectedRoute>
          }
        />

        {/* ================= MANAGER ================= */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute managerOnly>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/employees"
          element={
            <ProtectedRoute managerOnly>
              <ManagerEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/messages"
          element={
            <ProtectedRoute managerOnly>
              <ManagerMessages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/requests"
          element={
            <ProtectedRoute managerOnly>
              <ManagerRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/salaries"
          element={
            <ProtectedRoute managerOnly>
              <ManagerSalaries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/schedule"
          element={
            <ProtectedRoute managerOnly>
              <ManagerSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/tasks"
          element={
            <ProtectedRoute managerOnly>
              <ManagerTasks />
            </ProtectedRoute>
          }
        />
      </Routes>

      <AIChat />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}
