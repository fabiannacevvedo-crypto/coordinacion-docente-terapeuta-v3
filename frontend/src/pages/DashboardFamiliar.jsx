import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import {
  Users,
  Heart,
  Award,
  Sparkles,
  Calendar,
  MessageCircle,
  CheckCircle2,
  Smile,
} from "lucide-react";

export const DashboardFamiliar = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const [resAlumnos, resReportes] = await Promise.all([
          api.getAlumnos(),
          api.getReportes(),
        ]);
        if (resAlumnos.ok) setAlumnos(resAlumnos.alumnos);
        if (resReportes.ok) setReportes(resReportes.reportes);
      } catch (e) {
        console.error("Error cargando portal familiar:", e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const alumno = alumnos[0]; // Hijo tutelado principal (ej. Mauricio)

  // Medallas e insignias gamificadas de nivel inicial
  const medallas = [
    { titulo: "Pintor Creativo", desc: "Completó la actividad con témperas sin frustración", icono: "🎨", color: "#f59e0b" },
    { titulo: "Amigo de la Ronda", desc: "Compartió los materiales de juego con sus pares", icono: "🤝", color: "#10b981" },
    { titulo: "Pausa Exitosa", desc: "Utilizó los auriculares cuando había música alta", icono: "🎧", color: "#3b82f6" },
    { titulo: "Comunicador Estrella", desc: "Eligió su merienda usando el panel de pictogramas", icono: "⭐", color: "#8b5cf6" },
  ];

  return (
    <div>
      {/* Header Familiar */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-familiar">Portal de la Familia</span>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Acompañamiento Integral en el Hogar</span>
        </div>
        <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
          ¿Cómo le fue a {alumno?.nombre || "mi hijo"} hoy?
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Bienvenido/a {user?.nombre} · Comunicación abierta y sin tecnicismos con el equipo escolar
        </p>
      </div>

      {alumno ? (
        <>
          {/* Tarjeta Destacada del Día */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
              border: "1px solid #bbf7d0",
              marginBottom: "2rem",
              padding: "1.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.75rem",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                  }}
                >
                  <Smile size={32} />
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#166534" }}>Estado en la jornada de hoy</div>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#065f46" }}>
                    {alumno.nombre} se encuentra regulado y disfrutando
                  </h2>
                </div>
              </div>

              <div>
                <SemaforoBadge estado={alumno.semaforo_actual} />
              </div>
            </div>

            <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#166534", lineHeight: 1.6 }}>
              Hoy en la sala se trabajó con plástica y música suave. La docente Lucía y el terapeuta Mateo aplicaron la técnica de anticipación visual y {alumno.nombre} respondió con mucha alegría.
            </p>
          </div>

          {/* Medallero de Logros Desbloqueados */}
          <div className="card" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Award size={22} color="#f59e0b" />
              <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a" }}>
                Medallas de Logros Alcanzados esta Semana
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {medallas.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "1rem",
                    textAlign: "center",
                    transition: "transform 0.2s",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>{m.icono}</div>
                  <div style={{ fontWeight: "800", fontSize: "0.95rem", color: "#0f172a" }}>{m.titulo}</div>
                  <div style={{ fontSize: "0.775rem", color: "#64748b", marginTop: "0.25rem" }}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Observaciones y Notas Diarias Compartidas */}
          <div className="card">
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem" }}>
              Notas y Mensajes del Equipo Docente y Terapéutico
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {reportes.length === 0 ? (
                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>Aún no hay notas compartidas.</div>
              ) : (
                reportes.map((rep) => (
                  <div
                    key={rep.id}
                    style={{
                      background: "#f8fafc",
                      padding: "1rem",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <div style={{ fontWeight: "800", color: "#0f172a" }}>{rep.titulo}</div>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{rep.fecha}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#475569", lineHeight: 1.5 }}>{rep.descripcion}</p>
                    {rep.estrategia_utilizada && (
                      <div style={{ fontSize: "0.8rem", color: "#2563eb", marginTop: "0.4rem", fontWeight: "600" }}>
                        💡 Estrategia aplicada: {rep.estrategia_utilizada}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
          <p style={{ color: "#64748b" }}>Cargando información del alumno tutelado...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardFamiliar;
