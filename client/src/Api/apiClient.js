const API_BASE_URL = "http://localhost:5000/api";

// קרא JSON בבטחה גם אם התגובה ריקה
const safeParse = async (res) => {
  const text = await res.text();
  if (!text) return {};           // תגובה ריקה
  try { return JSON.parse(text); }
  catch { return { raw: text }; }
};

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  const base = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  return token ? { ...base, Authorization: `Bearer ${token}` } : base;
};

// החלט אם לאפשר יציאה אוטומטית עבור בקשה זו
const shouldAutoLogout = (method, endpoint) => {
  // אנו מאפשרים יציאה אוטומטית רק בקריאות בסיסיות (GET),
  // במיוחד ב-/users/profile, כדי לחזור לכניסה רק כשהסשן מסתיים.
  return method === "GET" && endpoint.startsWith("/users/profile");
};

const handleResponse = async (response, method, endpoint) => {
  const data = await safeParse(response);

  if (!response.ok) {
    const msg = data?.message || data?.error || response.statusText || `HTTP ${response.status}`;

    // ✨ כאן אנו מוסיפים פרטים לאובייקט השגיאה
    const error = new Error(msg);
    error.response = {
      status: response.status,
      data,
    };
    throw error;
  }

  return data;
};


export const get = async (endpoint) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return handleResponse(res, "GET", endpoint);
  } catch (err) {
    console.error(`GET ${endpoint} failed:`, err);
    throw err;
  }
};

export const post = async (endpoint, body) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(body ?? {}),
      credentials: "include",
    });
    return handleResponse(res, "POST", endpoint);
  } catch (err) {
    console.error(`POST ${endpoint} failed:`, err);
    throw err;
  }
};

export const put = async (endpoint, body) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body ?? {}),
      credentials: "include",
    });
    return handleResponse(res, "PUT", endpoint);
  } catch (err) {
    console.error(`PUT ${endpoint} failed:`, err);
    throw err;
  }
};

export const del = async (endpoint, withAuth = false) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: withAuth ? getAuthHeaders() : {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });
    return handleResponse(res, "DELETE", endpoint);
  } catch (err) {
    console.error(`DELETE ${endpoint} failed:`, err);
    throw err;
  }
};
