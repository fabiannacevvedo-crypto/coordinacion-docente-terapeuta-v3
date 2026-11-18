import React, { useState, useEffect } from "react";
import { api } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { MessageSquare, Send, Users, RefreshCw, Sparkles } from "lucide-react";

export const ChatCoordinacion = ({ alumnos = [], rolActual = "DOCENTE", titulo = "Chat de Coordinación en Tiempo Real" }) => {
  const { user } = useAuth();
  const [alumnoId, setAlumnoId] = useState("");
  const [destinatarioRol, setDestinatarioRol] = useState("TODOS");
  const [contenido, setContenido] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (alumnos.length > 0 && !alumnoId) {
      setAlumnoId(String(alumnos[0].id));
    }
  }, [alumnos, alumnoId]);

  const cargarMensajes = async (idAlum = alumnoId) => {
    try {
      const q = idAlum ? `alumno_id=${idAlum}` : "";
      const res = await api.getMensajesChat(q);
      if (res.ok) setMensajes(res.mensajes);
    } catch (e) {
      console.error("Error cargando chat:", e);
    }
  };

  useEffect(() => {
    cargarMensajes(alumnoId);
    const timer = setInterval(() => {
      cargarMensajes(alumnoId);
    }, 5000);
    return () => clearInterval(timer);
  }, [alumnoId]);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!contenido.trim() || !alumnoId) return;
    setLoading(true);
    try {
      const res = await api.enviarMensajeChat({
        alumno_id: Number(alumnoId),
        destinatario_rol: destinatarioRol,
        contenido: contenido.trim(),
        tipo_mensaje: "CHAT",
      });
      if (res.ok) {
        setContenido("");
        cargarMensajes(alumnoId);
      }
    } catch (err) {
      alert("Error al enviar mensaje: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const mensajesrapidos = {
    DOCENTE: [
      "Acabo de cargar una nueva tarea para adaptar con pautas TDAH.",
      "Hoy el alumno respondió muy bien a las consignas divididas en pasos.",
      "En 5 minutos pasamos a actividad grupal, activemos anticipación visual.",
    ],
    TERAPEUTA: [
      "Ya adapté la tarea con micro-segmentación (Chunking) y fue enviada al Tutor.",
      "Sugiero aplicar pausa kinestésica de 2 minutos antes del próximo bloque.",
      "Excelente autorregulación hoy utilizando el temporizador visual.",
    ],
    FAMILIAR: [
      "¡Muchas gracias! Vimos la tarea adaptada y hoy trabajó con mucho entusiasmo.",
      "Realizamos la actividad usando bloques de 5 minutos como sugirió el Terapeuta.",
      "Hoy durmió bien y va con muy buena predisposición para la jornada.",
    ],
  };

  const getBadgeStyle = (rol) => {
    if (rol === "DOCENTE") return { bg: "#dbeafe", color: "#1d4ed8", label: "Rol Docente" };
    if (rol === "TERAPEUTA") return { bg: "#ede9fe", color: "#6d28d9", label: "Rol Terapeuta" };
    if (rol === "FAMILIAR") return { bg: "#d1fae5", color: "#047857", label: "Familiar / Tutor" };
    return { bg: "#f1f5f9", color: "#334155", label: rol };
  };

  return (
    <div className="card" style={{ borderTop: "4px solid var(--primary)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ background: "#eff6ff", padding: "0.5rem", borderRadius: "10px", color: "var(--primary)" }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a" }}>{titulo}</h3>
            <p style={{ fontSize: "0.775rem", color: "#64748b" }}>
              Canal directo sincronizado entre Rol Docente, Rol Terapeuta y Familiar / Tutor
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <select
            value={alumnoId}
            onChange={(e) => setAlumnoId(e.target.value)}
            className="form-select"
            style={{ fontSize: "0.825rem", padding: "0.4rem 0.75rem", width: "auto" }}
          >
            {alumnos.map((a) => (
              <option key={a.id} value={a.id}>
                Canal de: {a.nombre} {a.apellido}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => cargarMensajes(alumnoId)}
            className="btn btn-secondary btn-sm"
            title="Actualizar mensajes"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Lista de Mensajes */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "1rem",
          maxHeight: "320px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.65rem",
          marginBottom: "1rem",
        }}
      >
        {mensajes.length === 0 ? (
          <div style={{ textAlign: "center", color: "#64748b", fontSize: "0.85rem", padding: "1.5rem" }}>
            No hay mensajes en este canal aún. ¡Inicia la conversación con el equipo o la familia!
          </div>
        ) : (
          mensajes.map((m) => {
            const b = getBadgeStyle(m.emisor_rol);
            const esMio = m.emisor_id === user?.id || m.emisor_rol === rolActual;
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: esMio ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: esMio ? "#eff6ff" : "white",
                  border: `1px solid ${esMio ? "#bfdbfe" : "#e2e8f0"}`,
                  borderRadius: "12px",
                  padding: "0.65rem 0.9rem",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <span
                    style={{
                      background: b.bg,
                      color: b.color,
                      fontSize: "0.68rem",
                      fontWeight: "800",
                      padding: "0.1rem 0.45rem",
                      borderRadius: "999px",
                    }}
                  >
                    {b.label}
                  </span>
                  {m.destinatario_rol && m.destinatario_rol !== "TODOS" && (
                    <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "700" }}>
                      → Para: {m.destinatario_rol === "FAMILIAR" ? "Familiar / Tutor" : `Rol ${m.destinatario_rol}`}
                    </span>
                  )}
                  {m.destinatario_rol === "TODOS" && (
                    <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>→ Para: Todo el Equipo y Familia</span>
                  )}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#1e293b", lineHeight: 1.45 }}>{m.contenido}</div>
              </div>
            );
          })
        )}
      </div>

      {/* Respuestas rápidas de 1 clic */}
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {(mensajesrapidos[rolActual] || mensajesrapidos.DOCENTE).map((txt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setContenido(txt)}
            style={{
              fontSize: "0.725rem",
              background: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: "999px",
              padding: "0.25rem 0.65rem",
              color: "#334155",
              cursor: "pointer",
            }}
          >
            + {txt}
          </button>
        ))}
      </div>

      {/* Formulario de envío */}
      <form onSubmit={handleEnviar} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <select
          value={destinatarioRol}
          onChange={(e) => setDestinatarioRol(e.target.value)}
          className="form-select"
          style={{ width: "auto", minWidth: "180px", fontSize: "0.825rem" }}
        >
          <option value="TODOS">Para: Todos (Docente, Terapeuta y Tutor)</option>
          <option value="FAMILIAR">Para: Familiar / Tutor</option>
          <option value="TERAPEUTA">Para: Rol Terapeuta</option>
          <option value="DOCENTE">Para: Rol Docente</option>
        </select>

        <input
          type="text"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escribe un mensaje en tiempo real para coordinar..."
          className="form-input"
          style={{ flex: 1, minWidth: "220px" }}
        />

        <button type="submit" disabled={loading} className="btn btn-primary">
          <Send size={16} />
          <span>Enviar</span>
        </button>
      </form>
    </div>
  );
};

export default ChatCoordinacion;
