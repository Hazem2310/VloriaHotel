import api from "./api";

// LOGIN
export const loginUser = (data) => {
  return api.post("/users/login", data);
};

// SIGNUP
export const registerUser = (data) => {
  return api.post("/users/register", data);
};
