import React, { useState, useEffect } from "react";
import { api } from "../services/api.js";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Trash2,
  RotateCcw,
  Sparkles,
  Search,
} from "lucide-react";

export const DashboardAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resUsers, resStats] = await Promise.all([
        api.getUsers(),
        api.getEstadisticas(),
      ]);

      if (resUsers.ok) setUsuarios(resUsers.usuarios);
      if (resStats.ok) setEstadisticas(resStats.estadisticas);
    } catch (e) {
      console.error("Error al cargar panel admin:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleResolverVerificacion = async (id, nuevoEstado) => {
    try {
      await api.resolverVerificacion(id, { estado_verificacion: nuevoEstado });
      cargarDatos();
    } catch (e) {
      alert("Error actualizando verificación: " + e.message);
    }
  };

  const handleEliminarLogico = async (id, nombre) => {
    if (!window.confirm(`¿Confirmas la eliminación lógica de ${nombre}? Los registros históricos se preservarán.`)) return;

    try {
      await api.deleteUser(id);
      alert("Usuario eliminado lógicamente con éxito (paranoid: true).");
      cargarDatos();
    } catch (e) {
      alert("Error al eliminar lógicamente: " + e.message);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    return (
      u.nombre?.toLowerCase().includes(q) ||
      u.apellido?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Header Admin */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-admin">Supervisión y Control</span>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Panel de Administración General</span>
        </div>
        <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
          Gestión de Usuarios y Eliminación Lógica
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Auditoría de roles, verificación de CUE / matrículas y control de integridad referencial
        </p>
      </div>

      {/* Tarjetas de Estadísticas Globales */}
      {estadisticas && (
        <div className="grid-4" style={{ marginBottom: "2rem" }}>
          <div className="card" style={{ borderLeft: "4px solid #2563eb" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>Total Usuarios</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a" }}>{estadisticas.totalUsuarios}</div>
          </div>
          <div className="card" style={{ borderLeft: "4px solid #10b981" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>Alumnos Vinculados</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a" }}>{estadisticas.totalAlumnos}</div>
          </div>
          <div className="card" style={{ borderLeft: "4px solid #8b5cf6" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>Reportes en Bitácora</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a" }}>{estadisticas.totalReportes}</div>
          </div>
          <div className="card" style={{ borderLeft: "4px solid #ef4444" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>Alertas Pendientes</div>
            <div style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a" }}>{estadisticas.alertasPendientes}</div>
          </div>
        </div>
      )}

      {/* Tabla de Usuarios */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>
            Listado de Usuarios Registrados ({usuariosFiltrados.length})
          </h2>

          <div style={{ position: "relative", minWidth: "260px" }}>
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "2.2rem" }}
            />
            <Search size={16} color="#94a3b8" style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)" }} />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#64748b" }}>
                <th style={{ padding: "0.75rem" }}>Usuario</th>
                <th style={{ padding: "0.75rem" }}>Rol</th>
                <th style={{ padding: "0.75rem" }}>Datos del Perfil</th>
                <th style={{ padding: "0.75rem" }}>Verificación</th>
                <th style={{ padding: "0.75rem", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => {
                const rolName = u.roles?.[0]?.name || "USUARIO";
                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "0.75rem" }}>
                      <div style={{ fontWeight: "700", color: "#0f172a" }}>{u.nombre} {u.apellido}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{u.email}</div>
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      <span className={`badge badge-${rolName.toLowerCase()}`}>{rolName}</span>
                    </td>
                    <td style={{ padding: "0.75rem", fontSize: "0.8rem", color: "#475569" }}>
                      {u.perfil_docente && (
                        <div>Escuela: {u.perfil_docente.institucion} (CUE: {u.perfil_docente.cue_escuela})</div>
                      )}
                      {u.perfil_terapeuta && (
                        <div>{u.perfil_terapeuta.especialidad} - Matrícula: {u.perfil_terapeuta.matricula_numero}</div>
                      )}
                      {u.perfil_familiar && (
                        <div>Parentesco: {u.perfil_familiar.parentesco} (DNI: {u.perfil_familiar.dni})</div>
                      )}
                      {!u.perfil_docente && !u.perfil_terapeuta && !u.perfil_familiar && (
                        <span style={{ color: "#94a3b8" }}>Perfil administrativo</span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem" }}>
                      {u.estado_verificacion === "APROBADO" ? (
                        <span className="badge" style={{ background: "#ecfdf5", color: "#059669" }}>
                          <CheckCircle2 size={12} /> Aprobado
                        </span>
                      ) : u.estado_verificacion === "RECHAZADO" ? (
                        <span className="badge" style={{ background: "#fef2f2", color: "#dc2626" }}>
                          <XCircle size={12} /> Rechazado
                        </span>
                      ) : (
                        <span className="badge" style={{ background: "#fffbeb", color: "#d97706" }}>
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "0.75rem", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                        {u.estado_verificacion !== "APROBADO" && (
                          <button
                            onClick={() => handleResolverVerificacion(u.id, "APROBADO")}
                            className="btn btn-secondary btn-sm"
                            title="Aprobar Verificación"
                            style={{ color: "#10b981", padding: "0.3rem 0.5rem" }}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEliminarLogico(u.id, `${u.nombre} ${u.apellido}`)}
                          className="btn btn-secondary btn-sm"
                          title="Eliminación Lógica (Sequelize paranoid)"
                          style={{ color: "#ef4444", padding: "0.3rem 0.5rem" }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
