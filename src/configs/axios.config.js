import axios from "axios";

// Create axios instance with base URL
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to automatically add auth token to requests
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('hotel_auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401 and 403 errors
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Handle 401 Unauthorized (token expired, not authenticated)
            if (error.response.status === 401) {
                // Token expired, log out user
                localStorage.removeItem('hotel_auth_token');
                localStorage.removeItem('hotel_user_info');
                localStorage.removeItem('hotel_user_permissions');
                localStorage.removeItem('roles');
                localStorage.removeItem('username');
                
                // Redirect to login page
                if (window.location.pathname !== '/login') {
                    window.location = '/login?expired=true';
                }
            }
            
            // Handle 403 Forbidden (not authorized)
            if (error.response.status === 403) {
                // Check if already on forbidden page to prevent redirect loops
                if (window.location.pathname !== '/forbidden') {
                    window.location = '/forbidden';
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export { axiosInstance };