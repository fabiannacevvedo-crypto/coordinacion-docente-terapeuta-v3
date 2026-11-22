const API_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Cliente HTTP unificado para interactuar con la API RESTful de SincroAula
 */
async function request(endpoint, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("sincroaula_token");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include",
  };

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.mensaje || data.message || `Error del servidor (${res.status})`;
      const error = new Error(errorMsg);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error en API ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Autenticación
  register: (userData) => request("/auth/register", { method: "POST", body: userData }),
  login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getProfile: () => request("/auth/profile"),
  updateProfile: (profileData) => request("/auth/profile", { method: "PUT", body: profileData }),

  // Gestión de Usuarios (user.controller)
  getUsers: (params = "") => request(`/users${params ? `?${params}` : ""}`),
  getUserById: (id) => request(`/users/${id}`),
  createUser: (userData) => request("/users", { method: "POST", body: userData }),
  updateUser: (id, userData) => request(`/users/${id}`, { method: "PUT", body: userData }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
  restoreUser: (id) => request(`/users/${id}/restore`, { method: "POST" }),

  // Alumnos
  getAlumnos: () => request("/alumnos"),
  getAlumnoById: (id) => request(`/alumnos/${id}`),
  createAlumno: (alumnoData) => request("/alumnos", { method: "POST", body: alumnoData }),
  updateAlumno: (id, alumnoData) => request(`/alumnos/${id}`, { method: "PUT", body: alumnoData }),
  deleteAlumno: (id) => request(`/alumnos/${id}`, { method: "DELETE" }),
  vincularUsuario: (id, vinculoData) => request(`/alumnos/${id}/vincular`, { method: "POST", body: vinculoData }),

  // Tareas con Circuito Docente -> Terapeuta (Adaptación TDAH) -> Tutor Familiar
  getTareas: (query = "") => request(`/tareas${query ? `?${query}` : ""}`),
  createTarea: (tareaData) => request("/tareas", { method: "POST", body: tareaData }),
  adaptarTarea: (id, adaptacionData) => request(`/tareas/${id}/adaptar`, { method: "PUT", body: adaptacionData }),
  reportarTareaTutor: (id, reporteData) => request(`/tareas/${id}/reporte-tutor`, { method: "PUT", body: reporteData }),

  // Chat Multicanal en Tiempo Real
  getMensajesChat: (query = "") => request(`/chat${query ? `?${query}` : ""}`),
  enviarMensajeChat: (msgData) => request("/chat", { method: "POST", body: msgData }),

  // Presentaciones Adaptadas para el Alumno (Sección Docente)
  getPresentaciones: (query = "") => request(`/presentaciones${query ? `?${query}` : ""}`),
  createPresentacion: (presData) => request("/presentaciones", { method: "POST", body: presData }),
  deletePresentacion: (id) => request(`/presentaciones/${id}`, { method: "DELETE" }),

  // Reportes y Bitácora Diaria
  getReportes: (query = "") => request(`/reportes${query ? `?${query}` : ""}`),
  getReporteById: (id) => request(`/reportes/${id}`),
  createReporte: (reporteData) => request("/reportes", { method: "POST", body: reporteData }),
  updateReporte: (id, reporteData) => request(`/reportes/${id}`, { method: "PUT", body: reporteData }),
  deleteReporte: (id) => request(`/reportes/${id}`, { method: "DELETE" }),

  // Alertas de Coordinación
  getAlertas: (query = "") => request(`/alertas${query ? `?${query}` : ""}`),
  createAlerta: (alertaData) => request("/alertas", { method: "POST", body: alertaData }),
  atenderAlerta: (id) => request(`/alertas/${id}/atender`, { method: "PUT" }),

  // Estrategias
  getEstrategias: (categoria = "") => request(`/estrategias${categoria ? `?categoria=${categoria}` : ""}`),
  asociarEstrategia: (data) => request("/estrategias/asociar", { method: "POST", body: data }),

  // Panel Administrativo
  getEstadisticas: () => request("/admin/estadisticas"),
  resolverVerificacion: (userId, data) => request(`/admin/usuarios/${userId}/verificacion`, { method: "PUT", body: data }),

  // Health
  getHealth: () => request("/health"),
};

export default api;
