import { Dialog, DialogTitle, DialogPanel } from "@headlessui/react";
import { useForm } from 'react-hook-form'
import { useState, useEffect } from "react";
import { motion } from 'framer-motion'
import { X, CheckSquare2 } from 'lucide-react'
import { toast } from 'react-toastify';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import api from "../../api/AxiosConfig";

export default function ClientAddEditModal({isOpen, onClose, isCreateForm, data, fetchClients, updateClient, submissionSuccess, setSubmissionSuccess}) {

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm({
        mode: "onChange"
    });
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [services, setServices] = useState([])
    const PhoneInputComponent = PhoneInput.default || PhoneInput;
   
    const handlePhoneChange = (formattedValue) => {
        setPhone(formattedValue);

        const phoneNumberObj = parsePhoneNumberFromString(formattedValue.startsWith("+") ? 
                                                                        formattedValue : "+" + formattedValue);
        if (phoneNumberObj && !phoneNumberObj.isValid()) {
            setError("Invalid phone number for this country");
        } 
        else {
            setError("");
        }
    }

    useEffect(() => {
        const fetchServices = async () => { 
            const response = await api.get("/service")
            const data = await response.data
            setServices(data)
        };

        fetchServices();

    }, [])


    useEffect(() => {
        if (!isCreateForm && data) {

            reset({
                name: data.name || "",
                email: data.email || "",
                brandName: data.brandName || "",
                industry: data.industry || "",
                budget: data.budget || "",
                serviceIds: data.services?.map(s => String(s.id)) || [],
                message: data.message || "",
                
            });
            setPhone(data.phoneNumber || "");
        } 
        else {
            reset();
        }
    }, [data, isCreateForm, reset]);

    const createClient = async (formData) => {

        const payload = {
            ...formData,
            IsConverted: false,
            PhoneNumber: phone,         
        };

        try {
            await api.post(`/client`, payload)
            await fetchClients();  
            toast.success('Client created successfully');
            setSubmissionSuccess(true);
            reset()
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to create client");
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
            createClient(formData);
        } 
        else {
            const { serviceIds, ...rest } = formData;
            const payload = {
                ...rest,
                Id: data.id,
                PhoneNumber: phone,
                ServiceIds: formData.serviceIds.map(id =>  Number(id) )
            }

            updateClient(payload);
        }
    };


    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50" >
            <div className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-opacity" aria-hidden="true" />
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-8"> 
                    <motion.div 
                        className={`w-full ${!submissionSuccess ?  "max-w-3xl" : "max-w-xl"}`}
                        initial={{ opacity:0, y:14 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.6, ease:"easeOut" }}
                    >                        
                        <DialogPanel className={`bg-white rounded-xl shadow-lg p-12 relative w-full ${!submissionSuccess ?  "max-w-3xl" : "max-w-xl"}`} >
    
                            
                            {!submissionSuccess ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={onClose} 
                                        className='absolute w-10 h-10 flex items-center justify-center rounded-full top-6 right-6 hover:text-brandMarketing-500 hover:bg-slate-50 transition-colors'
                                    >
                                        <X className='w-6 h-6 text-brandMarketing-500'/>
                                    </button>

                                    <DialogTitle className="text-2xl md:text-4xl text-center font-bold mb-12 text-brandMarketing-900 mt-8"> 
                                        {isCreateForm ? "Add Client" : "Edit Client"}
                                    </DialogTitle> 
                                    <form className='md:space-y-4' onSubmit={handleSubmit(onSubmit)}>
                                        <div className="flex flex-col md:flex-row items-center md:gap-10">
                                            <label className='flex flex-col gap-3 w-full'>
                                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                                    Name: 
                                                    <span className="text-red-500"> * </span>
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="Your Name"
                                                    className={`w-full md:text-lg border ${errors.name ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50 "} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`} 
                                                    {...register("name", {
                                                        required: "Name is required",
                                                        pattern: {
                                                            value: /^[A-Za-z\s]+$/,
                                                            message: "Only letters allowed"
                                                        }
                                                    })}
                                                />
                                                <p className="text-red-500 text-sm min-h-[20px]">
                                                    {errors.name?.message || ""}
                                                </p>
                                            </label>
                                        
                                            <label className='flex flex-col gap-3 w-full'>
                                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                                    Email: 
                                                    <span className="text-red-500"> * </span>
                                                </span>
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className={`w-full md:text-lg border ${errors.email ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50 "} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`} 
                                                    {...register("email", {
                                                        required: "Email is required",
                                                        pattern: {
                                                            value: /^\S+@\S+\.\S+$/,
                                                            message: "Invalid email format"
                                                        }
                                                    })}
                                                />
                                                <p className="text-red-500 text-sm min-h-[20px]">
                                                    {errors.email?.message || ""}
                                                </p>
                                            </label>
                                        </div>
                                       

                                        <div className="flex flex-col md:flex-row items-center md:gap-10">
                                            <label className='flex flex-col gap-3 w-full'>
                                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                                    Phone Number: 
                                                </span>

                                                <PhoneInputComponent
                                                    country={'us'}
                                                    value={phone}            // controlled value
                                                    onChange={(value, data, event, formattedValue) => {
                                                        handlePhoneChange(formattedValue)
                                                    }} // update state
                                                    enableSearch
                                                    placeholder="+1 214 000 1115"
                                                    inputProps={{
                                                        maxLength: 20,
                                                    }}
                                                    containerClass="!w-full"
                                                    inputClass={`!w-full md:!text-lg !h-12 md:!h-14 !px-3 !py-3 !pl-14 !rounded-xl !outline-none !border ${
                                                        error ? "!border-red-500" : "!border-slate-200 !focus:ring-2 !focus:ring-brandMarketing-500/50"
                                                    } !bg-brandMarketing-100`}
                                                    buttonClass="!h-12 md:!h-14 !w-12 !border-slate-200 !rounded-l-xl"
                                                    inputStyle={{
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                />

                                                <p className="text-red-500 text-sm min-h-[20px]">
                                                    {error || ""}
                                                </p>
                                            </label>

                                            <label className='flex flex-col gap-3 w-full'>
                                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                                    Company / Brand Name: 
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder="Company / Brand Name"
                                                    className={`w-full md:text-lg border ${errors.brandName ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50 "} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`} 
                                                    {...register("brandName", {
                                                        pattern: {
                                                            value: /^[A-Za-z0-9\s\-\&\.'()]+$/,
                                                            message: "Only letters, numbers, and spaces allowed"
                                                        }
                                                    })}
                                                />
                                                <p className="text-red-500 text-sm min-h-[20px]">
                                                    {errors.brandName?.message || ""}
                                                </p>
                                            </label>
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row items-center md:gap-10">
                                            <label className='flex flex-col gap-3 w-full'>
                                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                                    Industry: 
                                                    <span className="text-red-500"> * </span>
                                                </span>
                                                <select
                                                    className={`w-full md:h-14 md:text-lg border ${errors.industry ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50 "} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`} 
                                                    {...register("industry", {
                                                        required: "Industry is required",
                                                    })}
                                                >
                                                    <option value=""> Select Industry </option>
                                                    <option value="Ecommerce"> E-commerce </option>
                                                    <option value="SaaS"> SaaS </option>
                                                    <option value="Healthcare"> Healthcare </option>
                                                    <option value="Education"> Education </option>
                                                    <option value="Other"> Other </option>
                                                </select>
                                                <p className="text-red-500 text-sm min-h-[20px]">
                                                    {errors.industry?.message || ""}
                                                </p>
                                            </label>

                                            <label className='flex flex-col gap-3 w-full'>
                                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                                    Budget: 
                                                    <span className="text-red-500"> * </span>
                                                </span>
                                                <select
                                                    className={`w-full md:h-14 md:text-lg border ${errors.budget ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50 "} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`} 
                                                    {...register("budget", {
                                                        required: "Please select your budget range",
                                                    })}
                                                >
                                                    <option value=""> Select Budget </option>
                                                    <option value="$500 - $1000"> $500 – $1,000 </option>
                                                    <option value="$1000 - $5000"> $1,000 – $5,000 </option>
                                                    <option value="$5000+"> $5,000+ </option>
                                                    <option value="Not Sure Yet"> Not Sure Yet </option>
                                                </select>
                                                <p className="text-red-500 text-sm min-h-[20px]">
                                                    {errors.budget?.message || ""}
                                                </p>
                                            </label>
                                        </div>
                                        

                                        <div className="flex flex-col gap-3">
                                            <span className="text-sm uppercase tracking-widest font-semibold text-brandMarketing-800 mb-2">
                                                Services Interested In <span className="text-red-500"> * </span>
                                            </span>
                                            {services
                                                .filter(service => service.isActive)
                                                .map(service => (

                                                <label key={service.id} className="flex items-center gap-3 md:text-lg">
                                                    <input
                                                        type="checkbox"
                                                        value={service.id}
                                                        {...register("serviceIds", {
                                                            validate: value => 
                                                            value && value.length > 0 || "Please select atleast one service"
                                                    })} 
                                                    />
                                                    {service.name}
                                                </label>
                                            ))}

                                            {errors.serviceIds && (<p className="text-red-500 text-sm">{errors.serviceIds.message} </p>)}
                                        </div>
                                        
                                        <div className="pt-8">
                                            <label className='flex flex-col gap-3 w-full'>
                                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                                    Briefly Describe Your Goals Here: 
                                                </span>
                                                <textarea
                                                    placeholder="Your Goals"
                                                    className="w-full text-lg border border-slate-200 bg-brandMarketing-100 px-3 py-3 rounded-lg focus:ring-2 focus:ring-brandMarketing-500/50 outline-none resize-none"
                                                    rows={4}
                                                    {...register("message")}
                                                ></textarea>
                                            </label>
                                        </div>
                                        

                                        <div className="p-4 mt-4 flex justify-center bg-white">
                                            <button
                                                type="submit"
                                                disabled = {isSubmitting}
                                                className="min-w-60 py-3 text-lg bg-brandMarketing-500 text-white rounded-xl font-bold hover:bg-brandMarketing-600 shadow-lg shadow-brandMarketing-500/30 transition-all"
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
                                        {isCreateForm ? "Client Added" : "Client Updated"}
                                    </h3>
                                    <p className="mt-4 mb-8 md:text-lg text-gray-600">
                                        {isCreateForm ? "Client has been added successfully" : "Client has been updated successfully"}
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
