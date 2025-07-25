import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Auth from "./Auth"; // ✅ New animation-based Auth page

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default existing routes */}
        <Route path="/" element={<Login />} /> {/* Default Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}

        {/* ✅ New route for animated Login/Register */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}
