export const ROUTES = {
  LEAD_DETAILS: (tenant, leadId) =>
    `/${tenant}/dashboard/lead-management/lead-list/leadDetails/${leadId}`,

  LEAD_LIST: (tenant) =>
    `/${tenant}/dashboard/lead-management/lead-list`,
};
