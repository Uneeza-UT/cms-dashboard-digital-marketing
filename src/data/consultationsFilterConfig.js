export const consultationsFilterConfig =  {

    searchableFields: ["name", "email", "industry"],
    filters: [
      { label: "Status", key: "status", type: "select", options: ["New", "Pending", "In Progress", "Completed"] }
    ]
};