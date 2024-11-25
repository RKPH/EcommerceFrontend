import axios from 'axios';

const authAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
});

const publicAxios = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
});

authAxios.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        console.log('Token:', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Now export as default if you want a default export
export default { authAxios, publicAxios };
