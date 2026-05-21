import { Bell, UserCog2, LogOut, ChevronDown, Menu, X, Rocket } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import Avatar from "../assets/images/Avatar.png"
import { toast } from 'react-toastify';

export default function Topbar({mobileMenuOpen, setMobileMenuOpen}) {

    const [toggle, setToggle] = useState(false);
    const [user, setUser] = useState([]);
    const location = useLocation();

    const titles = {
        "/dashboard": "Dashboard",
        "/dashboard/useraccounts": "Employees",
        "/dashboard/clients" : "Clients",
        "/dashboard/consultations": "Consultations",
        "/dashboard/services": "Services",
        "/dashboard/profile" : "Profile",
    };

    const title = titles[location.pathname] || "";

    const fetchUser= async () => {
        const response = await api.get("/user/profile")
        const data = await response.data
        setUser(data)
    }

    useEffect(() => {

        fetchUser();

    },[user])

    useEffect(() => {
        if (user?.id) {
            updateLastLogin();
        }
    }, [user]);


    const updateLastLogin = async () => {

        try {
            await api.patch("/user/last-login", 
                {
                    Id: user.id,
                    LastLogin: new Date()
                }
            )         
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update last login");
            } 
            else if (error.request) 
            {
                toast.error("Error:", error?.response);
            } 
            else {
                // Something else went wrong
                toast.error("Error: " + error.message);
            }
        }
    }

    return(
        <header className="h-20 sticky top-0 left-0 md:left-72 right-0 z-40 bg-white border-b border-brandMarketing-400 flex items-center justify-between px-7 md:px-14 py-6 shadow-sm">

            <div className="flex items-center gap-2 md:gap-6">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} aria-controls="mobileMenu" className="md:hidden rounded-lg hover:bg-brandMarketing-500 transition-colors" aria-label="Toggle menu">
                    {!mobileMenuOpen && <Menu className="w-5 h-5" />}
                    {mobileMenuOpen && <X className="w-5 h-5 text-brandMarketing-500"/>}
                </button>

                <div className="flex items-center justify-start md:hidden px-4 gap-2 group">
                    <span className="relative grid place-items-center w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-brandMarketing-500 to-neon-400 text-white shadow-lg">
                        <Rocket className="w-3 h-3 sm:w-4 sm:h-4"/>
                    </span>
                    <h1 className="text-lg sm:text-xl font-bold group-hover:text-brandMarketing-700">
                        AgencyName
                    </h1>
                </div>

                <h1 className="hidden md:block text-xl md:text-2xl font-semibold">
                    {title}
                </h1>
            </div>         

            {/* Right */}
            <div className="flex items-center gap-3 md:gap-6 ml-auto">

                {/* Notifications */}
                <button className="relative md:p-4 md:rounded-full md:hover:bg-brandMarketing-200 md:hover:text-brandMarketing-600 md:transition">
                    <Bell className="w-5 h-5 md:w-7 md:h-7" />
                </button>

                {/* Avatar */}
                <div className="relative group">
                    <div className="flex items-center gap-2 md:gap-4">
                        <img 
                            onClick={() => setToggle(!toggle)} 
                            src={
                                user.profileImageUrl
                                    ? `${import.meta.env.VITE_API_URL_Base}${user.profileImageUrl}`
                                    : Avatar
                            } 
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-brandMarketing-400 cursor-pointer" />
                        <div className="hidden md:flex items-center gap-2" onClick={() => setToggle(!toggle)} >
                            <p className="font-medium cursor-pointer" > {user.name} </p> 
                            <ChevronDown className="w-5 h-5 cursor-pointer"/>
                        </div>                    
                    </div>

                    {/* Dropdown */}
                    {toggle && 
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-brandMarketing-200 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition">
                            <ul className="text-base">
                                <li>
                                    <NavLink to={"/dashboard/profile"} 
                                        className={({isActive}) =>
                                            `flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg hover:bg-brandMarketing-200
                                            hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer
                                            ${isActive ? 
                                                "text-brandMarketing-600 hover:bg-brandMarketing-200" : ""}`
                                        }
                                    >   
                                        <UserCog2 className="w-5 h-5" /> Profile
                                    </NavLink>                           
                                </li>

                                <li className="text-red-500">
                                    <NavLink to={"/login"} 
                                        className={({isActive}) =>
                                            `flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg hover:bg-brandMarketing-200
                                            hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer
                                            ${isActive ? 
                                                "text-brandMarketing-600 hover:bg-brandMarketing-200" : ""}`
                                        }
                                    >   
                                        <LogOut className="w-5 h-5" /> LogOut
                                    </NavLink> 
                                </li>
                            </ul>
                        </div>
                    }
                    
                </div>

            </div>
        </header>
    )
}