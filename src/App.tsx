import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerProfile from "./pages/profile/CustomerProfile";
import SellerProfile from "./pages/profile/SellerProfile";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* Public auth route */}
      <Route path="/" element={<AuthPage />} />

      {/* Direct, protected profile routes */}
      <Route
        path="/profile/customer"
        element={
          <ProtectedRoute>
            <CustomerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/seller"
        element={
          <ProtectedRoute>
            <SellerProfile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/profile/customer" replace />} />
    </Routes>
  );
}
