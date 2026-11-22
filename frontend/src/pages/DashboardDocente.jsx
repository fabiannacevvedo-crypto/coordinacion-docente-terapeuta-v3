import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import { AlertaModal } from "../components/docente/AlertaModal.jsx";
import { CreadorPresentacionesAdaptadas } from "../components/docente/CreadorPresentacionesAdaptadas.jsx";
import { ChatCoordinacion } from "../components/common/ChatCoordinacion.jsx";
import { MovablePanel } from "../components/common/MovablePanel.jsx";
import { ExplicacionMedicaToggle } from "../components/common/ExplicacionMedicaToggle.jsx";
import { CircuitoTDAHStepper } from "../components/common/CircuitoTDAHStepper.jsx";
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
  Calendar,
  Volume2,
  Sun,
  Clock,
  Activity,
  Presentation,
} from "lucide-react";

export const DashboardDocente = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoActivoId, setAlumnoActivoId] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [etapaStepper, setEtapaStepper] = useState(3);

  // Orden dinámico de paneles movibles y desplazables
  const [ordenPaneles, setOrdenPaneles] = useState([
    "CONTEXTO_Y_AGENDA",
    "TAREAS_Y_ADAPTACION",
    "PRESENTACIONES",
    "RADAR_Y_ALUMNOS",
    "CHAT",
  ]);
  const [panelesExpandidos, setPanelesExpandidos] = useState({
    PRESENTACIONES: true,
  });
  const [draggedPanelId, setDraggedPanelId] = useState(null);

  // Radar de Clima Sensorial del Aula
  const [climaAula, setClimaAula] = useState({
    nivelRuido: "SILENCIO_FOCO",
    cargaVisual: "DESPEJADA",
    faseClase: "BLOQUE_FOCO_CORTO",
  });

  // Constructor de Agenda Diaria Personalizada según Sincronizador Matutino y Gravedad TDAH
  const [agendaItems, setAgendaItems] = useState([
    { id: 1, hora: "08:15", bloque: "Recepción y Anclaje Visual", duracion: "10 min", tipo: "FOCO", completado: true },
    { id: 2, hora: "08:30", bloque: "Misión 1: Actividad Micro-segmentada", duracion: "10 min", tipo: "FOCO", completado: false },
    { id: 3, hora: "08:40", bloque: "Pausa Kinestésica Regulada", duracion: "3 min", tipo: "PAUSA", completado: false },
    { id: 4, hora: "08:45", bloque: "Misión 2: Presentación Adaptada", duracion: "10 min", tipo: "FOCO", completado: false },
  ]);
  const [nuevoBloqueAgenda, setNuevoBloqueAgenda] = useState("");

  // Modales
  const [modalAlertaOpen, setModalAlertaOpen] = useState(false);
  const [modalNuevoAlumnoOpen, setModalNuevoAlumnoOpen] = useState(false);
  const [modalNuevaTareaOpen, setModalNuevaTareaOpen] = useState(false);

  // Formulario nuevo alumno con Ficha Médica y Gravedad TDAH
  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: "",
    apellido: "",
    sala_grado: "Sala de 5 Años - Turno Mañana",
    turno: "MAÑANA",
    semaforo_actual: "VERDE",
    gravedad_tdah: "MODERADO",
    diagnostico: "TDAH Presentación Combinada (F90.2)",
    profesional_medico: "Servicio de Neurología Infantil · Mat. 8412",
    ventana_foco_min: 10,
    observaciones: "Micro-segmentación de consignas (Chunking) y bloques cortos.",
  });

  // Formulario asignar tarea (En conjunto o individual -> va al Terapeuta antes que al Tutor)
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    consigna_original: "",
    tipo_asignacion: "INDIVIDUAL",
    alumno_id: "",
    subtipo_tdah_objetivo: "TDAH Combinado (Inatención + Impulsividad)",
    fecha_entrega: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
  });

  const [mensajeExito, setMensajeExito] = useState(null);

  const cargarDatos = async () => {
    try {
      const [resAlumnos, resAlertas, resTareas] = await Promise.all([
        api.getAlumnos(),
        api.getAlertas("estado=PENDIENTE"),
        api.getTareas(),
      ]);

      if (resAlumnos.ok && resAlumnos.alumnos.length > 0) {
        setAlumnos(resAlumnos.alumnos);
        const first = resAlumnos.alumnos[0];
        if (!alumnoActivoId) setAlumnoActivoId(first.id);
        if (first.agenda_diaria) {
          try {
            setAgendaItems(JSON.parse(first.agenda_diaria));
          } catch {
            // fallback
          }
        }
      }
      if (resAlertas.ok) setAlertas(resAlertas.alertas);
      if (resTareas.ok) setTareas(resTareas.tareas);
    } catch (err) {
      console.error("Error al cargar datos del aula docente:", err);
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
        disposicion: "Motivado y con Foco Activo",
        preparacion: "Desayuno sin pantallas + Anticipación",
      };
    }
    try {
      return JSON.parse(alumnoSeleccionado.sincronizador_matutino);
    } catch {
      return {
        descanso: "Descanso Completo (8 hs)",
        disposicion: "Motivado y con Foco Activo",
        preparacion: "Desayuno sin pantallas + Anticipación",
      };
    }
  }, [alumnoSeleccionado]);

  const fichaMedicaActual = React.useMemo(() => {
    if (!alumnoSeleccionado?.ficha_medica) {
      return {
        profesional_emisor: "Neurología Infantil · Mat. 8412",
        subtipo_dsm5: alumnoSeleccionado?.diagnostico || "TDAH Combinado",
        ventana_atencional_min: alumnoSeleccionado?.gravedad_tdah === "SEVERO" ? 6 : alumnoSeleccionado?.gravedad_tdah === "LEVE" ? 15 : 10,
      };
    }
    try {
      return JSON.parse(alumnoSeleccionado.ficha_medica);
    } catch {
      return {
        profesional_emisor: "Neurología Infantil",
        subtipo_dsm5: alumnoSeleccionado?.diagnostico || "TDAH Combinado",
        ventana_atencional_min: 10,
      };
    }
  }, [alumnoSeleccionado]);

  const mostrarNotificacion = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(null), 4500);
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

  // Auto-calibrar Agenda Diaria según la Gravedad del TDAH y las 3 Pautas del Sincronizador Matutino
  const calibrarAgendaAutomatica = async (gravedad = alumnoSeleccionado?.gravedad_tdah || "MODERADO") => {
    const durFoco = gravedad === "SEVERO" ? "6 min" : gravedad === "LEVE" ? "15 min" : "10 min";
    const requiereDescarga = sincronizadorHogarActual.disposicion?.includes("Energía") || sincronizadorHogarActual.descanso?.includes("Intermitente");

    const nuevaAgenda = [
      {
        id: 1,
        hora: "08:15",
        bloque: requiereDescarga ? "Anclaje Propioceptivo y Descarga Inicial" : "Recepción y Anclaje Visual",
        duracion: "5 min",
        tipo: "PAUSA",
        completado: true,
      },
      {
        id: 2,
        hora: "08:25",
        bloque: `Misión 1: Actividad Micro-segmentada (${gravedad})`,
        duracion: durFoco,
        tipo: "FOCO",
        completado: false,
      },
      {
        id: 3,
        hora: "08:40",
        bloque: "Pausa Kinestésica Regulada + Hidratación",
        duracion: "3 min",
        tipo: "PAUSA",
        completado: false,
      },
      {
        id: 4,
        hora: "08:45",
        bloque: "Misión 2: Presentación Adaptada de Bajo Estímulo",
        duracion: durFoco,
        tipo: "FOCO",
        completado: false,
      },
      {
        id: 5,
        hora: "09:00",
        bloque: "Cierre con Economía de Fichas",
        duracion: "4 min",
        tipo: "CIERRE",
        completado: false,
      },
    ];

    setAgendaItems(nuevaAgenda);
    if (alumnoSeleccionado) {
      await api.updateAlumno(alumnoSeleccionado.id, {
        agenda_diaria: JSON.stringify(nuevaAgenda),
      });
      mostrarNotificacion(`Agenda Diaria calibrada automáticamente para TDAH ${gravedad} (Bloques de ${durFoco}).`);
    }
  };

  const toggleBloqueAgenda = async (idBloque) => {
    const actualizada = agendaItems.map((b) =>
      b.id === idBloque ? { ...b, completado: !b.completado } : b
    );
    setAgendaItems(actualizada);
    if (alumnoSeleccionado) {
      await api.updateAlumno(alumnoSeleccionado.id, {
        agenda_diaria: JSON.stringify(actualizada),
      });
    }
  };

  const agregarBloqueAgenda = async (e) => {
    e.preventDefault();
    if (!nuevoBloqueAgenda.trim()) return;
    const durFoco = alumnoSeleccionado?.gravedad_tdah === "SEVERO" ? "6 min" : "10 min";
    const nuevo = {
      id: Date.now(),
      hora: "09:15",
      bloque: nuevoBloqueAgenda.trim(),
      duracion: durFoco,
      tipo: "FOCO",
      completado: false,
    };
    const actualizada = [...agendaItems, nuevo];
    setAgendaItems(actualizada);
    setNuevoBloqueAgenda("");
    if (alumnoSeleccionado) {
      await api.updateAlumno(alumnoSeleccionado.id, {
        agenda_diaria: JSON.stringify(actualizada),
      });
    }
  };

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

  const handleRegistrarAlumno = async (e) => {
    e.preventDefault();
    try {
      const ficha = {
        profesional_emisor: nuevoAlumno.profesional_medico,
        subtipo_dsm5: nuevoAlumno.diagnostico,
        ventana_atencional_min: nuevoAlumno.gravedad_tdah === "SEVERO" ? 6 : nuevoAlumno.gravedad_tdah === "LEVE" ? 15 : 10,
      };
      const res = await api.createAlumno({
        ...nuevoAlumno,
        ficha_medica: JSON.stringify(ficha),
      });
      if (res.ok) {
        setModalNuevoAlumnoOpen(false);
        mostrarNotificacion(`Alumno registrado con Ficha Médica (${nuevoAlumno.gravedad_tdah}). Código Tutor: ${res.alumno?.codigo_familiar}`);
        cargarDatos();
      }
    } catch (err) {
      alert(err.message || "Error al registrar el alumno");
    }
  };

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

  const renderPanelPorId = (panelId) => {
    switch (panelId) {
      case "CONTEXTO_Y_AGENDA":
        return (
          <MovablePanel
            key="CONTEXTO_Y_AGENDA"
            id="CONTEXTO_Y_AGENDA"
            title="Sincronizador Recibido y Agenda Diaria Personalizada"
            badgeText={`Pasos 1, 2 y 3 · TDAH ${alumnoSeleccionado?.gravedad_tdah || "MODERADO"}`}
            accentColor="#0284c7"
            Icon={Calendar}
            isExpanded={Boolean(panelesExpandidos["CONTEXTO_Y_AGENDA"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("CONTEXTO_Y_AGENDA", "UP")}
            onMoveDown={() => moverPanel("CONTEXTO_Y_AGENDA", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual="DOCENTE"
                titulo="¿Por qué se arma la Agenda Diaria según la Ficha Médica y el Sincronizador?"
                porQueSeUsa="La función ejecutiva en el TDAH fluctúa según el descanso nocturno y el nivel de gravedad clínica (Leve: 15m, Moderado: 10m, Severo: 6m)."
                comoAyudaAlAlumno="Permite estructurar bloques cortos predecibles con pausas motoras intercaladas, evitando la desregulación en sala."
                color="#0284c7"
              />
            }
            headerRight={
              <button
                type="button"
                onClick={() => calibrarAgendaAutomatica(alumnoSeleccionado?.gravedad_tdah)}
                className="btn btn-primary btn-sm"
                style={{ background: "#0284c7", fontSize: "0.72rem" }}
              >
                Auto-Calibrar según Contexto Hoy
              </button>
            }
          >
            {/* Resumen visual compacto de Ficha Médica + 3 Pautas del Hogar */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem", marginBottom: "0.85rem" }}>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.6rem 0.75rem", borderRadius: "10px", fontSize: "0.75rem" }}>
                <div style={{ fontWeight: "800", color: "#1d4ed8" }}>
                  1. Ficha Médica ({alumnoSeleccionado?.gravedad_tdah || "MODERADO"})
                </div>
                <div style={{ color: "#1e293b", marginTop: "0.15rem" }}>
                  {fichaMedicaActual.subtipo_dsm5} · Ventana Foco: <strong>{fichaMedicaActual.ventana_atencional_min} min</strong>
                </div>
              </div>

              <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.6rem 0.75rem", borderRadius: "10px", fontSize: "0.75rem" }}>
                <div style={{ fontWeight: "800", color: "#047857" }}>
                  2. Sincronizador Pre-Aula (Hogar)
                </div>
                <div style={{ color: "#1e293b", marginTop: "0.15rem" }}>
                  {sincronizadorHogarActual.descanso} · <strong>{sincronizadorHogarActual.disposicion}</strong>
                </div>
              </div>
            </div>

            {/* Bloques interactivos de la Agenda Diaria */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "0.65rem" }}>
              {agendaItems.map((b) => (
                <div
                  key={b.id}
                  onClick={() => toggleBloqueAgenda(b.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "8px",
                    background: b.completado ? "#ecfdf5" : "#f8fafc",
                    border: `1px solid ${b.completado ? "#10b981" : "#e2e8f0"}`,
                    cursor: "pointer",
                    fontSize: "0.78rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <CheckCircle2 size={15} color={b.completado ? "#10b981" : "#94a3b8"} />
                    <span style={{ fontFamily: "monospace", fontWeight: "800", color: "#0284c7" }}>{b.hora}</span>
                    <span style={{ fontWeight: "700", color: "#0f172a" }}>{b.bloque}</span>
                  </div>
                  <span className="badge" style={{ background: b.tipo === "PAUSA" ? "#fef3c7" : "#dbeafe", color: b.tipo === "PAUSA" ? "#92400e" : "#1e40af", fontSize: "0.65rem" }}>
                    {b.duracion}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={agregarBloqueAgenda} style={{ display: "flex", gap: "0.4rem" }}>
              <input
                type="text"
                value={nuevoBloqueAgenda}
                onChange={(e) => setNuevoBloqueAgenda(e.target.value)}
                placeholder="Agregar micro-misión a la agenda de hoy..."
                className="form-input"
                style={{ fontSize: "0.78rem", padding: "0.4rem 0.65rem" }}
              />
              <button type="submit" className="btn btn-secondary btn-sm">
                + Bloque
              </button>
            </form>
          </MovablePanel>
        );

      case "TAREAS_Y_ADAPTACION":
        return (
          <MovablePanel
            key="TAREAS_Y_ADAPTACION"
            id="TAREAS_Y_ADAPTACION"
            title="Asignación de Actividades y Circuito de Adaptación"
            badgeText="Pasos 4, 5 y 6"
            accentColor="#7c3aed"
            Icon={ClipboardList}
            isExpanded={Boolean(panelesExpandidos["TAREAS_Y_ADAPTACION"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("TAREAS_Y_ADAPTACION", "UP")}
            onMoveDown={() => moverPanel("TAREAS_Y_ADAPTACION", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual="DOCENTE"
                titulo="¿Por qué se envía la tarea primero al Terapeuta antes que al Padre?"
                porQueSeUsa="Las consignas escolares estándar suelen requerir memoria de trabajo secuencial múltiple, que se encuentra comprometida en el TDAH."
                comoAyudaAlAlumno="El Terapeuta divide la actividad en micro-misiones cortas con apoyos visuales antes de que llegue al hogar."
                color="#7c3aed"
              />
            }
            headerRight={
              <button
                type="button"
                onClick={() => {
                  if (alumnos.length > 0 && !nuevaTarea.alumno_id) {
                    setNuevaTarea((prev) => ({ ...prev, alumno_id: String(alumnos[0].id) }));
                  }
                  setModalNuevaTareaOpen(true);
                }}
                className="btn btn-primary btn-sm"
                style={{ background: "#7c3aed", fontSize: "0.74rem" }}
              >
                <PlusCircle size={13} />
                <span>Nueva Tarea → Terapeuta</span>
              </button>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "310px", overflowY: "auto" }}>
              {tareas.map((t) => (
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                    <strong style={{ color: "#0f172a" }}>{t.titulo}</strong>
                    <span
                      className="badge"
                      style={{
                        background:
                          t.estado === "PENDIENTE_TERAPEUTA"
                            ? "#fef3c7"
                            : t.estado === "ADAPTADA_ENVIADA_TUTOR"
                            ? "#dbeafe"
                            : "#d1fae5",
                        color:
                          t.estado === "PENDIENTE_TERAPEUTA"
                            ? "#92400e"
                            : t.estado === "ADAPTADA_ENVIADA_TUTOR"
                            ? "#1e40af"
                            : "#065f46",
                        fontSize: "0.64rem",
                      }}
                    >
                      {t.estado === "PENDIENTE_TERAPEUTA"
                        ? "En Terapeuta"
                        : t.estado === "ADAPTADA_ENVIADA_TUTOR"
                        ? "Enviada al Padre"
                        : "Completada"}
                    </span>
                  </div>
                  <div style={{ color: "#475569", marginBottom: "0.3rem" }}>
                    Alumno: <strong>{t.alumno?.nombre}</strong> · Modalidad: {t.tipo_asignacion}
                  </div>
                  {t.adaptacion_terapeuta && (
                    <div style={{ background: "#f5f3ff", color: "#5b21b6", padding: "0.45rem 0.6rem", borderRadius: "6px", fontSize: "0.74rem" }}>
                      <strong>Adaptación AT:</strong> {t.pautas_tdah_aplicadas}
                    </div>
                  )}
                  {t.reporte_tutor && (
                    <div style={{ background: "#ecfdf5", color: "#065f46", padding: "0.45rem 0.6rem", borderRadius: "6px", fontSize: "0.74rem", marginTop: "0.3rem" }}>
                      <strong>Reporte Tutor ({t.nivel_atencion_hogar}):</strong> "{t.reporte_tutor}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </MovablePanel>
        );

      case "PRESENTACIONES":
        return (
          <MovablePanel
            key="PRESENTACIONES"
            id="PRESENTACIONES"
            title="Creación de Presentaciones Adaptadas para el Alumno"
            badgeText="Paso 4 · Bajo Estímulo"
            accentColor="#4f46e5"
            Icon={Presentation}
            isExpanded={Boolean(panelesExpandidos["PRESENTACIONES"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("PRESENTACIONES", "UP")}
            onMoveDown={() => moverPanel("PRESENTACIONES", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual="DOCENTE"
                titulo="¿Por qué usar diapositivas adaptadas con 1 sola consigna por pantalla?"
                porQueSeUsa="Reduce la sobrecarga perceptual y focaliza la red atencional ejecutiva en un único estímulo."
                comoAyudaAlAlumno="Facilita que el niño comprenda y ejecute cada paso con apoyo del reloj visual integrado."
                color="#4f46e5"
              />
            }
          >
            <CreadorPresentacionesAdaptadas alumnos={alumnos} />
          </MovablePanel>
        );

      case "RADAR_Y_ALUMNOS":
        return (
          <MovablePanel
            key="RADAR_Y_ALUMNOS"
            id="RADAR_Y_ALUMNOS"
            title="Radar Sensorial y Semáforo de Alumnos en Vivo"
            badgeText={`${alumnos.length} Alumnos`}
            accentColor="#2563eb"
            Icon={Activity}
            isExpanded={Boolean(panelesExpandidos["RADAR_Y_ALUMNOS"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("RADAR_Y_ALUMNOS", "UP")}
            onMoveDown={() => moverPanel("RADAR_Y_ALUMNOS", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual="DOCENTE"
                titulo="¿Por qué monitorear el semáforo y la acústica del aula?"
                porQueSeUsa="La hipersensibilidad sensorial y la fatiga dopaminérgica anteceden a la hiperactividad motora."
                comoAyudaAlAlumno="Permite activar alertas tempranas al Terapeuta antes de que ocurra una crisis o bloqueo."
                color="#2563eb"
              />
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {alumnos.map((al) => (
                <div
                  key={al.id}
                  style={{
                    background: "#f8fafc",
                    border: `1.5px solid ${al.id === alumnoSeleccionado?.id ? "#2563eb" : "#e2e8f0"}`,
                    borderRadius: "10px",
                    padding: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    onClick={() => setAlumnoActivoId(al.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <strong style={{ fontSize: "0.9rem", color: "#0f172a" }}>
                        {al.nombre} {al.apellido}
                      </strong>
                      <span className="badge" style={{ background: "#e0e7ff", color: "#1d4ed8", fontSize: "0.64rem" }}>
                        TDAH {al.gravedad_tdah || "MODERADO"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.73rem", color: "#64748b" }}>{al.diagnostico}</div>
                  </div>

                  <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                    {["VERDE", "AMARILLO", "ROJO"].map((est) => (
                      <button
                        key={est}
                        type="button"
                        onClick={() => cambiarSemaforoAlumno(al.id, est)}
                        style={{
                          padding: "0.28rem 0.55rem",
                          borderRadius: "6px",
                          border: "none",
                          fontSize: "0.7rem",
                          fontWeight: "800",
                          cursor: "pointer",
                          background:
                            al.semaforo_actual === est
                              ? est === "VERDE"
                                ? "#10b981"
                                : est === "AMARILLO"
                                ? "#f59e0b"
                                : "#ef4444"
                              : "#e2e8f0",
                          color: al.semaforo_actual === est ? "white" : "#475569",
                        }}
                      >
                        {est}
                      </button>
                    ))}
                  </div>
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
            title="Chat en Tiempo Real con Padres y Terapeuta"
            badgeText="Sincronizado"
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
            <ChatCoordinacion alumnos={alumnos} rolActual="DOCENTE" titulo="Canal Directo Aula · Gabinete · Hogar" />
          </MovablePanel>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Cabecera Compacta y Moderna del Docente */}
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
            <span className="badge badge-docente">Rol Docente</span>
            <span style={{ fontSize: "0.78rem", color: "#64748b", fontWeight: "600" }}>
              Arrastra o desplaza cada panel con las flechas superiores
            </span>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#0f172a", marginTop: "0.15rem" }}>
            Aula Interactiva · Agenda, Presentaciones y Tareas TDAH
          </h1>
        </div>

        {/* Botones de Acción Rápida */}
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setModalNuevoAlumnoOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ background: "#059669" }}
          >
            <UserPlus size={15} />
            <span>+ Alumno y Ficha Médica</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (alumnos.length > 0 && !nuevaTarea.alumno_id) {
                setNuevaTarea((prev) => ({ ...prev, alumno_id: String(alumnos[0].id) }));
              }
              setModalNuevaTareaOpen(true);
            }}
            className="btn btn-primary btn-sm"
            style={{ background: "#7c3aed" }}
          >
            <ClipboardList size={15} />
            <span>Asignar Tarea → Terapeuta</span>
          </button>

          <button
            type="button"
            onClick={() => setModalAlertaOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ background: "#ef4444" }}
          >
            <AlertTriangle size={15} />
            <span>Alerta al AT</span>
          </button>
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
          setEtapaStepper(num);
          if (num === 1) setModalNuevoAlumnoOpen(true);
          if (num === 4) setModalNuevaTareaOpen(true);
        }}
        alumno={alumnoSeleccionado}
        tieneSincronizadorHoy={Boolean(alumnoSeleccionado?.sincronizador_matutino)}
        tieneAgendaHoy={agendaItems.length > 0}
        tieneTareasAdaptadas={tareas.some((t) => t.estado !== "PENDIENTE_TERAPEUTA")}
      />

      {/* Grilla Bento Dinámica con Paneles Movibles */}
      <div className="dynamic-bento-grid">
        {ordenPaneles.map((id) => renderPanelPorId(id))}
      </div>

      {/* MODAL 1: REGISTRAR NUEVO ALUMNO CON FICHA MÉDICA Y GRAVEDAD TDAH */}
      {modalNuevoAlumnoOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: "1.15rem", fontWeight: "900", marginBottom: "0.3rem" }}>
              Registrar Alumno con Ficha Médica y Gravedad TDAH
            </h3>
            <ExplicacionMedicaToggle
              rolActual="DOCENTE"
              titulo="Importancia de la Ficha Médica y Gravedad al Registrar"
              porQueSeUsa="Permite que el sistema configure automáticamente la ventana de atención máxima y las pautas de adaptación para el Terapeuta."
              comoAyudaAlAlumno="Garantiza una intervención ajustada desde el primer día."
              color="#059669"
            />

            <form onSubmit={handleRegistrarAlumno} style={{ marginTop: "0.85rem" }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Identificador / Nombre</label>
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
                  <label className="form-label">Referencia / Subtipo</label>
                  <input
                    type="text"
                    required
                    value={nuevoAlumno.apellido}
                    onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, apellido: e.target.value })}
                    className="form-input"
                    placeholder="Ej: (TDAH Combinado)"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Gravedad Clínica del TDAH (Determina Bloques de Agenda)</label>
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  {[
                    { niv: "LEVE", desc: "Leve (Foco 15 min)" },
                    { niv: "MODERADO", desc: "Moderado (Foco 10 min)" },
                    { niv: "SEVERO", desc: "Severo (Foco 6 min)" },
                  ].map((g) => (
                    <button
                      key={g.niv}
                      type="button"
                      onClick={() => setNuevoAlumno({ ...nuevoAlumno, gravedad_tdah: g.niv })}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: `2px solid ${nuevoAlumno.gravedad_tdah === g.niv ? "#059669" : "#cbd5e1"}`,
                        background: nuevoAlumno.gravedad_tdah === g.niv ? "#ecfdf5" : "white",
                        color: nuevoAlumno.gravedad_tdah === g.niv ? "#065f46" : "#475569",
                        fontSize: "0.75rem",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                    >
                      {g.desc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Diagnóstico Profesional DSM-5</label>
                  <select
                    value={nuevoAlumno.diagnostico}
                    onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, diagnostico: e.target.value })}
                    className="form-select"
                  >
                    <option value="TDAH Presentación Combinada (F90.2)">TDAH Presentación Combinada (F90.2)</option>
                    <option value="TDAH Predominio Déficit de Atención (F90.0)">TDAH Predominio Inatento (F90.0)</option>
                    <option value="TDAH Predominio Hiperactivo-Impulsivo (F90.1)">TDAH Predominio Hiperactivo (F90.1)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ficha Médica / Profesional Emisor</label>
                  <input
                    type="text"
                    value={nuevoAlumno.profesional_medico}
                    onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, profesional_medico: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button type="button" onClick={() => setModalNuevoAlumnoOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: "#059669" }}>
                  Registrar Alumno y Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASIGNAR TAREA (ENVIADA AL TERAPEUTA ANTES QUE AL PADRE) */}
      {modalNuevaTareaOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: "1.15rem", fontWeight: "900", marginBottom: "0.3rem" }}>
              Asignar Actividad (Envío Previo al Terapeuta)
            </h3>

            <form onSubmit={handleCrearTarea}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Modalidad</label>
                  <select
                    value={nuevaTarea.tipo_asignacion}
                    onChange={(e) => setNuevaTarea({ ...nuevaTarea, tipo_asignacion: e.target.value })}
                    className="form-select"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="CONJUNTO">En Conjunto (Toda la Sala)</option>
                  </select>
                </div>

                {nuevaTarea.tipo_asignacion === "INDIVIDUAL" ? (
                  <div className="form-group">
                    <label className="form-label">Alumno</label>
                    <select
                      required
                      value={nuevaTarea.alumno_id}
                      onChange={(e) => setNuevaTarea({ ...nuevaTarea, alumno_id: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Seleccionar...</option>
                      {alumnos.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nombre} {a.apellido} ({a.gravedad_tdah})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Alcance</label>
                    <input
                      type="text"
                      readOnly
                      value={`${alumnos.length} alumnos registrados`}
                      className="form-input"
                      style={{ background: "#f8fafc" }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Título de la Actividad</label>
                <input
                  type="text"
                  required
                  value={nuevaTarea.titulo}
                  onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
                  className="form-input"
                  placeholder="Ej: Asociación Visual de Cantidades y Formas"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consigna Pedagógica Original</label>
                <textarea
                  rows={3}
                  required
                  value={nuevaTarea.consigna_original}
                  onChange={(e) => setNuevaTarea({ ...nuevaTarea, consigna_original: e.target.value })}
                  className="form-textarea"
                  placeholder="Describe la actividad para que el Terapeuta la micro-segmente según la gravedad del TDAH..."
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                <button type="button" onClick={() => setModalNuevaTareaOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: "#7c3aed" }}>
                  <Send size={15} />
                  <span>Enviar al Terapeuta</span>
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
    </div>
  );
};

export default DashboardDocente;
