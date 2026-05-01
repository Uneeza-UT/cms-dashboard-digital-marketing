export default function StatsCard({title, number}) {

    return (
        <div className="relative bg-white backdrop-blur-sm shadow-lg rounded-lg p-6 h-36
            text-left border border-gray-300  hover:border-brandMarketing-500/30 
            hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div className="absolute top-0 left-0 h-1 w-full bg-brandMarketing-500 rounded-t-xl" />
            <div className="flex flex-col h-full items-start">           
                    <h3 className="text-lg text-gray-600 mb-4 leading-snug break-words"> {title} </h3>
                    <p className="text-3xl font-bold mt-auto text-gray-800"> 
                       {number}
                    </p>                                                          
            </div>                        
        </div>
    )
}