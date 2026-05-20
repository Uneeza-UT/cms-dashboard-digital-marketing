import Table from "../Components/Table";
import Filter from "../Components/Filter";
import { useState, useEffect, useRef } from "react";
import { Eye, MoreVertical, Delete, Edit, Plus } from "lucide-react";
import { toast } from 'react-toastify';
import DeleteModal from "../Components/ui/DeleteModal";
import ClientViewModal from "../Components/ui/ClientViewModal";
import ClientAddEditModal from "../Components/ui/ClientAddEditModal";
import api from "../api/axiosConfig";
import { clientsFilterConfig } from "../data/clientsFilterConfig";

export default function Clients() {
     const [filters, setFilters] = useState({
        search: "",
        status: ""
    });
    const { searchableFields } = clientsFilterConfig;
    const [clients, setClients] = useState([])
    const [modalData, setModalData] = useState(null)
    const [rowNumber, setRowNumber] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
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
        { header: "Company", accessor: "company" },
        { header: "Industry", accessor: "industry" },
        { header: "Status", accessor: "status" },
        { header: "Contact", accessor: "contact" },
        { header: "Actions", accessor: "actions" },
    ]

    const fetchClients= async () => {
        const response = await api.get("/client")
        const data = await response.data
        setClients(data)
    }
    
    useEffect(() => {

        fetchClients();

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
    
    const handlePatchUpdate = async (id, status, lastContactedAt = null) => {
        try {
            await api.patch(
                `/client/${id}`,
                {
                    Id: id,
                    Status: status,
                    lastContactedAt: lastContactedAt
                }
            )
            await fetchClients();  
            toast.success('Client updated successfully');
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update status");
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

     const handleUpdate = async (data) => {

        try {
            await api.put(`/client/${data.Id}`, data)
            await fetchClients();  
            toast.success('Client updated successfully');
            setSubmissionSuccess(true);
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update client");
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

    
    const filteredData = clients.filter((row) => {

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
            if (!filters[key]) return true;

            return row[key]?.toString() === filters[key]?.toString();
        })

        return searchMatch && filterMatch;
    })
    
    const normalizedData = filteredData.map((row, index) => ({
        srNumber: index + 1,
        name: row.name,
        email: row.email,
        company: row.company || "Not Provided",
        industry: row.industry,
        status: (
            <select
                key={index}
                value={row.status}
                onChange={(e) => handlePatchUpdate(row.id, e.target.value)}
                className="border rounded-xl px-2 py-2"
            >
                <option value="Active"> Active </option>
                <option value="InActive"> InActive </option>
                <option value="Pending"> Pending </option>            
                <option value="Suspended"> Suspended </option>
                <option value="Closed"> Closed </option>
            </select>
        ),
        contact: (
            row.lastContactedAt && row.lastContactedAt !== "0001-01-01T00:00:00" 
            ? "Contacted" 
            :  (<button 
                type="button" // submit on last step
                onClick={() => handlePatchUpdate(row.id, row.status, new Date() )}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2
                text-sm md:text-base bg-white text-brandMarketing-500 border border-brandMarketing-500 
                rounded-xl font-medium transition-all duration-300 sm:hover:bg-brandMarketing-500
                hover:text-white"
            >
                Mark as Contacted                                      
            </button>) 
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
                                    setIsViewModalOpen(true)
                                    setRowNumber(null)
                                }}
                                    className={`flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg hover:bg-brandMarketing-200
                                        hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer`}
                                >   
                                        <Eye className="w-5 h-5" /> View
                                </a>                           
                            </li>

                            <li>
                                <a  onClick={() => {
                                    fetchDataforModal(row.id)
                                    setIsOpen(true)
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
        setIsCreateForm(false);

        try {
            const response = await api.get(`/client/${id}`)
            const data = response.data
            setModalData(data)
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to load client information");
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
                    config={clientsFilterConfig}
                />

                <button 
                    onClick={() => {
                        setIsOpen(true)
                        setIsCreateForm(true)
                    }} 
                    className="inline-flex gap-2 bg-brandMarketing-500 text-white px-4 py-3 max-w-40 rounded-xl hover:bg-brandMarketing-600 transition">
                    <Plus className="w-5 h-5" /> Add Client
                </button>
            </div>

            <Table
                title={"Clients"}
                columns={columns}
                data={normalizedData} 
            />

            {isViewModalOpen && modalData && (
                <ClientViewModal 
                    isOpen={isViewModalOpen} 
                    onClose={() => {
                        setIsViewModalOpen(false)
                    }} 
                    data={modalData}
                />
            )}

            {isOpen && (!isCreateFrom ? modalData : true) && (
                <ClientAddEditModal 
                    isOpen={isOpen} 
                    onClose={() => {
                        setSubmissionSuccess(false)
                        setIsOpen(false)
                    }} 
                    isCreateForm={isCreateFrom}
                    data={modalData}
                    fetchClients={fetchClients}
                    updateClient={handleUpdate}
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
                    controllerName={"client"}
                    title={"Client"}
                    rowId={idForDelete}
                    fetchData={fetchClients}
                    submissionSuccess={submissionSuccess}
                    setSubmissionSuccess={setSubmissionSuccess}
                />
            )}
        </>
    )
}