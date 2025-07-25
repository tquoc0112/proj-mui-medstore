import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Link,
  Tabs,
  Tab
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import coverImage from "./assets/medstorepak_cover.jfif";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SALES" | "ADMIN">("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        alert("Login successful!");

        // ✅ Redirect based on role
        if (data.role === "ADMIN") navigate("/admin");
        else if (data.role === "SALES") navigate("/sales");
        else navigate("/"); // default for customers
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: `url(${coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container justifyContent="center" sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              textAlign: "center",
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Welcome Back
            </Typography>

            {/* ✅ Role Tabs */}
            <Tabs
              value={role}
              onChange={(e, newValue) => setRole(newValue)}
              centered
              sx={{ mb: 2 }}
            >
              <Tab label="Customer" value="CUSTOMER" />
              <Tab label="Seller" value="SALES" />
              <Tab label="Admin" value="ADMIN" />
            </Tabs>

            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            <Typography variant="body2" sx={{ mt: 2 }}>
              <Link
                underline="hover"
                sx={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => navigate("/register")}
              >
                Don’t have an account? Register now
              </Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
