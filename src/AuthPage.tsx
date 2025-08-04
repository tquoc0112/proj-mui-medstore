import { useState, useEffect } from "react";
import "./Auth.css";
import {
  TextField,
  Button,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import type { SelectChangeEvent } from "@mui/material/Select";
import MuiAlert from "@mui/material/Alert";
import type { AlertColor } from "@mui/material/Alert";

export default function AuthPage() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    businessType: "",
    otherBusinessType: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("info");

  // ✅ Toggle class on <body> based on Sign Up state
  useEffect(() => {
    if (isSignUpMode) {
      document.body.classList.add("sign-up-mode");
    } else {
      document.body.classList.remove("sign-up-mode");
    }
  }, [isSignUpMode]);

  const handleSnackbarClose = () => setSnackbarOpen(false);
  const showSnackbar = (message: string, severity: AlertColor) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBusinessTypeChange = (e: SelectChangeEvent) => {
    setFormData({ ...formData, businessType: e.target.value });
  };

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  const trimmedEmail = formData.email.trim();
  const trimmedStoreName = formData.storeName.trim();
  if (formData.password !== formData.confirmPassword) {
    showSnackbar("Passwords do not match!", "error");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: trimmedEmail,
        password: formData.password,
        role: role === "SELLER" ? "SALES" : "CUSTOMER",
        storeName: trimmedStoreName || null,
        businessType: formData.businessType || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Registration failed");
    }

    showSnackbar(data.message || "Registration successful!", "success");
    setIsSignUpMode(false);
  } catch (error: any) {
    showSnackbar(error.message || "Registration failed", "error");
  }
};


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const trimmedEmail = formData.email.trim();

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: trimmedEmail,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    localStorage.setItem("token", data.token); // save token
    showSnackbar("Login successful!", "success");
  } catch (error: any) {
    showSnackbar(error.message || "Login failed", "error");
  }
};


  return (
    <div className={`auth-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      {/* ✅ SIGN IN FORM */}
      <div className="form-container sign-in-container">
        <form className="form-box" onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <Grid container spacing={0.5} direction="column">
            <Grid>
              <TextField
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Password"
                name="password"
                type="password"
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
            </Grid>
            <Grid>
              <div className="forgot-password">
                <a href="#">Forgot Your Password?</a>
              </div>
            </Grid>
            <Grid>
              <Button type="submit" variant="contained" fullWidth>
                Sign In
              </Button>
            </Grid>
            <Grid>
              <div className="auth-divider">
                <span>or sign in with</span>
              </div>
            </Grid>
            <Grid className="social-icons-auth">
              <a href="#"><i className="fab fa-google"></i></a>
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </Grid>
          </Grid>
        </form>
      </div>

      {/* ✅ SIGN UP FORM */}
      <div className="form-container sign-up-container">
        <form className="form-box" onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <div className="role-toggle">
            <div
              className="slider"
              style={{
                left: role === "CUSTOMER" ? "3px" : "calc(50%)",
              }}
            />
            <button
              type="button"
              className={role === "CUSTOMER" ? "active" : ""}
              onClick={() => setRole("CUSTOMER")}
            >
              CUSTOMER
            </button>
            <button
              type="button"
              className={role === "SELLER" ? "active" : ""}
              onClick={() => setRole("SELLER")}
            >
              SELLER
            </button>
          </div>

          <Grid container spacing={0.5} direction="column">
            <Grid>
              <TextField
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Password"
                name="password"
                type="password"
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
            </Grid>
            <Grid>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                required
                size="small"
                fullWidth
              />
            </Grid>

            {role === "SELLER" && (
              <>
                <Grid className="seller-fields">
                  <TextField
                    label="Store Name"
                    name="storeName"
                    onChange={handleChange}
                    required
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Business Type</InputLabel>
                    <Select
                      value={formData.businessType}
                      onChange={handleBusinessTypeChange}
                      label="Business Type"
                      required
                    >
                      <MenuItem value="Pharmacy / Drugstore">Pharmacy / Drugstore</MenuItem>
                      <MenuItem value="Hospital Pharmacy">Hospital Pharmacy</MenuItem>
                      <MenuItem value="Wholesale Distributor">Wholesale Distributor</MenuItem>
                      <MenuItem value="Manufacturer / Pharma Company">Manufacturer / Pharma Company</MenuItem>
                      <MenuItem value="Clinical Supplier / Medical Store">Clinical Supplier / Medical Store</MenuItem>
                      <MenuItem value="Veterinary Pharmacy">Veterinary Pharmacy</MenuItem>
                      <MenuItem value="Online Pharmacy">Online Pharmacy</MenuItem>
                      <MenuItem value="Herbal / Alternative Medicine Store">Herbal / Alternative Medicine Store</MenuItem>
                      <MenuItem value="Others">Others</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {formData.businessType === "Others" && (
                  <Grid>
                    <TextField
                      label="Please specify"
                      name="otherBusinessType"
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      required
                    />
                  </Grid>
                )}
              </>
            )}

            <Grid>
              <Button type="submit" variant="contained" fullWidth>
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>

      {/* ✅ BLUE PANEL */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>Log in to manage your store and serve your customers</p>
            <button onClick={() => setIsSignUpMode(false)}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Welcome to MedStore Online</h1>
            <p>Your trusted pharmacy marketplace — join us today</p>
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
