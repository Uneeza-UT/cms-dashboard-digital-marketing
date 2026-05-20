import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useForm } from 'react-hook-form'
import { useState, useEffect } from "react";
import { motion } from 'framer-motion'
import { X, Check, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify';
import api from "../../api/axiosConfig";
import { timeAgo } from "../../data/timeAgo";

export default function NotesModal({ isOpen, onClose, data, consultationId, fetchConsultations, fetchNotes }) {

    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm();
    const [notes, setNotes] = useState(data);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState(""); 
    const [user, setUser] = useState([]);    

    const fetchUser= async () => {
        const response = await api.get("/user/profile")
        const data = await response.data
        setUser(data)
    }

    useEffect(() => {

        fetchUser();

    },[])

    const createNote = async (formData) => {
  
        try {
            const response = await api.post(
                `/note`,
                {
                    Content: formData.note,
                    BookConsultationId: consultationId,
                    UserId: user.id
                }
            )
            toast.success('Note added successfully');
            reset()
            setNotes(prev => [...prev, response.data]);
            fetchConsultations()
            fetchNotes(consultationId)
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to create note");
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
    
    const onSubmit = (formData) => {

        createNote(formData);

    };

    const handleUpdate = async (id, content, bookConsultationId) => {

        try {
            const response = await api.put(
                `/note/${id}`,
                {
                    Id: id,
                    Content: content,
                    BookConsultationId: bookConsultationId,
                    UserId: user.id
                }
            ) 
            toast.success('Note edited successfully');
            setNotes(prev => [...prev, response.data]);
            fetchConsultations()
            fetchNotes(consultationId)
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || "Failed to edit note");
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

     const handleDelete = async (id) => {
            
        try {
            const response = await api.delete(
                `/note/${id}`,
                {
                    Id: id,
                }
            )
            toast.success(`Note deleted successfully`);
            setNotes(prev => [...prev, response.data]);
            fetchConsultations()
            fetchNotes(consultationId)
        }
            
        catch (error) {
            if (error.response) 
            {
                toast.error(error.response.data.message || `Failed to delete ${title}`);
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
    
                            <button
                                type="button"
                                onClick={onClose} 
                                className='absolute w-10 h-10 flex items-center justify-center rounded-full top-6 right-6 hover:text-brandMarketing-500 hover:bg-slate-50 transition-colors'
                            >
                                <X className='w-6 h-6 text-brandMarketing-500'/>
                            </button>

                            <DialogTitle className="text-2xl md:text-3xl text-center font-bold mb-10 text-brandMarketing-900 mt-8"> 
                                Notes
                            </DialogTitle> 

                            <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
                                <label className='flex flex-col gap-3 w-full'>
                                    <span className='text-base tracking-widest font-semibold text-brandMarketing-800'> 
                                        Note:
                                    </span>
                                    <textarea
                                        placeholder="Add Note"                                
                                        rows={2}
                                        autoFocus
                                        className={`text-lg w-full border ${errors.note ? "border-red-500" : "border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50 "} bg-brandMarketing-100 px-6 py-3 rounded-xl outline-none resize-none`} 
                                        {...register("note", {
                                            required: "Please add a note",
                                        })}
                                    ></textarea>
                                    {errors.note && <p className='text-red-500 text-sm'> {errors.note.message} </p>}
                                </label>
                                                        
                                <div className="bg-white pt-6 pb-6">
                                    <button
                                        type="submit"
                                        disabled = {isSubmitting}
                                        className="w-full flex justify-center items-center py-3 bg-brandMarketing-500 text-base text-white rounded-xl font-bold hover:bg-brandMarketing-600 shadow-lg shadow-brandMarketing-500/30 transition-all"
                                    >
                                        {isSubmitting ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                Adding...
                                        </>) 
                                        : "Add"
                                        }
                                    </button>
                                </div>
                            </form>     

                            <div className="mt-8">
                                <h3 className="text-xl font-semibold"> Notes </h3>
                              
                                <ol className="list-decimal mt-3 px-3 space-y-4">
                                    {notes.map(note => (
                                        <li key={note.id}>
                                         
                                            {editingId === note.id ? (
                                                <div className="flex justify-between items-center gap-4 ml-2">
                                                    <input
                                                        value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className="text-base w-full border border-slate-200 focus:ring-2 focus:ring-brandMarketing-500/50 bg-brandMarketing-100 px-6 py-2 rounded-xl outline-none resize-none" 
                                                        autoFocus
                                                        required
                                                    />

                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleUpdate(note.id, editingText, note.bookConsultationId)}>
                                                            <Check className='w-5 h-5 text-brandMarketing-500 hover:text-brandMarketing-600 transition duration-300 hover:scale-105'/>
                                                        </button>
                                                        <button onClick={() => setEditingId(null)}>
                                                            <X className='w-5 h-5 text-red-600 hover:text-red-800 transition duration-300 hover:scale-105'/>
                                                        </button>
                                                    </div>
                                                </div>
                                                ) : (
                                                <div className="flex justify-between items-center ">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-black">{note.content}</p>
                                                        <p className="text-brandMarketing-800">{user.name + " (" + user.email + ")"} • {timeAgo(note.createdAt)}</p>
                                                    </div>
                                                    

                                                    <div className="flex gap-3">
                                                        <button onClick={() => {
                                                            setEditingId(note.id);        
                                                            setEditingText(note.content); 
                                                        }}>
                                                            <Pencil className='w-5 h-5 text-brandMarketing-500 hover:text-brandMarketing-600 transition duration-300 hover:scale-105'/>
                                                        </button>
                                                        <button onClick={() => handleDelete(note.id)}>
                                                            <Trash2 className='w-5 h-5 text-gray-500 hover:text-gray-700 transition duration-300 hover:scale-105'/>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}                                   
                                           
                                        </li>                                      
                                    ))}
                                </ol>
                            </div>                
                                                
                        </DialogPanel>
                    </motion.div>  
                </div>              
            </div>             
        </Dialog>
    )
}