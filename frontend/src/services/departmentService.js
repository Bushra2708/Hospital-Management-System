import api from "./api";

export const departmentService = {
  getAll: () => api.get("/departments"),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

export const userService = {
  getAll: (params) => api.get("/users", { params }),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  changePassword: (data) => api.put("/users/change-password", data),
  getDashboardStats: () => api.get("/users/dashboard-stats"),
  delete: (id) => api.delete(`/users/${id}`),
};
