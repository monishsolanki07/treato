import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function AdminRoute({ children }) {
  const { token } = useAuth();
  
  // Check if user is admin (you'll need to decode token or store role)
  // For now, we'll check if token exists and user is staff
  // You should add isAdmin check to your AuthContext
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Add proper admin check here
  return children;
}

export default AdminRoute;
