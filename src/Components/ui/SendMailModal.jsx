import { Dialog, DialogPanel } from "@headlessui/react";
import { motion } from 'framer-motion'
import { FaGoogle, FaYahoo, FaMailBulk } from "react-icons/fa";
import { Mail } from "lucide-react";

export default function SendMailModal({ isOpen, onClose, data }) {

    const openMailClient = () => {
        const link = `mailto:${data.email}?subject=Consultation Follow-up&body=Hello ${data.name},`;
        window.location.href = link;
    };

    const openWebMail = (provider) => {
        let url = "";
        const subject = encodeURIComponent("Consultation Follow-up");
        const body = encodeURIComponent(`Hello ${data.name},`);
        const to = encodeURIComponent(data.email);

        switch (provider) {
            case "gmail":
                url = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
                break;

            case "outlook":
                url = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${to}&subject=${subject}&body=${body}`;
                break;

            case "yahoo":
                url = `https://compose.mail.yahoo.com/?to=${to}&subject=${subject}&body=${body}`;
                break;
        }

        window.open(url, "_blank");
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50" >
            <div className="fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm transition-opacity" aria-hidden="true" />
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-8"> 
                    <motion.div 
                        className="w-full max-w-md"
                        initial={{ opacity:0, y:14 }}
                        animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.6, ease:"easeOut" }}
                    >                        
                        <DialogPanel className='bg-white rounded-xl shadow-lg p-12 relative w-full max-w-md' >

                            <h2 className="text-xl md:text-2xl text-center font-bold mb-10 text-brandMarketing-900"> 
                                Choose how to send Email:
                            </h2> 

                            <div className="flex flex-col gap-3 mt-2 md:text-lg">

                                 <button
                                    onClick={openMailClient}
                                    className="inline-flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-100 text-left"
                                >
                                    <FaMailBulk className="w-5 h-5" /> Default Email App
                                </button>

                                <button
                                    onClick={() => openWebMail("gmail")}
                                    className="inline-flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-100 text-left"
                                >
                                    <FaGoogle className="w-5 h-5" /> Gmail
                                </button>
                                <button
                                    onClick={() => openWebMail("outlook")}
                                    className="inline-flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-100 text-left"
                                >
                                    <Mail className="w-5 h-5" /> Outlook
                                </button>
                                <button
                                    onClick={() => openWebMail("yahoo")}
                                    className="inline-flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-100 text-left"
                                >
                                    <FaYahoo className="w-5 h-5" /> Yahoo
                                </button>
                            </div>                                             
                                                
                        </DialogPanel>
                    </motion.div>  
                </div>              
            </div>             
        </Dialog>
    )
}