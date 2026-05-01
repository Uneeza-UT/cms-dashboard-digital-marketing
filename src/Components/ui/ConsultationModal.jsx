import { motion } from 'framer-motion'
import { X, NotepadText, CheckCircle2, Send } from 'lucide-react'
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SendMailModal from './SendMailModal';

export default function ConsultationModal({isOpen, onClose, data}){

    const [showEmailOptions, setShowEmailOptions] = useState(false)

    
    return (
        <>
            <Dialog open={isOpen} onClose={onClose} className="relative z-50" >
            <div className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-opacity" aria-hidden="true" />
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-8"> 
                        <motion.div 
                            className="w-full max-w-2xl"
                            initial={{ opacity:0, y:14 }}
                            animate={{ opacity:1, y:0 }}
                            transition={{ duration:0.6, ease:"easeOut" }}
                        >                        
                            <DialogPanel className='bg-white rounded-xl shadow-lg p-12 relative w-full max-w-2xl' >
                            
                                <button
                                    type="button"
                                    onClick={onClose} 
                                    className='absolute w-10 h-10 flex items-center justify-center rounded-full top-6 right-6 hover:text-brandMarketing-500 hover:bg-slate-50 transition-colors'
                                >
                                    <X className='w-6 h-6 text-brandMarketing-500'/>
                                </button>

                                <DialogTitle className="text-2xl md:text-3xl text-center font-bold mb-10 text-brandMarketing-900 mt-8"> 
                                    Consultation Details
                                </DialogTitle> 

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-lg md:text-xl rounded-xl group gap-4"> 
                                    <p className="font-semibold text-gray-900 mr-3"> Name: </p>                                                                   
                                    <p className="text-gray-600 leading-relaxed break-words">                            
                                        {data.name}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-lg md:text-xl rounded-xl group gap-4"> 
                                    <p className="font-semibold text-gray-900 mr-3"> Email: </p>                                                                   
                                    <p className="text-gray-600 leading-relaxed break-words">                            
                                        {data.email}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-lg md:text-xl rounded-xl group gap-4"> 
                                    <p className="font-semibold text-gray-900 mr-3"> Phone: </p>                                                                   
                                    <p className="text-gray-600 leading-relaxed">                            
                                        {data.phoneNumber || "Not Provided"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-lg md:text-xl rounded-xl group gap-4"> 
                                    <p className="font-semibold text-gray-900 mr-3 break-words"> Company: </p>                                                                   
                                    <p className="text-gray-600 leading-relaxed">                            
                                        {data.brandName || "Not Provided"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-lg md:text-xl rounded-xl group gap-4"> 
                                    <p className="font-semibold text-gray-900 mr-3 break-words"> Industry: </p>                                                                   
                                    <p className="text-gray-600 leading-relaxed">                            
                                        {data.industry}
                                    </p>
                                </div>
                                

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-lg md:text-xl rounded-xl group gap-4 mt-3"> 
                                    <p className="font-semibold text-gray-900 mr-3"> Services: </p>                                                                   
                                    <ul className="text-gray-600 leading-relaxed space-y-4">                            
                                        {data.services.map((service, index) => (
                                            <li key={index} className='flex item-start'> 
                                                <CheckCircle2 className='text-brandMarketing-500 mr-3 w-5 h-5 flex-shrink-0 mt-1'/>                                                  
                                                {service.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-xl rounded-xl group gap-4"> 
                                    <p className="font-semibold text-gray-900 mr-3"> Budget: </p>                                                                   
                                    <p className="text-gray-600 leading-relaxed">                            
                                        {data.budget}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-xl rounded-xl group gap-4"> 
                                    <p className="font-semibold text-gray-900 mr-3"> Status: </p>                                                                   
                                    <p className="text-gray-600 leading-relaxed">                            
                                        {data.status}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] items-start p-4 text-xl rounded-xl group gap-4"> 
                                    <p className="font-semibold text-gray-900 mr-3 "> Message: </p>                                                                   
                                    <p className="text-gray-600 leading-relaxed break-words">                            
                                        {data.message || "Not Provided"}
                                    </p> 
                                </div>

                                <div className="mt-10 border-t pt-8 text-center">
                                    <p className="text-base font-medium text-gray-700 mb-6">
                                        Add notes or follow-up details for this consultation
                                    </p>

                                    <div className="mt-10 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        
                                        <button 
                                            onClick={() => setShowEmailOptions(true)}
                                            className="flex justify-center items-center gap-3 w-full md:w-52 bg-brandMarketing-500 hover:bg-brandMarketing-600 text-white px-6 py-3 font-medium rounded-xl transition-all duration-300"
                                        >
                                            <Send className='w-5 h-5' />  
                                            Send Email
                                        </button>
                 
                                    </div>                         
                                </div>
                                    
                            </DialogPanel>
                        </motion.div>  
                    </div>              
                </div>             
            </Dialog>

            {showEmailOptions && (
                
                <SendMailModal 
                    isOpen={showEmailOptions} 
                    onClose={() => {
                        setShowEmailOptions(false)
                    }} 
                    data={data}
                />
            )}
        </>
        
    )
}