import { Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";

import CustomerProfile from "./pages/profile/CustomerProfile";
import SellerProfile from "./pages/profile/SellerProfile";

// Admin pages you already have in src/pages/admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminOrders from "./pages/admin/AdminOrders";

import "./App.css";

// Fallback component — send user to the right landing by role
function RedirectByRole() {
  const role = localStorage.getItem("role") || "";
  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "SALES" || role === "SELLER") return <Navigate to="/profile/seller" replace />;
  return <Navigate to="/profile/customer" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public auth route */}
      <Route path="/" element={<AuthPage />} />

      {/* Admin dashboard (protected, admin only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>

      {/* Profiles (protected) */}
      <Route
        path="/profile/customer"
        element={
          <ProtectedRoute allow={["CUSTOMER", "ADMIN", "SALES"]}>
            <CustomerProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/seller"
        element={
          <ProtectedRoute allow={["SALES", "ADMIN"]}>
            <SellerProfile />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<RedirectByRole />} />
    </Routes>
  );
}
