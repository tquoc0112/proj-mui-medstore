import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />        {/* Default Login page */}
        <Route path="/register" element={<Register />} /> {/* Register page */}
      </Routes>
    </Router>
  );
}
