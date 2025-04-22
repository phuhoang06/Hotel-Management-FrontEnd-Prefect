import { useEffect } from 'react';
import './App.css'
import Routers from "./router/index.jsx";
import authService from './service/auth.service';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    useEffect(() => {
        // Initialize authentication state from localStorage
        authService.initAuth();
    }, []);

    return (
        <>
            <Routers/>
            <ToastContainer position="top-right" autoClose={5000} />
        </>
    )
}

export default App
