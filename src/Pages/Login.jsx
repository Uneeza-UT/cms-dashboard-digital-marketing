import { useForm } from 'react-hook-form'
import { useState } from "react";
import { Rocket, Eye, EyeOff } from 'lucide-react'
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

export default function Login() {

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm();
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    

    const onSubmit = async (formData) => {

        try {
            var response = await axios.post(`https://localhost:44345/api/login`, 
                {
                    Email: formData.email,
                    Password: formData.password
                }
            )

            localStorage.setItem("token", response.data.token);
            reset()
            navigate("/dashboard");
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to login");
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
        <main className="min-h-screen flex flex-col items-center justify-center py-10 gap-8 container mx-auto px-10 lg:px-14">
            <a href="#" className="text-3xl md:text-3xl lg:text-4xl font-bold flex items-center group space-x-3">
                <span className="relative grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-brandMarketing-500 to-neon-400 text-white shadow-lg">
                    <Rocket className="w-6 h-6"/>
                </span>                             
                <span className="group-hover:text-hover transition-colors">Login</span>
            </a>

            <div className="relative bg-brandMarketing-200/60 border p-8 md:p-12 rounded-xl shadow-2xl border-black/20 max-w-lg md:max-w-md w-full mt-4" >
                <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>

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
                    
                    <label className='flex flex-col gap-4 w-full'>
                        <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                            Password: 
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

                    <div className="flex justify-between items-center mt-4">

                        <p className="flex items-center text-sm md:text-base text-brandMarketing-800">
                            <input
                                type="checkbox"
                                className="rounded-lg accent-brandMarketing-500 w-6 h-6 md:w-8 md:h-8 transform scale-50"
                                {...register("rememberme", {})} 
                            />
                            Remember me
                        </p>

                        <NavLink to={"/change-password"} className="text-brandMarketing-800 text-sm md:text-base hover:text-brandMarketing-600 hover:border-b-2 hover:border-brandMarketing-600"> 
                            Forgot Password? 
                        </NavLink>

                    </div>

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
                                Logging In...
                            </>) : (
                                "Login" 
                            )}
                    </button>
                </form>

            </div>
        </main>
      
    )
}