import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Link,
  Grid,
  Tabs,
  Tab
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import coverImage from "./assets/medstorepak_cover.jfif";

export default function Register() {
  const [tab, setTab] = useState(0); // 0 = Customer, 1 = Seller
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    pharmacyLicense: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: tab === 1 ? "SALES" : "CUSTOMER",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Registration failed!");
      } else {
        alert(data.message);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }

    setLoading(false);
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
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
          >
            <Typography variant="h5" gutterBottom textAlign="center">
              {tab === 0 ? "Create an Account" : "Register as Seller"}
            </Typography>

            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              <Tab label="Customer" />
              <Tab label="Seller" />
            </Tabs>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                {/* Seller-only fields */}
                {tab === 1 && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Store Name"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Pharmacy License Number"
                        name="pharmacyLicense"
                        value={formData.pharmacyLicense}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                  </>
                )}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : tab === 0 ? (
                  "Signup"
                ) : (
                  "Register as Seller"
                )}
              </Button>
            </form>

            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>

            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              <span style={{ color: "#555" }}>Already have an account? </span>
              <Link
                underline="hover"
                sx={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                Sign in
              </Link>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
