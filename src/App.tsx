import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./AuthPage";
import CustomerProfile from "./pages/profile/CustomerProfile";
import SellerProfile from "./pages/profile/SellerProfile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
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
      </Routes>
    </Router>
  );
}
