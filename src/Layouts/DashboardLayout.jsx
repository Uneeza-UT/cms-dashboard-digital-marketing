import Sidebar from "../Components/Sidebar"
import Topbar from "../Components/Topbar"
import { Outlet } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function DashboardLayout() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return(
        <div className="flex flex-col md:flex-row">
            <div className="hidden md:block md:fixed z-50 top-0 left-0 w-64 md:w-72">
                <Sidebar />
            </div>

            <AnimatePresence>
                {mobileMenuOpen && 
                     <>
                        <motion.div
                            className="fixed z-50 top-20 left-0 h-[calc(100%-4rem)] w-64 bg-white shadow-lg"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration:0.4, ease:"easeOut" }}
                        >
                            <Sidebar />
                        </motion.div>
                    </>
                }
            </AnimatePresence>

            <div className="flex flex-col flex-1 md:ml-72">
                <Topbar
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen} 
                />
                
                <main className="flex-1 p-4 md:p-6 overflow-y-auto mt-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}