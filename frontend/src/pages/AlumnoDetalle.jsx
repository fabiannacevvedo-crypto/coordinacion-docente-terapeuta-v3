import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import {
  Users,
  Calendar,
  ArrowLeft,
  FileText,
  Compass,
  Stethoscope,
  Sun,
  CheckCircle2,
} from "lucide-react";

export const AlumnoDetalle = () => {
  const { id } = useParams();
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await api.getAlumnoById(id);
        if (res.ok) setAlumno(res.alumno);
      } catch (e) {
        console.error("Error al cargar alumno:", e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center" }}>Cargando legajo del alumno...</div>;
  }

  if (!alumno) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p>Alumno no encontrado.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>Volver al inicio</Link>
      </div>
    );
  }

  let fichaMedica = null;
  let sincronizador = null;
  let agenda = [];
  try {
    if (alumno.ficha_medica) fichaMedica = JSON.parse(alumno.ficha_medica);
  } catch {}
  try {
    if (alumno.sincronizador_matutino) sincronizador = JSON.parse(alumno.sincronizador_matutino);
  } catch {}
  try {
    if (alumno.agenda_diaria) agenda = JSON.parse(alumno.agenda_diaria);
  } catch {}

  return (
    <div>
      <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontSize: "0.85rem", fontWeight: "700", marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Volver al Tablero
      </Link>

      {/* Cabecera del Alumno */}
      <div className="card" style={{ marginBottom: "1.25rem", borderTop: "4px solid #2563eb" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge" style={{ background: "#f1f5f9", color: "#475569" }}>{alumno.sala_grado}</span>
              <span className="badge" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                Gravedad TDAH: {alumno.gravedad_tdah || "MODERADO"}
              </span>
            </div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
              {alumno.nombre} {alumno.apellido}
            </h1>
            <p style={{ color: "#475569", fontSize: "0.9rem" }}>
              <strong>Diagnóstico:</strong> {alumno.diagnostico}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <SemaforoBadge estado={alumno.semaforo_actual} />
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.4rem" }}>
              Código Familiar: <strong>{alumno.codigo_familiar}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Grilla 3 Columnas: Ficha Médica + Sincronizador + Agenda */}
      <div className="grid-3" style={{ marginBottom: "1.5rem" }}>
        <div className="card" style={{ borderTop: "4px solid #2563eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: "800", color: "#1d4ed8", marginBottom: "0.6rem" }}>
            <Stethoscope size={18} />
            <span>1. Ficha Médica Profesional</span>
          </div>
          {fichaMedica ? (
            <div style={{ fontSize: "0.8rem", color: "#334155", lineHeight: 1.6 }}>
              <div><strong>Profesional:</strong> {fichaMedica.profesional_emisor}</div>
              <div><strong>DSM-5:</strong> {fichaMedica.subtipo_dsm5}</div>
              <div><strong>Ventana de Foco:</strong> {fichaMedica.ventana_atencional_min} min</div>
            </div>
          ) : (
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Ficha clínica estándar activa.</div>
          )}
        </div>

        <div className="card" style={{ borderTop: "4px solid #059669" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: "800", color: "#047857", marginBottom: "0.6rem" }}>
            <Sun size={18} />
            <span>2. Sincronizador Pre-Aula (Hoy)</span>
          </div>
          {sincronizador ? (
            <div style={{ fontSize: "0.8rem", color: "#334155", lineHeight: 1.6 }}>
              <div><strong>1. Sueño:</strong> {sincronizador.descanso}</div>
              <div><strong>2. Foco Hoy:</strong> {sincronizador.disposicion}</div>
              <div><strong>3. Preparación:</strong> {sincronizador.preparacion}</div>
            </div>
          ) : (
            <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Pendiente de envío matutino.</div>
          )}
        </div>

        <div className="card" style={{ borderTop: "4px solid #0284c7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: "800", color: "#0369a1", marginBottom: "0.6rem" }}>
            <Calendar size={18} />
            <span>3. Agenda Diaria Personalizada</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            {agenda.length > 0 ? (
              agenda.slice(0, 4).map((b) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", background: "#f8fafc", padding: "0.35rem 0.55rem", borderRadius: "6px" }}>
                  <span><strong>{b.hora}</strong> · {b.bloque}</span>
                  <span style={{ color: "#0284c7", fontWeight: "700" }}>{b.duracion}</span>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Sin bloques configurados.</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem" }}>
        {/* Historial de Reportes */}
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={18} color="var(--primary)" />
            <span>Bitácora Diaria y Evolución</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {alumno.reportes && alumno.reportes.length > 0 ? (
              alumno.reportes.map((rep) => (
                <div key={rep.id} style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <strong style={{ color: "#0f172a", fontSize: "0.9rem" }}>{rep.titulo}</strong>
                    <SemaforoBadge estado={rep.semaforo_emocional} size="sm" />
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "#475569" }}>{rep.descripcion}</p>
                </div>
              ))
            ) : (
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>No hay reportes registrados.</div>
            )}
          </div>
        </div>

        {/* Estrategias */}
        <div className="card">
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Compass size={18} color="#8b5cf6" />
            <span>Estrategias TDAH Asignadas</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {alumno.estrategias && alumno.estrategias.length > 0 ? (
              alumno.estrategias.map((est) => (
                <div key={est.id} style={{ padding: "0.6rem 0.8rem", background: "#f5f3ff", borderRadius: "8px", border: "1px solid #ddd6fe" }}>
                  <div style={{ fontWeight: "700", fontSize: "0.825rem", color: "#6d28d9" }}>{est.nombre}</div>
                  <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.15rem" }}>{est.descripcion}</div>
                </div>
              ))
            ) : (
              <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>No hay estrategias registradas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumnoDetalle;
