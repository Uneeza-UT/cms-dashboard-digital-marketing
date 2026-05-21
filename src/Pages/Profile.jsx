import { Key, Edit, Eye, EyeOff, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Avatar from "../assets/images/Avatar.png"
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import api from "../api/axiosConfig";

export default function Profile() {

    const profileForm = useForm({ mode: "onChange" });
    const passwordForm = useForm({ mode: "onChange" });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = profileForm;

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        reset: reset2,
        watch,
        formState: {errors: errors2, isSubmitting: isSubmitting2 }
    } = passwordForm;


    const newPassword = watch("newPassword");
    const [toggle, setToggle] = useState(false);
    const [user, setUser] = useState([]);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const fileRef = useRef();

    const fetchUser= async () => {
        const response = await api.get("/user/profile")
        const data = await response.data
        setUser(data)
    }

    useEffect(() => {

        fetchUser();

    },[])

    useEffect(() => {
        if (user) {

            reset({
                name: user.name || "",
                email: user.email || "",
                
            });
        } 
        else {
            reset();
        }
    }, [user, reset]);

    const handleImageUpload= async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("Id", parseInt(user.id));
        formData.append("ImageFile", file);
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        console.log("formData", formData)

        try {
            const response = await api.patch("/profile/image",formData)

            toast.success('Profile image updated successfully');
            //fetchUser();
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update profile image");
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

    const updateProfile= async (formData) => {
        try {
            const response = await api.patch("/profile",
                {
                    Id: user.id,
                    Name: formData.name,
                    Email: formData.email
                }
            )

            const updatedUser = response.data;
            toast.success("Profile updated successfully");
            setUser(updatedUser); 
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update profile");
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

    const changePassword= async (formData) => {
        try {
            const response = await api.patch("/profile/change-password",
                {
                    Id: user.id,
                    OldPassword: formData.oldPassword,
                    NewPassword: formData.newPassword
                }
            )

            const updatedUser = response.data;
            toast.success("Password updated successfully");
            reset2();
            setShowOldPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            setUser(updatedUser); 
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to update Password");
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
        <div className="container mx-auto px-6 mt-10 mb-20">
            <div className="flex flex-col items-center justify-center gap-4 mb-20">
                <div 
                    className="relative group cursor-pointer" 
                    onClick={() => fileRef.current.click()}
                >
                    <img
                         src={
                            user.profileImageUrl
                                ? `${import.meta.env.VITE_API_URL_Base}${user.profileImageUrl}`
                                : Avatar
                        }
                        className="w-52 h-52 rounded-full cursor-pointer object-cover"
                        
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 rounded-full 
                                    flex items-center justify-center 
                                    opacity-0 group-hover:opacity-100 transition">
                        <Edit className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div>
                    <p className="text-lg" > {user.email} </p>
                </div>
                

                {/* Hidden input */}
                <input
                    type="file"
                    className="hidden"
                    ref={fileRef}
                    onChange={handleImageUpload}
                />
            </div>

            <div className="mb-20">
                <h2 className="text-2xl font-semibold mb-7 p-4"> 
                    Edit Profile 
                </h2>

                <div className="relative bg-white border p-8 md:p-16 rounded-xl shadow-lg border-black/10 w-full mt-2" >
                    <form className="space-y-12" onSubmit={profileForm.handleSubmit(updateProfile)}>
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <label className='flex flex-col gap-4 w-full'>
                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                    Name: 
                                </span>
                                <input 
                                    type="text" 
                                    placeholder="Enter Name" 
                                    className={`w-full md:text-lg border ${errors.name ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50"} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`}
                                    {...profileForm.register("name", {
                                        pattern: {
                                            value: /^[A-Za-z\s]+$/,
                                            message: "Only letters allowed"
                                        }
                                    })}
                                />
                                {errors.name && <p className='text-red-500 text-sm'> {errors.name.message} </p>}
                            </label>

                            <label className='flex flex-col gap-4 w-full'>
                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                    Email: 
                                </span>
                                <input 
                                    type="email" 
                                    placeholder="Enter Email" 
                                    className={`w-full md:text-lg border ${errors.email ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50"} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`}
                                    {...profileForm.register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+\.\S+$/,
                                            message: "Invalid email format"
                                        }
                                    })}
                                />
                                {errors.email && <p className='text-red-500 text-sm'> {errors.email.message} </p>}
                            </label>        
                        </div>

                        <div className="flex justify-start">
                            <button 
                                type="submit" 
                                disabled = {isSubmitting}
                                className="bg-brandMarketing-500 mt-1 lg:mt-6 font-bold md:text-lg
                                    text-white px-4 py-2 lg:py-3 rounded-xl w-full md:max-w-44 lg:max-w-60 
                                    hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                        Saving...
                                    </>) : (
                                        "Save Changes" 
                                    )}
                            </button>       
                        </div>
                             
                    </form>

                </div>
                
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-8 p-4"> Change Password </h2>

                {!toggle && 
                    <button 
                        onClick={() => setToggle(true)}
                        className="w-full md:w-auto h-14 md:h-16 flex items-center justify-center text-center gap-3 
                        px-4 py-3 md:px-6 md:py-4 text-base md:text-lg bg-brandMarketing-500 text-white rounded-xl 
                        font-medium hover:bg-brandMarketing-600 shadow-sm transition hover:scale-105 
                        duration-300 sm:hover:bg-brandMarketing-500"
                    >
                        <Key className="w-5 h-5" /> Change Password                                 
                    </button>
                }
                

                {toggle && 
                    <div className="relative bg-white border p-8 md:p-12 rounded-xl shadow-2xl border-black/20 max-w-xl md:max-w-md lg:max-w-xl w-full mt-2" >
                        <button
                            type="button"
                            onClick={() => setToggle(false)} 
                            className='absolute w-10 h-10 flex items-center justify-center rounded-full top-6 right-6 hover:text-brandMarketing-500 hover:bg-slate-50 transition-colors'
                        >
                            <X className='w-6 h-6 text-brandMarketing-500'/>
                        </button>
                        
                        <form className="space-y-8" onSubmit={handleSubmit2(changePassword)}> 

                            <label className='flex flex-col gap-4 w-full mt-14'>
                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                    Previous Password: 
                                    <span className="text-red-500 ml-1">*</span>
                                </span>
                                <div className="relative w-full">
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Enter Old Password"
                                        className={`w-full md:text-lg border ${errors2.oldPassword ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50"} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`}
                                        {...register2("oldPassword", {
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
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                    >
                                        {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors2.oldPassword && <p className='text-red-500 text-sm'> {errors2.oldPassword.message} </p>}
                            </label>

                            <label className='flex flex-col gap-4 w-full'>
                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                    New Password: 
                                    <span className="text-red-500 ml-1">*</span>
                                </span>
                                <div className="relative w-full">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter New Password"
                                        className={`w-full md:text-lg border ${errors2.newPassword ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50"} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`}
                                        {...register2("newPassword", {
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
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors2.newPassword && <p className='text-red-500 text-sm'> {errors2.newPassword.message} </p>}
                            </label>

                            <label className='flex flex-col gap-4 w-full'>
                                <span className='text-sm uppercase tracking-widest font-semibold text-brandMarketing-800'> 
                                    Confirm Password: 
                                    <span className="text-red-500 ml-1">*</span>
                                </span>
                                <div className="relative w-full">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        className={`w-full md:text-lg border ${errors2.confirmPassword ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50"} bg-brandMarketing-100 px-3 py-3 rounded-xl outline-none`}
                                        {...register2("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) =>
                                                value === newPassword || "Passwords do not match"
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
                                {errors2.confirmPassword && <p className='text-red-500 text-sm'> {errors2.confirmPassword.message} </p>}
                            </label>

                            <button 
                                type="submit" 
                                disabled = {isSubmitting2}
                                className="bg-brandMarketing-500 font-bold md:text-lg 
                                    text-white px-4 py-3 rounded-xl w-full  
                                    hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                            >
                                {isSubmitting2 ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                        Changing Password...
                                    </>) : (
                                        "Change Password" 
                                    )}
                            </button>
                        </form>
                    </div>
                }

            </div>
        </div>
    )
}