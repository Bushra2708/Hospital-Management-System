import api from "./api";

export const appointmentService = {
  getAll: (params) => api.get("/appointments", { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  getMyAppointments: () => api.get("/appointments/my"),
  getStats: () => api.get("/appointments/stats"),
  book: (data) => api.post("/appointments", data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id, reason) => api.put(`/appointments/${id}/cancel`, { cancelReason: reason }),
  delete: (id) => api.delete(`/appointments/${id}`),
};
