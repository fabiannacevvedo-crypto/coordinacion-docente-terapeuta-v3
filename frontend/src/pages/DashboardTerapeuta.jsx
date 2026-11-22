import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import { SensoryToolbox } from "../components/terapeuta/SensoryToolbox.jsx";
import { ChatCoordinacion } from "../components/common/ChatCoordinacion.jsx";
import { MovablePanel } from "../components/common/MovablePanel.jsx";
import { CircuitoTDAHStepper } from "../components/common/CircuitoTDAHStepper.jsx";
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
  Calendar,
} from "lucide-react";

export const DashboardTerapeuta = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoActivoId, setAlumnoActivoId] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [etapaStepper, setEtapaStepper] = useState(5);

  // Orden dinámico de paneles movibles y desplazables (Sin flechitas explicativas para el Terapeuta)
  const [ordenPaneles, setOrdenPaneles] = useState([
    "BANDEJA_ADAPTACION",
    "REGULADOR_TERAPEUTA",
    "FICHA_SINCRONIZADOR_AGENDA",
    "ALERTAS_Y_CASOS",
    "CHAT",
  ]);
  const [panelesExpandidos, setPanelesExpandidos] = useState({
    BANDEJA_ADAPTACION: false,
  });
  const [draggedPanelId, setDraggedPanelId] = useState(null);

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
      const [resAlumnos, resAlertas, resTareas] = await Promise.all([
        api.getAlumnos(),
        api.getAlertas(),
        api.getTareas(),
      ]);

      if (resAlumnos.ok && resAlumnos.alumnos.length > 0) {
        setAlumnos(resAlumnos.alumnos);
        if (!alumnoActivoId) setAlumnoActivoId(resAlumnos.alumnos[0].id);
      }
      if (resAlertas.ok) setAlertas(resAlertas.alertas);
      if (resTareas.ok) setTareas(resTareas.tareas);
    } catch (e) {
      console.error("Error cargando gabinete terapeuta:", e);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const alumnoSeleccionado = alumnos.find((a) => a.id === Number(alumnoActivoId)) || alumnos[0];

  const sincronizadorHogarActual = React.useMemo(() => {
    if (!alumnoSeleccionado?.sincronizador_matutino) {
      return {
        descanso: "Descanso Completo (8 hs)",
        disposicion: "Motivado y Foco Activo",
        preparacion: "Sin pantallas + Anticipación",
      };
    }
    try {
      return JSON.parse(alumnoSeleccionado.sincronizador_matutino);
    } catch {
      return {
        descanso: "Descanso Completo (8 hs)",
        disposicion: "Motivado y Foco Activo",
        preparacion: "Sin pantallas + Anticipación",
      };
    }
  }, [alumnoSeleccionado]);

  const mostrarNotificacion = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(null), 4500);
  };

  const focoPanel = (panelId, numEtapa) => {
    setEtapaStepper(numEtapa);
    setOrdenPaneles((prev) => {
      if (!prev.includes(panelId)) return prev;
      return [panelId, ...prev.filter((p) => p !== panelId)];
    });
    setPanelesExpandidos((prev) => ({ ...prev, [panelId]: true }));
  };

  // Funciones para mover y desplazar paneles
  const moverPanel = (id, direccion) => {
    setOrdenPaneles((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      const targetIdx = direccion === "UP" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const copia = [...prev];
      const temp = copia[idx];
      copia[idx] = copia[targetIdx];
      copia[targetIdx] = temp;
      return copia;
    });
  };

  const toggleExpandPanel = (id) => {
    setPanelesExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragStart = (e, id) => setDraggedPanelId(id);

  const handleDrop = (e, targetId) => {
    if (!draggedPanelId || draggedPanelId === targetId) return;
    setOrdenPaneles((prev) => {
      const copia = [...prev];
      const fromIdx = copia.indexOf(draggedPanelId);
      const toIdx = copia.indexOf(targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      copia.splice(fromIdx, 1);
      copia.splice(toIdx, 0, draggedPanelId);
      return copia;
    });
    setDraggedPanelId(null);
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

  const emitirPautaClinicaEnVivo = async (texto, destinatario = "TODOS") => {
    if (alumnos.length === 0) return;
    try {
      await api.enviarMensajeChat({
        alumno_id: alumnoSeleccionado?.id || alumnos[0].id,
        destinatario_rol: destinatario,
        contenido: texto,
        tipo_mensaje: "PAUTA_TERAPEUTICA",
      });
      mostrarNotificacion(`Pauta clínica TDAH transmitida a: ${destinatario === "TODOS" ? "Docente y Tutor" : destinatario}.`);
    } catch (err) {
      console.error("Error emitiendo pauta:", err);
    }
  };

  const abrirModalAdaptacion = (tarea) => {
    setTareaSeleccionada(tarea);
    const grav = tarea.alumno?.gravedad_tdah || "MODERADO";
    const minBloque = grav === "SEVERO" ? 4 : grav === "LEVE" ? 8 : 5;

    const textoSugerido =
      tarea.adaptacion_terapeuta ||
      `ADAPTACIÓN TDAH [Gravedad ${grav} · Bloques ${minBloque}m]:\n• PASO 1 (2 min): Despejar mesa dejando solo el material de "${tarea.titulo}".\n• PASO 2 (${minBloque} min): Ejecutar primera mitad con Reloj Visual.\n• PAUSA KINESTÉSICA (2 min): Descarga motora breve.\n• PASO 3 (${minBloque} min): Cierre y estrella en Economía de Fichas.`;

    setFormAdaptacion({
      subtipo_tdah_objetivo:
        tarea.subtipo_tdah_objetivo || `TDAH (${grav})`,
      pautas_tdah_aplicadas:
        tarea.pautas_tdah_aplicadas ||
        `Micro-segmentación (Chunking ${minBloque}m) + Temporizador Visual + Pausa Kinestésica`,
      adaptacion_terapeuta: textoSugerido,
      recursos_apoyo:
        tarea.recursos_apoyo ||
        `Reloj visual ${minBloque} min + Autoinstrucciones de Meichenbaum`,
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
        mostrarNotificacion("Tarea adaptada según gravedad TDAH y enviada al Padre / Tutor.");
        cargarDatos();
      }
    } catch (err) {
      alert("Error al guardar adaptación: " + err.message);
    }
  };

  const tareasPendientes = tareas.filter((t) => t.estado === "PENDIENTE_TERAPEUTA");
  const tareasAdaptadas = tareas.filter((t) => t.estado !== "PENDIENTE_TERAPEUTA");

  const renderPanelPorId = (panelId) => {
    switch (panelId) {
      case "BANDEJA_ADAPTACION":
        return (
          <MovablePanel
            key="BANDEJA_ADAPTACION"
            id="BANDEJA_ADAPTACION"
            title="Adaptador Clínico de Actividades TDAH"
            badgeText={`${tareasPendientes.length} Pendientes`}
            accentColor="#7c3aed"
            Icon={ClipboardCheck}
            isExpanded={Boolean(panelesExpandidos["BANDEJA_ADAPTACION"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("BANDEJA_ADAPTACION", "UP")}
            onMoveDown={() => moverPanel("BANDEJA_ADAPTACION", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
          >
            {tareasPendientes.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "0.85rem" }}>
                {tareasPendientes.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      background: "#fffbeb",
                      border: "1.5px solid #fde68a",
                      borderRadius: "10px",
                      padding: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "0.6rem",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: "210px" }}>
                      <div style={{ fontWeight: "800", fontSize: "0.9rem", color: "#0f172a" }}>
                        {t.titulo}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#475569" }}>
                        Alumno: <strong>{t.alumno?.nombre}</strong> · Consigna: {t.consigna_original}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => abrirModalAdaptacion(t)}
                      className="btn btn-primary btn-sm"
                      style={{ background: "#7c3aed" }}
                    >
                      <Sliders size={14} />
                      <span>Adaptar y Enviar al Padre</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", maxHeight: "260px", overflowY: "auto" }}>
              {tareasAdaptadas.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "0.75rem",
                    fontSize: "0.78rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <strong style={{ color: "#0f172a" }}>{t.titulo}</strong>
                    <button
                      type="button"
                      onClick={() => abrirModalAdaptacion(t)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.68rem", padding: "0.18rem 0.5rem" }}
                    >
                      Reajustar
                    </button>
                  </div>
                  <div style={{ color: "#6d28d9", fontWeight: "700", fontSize: "0.73rem" }}>
                    {t.pautas_tdah_aplicadas}
                  </div>
                  {t.reporte_tutor && (
                    <div style={{ marginTop: "0.35rem", background: "#ecfdf5", color: "#065f46", padding: "0.4rem 0.6rem", borderRadius: "6px", fontSize: "0.73rem" }}>
                      <strong>Reporte Padre ({t.nivel_atencion_hogar}):</strong> "{t.reporte_tutor}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </MovablePanel>
        );

      case "REGULADOR_TERAPEUTA":
        return (
          <MovablePanel
            key="REGULADOR_TERAPEUTA"
            id="REGULADOR_TERAPEUTA"
            title="Regulador Neuro-Ejecutivo y Caja Sensorial TDAH"
            badgeText="Interactivo en Vivo"
            accentColor="#8b5cf6"
            Icon={Brain}
            isExpanded={Boolean(panelesExpandidos["REGULADOR_TERAPEUTA"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("REGULADOR_TERAPEUTA", "UP")}
            onMoveDown={() => moverPanel("REGULADOR_TERAPEUTA", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
          >
            <SensoryToolbox
              onEstrategiaSeleccionada={(estrategia) => {
                if (tareaSeleccionada) {
                  aplicarPautaRapidaEnAdaptacion(estrategia);
                } else if (tareasPendientes.length > 0) {
                  abrirModalAdaptacion(tareasPendientes[0]);
                } else {
                  emitirPautaClinicaEnVivo(`Pauta TDAH Activada: ${estrategia}`, "TODOS");
                }
              }}
              onEmitirRecomendacionRapida={(textoAbc) => emitirPautaClinicaEnVivo(textoAbc, "TODOS")}
            />
          </MovablePanel>
        );

      case "FICHA_SINCRONIZADOR_AGENDA":
        return (
          <MovablePanel
            key="FICHA_SINCRONIZADOR_AGENDA"
            id="FICHA_SINCRONIZADOR_AGENDA"
            title="Contexto Clínico: Ficha Médica + Sincronizador + Prescripción"
            badgeText={`Gravedad ${alumnoSeleccionado?.gravedad_tdah || "MODERADO"}`}
            accentColor="#2563eb"
            Icon={Calendar}
            isExpanded={Boolean(panelesExpandidos["FICHA_SINCRONIZADOR_AGENDA"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("FICHA_SINCRONIZADOR_AGENDA", "UP")}
            onMoveDown={() => moverPanel("FICHA_SINCRONIZADOR_AGENDA", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
          >
            {/* Selector rápido de alumno en gabinete */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
              {alumnos.map((al) => (
                <button
                  key={al.id}
                  type="button"
                  onClick={() => setAlumnoActivoId(al.id)}
                  style={{
                    padding: "0.35rem 0.7rem",
                    borderRadius: "8px",
                    border: `1.5px solid ${al.id === alumnoSeleccionado?.id ? "#7c3aed" : "#cbd5e1"}`,
                    background: al.id === alumnoSeleccionado?.id ? "#f5f3ff" : "white",
                    color: al.id === alumnoSeleccionado?.id ? "#5b21b6" : "#475569",
                    fontSize: "0.75rem",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {al.nombre} ({al.gravedad_tdah || "MODERADO"})
                </button>
              ))}
            </div>

            <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.65rem 0.8rem", borderRadius: "10px", fontSize: "0.76rem", marginBottom: "0.75rem" }}>
              <div style={{ fontWeight: "800", color: "#065f46", marginBottom: "0.2rem" }}>
                Sincronizador Pre-Aula Enviado por Familiar / Tutor:
              </div>
              <div style={{ color: "#1e293b" }}>
                1. {sincronizadorHogarActual.descanso} · 2. {sincronizadorHogarActual.disposicion} · 3. {sincronizadorHogarActual.preparacion}
              </div>
            </div>

            {/* Botones de prescripción clínica en 1 clic */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
              <button
                type="button"
                onClick={() =>
                  emitirPautaClinicaEnVivo(
                    "Prescripción AT a Sala: Activar pausa kinestésica de 2 min antes del siguiente bloque.",
                    "DOCENTE"
                  )
                }
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.73rem", borderLeft: "3px solid #2563eb", justifyContent: "flex-start" }}
              >
                <GraduationCap size={14} color="#2563eb" />
                <span>Pauta a Docente: Pausa 2m</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  emitirPautaClinicaEnVivo(
                    "Prescripción AT a Hogar: Fraccionar actividad en bloques cortos con reloj visual.",
                    "FAMILIAR"
                  )
                }
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.73rem", borderLeft: "3px solid #059669", justifyContent: "flex-start" }}
              >
                <Users size={14} color="#059669" />
                <span>Pauta a Tutor: Reloj 5m</span>
              </button>
            </div>
          </MovablePanel>
        );

      case "ALERTAS_Y_CASOS":
        return (
          <MovablePanel
            key="ALERTAS_Y_CASOS"
            id="ALERTAS_Y_CASOS"
            title="Alertas de Sala y Legajos Clínicos"
            badgeText={`${alertas.filter((a) => a.estado === "PENDIENTE").length} Activas`}
            accentColor="#ef4444"
            Icon={Bell}
            isExpanded={Boolean(panelesExpandidos["ALERTAS_Y_CASOS"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("ALERTAS_Y_CASOS", "UP")}
            onMoveDown={() => moverPanel("ALERTAS_Y_CASOS", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {alertas.slice(0, 4).map((al) => (
                <div
                  key={al.id}
                  style={{
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    background: al.estado === "PENDIENTE" ? "#fff1f2" : "#f8fafc",
                    border: `1px solid ${al.estado === "PENDIENTE" ? "#fecdd3" : "#e2e8f0"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    fontSize: "0.78rem",
                  }}
                >
                  <div>
                    <strong style={{ color: "#0f172a" }}>{al.alumno?.nombre}:</strong> {al.mensaje}
                  </div>
                  {al.estado === "PENDIENTE" ? (
                    <button
                      type="button"
                      onClick={() => atenderAlerta(al.id)}
                      className="btn btn-sm"
                      style={{ background: "#10b981", color: "white", fontSize: "0.7rem", padding: "0.25rem 0.55rem" }}
                    >
                      Atender
                    </button>
                  ) : (
                    <span className="badge" style={{ background: "#ecfdf5", color: "#059669", fontSize: "0.64rem" }}>
                      Atendida
                    </span>
                  )}
                </div>
              ))}
            </div>
          </MovablePanel>
        );

      case "CHAT":
        return (
          <MovablePanel
            key="CHAT"
            id="CHAT"
            title="Canal Clínico-Pedagógico en Tiempo Real"
            badgeText="Docente · AT · Tutor"
            accentColor="#059669"
            Icon={Users}
            isExpanded={Boolean(panelesExpandidos["CHAT"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("CHAT", "UP")}
            onMoveDown={() => moverPanel("CHAT", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
          >
            <ChatCoordinacion alumnos={alumnos} rolActual="TERAPEUTA" titulo="Chat Tripartito en Vivo" />
          </MovablePanel>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Header Compacto Gabinete Terapeuta */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-terapeuta">Rol Terapeuta / AT</span>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "600" }}>
              Paneles Clínicos Desplazables · Sin Desplegables Explicativos Básicos
            </span>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#0f172a", marginTop: "0.15rem" }}>
            Gabinete Terapéutico · Regulador y Adaptador TDAH
          </h1>
        </div>
      </div>

      {mensajeExito && (
        <div className="alert alert-success" style={{ marginBottom: "1rem" }}>
          <CheckCircle2 size={18} />
          <span>{mensajeExito}</span>
        </div>
      )}

      {/* Barra Horizontal Interactiva de las 6 Etapas del Circuito TDAH */}
      <CircuitoTDAHStepper
        etapaActiva={etapaStepper}
        onSelectEtapa={(num) => {
          if (num === 1 || num === 2 || num === 3) {
            focoPanel("FICHA_SINCRONIZADOR_AGENDA", num);
          } else if (num === 4) {
            focoPanel("REGULADOR_TERAPEUTA", 4);
          } else if (num === 5) {
            focoPanel("BANDEJA_ADAPTACION", 5);
            if (tareasPendientes.length > 0) {
              abrirModalAdaptacion(tareasPendientes[0]);
            }
          } else if (num === 6) {
            focoPanel("BANDEJA_ADAPTACION", 6);
          }
        }}
        alumno={alumnoSeleccionado}
        tieneSincronizadorHoy={Boolean(alumnoSeleccionado?.sincronizador_matutino)}
        tieneAgendaHoy={Boolean(alumnoSeleccionado?.agenda_diaria)}
        tieneTareasAdaptadas={tareasAdaptadas.length > 0}
      />

      {/* Grilla Bento Dinámica con Paneles Movibles */}
      <div className="dynamic-bento-grid">
        {ordenPaneles.map((id) => renderPanelPorId(id))}
      </div>

      {/* MODAL PARA ADAPTAR TAREA SEGÚN GRAVEDAD Y PAUTAS TDAH */}
      {tareaSeleccionada && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "640px" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.25rem" }}>
              Adaptar Actividad según Gravedad TDAH ({tareaSeleccionada.alumno?.gravedad_tdah || "MODERADO"})
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.75rem" }}>
              Alumno: <strong>{tareaSeleccionada.alumno?.nombre}</strong> · Original: "{tareaSeleccionada.consigna_original}"
            </p>

            <form onSubmit={handleGuardarAdaptacion}>
              <div className="form-group">
                <label className="form-label">Pautas TDAH (Clic para agregar)</label>
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.45rem" }}>
                  {[
                    "Micro-segmentación Chunking",
                    "Reloj Visual Pomodoro 5m",
                    "Pausa Kinestésica 2m",
                    "Filtro de Distractores",
                    "Autoinstrucciones Meichenbaum",
                    "Economía de Fichas",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => aplicarPautaRapidaEnAdaptacion(p)}
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.22rem 0.55rem",
                        borderRadius: "999px",
                        border: "1px solid #c4b5fd",
                        background: "#f5f3ff",
                        color: "#5b21b6",
                        cursor: "pointer",
                        fontWeight: "700",
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
                <label className="form-label">Adaptación Paso a Paso para Enviar al Padre / Tutor</label>
                <textarea
                  rows={5}
                  required
                  value={formAdaptacion.adaptacion_terapeuta}
                  onChange={(e) =>
                    setFormAdaptacion({ ...formAdaptacion, adaptacion_terapeuta: e.target.value })
                  }
                  className="form-textarea"
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
                  style={{ background: "#7c3aed" }}
                >
                  <Send size={15} />
                  <span>Guardar y Enviar al Padre</span>
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
