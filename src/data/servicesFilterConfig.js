export const servicesFilterConfig = {
  searchableFields: ["name"],
  filters: [
    { 
      label: "Status", 
      key: "isActive", 
      type: "select", 
      options: [
        { label: "Active", value: true },
        { label: "InActive", value: false }
      ]
    }
  ]
};