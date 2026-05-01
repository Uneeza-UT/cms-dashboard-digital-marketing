import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from 'react-hook-form'
import { useEffect } from "react";
import { motion } from 'framer-motion'
import { X, CheckSquare2 } from 'lucide-react'
import { toast } from 'react-toastify';
import api from "../../api/AxiosConfig";

export default function ServiceModal({isOpen, onClose, isCreateForm, data, fetchServices, updateService, submissionSuccess, setSubmissionSuccess}) {

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm();
   
    useEffect(() => {
        if (!isCreateForm && data) {

            reset({
                name: data.name
            });
        } 
        else {
            reset({
                name: ""
            });
        }
    }, [data, isCreateForm, reset]);

    const createService = async (formData) => {
        
        try {
            await api.post(
                `/service`,
                {
                    Name: formData.name,
                }
            )
            await fetchServices();  
            toast.success('Service created successfully');
            setSubmissionSuccess(true);
            reset()
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to create service");
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

    const onSubmit = (formData) => {

        if (isCreateForm) 
        {
            createService(formData);
        } 
        else {
            updateService(data.id, formData.name, data.isActive, false );
        }
    };


    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50" >
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

                                    <DialogTitle className="text-2xl md:text-3xl text-center font-bold mb-10 text-brandMarketing-900 mt-8"> 
                                        {isCreateForm ? "Add Service" : "Edit Service"}
                                    </DialogTitle> 
                                    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                                        <label className='flex flex-col gap-5 w-full'>
                                            <span className='text-base tracking-widest font-semibold text-brandMarketing-800'> 
                                                Name: 
                                                <span className="text-red-500"> * </span>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Service Name"
                                                autoFocus
                                                className={`text-lg w-full border ${errors.name ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50 "} bg-brandMarketing-100 px-6 py-3 rounded-xl outline-none`} 
                                                {...register("name", {
                                                    required: "Name is required",
                                                    pattern: {
                                                        value: /^[A-Za-z\s]+$/,
                                                        message: "Only letters allowed"
                                                    }
                                                })}
                                            />
                                            {errors.name && <p className='text-red-500 text-sm'> {errors.name.message} </p>}
                                        </label>
                                                              

                                        <div className="flex justify-center bg-white pt-6 pb-6">
                                            <button
                                                type="submit"
                                                disabled = {isSubmitting}
                                                className="w-full py-3 bg-brandMarketing-500 text-base text-white rounded-xl font-bold hover:bg-brandMarketing-600 shadow-lg shadow-brandMarketing-500/30 transition-all"
                                            >
                                                {isSubmitting ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                        Submitting...
                                                </>) : (
                                                    isCreateForm ? "Add" : "Update"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>   
                            ) : (
                                <div className="flex flex-col items-center text-center mt-8">
                                    <h3 className="flex justify-center items-center gap-3 text-xl md:text-2xl font-semibold text-green-700">
                                        <CheckSquare2 className="w-6 h-6 md:w-7 md:h-7 text-green-700" />
                                        {isCreateForm ? "Service Added" : "Service Updated"}
                                    </h3>
                                    <p className="mt-4 mb-8 md:text-lg text-gray-600">
                                        {isCreateForm ? "Service has been added successfully" : "Service has been updated successfully"}
                                    </p>

                                    <button 
                                        type="button" // submit on last step
                                        onClick={() => setSubmissionSuccess(false)}
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