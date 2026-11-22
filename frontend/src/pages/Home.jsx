import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { PitchPresentationDeck } from "../components/pitch/PitchPresentationDeck.jsx";
import { QuickDemoButtons } from "../components/common/QuickDemoButtons.jsx";
import { ExplicacionMedicaToggle } from "../components/common/ExplicacionMedicaToggle.jsx";
import { MovablePanel } from "../components/common/MovablePanel.jsx";
import {
  GraduationCap,
  Stethoscope,
  Users,
  ArrowRight,
  Zap,
  Brain,
  FileText,
  Sun,
  Calendar,
  BookOpen,
  Sliders,
  Send,
  CheckCircle2,
  Clock,
  Activity,
} from "lucide-react";

export const Home = () => {
  const { user, roles, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const rolActivo = roles?.[0] || "DOCENTE";

  // Estado del Simulador en Vivo del Circuito TDAH en la Portada
  const [pasoActivoHero, setPasoActivoHero] = useState(2);
  const [gravedadDemo, setGravedadDemo] = useState("MODERADO");
  const [pautaSuenoDemo, setPautaSuenoDemo] = useState("Descanso Completo (8 hs)");
  const [pautaFocoDemo, setPautaFocoDemo] = useState("Motivado y Foco Activo");
  const [pautaPrepDemo, setPautaPrepDemo] = useState("Sin pantallas + Anticipación");

  // Orden de Paneles Movibles en la Página Principal
  const [ordenHomePanels, setOrdenHomePanels] = useState([
    "SIMULADOR_CIRCUITO",
    "SHOWCASE_CARRUSEL",
    "ROLES_INTERACTIVOS",
  ]);
  const [expandedHomePanels, setExpandedHomePanels] = useState({
    SIMULADOR_CIRCUITO: true,
    SHOWCASE_CARRUSEL: true,
    ROLES_INTERACTIVOS: true,
  });
  const [draggedHomeId, setDraggedHomeId] = useState(null);

  const moverHomePanel = (id, dir) => {
    setOrdenHomePanels((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      const tIdx = dir === "UP" ? idx - 1 : idx + 1;
      if (tIdx < 0 || tIdx >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[idx];
      copy[idx] = copy[tIdx];
      copy[tIdx] = tmp;
      return copy;
    });
  };

  const toggleExpandHome = (id) => {
    setExpandedHomePanels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleHomeDrop = (e, targetId) => {
    if (!draggedHomeId || draggedHomeId === targetId) return;
    setOrdenHomePanels((prev) => {
      const copy = [...prev];
      const f = copy.indexOf(draggedHomeId);
      const t = copy.indexOf(targetId);
      if (f === -1 || t === -1) return prev;
      copy.splice(f, 1);
      copy.splice(t, 0, draggedHomeId);
      return copy;
    });
    setDraggedHomeId(null);
  };

  const ingresarDirectoPorRol = async (rolTarget) => {
    try {
      await quickDemoLogin(rolTarget);
      if (rolTarget === "DOCENTE") navigate("/dashboard/docente");
      else if (rolTarget === "TERAPEUTA") navigate("/dashboard/terapeuta");
      else navigate("/dashboard/familiar");
    } catch (e) {
      navigate("/login");
    }
  };

  const pasosCircuito = [
    { num: 1, code: "01", titulo: "Ficha Médica", sub: `TDAH ${gravedadDemo}`, Icono: FileText, color: "#3b82f6" },
    { num: 2, code: "02", titulo: "Sincronizador", sub: "3 Pautas Pre-Aula", Icono: Sun, color: "#10b981" },
    { num: 3, code: "03", titulo: "Agenda Diaria", sub: gravedadDemo === "SEVERO" ? "Bloques 6 min" : gravedadDemo === "LEVE" ? "Bloques 15 min" : "Bloques 10 min", Icono: Calendar, color: "#06b6d4" },
    { num: 4, code: "04", titulo: "Actividad", sub: "Presentación Aula", Icono: BookOpen, color: "#6366f1" },
    { num: 5, code: "05", titulo: "Adaptación AT", sub: "Chunking + Reloj", Icono: Sliders, color: "#a855f7" },
    { num: 6, code: "06", titulo: "Envío al Padre", sub: "Hogar y Reporte", Icono: Send, color: "#34d399" },
  ];

  const renderHomePanel = (id) => {
    switch (id) {
      case "SIMULADOR_CIRCUITO":
        return (
          <MovablePanel
            key="SIMULADOR_CIRCUITO"
            id="SIMULADOR_CIRCUITO"
            title="Simulador Interactivo en Vivo: Circuito Personalizado TDAH (6 Etapas)"
            badgeText="Interactivo · Haz clic en cada etapa"
            accentColor="#2563eb"
            Icon={Activity}
            isExpanded={Boolean(expandedHomePanels["SIMULADOR_CIRCUITO"])}
            onToggleExpand={toggleExpandHome}
            onMoveUp={() => moverHomePanel("SIMULADOR_CIRCUITO", "UP")}
            onMoveDown={() => moverHomePanel("SIMULADOR_CIRCUITO", "DOWN")}
            onDragStart={(e, panelId) => setDraggedHomeId(panelId)}
            onDragOver={() => {}}
            onDrop={handleHomeDrop}
            explicacionMedica={
              <ExplicacionMedicaToggle
                rolActual={rolActivo === "TERAPEUTA" ? "TERAPEUTA" : "DOCENTE"}
                titulo="¿Cómo funciona el circuito clínico-pedagógico de 6 etapas?"
                porQueSeUsa="Articula el diagnóstico neurológico (gravedad del TDAH) con el estado matutino del hogar antes de que el alumno ingrese al aula."
                comoAyudaAlAlumno="Garantiza que la agenda diaria y las tareas enviadas a casa respeten su ventana real de foco atencional."
                color="#2563eb"
              />
            }
          >
            {/* Pista Horizontal de los 6 Pasos Seleccionables */}
            <div
              className="horizontal-scroll-track"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(140px, 1fr))",
                gap: "0.55rem",
                overflowX: "auto",
                marginBottom: "1rem",
                paddingBottom: "0.25rem",
              }}
            >
              {pasosCircuito.map((p) => {
                const IconC = p.Icono;
                const active = pasoActivoHero === p.num;
                return (
                  <button
                    key={p.num}
                    type="button"
                    onClick={() => setPasoActivoHero(p.num)}
                    style={{
                      background: active
                        ? `linear-gradient(135deg, ${p.color} 0%, #0f172a 140%)`
                        : "#f8fafc",
                      color: active ? "white" : "#0f172a",
                      border: `2px solid ${active ? p.color : "#e2e8f0"}`,
                      borderRadius: "14px",
                      padding: "0.75rem 0.6rem",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.22s ease",
                      transform: active ? "translateY(-3px)" : "none",
                      boxShadow: active ? `0 10px 20px -5px ${p.color}45` : "none",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "9px",
                        background: active ? "rgba(255,255,255,0.2)" : `${p.color}15`,
                        color: active ? "white" : p.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 0.35rem auto",
                      }}
                    >
                      <IconC size={16} />
                    </div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "900" }}>
                      {p.code}. {p.titulo}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: active ? "#e2e8f0" : "#64748b", fontWeight: "700", marginTop: "0.1rem" }}>
                      {p.sub}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Escenario Interactivo según la Etapa Seleccionada */}
            <div
              style={{
                background: "linear-gradient(145deg, #0f172a 0%, #1e293b 100%)",
                color: "white",
                borderRadius: "16px",
                padding: "1.25rem 1.5rem",
                border: "1px solid #334155",
              }}
            >
              {pasoActivoHero === 1 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ flex: 1, minWidth: "250px" }}>
                    <span className="badge" style={{ background: "#2563eb", color: "white", marginBottom: "0.4rem" }}>
                      ETAPA 1 · FICHA MÉDICA Y GRAVEDAD TDAH
                    </span>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: "900", marginBottom: "0.35rem" }}>
                      Selecciona la Gravedad Clínica para Calibrar toda la Plataforma:
                    </h4>
                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
                      {[
                        { id: "LEVE", label: "TDAH Leve (Foco 15 min)", col: "#10b981" },
                        { id: "MODERADO", label: "TDAH Moderado (Foco 10 min)", col: "#f59e0b" },
                        { id: "SEVERO", label: "TDAH Severo (Foco 6 min)", col: "#ef4444" },
                      ].map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGravedadDemo(g.id)}
                          style={{
                            padding: "0.5rem 0.9rem",
                            borderRadius: "10px",
                            border: `2px solid ${gravedadDemo === g.id ? g.col : "rgba(255,255,255,0.15)"}`,
                            background: gravedadDemo === g.id ? `${g.col}30` : "rgba(255,255,255,0.05)",
                            color: "white",
                            fontWeight: "800",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                          }}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPasoActivoHero(2)}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Siguiente: Sincronizador Pre-Aula</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {pasoActivoHero === 2 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <div>
                      <span className="badge" style={{ background: "#10b981", color: "white", marginBottom: "0.3rem" }}>
                        ETAPA 2 · SINCRONIZADOR MATUTINO PRE-AULA (PRIORITARIO)
                      </span>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "900" }}>
                        El Familiar contesta las 3 pautas antes de entrar al aula:
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => ingresarDirectoPorRol("FAMILIAR")}
                      className="btn btn-primary btn-sm"
                      style={{ background: "#059669" }}
                    >
                      <span>Abrir Sincronizador Real en Portal Familiar</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="grid-3" style={{ gap: "0.65rem" }}>
                    <div style={{ background: "rgba(255,255,255,0.06)", padding: "0.75rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)" }}>
                      <div style={{ fontSize: "0.72rem", color: "#6ee7b7", fontWeight: "800", marginBottom: "0.3rem" }}>
                        1. Descanso Nocturno
                      </div>
                      <select
                        value={pautaSuenoDemo}
                        onChange={(e) => setPautaSuenoDemo(e.target.value)}
                        className="form-select"
                        style={{ background: "#0f172a", color: "white", borderColor: "#334155", fontSize: "0.78rem", padding: "0.4rem" }}
                      >
                        <option value="Descanso Completo (8 hs)">Descanso Completo (8 hs)</option>
                        <option value="Sueño Intermitente (+Pausas)">Sueño Intermitente (+Pausas)</option>
                        <option value="Despertar con Inquietud">Despertar con Inquietud</option>
                      </select>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.06)", padding: "0.75rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)" }}>
                      <div style={{ fontSize: "0.72rem", color: "#6ee7b7", fontWeight: "800", marginBottom: "0.3rem" }}>
                        2. Disposición Matutina
                      </div>
                      <select
                        value={pautaFocoDemo}
                        onChange={(e) => setPautaFocoDemo(e.target.value)}
                        className="form-select"
                        style={{ background: "#0f172a", color: "white", borderColor: "#334155", fontSize: "0.78rem", padding: "0.4rem" }}
                      >
                        <option value="Motivado y Foco Activo">Motivado y Foco Activo</option>
                        <option value="Energía Alta / Descarga Motriz">Energía Alta / Descarga Motriz</option>
                        <option value="Sensible a Ruidos">Sensible a Ruidos</option>
                      </select>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.06)", padding: "0.75rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)" }}>
                      <div style={{ fontSize: "0.72rem", color: "#6ee7b7", fontWeight: "800", marginBottom: "0.3rem" }}>
                        3. Preparación en Casa
                      </div>
                      <select
                        value={pautaPrepDemo}
                        onChange={(e) => setPautaPrepDemo(e.target.value)}
                        className="form-select"
                        style={{ background: "#0f172a", color: "white", borderColor: "#334155", fontSize: "0.78rem", padding: "0.4rem" }}
                      >
                        <option value="Sin pantallas + Anticipación">Sin pantallas + Anticipación</option>
                        <option value="Rutina con Pictogramas">Rutina con Pictogramas</option>
                        <option value="Lleva Filtro Auditivo">Lleva Filtro Auditivo</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {pasoActivoHero === 3 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span className="badge" style={{ background: "#06b6d4", color: "white", marginBottom: "0.35rem" }}>
                      ETAPA 3 · AGENDA DIARIA PERSONALIZADA EN AULA
                    </span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "0.35rem" }}>
                      Agenda Calibrada para TDAH {gravedadDemo} + "{pautaSuenoDemo}" + "{pautaFocoDemo}"
                    </h4>
                    <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                      <span style={{ background: "rgba(255,255,255,0.1)", padding: "0.3rem 0.65rem", borderRadius: "8px", fontSize: "0.76rem", fontWeight: "700" }}>
                        08:15 · Anclaje Visual (5m)
                      </span>
                      <span style={{ background: "rgba(59,130,246,0.25)", border: "1px solid #3b82f6", padding: "0.3rem 0.65rem", borderRadius: "8px", fontSize: "0.76rem", fontWeight: "700" }}>
                        08:25 · Misión 1 ({gravedadDemo === "SEVERO" ? "6m" : gravedadDemo === "LEVE" ? "15m" : "10m"})
                      </span>
                      <span style={{ background: "rgba(245,158,11,0.25)", border: "1px solid #f59e0b", padding: "0.3rem 0.65rem", borderRadius: "8px", fontSize: "0.76rem", fontWeight: "700" }}>
                        08:40 · Pausa Kinestésica (3m)
                      </span>
                      <span style={{ background: "rgba(16,185,129,0.25)", border: "1px solid #10b981", padding: "0.3rem 0.65rem", borderRadius: "8px", fontSize: "0.76rem", fontWeight: "700" }}>
                        09:00 · Economía de Fichas
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => ingresarDirectoPorRol("DOCENTE")}
                    className="btn btn-primary btn-sm"
                  >
                    <span>Ir a Agenda del Docente</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {pasoActivoHero === 4 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span className="badge" style={{ background: "#6366f1", color: "white", marginBottom: "0.35rem" }}>
                      ETAPA 4 · PRESENTACIÓN ADAPTADA Y ASIGNACIÓN DE ACTIVIDAD
                    </span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "0.25rem" }}>
                      El Docente proyecta diapositivas sin distractores y envía la tarea al Terapeuta
                    </h4>
                    <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
                      1 sola consigna por pantalla · Reloj visual integrado · Envío individual o en conjunto
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => ingresarDirectoPorRol("DOCENTE")}
                    className="btn btn-primary btn-sm"
                    style={{ background: "#4f46e5" }}
                  >
                    <span>Probar Creador de Presentaciones</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {pasoActivoHero === 5 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span className="badge" style={{ background: "#a855f7", color: "white", marginBottom: "0.35rem" }}>
                      ETAPA 5 · ADAPTACIÓN TDAH Y REGULADOR DEL TERAPEUTA
                    </span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "0.25rem" }}>
                      El Terapeuta micro-segmenta la tarea (Chunking) según gravedad {gravedadDemo}
                    </h4>
                    <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
                      Regulador Neuro-Ejecutivo · Time-Timer Pomodoro · Autoinstrucciones de Meichenbaum
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => ingresarDirectoPorRol("TERAPEUTA")}
                    className="btn btn-primary btn-sm"
                    style={{ background: "#7c3aed" }}
                  >
                    <span>Abrir Regulador del Terapeuta</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {pasoActivoHero === 6 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <span className="badge" style={{ background: "#10b981", color: "white", marginBottom: "0.35rem" }}>
                      ETAPA 6 · RECEPCIÓN EN EL HOGAR Y REPORTE AL EQUIPO
                    </span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "0.25rem" }}>
                      El Padre recibe la tarea adaptada con el nombre del Docente y Terapeuta y envía su reporte
                    </h4>
                    <div style={{ fontSize: "0.8rem", color: "#cbd5e1" }}>
                      Checklist de micro-pasos en casa · Envío de reporte al Docente, al Terapeuta o a Ambos
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => ingresarDirectoPorRol("FAMILIAR")}
                    className="btn btn-primary btn-sm"
                    style={{ background: "#059669" }}
                  >
                    <span>Ver Tareas en Portal Familiar</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </MovablePanel>
        );

      case "SHOWCASE_CARRUSEL":
        return (
          <MovablePanel
            key="SHOWCASE_CARRUSEL"
            id="SHOWCASE_CARRUSEL"
            title="Showcase Interactivo: Proyecto SincroAula"
            badgeText="5 Módulos Dinámicos"
            accentColor="#7c3aed"
            Icon={Zap}
            isExpanded={Boolean(expandedHomePanels["SHOWCASE_CARRUSEL"])}
            onToggleExpand={toggleExpandHome}
            onMoveUp={() => moverHomePanel("SHOWCASE_CARRUSEL", "UP")}
            onMoveDown={() => moverHomePanel("SHOWCASE_CARRUSEL", "DOWN")}
            onDragStart={(e, panelId) => setDraggedHomeId(panelId)}
            onDragOver={() => {}}
            onDrop={handleHomeDrop}
          >
            <PitchPresentationDeck />
          </MovablePanel>
        );

      case "ROLES_INTERACTIVOS":
        return (
          <MovablePanel
            key="ROLES_INTERACTIVOS"
            id="ROLES_INTERACTIVOS"
            title="Acceso Directo a los 3 Roles Sincronizados"
            badgeText="Clic para entrar"
            accentColor="#059669"
            Icon={Users}
            isExpanded={Boolean(expandedHomePanels["ROLES_INTERACTIVOS"])}
            onToggleExpand={toggleExpandHome}
            onMoveUp={() => moverHomePanel("ROLES_INTERACTIVOS", "UP")}
            onMoveDown={() => moverHomePanel("ROLES_INTERACTIVOS", "DOWN")}
            onDragStart={(e, panelId) => setDraggedHomeId(panelId)}
            onDragOver={() => {}}
            onDrop={handleHomeDrop}
          >
            <div className="grid-3">
              {/* Docente */}
              <div className="card movable-panel-card" style={{ borderTop: "4px solid var(--docente-color)", padding: "1.1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ background: "var(--docente-bg)", padding: "0.45rem", borderRadius: "10px", color: "var(--docente-color)" }}>
                      <GraduationCap size={20} />
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "900" }}>Rol Docente</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => ingresarDirectoPorRol("DOCENTE")}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: "0.72rem", padding: "0.3rem 0.65rem" }}
                  >
                    Entrar →
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.4rem" }}>
                  {["Ficha Médica + Gravedad", "Agenda Diaria", "Presentaciones Adaptadas", "Tareas → Terapeuta", "Chat en Vivo"].map((chip) => (
                    <span key={chip} style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: "0.7rem", fontWeight: "700", padding: "0.18rem 0.5rem", borderRadius: "6px" }}>
                      {chip}
                    </span>
                  ))}
                </div>

                <ExplicacionMedicaToggle
                  rolActual={rolActivo === "TERAPEUTA" ? "TERAPEUTA" : "DOCENTE"}
                  titulo="Fundamento Clínico del Panel Docente"
                  porQueSeUsa="Combina la gravedad del TDAH con las 3 pautas matutinas del hogar para calibrar la agenda diaria y las presentaciones sin distractores."
                  comoAyudaAlAlumno="Sostiene la atención ejecutiva y previene la fatiga en memoria de trabajo."
                  color="#2563eb"
                />
              </div>

              {/* Terapeuta */}
              <div className="card movable-panel-card" style={{ borderTop: "4px solid var(--terapeuta-color)", padding: "1.1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ background: "var(--terapeuta-bg)", padding: "0.45rem", borderRadius: "10px", color: "var(--terapeuta-color)" }}>
                      <Stethoscope size={20} />
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "900" }}>Rol Terapeuta</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => ingresarDirectoPorRol("TERAPEUTA")}
                    className="btn btn-primary btn-sm"
                    style={{ background: "#7c3aed", fontSize: "0.72rem", padding: "0.3rem 0.65rem" }}
                  >
                    Entrar →
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {["Adaptador Chunking TDAH", "Regulador por Gravedad", "Time-Timer Pomodoro", "Esfera 4-4-4", "Meichenbaum", "Matriz ABC"].map((chip) => (
                    <span key={chip} style={{ background: "#f5f3ff", color: "#5b21b6", fontSize: "0.7rem", fontWeight: "700", padding: "0.18rem 0.5rem", borderRadius: "6px" }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Familiar */}
              <div className="card movable-panel-card" style={{ borderTop: "4px solid var(--familiar-color)", padding: "1.1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.65rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ background: "var(--familiar-bg)", padding: "0.45rem", borderRadius: "10px", color: "var(--familiar-color)" }}>
                      <Users size={20} />
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "900" }}>Familiar / Tutor</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => ingresarDirectoPorRol("FAMILIAR")}
                    className="btn btn-primary btn-sm"
                    style={{ background: "#059669", fontSize: "0.72rem", padding: "0.3rem 0.65rem" }}
                  >
                    Entrar →
                  </button>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.4rem" }}>
                  {["Sincronizador 3 Pautas Pre-Aula", "Ficha Médica", "Tareas Adaptadas", "Nombres Docente y AT", "Reporte Directo"].map((chip) => (
                    <span key={chip} style={{ background: "#ecfdf5", color: "#065f46", fontSize: "0.7rem", fontWeight: "700", padding: "0.18rem 0.5rem", borderRadius: "6px" }}>
                      {chip}
                    </span>
                  ))}
                </div>

                <ExplicacionMedicaToggle
                  rolActual={rolActivo === "TERAPEUTA" ? "TERAPEUTA" : "FAMILIAR"}
                  titulo="Fundamento Clínico del Portal Familiar"
                  porQueSeUsa="Releva las 3 pautas matutinas antes de entrar al aula y entrega actividades ya adaptadas por el Terapeuta."
                  comoAyudaAlAlumno="Permite trabajar en casa en pasos cortos y reportar el resultado al Docente y al Terapeuta."
                  color="#059669"
                />
              </div>
            </div>
          </MovablePanel>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {/* Hero Moderno de Alto Impacto Visual con Poco Texto */}
      <section
        style={{
          background: "linear-gradient(145deg, #090d16 0%, #1e1b4b 55%, #0f172a 100%)",
          color: "white",
          borderRadius: "24px",
          padding: "2rem 1.75rem",
          marginBottom: "1.5rem",
          border: "1px solid #334155",
          boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.45)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.25rem" }}>
          <div style={{ maxWidth: "600px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "rgba(56, 189, 248, 0.14)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                padding: "0.28rem 0.8rem",
                borderRadius: "999px",
                fontSize: "0.74rem",
                fontWeight: "800",
                color: "#38bdf8",
                marginBottom: "0.75rem",
              }}
            >
              <Brain size={14} />
              <span>PLATAFORMA NEUROEDUCATIVA TDAH · PANELES DESPLAZABLES</span>
            </div>

            <h1
              style={{
                fontSize: "clamp(1.85rem, 4vw, 2.65rem)",
                fontWeight: "900",
                lineHeight: 1.12,
                marginBottom: "0.85rem",
              }}
            >
              Sincro<span style={{ color: "#38bdf8" }}>Aula</span>: Ficha Médica, Sincronizador Pre-Aula y Adaptación en{" "}
              <span style={{ color: "#34d399" }}>Tiempo Real</span>
            </h1>

            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {user ? (
                <Link
                  to={
                    roles.includes("DOCENTE")
                      ? "/dashboard/docente"
                      : roles.includes("TERAPEUTA")
                      ? "/dashboard/terapeuta"
                      : roles.includes("FAMILIAR")
                      ? "/dashboard/familiar"
                      : "/dashboard/admin"
                  }
                  className="btn btn-primary"
                >
                  <span>Ir a mi Panel Interactivo</span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    <span>Registrarse por Rol</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-secondary"
                    style={{ background: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    Iniciar Sesión
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Tarjeta de Acceso Instantáneo en 1 Clic */}
          <div style={{ flex: 1, minWidth: "300px", maxWidth: "460px" }}>
            <QuickDemoButtons />
          </div>
        </div>
      </section>

      {/* Paneles Interactivos Desplazables de la Página Principal */}
      <div className="dynamic-bento-grid">
        {ordenHomePanels.map((id) => renderHomePanel(id))}
      </div>
    </div>
  );
};

export default Home;
