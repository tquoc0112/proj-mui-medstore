import React, { useState } from "react";
import "./Auth.css";

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

    // Seller-specific
    storeName: "",
    businessType: "",
    pharmacyLicense: "",
    licenseDocUrl: "",
    taxId: "",
    storeLogoUrl: "",
    businessAddress: "",
    ownerIdProofUrl: "",
    proofOfAddressUrl: "",
    medicalCertUrl: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ REGISTER
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      alert(data.message);
      setIsSignUpMode(false); // Quay lại chế độ Sign In sau khi đăng ký thành công
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ✅ LOGIN
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

      alert("Login successful");
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // ✅ Chuyển hướng sau login (tùy role)
      if (data.role === "SALES") {
        alert("Welcome Seller!");
        // window.location.href = "/dashboard-seller"; // Bạn có thể thay bằng route thực tế
      } else {
        alert("Welcome Customer!");
        // window.location.href = "/home"; // Route dành cho Customer
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className={`auth-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      {/* ✅ SIGN IN FORM */}
      <div className="form-container sign-in-container">
        <form className="form-box" onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <button type="submit">Sign In</button>
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
              }}
            >
              SELLER
            </button>
          </div>

          {/* ✅ Common Fields */}
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            name="phone"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Address"
            name="address"
            onChange={handleChange}
            required
          />

          {/* ✅ Seller-Specific Fields */}
          {role === "SALES" && (
            <>
              <input
                type="text"
                placeholder="Store Name"
                name="storeName"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Business Type"
                name="businessType"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Pharmacy License"
                name="pharmacyLicense"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Tax ID"
                name="taxId"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Business Address"
                name="businessAddress"
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            required
          />
          <button type="submit">Sign Up</button>
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
    </div>
  );
}
