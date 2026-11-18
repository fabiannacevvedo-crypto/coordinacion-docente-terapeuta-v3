import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Sparkles,
  GraduationCap,
  Stethoscope,
  Users,
  ShieldCheck,
  LogOut,
  CheckCircle2,
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
        background: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(12px)",
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
          padding: "0.85rem 1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo / Marca */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: "1.25rem", fontWeight: "900", fontFamily: "var(--font-heading)", color: "#0f172a", lineHeight: 1 }}>
              Sincro<span style={{ color: "var(--primary)" }}>Aula</span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600" }}>Docente · Terapeuta · Familia</div>
          </div>
        </Link>

        {/* Enlaces de Navegación */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {user && (
            <>
              {esDocente && (
                <Link
                  to="/dashboard/docente"
                  style={{
                    padding: "0.45rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    background: isActive("/dashboard/docente") ? "var(--docente-bg)" : "transparent",
                    color: isActive("/dashboard/docente") ? "var(--docente-color)" : "#475569",
                  }}
                >
                  Aula Docente
                </Link>
              )}

              {esTerapeuta && (
                <Link
                  to="/dashboard/terapeuta"
                  style={{
                    padding: "0.45rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    background: isActive("/dashboard/terapeuta") ? "var(--terapeuta-bg)" : "transparent",
                    color: isActive("/dashboard/terapeuta") ? "var(--terapeuta-color)" : "#475569",
                  }}
                >
                  Gabinete Terapeuta
                </Link>
              )}

              {esFamiliar && (
                <Link
                  to="/dashboard/familiar"
                  style={{
                    padding: "0.45rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    background: isActive("/dashboard/familiar") ? "var(--familiar-bg)" : "transparent",
                    color: isActive("/dashboard/familiar") ? "var(--familiar-color)" : "#475569",
                  }}
                >
                  Portal Familiar
                </Link>
              )}

              {esAdmin && (
                <Link
                  to="/dashboard/admin"
                  style={{
                    padding: "0.45rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    background: isActive("/dashboard/admin") ? "var(--admin-bg)" : "transparent",
                    color: isActive("/dashboard/admin") ? "var(--admin-color)" : "#475569",
                  }}
                >
                  Gestión y Usuarios
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Perfil o Botones de Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e293b" }}>
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
