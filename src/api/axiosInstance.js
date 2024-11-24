import axios from 'axios';

// Set up Axios default configuration
axios.defaults.baseURL = 'http://localhost:3000/api/v1'; // Set base API URL
axios.defaults.withCredentials = true; // Allow cookies

// Add a request interceptor to include the token in headers
axios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        console.log('Token:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach token to Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error); // Handle request errors
    }
);

export default axios;
