import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { SincroAulaLogo } from "../common/SincroAulaLogo.jsx";
import {
  GraduationCap,
  Stethoscope,
  Users,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  Activity,
} from "lucide-react";

export const Navbar = () => {
  const { user, roles, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const esDocente = roles.includes("DOCENTE");
  const esTerapeuta = roles.includes("TERAPEUTA");
  const esFamiliar = roles.includes("FAMILIAR");
  const esAdmin = roles.includes("ADMIN");

  const isActive = (path) => location.pathname === path;

  const getRoleDisplayName = () => {
    if (esDocente) return "Rol Docente";
    if (esTerapeuta) return "Rol Terapeuta";
    if (esFamiliar) return "Familiar / Tutor";
    if (esAdmin) return "Administrador";
    return "Usuario";
  };

  return (
    <header
      style={{
        background: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--surface-border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "0.75rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Nuevo Logo Personalizado e Innovador de SincroAula */}
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <SincroAulaLogo size={42} showText={true} darkText={true} />
        </Link>

        {/* Enlaces de Navegación */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {user && (
            <>
              {esDocente && (
                <Link
                  to="/dashboard/docente"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    background: isActive("/dashboard/docente") ? "var(--docente-bg)" : "transparent",
                    color: isActive("/dashboard/docente") ? "var(--docente-color)" : "#475569",
                    border: isActive("/dashboard/docente") ? "1px solid #bfdbfe" : "1px solid transparent",
                  }}
                >
                  <GraduationCap size={16} />
                  <span>Panel Docente</span>
                </Link>
              )}

              {esTerapeuta && (
                <Link
                  to="/dashboard/terapeuta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    background: isActive("/dashboard/terapeuta") ? "var(--terapeuta-bg)" : "transparent",
                    color: isActive("/dashboard/terapeuta") ? "var(--terapeuta-color)" : "#475569",
                    border: isActive("/dashboard/terapeuta") ? "1px solid #ddd6fe" : "1px solid transparent",
                  }}
                >
                  <Stethoscope size={16} />
                  <span>Gabinete Terapeuta</span>
                </Link>
              )}

              {esFamiliar && (
                <Link
                  to="/dashboard/familiar"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    background: isActive("/dashboard/familiar") ? "var(--familiar-bg)" : "transparent",
                    color: isActive("/dashboard/familiar") ? "var(--familiar-color)" : "#475569",
                    border: isActive("/dashboard/familiar") ? "1px solid #a7f3d0" : "1px solid transparent",
                  }}
                >
                  <Users size={16} />
                  <span>Portal Familiar</span>
                </Link>
              )}

              {esAdmin && (
                <Link
                  to="/dashboard/admin"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: "700",
                    background: isActive("/dashboard/admin") ? "var(--admin-bg)" : "transparent",
                    color: isActive("/dashboard/admin") ? "var(--admin-color)" : "#475569",
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Gestión y Usuarios</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Perfil o Botones de Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "999px",
                  fontSize: "0.72rem",
                  fontWeight: "700",
                  color: "#15803d",
                }}
              >
                <Activity size={13} />
                <span>Sincronización Activa</span>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "800", color: "#1e293b" }}>
                  {getRoleDisplayName()}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.25rem" }}>
                  <span className={`badge badge-${roles[0]?.toLowerCase() || "docente"}`} style={{ fontSize: "0.65rem", padding: "0.1rem 0.45rem" }}>
                    {roles[0] || "USUARIO"}
                  </span>
                  <CheckCircle2 size={13} color="#10b981" title="Verificado" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Cerrar Sesión"
                style={{ padding: "0.45rem 0.65rem", color: "#ef4444" }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
