import Table from "../Components/Table";
import Filter from "../Components/Filter";
import { useState, useEffect, useRef } from "react";
import { Eye, MoreVertical, Delete, UserRoundPlus, Plus, FileText } from "lucide-react";
import { toast } from 'react-toastify';
import DeleteModal from "../Components/ui/DeleteModal";
import ConsultationModal from "../Components/ui/ConsultationModal";
import NotesModal from "../Components/ui/NotesModal";
import api from "../api/axiosConfig";
import { consultationsFilterConfig } from "../data/consultationsFilterConfig";


export default function Consultations() {
    const [filters, setFilters] = useState({
        search: "",
        status: ""
    });
    const { searchableFields } = consultationsFilterConfig;
    const [consultations, setConsultations] = useState([])
    const [modalData, setModalData] = useState(null)
    const [notesData, setNotesData] = useState(null)
    const [rowNumber, setRowNumber] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [openNotesModal, setOpenNotesModal] = useState(false)
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [idForDelete, setIdForDelete] = useState(0);
    const [consultationId, setConsultationId] = useState(0);
    const [dropdownPos, setDropdownPos] = useState(null);
    const dropdownRef = useRef(null);

    const columns = [
        { header: "#", accessor: "srNumber" },
        { header: "Name", accessor: "name" },
        { header: "Email Address", accessor: "email" },
        { header: "Budget", accessor: "budget" },
        { header: "Status", accessor: "status" },
        { header: "Notes", accessor: "notes" },
        { header: "Actions", accessor: "actions" },
    ]

    const fetchConsultations= async () => {
        const response = await api.get("/bookConsultation")
        const data = await response.data
        setConsultations(data)
    }

    useEffect(() => {

        fetchConsultations();

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

    const handleStatusChange = async (id, status, isConverted) => {
        try {
            await api.put(
                `/BookConsultation/${id}`,
                {
                    Id: id,
                    Status: status,
                    IsConvertedToClient: isConverted
                }
            )
            await fetchConsultations();  
            toast.success('Status updated successfully');
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

    const handleConvertToClient = async (data) => {

        const payload= {
            Name: data.name,
            Email: data.email,
            BrandName: data.brandName,
            PhoneNumber: data.phoneNumber,
            Industry: data.industry,
            Budget: data.budget,
            Message: data.message,
            IsConverted: true,
            ServiceIds: data.services.map(service => service.id)
        }
        try {
            await api.post(`/client`, payload )
            await api.put(
                `/BookConsultation/${data.id}`,
                {
                    Id: data.id,
                    Status: data.status,
                    IsConvertedToClient: true
                }
            )
            fetchConsultations();
            toast.success('Client converted successfully');
        }
         
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to convert client");
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

    const filteredData = consultations.filter((row) => {

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
        budget: row.budget,
        status: (
            <select
                key={index}
                value={row.status}
                onChange={(e) => handleStatusChange(row.id, e.target.value, row.isConvertedToClient)}
                className="border rounded-xl px-2 py-2"
            >
                <option value="New"> New </option>
                <option value="Pending"> Pending </option>            
                <option value="In Progress"> In Progress </option>
                <option value="Completed"> Completed </option>
            </select>
        ),
        notes: (          
            row.notes?.length > 0
            ? (<a onClick={() => fetchNotesDataforModal(row.id)} 
                    className="inline-flex items-center gap-2 hover:text-brandMarketing-500 cursor-pointer"
                > 
                    <FileText className="w-5 h-5" /> {row.notes.length} Notes 
                </a>)
            :  (<button 
                    type="button" // submit on last step
                    onClick={() => fetchNotesDataforModal(row.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2
                    text-sm md:text-base bg-white text-brandMarketing-500 border border-brandMarketing-500 
                    rounded-xl font-medium transition-all duration-300 sm:hover:bg-brandMarketing-500
                    hover:text-white"
                >
                    <Plus className="w-5 h-5" /> Add Notes                                      
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
                                    setRowNumber(null)
                                }}
                                    className={`flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg hover:bg-brandMarketing-200
                                        hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer`}
                                >   
                                    <Eye className="w-5 h-5" /> View
                                </a>                           
                            </li>

                            {!row.isConvertedToClient && (<li>
                                <a  onClick={() => {
                                    setRowNumber(null)
                                    handleConvertToClient(row)
                                }}
                                    className={`flex items-center gap-3 px-4 py-4 text-base font-medium rounded-lg hover:bg-brandMarketing-200
                                        hover:text-brandMarketing-500 transition-all duration-300 transform cursor-pointer`}
                                >   
                                    <UserRoundPlus className="w-5 h-5" /> Convert to Client
                                </a>                           
                            </li>)}

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

        try {
            const response = await api.get(`/bookConsultation/${id}`)
            const data = response.data
            setModalData(data)
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to load consultation");
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

    const fetchNotesDataforModal= async (id) => {
        setConsultationId(id)
        setNotesData(null)
        setOpenNotesModal(true)

        try {
            const response = await api.get(`/note/${id}`)
            const data = response.data
            setNotesData(data)
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to load Notes");
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

    return (
        <>
            <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-10">
                <Filter
                    filters={filters}
                    setFilters={setFilters} 
                    config={consultationsFilterConfig}
                />

            </div>

            <Table
                title={"Consultations"}
                columns={columns}
                data={normalizedData} 
            />

            {isOpen && modalData && (
                <ConsultationModal 
                    isOpen={isOpen} 
                    onClose={() => {
                        setSubmissionSuccess(false)
                        setIsOpen(false)
                    }} 
                    data={modalData}
                />
            )}
            

            {openDeleteModal && (
                <DeleteModal 
                    isOpen={openDeleteModal} 
                    onClose={() => {
                        setSubmissionSuccess(false)
                        setOpenDeleteModal(false)
                    }} 
                    controllerName={"bookConsultation"}
                    title={"Consultation"}
                    rowId={idForDelete}
                    fetchData={fetchConsultations}
                    submissionSuccess={submissionSuccess}
                    setSubmissionSuccess={setSubmissionSuccess}
                />
            )}

            {openNotesModal && notesData && (
                <NotesModal 
                    isOpen={openNotesModal} 
                    onClose={() => {
                        setOpenNotesModal(false)
                    }} 
                    data={notesData}
                    consultationId={consultationId}
                    fetchConsultations={fetchConsultations}
                    fetchNotes={fetchNotesDataforModal}
                />
            )}
        </>
    )
}