import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import authService from './service/auth.service';

// Khởi tạo xác thực từ localStorage (nếu có)
authService.initAuth();

// Nếu đã đăng nhập, tải quyền từ server
if (authService.isAuthenticated()) {
    authService.fetchUserPermissions()
        .then(() => console.log('Permissions loaded successfully'))
        .catch(err => console.error('Error loading permissions:', err));
}

createRoot(document.getElementById('root')).render(
        <BrowserRouter>
            <App />
            <ToastContainer position="top-right" autoClose={3000} />
        </BrowserRouter>
)
