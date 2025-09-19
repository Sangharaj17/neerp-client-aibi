export const getTenantHeaders = (includeJson = true) => {
  const headers = {
    "X-Tenant": localStorage.getItem("tenant"),
  };
  if (includeJson) headers["Content-Type"] = "application/json";
  return headers;
};