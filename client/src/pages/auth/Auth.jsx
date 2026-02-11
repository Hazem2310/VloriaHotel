// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../Api/userApi";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import classes from "./auth.module.css";

// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     phone_number: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState("");
//   const navigate = useNavigate();

//   const validateForm = () => {
//     const newErrors = {};

//     // Validation common for both login and register
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (!isLogin && formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (!isLogin) {
//       if (!formData.first_name.trim()) {
//         newErrors.first_name = "First name is required";
//       }
//       if (!formData.last_name.trim()) {
//         newErrors.last_name = "Last name is required";
//       }
//       if (!formData.phone_number.trim()) {
//         newErrors.phone_number = "Phone number is required";
//       }
//       if (formData.password !== formData.confirmPassword) {
//         newErrors.confirmPassword = "Passwords do not match";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");

//     if (!validateForm()) return;

//     try {
//       if (!isLogin) {
//         // Registration
//         const { confirmPassword, ...userData } = formData;
//         const response = await api.signup(userData);
//         if (response.data.success) {
//           setApiError("Registration successful! Please log in.");
//           setIsLogin(true);
//           setFormData((prev) => ({
//             ...prev,
//             password: "",
//             confirmPassword: "",
//           }));
//         }
//       } else {
//         // Login
//         const response = await login({
//           email: formData.email,
//           password: formData.password,
//         });

//         if (response.data.token && response.data.user) {
//           localStorage.setItem("token", response.data.token);
//           localStorage.setItem("user", JSON.stringify(response.data.user));
//           window.location.href = "/profile";
//         } else {
//           setApiError("Login failed: Missing user data or token.");
//         }
//       }
//     } catch (error) {
//       console.error("Auth error:", error);
//       setApiError(
//         error.response?.data?.message ||
//           error.message ||
//           "An error occurred. Please try again."
//       );
//     }
//   };

//   const toggleMode = () => {
//     setIsLogin(!isLogin);
//     setErrors({});
//     setApiError("");
//   };

//   return (
//     <div className={classes.authContainer}>
//       <h2>{isLogin ? "Login" : "Register"}</h2>
//       {apiError && <div className={classes.error}>{apiError}</div>}

//       <form onSubmit={handleSubmit} className={classes.authForm}>
//         {!isLogin && (
//           <>
//             <div className={classes.formGroup}>
//               <label htmlFor="first_name">First Name</label>
//               <input
//                 type="text"
//                 id="first_name"
//                 name="first_name"
//                 value={formData.first_name}
//                 onChange={handleChange}
//                 className={errors.first_name ? classes.errorInput : ""}
//               />
//               {errors.first_name && (
//                 <span className={classes.errorText}>{errors.first_name}</span>
//               )}
//             </div>

//             <div className={classes.formGroup}>
//               <label htmlFor="last_name">Last Name</label>
//               <input
//                 type="text"
//                 id="last_name"
//                 name="last_name"
//                 value={formData.last_name}
//                 onChange={handleChange}
//                 className={errors.last_name ? classes.errorInput : ""}
//               />
//               {errors.last_name && (
//                 <span className={classes.errorText}>{errors.last_name}</span>
//               )}
//             </div>

//             <div className={classes.formGroup}>
//               <label htmlFor="phone_number">Phone Number</label>
//               <input
//                 type="tel"
//                 id="phone_number"
//                 name="phone_number"
//                 value={formData.phone_number}
//                 onChange={handleChange}
//                 className={errors.phone_number ? classes.errorInput : ""}
//               />
//               {errors.phone_number && (
//                 <span className={classes.errorText}>{errors.phone_number}</span>
//               )}
//             </div>
//           </>
//         )}

//         <div className={classes.formGroup}>
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className={errors.email ? classes.errorInput : ""}
//           />
//           {errors.email && (
//             <span className={classes.errorText}>{errors.email}</span>
//           )}
//         </div>

//         <div className={classes.formGroup}>
//           <label htmlFor="password">Password</label>
//           <div className={classes.passwordInputContainer}>
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className={`${errors.password ? classes.errorInput : ""} ${
//                 classes.passwordInput
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className={classes.togglePassword}
//             >
//               <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
//             </button>
//           </div>
//           {errors.password && (
//             <span className={classes.errorText}>{errors.password}</span>
//           )}
//         </div>

//         {!isLogin && (
//           <div className={classes.formGroup}>
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <div className={classes.passwordInputContainer}>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 className={`${
//                   errors.confirmPassword ? classes.errorInput : ""
//                 } ${classes.passwordInput}`}
//               />
//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowConfirmPassword(!showConfirmPassword)
//                 }
//                 className={classes.togglePassword}
//               >
//                 <FontAwesomeIcon
//                   icon={showConfirmPassword ? faEyeSlash : faEye}
//                 />
//               </button>
//             </div>
//             {errors.confirmPassword && (
//               <span className={classes.errorText}>
//                 {errors.confirmPassword}
//               </span>
//             )}
//           </div>
//         )}

//         <button type="submit" className={classes.submitButton}>
//           {isLogin ? "Login" : "Register"}
//         </button>
//       </form>

//       <p className={classes.toggleMode}>
//         {isLogin ? "Don't have an account? " : "Already have an account? "}
//         <button
//           type="button"
//           onClick={toggleMode}
//           className={classes.toggleButton}
//         >
//           {isLogin ? "Register" : "Login"}
//         </button>
//       </p>
//     </div>
//   );
// };

// export default Auth;




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

    try {
      await login(loginData.email, loginData.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
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

    try {
      await register(
        signupData.first_name,
        signupData.last_name,
        signupData.email,
        signupData.password,
        signupData.phone_number
      );
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
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
