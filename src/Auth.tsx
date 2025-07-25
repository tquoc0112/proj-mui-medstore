import React, { useState } from "react";
import "./Auth.css";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className={`container ${isSignUp ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* ===== Sign In Form ===== */}
          <form action="#" className="sign-in-form">
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <input type="text" placeholder="Email" />
            </div>
            <div className="input-field">
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" value="Login" className="btn solid" />
          </form>

          {/* ===== Sign Up Form ===== */}
          <form action="#" className="sign-up-form">
            <h2 className="title">Create Account</h2>
            <div className="input-field">
              <input type="text" placeholder="Full Name" />
            </div>
            <div className="input-field">
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-field">
              <input type="password" placeholder="Password" />
            </div>
            <input type="submit" value="Sign Up" className="btn" />
          </form>
        </div>
      </div>

      {/* ===== Panels for Animation ===== */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Register with your details to access all features!</p>
            <button
              className="btn transparent"
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Login with your account to continue!</p>
            <button
              className="btn transparent"
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
