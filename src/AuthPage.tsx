import React, { useState } from "react";
import "./Auth.css";
import { Box, TextField, Button, Typography } from "@mui/material";
import axios from "axios";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", loginData);
      alert(`✅ Login successful!\nToken: ${res.data.token}`);
      localStorage.setItem("token", res.data.token);
    } catch (err: any) {
      alert(`❌ Login failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/register", {
        ...registerData,
        role: "CUSTOMER", // or "SALES" if you add toggle later
      });
      alert("✅ Registration successful! Please log in.");
      setIsSignUp(false);
    } catch (err: any) {
      alert(`❌ Registration failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
      {/* SIGN IN FORM */}
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form" onSubmit={handleLogin}>
            <Typography variant="h5">Sign In</Typography>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Sign In
            </Button>
          </form>

          {/* SIGN UP FORM */}
          <form className="sign-up-form" onSubmit={handleRegister}>
            <Typography variant="h5">Create Account</Typography>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerData.firstName}
              onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerData.lastName}
              onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerData.phone}
              onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerData.address}
              onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </form>
        </div>
      </div>

      {/* PANELS FOR ANIMATION */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <Typography variant="h5">New here?</Typography>
            <p>Create an account to enjoy all features.</p>
            <Button variant="outlined" onClick={() => setIsSignUp(true)}>
              Sign Up
            </Button>
          </div>
        </div>
        <div className="panel right-panel">
          <div className="content">
            <Typography variant="h5">One of us?</Typography>
            <p>Sign in to continue where you left off.</p>
            <Button variant="outlined" onClick={() => setIsSignUp(false)}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
