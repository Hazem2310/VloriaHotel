// User API service
import { get, post, put, del } from './apiClient';

/**
 * User authentication and management API functions
 */
const userApi = {
  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Promise with user data and token
   */
  login: (credentials) => {
    return post('/users/login', credentials);
  },
/**
 * Request password reset (send OTP to email)
 * @param {string} email - User email
 * @returns {Promise} - Confirmation message
 */
forgotPassword: (email) => {
  return post('/users/forgot-password', { email });
},

/**
 * Reset password using OTP
 * @param {Object} data - { email, otp, newPassword }
 * @returns {Promise} - Confirmation message
 */
resetPassword: (data) => {
  return post('/users/reset-password', data);
},

/**
 * Verify OTP for password reset
 * @param {Object} data - { email, otp }
 * @returns {Promise} - Confirmation message
 */
verifyOtp: (data) => {
  return post('/users/verify-otp', data);
},

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with created user data
   */
  register: (userData) => {
    return post('/users', userData);
  },

  /**
   * Get current user profile
   * @returns {Promise} - Promise with user profile data
   */
  getProfile: () => {
    return get('/users/profile');
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise with updated user data
   */
  updateProfile: (userData) => {
    // מיפוי שמות: phoneNumber -> phone והסרת שדות שאינם קיימים אצלכם
    const payload = {
      firstName: userData.firstName,
      lastName:  userData.lastName,
      phone:     userData.phone ?? userData.phoneNumber ??"", // <-- أهم سطر
      email:     userData.email,
      address:   userData.address ?? "",
      };

    return put('/users/profile', payload);
  },

  /**
   * Get all users (admin only)
   * @returns {Promise} - Promise with list of users
   */
  getAllUsers: () => {
    return get('/users');
  },


  /**
   * 12
 * Update user role (admin only)
 * @param {number} userId - ID of the user
 * @param {string} role - New role ('admin' or 'customer')
 * @returns {Promise}
 */
updateUserRole: (userId, role) => {
  return put(`/users/${userId}/role`, { role });
},

/**
 * מחיקת המשתמש הנוכחי
 * @returns {Promise} - Promise עם הודעת הצלחה
 */
deleteUser: () => {
  // הוספת true כדי לציין שזו פעולה מאובטחת שדורשת טוקן
  return del('/users/profile', true);
},

};

export default userApi;
