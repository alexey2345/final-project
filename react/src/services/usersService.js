import httpService, { setDefaultCommonHeaders } from "./httpService";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

refreshToken();

function refreshToken() {
  setDefaultCommonHeaders("x-auth-token", getJWT());
}

function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  refreshToken();
}

function getJWT() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function login(credentials) {
  try {
    const response = await httpService.post("/auth", credentials); // Ensure the correct endpoint is used
    const token = response.data.token; // Assuming the token is returned in the response
    setToken(token);

    const decodedToken = jwtDecode(token); // Decode the token
    const userId = decodedToken._id; // Assuming user ID is stored in the _id field of the token
    localStorage.setItem("userId", userId); // Store the user ID in localStorage

    return response.data.token;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
}

export function getUser() {
  try {
    const token = getJWT();
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function logout() {
  setToken(null);
}

export function getMe() {
  return httpService.get("/users");
}
export function createUser(user) {
  return httpService.post("/users", user);
}

const usersService = {
  login,
  getUser,
  logout,
  getMe,
  createUser,
};

export default usersService;
