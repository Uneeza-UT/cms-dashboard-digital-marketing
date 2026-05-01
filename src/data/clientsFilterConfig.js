export const clientsFilterConfig = {
  searchableFields: ["name", "email", "industry"],
  filters: [
    { label: "Status", key: "status", type: "select", options: ["Active", "InActive", "Pending", "Suspended", "Closed"] }
  ]
};