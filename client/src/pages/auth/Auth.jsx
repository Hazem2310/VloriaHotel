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
import { loginUser, registerUser } from "../../Api/userApi";
import classes from "./auth.module.css";

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        console.log("LOGIN SUCCESS:", res.data);
        navigate("/"); // أو dashboard
      } else {
        const res = await registerUser(formData);
        console.log("REGISTER SUCCESS:", res.data);
        setIsLogin(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong, try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.authContainer}>
      <form className={classes.authForm} onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {!isLogin && (
          <>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {error && <p className={classes.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className={classes.switch}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Sign up" : " Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
