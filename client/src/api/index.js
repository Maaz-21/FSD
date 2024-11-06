import axios from "axios";

const API = axios.create({
  baseURL: "https://fooddelivery-mern.onrender.com/api/",   // base URL of the server
});

// Utility function for error handling
const handleError = (error) => {
  console.error("API call failed:", error);
  throw error.response?.data || "An error occurred, please try again.";
};

// Auth
export const UserSignUp = async (data) => {
  try {
    return await API.post("/user/signup", data);  // API call to the server
  } catch (error) {
    handleError(error);
  }
};

export const UserSignIn = async (data) => {
  try {
    return await API.post("/user/signin", data);
  } catch (error) {
    handleError(error);
  }
};

// Products
export const getAllProducts = async (filter = "") => {
  try {
    return await API.get(`/food?${filter}`);
  } catch (error) {
    handleError(error);
  }
};

export const getProductDetails = async (id) => {
  try {
    return await API.get(`/food/${id}`);
  } catch (error) {
    handleError(error);
  }
};

// Cart
export const getCart = async (token) => {
  try {
    return await API.get(`/user/cart`, {
      headers: { Authorization: `Bearer ${token}` },    // Authorization header with token is sent to the server
    });
  } catch (error) {
    handleError(error);
  }
};

export const addToCart = async (token, data) => {
  try {
    return await API.post(`/user/cart/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error);
  }
};

export const deleteFromCart = async (token, data) => {
  try {
    return await API.patch(`/user/cart/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error);
  }
};

// Favorites
export const getFavourite = async (token) => {
  try {
    return await API.get(`/user/favorite`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error);
  }
};

export const addToFavourite = async (token, data) => {
  try {
    return await API.post(`/user/favorite/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error);
  }
};

export const deleteFromFavourite = async (token, data) => {
  try {
    return await API.patch(`/user/favorite/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error);
  }
};

// Orders
export const placeOrder = async (token, data) => {
  try {
    return await API.post(`/user/order/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error);
  }
};

export const getOrders = async (token) => {
  try {
    return await API.get(`/user/order/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    handleError(error);
  }
};
