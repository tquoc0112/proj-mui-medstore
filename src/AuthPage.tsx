import { useState } from "react";
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
import Grid from "@mui/material/Grid"; // ✅ Stable Grid
import type { SelectChangeEvent } from "@mui/material/Select"; // ✅ Type chuẩn
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
    if (formData.password !== formData.confirmPassword) {
      showSnackbar("Passwords do not match!", "error");
      return;
    }
    showSnackbar("Registration successful!", "success");
    setIsSignUpMode(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    showSnackbar("Login successful!", "success");
  };

  return (
    <div className={`auth-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      {/* ✅ SIGN IN FORM */}
      <div className="form-container sign-in-container">
        <form className="form-box" onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <Grid container spacing={1.5} direction="column">
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
              <Button type="submit" variant="contained" fullWidth>
                Sign In
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>

      {/* ✅ SIGN UP FORM */}
      <div className="form-container sign-up-container">
        <form className="form-box" onSubmit={handleRegister}>
          <h1>Create Account</h1>

          {/* ✅ ROLE TOGGLE */}
          <div className="role-toggle">
            <div
              className="slider"
              style={{
                left: role === "CUSTOMER" ? "3px" : "calc(50% + 3px)",
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

          <Grid container spacing={1.5} direction="column">
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
                      <MenuItem value="Pharmacy / Drugstore">
                        Pharmacy / Drugstore
                      </MenuItem>
                      <MenuItem value="Hospital Pharmacy">
                        Hospital Pharmacy
                      </MenuItem>
                      <MenuItem value="Wholesale Distributor">
                        Wholesale Distributor
                      </MenuItem>
                      <MenuItem value="Manufacturer / Pharma Company">
                        Manufacturer / Pharma Company
                      </MenuItem>
                      <MenuItem value="Clinical Supplier / Medical Store">
                        Clinical Supplier / Medical Store
                      </MenuItem>
                      <MenuItem value="Veterinary Pharmacy">
                        Veterinary Pharmacy
                      </MenuItem>
                      <MenuItem value="Online Pharmacy">
                        Online Pharmacy
                      </MenuItem>
                      <MenuItem value="Herbal / Alternative Medicine Store">
                        Herbal / Alternative Medicine Store
                      </MenuItem>
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
