import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./AuthPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}
