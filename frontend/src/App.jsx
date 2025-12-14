import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import Sweets from "./pages/Sweets";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
