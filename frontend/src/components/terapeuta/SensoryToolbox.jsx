import React, { useState, useEffect } from "react";
import {
  Wind,
  Headphones,
  Compass,
  ShieldAlert,
  Clock,
  Brain,
  Award,
  Activity,
  CheckCircle2,
  RotateCcw,
  Play,
  Pause,
  Star,
  Gift,
  BarChart3,
  FileText,
  Send,
  Sliders,
} from "lucide-react";

export const SensoryToolbox = ({ onEstrategiaSeleccionada, onEmitirRecomendacionRapida }) => {
  const [herramientaActiva, setHerramientaActiva] = useState("REGULADOR");

  // 0. Regulador Neuro-Ejecutivo Interactivo por Gravedad TDAH (Leve, Moderado, Severo)
  const [gravedadActiva, setGravedadActiva] = useState("MODERADO");
  const [nivelAtencion, setNivelAtencion] = useState(84);
  const [nivelHiperactividad, setNivelHiperactividad] = useState(28);
  const [nivelRegulacionEmocional, setNivelRegulacionEmocional] = useState(90);

  // 1. Estado de Respiración 4-4-4
  const [faseRespiracion, setFaseRespiracion] = useState("Inhala");
  const [contador, setContador] = useState(4);
  const [activo, setActivo] = useState(false);

  // 2. Estado de Temporizador Visual Time-Timer / Pomodoro TDAH
  const [tiempoPomodoro, setTiempoPomodoro] = useState(300);
  const [pomodoroTotal, setPomodoroTotal] = useState(300);
  const [pomodoroActivo, setPomodoroActivo] = useState(false);

  // 3. Estado de Autoinstrucciones de Meichenbaum
  const [pasosMeichenbaum, setPasosMeichenbaum] = useState([
    { id: 1, titulo: "1. PARO Y MIRO", desc: "Freno manos, respiro y observo.", completado: true },
    { id: 2, titulo: "2. ¿QUÉ TENGO QUE HACER?", desc: "Enfoco solo en el Paso 1.", completado: false },
    { id: 3, titulo: "3. LO HAGO CON CALMA", desc: "Avanzo con mi reloj visual.", completado: false },
    { id: 4, titulo: "4. REVISO Y ME FELICITO", desc: "Valido mi logro.", completado: false },
  ]);

  // 4. Economía de Fichas Dopaminérgica TDAH
  const [estrellasGanadas, setEstrellasGanadas] = useState(3);
  const metaEstrellas = 5;

  // 5. Registro Funcional ABC
  const [abcForm, setAbcForm] = useState({
    antecedente: "Transición con ruido",
    conducta: "Inquietud motora",
    consecuencia: "Chunking 2 pasos + Pausa 2m",
  });
  const [abcGuardado, setAbcGuardado] = useState(false);

  useEffect(() => {
    let timer = null;
    if (activo) {
      timer = setInterval(() => {
        setContador((prev) => {
          if (prev > 1) return prev - 1;
          if (faseRespiracion === "Inhala") {
            setFaseRespiracion("Sostén");
            return 4;
          } else if (faseRespiracion === "Sostén") {
            setFaseRespiracion("Exhala");
            return 4;
          } else {
            setFaseRespiracion("Inhala");
            return 4;
          }
        });
      }, 1000);
    } else {
      setFaseRespiracion("Inhala");
      setContador(4);
    }
    return () => clearInterval(timer);
  }, [activo, faseRespiracion]);

  useEffect(() => {
    let timer = null;
    if (pomodoroActivo && tiempoPomodoro > 0) {
      timer = setInterval(() => {
        setTiempoPomodoro((prev) => prev - 1);
      }, 1000);
    } else if (tiempoPomodoro === 0) {
      setPomodoroActivo(false);
    }
    return () => clearInterval(timer);
  }, [pomodoroActivo, tiempoPomodoro]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const aplicarPresetGravedad = (grav) => {
    setGravedadActiva(grav);
    if (grav === "LEVE") {
      setNivelAtencion(88);
      setNivelHiperactividad(22);
      setNivelRegulacionEmocional(92);
      setPomodoroTotal(900);
      setTiempoPomodoro(900);
    } else if (grav === "MODERADO") {
      setNivelAtencion(76);
      setNivelHiperactividad(42);
      setNivelRegulacionEmocional(80);
      setPomodoroTotal(600);
      setTiempoPomodoro(600);
    } else {
      setNivelAtencion(58);
      setNivelHiperactividad(68);
      setNivelRegulacionEmocional(64);
      setPomodoroTotal(360);
      setTiempoPomodoro(360);
    }
  };

  const togglePasoMeichenbaum = (id) => {
    setPasosMeichenbaum((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completado: !p.completado } : p))
    );
  };

  const tecnicas = [
    { titulo: "Chunking 3 Pasos", color: "#10b981", icono: Compass },
    { titulo: "Pausa Kinestésica 2m", color: "#f59e0b", icono: Activity },
    { titulo: "Filtro Auditivo 22dB", color: "#3b82f6", icono: Headphones },
    { titulo: "Rincón Propioceptivo", color: "#8b5cf6", icono: ShieldAlert },
  ];

  return (
    <div>
      {/* Pestañas Visuales Compactas del Regulador */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.35rem", marginBottom: "0.85rem" }}>
        {[
          { id: "REGULADOR", label: "Regulador", Icono: Sliders },
          { id: "POMODORO", label: "Time-Timer", Icono: Clock },
          { id: "RESPIRACION", label: "4-4-4 Vagal", Icono: Wind },
          { id: "MEICHENBAUM", label: "Meichenbaum", Icono: Brain },
          { id: "FICHAS", label: "Fichas", Icono: Award },
          { id: "ABC", label: "Matriz ABC", Icono: FileText },
        ].map((tab) => {
          const IconC = tab.Icono;
          const active = herramientaActiva === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setHerramientaActiva(tab.id)}
              className="btn btn-sm"
              style={{
                background: active ? "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)" : "#f1f5f9",
                color: active ? "white" : "#334155",
                fontSize: "0.71rem",
                padding: "0.38rem 0.45rem",
                fontWeight: "800",
              }}
            >
              <IconC size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* PESTAÑA 0: REGULADOR NEURO-EJECUTIVO INTERACTIVO POR GRAVEDAD TDAH */}
      {herramientaActiva === "REGULADOR" && (
        <div
          style={{
            background: "linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%)",
            color: "white",
            borderRadius: "14px",
            padding: "1rem",
            marginBottom: "0.85rem",
            border: "1px solid #312e81",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.65rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#c4b5fd" }}>
              CALIBRADOR SEGÚN GRAVEDAD TDAH
            </span>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              {["LEVE", "MODERADO", "SEVERO"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => aplicarPresetGravedad(g)}
                  style={{
                    padding: "0.2rem 0.5rem",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "0.66rem",
                    fontWeight: "800",
                    cursor: "pointer",
                    background:
                      gravedadActiva === g
                        ? g === "SEVERO"
                          ? "#ef4444"
                          : g === "MODERADO"
                          ? "#f59e0b"
                          : "#10b981"
                        : "rgba(255,255,255,0.12)",
                    color: "white",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* 3 Medidores Circulares / Sliders Visuales en Vivo */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "0.75rem", textAlign: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", padding: "0.55rem", borderRadius: "10px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#34d399" }}>{nivelAtencion}%</div>
              <div style={{ fontSize: "0.65rem", color: "#cbd5e1", fontWeight: "700" }}>Foco Sostenido</div>
              <input
                type="range"
                min="0"
                max="100"
                value={nivelAtencion}
                onChange={(e) => setNivelAtencion(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#10b981", marginTop: "0.25rem" }}
              />
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", padding: "0.55rem", borderRadius: "10px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#fbbf24" }}>{nivelHiperactividad}%</div>
              <div style={{ fontSize: "0.65rem", color: "#cbd5e1", fontWeight: "700" }}>Impulsividad</div>
              <input
                type="range"
                min="0"
                max="100"
                value={nivelHiperactividad}
                onChange={(e) => setNivelHiperactividad(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#f59e0b", marginTop: "0.25rem" }}
              />
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", padding: "0.55rem", borderRadius: "10px" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#60a5fa" }}>{nivelRegulacionEmocional}%</div>
              <div style={{ fontSize: "0.65rem", color: "#cbd5e1", fontWeight: "700" }}>Autorregulación</div>
              <input
                type="range"
                min="0"
                max="100"
                value={nivelRegulacionEmocional}
                onChange={(e) => setNivelRegulacionEmocional(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#3b82f6", marginTop: "0.25rem" }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onEmitirRecomendacionRapida &&
              onEmitirRecomendacionRapida(
                `Telemetría Regulador TDAH [${gravedadActiva}]: Foco ${nivelAtencion}% · Impulsividad ${nivelHiperactividad}% · Autorregulación ${nivelRegulacionEmocional}%.`
              )
            }
            className="btn btn-primary btn-sm btn-block"
            style={{ background: "#7c3aed", fontSize: "0.74rem" }}
          >
            <Send size={13} />
            <span>Sincronizar Regulador con Aula y Familia</span>
          </button>
        </div>
      )}

      {/* PESTAÑA 1: Respiración 4-4-4 */}
      {herramientaActiva === "RESPIRACION" && (
        <div
          style={{
            background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
            border: "1px solid #ddd6fe",
            borderRadius: "14px",
            padding: "1rem",
            textAlign: "center",
            marginBottom: "0.85rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0.5rem 0" }}>
            <div
              style={{
                width: activo ? (faseRespiracion === "Exhala" ? "70px" : "100px") : "80px",
                height: activo ? (faseRespiracion === "Exhala" ? "70px" : "100px") : "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "900",
                boxShadow: activo ? "0 0 25px rgba(124, 58, 237, 0.45)" : "none",
                transition: "all 3.8s ease-in-out",
              }}
            >
              <span style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>{activo ? faseRespiracion : "4-4-4"}</span>
              {activo && <span style={{ fontSize: "1.35rem", lineHeight: 1 }}>{contador}</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActivo(!activo)}
            className="btn btn-sm"
            style={{ background: activo ? "#ef4444" : "#7c3aed", color: "white" }}
          >
            {activo ? "Detener" : "Activar Esfera 4-4-4"}
          </button>
        </div>
      )}

      {/* PESTAÑA 2: Temporizador Visual Time-Timer */}
      {herramientaActiva === "POMODORO" && (
        <div
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "1rem",
            textAlign: "center",
            marginBottom: "0.85rem",
          }}
        >
          <div style={{ fontSize: "1.95rem", fontWeight: "900", color: "#0f172a", fontFamily: "monospace", marginBottom: "0.35rem" }}>
            {formatTime(tiempoPomodoro)}
          </div>

          <div style={{ width: "100%", height: "8px", background: "#cbd5e1", borderRadius: "999px", overflow: "hidden", marginBottom: "0.65rem" }}>
            <div
              style={{
                width: `${(tiempoPomodoro / pomodoroTotal) * 100}%`,
                height: "100%",
                background: tiempoPomodoro > 60 ? "#2563eb" : "#f59e0b",
                transition: "width 0.5s linear",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.35rem", marginBottom: "0.6rem" }}>
            {[
              { label: "6m (Severo)", sec: 360 },
              { label: "10m (Moderado)", sec: 600 },
              { label: "15m (Leve)", sec: 900 },
            ].map((b) => (
              <button
                key={b.sec}
                type="button"
                onClick={() => {
                  setPomodoroActivo(false);
                  setPomodoroTotal(b.sec);
                  setTiempoPomodoro(b.sec);
                }}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: "0.68rem", padding: "0.2rem 0.45rem" }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.45rem" }}>
            <button
              type="button"
              onClick={() => setPomodoroActivo(!pomodoroActivo)}
              className="btn btn-primary btn-sm"
            >
              {pomodoroActivo ? <Pause size={13} /> : <Play size={13} />}
              <span>{pomodoroActivo ? "Pausar" : "Iniciar"}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPomodoroActivo(false);
                setTiempoPomodoro(pomodoroTotal);
              }}
              className="btn btn-secondary btn-sm"
            >
              <RotateCcw size={13} />
            </button>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: Autoinstrucciones de Meichenbaum */}
      {herramientaActiva === "MEICHENBAUM" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.38rem", marginBottom: "0.85rem" }}>
          {pasosMeichenbaum.map((p) => (
            <div
              key={p.id}
              onClick={() => togglePasoMeichenbaum(p.id)}
              style={{
                padding: "0.45rem 0.7rem",
                borderRadius: "8px",
                background: p.completado ? "#ecfdf5" : "#f8fafc",
                border: `1px solid ${p.completado ? "#10b981" : "#e2e8f0"}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "0.76rem", fontWeight: "800", color: p.completado ? "#065f46" : "#1e293b" }}>
                  {p.titulo}
                </div>
                <div style={{ fontSize: "0.68rem", color: "#64748b" }}>{p.desc}</div>
              </div>
              <CheckCircle2 size={16} color={p.completado ? "#10b981" : "#cbd5e1"} />
            </div>
          ))}
        </div>
      )}

      {/* PESTAÑA 4: Economía de Fichas */}
      {herramientaActiva === "FICHAS" && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "12px",
            padding: "0.85rem",
            textAlign: "center",
            marginBottom: "0.85rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setEstrellasGanadas(num)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "none",
                  background: num <= estrellasGanadas ? "#f59e0b" : "white",
                  color: num <= estrellasGanadas ? "white" : "#cbd5e1",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Star size={18} fill={num <= estrellasGanadas ? "white" : "none"} />
              </button>
            ))}
          </div>
          <div style={{ fontSize: "0.72rem", fontWeight: "800", color: "#92400e" }}>
            {estrellasGanadas}/{metaEstrellas} Micro-Metas Cumplidas
          </div>
        </div>
      )}

      {/* PESTAÑA 5: Matriz Conductual ABC */}
      {herramientaActiva === "ABC" && (
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
            borderRadius: "12px",
            padding: "0.75rem",
            marginBottom: "0.85rem",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.35rem", marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={abcForm.antecedente}
              onChange={(e) => setAbcForm({ ...abcForm, antecedente: e.target.value })}
              className="form-input"
              placeholder="A: Antecedente"
              style={{ fontSize: "0.72rem", padding: "0.35rem 0.5rem" }}
            />
            <input
              type="text"
              value={abcForm.conducta}
              onChange={(e) => setAbcForm({ ...abcForm, conducta: e.target.value })}
              className="form-input"
              placeholder="B: Conducta"
              style={{ fontSize: "0.72rem", padding: "0.35rem 0.5rem" }}
            />
            <input
              type="text"
              value={abcForm.consecuencia}
              onChange={(e) => setAbcForm({ ...abcForm, consecuencia: e.target.value })}
              className="form-input"
              placeholder="C: Intervención"
              style={{ fontSize: "0.72rem", padding: "0.35rem 0.5rem" }}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setAbcGuardado(true);
              if (onEmitirRecomendacionRapida) {
                onEmitirRecomendacionRapida(
                  `Matriz ABC: [A] ${abcForm.antecedente} -> [B] ${abcForm.conducta} -> [C] ${abcForm.consecuencia}`
                );
              }
              setTimeout(() => setAbcGuardado(false), 3500);
            }}
            className="btn btn-primary btn-sm btn-block"
            style={{ background: "#7c3aed", fontSize: "0.72rem" }}
          >
            <Send size={12} />
            <span>{abcGuardado ? "Enviado al Equipo" : "Transmitir ABC"}</span>
          </button>
        </div>
      )}

      {/* Botonera Compacta de Pautas en 1 Clic */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.4rem" }}>
        {tecnicas.map((t, idx) => {
          const IconComponent = t.icono;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onEstrategiaSeleccionada && onEstrategiaSeleccionada(t.titulo)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.45rem 0.65rem",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <IconComponent size={14} color={t.color} />
                <span style={{ fontSize: "0.74rem", fontWeight: "800", color: "#1e293b" }}>{t.titulo}</span>
              </div>
              <span style={{ fontSize: "0.66rem", color: "#7c3aed", fontWeight: "800" }}>+</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SensoryToolbox;
