import axios from 'axios';

const authAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
});

const publicAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
});

// Request interceptor to add the token
authAxios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
authAxios.interceptors.response.use(
    (response) => response, // If the response is valid, return it
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            // Access token is expired, try to refresh
            originalRequest._retry = true;
            const refreshToken = sessionStorage.getItem('refreshToken');
            try {
                // Call the refresh endpoint to get a new token
                const response = await axios.post(
                    'http://localhost:3000/api/v1/auth/refresh',
                    { refreshToken },
                    { withCredentials: true }
                );
                const newToken = response.data.token;
                sessionStorage.setItem('accessToken', newToken);
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(originalRequest); // Retry the original request with the new token
            } catch (refreshError) {
                // If refresh fails, redirect to login
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('refreshToken');
                window.location.href = '/login'; // or your login route
            }
        }
        return Promise.reject(error);
    }
);

export default { authAxios, publicAxios };
