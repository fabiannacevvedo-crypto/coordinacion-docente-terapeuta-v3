import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import {
  Users,
  Calendar,
  Sparkles,
  ArrowLeft,
  FileText,
  Compass,
  AlertTriangle,
  GraduationCap,
  Stethoscope,
  Heart,
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
    return <div style={{ padding: "3rem", textAlign: "center" }}>Cargando ficha del alumno...</div>;
  }

  if (!alumno) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <p>Alumno no encontrado.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--primary)", fontSize: "0.85rem", fontWeight: "700", marginBottom: "1.25rem" }}>
        <ArrowLeft size={16} /> Volver al Tablero
      </Link>

      {/* Cabecera del Alumno */}
      <div className="card" style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge" style={{ background: "#f1f5f9", color: "#475569" }}>{alumno.sala_grado}</span>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Turno: {alumno.turno}</span>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
              {alumno.nombre} {alumno.apellido}
            </h1>
            <p style={{ color: "#475569", fontSize: "0.95rem" }}>
              <strong>Diagnóstico / Apoyos:</strong> {alumno.diagnostico}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem" }}>Semáforo Sensorial Actual</div>
            <SemaforoBadge estado={alumno.semaforo_actual} />
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.4rem" }}>
              Código de vinculación: <strong>{alumno.codigo_familiar}</strong>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem" }}>
        {/* Historial de Reportes */}
        <div>
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FileText size={20} color="var(--primary)" />
              <span>Bitácora Diaria y Evolución</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {alumno.reportes && alumno.reportes.length > 0 ? (
                alumno.reportes.map((rep) => (
                  <div key={rep.id} style={{ background: "#f8fafc", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <strong style={{ color: "#0f172a" }}>{rep.titulo}</strong>
                      <SemaforoBadge estado={rep.semaforo_emocional} size="sm" />
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#475569" }}>{rep.descripcion}</p>
                    {rep.estrategia_utilizada && (
                      <div style={{ fontSize: "0.8rem", color: "var(--primary)", marginTop: "0.35rem", fontWeight: "600" }}>
                        Pauta aplicada: {rep.estrategia_utilizada}
                      </div>
                    )}
                    <div style={{ fontSize: "0.725rem", color: "#94a3b8", marginTop: "0.35rem" }}>
                      Por {rep.autor?.nombre} {rep.autor?.apellido} · {rep.fecha}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>No hay reportes registrados para este alumno.</div>
              )}
            </div>
          </div>
        </div>

        {/* Equipo y Estrategias */}
        <div>
          {/* Equipo Interdisciplinario */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Users size={18} color="var(--primary)" />
              <span>Equipo Interdisciplinario</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {alumno.equipo_interdisciplinario && alumno.equipo_interdisciplinario.length > 0 ? (
                alumno.equipo_interdisciplinario.map((prof) => (
                  <div key={prof.id} style={{ padding: "0.6rem 0.8rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "#0f172a" }}>{prof.nombre} {prof.apellido}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{prof.VinculoAlumno?.tipo_vinculo || "PROFESIONAL"}</div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Sin profesionales asignados formalmente.</div>
              )}
            </div>
          </div>

          {/* Estrategias Sensoriales y Pedagógicas Asignadas */}
          <div className="card">
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Compass size={18} color="#8b5cf6" />
              <span>Estrategias Sensoriales Asignadas</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {alumno.estrategias && alumno.estrategias.length > 0 ? (
                alumno.estrategias.map((est) => (
                  <div key={est.id} style={{ padding: "0.6rem 0.8rem", background: "#f5f3ff", borderRadius: "8px", border: "1px solid #ddd6fe" }}>
                    <div style={{ fontWeight: "700", fontSize: "0.825rem", color: "#6d28d9" }}>{est.nombre}</div>
                    <div style={{ fontSize: "0.75rem", color: "#475569", marginTop: "0.2rem" }}>{est.descripcion}</div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>No hay estrategias registradas.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumnoDetalle;
