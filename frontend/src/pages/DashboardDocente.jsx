import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import { AlertaModal } from "../components/docente/AlertaModal.jsx";
import {
  GraduationCap,
  Users,
  Bell,
  PlusCircle,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Send,
  Eye,
} from "lucide-react";

export const DashboardDocente = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [filtroSemaforo, setFiltroSemaforo] = useState("TODOS");
  const [modalAlertaOpen, setModalAlertaOpen] = useState(false);
  const [modalReporteOpen, setModalReporteOpen] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);

  // Formulario nuevo reporte
  const [nuevoReporte, setNuevoReporte] = useState({
    alumno_id: "",
    semaforo_emocional: "VERDE",
    titulo: "",
    descripcion: "",
    estrategia_utilizada: "",
    respuesta_alumno: "",
    compartido_con_familia: true,
  });

  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resAlumnos, resAlertas, resReportes] = await Promise.all([
        api.getAlumnos(),
        api.getAlertas("estado=PENDIENTE"),
        api.getReportes(),
      ]);

      if (resAlumnos.ok) setAlumnos(resAlumnos.alumnos);
      if (resAlertas.ok) setAlertas(resAlertas.alertas);
      if (resReportes.ok) setReportes(resReportes.reportes);
    } catch (err) {
      console.error("Error al cargar datos del aula docente:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Cambio interactivo rápido de semáforo emocional para un alumno
  const cambiarSemaforoAlumno = async (alumnoId, nuevoEstado) => {
    try {
      await api.updateAlumno(alumnoId, { semaforo_actual: nuevoEstado });
      setAlumnos((prev) =>
        prev.map((a) => (a.id === alumnoId ? { ...a, semaforo_actual: nuevoEstado } : a))
      );
    } catch (e) {
      console.error("Error cambiando semáforo:", e);
    }
  };

  // Enviar nuevo reporte
  const handleCrearReporte = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createReporte(nuevoReporte);
      if (res.ok) {
        setModalReporteOpen(false);
        setNuevoReporte({
          alumno_id: "",
          semaforo_emocional: "VERDE",
          titulo: "",
          descripcion: "",
          estrategia_utilizada: "",
          respuesta_alumno: "",
          compartido_con_familia: true,
        });
        cargarDatos();
      }
    } catch (e) {
      alert(e.message || "Error al crear el reporte");
    }
  };

  const alumnosFiltrados = alumnos.filter((a) => {
    if (filtroSemaforo === "TODOS") return true;
    return a.semaforo_actual === filtroSemaforo;
  });

  return (
    <div>
      {/* Header del Aula */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-docente">Espacio Docente</span>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Jardín de Infantes Nivel Inicial</span>
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
            Tablero de Aula y Coordinación
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Bienvenida/o, Prof. {user?.nombre} {user?.apellido} · Supervisión interactiva de la sala
          </p>
        </div>

        {/* Botones de Acción Inmediata */}
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            onClick={() => setModalAlertaOpen(true)}
            className="btn btn-primary"
            style={{ background: "#ef4444", boxShadow: "0 4px 14px rgba(239, 68, 68, 0.35)" }}
          >
            <AlertTriangle size={18} />
            <span>Aviso Inmediato al AT</span>
          </button>

          <button
            onClick={() => setModalReporteOpen(true)}
            className="btn btn-primary"
          >
            <PlusCircle size={18} />
            <span>Nueva Observación</span>
          </button>
        </div>
      </div>

      {/* Alertas Activas en Tiempo Real */}
      {alertas.length > 0 && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "14px",
            padding: "1rem 1.25rem",
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "800", color: "#991b1b", marginBottom: "0.5rem" }}>
            <Bell size={18} />
            <span>Alertas Activas del Aula ({alertas.length})</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {alertas.map((al) => (
              <div
                key={al.id}
                style={{
                  background: "white",
                  padding: "0.6rem 0.85rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "0.85rem",
                  border: "1px solid #fed7d7",
                }}
              >
                <div>
                  <strong>{al.alumno?.nombre} {al.alumno?.apellido}:</strong> {al.mensaje}
                </div>
                <span className="badge" style={{ background: "#fee2e2", color: "#991b1b" }}>
                  {al.nivel_urgencia}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros Visuales de Semáforo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "0.825rem", fontWeight: "700", color: "#475569" }}>Filtrar sala por estado:</span>
        {["TODOS", "VERDE", "AMARILLO", "ROJO"].map((s) => (
          <button
            key={s}
            onClick={() => setFiltroSemaforo(s)}
            className="btn btn-sm"
            style={{
              background: filtroSemaforo === s ? "var(--primary)" : "white",
              color: filtroSemaforo === s ? "white" : "#475569",
              border: "1px solid var(--surface-border)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid de Alumnos con Semáforo Interactivo */}
      <div className="grid-3" style={{ marginBottom: "2.5rem" }}>
        {alumnosFiltrados.map((alumno) => (
          <div key={alumno.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a" }}>
                  {alumno.nombre} {alumno.apellido}
                </h3>
                <span style={{ fontSize: "0.75rem", background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "6px", color: "#64748b" }}>
                  {alumno.sala_grado}
                </span>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <SemaforoBadge estado={alumno.semaforo_actual} />
              </div>

              <p style={{ fontSize: "0.825rem", color: "#475569", lineHeight: 1.5, marginBottom: "1rem" }}>
                <strong>Diagnóstico:</strong> {alumno.diagnostico || "Sin diagnóstico registrado"}
              </p>

              {/* Selector interactivo de semáforo para cambiarlo al instante */}
              <div style={{ background: "#f8fafc", padding: "0.6rem", borderRadius: "8px", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.725rem", fontWeight: "700", color: "#64748b", marginBottom: "0.35rem" }}>
                  Cambio Rápido de Estado en Aula:
                </div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button
                    onClick={() => cambiarSemaforoAlumno(alumno.id, "VERDE")}
                    title="Calmo / Participando"
                    style={{
                      flex: 1,
                      padding: "0.3rem",
                      borderRadius: "6px",
                      border: "none",
                      background: alumno.semaforo_actual === "VERDE" ? "#10b981" : "#e2e8f0",
                      color: alumno.semaforo_actual === "VERDE" ? "white" : "#475569",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    🟢 Verde
                  </button>
                  <button
                    onClick={() => cambiarSemaforoAlumno(alumno.id, "AMARILLO")}
                    title="Inquieto / Alerta"
                    style={{
                      flex: 1,
                      padding: "0.3rem",
                      borderRadius: "6px",
                      border: "none",
                      background: alumno.semaforo_actual === "AMARILLO" ? "#f59e0b" : "#e2e8f0",
                      color: alumno.semaforo_actual === "AMARILLO" ? "white" : "#475569",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    🟡 Amarillo
                  </button>
                  <button
                    onClick={() => cambiarSemaforoAlumno(alumno.id, "ROJO")}
                    title="Desregulación"
                    style={{
                      flex: 1,
                      padding: "0.3rem",
                      borderRadius: "6px",
                      border: "none",
                      background: alumno.semaforo_actual === "ROJO" ? "#ef4444" : "#e2e8f0",
                      color: alumno.semaforo_actual === "ROJO" ? "white" : "#475569",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    🔴 Rojo
                  </button>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.775rem", color: "#64748b" }}>Código: {alumno.codigo_familiar}</span>
              <Link to={`/alumnos/${alumno.id}`} style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "700" }}>
                Ver Ficha 360° →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bitácora de Observaciones Recientes */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={20} color="var(--primary)" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800" }}>Bitácora de Observaciones Compartidas</h2>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {reportes.slice(0, 5).map((rep) => (
            <div
              key={rep.id}
              style={{
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontWeight: "800", color: "#0f172a" }}>{rep.titulo}</div>
                <SemaforoBadge estado={rep.semaforo_emocional} size="sm" />
              </div>
              <p style={{ fontSize: "0.85rem", color: "#475569" }}>{rep.descripcion}</p>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", gap: "1rem" }}>
                <span>Alumno: <strong>{rep.alumno?.nombre} {rep.alumno?.apellido}</strong></span>
                <span>Autor: {rep.autor?.nombre} {rep.autor?.apellido}</span>
                <span>Fecha: {rep.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Alerta Rápida */}
      <AlertaModal
        isOpen={modalAlertaOpen}
        onClose={() => setModalAlertaOpen(false)}
        alumnos={alumnos}
        onAlertaCreada={() => cargarDatos()}
      />

      {/* Modal de Nuevo Reporte */}
      {modalReporteOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1rem" }}>
              Registrar Observación en la Bitácora
            </h3>

            <form onSubmit={handleCrearReporte}>
              <div className="form-group">
                <label className="form-label">Alumno</label>
                <select
                  required
                  value={nuevoReporte.alumno_id}
                  onChange={(e) => setNuevoReporte({ ...nuevoReporte, alumno_id: e.target.value })}
                  className="form-select"
                >
                  <option value="">Seleccione un alumno...</option>
                  {alumnos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} {a.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Semáforo Emocional</label>
                  <select
                    value={nuevoReporte.semaforo_emocional}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, semaforo_emocional: e.target.value })}
                    className="form-select"
                  >
                    <option value="VERDE">🟢 Verde (Regulado / Participando)</option>
                    <option value="AMARILLO">🟡 Amarillo (Inquieto / Alerta)</option>
                    <option value="ROJO">🔴 Rojo (Desregulado / Pausa)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Título Breve</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ronda de cuentos y plástica"
                    value={nuevoReporte.titulo}
                    onChange={(e) => setNuevoReporte({ ...nuevoReporte, titulo: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descripción de lo ocurrido</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalle cómo reaccionó el alumno ante la propuesta..."
                  value={nuevoReporte.descripcion}
                  onChange={(e) => setNuevoReporte({ ...nuevoReporte, descripcion: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estrategia Pedagógica Aplicada</label>
                <input
                  type="text"
                  placeholder="Ej: Anticipación con pictogramas"
                  value={nuevoReporte.estrategia_utilizada}
                  onChange={(e) => setNuevoReporte({ ...nuevoReporte, estrategia_utilizada: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                <button type="button" onClick={() => setModalReporteOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Observación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDocente;
