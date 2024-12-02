import axios from 'axios';

// Create two Axios instances for authenticated and public requests
const authAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,  // Can still be used if you want to send cookies for refresh requests
});

const publicAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
});

// Request interceptor to add the token to the Authorization header
authAxios.interceptors.request.use(
    (config) => {
        // Get the access token from sessionStorage
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            // If token exists, add it to Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
authAxios.interceptors.response.use(
    (response) => response, // If the response is valid, return it
    async (error) => {
        const originalRequest = error.config;

        // If status is 404 and it's the first retry attempt
        if (error.response.status === 404 && !originalRequest._retry) {
            originalRequest._retry = true;  // Mark this request as retried

            try {
                // Call the refresh token endpoint to get a new token
                const refreshResponse = await publicAxios.post(
                    '/auth/refresh-token', // Adjust to match your API's refresh token endpoint
                    {},
                    { withCredentials: true }  // This ensures cookies are sent for the refresh request
                );

                // Get the new access token from the response
                const newAccessToken = refreshResponse.data.token;

                // Store the new access token in sessionStorage
                sessionStorage.setItem('accessToken', newAccessToken);

                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axios(originalRequest); // Retry the original request
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
                // Redirect to login if refresh fails
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default { authAxios, publicAxios };
