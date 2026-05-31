import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const roleRoutes = {
      admin: "/admin",
      doctor: "/doctor",
      patient: "/patient",
      receptionist: "/receptionist",
    };
    return <Navigate to={roleRoutes[user.role] || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
