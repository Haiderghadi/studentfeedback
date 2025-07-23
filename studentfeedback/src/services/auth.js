import axios from "axios";
import config from "../config";

const API_URL = config.API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const login = async (username, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      role,
    });
    const { user, token } = response.data;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    return { user, token };
  } catch (error) {
    console.error(
      "Login failed:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || "Login failed.";
  }
};

const getMe = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch current user:",
      error.response?.data?.message || error.message
    );
    throw error.response?.data?.message || "Failed to fetch user info.";
  }
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export default {
  login,
  logout,
  getMe,
};
