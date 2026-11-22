import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import { SensoryToolbox } from "../components/terapeuta/SensoryToolbox.jsx";
import { ChatCoordinacion } from "../components/common/ChatCoordinacion.jsx";
import {
  Stethoscope,
  Bell,
  CheckCircle2,
  ArrowRight,
  Brain,
  ClipboardCheck,
  Send,
  Sliders,
  Zap,
  Users,
  GraduationCap,
} from "lucide-react";

export const DashboardTerapeuta = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(null);

  // Modal de Adaptación de Tarea TDAH
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [formAdaptacion, setFormAdaptacion] = useState({
    subtipo_tdah_objetivo: "TDAH Combinado (Inatención + Impulsividad)",
    pautas_tdah_aplicadas:
      "Micro-segmentación en 3 pasos cortos (Chunking) + Temporizador Visual Pomodoro (5 min) + Pausa Kinestésica",
    adaptacion_terapeuta: "",
    recursos_apoyo: "Secuencia visual paso a paso + Reloj visual de 5 min + Tablero de estrellas",
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resAlumnos, resAlertas, resTareas] = await Promise.all([
        api.getAlumnos(),
        api.getAlertas(),
        api.getTareas(),
      ]);

      if (resAlumnos.ok) setAlumnos(resAlumnos.alumnos);
      if (resAlertas.ok) setAlertas(resAlertas.alertas);
      if (resTareas.ok) setTareas(resTareas.tareas);
    } catch (e) {
      console.error("Error cargando gabinete terapeuta:", e);
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

  const atenderAlerta = async (id) => {
    try {
      await api.atenderAlerta(id);
      setAlertas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, estado: "ATENDIDA" } : a))
      );
    } catch (e) {
      console.error("Error atendiendo alerta:", e);
    }
  };

  // Emitir prescripción o pauta rápida en vivo hacia Docente o Tutor Familiar
  const emitirPautaClinicaEnVivo = async (texto, destinatario = "TODOS") => {
    if (alumnos.length === 0) return;
    try {
      await api.enviarMensajeChat({
        alumno_id: alumnos[0].id,
        destinatario_rol: destinatario,
        contenido: texto,
        tipo_mensaje: "PAUTA_TERAPEUTICA",
      });
      mostrarNotificacion(`Pauta clínica TDAH transmitida en tiempo real a: ${destinatario === "TODOS" ? "Docente y Tutor Familiar" : destinatario}.`);
    } catch (err) {
      console.error("Error emitiendo pauta:", err);
    }
  };

  const abrirModalAdaptacion = (tarea) => {
    setTareaSeleccionada(tarea);
    const textoSugerido =
      tarea.adaptacion_terapeuta ||
      `ADAPTACIÓN NEUROEDUCATIVA TDAH PARA "${tarea.titulo}":\n• PASO 1 (Preparación - 2 min): Despejar la mesa dejando únicamente el material de esta actividad para evitar distractores visuales.\n• PASO 2 (Misión Corta - 5 min): Realizar la primera mitad de la consigna ("${tarea.consigna_original.substring(
        0,
        70
      )}...") usando el Temporizador Visual.\n• PAUSA KINESTÉSICA (2 min): Estirar los brazos o caminar antes del último paso.\n• PASO 3 (Cierre y Logro - 4 min): Completar la actividad y otorgar 1 logro inmediato en el tablero de Economía de Fichas.`;

    setFormAdaptacion({
      subtipo_tdah_objetivo:
        tarea.subtipo_tdah_objetivo || "TDAH Combinado (Inatención + Impulsividad)",
      pautas_tdah_aplicadas:
        tarea.pautas_tdah_aplicadas ||
        "Micro-segmentación en 3 pasos cortos (Chunking) + Temporizador Visual Pomodoro + Pausa Kinestésica",
      adaptacion_terapeuta: textoSugerido,
      recursos_apoyo:
        tarea.recursos_apoyo ||
        "Temporizador visual de 5 min + Tarjetas de Autoinstrucciones de Meichenbaum",
    });
  };

  const aplicarPautaRapidaEnAdaptacion = (pauta) => {
    setFormAdaptacion((prev) => ({
      ...prev,
      pautas_tdah_aplicadas: prev.pautas_tdah_aplicadas.includes(pauta)
        ? prev.pautas_tdah_aplicadas
        : `${prev.pautas_tdah_aplicadas} + ${pauta}`,
    }));
  };

  const handleGuardarAdaptacion = async (e) => {
    e.preventDefault();
    if (!tareaSeleccionada) return;
    try {
      const res = await api.adaptarTarea(tareaSeleccionada.id, formAdaptacion);
      if (res.ok) {
        setTareaSeleccionada(null);
        mostrarNotificacion(
          "Tarea adaptada con pautas TDAH y enviada exitosamente al Portal del Familiar / Tutor."
        );
        cargarDatos();
      }
    } catch (err) {
      alert("Error al guardar adaptación: " + err.message);
    }
  };

  const tareasPendientes = tareas.filter((t) => t.estado === "PENDIENTE_TERAPEUTA");
  const tareasAdaptadas = tareas.filter((t) => t.estado !== "PENDIENTE_TERAPEUTA");

  return (
    <div>
      {/* Header Gabinete */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-terapeuta">Rol Terapeuta / AT</span>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
            Adaptación Curricular TDAH y Regulación Ejecutiva
          </span>
        </div>
        <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
          Gabinete Terapéutico y Adaptación de Tareas TDAH
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Recibe las tareas del Rol Docente, adáptalas según las pautas específicas de TDAH de cada alumno y envíalas al Familiar / Tutor
        </p>
      </div>

      {mensajeExito && (
        <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
          <CheckCircle2 size={18} />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* NUEVO MÓDULO VISUAL TERAPEUTA: PRESCRIPCIÓN RÁPIDA DE PAUTAS TDAH HACIA EL AULA Y EL HOGAR */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #f5f3ff 0%, #f8fafc 100%)",
          border: "1px solid #ddd6fe",
          marginBottom: "1.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <div style={{ background: "var(--terapeuta-color)", color: "white", padding: "0.5rem", borderRadius: "10px" }}>
              <Zap size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: "900", color: "#0f172a" }}>
                Emisor Instantáneo de Pautas Clínicas TDAH (Aula y Hogar)
              </h3>
              <p style={{ fontSize: "0.78rem", color: "#475569" }}>
                Envía recomendaciones ejecutivas inmediatas en 1 clic al Rol Docente o al Familiar / Tutor
              </p>
            </div>
          </div>
        </div>

        <div className="grid-3">
          <button
            type="button"
            onClick={() =>
              emitirPautaClinicaEnVivo(
                "Sugerencia Clínica al Aula: Activar pausa kinestésica de 2 minutos y encargo motor antes del próximo bloque.",
                "DOCENTE"
              )
            }
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: "flex-start", textAlign: "left", padding: "0.65rem 0.85rem", borderLeft: "4px solid #2563eb" }}
          >
            <GraduationCap size={16} color="#2563eb" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "0.78rem" }}>Sugerir a Docente: Pausa Kinestésica en Sala</span>
          </button>

          <button
            type="button"
            onClick={() =>
              emitirPautaClinicaEnVivo(
                "Sugerencia Clínica al Aula: Reducir estímulos visuales en mesa y presentar solo el Paso 1 con reloj visual.",
                "DOCENTE"
              )
            }
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: "flex-start", textAlign: "left", padding: "0.65rem 0.85rem", borderLeft: "4px solid #7c3aed" }}
          >
            <Brain size={16} color="#7c3aed" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "0.78rem" }}>Sugerir a Docente: Micro-segmentación y Foco</span>
          </button>

          <button
            type="button"
            onClick={() =>
              emitirPautaClinicaEnVivo(
                "Pauta para el Hogar: Realizar la tarea en bloques de 5 minutos con el reloj visual y reforzar cada paso con 1 estrella.",
                "FAMILIAR"
              )
            }
            className="btn btn-secondary btn-sm"
            style={{ justifyContent: "flex-start", textAlign: "left", padding: "0.65rem 0.85rem", borderLeft: "4px solid #059669" }}
          >
            <Users size={16} color="#059669" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "0.78rem" }}>Sugerir a Tutor: Bloques de 5 min en Casa</span>
          </button>
        </div>
      </div>

      {/* SECCIÓN PRINCIPAL: BANDEJA DE TAREAS ENVIADAS POR EL DOCENTE PARA ADAPTACIÓN TDAH */}
      <div className="card" style={{ borderTop: "4px solid var(--terapeuta-color)", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div style={{ background: "var(--terapeuta-bg)", padding: "0.55rem", borderRadius: "10px", color: "var(--terapeuta-color)" }}>
              <ClipboardCheck size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#0f172a" }}>
                Bandeja de Tareas para Adaptar a TDAH (Previo al Envío al Tutor)
              </h2>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Adapta las consignas aplicando micro-segmentación, apoyos visuales y tiempos de enfoque según el requerimiento del alumno
              </p>
            </div>
          </div>

          <span className="badge" style={{ background: "#fef3c7", color: "#92400e", fontSize: "0.8rem" }}>
            {tareasPendientes.length} Pendientes de Adaptar
          </span>
        </div>

        {/* Tareas Pendientes de Adaptar */}
        {tareasPendientes.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#b45309", marginBottom: "0.6rem" }}>
              Tareas Recibidas del Rol Docente que Requieren tu Adaptación TDAH:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tareasPendientes.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: "12px",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: "260px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                      <span style={{ fontWeight: "800", fontSize: "1rem", color: "#0f172a" }}>{t.titulo}</span>
                      <span className="badge" style={{ background: "#fef3c7", color: "#92400e" }}>
                        {t.tipo_asignacion}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.825rem", color: "#475569", marginBottom: "0.3rem" }}>
                      <strong>Alumno:</strong> {t.alumno?.nombre} {t.alumno?.apellido} ·{" "}
                      <strong>Diagnóstico:</strong> {t.alumno?.diagnostico}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#1e293b", background: "white", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #fde68a" }}>
                      <strong>Consigna Original del Docente:</strong> {t.consigna_original}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => abrirModalAdaptacion(t)}
                    className="btn btn-primary"
                    style={{ background: "var(--terapeuta-color)" }}
                  >
                    <Sliders size={16} />
                    <span>Adaptar con Pautas TDAH y Enviar al Tutor</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historial de Tareas Ya Adaptadas y Respuestas del Tutor */}
        <div>
          <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#334155", marginBottom: "0.6rem" }}>
            Tareas Adaptadas y Enviadas al Familiar / Tutor ({tareasAdaptadas.length}):
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {tareasAdaptadas.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <div>
                    <strong style={{ color: "#0f172a" }}>{t.titulo}</strong>{" "}
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      (Alumno: {t.alumno?.nombre} {t.alumno?.apellido})
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <span className="badge" style={{ background: "#ede9fe", color: "#6d28d9" }}>
                      {t.estado === "COMPLETADA_POR_TUTOR" ? "Completada en Casa" : "Enviada al Tutor"}
                    </span>
                    <button
                      type="button"
                      onClick={() => abrirModalAdaptacion(t)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Editar Adaptación
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#6d28d9", fontWeight: "700", marginBottom: "0.3rem" }}>
                  Pautas TDAH Aplicadas: {t.pautas_tdah_aplicadas}
                </div>
                <div style={{ fontSize: "0.825rem", color: "#334155", whiteSpace: "pre-line", background: "white", padding: "0.65rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  {t.adaptacion_terapeuta}
                </div>

                {t.reporte_tutor && (
                  <div style={{ marginTop: "0.6rem", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.825rem", color: "#065f46" }}>
                    <strong>Reporte recibido del Familiar / Tutor:</strong> "{t.reporte_tutor}" · Nivel de atención en casa: <strong>{t.nivel_atencion_hogar}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Columna Izquierda: Alertas de Aula y Alumnos */}
        <div>
          {/* Alertas Recibidas desde el Aula */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Bell size={20} color="var(--terapeuta-color)" />
                <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Alertas Emitidas desde el Aula</h2>
              </div>
              <span className="badge" style={{ background: "#f5f3ff", color: "var(--terapeuta-color)" }}>
                {alertas.filter((a) => a.estado === "PENDIENTE").length} Pendientes
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {alertas.length === 0 ? (
                <div style={{ padding: "1rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
                  No hay alertas registradas en este momento.
                </div>
              ) : (
                alertas.slice(0, 5).map((al) => (
                  <div
                    key={al.id}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      background: al.estado === "PENDIENTE" ? "#fff1f2" : "#f8fafc",
                      border: `1px solid ${al.estado === "PENDIENTE" ? "#fecdd3" : "#e2e8f0"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "#0f172a" }}>
                        {al.alumno?.nombre} {al.alumno?.apellido} ({al.tipo_alerta})
                      </div>
                      <div style={{ fontSize: "0.825rem", color: "#475569" }}>{al.mensaje}</div>
                      <div style={{ fontSize: "0.725rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                        Emitido por: Rol Docente
                      </div>
                    </div>

                    {al.estado === "PENDIENTE" ? (
                      <button
                        onClick={() => atenderAlerta(al.id)}
                        className="btn btn-sm"
                        style={{ background: "#10b981", color: "white", fontSize: "0.75rem" }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Atender</span>
                      </button>
                    ) : (
                      <span className="badge" style={{ background: "#ecfdf5", color: "#059669" }}>
                        Atendida
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Casos Clínicos Asignados */}
          <div className="card">
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1rem" }}>
              Alumnos en Seguimiento Terapéutico TDAH
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {alumnos.map((alumno) => (
                <div
                  key={alumno.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "1rem", color: "#0f172a" }}>
                      {alumno.nombre} {alumno.apellido}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", margin: "0.2rem 0" }}>
                      {alumno.diagnostico}
                    </div>
                    <SemaforoBadge estado={alumno.semaforo_actual} size="sm" />
                  </div>

                  <Link to={`/alumnos/${alumno.id}`} className="btn btn-secondary btn-sm">
                    <span>Legajo Clínico</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Caja de Herramientas Sensoriales y Ejecutivas TDAH Expandida */}
        <div>
          <SensoryToolbox
            onEstrategiaSeleccionada={(estrategia) => {
              if (tareaSeleccionada) {
                aplicarPautaRapidaEnAdaptacion(estrategia);
              } else if (tareasPendientes.length > 0) {
                abrirModalAdaptacion(tareasPendientes[0]);
              } else {
                emitirPautaClinicaEnVivo(`Pauta TDAH Sugerida por Terapeuta: ${estrategia}`, "TODOS");
              }
            }}
            onEmitirRecomendacionRapida={(textoAbc) => emitirPautaClinicaEnVivo(textoAbc, "TODOS")}
          />
        </div>
      </div>

      {/* Chat en Tiempo Real con Docente y Tutor Familiar */}
      <ChatCoordinacion
        alumnos={alumnos}
        rolActual="TERAPEUTA"
        titulo="Canal Clínico-Pedagógico en Tiempo Real (Docente · Terapeuta · Tutor)"
      />

      {/* MODAL PARA ADAPTAR TAREA SEGÚN PAUTAS ESPECÍFICAS TDAH */}
      {tareaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "680px" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.35rem" }}>
              Adaptación Terapéutica TDAH de la Tarea
            </h3>
            <p style={{ fontSize: "0.825rem", color: "#64748b", marginBottom: "1rem" }}>
              Alumno: <strong>{tareaSeleccionada.alumno?.nombre} {tareaSeleccionada.alumno?.apellido}</strong> ·{" "}
              {tareaSeleccionada.alumno?.diagnostico}
            </p>

            <div style={{ background: "#f1f5f9", padding: "0.85rem", borderRadius: "10px", marginBottom: "1rem", fontSize: "0.85rem" }}>
              <strong>Consigna Original del Rol Docente ("{tareaSeleccionada.titulo}"):</strong>
              <p style={{ color: "#334155", marginTop: "0.25rem" }}>{tareaSeleccionada.consigna_original}</p>
            </div>

            <form onSubmit={handleGuardarAdaptacion}>
              <div className="form-group">
                <label className="form-label">Pautas Específicas de TDAH a Aplicar (Clic para agregar)</label>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                  {[
                    "Micro-segmentación en 3 pasos cortos (Chunking)",
                    "Temporizador Visual Pomodoro (5 min)",
                    "Pausa Kinestésica de descarga motriz",
                    "Eliminación de estímulos distractores visuales",
                    "Autoinstrucciones de Meichenbaum",
                    "Refuerzo con Economía de Fichas",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => aplicarPautaRapidaEnAdaptacion(p)}
                      style={{
                        fontSize: "0.72rem",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "999px",
                        border: "1px solid #c4b5fd",
                        background: "#f5f3ff",
                        color: "#5b21b6",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      + {p}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={formAdaptacion.pautas_tdah_aplicadas}
                  onChange={(e) =>
                    setFormAdaptacion({ ...formAdaptacion, pautas_tdah_aplicadas: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Consigna Adaptada Paso a Paso (Lo que verá el Familiar / Tutor en casa)
                </label>
                <textarea
                  rows={6}
                  required
                  value={formAdaptacion.adaptacion_terapeuta}
                  onChange={(e) =>
                    setFormAdaptacion({ ...formAdaptacion, adaptacion_terapeuta: e.target.value })
                  }
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Recursos de Apoyo Sugeridos para el Hogar</label>
                <input
                  type="text"
                  value={formAdaptacion.recursos_apoyo}
                  onChange={(e) =>
                    setFormAdaptacion({ ...formAdaptacion, recursos_apoyo: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setTareaSeleccionada(null)}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: "var(--terapeuta-color)" }}
                >
                  <Send size={16} />
                  <span>Guardar Adaptación TDAH y Enviar al Tutor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTerapeuta;
