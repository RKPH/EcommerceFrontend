import axios from "axios";
import { toast } from "react-toastify";

// Base URL for API requests
const BASE_URL = "http://103.155.161.94:3000/api/v1";

// Function to get the token from localStorage
const getToken = () => localStorage.getItem("token");
const getReToken = () => localStorage.getItem("refreshToken");

// Create an Axios instance for authenticated requests
const authAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Create an Axios instance for public requests
const publicAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Create an Axios instance for normal requests (without credentials)
const normalAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
});

const refreshTokenAxios = axios.create({
    baseURL: BASE_URL,  // Ensure BASE_URL is defined
    withCredentials: true // Include cookies with requests
});

// **Attach token to headers for all authenticated requests**
authAxios.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


refreshTokenAxios.interceptors.request.use(
    (config) => {
        const refreshToken = getReToken(); // Ensure this function returns a valid token
        if (refreshToken) {
            config.headers["Authorization"] = `Bearer ${refreshToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// **Handle session expiration and retry logic**
authAxios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If request fails with 401 Unauthorized or 500 Server Error, log out
        if ([401, 500].includes(error.response?.status)) {
            toast.error("Session expired, please log in again.");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login"; // Redirect to login page
            return Promise.reject(error);
        }

        // If request fails with 404, attempt to refresh the token
        if (error.response?.status === 404 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Send request to refresh the token
                const response = await refreshTokenAxios.post("/auth/refresh-token");
                const newToken = response.data.token;
                localStorage.setItem("token", newToken);

                // Update Authorization header and retry request
                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return authAxios(originalRequest);
            } catch (refreshError) {
                console.error("Error refreshing session:", refreshError);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login"; // Redirect to login if refresh fails
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default { authAxios, publicAxios, normalAxios };
