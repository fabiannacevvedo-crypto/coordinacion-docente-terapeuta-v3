import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import { ChatCoordinacion } from "../components/common/ChatCoordinacion.jsx";
import {
  Users,
  Award,
  CheckCircle2,
  Smile,
  ClipboardList,
  Send,
  GraduationCap,
  Stethoscope,
  Presentation,
} from "lucide-react";

export const DashboardFamiliar = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(null);

  // Modal o formulario activo para reportar cómo estuvo el hijo en una actividad
  const [tareaParaReportar, setTareaParaReportar] = useState(null);
  const [formReporteTutor, setFormReporteTutor] = useState({
    reporte_tutor: "",
    nivel_atencion_hogar: "ALTO_ENFOQUE",
    destinatario_reporte_tutor: "AMBOS",
  });

  const cargar = async () => {
    try {
      setLoading(true);
      const [resAlumnos, resReportes, resTareas, resPres] = await Promise.all([
        api.getAlumnos(),
        api.getReportes(),
        api.getTareas(),
        api.getPresentaciones(),
      ]);
      if (resAlumnos.ok) setAlumnos(resAlumnos.alumnos);
      if (resReportes.ok) setReportes(resReportes.reportes);
      if (resTareas.ok) setTareas(resTareas.tareas);
      if (resPres.ok) setPresentaciones(resPres.presentaciones);
    } catch (e) {
      console.error("Error cargando portal familiar:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const alumno = alumnos[0];

  const handleEnviarReporteActividad = async (e) => {
    e.preventDefault();
    if (!tareaParaReportar) return;
    try {
      const res = await api.reportarTareaTutor(tareaParaReportar.id, formReporteTutor);
      if (res.ok) {
        setTareaParaReportar(null);
        setMensajeExito(res.mensaje);
        setTimeout(() => setMensajeExito(null), 5000);
        cargar();
      }
    } catch (err) {
      alert("Error al enviar el reporte: " + err.message);
    }
  };

  // Filtramos tareas que ya fueron adaptadas por el terapeuta y enviadas al tutor (o todas para transparencia)
  const tareasVisiblesTutor = tareas.filter(
    (t) => t.estado === "ADAPTADA_ENVIADA_TUTOR" || t.estado === "COMPLETADA_POR_TUTOR"
  );

  // Medallas e insignias gamificadas orientadas a logros en TDAH
  const medallas = [
    { titulo: "Súper Enfoque Visual", desc: "Completó los 3 pasos cortos siguiendo el reloj visual sin frustrarse", icono: "⏱️", color: "#f59e0b" },
    { titulo: "Autoinstrucción Estrella", desc: "Aplicó 'Paro, miro y pienso' antes de comenzar la actividad", icono: "🧠", color: "#8b5cf6" },
    { titulo: "Pausa Activa Exitosa", desc: "Canalizó la energía con movimiento guiado y volvió a la calma", icono: "⚡", color: "#10b981" },
    { titulo: "Misión en Equipo", desc: "Compartió materiales y celebró cada estrella ganada", icono: "⭐", color: "#3b82f6" },
  ];

  return (
    <div>
      {/* Header Familiar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-familiar">Portal Familiar / Tutor</span>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Acompañamiento Integral en el Hogar (TDAH)</span>
        </div>
        <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
          Seguimiento de Tareas Adaptadas y Evolución Diaria
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Visualiza las tareas enviadas con su adaptación terapéutica TDAH y envía tu reporte o mensaje al Docente, al Terapeuta o a ambos
        </p>
      </div>

      {mensajeExito && (
        <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
          <CheckCircle2 size={18} />
          <span>{mensajeExito}</span>
        </div>
      )}

      {alumno ? (
        <>
          {/* Tarjeta Destacada del Día */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
              border: "1px solid #bbf7d0",
              marginBottom: "2rem",
              padding: "1.5rem 1.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "54px",
                    height: "54px",
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  <Smile size={30} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#166534" }}>
                    Estado del Alumno ({alumno.nombre} {alumno.apellido})
                  </div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#065f46" }}>
                    Se encuentra regulado, motivado y con foco activo
                  </h2>
                </div>
              </div>

              <div>
                <SemaforoBadge estado={alumno.semaforo_actual} />
              </div>
            </div>

            <p style={{ marginTop: "0.85rem", fontSize: "0.925rem", color: "#166534", lineHeight: 1.6 }}>
              Hoy en el aula se trabajó con consignas micro-segmentadas (Chunking) y apoyos visuales. El <strong>Rol Docente</strong> y el <strong>Rol Terapeuta</strong> coordinaron las pausas activas y la respuesta fue sobresaliente.
            </p>
          </div>

          {/* SECCIÓN PRINCIPAL: TAREAS ENVIADAS Y ADAPTACIONES TDAH REALIZADAS (Con Nombre de Docente, Terapeuta y Tutor + Botón Reportar) */}
          <div className="card" style={{ borderTop: "4px solid var(--familiar-color)", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ background: "var(--familiar-bg)", padding: "0.55rem", borderRadius: "10px", color: "var(--familiar-color)" }}>
                  <ClipboardList size={22} />
                </div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#0f172a" }}>
                    Tareas Enviadas y Adaptaciones TDAH para Realizar en Casa
                  </h2>
                  <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Cada actividad incluye la consigna del Docente, la adaptación paso a paso del Terapeuta y te permite enviar un reporte sobre cómo estuvo tu hijo
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {tareasVisiblesTutor.length === 0 ? (
                <div style={{ color: "#64748b", fontSize: "0.85rem", padding: "1rem" }}>
                  No hay tareas adaptadas pendientes en este momento.
                </div>
              ) : (
                tareasVisiblesTutor.map((t) => {
                  const nombreDocente = t.docente
                    ? `${t.docente.nombre} ${t.docente.apellido}`
                    : "Rol Docente";
                  const nombreTerapeuta = t.terapeuta
                    ? `${t.terapeuta.nombre} ${t.terapeuta.apellido}`
                    : "Rol Terapeuta";
                  const nombreTutor = user
                    ? `${user.nombre} ${user.apellido}`
                    : "Familiar Tutor";

                  return (
                    <div
                      key={t.id}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        borderRadius: "14px",
                        padding: "1.25rem",
                      }}
                    >
                      {/* Cabecera de la Tarea con Identificación de Docente, Terapeuta y Tutor */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.85rem", paddingBottom: "0.75rem", borderBottom: "1px solid #e2e8f0" }}>
                        <div>
                          <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#0f172a" }}>
                            {t.titulo}
                          </h3>
                          <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>
                            Alumno: <strong>{t.alumno?.nombre} {t.alumno?.apellido}</strong> · Entrega sugerida: {t.fecha_entrega}
                          </div>
                        </div>

                        <span
                          className="badge"
                          style={{
                            background: t.estado === "COMPLETADA_POR_TUTOR" ? "#d1fae5" : "#dbeafe",
                            color: t.estado === "COMPLETADA_POR_TUTOR" ? "#065f46" : "#1e40af",
                          }}
                        >
                          {t.estado === "COMPLETADA_POR_TUTOR"
                            ? "✅ Actividad Completada y Reportada"
                            : "📌 Lista para Realizar en Casa"}
                        </span>
                      </div>

                      {/* Tarjetas de Responsables (Nombre del Docente, Terapeuta y Tutor) */}
                      <div className="grid-3" style={{ gap: "0.75rem", marginBottom: "1rem" }}>
                        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.6rem 0.85rem", borderRadius: "10px", fontSize: "0.8rem" }}>
                          <div style={{ color: "#1d4ed8", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <GraduationCap size={15} /> Docente Asignador:
                          </div>
                          <div style={{ color: "#1e293b", fontWeight: "700", marginTop: "0.15rem" }}>
                            {nombreDocente}
                          </div>
                        </div>

                        <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", padding: "0.6rem 0.85rem", borderRadius: "10px", fontSize: "0.8rem" }}>
                          <div style={{ color: "#6d28d9", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <Stethoscope size={15} /> Adaptación TDAH por:
                          </div>
                          <div style={{ color: "#1e293b", fontWeight: "700", marginTop: "0.15rem" }}>
                            {nombreTerapeuta}
                          </div>
                        </div>

                        <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.6rem 0.85rem", borderRadius: "10px", fontSize: "0.8rem" }}>
                          <div style={{ color: "#047857", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            <Users size={15} /> Tutor Responsable:
                          </div>
                          <div style={{ color: "#1e293b", fontWeight: "700", marginTop: "0.15rem" }}>
                            {nombreTutor}
                          </div>
                        </div>
                      </div>

                      {/* Consigna Original + Adaptación TDAH */}
                      <div style={{ marginBottom: "0.85rem", fontSize: "0.85rem", color: "#475569" }}>
                        <strong>Consigna Escolar Original:</strong> {t.consigna_original}
                      </div>

                      <div
                        style={{
                          background: "white",
                          border: "2px solid #8b5cf6",
                          borderRadius: "12px",
                          padding: "1rem",
                          marginBottom: "1rem",
                        }}
                      >
                        <div style={{ fontSize: "0.825rem", fontWeight: "800", color: "#6d28d9", marginBottom: "0.35rem" }}>
                          🧠 Pautas y Adaptación Realizada para TDAH ({t.pautas_tdah_aplicadas}):
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#1e293b", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                          {t.adaptacion_terapeuta}
                        </div>
                        {t.recursos_apoyo && (
                          <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "#0284c7", fontWeight: "700" }}>
                            🛠️ Recursos de apoyo sugeridos: {t.recursos_apoyo}
                          </div>
                        )}
                      </div>

                      {/* Reporte del Tutor si ya fue enviado, o botón para enviar */}
                      {t.reporte_tutor && (
                        <div style={{ background: "#ecfdf5", border: "1px solid #10b981", padding: "0.85rem", borderRadius: "10px", marginBottom: "0.85rem", fontSize: "0.85rem", color: "#065f46" }}>
                          <div>
                            <strong>📋 Tu reporte enviado (Destinatario elegido: {t.destinatario_reporte_tutor === "AMBOS" ? "Docente y Terapeuta" : t.destinatario_reporte_tutor}):</strong>
                          </div>
                          <p style={{ marginTop: "0.25rem" }}>"{t.reporte_tutor}"</p>
                          <div style={{ fontSize: "0.75rem", marginTop: "0.25rem", fontWeight: "700" }}>
                            Nivel de foco observado en casa: {t.nivel_atencion_hogar}
                          </div>
                        </div>
                      )}

                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          onClick={() => {
                            setTareaParaReportar(t);
                            setFormReporteTutor({
                              reporte_tutor: t.reporte_tutor || "",
                              nivel_atencion_hogar: t.nivel_atencion_hogar || "ALTO_ENFOQUE",
                              destinatario_reporte_tutor: t.destinatario_reporte_tutor || "AMBOS",
                            });
                          }}
                          className="btn btn-primary"
                          style={{ background: "var(--familiar-color)" }}
                        >
                          <Send size={16} />
                          <span>
                            {t.reporte_tutor
                              ? "Actualizar Reporte de Actividad"
                              : "Enviar Reporte / Mensaje de cómo estuvo mi hijo"}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Presentaciones Adaptadas Compartidas por el Docente */}
          {presentaciones.length > 0 && (
            <div className="card" style={{ marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Presentation size={20} color="#7c3aed" />
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a" }}>
                  Presentaciones Adaptadas Compartidas por el Rol Docente
                </h3>
              </div>
              <div className="grid-2">
                {presentaciones.map((p) => (
                  <div key={p.id} style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: "800", color: "#0f172a", marginBottom: "0.25rem" }}>{p.titulo}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6d28d9", fontWeight: "700", marginBottom: "0.35rem" }}>
                      {p.perfil_sensorial_tdah}
                    </div>
                    <p style={{ fontSize: "0.825rem", color: "#475569" }}>{p.objetivo_pedagogico}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medallero de Logros Desbloqueados */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Award size={22} color="#f59e0b" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a" }}>
                Medallas de Logros Alcanzados esta Semana
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {medallas.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{m.icono}</div>
                  <div style={{ fontWeight: "800", fontSize: "0.95rem", color: "#0f172a" }}>{m.titulo}</div>
                  <div style={{ fontSize: "0.775rem", color: "#64748b", marginTop: "0.25rem" }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Directo con Docente y Terapeuta */}
          <div style={{ marginBottom: "2rem" }}>
            <ChatCoordinacion
              alumnos={alumnos}
              rolActual="FAMILIAR"
              titulo="Canal Directo con Rol Docente y Rol Terapeuta"
            />
          </div>

          {/* Observaciones y Notas Diarias Compartidas */}
          <div className="card">
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem" }}>
              Bitácora Diaria del Equipo Escolar y Terapéutico
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {reportes.length === 0 ? (
                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Aún no hay notas compartidas.</div>
              ) : (
                reportes.map((rep) => (
                  <div
                    key={rep.id}
                    style={{
                      background: "#f8fafc",
                      padding: "1rem",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <div style={{ fontWeight: "800", color: "#0f172a" }}>{rep.titulo}</div>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{rep.fecha}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5 }}>{rep.descripcion}</p>
                    {rep.estrategia_utilizada && (
                      <div style={{ fontSize: "0.8rem", color: "#2563eb", marginTop: "0.4rem", fontWeight: "600" }}>
                        💡 Pauta TDAH aplicada: {rep.estrategia_utilizada}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
          <p style={{ color: "#64748b" }}>Cargando información del alumno tutelado...</p>
        </div>
      )}

      {/* MODAL PARA ENVIAR REPORTE / MENSAJE AL DOCENTE, AL TERAPEUTA O A AMBOS */}
      {tareaParaReportar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.35rem" }}>
              Reportar cómo estuvo mi hijo en la actividad
            </h3>
            <p style={{ fontSize: "0.825rem", color: "#64748b", marginBottom: "1rem" }}>
              Tarea: <strong>{tareaParaReportar.titulo}</strong>
            </p>

            <form onSubmit={handleEnviarReporteActividad}>
              <div className="form-group">
                <label className="form-label">
                  ¿A quién deseas enviar este reporte o mensaje?
                </label>
                <select
                  value={formReporteTutor.destinatario_reporte_tutor}
                  onChange={(e) =>
                    setFormReporteTutor({
                      ...formReporteTutor,
                      destinatario_reporte_tutor: e.target.value,
                    })
                  }
                  className="form-select"
                >
                  <option value="AMBOS">A Ambos (Rol Docente y Rol Terapeuta)</option>
                  <option value="DOCENTE">Solo al Rol Docente</option>
                  <option value="TERAPEUTA">Solo al Rol Terapeuta</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  ¿Cómo estuvo la atención y regulación durante la actividad?
                </label>
                <select
                  value={formReporteTutor.nivel_atencion_hogar}
                  onChange={(e) =>
                    setFormReporteTutor({
                      ...formReporteTutor,
                      nivel_atencion_hogar: e.target.value,
                    })
                  }
                  className="form-select"
                >
                  <option value="ALTO_ENFOQUE">🟢 Alto Enfoque (Completó los pasos con entusiasmo)</option>
                  <option value="ENFOQUE_MODERADO">🟢 Enfoque Moderado (Completó la actividad con guía)</option>
                  <option value="REQUIRIO_PAUSAS">🟡 Requirió Pausas Activas adicionales</option>
                  <option value="DIFICULTAD_ALTA">🔴 Presentó fatiga o frustración (Necesita reajuste)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Mensaje o Reporte Detallado sobre cómo estuvo tu hijo en la actividad
                </label>
                <textarea
                  rows={4}
                  required
                  value={formReporteTutor.reporte_tutor}
                  onChange={(e) =>
                    setFormReporteTutor({
                      ...formReporteTutor,
                      reporte_tutor: e.target.value,
                    })
                  }
                  className="form-textarea"
                  placeholder="Cuenta cómo respondió a la adaptación TDAH, si le sirvió dividir en pasos cortos o usar el reloj visual..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setTareaParaReportar(null)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: "var(--familiar-color)" }}
                >
                  <Send size={16} />
                  <span>Enviar Reporte</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFamiliar;
