import Table from "../Components/Table";
import Filter from "../Components/Filter";
import { useState, useEffect, useRef } from "react";
import { Edit, MoreVertical, Delete, Plus } from "lucide-react";
import { toast } from 'react-toastify';
import DeleteModal from "../Components/ui/DeleteModal";
import UserAddEditModal from "../Components/ui/UserAddEditModal";
import api from "../api/axiosConfig";
import { employeesFilterConfig } from "../data/employeesFilterConfig";


export default function UserAccounts() {
    const [filters, setFilters] = useState({
        search: "",
        isActive: ""
    });
    const { searchableFields } = employeesFilterConfig;
    const [users, setUsers] = useState([])
    const [modalData, setModalData] = useState(null)
    const [rowNumber, setRowNumber] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [idForDelete, setIdForDelete] = useState(0);
    const [isCreateFrom, setIsCreateForm] = useState(true)
    const [dropdownPos, setDropdownPos] = useState(null);
    const dropdownRef = useRef(null);

    const columns = [
        { header: "#", accessor: "srNumber" },
        { header: "Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
        { header: "Last Login", accessor: "lastLogin" },
        { header: "Status", accessor: "status" },
        { header: "Actions", accessor: "actions" },
    ]

    const fetchUsers= async () => {
        const response = await api.get("/user")
        const data = await response.data
        setUsers(data)
    }

    useEffect(() => {

        fetchUsers();

    },[])


    const handleOpenMenu = (e, rowId) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const dropdownHeight = 120; // adjust based on your menu
        const dropdownWidth = 176;


        setRowNumber(prev => (prev === rowId ? null : rowId));

         setTimeout(() => {
            const el = dropdownRef.current;

            const height = el?.offsetHeight || dropdownHeight;

            const spaceBelow = window.innerHeight - rect.bottom;

            let top;

            if (spaceBelow < height) 
            {
                top = rect.top - height;
            } 
            else 
            {
                top = rect.bottom;
            }

            let left = rect.right - dropdownWidth;

            setDropdownPos({ top, left });
        }, 0);

    };

    useEffect(() => {
        const handleScroll = () => {
            setRowNumber(null);
        };

        window.addEventListener("scroll", handleScroll, true);

        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);


    useEffect(() => { 
        const handleClick = () => { 
            
            setRowNumber(null); // close dropdown 
 
        }; 
        
        document.addEventListener("click", handleClick); 
        
        return () => { document.removeEventListener("click", handleClick); }; 
    },[])

    const handleStatusChange = async (id, isActive) => {
       
        try {
            await api.patch(
                `/user/${id}`,
                {
                    Id: id,
                    IsActive: isActive
                }
            )
            await fetchUsers();  
            toast.success('Status updated successfully');
        }
         
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update status");
            } 
            else if (error.request) 
            {
                toast.error("RESPONSE:", error?.response);
            } 
            else {
                // Something else went wrong
                toast.error("Error: " + error.message);
            }
        }
    }

     const handleChange = async (data) => {
    
        try {
            await api.put(`/user`, data)
            await fetchUsers();  
            toast.success('Employee updated successfully');
            setSubmissionSuccess(true);
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update employee");
            } 
            else if (error.request) 
            {
                toast.error("RESPONSE:", error?.response);
            } 
            else {
                // Something else went wrong
                toast.error("Error: " + error.message);
            }
        }
    }

    const filteredData = users.filter((row) => {

        const searchMatch =
            !filters.search ||
            searchableFields.some((key) =>
                row[key]
                ?.toString()
                .toLowerCase()
                .includes(filters.search.toLowerCase())
        );


        const filterMatch = Object.keys(filters).every((key) => {
            
            if (key === "search") return true;      

            if (filters[key] == null || filters[key] === "")
                return true;

            
            return row[key]?.toString() === filters[key]?.toString();
        })

        return searchMatch && filterMatch;
    })
   { console.log(filteredData)}
    const normalizedData = filteredData.map((row, index) => ({
       
        srNumber: index + 1,
        name: row.name,
        email: row.email,
        role: row.role,
        lastLogin: row.lastLogin === "0001-01-01T00:00:00" ? "Haven't logged in": new Date(row.lastLogin).toLocaleString(),
        status: (
            <select
                key={index}
                value={row.isActive}
                onChange={(e) => handleStatusChange(row.id,e.target.value === "true")}
                className="border rounded-xl px-2 py-2"
            >
                <option value="true"> Active </option>
                <option value="false"> InActive </option>            
            </select>
        ),
        actions: (
             <div className="relative" key={index} onClick={(e) => e.stopPropagation()} >
                <a             
                    onClick={(e) => {
                        e.stopPropagation()
                        handleOpenMenu(e, row.id);
                    }} 
                    className=" hover:text-brandMarketing-600 cursor-pointer">
                    <MoreVertical className="w-5 h-5" />                
                </a> 

                {rowNumber === row.id && dropdownPos && 
                    <div 
                        ref={dropdownRef}
                        className="fixed right-5 mt-2 w-52 bg-white border border-brandMarketing-200 rounded-lg shadow-md z-10"
                        style={{
                            top: dropdownPos.top,
                            left: dropdownPos.left
                        }}
                    >
                        <ul className="text-base">
                            <li>
                                <a  onClick={() => {
                                    fetchDataforModal(row.id)
                                    setRowNumber(null)
                                }}
                                    className={`flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg hover:bg-brandMarketing-200
                                        hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer`}
                                >   
                                    <Edit className="w-5 h-5" /> Edit
                                </a>                           
                            </li>

                            <li>
                                <a 
                                    onClick={() => {
                                        setOpenDeleteModal(true);
                                        setIdForDelete(row.id)
                                        setRowNumber(null)
                                    }}
                                    className={`flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg hover:bg-brandMarketing-200
                                        hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer`}
                                >  
                                    <Delete className="w-5 h-5" /> Delete
                                </a>                          
                            </li>
                        </ul>
                    </div>
                }
            </div>
        )
    }))

    const fetchDataforModal= async (id) => {
        setModalData(null)
        setIsOpen(true)
        setIsCreateForm(false)

        try {
            const response = await api.get(`/user/${id}`)
            const data = response.data
            setModalData(data)
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to load user");
            } 
            else if (error.request) 
            {
                toast.error("RESPONSE:", error?.response);
            } 
            else {
                // Something else went wrong
                toast.error("Error: " + error.message);
            }
        }
        
    }

    return (
        <>
            <div className="flex flex-col md:flex-row flex-wrap md:items-center gap-10 mb-10">
                <Filter
                    filters={filters}
                    setFilters={setFilters} 
                    config={employeesFilterConfig}
                />

                <button 
                    onClick={() => {
                        setIsOpen(true)
                        setIsCreateForm(true)
                    }} 
                    className="inline-flex gap-2 bg-brandMarketing-500 text-white px-4 py-3 max-w-48 rounded-xl hover:bg-brandMarketing-600 transition">
                    <Plus className="w-5 h-5" /> Add Employee
                </button>
            </div>

            <Table
                title={"Employees"}
                columns={columns}
                data={normalizedData} 
            />

            {isOpen && (
                <UserAddEditModal 
                    isOpen={isOpen} 
                    onClose={() => {
                        setSubmissionSuccess(false)
                        setIsOpen(false)
                    }} 
                    isCreateForm={isCreateFrom}
                    data={modalData}
                    fetchUsers={fetchUsers}
                    updateUser={handleChange}
                    submissionSuccess={submissionSuccess}
                    setSubmissionSuccess={setSubmissionSuccess}
                />
            )}
            

            {openDeleteModal && (
                <DeleteModal 
                    isOpen={openDeleteModal} 
                    onClose={() => {
                        setSubmissionSuccess(false)
                        setOpenDeleteModal(false)
                    }} 
                    controllerName={"user"}
                    title={"Employee Account"}
                    rowId={idForDelete}
                    fetchData={fetchUsers}
                    submissionSuccess={submissionSuccess}
                    setSubmissionSuccess={setSubmissionSuccess}
                />
            )}

        </>
    )
}