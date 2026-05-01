export default function Table({title, columns, data}) {
    return (
        <div className="bg-white rounded-2xl shadow p-4 md:p-10">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                
                    {/* Header */}
                    <thead>
                        <tr className="bg-brandMarketing-200 text-left">
                            {columns.map((col, index) => (
                                <th key={index} className="p-3">
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                {columns.map((col, j) => (
                                    <td key={j} className="p-3">
                                        {row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}