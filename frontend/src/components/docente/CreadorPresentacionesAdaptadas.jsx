import React, { useState, useEffect } from "react";
import { api } from "../../services/api.js";
import {
  Presentation,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Award,
  Sliders,
} from "lucide-react";

export const CreadorPresentacionesAdaptadas = ({ alumnos = [] }) => {
  const [presentaciones, setPresentaciones] = useState([]);
  const [presActiva, setPresActiva] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Interactividad en vivo dentro de cada diapositiva (Checklist de alumno y Reloj Visual por diapositiva)
  const [pasosCompletados, setPasosCompletados] = useState({});
  const [timerSlide, setTimerSlide] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    objetivo_pedagogico: "",
    alumno_id: "",
    perfil_sensorial_tdah: "Diseño Minimalista sin Distractores + 1 Consigna por Diapositiva (TDAH)",
    paso1_titulo: "1. Nos preparamos y miramos el objetivo",
    paso1_instruccion: "Despejamos la mesa dejando solo el material de hoy y respiramos profundo.",
    paso2_titulo: "2. Misión Principal en Foco (5 min)",
    paso2_instruccion: "Realizamos la actividad paso a paso siguiendo el reloj visual sin apurarnos.",
    paso3_titulo: "3. Pausa Activa y Celebración de Logro",
    paso3_instruccion: "Estiramos los brazos, guardamos los materiales y marcamos nuestro logro del día.",
    paso4_titulo: "4. Cierre y Metacognición Guiada",
    paso4_instruccion: "Revisamos cómo nos sentimos durante la actividad y compartimos con el equipo.",
  });

  const cargarPresentaciones = async () => {
    try {
      const res = await api.getPresentaciones();
      if (res.ok) {
        setPresentaciones(res.presentaciones);
        if (res.presentaciones.length > 0 && !presActiva) {
          setPresActiva(res.presentaciones[0]);
          setSlideIndex(0);
        }
      }
    } catch (e) {
      console.error("Error cargando presentaciones:", e);
    }
  };

  useEffect(() => {
    cargarPresentaciones();
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSlide > 0) {
      interval = setInterval(() => {
        setTimerSlide((prev) => prev - 1);
      }, 1000);
    } else if (timerSlide === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSlide]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const togglePasoCompletado = (idx) => {
    const key = `${presActiva?.id || 0}-${idx}`;
    setPasosCompletados((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const cargarPlantillaTDAH = (tipo) => {
    if (tipo === "MATEMATICA") {
      setForm({
        ...form,
        titulo: "Conteo Visual con Bloques y Colores (Adaptada TDAH)",
        objetivo_pedagogico: "Asociar cantidades del 1 al 5 mediante manipulación concreta y bloques de atención de 5 minutos.",
        perfil_sensorial_tdah: "Micro-segmentación (Chunking) + Apoyo Manipulativo Kinestésico",
        paso1_titulo: "1. Preparamos solo 5 bloques sobre la mesa",
        paso1_instruccion: "Quitamos otros útiles para evitar distracciones visuales y tocamos cada bloque.",
        paso2_titulo: "2. Agrupamos por color con el Reloj Visual",
        paso2_instruccion: "Durante 5 minutos juntamos los bloques azules de un lado y los rojos del otro.",
        paso3_titulo: "3. Pausa Motora Kinestésica (2 min)",
        paso3_instruccion: "Nos ponemos de pie, estiramos los brazos y caminamos hasta el pizarrón.",
        paso4_titulo: "4. Conteo Final y Registro de Logro",
        paso4_instruccion: "Contamos en voz alta los dos grupos y marcamos la misión cumplida en el tablero.",
      });
    } else if (tipo === "CUENTO") {
      setForm({
        ...form,
        titulo: "Secuencia Narrativa en 4 Viñetas Visuales (TDAH)",
        objetivo_pedagogico: "Fortalecer la memoria de trabajo y la atención sostenida mediante apoyos pictográficos.",
        perfil_sensorial_tdah: "Doble Canal (Auditivo + Pictográfico) + Reducción de Texto",
        paso1_titulo: "1. Identificamos al personaje principal",
        paso1_instruccion: "Observamos la primera lámina grande y nombramos al personaje sin estímulos de fondo.",
        paso2_titulo: "2. Ordenamos las 2 tarjetas de acción",
        paso2_instruccion: "Colocamos en el pizarrón qué ocurrió primero y qué ocurrió después.",
        paso3_titulo: "3. Pausa de Regulación Respiratoria",
        paso3_instruccion: "Realizamos 3 respiraciones lentas antes de pasar al desenlace de la historia.",
        paso4_titulo: "4. Cierre Creativo y Refuerzo Positivo",
        paso4_instruccion: "Elegimos nuestra tarjeta de logro para contar cómo nos sentimos en la actividad.",
      });
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    const diapositivas = [
      {
        orden: 1,
        titulo: form.paso1_titulo,
        instruccion: form.paso1_instruccion,
        apoyo_visual: "Anclaje Atencional · Bajo Estímulo Distractor",
        pauta_tdah: "Preparación ejecutiva y reducción de sobrecarga visual",
      },
      {
        orden: 2,
        titulo: form.paso2_titulo,
        instruccion: form.paso2_instruccion,
        apoyo_visual: "Bloque de Foco Corto (5 min)",
        pauta_tdah: "Consigna única micro-segmentada (Chunking)",
      },
      {
        orden: 3,
        titulo: form.paso3_titulo,
        instruccion: form.paso3_instruccion,
        apoyo_visual: "Descarga Kinestésica Regulada (2 min)",
        pauta_tdah: "Prevención de fatiga atencional e impulsividad",
      },
      {
        orden: 4,
        titulo: form.paso4_titulo,
        instruccion: form.paso4_instruccion,
        apoyo_visual: "Refuerzo Positivo Inmediato",
        pauta_tdah: "Cierre motivacional dopaminérgico y metacognición",
      },
    ];

    try {
      const res = await api.createPresentacion({
        titulo: form.titulo,
        objetivo_pedagogico: form.objetivo_pedagogico,
        alumno_id: form.alumno_id || null,
        perfil_sensorial_tdah: form.perfil_sensorial_tdah,
        diapositivas,
        compartida_con_familia: true,
      });
      if (res.ok) {
        setMostrarFormulario(false);
        await cargarPresentaciones();
        setPresActiva(res.presentacion);
        setSlideIndex(0);
      }
    } catch (err) {
      alert("Error al crear presentación: " + err.message);
    }
  };

  const slidesActivas = React.useMemo(() => {
    if (!presActiva) return [];
    try {
      return JSON.parse(presActiva.diapositivas_json || "[]");
    } catch {
      return [];
    }
  }, [presActiva]);

  const currentSlide = slidesActivas[slideIndex] || null;
  const isCurrentSlideCompleted = Boolean(pasosCompletados[`${presActiva?.id || 0}-${slideIndex}`]);

  return (
    <div className="card" style={{ borderTop: "4px solid #7c3aed", marginBottom: "2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <div style={{ background: "#f5f3ff", padding: "0.6rem", borderRadius: "10px", color: "#7c3aed" }}>
            <Presentation size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#0f172a" }}>
              Creación de Presentaciones Adaptadas para el Alumno (TDAH)
            </h2>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
              Carrusel pedagógico interactivo con consigna única, temporizador visual integrado y validación de pasos para el alumno
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="btn btn-primary"
          style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
        >
          <PlusCircle size={18} />
          <span>{mostrarFormulario ? "Cerrar Editor" : "Nueva Presentación Adaptada"}</span>
        </button>
      </div>

      {/* Formulario Creador de Presentaciones Adaptadas */}
      {mostrarFormulario && (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "14px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ fontWeight: "800", color: "#1e293b", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sliders size={17} color="#7c3aed" />
              <span>Editor de Presentación Adaptada en 4 Diapositivas (TDAH)</span>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" onClick={() => cargarPlantillaTDAH("MATEMATICA")} className="btn btn-secondary btn-sm">
                Plantilla: Conteo y Bloques
              </button>
              <button type="button" onClick={() => cargarPlantillaTDAH("CUENTO")} className="btn btn-secondary btn-sm">
                Plantilla: Cuento Secuenciado
              </button>
            </div>
          </div>

          <form onSubmit={handleCrear}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Título de la Presentación Adaptada</label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="form-input"
                  placeholder="Ej: Secuencia Visual de Formas y Colores"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Destinatario (Alumno en Particular o Sala en Conjunto)</label>
                <select
                  value={form.alumno_id}
                  onChange={(e) => setForm({ ...form, alumno_id: e.target.value })}
                  className="form-select"
                >
                  <option value="">Toda la Sala (En Conjunto)</option>
                  {alumnos.map((a) => (
                    <option key={a.id} value={a.id}>
                      Alumno: {a.nombre} {a.apellido} ({a.diagnostico})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Objetivo Pedagógico</label>
                <input
                  type="text"
                  required
                  value={form.objetivo_pedagogico}
                  onChange={(e) => setForm({ ...form, objetivo_pedagogico: e.target.value })}
                  className="form-input"
                  placeholder="Ej: Sostener la atención ejecutiva en pasos cortos..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Perfil de Adaptación Neuroeducativa TDAH</label>
                <select
                  value={form.perfil_sensorial_tdah}
                  onChange={(e) => setForm({ ...form, perfil_sensorial_tdah: e.target.value })}
                  className="form-select"
                >
                  <option value="Diseño Minimalista sin Distractores + 1 Consigna por Diapositiva (TDAH)">
                    Diseño Minimalista sin Distractores + 1 Consigna por Diapositiva
                  </option>
                  <option value="Micro-segmentación (Chunking) + Pausas Activas Kinestésicas">
                    Micro-segmentación (Chunking) + Pausas Activas Kinestésicas
                  </option>
                  <option value="Doble Canal Visual-Auditivo + Temporizador Pomodoro Escolar">
                    Doble Canal Visual-Auditivo + Temporizador Pomodoro Escolar
                  </option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ marginBottom: "1rem" }}>
              <div style={{ background: "white", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "800", fontSize: "0.8rem", color: "#2563eb", marginBottom: "0.4rem" }}>
                  Diapositiva 1 (Anclaje y Preparación)
                </div>
                <input
                  type="text"
                  required
                  value={form.paso1_titulo}
                  onChange={(e) => setForm({ ...form, paso1_titulo: e.target.value })}
                  className="form-input"
                  style={{ marginBottom: "0.4rem", fontSize: "0.825rem" }}
                />
                <textarea
                  rows={2}
                  required
                  value={form.paso1_instruccion}
                  onChange={(e) => setForm({ ...form, paso1_instruccion: e.target.value })}
                  className="form-textarea"
                  style={{ fontSize: "0.8rem", minHeight: "55px" }}
                />
              </div>

              <div style={{ background: "white", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "800", fontSize: "0.8rem", color: "#7c3aed", marginBottom: "0.4rem" }}>
                  Diapositiva 2 (Misión Corta en Foco)
                </div>
                <input
                  type="text"
                  required
                  value={form.paso2_titulo}
                  onChange={(e) => setForm({ ...form, paso2_titulo: e.target.value })}
                  className="form-input"
                  style={{ marginBottom: "0.4rem", fontSize: "0.825rem" }}
                />
                <textarea
                  rows={2}
                  required
                  value={form.paso2_instruccion}
                  onChange={(e) => setForm({ ...form, paso2_instruccion: e.target.value })}
                  className="form-textarea"
                  style={{ fontSize: "0.8rem", minHeight: "55px" }}
                />
              </div>

              <div style={{ background: "white", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "800", fontSize: "0.8rem", color: "#d97706", marginBottom: "0.4rem" }}>
                  Diapositiva 3 (Pausa Activa Kinestésica)
                </div>
                <input
                  type="text"
                  required
                  value={form.paso3_titulo}
                  onChange={(e) => setForm({ ...form, paso3_titulo: e.target.value })}
                  className="form-input"
                  style={{ marginBottom: "0.4rem", fontSize: "0.825rem" }}
                />
                <textarea
                  rows={2}
                  required
                  value={form.paso3_instruccion}
                  onChange={(e) => setForm({ ...form, paso3_instruccion: e.target.value })}
                  className="form-textarea"
                  style={{ fontSize: "0.8rem", minHeight: "55px" }}
                />
              </div>

              <div style={{ background: "white", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontWeight: "800", fontSize: "0.8rem", color: "#059669", marginBottom: "0.4rem" }}>
                  Diapositiva 4 (Cierre y Logro)
                </div>
                <input
                  type="text"
                  required
                  value={form.paso4_titulo}
                  onChange={(e) => setForm({ ...form, paso4_titulo: e.target.value })}
                  className="form-input"
                  style={{ marginBottom: "0.4rem", fontSize: "0.825rem" }}
                />
                <textarea
                  rows={2}
                  required
                  value={form.paso4_instruccion}
                  onChange={(e) => setForm({ ...form, paso4_instruccion: e.target.value })}
                  className="form-textarea"
                  style={{ fontSize: "0.8rem", minHeight: "55px" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button type="button" onClick={() => setMostrarFormulario(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar y Publicar Presentación Adaptada
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Selector de Presentaciones y Carrusel Interactivo para el Alumno */}
      {presentaciones.length > 0 && (
        <div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            {presentaciones.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPresActiva(p);
                  setSlideIndex(0);
                }}
                className="btn btn-sm"
                style={{
                  background: presActiva?.id === p.id ? "#7c3aed" : "#f1f5f9",
                  color: presActiva?.id === p.id ? "white" : "#334155",
                  border: "1px solid #cbd5e1",
                }}
              >
                <Presentation size={14} />
                <span>{p.titulo}</span>
              </button>
            ))}
          </div>

          {presActiva && currentSlide && (
            <div
              style={{
                background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
                color: "white",
                borderRadius: "18px",
                overflow: "hidden",
                border: "1px solid #334155",
                boxShadow: "0 20px 35px -10px rgba(15, 23, 42, 0.35)",
              }}
            >
              {/* Barra de Progreso de Diapositivas */}
              <div style={{ width: "100%", height: "5px", background: "rgba(255,255,255,0.08)" }}>
                <div
                  style={{
                    width: `${((slideIndex + 1) / slidesActivas.length) * 100}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              {/* Barra Superior del Visor con Temporizador En Vivo para el Alumno */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(15, 23, 42, 0.55)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <span style={{ background: "#7c3aed", color: "white", padding: "0.22rem 0.65rem", borderRadius: "6px", fontSize: "0.7rem", fontWeight: "800" }}>
                    MODO AULA · BAJO ESTÍMULO DISTRACTOR
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#cbd5e1", fontWeight: "600" }}>
                    {presActiva.alumno ? `Alumno: ${presActiva.alumno.nombre} ${presActiva.alumno.apellido}` : "Asignada a Toda la Sala"}
                  </span>
                </div>

                {/* Mini Reloj Visual Integrado en la Presentación */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.07)", padding: "0.3rem 0.7rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <Clock size={14} color="#38bdf8" />
                  <span style={{ fontFamily: "monospace", fontWeight: "800", fontSize: "0.88rem", color: "#38bdf8" }}>
                    {formatTime(timerSlide)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTimerRunning(!timerRunning)}
                    style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center" }}
                    title="Iniciar/Pausar tiempo de diapositiva"
                  >
                    {timerRunning ? <Pause size={13} /> : <Play size={13} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSlide(300);
                    }}
                    style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center" }}
                    title="Reiniciar 5 min"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Mini-pestañas de pasos */}
              <div style={{ display: "flex", gap: "0.4rem", padding: "0.75rem 1.5rem 0 1.5rem", flexWrap: "wrap" }}>
                {slidesActivas.map((s, idx) => {
                  const done = Boolean(pasosCompletados[`${presActiva.id}-${idx}`]);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSlideIndex(idx)}
                      style={{
                        padding: "0.3rem 0.7rem",
                        borderRadius: "8px",
                        border: `1px solid ${idx === slideIndex ? "#38bdf8" : done ? "#10b981" : "rgba(255,255,255,0.12)"}`,
                        background: idx === slideIndex ? "rgba(56, 189, 248, 0.2)" : done ? "rgba(16, 185, 129, 0.18)" : "rgba(255,255,255,0.04)",
                        color: done ? "#6ee7b7" : idx === slideIndex ? "white" : "#94a3b8",
                        fontSize: "0.74rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <CheckCircle2 size={13} color={done ? "#10b981" : "#64748b"} />
                      <span>Paso {idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* Contenido Central de la Diapositiva */}
              <div style={{ padding: "1.5rem 1.75rem", minHeight: "175px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "1.55rem", fontWeight: "900", color: "white", marginBottom: "0.55rem" }}>
                    {currentSlide.titulo}
                  </h3>
                  <p style={{ fontSize: "1.1rem", color: "#e2e8f0", lineHeight: 1.6, marginBottom: "1.1rem" }}>
                    {currentSlide.instruccion}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(16, 185, 129, 0.18)", border: "1px solid #10b981", color: "#6ee7b7", padding: "0.32rem 0.75rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "700" }}>
                      {currentSlide.apoyo_visual}
                    </span>
                    {currentSlide.pauta_tdah && (
                      <span style={{ background: "rgba(59, 130, 246, 0.18)", border: "1px solid #3b82f6", color: "#93c5fd", padding: "0.32rem 0.75rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "600" }}>
                        Pauta TDAH: {currentSlide.pauta_tdah}
                      </span>
                    )}
                  </div>

                  {/* Botón Interactivo para que el Alumno o Docente marque el Paso como Completado */}
                  <button
                    type="button"
                    onClick={() => togglePasoCompletado(slideIndex)}
                    className="btn btn-sm"
                    style={{
                      background: isCurrentSlideCompleted ? "#10b981" : "rgba(255,255,255,0.12)",
                      color: "white",
                      border: `1px solid ${isCurrentSlideCompleted ? "#10b981" : "rgba(255,255,255,0.25)"}`,
                    }}
                  >
                    <CheckCircle2 size={15} />
                    <span>{isCurrentSlideCompleted ? "Paso Completado por el Alumno" : "Marcar Paso como Completado"}</span>
                  </button>
                </div>
              </div>

              {/* Pie del Carrusel */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1.5rem",
                  background: "rgba(15, 23, 42, 0.5)",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                  Objetivo: {presActiva.objetivo_pedagogico}
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setSlideIndex((prev) => (prev - 1 + slidesActivas.length) % slidesActivas.length)}
                    className="btn btn-sm"
                    style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlideIndex((prev) => (prev + 1) % slidesActivas.length)}
                    className="btn btn-sm"
                    style={{ background: "#2563eb", color: "white" }}
                  >
                    Siguiente Paso <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreadorPresentacionesAdaptadas;
