import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import Sweets from "./pages/Sweets";
import AdminDashboard from "./pages/AdminDashboard"; // ADD THIS
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/register" element={<AuthLayout />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Sweets />
            </ProtectedRoute>
          }
        />

        {/* ADD THIS ROUTE */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
