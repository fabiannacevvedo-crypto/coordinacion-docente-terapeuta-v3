import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { SemaforoBadge } from "../components/common/SemaforoBadge.jsx";
import { SensoryToolbox } from "../components/terapeuta/SensoryToolbox.jsx";
import {
  Stethoscope,
  Wind,
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const DashboardTerapeuta = () => {
  const { user } = useAuth();
  const [alumnos, setAlumnos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resAlumnos, resAlertas, resReportes] = await Promise.all([
        api.getAlumnos(),
        api.getAlertas(),
        api.getReportes(),
      ]);

      if (resAlumnos.ok) setAlumnos(resAlumnos.alumnos);
      if (resAlertas.ok) setAlertas(resAlertas.alertas);
      if (resReportes.ok) setReportes(resReportes.reportes);
    } catch (e) {
      console.error("Error cargando gabinete terapeuta:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const atenderAlerta = async (id) => {
    try {
      await api.atenderAlerta(id);
      setAlertas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, estado: "ATENDIDA" } : a))
      );
    } catch (e) {
      console.error("Error atendiendo alerta:", e);
    }
  };

  return (
    <div>
      {/* Header Gabinete */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className="badge badge-terapeuta">Espacio Terapéutico y AT</span>
          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Abordaje Clínico-Sensorial</span>
        </div>
        <h1 style={{ fontSize: "1.85rem", fontWeight: "900", color: "#0f172a", marginTop: "0.25rem" }}>
          Gabinete del Acompañante Terapéutico
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Lic./AT {user?.nombre} {user?.apellido} · Pautas sensoriales y seguimiento conductual
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Columna Izquierda: Alumnos y Alertas de Aula */}
        <div>
          {/* Alertas Recibidas desde el Aula */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Bell size={20} color="var(--terapeuta-color)" />
                <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>Alertas Emitidas desde la Sala</h2>
              </div>
              <span className="badge" style={{ background: "#f5f3ff", color: "var(--terapeuta-color)" }}>
                {alertas.filter((a) => a.estado === "PENDIENTE").length} Pendientes
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {alertas.length === 0 ? (
                <div style={{ padding: "1rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
                  No hay alertas registradas en este momento.
                </div>
              ) : (
                alertas.slice(0, 4).map((al) => (
                  <div
                    key={al.id}
                    style={{
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      background: al.estado === "PENDIENTE" ? "#fff1f2" : "#f8fafc",
                      border: `1px solid ${al.estado === "PENDIENTE" ? "#fecdd3" : "#e2e8f0"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "0.875rem", color: "#0f172a" }}>
                        {al.alumno?.nombre} {al.alumno?.apellido} ({al.tipo_alerta})
                      </div>
                      <div style={{ fontSize: "0.825rem", color: "#475569" }}>{al.mensaje}</div>
                      <div style={{ fontSize: "0.725rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                        Emitido por Prof. {al.emisor?.nombre} {al.emisor?.apellido}
                      </div>
                    </div>

                    {al.estado === "PENDIENTE" ? (
                      <button
                        onClick={() => atenderAlerta(al.id)}
                        className="btn btn-sm"
                        style={{ background: "#10b981", color: "white", fontSize: "0.75rem" }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Atender</span>
                      </button>
                    ) : (
                      <span className="badge" style={{ background: "#ecfdf5", color: "#059669" }}>
                        Atendida
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Casos Clínicos Asignados */}
          <div className="card">
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1rem" }}>
              Alumnos en Seguimiento Terapéutico
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {alumnos.map((alumno) => (
                <div
                  key={alumno.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "800", fontSize: "1rem", color: "#0f172a" }}>
                      {alumno.nombre} {alumno.apellido}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", margin: "0.2rem 0" }}>
                      {alumno.diagnostico}
                    </div>
                    <SemaforoBadge estado={alumno.semaforo_actual} size="sm" />
                  </div>

                  <Link to={`/alumnos/${alumno.id}`} className="btn btn-secondary btn-sm">
                    <span>Ficha Clínica</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Caja de Herramientas Sensoriales */}
        <div>
          <SensoryToolbox />
        </div>
      </div>
    </div>
  );
};

export default DashboardTerapeuta;
