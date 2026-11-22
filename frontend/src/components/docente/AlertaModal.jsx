import React, { useState, useEffect } from "react";
import { X, Send, AlertTriangle, Sparkles, Volume2, ArrowRight } from "lucide-react";
import { api } from "../../services/api.js";

export const AlertaModal = ({ isOpen, onClose, alumnos = [], onAlertaCreada }) => {
  const [alumnoId, setAlumnoId] = useState(alumnos[0]?.id || "");

  useEffect(() => {
    if (alumnos.length > 0 && !alumnoId) {
      setAlumnoId(alumnos[0].id);
    }
  }, [alumnos, alumnoId]);
  const [tipoAlerta, setTipoAlerta] = useState("DESREGULACION");
  const [mensaje, setMensaje] = useState("");
  const [nivelUrgencia, setNivelUrgencia] = useState("ALTA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.createAlerta({
        alumno_id: Number(alumnoId),
        tipo_alerta: tipoAlerta,
        mensaje,
        nivel_urgencia: nivelUrgencia,
        receptor_rol: "TERAPEUTA",
      });

      if (res.ok) {
        if (onAlertaCreada) onAlertaCreada(res.alerta);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const opcionesRapidas = [
    { tipo: "DESREGULACION", urg: "ALTA", texto: "El alumno se encuentra desregulado en ronda de plástica. Requiere acompañamiento." },
    { tipo: "SOBRECARGA_SENSORIAL", urg: "ALTA", texto: "Sobrecarga de ruidos por música en el patio. ¿Colocamos auriculares?" },
    { tipo: "CAMBIO_ACTIVIDAD", urg: "MEDIA", texto: "En 5 minutos pasamos al patio de juegos. Preparar anticipación visual." },
    { tipo: "LOGRO_DESTACADO", urg: "INFORMATIVA", texto: "¡Excelente logro! Completó la actividad con sus pares sin frustración." },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ background: "#fee2e2", padding: "0.5rem", borderRadius: "8px", color: "#ef4444" }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#0f172a" }}>Aviso Inmediato al Acompañante Terapéutico</h3>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Coordinación rápida en el aula sin interrumpir la clase</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Opciones de 1 Clic */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>
            Plantillas Rápidas:
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {opcionesRapidas.map((op, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setTipoAlerta(op.tipo);
                  setNivelUrgencia(op.urg);
                  setMensaje(op.texto);
                }}
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.8rem",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>{op.texto}</span>
                <span className="badge" style={{ fontSize: "0.65rem", background: op.urg === "ALTA" ? "#fee2e2" : "#f1f5f9", color: op.urg === "ALTA" ? "#991b1b" : "#475569" }}>
                  {op.tipo}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Alumno con acompañamiento</label>
            <select
              value={alumnoId}
              onChange={(e) => setAlumnoId(e.target.value)}
              className="form-select"
              required
            >
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} {a.apellido} ({a.sala_grado})
                </option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Tipo de Situación</label>
              <select value={tipoAlerta} onChange={(e) => setTipoAlerta(e.target.value)} className="form-select">
                <option value="DESREGULACION">Desregulación Emocional</option>
                <option value="SOBRECARGA_SENSORIAL">Sobrecarga Sensorial</option>
                <option value="CAMBIO_ACTIVIDAD">Cambio de Actividad</option>
                <option value="LOGRO_DESTACADO">Logro Destacado</option>
                <option value="CONSULTA_URGENTE">Consulta Urgente</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Nivel de Urgencia</label>
              <select value={nivelUrgencia} onChange={(e) => setNivelUrgencia(e.target.value)} className="form-select">
                <option value="ALTA">Alta (Intervención Inmediata)</option>
                <option value="MEDIA">Media (Próximos minutos)</option>
                <option value="INFORMATIVA">Informativa</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mensaje breve para el AT</label>
            <textarea
              required
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="form-textarea"
              placeholder="Describa la necesidad brevemente..."
              rows={3}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ background: "#ef4444" }}>
              <Send size={16} />
              <span>{loading ? "Enviando..." : "Emitir Alerta"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertaModal;
