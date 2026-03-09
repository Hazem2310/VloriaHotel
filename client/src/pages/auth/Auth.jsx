import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import classes from "./auth.module.css";

const Auth = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(loginData.email, loginData.password);

   if (result?.success) {
  const role = result?.user?.role; // مثلاً: "admin" / "owner" / "customer"
  const roles = result?.user?.roles || []; // array اختياري

  const isAdminLike =
    role === "admin" ||
    role === "owner" ||
    roles.includes("admin") ||
    roles.includes("owner");

  if (isAdminLike) {
    navigate("/admin/dashboard"); // ✅ صفحة الأدمن
  } else {
    navigate("/"); // ✅ العميل العادي
  }

}


    setLoading(false);
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const result = await register(
      signupData.first_name,
      signupData.last_name,
      signupData.email,
      signupData.password,
      signupData.phone_number
    );

    if (result?.success) {
      setSuccess("Account created successfully! Please login.");
      setSignupData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone_number: "",
      });

      setTimeout(() => {
        setActiveTab("login");
        setSuccess("");
      }, 2000);
    } else {
      setError(result?.message || "Registration failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className={classes.authPage}>
      <div className={classes.authContainer}>
        <div className={classes.authCard}>
          {/* Header */}
          <div className={classes.authHeader}>
            <div className={classes.brandMark}>V</div>
            <h1>Veloria Hotel</h1>
            <p>Welcome to luxury and comfort</p>
          </div>

          {/* Tabs */}
          <div className={classes.tabs}>
            <button
              className={`${classes.tab} ${activeTab === "login" ? classes.activeTab : ""}`}
              onClick={() => {
                setActiveTab("login");
                setError("");
                setSuccess("");
              }}
            >
              Login
            </button>
            <button
              className={`${classes.tab} ${activeTab === "signup" ? classes.activeTab : ""}`}
              onClick={() => {
                setActiveTab("signup");
                setError("");
                setSuccess("");
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form className={classes.authForm} onSubmit={handleLoginSubmit}>
              <div className={classes.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className={classes.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              {error && <div className={classes.errorMessage}>{error}</div>}

              <button type="submit" className={classes.submitBtn} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className={classes.forgotPassword}>
                <a href="#forgot">Forgot password?</a>
              </div>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form className={classes.authForm} onSubmit={handleSignupSubmit}>
              <div className={classes.formRow}>
                <div className={classes.formGroup}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First name"
                    value={signupData.first_name}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className={classes.formGroup}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last name"
                    value={signupData.last_name}
                    onChange={handleSignupChange}
                    required
                  />
                </div>
              </div>

              <div className={classes.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className={classes.formGroup}>
                <label>Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Enter your phone number"
                  value={signupData.phone_number}
                  onChange={handleSignupChange}
                />
              </div>

              <div className={classes.formGroup}>
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password (min 6 characters)"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              <div className={classes.formGroup}>
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  required
                />
              </div>

              {error && <div className={classes.errorMessage}>{error}</div>}
              {success && <div className={classes.successMessage}>{success}</div>}

              <button type="submit" className={classes.submitBtn} disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
