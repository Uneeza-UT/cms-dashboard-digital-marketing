import Table from "../Components/Table";
import Filter from "../Components/Filter";
import { useState, useEffect, useRef } from "react";
import { MoreVertical, Edit, Delete, Plus } from "lucide-react";
import { toast } from 'react-toastify';
import ServiceModal from "../Components/ui/ServiceModal";
import DeleteModal from "../Components/ui/DeleteModal";
import api from "../api/axiosConfig";
import { servicesFilterConfig } from "../data/servicesFilterConfig";

export default function Services() {
    const [filters, setFilters] = useState({
        search: "",
        isActive: ""
    });
    const { searchableFields } = servicesFilterConfig;
    const [services, setServices] = useState([])
    const [modalData, setModalData] = useState(null)
    const [rowNumber, setRowNumber] = useState(null)
    const [isCreateFrom, setIsCreateForm] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [idForDelete, setIdForDelete] = useState(0);
    const [dropdownPos, setDropdownPos] = useState(null);
    const dropdownRef = useRef(null);

    const columns = [
        { header: "#", accessor: "srNumber" },
        { header: "Name", accessor: "name" },
        { header: "Status", accessor: "status" },
        { header: "Actions", accessor: "actions" },
    ]

    const fetchServices= async () => {
        const response = await api.get("/service")
        const data = await response.data
        setServices(data)
    }
    

    useEffect(() => {

        fetchServices();

    }, []);

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

    const handleChange = async (id, name, isActive, isUpdatingStatus) => {

        try {
            await api.put(
                `/service/${id}`,
                {
                    Id: id,
                    Name: name,
                    IsActive: isActive
                }
            )
            await fetchServices();  
            toast.success('Service updated successfully');
            isUpdatingStatus ? "" : setSubmissionSuccess(true);
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update service");
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
    
    const filteredData = services.filter((row) => {

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
   
    
    const normalizedData = filteredData.map((row, index) => ({
        srNumber: index + 1,
        name: row.name,
        status: (
            <select
                key={index}
                value={row.isActive}
                onChange={(e) => handleChange(row.id, row.name, e.target.value === "true", true)}
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
                        className="fixed mt-2 w-44 bg-white border border-brandMarketing-200 rounded-lg shadow-md z-50"
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
           
        )}
            
    ))


    const fetchDataforModal= async (id) => {
        setModalData(null)
        setIsCreateForm(false);
        setIsOpen(true)

        try {
            const response = await api.get(`/service/${id}`)
            const data = response.data
            setModalData(data)
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to load service");
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
                    config={servicesFilterConfig}
                />

                <button 
                    onClick={() => {
                        setIsOpen(true)
                        setIsCreateForm(true)
                    }} 
                    className="inline-flex gap-2 bg-brandMarketing-500 text-white px-4 py-3 max-w-40 rounded-xl hover:bg-brandMarketing-600 transition">
                    <Plus className="w-5 h-5" /> Add Service
                </button>
            </div>

            <Table
                title={"Services"}
                columns={columns}
                data={normalizedData} 
            />

            {isOpen && (
                <ServiceModal 
                    isOpen={isOpen} 
                    onClose={() => {
                        setSubmissionSuccess(false)
                        setIsOpen(false)
                    }} 
                    isCreateForm={isCreateFrom}
                    data={modalData}
                    fetchServices={fetchServices}
                    updateService={handleChange}
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
                    controllerName={"service"}
                    title={"Service"}
                    rowId={idForDelete}
                    fetchData={fetchServices}
                    submissionSuccess={submissionSuccess}
                    setSubmissionSuccess={setSubmissionSuccess}
                />
            )}

        </>   
    )
}