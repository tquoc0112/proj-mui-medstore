import React, { useState } from "react";
import "./Auth.css";
import { TextField, Button, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert";

export default function AuthPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [role, setRole] = useState<"CUSTOMER" | "SALES">("CUSTOMER");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    storeName: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info");

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showSnackbar("Passwords do not match!", "error");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      showSnackbar(data.message, "success");
      setIsSignUpMode(false);
    } catch (err: any) {
      showSnackbar(err.message, "error");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      showSnackbar("Login successful", "success");
    } catch (err: any) {
      showSnackbar(err.message, "error");
    }
  };

  return (
    <div className={`auth-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      {/* ✅ SIGN IN FORM */}
      <div className="form-container sign-in-container">
        <form className="form-box" onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <TextField
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              bgcolor: "#1a73e8",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Sign In
          </Button>
        </form>
      </div>

      {/* ✅ SIGN UP FORM */}
      <div className="form-container sign-up-container">
        <form className="form-box" onSubmit={handleRegister}>
          <h1>Create Account</h1>

          {/* ✅ ROLE TOGGLE */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              width: "220px",
              margin: "0 auto 15px auto",
              background: "#f0f0f0",
              borderRadius: "30px",
              padding: "3px",
              overflow: "hidden",
              height: "40px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: role === "CUSTOMER" ? "3px" : "calc(50% + 3px)",
                width: "calc(50% - 6px)",
                height: "calc(100% - 6px)",
                background: "linear-gradient(to right, #1a73e8, #3b8dff)",
                borderRadius: "30px",
                transition: "all 0.4s ease",
                zIndex: 1,
              }}
            />
            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              style={{
                flex: 1,
                zIndex: 2,
                background: "transparent",
                border: "none",
                color: role === "CUSTOMER" ? "#fff" : "#000",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30%",
                lineHeight: 1,
                fontSize: "14px",
                padding: 0,
              }}
            >
              CUSTOMER
            </button>
            <button
              type="button"
              onClick={() => setRole("SALES")}
              style={{
                flex: 1,
                zIndex: 2,
                background: "transparent",
                border: "none",
                color: role === "SALES" ? "#fff" : "#000",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "30%",
                lineHeight: 1,
                fontSize: "14px",
                padding: 0,
              }}
            >
              SELLER
            </button>
          </div>

          {/* ✅ Common Fields */}
          <TextField
            label="First Name"
            name="firstName"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />
          <TextField
            label="Phone"
            name="phone"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />
          <TextField
            label="Address"
            name="address"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />

          {role === "SALES" && (
            <TextField
              label="Store Name"
              name="storeName"
              onChange={handleChange}
              required
              fullWidth
              size="small"
              sx={{ mb: 1.2 }}
            />
          )}

          <TextField
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            required
            fullWidth
            size="small"
            sx={{ mb: 1.2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              bgcolor: "#1a73e8",
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Sign Up
          </Button>
        </form>
      </div>

      {/* ✅ BLUE PANEL */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected, please login with your account</p>
            <button onClick={() => setIsSignUpMode(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your details and start your journey with us</p>
            <button onClick={() => setIsSignUpMode(true)}>Sign Up</button>
          </div>
        </div>
      </div>

      {/* ✅ SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
