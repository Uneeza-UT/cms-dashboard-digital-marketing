import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from 'framer-motion'
import { X, CheckSquare2 } from 'lucide-react'
import { toast } from 'react-toastify';
import api from "../../api/axiosConfig";

export default function DeleteModal({isOpen, onClose, controllerName, title, rowId, fetchData, submissionSuccess, setSubmissionSuccess}) {

    const deleteData = async () => {
            
        try {
            await api.delete(
                `/${controllerName}/${rowId}`,
                {
                    Id: rowId,
                }
            )
            await fetchData();  
            toast.success(`${title} deleted successfully`);
            setSubmissionSuccess(true);
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || `Failed to delete ${title}`);
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
        <Dialog open={isOpen} onClose={onClose} static className="relative z-50" >
            <div className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-opacity" aria-hidden="true" />
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-8"> 
                    <motion.div 
                        className="w-full max-w-lg"
                        initial={{ opacity:0, y:14 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.6, ease:"easeOut" }}
                    >                        
                        <DialogPanel className='bg-white rounded-xl shadow-lg p-12 relative w-full max-w-lg' >
    
                            
                            {!submissionSuccess ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={onClose} 
                                        className='absolute w-10 h-10 flex items-center justify-center rounded-full top-6 right-6 hover:text-brandMarketing-500 hover:bg-slate-50 transition-colors'
                                    >
                                        <X className='w-6 h-6 text-brandMarketing-500'/>
                                    </button>

                                    <DialogTitle className="text-2xl md:text-3xl text-center font-bold mb-5 text-brandMarketing-900 mt-8"> 
                                        Delete {title}
                                    </DialogTitle> 

                                    <p className="mt-4 mb-8 md:text-lg text-center text-gray-600"> Are you sure you want to delete this {title}?</p>

                                    <div className="flex justify-center items-center gap-4">
                                        <button 
                                            type="button" 
                                            onClick={deleteData} 
                                            className="w-auto flex items-center justify-center h-12 px-6
                                            bg-brandMarketing-500 text-white rounded-xl font-medium 
                                            transition-all duration-300 sm:hover:bg-brandMarketing-600"
                                        >
                                            Yes                                           
                                        </button>

                                        <button 
                                            type="submit" 
                                            onClick={onClose} 
                                            className="w-auto flex items-center justify-center h-12 px-6
                                            bg-brandMarketing-500 text-white rounded-xl font-medium 
                                            transition-all duration-300 sm:hover:bg-brandMarketing-600"
                                        >
                                            No                                          
                                        </button>

                                    </div>
                                    
                                </>   
                            ) : (
                                <div className="flex flex-col items-center text-center mt-8">
                                    <h3 className="flex justify-center items-center gap-3 text-xl md:text-2xl font-semibold text-green-700">
                                        <CheckSquare2 className="w-6 h-6 md:w-7 md:h-7 text-green-700" />
                                        {title} Deleted
                                    </h3>
                                    <p className="mt-5 mb-8 md:text-lg text-gray-600">
                                        {title} has been deleted successfully
                                    </p>

                                    <button 
                                        type="button"
                                        onClick={onClose}
                                        className="w-full sm:w-auto flex items-center justify-center h-12 px-6
                                        bg-brandMarketing-500 text-white rounded-xl font-medium 
                                        transition-all duration-300 sm:hover:bg-brandMarketing-600"
                                    >
                                        OK                                            
                                    </button>
                                </div>
                            )}
                                                
                        </DialogPanel>
                    </motion.div>  
                </div>              
            </div>             
        </Dialog>
    )
}