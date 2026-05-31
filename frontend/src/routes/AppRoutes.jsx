import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Layouts
import DashboardLayout from "../layouts/DashboardLayout";

// Guards
import ProtectedRoute from "../components/common/ProtectedRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Pages
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ManageDoctors from "../pages/admin/ManageDoctors";
import ManagePatients from "../pages/admin/ManagePatients";
import ManageAppointments from "../pages/admin/ManageAppointments";
import ManageBilling from "../pages/admin/ManageBilling";
import ManageDepartments from "../pages/admin/ManageDepartments";

// Doctor Pages
import DoctorDashboard from "../pages/dashboard/DoctorDashboard";
import MyAppointmentsDoctor from "../pages/doctor/MyAppointments";
import MyPatients from "../pages/doctor/MyPatients";

// Patient Pages
import PatientDashboard from "../pages/dashboard/PatientDashboard";
import BookAppointment from "../pages/patient/BookAppointment";
import MyAppointmentsPatient from "../pages/patient/MyAppointments";
import MyBills from "../pages/patient/MyBills";

// Receptionist Pages
import ReceptionistDashboard from "../pages/dashboard/ReceptionistDashboard";
import RegisterPatient from "../pages/receptionist/RegisterPatient";
import AppointmentQueue from "../pages/receptionist/AppointmentQueue";

// Smart redirect component
const RoleRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  const routes = {
    admin: "/admin",
    doctor: "/doctor",
    patient: "/patient",
    receptionist: "/receptionist",
  };
  return <Navigate to={routes[user.role] || "/"} replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Smart role redirect */}
      <Route path="/dashboard" element={<RoleRedirect />} />

      {/* ─── ADMIN ROUTES ─── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<ManageDoctors />} />
        <Route path="/admin/patients" element={<ManagePatients />} />
        <Route path="/admin/appointments" element={<ManageAppointments />} />
        <Route path="/admin/billing" element={<ManageBilling />} />
        <Route path="/admin/departments" element={<ManageDepartments />} />
      </Route>

      {/* ─── DOCTOR ROUTES ─── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/appointments" element={<MyAppointmentsDoctor />} />
        <Route path="/doctor/patients" element={<MyPatients />} />
      </Route>

      {/* ─── PATIENT ROUTES ─── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/book" element={<BookAppointment />} />
        <Route path="/patient/appointments" element={<MyAppointmentsPatient />} />
        <Route path="/patient/bills" element={<MyBills />} />
      </Route>

      {/* ─── RECEPTIONIST ROUTES ─── */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["receptionist"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/appointments" element={<AppointmentQueue />} />
        <Route path="/receptionist/register-patient" element={<RegisterPatient />} />
        {/* Reuse admin pages for receptionist (they have API access) */}
        <Route path="/receptionist/patients" element={<ManagePatients />} />
        <Route path="/receptionist/billing" element={<ManageBilling />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;