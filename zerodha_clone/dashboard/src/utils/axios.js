import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3002',  // Updated to match backend port
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add the JWT token to headers
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Only redirect to login if it's a 401 and we're not already on the login page
            if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
                // Check if token exists before redirecting
                const token = localStorage.getItem('token');
                if (token) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    window.location.replace('http://localhost:3000/login');
                }
            }
        } else if (error.request) {
            // Network error - don't redirect, just reject
            console.error('Network error:', error.request);
        }
        return Promise.reject(error);
    }
);

export default instance; 