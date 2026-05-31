import api from "./api";

export const billingService = {
  getAll: (params) => api.get("/billing", { params }),
  getById: (id) => api.get(`/billing/${id}`),
  getMyBills: () => api.get("/billing/my"),
  getStats: () => api.get("/billing/stats"),
  create: (data) => api.post("/billing", data),
  update: (id, data) => api.put(`/billing/${id}`, data),
  delete: (id) => api.delete(`/billing/${id}`),
};
