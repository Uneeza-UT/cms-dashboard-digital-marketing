import StatsCard from "../Components/Dashboard/StatsCard";
import { useState, useEffect } from "react"
import { Link } from "lucide-react";
import api from "../api/axiosConfig";
import Table from "../Components/Table";
import { Plus, View } from "lucide-react";

export default function Dashboard() {

    const [stats, setStats] = useState([]);
    const [consultations, setConsultations] = useState([])

    const statCards = [
        { title: "Total Consultations", key: "totalConsultations" },
        { title: "New Clients", key: "newClients" },
        { title: "Active Services", key: "activeServices" },
        { title: "Total Employees", key: "employeeCount" }
    ];

    const quickActions = [
        {title: "View Consultations", link: "/dashboard/consultations"},
        {title: "Add Client", link: "/dashboard/clients"},
        {title: "Add Service", link: "/dashboard/services"},
        {title: "Add Employee", link: "/dashboard/useraccounts"}
    ]

    const columns = [
        { header: "#", accessor: "srNumber" },
        { header: "Name", accessor: "name" },
        { header: "Email Address", accessor: "email" },
        { header: "Budget", accessor: "budget" },
        { header: "Services", accessor: "services" },
        { header: "Status", accessor: "status" },
    ]

    const fetchStats= async () => {
        const response = await api.get("/dashboard/stats")
        const data = await response.data
        setStats(data)
    }

    const fetchConsultations= async () => {
        const response = await api.get("/dashboard/consultations")
        const data = await response.data
        setConsultations(data)     
    }

    useEffect(() => {

        fetchStats();
        fetchConsultations();

    },[])

    const normalizedData = consultations.map((row, index) => ({
        
        srNumber: index + 1,
        name: row.name,
        email: row.email,
        budget: row.budget,
        services: row.services.map((item) => item.name + ", "),
        status: row.status,     
    }))

    return (
        <div className="container mx-auto px-6 mt-10 mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
                
                {stats && statCards.map((item, index) => (
                    <StatsCard 
                        key={index}
                        title={item.title}
                        number={stats ? stats[item.key] : 0}
                    />
                ))}

            </div>

            <div className="mb-20">
                <h2 className="text-3xl font-semibold mb-7 p-4"> 
                    Recent Consultations 
                    <span className="text-base text-gray-500 ml-2">(Last 7 days)</span>
                </h2>

                {normalizedData && normalizedData.length > 0 ? 
                    <Table
                        title={""}
                        columns={columns}
                        data={normalizedData} 
                    /> 
                    : <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                        <p className="text-gray-500 text-xl font-medium mb-3">
                            No consultations in the last 7 days.
                        </p>
                         <p className="text-sm text-gray-500">
                            New consultations will appear here once added.
                        </p>
                    </div>
                }
            </div>

            <div>
                <h2 className="text-3xl font-semibold mb-8 p-4"> Quick Actions </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
                    {quickActions.map ((item, index) => (
                        <a 
                            href={item.link}
                            key={index}
                            className="w-full sm:w-auto h-14 md:h-20 lg:h-16 flex flex-col items-center justify-center text-center lg:gap-2 
                            px-4 py-3 md:px-6 md:py-4 text-base md:text-lg bg-brandMarketing-500 text-white rounded-xl 
                            font-medium hover:bg-brandMarketing-600 shadow-sm transition hover:scale-105 
                            duration-300 sm:hover:bg-brandMarketing-500"
                        >
                            <span className="leading-snug">
                                {item.title}
                            </span>                                     
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}