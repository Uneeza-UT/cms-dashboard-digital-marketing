import { useForm } from 'react-hook-form'
import { useEffect, useState } from "react";
import { Rocket, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-toastify';
import { useSearchParams } from "react-router-dom";
import api from '../api/axiosConfig';

export default function ChangePassword() {
    const {register, handleSubmit, reset, watch, formState: {errors, isSubmitting}} = useForm();
    const password = watch("password");
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const isResetMode = !!token;

    const sendEmail = async (formData) => {
           
        try {
            await api.post(`/forgotPassword/forgot-password`, 
                {
                    Email: formData.email,
                }
            )
            toast.success('Email sent successfully');
            reset()
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to send email");
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

    const changePassword = async (formData) => {
        const payload = {
                    Token: token,
                    NewPassword: formData.password
                }
                console.log(payload)
        try {
            await api.post(`/forgotPassword/reset-password`, 
                {
                    Token: token,
                    NewPassword: formData.password
                }
            )
            toast.success('Password Changed successfully');
            reset()
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to change password");
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

        if (!isResetMode) 
        {
            sendEmail(formData);
        } 
        else {
            changePassword(formData);
        }
    };


    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-8 container mx-auto px-10 lg:px-14">
            <a href="#" className="text-3xl md:text-4xl font-bold flex items-center group space-x-3">
                <span className="relative grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-brandMarketing-500 to-neon-400 text-white shadow-lg">
                    <Rocket className="w-6 h-6"/>
                </span>                             
                <span className="group-hover:text-hover transition-colors">Change Password</span>
            </a>

            <div className="relative bg-brandMarketing-200/60 border p-8 md:p-12 rounded-xl shadow-2xl border-black/20 max-w-xl md:max-w-md lg:max-w-xl w-full mt-2" >
                <form className="space-y-12" onSubmit={handleSubmit(onSubmit)}>

                    {!isResetMode ? (
                        <>
                            <label className='flex flex-col gap-4 w-full'>
                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                    Email: 
                                    <span className="text-red-500 ml-1">*</span>
                                </span>
                                <input 
                                    type="email" 
                                    placeholder="Enter Email" 
                                    className={`w-full md:text-lg border ${errors.email ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50"} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: "Invalid email format"
                                        }
                                    })}
                                />
                                {errors.email && <p className='text-red-500 text-sm'> {errors.email.message} </p>}
                            </label>

                            <button 
                                type="submit" 
                                disabled = {isSubmitting}
                                className="bg-brandMarketing-500 mt-1 xl:mt-3 font-bold md:text-lg 
                                    text-white px-4 py-2 lg:py-3 rounded-xl w-full  
                                    hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                        Sending...
                                    </>) : (
                                        "Send Reset Link" 
                                    )}
                            </button>
                        </> 
                    ) : (
                        <>
                            <label className='flex flex-col gap-4 w-full'>
                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                    New Password: 
                                    <span className="text-red-500 ml-1">*</span>
                                </span>
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter Password"
                                        className={`w-full md:text-lg border ${errors.password ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50"} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters"
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                                                message: "Password must include uppercase, lowercase, a number and a special character"
                                            }
                                        })}
                                    />

                                    <button
                                        type="button"
                                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brandMarketing-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <p className='text-red-500 text-sm'> {errors.password.message} </p>}
                            </label>

                            <label className='flex flex-col gap-4 w-full'>
                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                    Confirm Password: 
                                    <span className="text-red-500 ml-1">*</span>
                                </span>
                                <div className="relative w-full">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        className={`w-full md:text-lg border ${errors.confirmPassword ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50"} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`}
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) =>
                                                value === password || "Passwords do not match"
                                        })}
                                    />

                                    <button
                                        type="button"
                                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-brandMarketing-500"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className='text-red-500 text-sm'> {errors.confirmPassword.message} </p>}
                            </label>

                            <button 
                                type="submit" 
                                disabled = {isSubmitting}
                                className="bg-brandMarketing-500 mt-1 xl:mt-3 font-bold md:text-lg 
                                    text-white px-4 py-2 lg:py-3 rounded-xl w-full  
                                    hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                        Resetting Password...
                                    </>) : (
                                        "Reset Password" 
                                    )}
                            </button>
                        </>
                    )}
                    
                </form>

            </div>
        </main>
        
    )
}