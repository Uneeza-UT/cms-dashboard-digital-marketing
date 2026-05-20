import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { isTokenExpired } from "./authService" 
import UserAccounts from "./Pages/UserAccounts"
import Consultations from "./Pages/Consultations"
import Services from "./Pages/Services"
import Dashboard from "./Pages/Dashboard"
import DashboardLayout from "./Layouts/DashboardLayout"
import Clients from "./Pages/Clients"
import Profile from "./Pages/Profile"
import Login from "./Pages/Login"
import ChangePassword from "./Pages/ChangePassword"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiryTime = payload.exp * 1000;
            const currentTime = Date.now();

            if (expiryTime <= currentTime) {
                localStorage.removeItem("token");
                navigate("/login");
            }

            else {
                const timeout = expiryTime - currentTime;

                setTimeout(() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                }, timeout);
            }

        }

        checkToken();

    }, [navigate])

    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem("token");

        if (!token || isTokenExpired(token)) {
            return <Navigate to="/login" />;
        }

        return children;
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={60000}   
                closeOnClick={true} // allow click to close
                draggable={false}
            />

            <Routes>   
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />  
                <Route path="/change-password" element={<ChangePassword />} />                   
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Dashboard />} />
                    <Route path="useraccounts" element={<UserAccounts />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="consultations" element={<Consultations />} />
                    <Route path="services" element={<Services />} />
                    <Route path="profile" element={<Profile />} />               
                </Route>
            </Routes>
        </>    
    )
}