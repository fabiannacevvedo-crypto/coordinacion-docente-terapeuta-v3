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
  Clock,
  Brain,
  Activity,
  Star,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const DashboardFamiliar = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(null);

  // Estado de Rutina del Hogar (Nueva funcionalidad comunicativa Hogar -> Aula y Gabinete)
  const [rutinaHogar, setRutinaHogar] = useState({
    descanso: "Descanso Completo y Reparador",
    disposicionMatutina: "Motivado y con Foco Activo",
    preparacionSensorial: "Desayuno tranquilo sin pantallas previas",
  });

  // Checklist interactivo por tarea en el hogar
  const [checksHogar, setChecksHogar] = useState({});

  // Visor interactivo de Presentaciones Adaptadas en el portal familiar
  const [presSeleccionada, setPresSeleccionada] = useState(null);
  const [slideFamiliarIdx, setSlideFamiliarIdx] = useState(0);

  // Modal para reportar cómo estuvo el hijo en una actividad
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
      if (resPres.ok) {
        setPresentaciones(resPres.presentaciones);
        if (resPres.presentaciones.length > 0 && !presSeleccionada) {
          setPresSeleccionada(resPres.presentaciones[0]);
        }
      }
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

  const mostrarNotificacion = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(null), 5000);
  };

  const compartirEstadoHogarConEquipo = async () => {
    if (!alumno) return;
    try {
      await api.enviarMensajeChat({
        alumno_id: alumno.id,
        destinatario_rol: "TODOS",
        contenido: `Reporte Matutino desde el Hogar: Sueño [${rutinaHogar.descanso}] · Disposición [${rutinaHogar.disposicionMatutina}] · Rutina previa [${rutinaHogar.preparacionSensorial}].`,
        tipo_mensaje: "AVISO_FAMILIA",
      });
      mostrarNotificacion("Estado matutino del hogar enviado en tiempo real al Rol Docente y al Rol Terapeuta.");
    } catch (err) {
      console.error("Error enviando estado del hogar:", err);
    }
  };

  const toggleCheckPasoHogar = (tareaId, pasoIdx) => {
    const key = `${tareaId}-${pasoIdx}`;
    setChecksHogar((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEnviarReporteActividad = async (e) => {
    e.preventDefault();
    if (!tareaParaReportar) return;
    try {
      const res = await api.reportarTareaTutor(tareaParaReportar.id, formReporteTutor);
      if (res.ok) {
        setTareaParaReportar(null);
        mostrarNotificacion(res.mensaje);
        cargar();
      }
    } catch (err) {
      alert("Error al enviar el reporte: " + err.message);
    }
  };

  const tareasVisiblesTutor = tareas.filter(
    (t) => t.estado === "ADAPTADA_ENVIADA_TUTOR" || t.estado === "COMPLETADA_POR_TUTOR"
  );

  // Medallas e insignias gamificadas orientadas a logros en TDAH (Con iconos Lucide limpios, sin emojis)
  const medallas = [
    { titulo: "Súper Enfoque Visual", desc: "Completó los 3 pasos cortos siguiendo el reloj visual sin frustrarse", Icono: Clock, color: "#f59e0b", bg: "#fffbeb" },
    { titulo: "Autoinstrucción Estrella", desc: "Aplicó 'Paro, miro y pienso' antes de comenzar la actividad", Icono: Brain, color: "#8b5cf6", bg: "#f5f3ff" },
    { titulo: "Pausa Activa Exitosa", desc: "Canalizó la energía con movimiento guiado y volvió a la calma", Icono: Activity, color: "#10b981", bg: "#ecfdf5" },
    { titulo: "Misión en Equipo", desc: "Compartió materiales y celebró cada logro alcanzado", Icono: Star, color: "#3b82f6", bg: "#eff6ff" },
  ];

  const slidesPresFamiliar = React.useMemo(() => {
    if (!presSeleccionada) return [];
    try {
      return JSON.parse(presSeleccionada.diapositivas_json || "[]");
    } catch {
      return [];
    }
  }, [presSeleccionada]);

  const currentSlideFam = slidesPresFamiliar[slideFamiliarIdx] || null;

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
              marginBottom: "1.75rem",
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

          {/* NUEVA FUNCIONALIDAD COMUNICATIVA TUTOR: SINCRONIZADOR DE RUTINA DEL HOGAR HACIA DOCENTE Y TERAPEUTA */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #ecfdf5 0%, #f8fafc 100%)",
              border: "1px solid #a7f3d0",
              marginBottom: "2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ background: "var(--familiar-color)", color: "white", padding: "0.5rem", borderRadius: "10px" }}>
                  <Home size={19} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#0f172a" }}>
                    Sincronizador Matutino del Hogar con el Aula y el Gabinete
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#475569" }}>
                    Informa en 1 clic al Docente y al Terapeuta cómo descansó y cómo inicia la jornada tu hijo para anticipar apoyos TDAH
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={compartirEstadoHogarConEquipo}
                className="btn btn-primary btn-sm"
                style={{ background: "var(--familiar-color)" }}
              >
                <Send size={14} />
                <span>Compartir Estado del Hogar con Docente y Terapeuta</span>
              </button>
            </div>

            <div className="grid-3">
              <div style={{ background: "white", padding: "0.8rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: "800", color: "#1e293b", display: "block", marginBottom: "0.35rem" }}>
                  Calidad del Sueño / Descanso
                </label>
                <select
                  value={rutinaHogar.descanso}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, descanso: e.target.value })}
                  className="form-select"
                  style={{ fontSize: "0.8rem", padding: "0.45rem" }}
                >
                  <option value="Descanso Completo y Reparador">Descanso Completo y Reparador</option>
                  <option value="Sueño Intermitente (Sugerir Pausas)">Sueño Intermitente (Sugerir Pausas)</option>
                  <option value="Despertar Temprano con Inquietud">Despertar Temprano con Inquietud</option>
                </select>
              </div>

              <div style={{ background: "white", padding: "0.8rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: "800", color: "#1e293b", display: "block", marginBottom: "0.35rem" }}>
                  Disposición y Foco Matutino
                </label>
                <select
                  value={rutinaHogar.disposicionMatutina}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, disposicionMatutina: e.target.value })}
                  className="form-select"
                  style={{ fontSize: "0.8rem", padding: "0.45rem" }}
                >
                  <option value="Motivado y con Foco Activo">Motivado y con Foco Activo</option>
                  <option value="Energía Alta / Necesita Descarga Motriz">Energía Alta / Necesita Descarga Motriz</option>
                  <option value="Sensible a Ruidos / Requiere Anticipación">Sensible a Ruidos / Requiere Anticipación</option>
                </select>
              </div>

              <div style={{ background: "white", padding: "0.8rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: "800", color: "#1e293b", display: "block", marginBottom: "0.35rem" }}>
                  Preparación Sensorial en Casa
                </label>
                <select
                  value={rutinaHogar.preparacionSensorial}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, preparacionSensorial: e.target.value })}
                  className="form-select"
                  style={{ fontSize: "0.8rem", padding: "0.45rem" }}
                >
                  <option value="Desayuno tranquilo sin pantallas previas">Desayuno tranquilo sin pantallas previas</option>
                  <option value="Se anticipó la rutina escolar con pictogramas">Se anticipó la rutina escolar con pictogramas</option>
                  <option value="Lleva auriculares atenuadores en la mochila">Lleva auriculares atenuadores en la mochila</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECCIÓN PRINCIPAL: TAREAS ENVIADAS Y ADAPTACIONES TDAH REALIZADAS */}
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
                    Cada actividad incluye la consigna del Docente, la adaptación paso a paso del Terapeuta, un checklist interactivo y el botón para enviar tu reporte
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
                      {/* Cabecera de la Tarea */}
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
                            ? "Actividad Completada y Reportada"
                            : "Lista para Realizar en Casa"}
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
                        <div style={{ fontSize: "0.825rem", fontWeight: "800", color: "#6d28d9", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <Brain size={16} />
                          <span>Pautas y Adaptación Realizada para TDAH ({t.pautas_tdah_aplicadas}):</span>
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#1e293b", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                          {t.adaptacion_terapeuta}
                        </div>
                        {t.recursos_apoyo && (
                          <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "#0284c7", fontWeight: "700" }}>
                            Recursos de apoyo sugeridos: {t.recursos_apoyo}
                          </div>
                        )}

                        {/* Checklist Interactivo de Micro-Pasos en el Hogar */}
                        <div style={{ marginTop: "0.85rem", paddingTop: "0.75rem", borderTop: "1px dashed #cbd5e1" }}>
                          <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#475569", marginBottom: "0.45rem" }}>
                            Progreso Interactivo en Casa (Marca cada micro-paso al realizarlo con tu hijo):
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {["Paso 1: Preparación sin distractores", "Paso 2: Misión corta con reloj", "Pausa Activa de 2 min", "Paso 3: Cierre y Estrella"].map((labelPaso, idxP) => {
                              const checked = Boolean(checksHogar[`${t.id}-${idxP}`]);
                              return (
                                <button
                                  key={idxP}
                                  type="button"
                                  onClick={() => toggleCheckPasoHogar(t.id, idxP)}
                                  style={{
                                    padding: "0.35rem 0.7rem",
                                    borderRadius: "8px",
                                    border: `1px solid ${checked ? "#10b981" : "#cbd5e1"}`,
                                    background: checked ? "#ecfdf5" : "#f8fafc",
                                    color: checked ? "#065f46" : "#475569",
                                    fontSize: "0.75rem",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                  }}
                                >
                                  <CheckCircle2 size={14} color={checked ? "#10b981" : "#94a3b8"} />
                                  <span>{labelPaso}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Reporte del Tutor si ya fue enviado, o botón para enviar */}
                      {t.reporte_tutor && (
                        <div style={{ background: "#ecfdf5", border: "1px solid #10b981", padding: "0.85rem", borderRadius: "10px", marginBottom: "0.85rem", fontSize: "0.85rem", color: "#065f46" }}>
                          <div>
                            <strong>Tu reporte enviado (Destinatario elegido: {t.destinatario_reporte_tutor === "AMBOS" ? "Docente y Terapeuta" : t.destinatario_reporte_tutor}):</strong>
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

          {/* Carrusel Interactivo de Presentaciones Adaptadas Compartidas por el Docente */}
          {presentaciones.length > 0 && (
            <div className="card" style={{ marginBottom: "2rem", borderTop: "4px solid #7c3aed" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Presentation size={20} color="#7c3aed" />
                  <div>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#0f172a" }}>
                      Visor Familiar de Presentaciones Adaptadas (Compartidas por el Docente)
                    </h3>
                    <p style={{ fontSize: "0.78rem", color: "#64748b" }}>
                      Recorre en casa las mismas diapositivas de bajo estímulo distractor trabajadas en el aula
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                  {presentaciones.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPresSeleccionada(p);
                        setSlideFamiliarIdx(0);
                      }}
                      className="btn btn-sm"
                      style={{
                        background: presSeleccionada?.id === p.id ? "#7c3aed" : "#f1f5f9",
                        color: presSeleccionada?.id === p.id ? "white" : "#334155",
                      }}
                    >
                      {p.titulo}
                    </button>
                  ))}
                </div>
              </div>

              {presSeleccionada && currentSlideFam && (
                <div
                  style={{
                    background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
                    color: "white",
                    borderRadius: "14px",
                    padding: "1.35rem 1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <span style={{ background: "#7c3aed", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "800" }}>
                      {presSeleccionada.perfil_sensorial_tdah}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: "700" }}>
                      Diapositiva {slideFamiliarIdx + 1} de {slidesPresFamiliar.length}
                    </span>
                  </div>

                  <h4 style={{ fontSize: "1.35rem", fontWeight: "900", marginBottom: "0.4rem" }}>
                    {currentSlideFam.titulo}
                  </h4>
                  <p style={{ fontSize: "1rem", color: "#e2e8f0", marginBottom: "1rem", lineHeight: 1.55 }}>
                    {currentSlideFam.instruccion}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.78rem", color: "#6ee7b7", fontWeight: "700" }}>
                      Apoyo: {currentSlideFam.apoyo_visual}
                    </span>
                    <div style={{ display: "flex", gap: "0.45rem" }}>
                      <button
                        type="button"
                        onClick={() =>
                          setSlideFamiliarIdx(
                            (prev) => (prev - 1 + slidesPresFamiliar.length) % slidesPresFamiliar.length
                          )
                        }
                        className="btn btn-sm"
                        style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
                      >
                        <ChevronLeft size={15} /> Anterior
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSlideFamiliarIdx((prev) => (prev + 1) % slidesPresFamiliar.length)
                        }
                        className="btn btn-sm"
                        style={{ background: "#10b981", color: "white" }}
                      >
                        Siguiente <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Medallero de Logros Desbloqueados (Sin Emojis, con Iconos Lucide) */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Award size={22} color="#f59e0b" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a" }}>
                Insignias de Logros Alcanzados esta Semana
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {medallas.map((m, idx) => {
                const IconComp = m.Icono;
                return (
                  <div
                    key={idx}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "1.1rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: m.bg,
                        color: m.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 0.6rem auto",
                      }}
                    >
                      <IconComp size={22} />
                    </div>
                    <div style={{ fontWeight: "800", fontSize: "0.95rem", color: "#0f172a" }}>{m.titulo}</div>
                    <div style={{ fontSize: "0.775rem", color: "#64748b", marginTop: "0.25rem" }}>{m.desc}</div>
                  </div>
                );
              })}
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
                        Pauta TDAH aplicada: {rep.estrategia_utilizada}
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
                  <option value="ALTO_ENFOQUE">Alto Enfoque (Completó los pasos con entusiasmo)</option>
                  <option value="ENFOQUE_MODERADO">Enfoque Moderado (Completó la actividad con guía)</option>
                  <option value="REQUIRIO_PAUSAS">Requirió Pausas Activas adicionales</option>
                  <option value="DIFICULTAD_ALTA">Presentó fatiga o frustración (Necesita reajuste)</option>
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
