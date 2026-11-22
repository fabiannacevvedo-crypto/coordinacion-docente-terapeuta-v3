import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import { AlertaModal } from "../components/docente/AlertaModal.jsx";
import { CreadorPresentacionesAdaptadas } from "../components/docente/CreadorPresentacionesAdaptadas.jsx";
import { ChatCoordinacion } from "../components/common/ChatCoordinacion.jsx";
import {
  GraduationCap,
  Users,
  Bell,
  PlusCircle,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Send,
  UserPlus,
  ClipboardList,
  Brain,
  Sliders,
  Volume2,
  Sun,
  Clock,
  Activity,
} from "lucide-react";

export const DashboardDocente = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [filtroSemaforo, setFiltroSemaforo] = useState("TODOS");

  // Radar de Clima Sensorial y Ejecutivo del Aula (Nueva funcionalidad visual y comunicativa para Docente)
  const [climaAula, setClimaAula] = useState({
    nivelRuido: "MODULADO",
    cargaVisual: "DESPEJADA",
    faseClase: "BLOQUE_FOCO_CORTO",
    tiempoFocoMin: 10,
  });

  // Modales
  const [modalAlertaOpen, setModalAlertaOpen] = useState(false);
  const [modalReporteOpen, setModalReporteOpen] = useState(false);
  const [modalNuevoAlumnoOpen, setModalNuevoAlumnoOpen] = useState(false);
  const [modalNuevaTareaOpen, setModalNuevaTareaOpen] = useState(false);

  // Formulario nuevo alumno (orientado a TDAH)
  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: "",
    apellido: "",
    sala_grado: "Sala de 5 Años - Turno Mañana",
    turno: "MAÑANA",
    semaforo_actual: "VERDE",
    diagnostico: "TDAH Presentación Combinada (Atención Ejecutiva e Impulsividad)",
    observaciones: "Requiere consignas micro-segmentadas (Chunking), apoyos visuales y bloques cortos con pausas activas.",
  });

  // Formulario asignar tarea (En conjunto o a cada alumno en particular -> va al Terapeuta antes de ir al Tutor)
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    consigna_original: "",
    tipo_asignacion: "INDIVIDUAL",
    alumno_id: "",
    subtipo_tdah_objetivo: "TDAH Combinado (Inatención + Impulsividad)",
    fecha_entrega: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
  });

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
  const [mensajeExito, setMensajeExito] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resAlumnos, resAlertas, resReportes, resTareas] = await Promise.all([
        api.getAlumnos(),
        api.getAlertas("estado=PENDIENTE"),
        api.getReportes(),
        api.getTareas(),
      ]);

      if (resAlumnos.ok) setAlumnos(resAlumnos.alumnos);
      if (resAlertas.ok) setAlertas(resAlertas.alertas);
      if (resReportes.ok) setReportes(resReportes.reportes);
      if (resTareas.ok) setTareas(resTareas.tareas);
    } catch (err) {
      console.error("Error al cargar datos del aula docente:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarNotificacion = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(null), 5000);
  };

  // Sincronizar Clima Sensorial del Aula con el Terapeuta y Tutor en 1 clic
  const sincronizarClimaAulaConEquipo = async () => {
    if (alumnos.length === 0) return;
    try {
      await api.enviarMensajeChat({
        alumno_id: alumnos[0].id,
        destinatario_rol: "TODOS",
        contenido: `Sincronización de Clima de Aula en Vivo: Acústica [${climaAula.nivelRuido}] · Entorno Visual [${climaAula.cargaVisual}] · Dinámica Actual [${climaAula.faseClase} - ${climaAula.tiempoFocoMin} min].`,
        tipo_mensaje: "CHAT",
      });
      mostrarNotificacion("Estado sensorial y dinámica del aula sincronizados en vivo con el Rol Terapeuta y Familiar / Tutor.");
    } catch (err) {
      console.error("Error sincronizando clima de aula:", err);
    }
  };

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

  // Registrar nuevo alumno en el aula
  const handleRegistrarAlumno = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createAlumno(nuevoAlumno);
      if (res.ok) {
        setModalNuevoAlumnoOpen(false);
        setNuevoAlumno({
          nombre: "",
          apellido: "",
          sala_grado: "Sala de 5 Años - Turno Mañana",
          turno: "MAÑANA",
          semaforo_actual: "VERDE",
          diagnostico: "TDAH Presentación Combinada (Atención Ejecutiva e Impulsividad)",
          observaciones: "Requiere consignas micro-segmentadas (Chunking), apoyos visuales y bloques cortos con pausas activas.",
        });
        mostrarNotificacion(`Alumno registrado con éxito. Código de vinculación familiar: ${res.alumno?.codigo_familiar}`);
        cargarDatos();
      }
    } catch (err) {
      alert(err.message || "Error al registrar el alumno");
    }
  };

  // Asignar tarea (en conjunto o individual) y enviarla primero al Terapeuta para adaptación TDAH
  const handleCrearTarea = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...nuevaTarea,
        alumnos_ids: nuevaTarea.tipo_asignacion === "CONJUNTO" ? alumnos.map((a) => a.id) : undefined,
      };
      const res = await api.createTarea(payload);
      if (res.ok) {
        setModalNuevaTareaOpen(false);
        setNuevaTarea({
          titulo: "",
          consigna_original: "",
          tipo_asignacion: "INDIVIDUAL",
          alumno_id: "",
          subtipo_tdah_objetivo: "TDAH Combinado (Inatención + Impulsividad)",
          fecha_entrega: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
        });
        mostrarNotificacion(res.mensaje);
        cargarDatos();
      }
    } catch (err) {
      alert(err.message || "Error al enviar la tarea al terapeuta");
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
        mostrarNotificacion("Observación registrada en la bitácora compartida.");
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
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-docente">Rol Docente</span>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Gestión Pedagógica y Neuroeducativa TDAH</span>
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
            Tablero del Docente y Coordinación con Terapeuta
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Registro de alumnos, creación de presentaciones adaptadas, envío de tareas para adaptación TDAH y comunicación en tiempo real
          </p>
        </div>

        {/* Botones de Acción del Docente */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setModalNuevoAlumnoOpen(true)}
            className="btn btn-primary"
            style={{ background: "#059669" }}
          >
            <UserPlus size={17} />
            <span>Registrar Alumno</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (alumnos.length > 0 && !nuevaTarea.alumno_id) {
                setNuevaTarea((prev) => ({ ...prev, alumno_id: String(alumnos[0].id) }));
              }
              setModalNuevaTareaOpen(true);
            }}
            className="btn btn-primary"
            style={{ background: "#7c3aed" }}
          >
            <ClipboardList size={17} />
            <span>Asignar Tarea (Enviar a Terapeuta)</span>
          </button>

          <button
            type="button"
            onClick={() => setModalAlertaOpen(true)}
            className="btn btn-primary"
            style={{ background: "#ef4444" }}
          >
            <AlertTriangle size={17} />
            <span>Aviso Rápido al AT</span>
          </button>

          <button
            type="button"
            onClick={() => setModalReporteOpen(true)}
            className="btn btn-primary"
          >
            <PlusCircle size={17} />
            <span>Nueva Observación</span>
          </button>
        </div>
      </div>

      {mensajeExito && (
        <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
          <CheckCircle2 size={18} />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* NUEVO MÓDULO INTERACTIVO DOCENTE: RADAR DE CLIMA SENSORIAL Y DINÁMICA DEL AULA EN VIVO */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)",
          border: "1px solid #bfdbfe",
          marginBottom: "1.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ background: "#2563eb", color: "white", padding: "0.5rem", borderRadius: "10px" }}>
              <Activity size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#0f172a" }}>
                Radar de Clima Sensorial y Dinámica Ejecutiva del Aula
              </h3>
              <p style={{ fontSize: "0.78rem", color: "#475569" }}>
                Ajusta las variables ambientales de la sala y transmítelas en vivo al Rol Terapeuta para anticipar apoyos TDAH
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={sincronizarClimaAulaConEquipo}
            className="btn btn-primary btn-sm"
          >
            <Send size={14} />
            <span>Transmitir Estado del Aula al Terapeuta y Tutor</span>
          </button>
        </div>

        <div className="grid-3">
          <div style={{ background: "white", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Volume2 size={15} color="#2563eb" />
              <span>Nivel Acústico de la Sala</span>
            </div>
            <select
              value={climaAula.nivelRuido}
              onChange={(e) => setClimaAula({ ...climaAula, nivelRuido: e.target.value })}
              className="form-select"
              style={{ fontSize: "0.82rem", padding: "0.45rem" }}
            >
              <option value="SILENCIO_FOCO">Silencio de Enfoque (Ideal Memoria de Trabajo)</option>
              <option value="MODULADO">Murmullo Modulado de Trabajo Grupal</option>
              <option value="ALTO_ESTIMULO">Alto Estímulo Sonoro (Sugerir Filtro Auditivo)</option>
            </select>
          </div>

          <div style={{ background: "white", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Sun size={15} color="#7c3aed" />
              <span>Carga de Estímulos Visuales</span>
            </div>
            <select
              value={climaAula.cargaVisual}
              onChange={(e) => setClimaAula({ ...climaAula, cargaVisual: e.target.value })}
              className="form-select"
              style={{ fontSize: "0.82rem", padding: "0.45rem" }}
            >
              <option value="DESPEJADA">Mesas Despejadas · 1 Material Único (TDAH)</option>
              <option value="APOYO_PICTOGRAFICO">Pizarrón con Secuencia Pictográfica Activa</option>
              <option value="TRANSICION_PATIO">Transición hacia Patio / Espacio Abierto</option>
            </select>
          </div>

          <div style={{ background: "white", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Clock size={15} color="#059669" />
              <span>Modalidad de Bloque Pedagógico</span>
            </div>
            <select
              value={climaAula.faseClase}
              onChange={(e) => setClimaAula({ ...climaAula, faseClase: e.target.value })}
              className="form-select"
              style={{ fontSize: "0.82rem", padding: "0.45rem" }}
            >
              <option value="BLOQUE_FOCO_CORTO">Misión Corta Micro-segmentada (10 min)</option>
              <option value="PAUSA_KINESTESICA">Pausa Kinestésica y Descarga Motriz (3 min)</option>
              <option value="CIERRE_METACOGNITIVO">Cierre y Refuerzo con Economía de Fichas</option>
            </select>
          </div>
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
            <span>Avisos y Alertas Activas del Aula ({alertas.length})</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {alertas.slice(0, 4).map((al) => (
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

      {/* SECCIÓN 1: CREACIÓN DE PRESENTACIONES ADAPTADAS PARA EL ALUMNO */}
      <CreadorPresentacionesAdaptadas alumnos={alumnos} />

      {/* SECCIÓN 2: SEGUIMIENTO DEL CIRCUITO DE TAREAS (Docente -> Terapeuta adapta TDAH -> Tutor recibe y reporta) */}
      <div className="card" style={{ borderTop: "4px solid var(--docente-color)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ClipboardList size={22} color="var(--docente-color)" />
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#0f172a" }}>
                Estado de Tareas Asignadas y Adaptaciones TDAH
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Las tareas creadas se envían primero al Rol Terapeuta para su adaptación TDAH antes de ser entregadas al Familiar / Tutor
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (alumnos.length > 0 && !nuevaTarea.alumno_id) {
                setNuevaTarea((prev) => ({ ...prev, alumno_id: String(alumnos[0].id) }));
              }
              setModalNuevaTareaOpen(true);
            }}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={15} />
            <span>Crear Tarea (Individual o en Conjunto)</span>
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {tareas.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: "0.85rem" }}>No hay tareas registradas aún.</div>
          ) : (
            tareas.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: "800", fontSize: "1rem", color: "#0f172a" }}>{t.titulo}</span>
                    <span className="badge" style={{ background: "#e0e7ff", color: "#3730a3", fontSize: "0.7rem" }}>
                      {t.tipo_asignacion === "CONJUNTO" ? "Asignación en Conjunto" : "Asignación Individual"}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#475569" }}>
                      · Alumno: <strong>{t.alumno?.nombre} {t.alumno?.apellido}</strong>
                    </span>
                  </div>

                  {t.estado === "PENDIENTE_TERAPEUTA" && (
                    <span className="badge" style={{ background: "#fef3c7", color: "#92400e" }}>
                      En Gabinete Terapeuta (Pendiente de Adaptación TDAH)
                    </span>
                  )}
                  {t.estado === "ADAPTADA_ENVIADA_TUTOR" && (
                    <span className="badge" style={{ background: "#dbeafe", color: "#1e40af" }}>
                      Adaptada por Terapeuta · Enviada al Tutor
                    </span>
                  )}
                  {t.estado === "COMPLETADA_POR_TUTOR" && (
                    <span className="badge" style={{ background: "#d1fae5", color: "#065f46" }}>
                      Completada con Reporte del Tutor
                    </span>
                  )}
                </div>

                <div style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.5rem" }}>
                  <strong>Consigna Original del Docente:</strong> {t.consigna_original}
                </div>

                {t.adaptacion_terapeuta && (
                  <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", padding: "0.75rem", borderRadius: "8px", fontSize: "0.825rem", color: "#4c1d95", marginBottom: "0.5rem", whiteSpace: "pre-line" }}>
                    <strong>Adaptación TDAH realizada por Rol Terapeuta ({t.pautas_tdah_aplicadas}):</strong>
                    <div style={{ marginTop: "0.25rem" }}>{t.adaptacion_terapeuta}</div>
                  </div>
                )}

                {t.reporte_tutor && (
                  <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.75rem", borderRadius: "8px", fontSize: "0.825rem", color: "#065f46" }}>
                    <strong>Devolución del Familiar / Tutor (Dirigido a: {t.destinatario_reporte_tutor}):</strong> {t.reporte_tutor}
                    <span style={{ marginLeft: "0.5rem", fontWeight: "700" }}>[{t.nivel_atencion_hogar}]</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECCIÓN 3: ALUMNOS EN SEGUIMIENTO Y SEMÁFORO EN VIVO */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: "800", color: "#0f172a" }}>Alumnos Registrados en Sala ({alumnos.length}):</span>
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
      </div>

      <div className="grid-3" style={{ marginBottom: "2.5rem" }}>
        {alumnosFiltrados.map((alumno) => (
          <div key={alumno.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>
                  {alumno.nombre} {alumno.apellido}
                </h3>
                <span style={{ fontSize: "0.725rem", background: "#f1f5f9", padding: "0.2rem 0.5rem", borderRadius: "6px", color: "#64748b" }}>
                  {alumno.sala_grado}
                </span>
              </div>

              <div style={{ marginBottom: "0.75rem" }}>
                <SemaforoBadge estado={alumno.semaforo_actual} />
              </div>

              <p style={{ fontSize: "0.825rem", color: "#475569", lineHeight: 1.5, marginBottom: "0.75rem" }}>
                <strong>Perfil TDAH:</strong> {alumno.diagnostico || "En seguimiento neuroeducativo"}
              </p>

              {/* Selector interactivo de semáforo sin emojis */}
              <div style={{ background: "#f8fafc", padding: "0.6rem", borderRadius: "8px", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.725rem", fontWeight: "700", color: "#64748b", marginBottom: "0.35rem" }}>
                  Cambio Rápido de Estado en Aula:
                </div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button
                    onClick={() => cambiarSemaforoAlumno(alumno.id, "VERDE")}
                    style={{
                      flex: 1,
                      padding: "0.35rem",
                      borderRadius: "6px",
                      border: "none",
                      background: alumno.semaforo_actual === "VERDE" ? "#10b981" : "#e2e8f0",
                      color: alumno.semaforo_actual === "VERDE" ? "white" : "#475569",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Verde
                  </button>
                  <button
                    onClick={() => cambiarSemaforoAlumno(alumno.id, "AMARILLO")}
                    style={{
                      flex: 1,
                      padding: "0.35rem",
                      borderRadius: "6px",
                      border: "none",
                      background: alumno.semaforo_actual === "AMARILLO" ? "#f59e0b" : "#e2e8f0",
                      color: alumno.semaforo_actual === "AMARILLO" ? "white" : "#475569",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Amarillo
                  </button>
                  <button
                    onClick={() => cambiarSemaforoAlumno(alumno.id, "ROJO")}
                    style={{
                      flex: 1,
                      padding: "0.35rem",
                      borderRadius: "6px",
                      border: "none",
                      background: alumno.semaforo_actual === "ROJO" ? "#ef4444" : "#e2e8f0",
                      color: alumno.semaforo_actual === "ROJO" ? "white" : "#475569",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Rojo
                  </button>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--surface-border)", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Cód. Tutor: {alumno.codigo_familiar}</span>
              <Link to={`/alumnos/${alumno.id}`} style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "700" }}>
                Ver Legajo 360° →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN 4: CHAT CON PADRES Y TERAPEUTA EN TIEMPO REAL */}
      <div style={{ marginBottom: "2.5rem" }}>
        <ChatCoordinacion
          alumnos={alumnos}
          rolActual="DOCENTE"
          titulo="Chat en Tiempo Real con Padres / Tutores y Terapeuta"
        />
      </div>

      {/* SECCIÓN 5: BITÁCORA DE OBSERVACIONES */}
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
                <span>Emitido por: {rep.autor?.nombre} {rep.autor?.apellido}</span>
                <span>Fecha: {rep.fecha}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: REGISTRAR NUEVO ALUMNO */}
      {modalNuevoAlumnoOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.5rem" }}>
              Registrar Nuevo Alumno en el Aula
            </h3>
            <p style={{ fontSize: "0.825rem", color: "#64748b", marginBottom: "1rem" }}>
              Registra al alumno con su perfil de seguimiento TDAH para vincularlo automáticamente con el Terapeuta y el Tutor.
            </p>

            <form onSubmit={handleRegistrarAlumno}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Nombre / Identificador del Alumno</label>
                  <input
                    type="text"
                    required
                    value={nuevoAlumno.nombre}
                    onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })}
                    className="form-input"
                    placeholder="Ej: Alumno 4"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido / Referencia</label>
                  <input
                    type="text"
                    required
                    value={nuevoAlumno.apellido}
                    onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, apellido: e.target.value })}
                    className="form-input"
                    placeholder="Ej: (Seguimiento TDAH)"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Sala o Grado</label>
                  <input
                    type="text"
                    required
                    value={nuevoAlumno.sala_grado}
                    onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, sala_grado: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Turno</label>
                  <select
                    value={nuevoAlumno.turno}
                    onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, turno: e.target.value })}
                    className="form-select"
                  >
                    <option value="MAÑANA">Mañana</option>
                    <option value="TARDE">Tarde</option>
                    <option value="JORNADA_COMPLETA">Jornada Completa</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Perfil Clínico / Subtipo de TDAH</label>
                <select
                  value={nuevoAlumno.diagnostico}
                  onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, diagnostico: e.target.value })}
                  className="form-select"
                >
                  <option value="TDAH Presentación Combinada (Atención Ejecutiva e Impulsividad)">
                    TDAH Presentación Combinada (Atención Ejecutiva e Impulsividad)
                  </option>
                  <option value="TDAH con Predominio de Déficit de Atención (Fatiga en Memoria de Trabajo)">
                    TDAH con Predominio de Déficit de Atención (Fatiga en Memoria de Trabajo)
                  </option>
                  <option value="TDAH con Predominio Hiperactivo-Impulsivo (Necesidad de Descarga Motriz)">
                    TDAH con Predominio Hiperactivo-Impulsivo (Necesidad de Descarga Motriz)
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pautas Iniciales de Observación en Sala</label>
                <textarea
                  rows={3}
                  value={nuevoAlumno.observaciones}
                  onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, observaciones: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button type="button" onClick={() => setModalNuevoAlumnoOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: "#059669" }}>
                  Guardar Alumno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASIGNAR TAREA (EN CONJUNTO O INDIVIDUAL -> SE ENVÍA AL TERAPEUTA ANTES QUE AL TUTOR) */}
      {modalNuevaTareaOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "0.35rem" }}>
              Asignar Tarea Escolar (Envío Previo al Terapeuta)
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "1rem" }}>
              Puedes asignar la tarea a toda la sala en conjunto o a un alumno en particular. Antes de llegar al Padre/Tutor, será enviada al <strong>Rol Terapeuta</strong> para que la adapte según las pautas TDAH requeridas.
            </p>

            <form onSubmit={handleCrearTarea}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Modalidad de Asignación</label>
                  <select
                    value={nuevaTarea.tipo_asignacion}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, tipo_asignacion: e.target.value })}
                    className="form-select"
                  >
                    <option value="INDIVIDUAL">A un Alumno en Particular</option>
                    <option value="CONJUNTO">En Conjunto (A todos los alumnos de la sala)</option>
                  </select>
                </div>

                {nuevaTarea.tipo_asignacion === "INDIVIDUAL" ? (
                  <div className="form-group">
                    <label className="form-label">Seleccionar Alumno</label>
                    <select
                      required
                      value={nuevaTarea.alumno_id}
                      onChange={(e) => setNuevaTarea({ ...nuevaTarea, alumno_id: e.target.value })}
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
                ) : (
                  <div className="form-group">
                    <label className="form-label">Alcance Grupal</label>
                    <input
                      type="text"
                      readOnly
                      value={`Se asignará a los ${alumnos.length} alumnos registrados`}
                      className="form-input"
                      style={{ background: "#f8fafc", color: "#475569" }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Título de la Actividad / Tarea</label>
                <input
                  type="text"
                  required
                  value={nuevaTarea.titulo}
                  onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
                  className="form-input"
                  placeholder="Ej: Asociación de Números y Figuras con Materiales"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consigna Pedagógica Original (Para que el Terapeuta la adapte a TDAH)</label>
                <textarea
                  rows={3}
                  required
                  value={nuevaTarea.consigna_original}
                  onChange={(e) => setNuevaTarea({ ...nuevaTarea, consigna_original: e.target.value })}
                  className="form-textarea"
                  placeholder="Describe la actividad completa que deseas trabajar..."
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Objetivo de Apoyo TDAH Solicitado</label>
                  <select
                    value={nuevaTarea.subtipo_tdah_objetivo}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, subtipo_tdah_objetivo: e.target.value })}
                    className="form-select"
                  >
                    <option value="TDAH Combinado (Inatención + Impulsividad)">
                      TDAH Combinado (Micro-segmentación + Pausa Activa)
                    </option>
                    <option value="TDAH Predominio Inatento (Sostén de Memoria de Trabajo)">
                      TDAH Predominio Inatento (Apoyo Visual y Paso Único)
                    </option>
                    <option value="TDAH Predominio Hiperactivo-Impulsivo (Control Motor)">
                      TDAH Predominio Hiperactivo (Manipulación Kinestésica + Reloj Visual)
                    </option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha Sugerida</label>
                  <input
                    type="date"
                    value={nuevaTarea.fecha_entrega}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, fecha_entrega: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button type="button" onClick={() => setModalNuevaTareaOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: "#7c3aed" }}>
                  <Send size={16} />
                  <span>Enviar al Terapeuta para Adaptación TDAH</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                    <option value="VERDE">Verde (Regulado / En Foco)</option>
                    <option value="AMARILLO">Amarillo (Inquieto / Alerta)</option>
                    <option value="ROJO">Rojo (Desregulado / Pausa)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Título Breve</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Actividad con bloques y reloj visual"
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
                <label className="form-label">Estrategia Neuroeducativa TDAH Aplicada</label>
                <input
                  type="text"
                  placeholder="Ej: Micro-segmentación en 3 pasos cortos y refuerzo inmediato"
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
