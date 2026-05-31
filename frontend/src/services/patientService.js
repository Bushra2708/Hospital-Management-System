import api from "./api";

export const patientService = {
  getAll: () => api.get("/patients"),
  getById: (id) => api.get(`/patients/${id}`),
  getMyProfile: () => api.get("/patients/me"),
  create: (data) => api.post("/patients", data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};
