import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import "./Auth.css";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <Box className={`auth-container ${isSignUp ? "sign-up-mode" : ""}`}>
      {/* -------- Sign In Form -------- */}
      <Box className="form-container sign-in-container">
        <Paper elevation={6} className="form-box">
          <Typography variant="h5" gutterBottom>
            Sign In
          </Typography>
          <TextField label="Email" fullWidth margin="normal" />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign In
          </Button>
        </Paper>
      </Box>

      {/* -------- Sign Up Form -------- */}
      <Box className="form-container sign-up-container">
        <Paper elevation={6} className="form-box">
          <Typography variant="h5" gutterBottom>
            Create Account
          </Typography>
          <TextField label="Full Name" fullWidth margin="normal" />
          <TextField label="Email" fullWidth margin="normal" />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" fullWidth sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </Paper>
      </Box>

      {/* -------- Sliding Panel -------- */}
      <Box className="overlay-container">
        <Box className="overlay">
          <Box className="overlay-panel overlay-left">
            <Typography variant="h5" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sign in to continue where you left off.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsSignUp(false)}
              sx={{ color: "#fff", borderColor: "#fff" }}
            >
              Sign In
            </Button>
          </Box>

          <Box className="overlay-panel overlay-right">
            <Typography variant="h5" gutterBottom>
              New here?
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Create an account to enjoy all features.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsSignUp(true)}
              sx={{ color: "#fff", borderColor: "#fff" }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
