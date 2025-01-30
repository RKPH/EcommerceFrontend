import axios from "axios";

import { toast } from "react-toastify"; // Import toast for notifications




// Create two Axios instances for authenticated and public requests
const authAxios = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // Include cookies with requests
});

const publicAxios = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // Include cookies with requests
});

// Response interceptor to handle session expiration and retry logic
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
      // Handle 401 and 500 errors
      // if ([401, 500].includes(error.response?.status)) {
      //     // Dispatch logout and show toast
      //
      //     toast.error("Session expired, please log in again.");
      //     window.location.href = "/login"; // Redirect to the login page
      //     return Promise.reject(error);
      // }
    // Check if the error is due to session expiration
    if (error.response?.status === 404 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the session
        await publicAxios.post("/auth/refresh-token");

        // Retry the original request after session refresh
        return authAxios(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing session:", refreshError);
        window.location.href = "/login"; // Redirect to login if session refresh fails
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default { authAxios, publicAxios };
