export const employeesFilterConfig = {
  searchableFields: ["name", "email", "role"],
  filters: [
    { 
      label: "Status", 
      key: "isActive", 
      type: "select", 
      options: [
        { label: "Active", value: "true" },
        { label: "InActive", value: "false" }
      ]
    }
  ]
};