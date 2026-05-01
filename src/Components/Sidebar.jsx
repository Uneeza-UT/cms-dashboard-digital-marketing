import { Rocket, Home, UserCircle2, UserCheck2, ClipboardList, Layers } from "lucide-react"
import { NavLink } from "react-router-dom"

export default function Sidebar() {
    return (
        <aside className="w-64 md:w-72 h-screen bg-white border-r border-brandMarketing-400 flex flex-col py-4 shadow-sm">
      
            {/* Logo */}
            <div className="hidden h-28 md:flex items-center justify-start px-6 md:px-8 gap-2 group">
                <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-brandMarketing-500 to-neon-400 text-white shadow-lg">
                    <Rocket className="w-5 h-5"/>
                </span>
                <h1 className="text-2xl font-bold group-hover:text-brandMarketing-700">
                    AgencyName
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-8 py-4 space-y-6 overflow-y-auto">

                {/* Dashboard */}
                <div>
                    <p className="text-sm md:text-base font-semibold text-brandMarketing-800 uppercase tracking-wide mb-2">
                        Core
                    </p>
                    <NavLink to={"/dashboard"} 
                        end
                        className={({isActive}) =>
                            `flex items-center gap-3 px-3 py-2.5 text-base md:text-lg font-medium rounded-lg hover:bg-brandMarketing-200
                            hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer
                            ${isActive ? 
                                "bg-brandMarketing-200 text-brandMarketing-600  border-l-4 border-brandMarketing-500" : ""}`
                        }
                    >   
                        <Home className="w-5 h-5" /> Dashboard
                    </NavLink>
                </div>

                {/* Management */}
                <div>
                    <p className="text-sm md:text-base font-semibold text-brandMarketing-800 uppercase tracking-wide mb-2">
                        Management
                    </p>

                    <div className="space-y-1">
                        <NavLink to={"/dashboard/useraccounts"}
                            className={({isActive}) =>
                                `flex items-center gap-3 px-3 py-2.5 text-base md:text-lg font-medium rounded-lg hover:bg-brandMarketing-200
                                hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer
                                ${isActive ? 
                                    "bg-brandMarketing-200 text-brandMarketing-600 border-l-4 border-brandMarketing-500" : ""}`
                            }
                        >   
                            <UserCircle2 className="w-5 h-5" /> Employees
                        </NavLink>

                        <NavLink to={"/dashboard/clients"} 
                            className={({isActive}) =>
                                `flex items-center gap-3 px-3 py-2.5 text-base md:text-lg font-medium rounded-lg hover:bg-brandMarketing-200
                                hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer
                                ${isActive ? 
                                    "bg-brandMarketing-200 text-brandMarketing-600 border-l-4 border-brandMarketing-500" : ""}`
                            }
                        >   
                            <UserCheck2 className="w-5 h-5" /> Clients
                        </NavLink>
                    </div>
                </div>

                {/* Operations */}
                <div>
                    <p className="text-sm md:text-base font-semibold text-brandMarketing-800 uppercase tracking-wide mb-2">
                        Operations
                    </p>

                    <div className="space-y-1">
                        <NavLink to={"/dashboard/consultations"} 
                            className={({isActive}) =>
                                `flex items-center gap-3 px-3 py-2.5 text-base md:text-lg font-medium rounded-lg hover:bg-brandMarketing-200
                                hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer
                                ${isActive ? 
                                    "bg-brandMarketing-200 text-brandMarketing-600 border-l-4 border-brandMarketing-500" : ""}`
                            }
                        >   
                            <ClipboardList className="w-5 h-5" /> Consultations
                        </NavLink>

                        <NavLink to={"/dashboard/services"} 
                            className={({isActive}) =>
                                `flex items-center gap-3 px-3 py-2.5 text-base md:text-lg font-medium rounded-lg hover:bg-brandMarketing-200
                                hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer
                                ${isActive ? 
                                    "bg-brandMarketing-200 text-brandMarketing-600 border-l-4 border-brandMarketing-500" : ""}`
                            }
                        >   
                            <Layers className="w-5 h-5" /> Services
                        </NavLink>                   
                    </div>
                </div>
            </nav>
        </aside>
    )
}