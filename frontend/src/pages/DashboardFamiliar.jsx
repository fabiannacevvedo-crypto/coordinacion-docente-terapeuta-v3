import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import { ChatCoordinacion } from "../components/common/ChatCoordinacion.jsx";
import { MovablePanel } from "../components/common/MovablePanel.jsx";
import { ExplicacionMedicaToggle } from "../components/common/ExplicacionMedicaToggle.jsx";
import { CircuitoTDAHStepper } from "../components/common/CircuitoTDAHStepper.jsx";
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
  FileText,
  Calendar,
  Sun,
  Sliders,
} from "lucide-react";

export const DashboardFamiliar = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [etapaStepper, setEtapaStepper] = useState(2);

  // Control de bloqueo Pre-Aula: Se pide al familiar contestar las 3 pautas antes de entrar al aula
  const [sincronizadorCompletadoHoy, setSincronizadorCompletadoHoy] = useState(false);
  const [mostrarGateMatutino, setMostrarGateMatutino] = useState(true);

  // Estado del Sincronizador Matutino (3 Pautas Clave antes de entrar al aula)
  const [rutinaHogar, setRutinaHogar] = useState({
    descanso: "Descanso Completo y Reparador (8 hs)",
    disposicion: "Motivado y con Foco Activo",
    preparacion: "Desayuno sin pantallas + Anticipación visual del día",
  });

  // Estado de Ficha Médica y Diagnóstico Profesional editable por el tutor/familia
  const [gravedadTdah, setGravedadTdah] = useState("MODERADO");
  const [fichaMedica, setFichaMedica] = useState({
    profesional_emisor: "Servicio de Neurología Infantil · Mat. 8412",
    subtipo_dsm5: "TDAH Presentación Combinada (F90.2)",
    ventana_atencional_min: 10,
    hipersensibilidad: "Auditiva a timbres y ambientes reverberantes",
    apoyo_farmacologico: "Abordaje conductual-ejecutivo sin medicación en turno escolar",
    indicacion_clinica: "Fraccionar tareas en bloques máximos de 10 min con pausas motoras de 3 min.",
  });

  // Orden dinámico de paneles desplazables y expandibles
  const [ordenPaneles, setOrdenPaneles] = useState([
    "SINCRONIZADOR",
    "FICHA_MEDICA",
    "AGENDA",
    "TAREAS_ADAPTADAS",
    "PRESENTACIONES",
    "CHAT",
  ]);
  const [panelesExpandidos, setPanelesExpandidos] = useState({
    TAREAS_ADAPTADAS: true,
  });
  const [draggedPanelId, setDraggedPanelId] = useState(null);

  // Checklist interactivo por tarea en el hogar
  const [checksHogar, setChecksHogar] = useState({});

  // Visor interactivo de Presentaciones Adaptadas
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
      if (resAlumnos.ok && resAlumnos.alumnos.length > 0) {
        setAlumnos(resAlumnos.alumnos);
        const alum = resAlumnos.alumnos[0];
        if (alum.gravedad_tdah) setGravedadTdah(alum.gravedad_tdah);
        if (alum.ficha_medica) {
          try {
            setFichaMedica(JSON.parse(alum.ficha_medica));
          } catch {
            // fallback
          }
        }
        if (alum.sincronizador_matutino) {
          try {
            const parsedSync = JSON.parse(alum.sincronizador_matutino);
            setRutinaHogar({
              descanso: parsedSync.descanso || rutinaHogar.descanso,
              disposicion: parsedSync.disposicion || rutinaHogar.disposicion,
              preparacion: parsedSync.preparacion || rutinaHogar.preparacion,
            });
          } catch {
            // fallback
          }
        }
      }
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

  const handleDragStart = (e, id) => {
    setDraggedPanelId(id);
  };

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

  // Guardar Sincronizador Matutino (3 Pautas) y Ficha Médica antes de entrar al aula
  const handleConfirmarSincronizadorPreAula = async (e) => {
    if (e) e.preventDefault();
    if (!alumno) return;

    const payloadSync = {
      fecha: new Date().toISOString().split("T")[0],
      descanso: rutinaHogar.descanso,
      disposicion: rutinaHogar.disposicion,
      preparacion: rutinaHogar.preparacion,
      completado: true,
    };

    try {
      await api.updateAlumno(alumno.id, {
        gravedad_tdah: gravedadTdah,
        ficha_medica: JSON.stringify(fichaMedica),
        sincronizador_matutino: JSON.stringify(payloadSync),
      });

      await api.enviarMensajeChat({
        alumno_id: alumno.id,
        destinatario_rol: "TODOS",
        contenido: `Sincronizador Pre-Aula Confirmado [Gravedad TDAH: ${gravedadTdah}] · Pauta 1 (Sueño): ${rutinaHogar.descanso} · Pauta 2 (Disposición): ${rutinaHogar.disposicion} · Pauta 3 (Preparación): ${rutinaHogar.preparacion}. Listo para armar Agenda Diaria.`,
        tipo_mensaje: "AVISO_FAMILIA",
      });

      setSincronizadorCompletadoHoy(true);
      setMostrarGateMatutino(false);
      mostrarNotificacion("Sincronizador Pre-Aula enviado. Docente y Terapeuta ya pueden personalizar la Agenda Diaria.");
      cargar();
    } catch (err) {
      console.error("Error guardando sincronizador matutino:", err);
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

  const agendaAlumno = React.useMemo(() => {
    if (!alumno?.agenda_diaria) return [];
    try {
      return JSON.parse(alumno.agenda_diaria);
    } catch {
      return [];
    }
  }, [alumno]);

  const slidesPresFamiliar = React.useMemo(() => {
    if (!presSeleccionada) return [];
    try {
      return JSON.parse(presSeleccionada.diapositivas_json || "[]");
    } catch {
      return [];
    }
  }, [presSeleccionada]);

  const currentSlideFam = slidesPresFamiliar[slideFamiliarIdx] || null;

  // Renderizado individual de cada panel movible
  const renderPanelPorId = (panelId) => {
    if (!alumno) return null;

    switch (panelId) {
      case "SINCRONIZADOR":
        return (
          <MovablePanel
            key="SINCRONIZADOR"
            id="SINCRONIZADOR"
            title="Sincronizador Matutino Pre-Aula (3 Pautas)"
            badgeText="Paso 2 · Contexto Hogar"
            accentColor="#059669"
            Icon={Sun}
            isExpanded={Boolean(panelesExpandidos["SINCRONIZADOR"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("SINCRONIZADOR", "UP")}
            onMoveDown={() => moverPanel("SINCRONIZADOR", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual="FAMILIAR"
                titulo="¿Por qué se relevan estas 3 pautas antes de entrar al aula?"
                porQueSeUsa="En el TDAH, la arquitectura del sueño y la carga dopaminérgica matutina modifican directamente la corteza prefrontal y la tolerancia a la frustración durante las primeras 4 horas escolares."
                comoAyudaAlAlumno="Permite que el Docente y el Terapeuta calibren la duración de los bloques de la Agenda Diaria antes de que el alumno sufra fatiga o sobrecarga."
                color="#059669"
              />
            }
            headerRight={
              <button
                type="button"
                onClick={handleConfirmarSincronizadorPreAula}
                className="btn btn-primary btn-sm"
                style={{ background: "#059669", fontSize: "0.75rem" }}
              >
                <Send size={13} />
                <span>Sincronizar con Aula</span>
              </button>
            }
          >
            <div className="grid-3" style={{ gap: "0.65rem" }}>
              <div style={{ background: "#f8fafc", padding: "0.7rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: "800", color: "#0f172a", display: "block", marginBottom: "0.3rem" }}>
                  1. Calidad del Sueño
                </label>
                <select
                  value={rutinaHogar.descanso}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, descanso: e.target.value })}
                  className="form-select"
                  style={{ fontSize: "0.78rem", padding: "0.4rem" }}
                >
                  <option value="Descanso Completo y Reparador (8 hs)">Descanso Completo (8 hs)</option>
                  <option value="Sueño Intermitente (Sugerir Pausas)">Sueño Intermitente (+Pausas)</option>
                  <option value="Despertar con Inquietud Motriz">Despertar con Inquietud</option>
                </select>
              </div>

              <div style={{ background: "#f8fafc", padding: "0.7rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: "800", color: "#0f172a", display: "block", marginBottom: "0.3rem" }}>
                  2. Foco e Impulsividad Hoy
                </label>
                <select
                  value={rutinaHogar.disposicion}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, disposicion: e.target.value })}
                  className="form-select"
                  style={{ fontSize: "0.78rem", padding: "0.4rem" }}
                >
                  <option value="Motivado y con Foco Activo">Motivado y Foco Activo</option>
                  <option value="Energía Alta / Necesita Descarga Motriz">Energía Alta / Descarga Motriz</option>
                  <option value="Sensible a Ruidos / Requiere Anticipación">Sensible a Ruidos</option>
                </select>
              </div>

              <div style={{ background: "#f8fafc", padding: "0.7rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <label style={{ fontSize: "0.72rem", fontWeight: "800", color: "#0f172a", display: "block", marginBottom: "0.3rem" }}>
                  3. Regulación Pre-Escuela
                </label>
                <select
                  value={rutinaHogar.preparacion}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, preparacion: e.target.value })}
                  className="form-select"
                  style={{ fontSize: "0.78rem", padding: "0.4rem" }}
                >
                  <option value="Desayuno sin pantallas + Anticipación visual del día">Sin pantallas + Anticipación</option>
                  <option value="Se anticipó la rutina escolar con pictogramas">Rutina con Pictogramas</option>
                  <option value="Lleva auriculares atenuadores en la mochila">Lleva Filtro Auditivo</option>
                </select>
              </div>
            </div>
          </MovablePanel>
        );

      case "FICHA_MEDICA":
        return (
          <MovablePanel
            key="FICHA_MEDICA"
            id="FICHA_MEDICA"
            title="Ficha Médica Profesional y Gravedad TDAH"
            badgeText={`Paso 1 · ${gravedadTdah}`}
            accentColor="#2563eb"
            Icon={FileText}
            isExpanded={Boolean(panelesExpandidos["FICHA_MEDICA"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("FICHA_MEDICA", "UP")}
            onMoveDown={() => moverPanel("FICHA_MEDICA", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual="FAMILIAR"
                titulo="¿Por qué se personaliza según el nivel de gravedad clínica del TDAH?"
                porQueSeUsa="El DSM-5 clasifica el TDAH en Leve, Moderado o Severo según el grado de interferencia en la memoria de trabajo y el control inhibitorio."
                comoAyudaAlAlumno="Ajusta automáticamente la ventana máxima de foco (15 min en Leve, 10 min en Moderado, 6 min en Severo) para que ninguna actividad supere su umbral biológico."
                color="#2563eb"
              />
            }
          >
            {/* Selector visual de Gravedad TDAH */}
            <div style={{ display: "flex", gap: "0.45rem", marginBottom: "0.75rem" }}>
              {[
                { nivel: "LEVE", label: "Leve (Foco 15m)", color: "#059669", min: 15 },
                { nivel: "MODERADO", label: "Moderado (Foco 10m)", color: "#d97706", min: 10 },
                { nivel: "SEVERO", label: "Severo (Foco 6m)", color: "#dc2626", min: 6 },
              ].map((g) => (
                <button
                  key={g.nivel}
                  type="button"
                  onClick={() => {
                    setGravedadTdah(g.nivel);
                    setFichaMedica((prev) => ({ ...prev, ventana_atencional_min: g.min }));
                  }}
                  style={{
                    flex: 1,
                    padding: "0.45rem",
                    borderRadius: "8px",
                    border: `2px solid ${gravedadTdah === g.nivel ? g.color : "#e2e8f0"}`,
                    background: gravedadTdah === g.nivel ? `${g.color}15` : "white",
                    color: gravedadTdah === g.nivel ? g.color : "#64748b",
                    fontSize: "0.74rem",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="grid-2" style={{ gap: "0.5rem" }}>
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "#475569" }}>Diagnóstico DSM-5</label>
                <input
                  type="text"
                  value={fichaMedica.subtipo_dsm5}
                  onChange={(e) => setFichaMedica({ ...fichaMedica, subtipo_dsm5: e.target.value })}
                  className="form-input"
                  style={{ fontSize: "0.76rem", padding: "0.38rem 0.6rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "#475569" }}>Profesional / Matrícula</label>
                <input
                  type="text"
                  value={fichaMedica.profesional_emisor}
                  onChange={(e) => setFichaMedica({ ...fichaMedica, profesional_emisor: e.target.value })}
                  className="form-input"
                  style={{ fontSize: "0.76rem", padding: "0.38rem 0.6rem" }}
                />
              </div>
            </div>
          </MovablePanel>
        );

      case "AGENDA":
        return (
          <MovablePanel
            key="AGENDA"
            id="AGENDA"
            title="Agenda Diaria Personalizada del Alumno"
            badgeText="Paso 3 · En Aula"
            accentColor="#0284c7"
            Icon={Calendar}
            isExpanded={Boolean(panelesExpandidos["AGENDA"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("AGENDA", "UP")}
            onMoveDown={() => moverPanel("AGENDA", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual="FAMILIAR"
                titulo="¿Por qué se arma una Agenda Diaria predecible?"
                porQueSeUsa="La anticipación estructurada reduce la hiperreactividad amigdalina y la ansiedad de transición en niños con TDAH."
                comoAyudaAlAlumno="El alumno sabe exactamente qué bloque corto sigue y cuándo tendrá su pausa motora."
                color="#0284c7"
              />
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {agendaAlumno.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.45rem 0.7rem",
                    borderRadius: "8px",
                    background: item.completado ? "#ecfdf5" : "#f8fafc",
                    border: `1px solid ${item.completado ? "#a7f3d0" : "#e2e8f0"}`,
                    fontSize: "0.78rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: "800", color: "#0284c7" }}>{item.hora}</span>
                    <span style={{ fontWeight: "700", color: "#0f172a" }}>{item.bloque}</span>
                  </div>
                  <span className="badge" style={{ background: "#e0f2fe", color: "#0369a1", fontSize: "0.65rem" }}>
                    {item.duracion}
                  </span>
                </div>
              ))}
            </div>
          </MovablePanel>
        );

      case "TAREAS_ADAPTADAS":
        return (
          <MovablePanel
            key="TAREAS_ADAPTADAS"
            id="TAREAS_ADAPTADAS"
            title="Actividades Adaptadas TDAH y Reporte al Equipo"
            badgeText="Pasos 5 y 6 · Hogar"
            accentColor="#7c3aed"
            Icon={ClipboardList}
            isExpanded={Boolean(panelesExpandidos["TAREAS_ADAPTADAS"])}
            onToggleExpand={toggleExpandPanel}
            onMoveUp={() => moverPanel("TAREAS_ADAPTADAS", "UP")}
            onMoveDown={() => moverPanel("TAREAS_ADAPTADAS", "DOWN")}
            onDragStart={handleDragStart}
            onDragOver={() => {}}
            onDrop={handleDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual="FAMILIAR"
                titulo="¿Por qué la tarea pasa primero por el Terapeuta antes de llegar a casa?"
                porQueSeUsa="La micro-segmentación (Chunking) evita el bloqueo ejecutivo frente a consignas extensas."
                comoAyudaAlAlumno="Permite completar la actividad en 3 pasos cortos con pausas kinestésicas y cerrar con retroalimentación positiva."
                color="#7c3aed"
              />
            }
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "0.85rem" }}>
              {tareasVisiblesTutor.map((t) => {
                const nombreDocente = t.docente ? `${t.docente.nombre} ${t.docente.apellido}` : "Rol Docente";
                const nombreTerapeuta = t.terapeuta ? `${t.terapeuta.nombre} ${t.terapeuta.apellido}` : "Rol Terapeuta";
                const nombreTutor = user ? `${user.nombre} ${user.apellido}` : "Familiar Tutor";

                return (
                  <div
                    key={t.id}
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #cbd5e1",
                      borderRadius: "12px",
                      padding: "0.95rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
                        <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{t.titulo}</strong>
                        <span
                          className="badge"
                          style={{
                            background: t.estado === "COMPLETADA_POR_TUTOR" ? "#d1fae5" : "#dbeafe",
                            color: t.estado === "COMPLETADA_POR_TUTOR" ? "#065f46" : "#1e40af",
                            fontSize: "0.65rem",
                          }}
                        >
                          {t.estado === "COMPLETADA_POR_TUTOR" ? "Reportada" : "Adaptada TDAH"}
                        </span>
                      </div>

                      {/* Chips compactos con nombres de Docente, Terapeuta y Tutor */}
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                        <span style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "0.18rem 0.5rem", borderRadius: "6px", fontSize: "0.68rem", fontWeight: "700" }}>
                          Docente: {nombreDocente}
                        </span>
                        <span style={{ background: "#f5f3ff", color: "#6d28d9", border: "1px solid #ddd6fe", padding: "0.18rem 0.5rem", borderRadius: "6px", fontSize: "0.68rem", fontWeight: "700" }}>
                          Terapeuta: {nombreTerapeuta}
                        </span>
                        <span style={{ background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0", padding: "0.18rem 0.5rem", borderRadius: "6px", fontSize: "0.68rem", fontWeight: "700" }}>
                          Tutor: {nombreTutor}
                        </span>
                      </div>

                      <div style={{ background: "white", border: "1.5px solid #8b5cf6", borderRadius: "10px", padding: "0.7rem", marginBottom: "0.6rem" }}>
                        <div style={{ fontSize: "0.72rem", fontWeight: "800", color: "#6d28d9", marginBottom: "0.25rem" }}>
                          Pautas TDAH: {t.pautas_tdah_aplicadas}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#1e293b", whiteSpace: "pre-line", lineHeight: 1.45 }}>
                          {t.adaptacion_terapeuta}
                        </div>
                      </div>

                      {/* Micro-pasos interactivos en 1 clic */}
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
                        {["Paso 1", "Pausa 2m", "Paso 2", "Logro"].map((lbl, idxP) => {
                          const checked = Boolean(checksHogar[`${t.id}-${idxP}`]);
                          return (
                            <button
                              key={idxP}
                              type="button"
                              onClick={() => toggleCheckPasoHogar(t.id, idxP)}
                              style={{
                                padding: "0.25rem 0.55rem",
                                borderRadius: "6px",
                                border: `1px solid ${checked ? "#10b981" : "#cbd5e1"}`,
                                background: checked ? "#ecfdf5" : "white",
                                color: checked ? "#065f46" : "#475569",
                                fontSize: "0.7rem",
                                fontWeight: "700",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <CheckCircle2 size={12} color={checked ? "#10b981" : "#94a3b8"} />
                              <span>{lbl}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

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
                      className="btn btn-primary btn-sm btn-block"
                      style={{ background: "var(--familiar-color)" }}
                    >
                      <Send size={14} />
                      <span>{t.reporte_tutor ? "Editar Reporte Enviado" : "Reportar Desempeño a Docente / Terapeuta"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </MovablePanel>
        );

      case "PRESENTACIONES":
        return (
          <MovablePanel
            key="PRESENTACIONES"
            id="PRESENTACIONES"
            title="Presentaciones Adaptadas del Aula"
            badgeText="Paso 4 · Visual"
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
                rolActual="FAMILIAR"
                titulo="¿Por qué se utilizan diapositivas de consigna única?"
                porQueSeUsa="Elimina el ruido visual periférico que compite por la atención selectiva en el TDAH."
                comoAyudaAlAlumno="Permite repasar en casa exactamente la misma secuencia visual vista en el aula."
                color="#4f46e5"
              />
            }
          >
            {presSeleccionada && currentSlideFam ? (
              <div style={{ background: "#0f172a", color: "white", borderRadius: "12px", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.7rem", background: "#4f46e5", padding: "0.15rem 0.5rem", borderRadius: "6px", fontWeight: "800" }}>
                    Paso {slideFamiliarIdx + 1} de {slidesPresFamiliar.length}
                  </span>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button
                      type="button"
                      onClick={() => setSlideFamiliarIdx((p) => (p - 1 + slidesPresFamiliar.length) % slidesPresFamiliar.length)}
                      className="btn btn-sm"
                      style={{ background: "rgba(255,255,255,0.12)", color: "white", padding: "0.2rem 0.45rem" }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlideFamiliarIdx((p) => (p + 1) % slidesPresFamiliar.length)}
                      className="btn btn-sm"
                      style={{ background: "#10b981", color: "white", padding: "0.2rem 0.45rem" }}
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: "800", fontSize: "0.95rem", marginBottom: "0.25rem" }}>{currentSlideFam.titulo}</div>
                <div style={{ fontSize: "0.82rem", color: "#cbd5e1" }}>{currentSlideFam.instruccion}</div>
              </div>
            ) : (
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Sin presentaciones activas.</div>
            )}
          </MovablePanel>
        );

      case "CHAT":
        return (
          <MovablePanel
            key="CHAT"
            id="CHAT"
            title="Comunicación Directa Docente · Terapeuta · Tutor"
            badgeText="Tiempo Real"
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
            <ChatCoordinacion alumnos={alumnos} rolActual="FAMILIAR" titulo="Canal Directo Tripartito" />
          </MovablePanel>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* MODAL / GATE PRINCIPAL PRE-AULA: SE LE PIDE AL FAMILIAR CONTESTAR LAS 3 PAUTAS ANTES DE ENTRAR AL AULA */}
      {mostrarGateMatutino && alumno && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: "620px", borderTop: "5px solid #059669" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <span className="badge badge-familiar">Paso Prioritario Antes de Entrar al Aula</span>
              <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#059669" }}>
                Alumno: {alumno.nombre} {alumno.apellido}
              </span>
            </div>

            <h2 style={{ fontSize: "1.35rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.25rem" }}>
              Sincronizador Matutino del Hogar con Aula y Gabinete
            </h2>
            <p style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "0.5rem" }}>
              Completa estas 3 pautas rápidas para que el Docente y el Terapeuta armen hoy la Agenda Diaria personalizada según cómo ingresa al aula.
            </p>

            <ExplicacionMedicaToggle
              rolActual="FAMILIAR"
              titulo="Fundamento Clínico del Sincronizador Pre-Aula"
              porQueSeUsa="El nivel de sueño y la regulación sensorial matutina determinan la disponibilidad de dopamina y norepinefrina en el alumno con TDAH."
              comoAyudaAlAlumno="Permite adaptar en tiempo real la exigencia cognitiva y las pausas motoras de su agenda escolar de hoy."
              color="#059669"
            />

            <form onSubmit={handleConfirmarSincronizadorPreAula} style={{ marginTop: "0.9rem" }}>
              <div className="form-group">
                <label className="form-label">Nivel de Gravedad / Apoyo Clínico TDAH (Ficha Médica)</label>
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  {["LEVE", "MODERADO", "SEVERO"].map((niv) => (
                    <button
                      key={niv}
                      type="button"
                      onClick={() => setGravedadTdah(niv)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: `2px solid ${gravedadTdah === niv ? "#059669" : "#cbd5e1"}`,
                        background: gravedadTdah === niv ? "#ecfdf5" : "white",
                        color: gravedadTdah === niv ? "#065f46" : "#475569",
                        fontWeight: "800",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                      }}
                    >
                      TDAH {niv}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Pauta 1 · ¿Cómo descansó anoche?</label>
                <select
                  value={rutinaHogar.descanso}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, descanso: e.target.value })}
                  className="form-select"
                >
                  <option value="Descanso Completo y Reparador (8 hs)">Descanso Completo y Reparador (8 hs)</option>
                  <option value="Sueño Intermitente (Sugerir Pausas)">Sueño Intermitente (Sugerir más pausas activas)</option>
                  <option value="Despertar Temprano con Inquietud Motriz">Despertar Temprano con Inquietud Motriz</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pauta 2 · ¿Cómo está su foco y energía antes de entrar al aula?</label>
                <select
                  value={rutinaHogar.disposicion}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, disposicion: e.target.value })}
                  className="form-select"
                >
                  <option value="Motivado y con Foco Activo">Motivado y con Foco Activo</option>
                  <option value="Energía Alta / Necesita Descarga Motriz">Energía Alta / Necesita Descarga Motriz Temprana</option>
                  <option value="Sensible a Ruidos / Requiere Anticipación">Sensible a Estímulos Sonoros / Requiere Anticipación</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pauta 3 · Preparación sensorial previa en casa</label>
                <select
                  value={rutinaHogar.preparacion}
                  onChange={(e) => setRutinaHogar({ ...rutinaHogar, preparacion: e.target.value })}
                  className="form-select"
                >
                  <option value="Desayuno sin pantallas + Anticipación visual del día">Desayuno sin pantallas + Anticipación visual del día</option>
                  <option value="Se anticipó la rutina escolar con pictogramas">Se anticipó la rutina escolar con pictogramas</option>
                  <option value="Lleva auriculares atenuadores en la mochila">Lleva auriculares atenuadores en la mochila</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginTop: "1.1rem" }}>
                <button
                  type="button"
                  onClick={() => setMostrarGateMatutino(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Omitir por ahora
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: "#059669" }}
                >
                  <Send size={16} />
                  <span>Confirmar 3 Pautas y Enviar al Aula y Gabinete</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cabecera Compacta y Moderna */}
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
            <span className="badge badge-familiar">Familiar / Tutor</span>
            {alumno && <SemaforoBadge estado={alumno.semaforo_actual} size="sm" />}
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#0f172a", marginTop: "0.15rem" }}>
            Espacio Familiar · Paneles Interactivos Desplazables
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setMostrarGateMatutino(true)}
          className="btn btn-primary btn-sm"
          style={{ background: "#059669" }}
        >
          <Sun size={15} />
          <span>Abrir Sincronizador Pre-Aula (3 Pautas)</span>
        </button>
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
          if (num === 2) setMostrarGateMatutino(true);
        }}
        alumno={alumno}
        tieneSincronizadorHoy={sincronizadorCompletadoHoy || Boolean(alumno?.sincronizador_matutino)}
        tieneAgendaHoy={agendaAlumno.length > 0}
        tieneTareasAdaptadas={tareasVisiblesTutor.length > 0}
      />

      {/* Grilla Bento Dinámica con Paneles Movibles y Reordenables */}
      <div className="dynamic-bento-grid">
        {ordenPaneles.map((id) => renderPanelPorId(id))}
      </div>

      {/* MODAL PARA ENVIAR REPORTE / MENSAJE AL DOCENTE, AL TERAPEUTA O A AMBOS */}
      {tareaParaReportar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#0f172a", marginBottom: "0.25rem" }}>
              Reportar Desempeño de la Actividad
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "0.85rem" }}>
              Actividad: <strong>{tareaParaReportar.titulo}</strong>
            </p>

            <form onSubmit={handleEnviarReporteActividad}>
              <div className="form-group">
                <label className="form-label">Destinatario del Reporte</label>
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
                <label className="form-label">Nivel de Enfoque Observado</label>
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
                <label className="form-label">Observación Breve desde Casa</label>
                <textarea
                  rows={3}
                  required
                  value={formReporteTutor.reporte_tutor}
                  onChange={(e) =>
                    setFormReporteTutor({
                      ...formReporteTutor,
                      reporte_tutor: e.target.value,
                    })
                  }
                  className="form-textarea"
                  placeholder="Ej: Con los 3 pasos cortos y el reloj visual completó todo sin frustrarse..."
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
                  <Send size={15} />
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
