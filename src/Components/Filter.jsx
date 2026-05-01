export default function Filter({ filters, setFilters, config}) {
    return (
        <>
            <input
                type="text"
                placeholder="Search..."
                className="border px-4 py-3 rounded-xl"
                value={filters.search}
                onChange={(e) =>
                setFilters({
                    ...filters,
                    search: e.target.value
                })
                }
            />

            {config.filters.map((filter, i) => (
                <div key={i}>

                    {filter.type === "select" && (
                        <select
                            className="border px-4 py-3 rounded-xl"
                            value={filters[filter.key] || ""}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    [filter.key]: e.target.value
                                })
                            }
                        >
                            <option value="" disabled> Select {filter.label} </option>
                            <option value=""> All </option>
                            
                            {filter.options.map((opt, idx) => (

                                <option 
                                    key={idx}
                                    value={typeof opt === "object" ? opt.value : opt}
                                >
                                    {typeof opt === "object" ? opt.label : opt}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            ))}
        </>
    )
}