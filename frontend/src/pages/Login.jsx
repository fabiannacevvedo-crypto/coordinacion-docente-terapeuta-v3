import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { QuickDemoButtons } from "../components/common/QuickDemoButtons.jsx";
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, Sparkles } from "lucide-react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.ok) {
        const primaryRole = res.usuario.roles?.[0] || "DOCENTE";
        if (primaryRole === "DOCENTE") navigate("/dashboard/docente");
        else if (primaryRole === "TERAPEUTA") navigate("/dashboard/terapeuta");
        else if (primaryRole === "FAMILIAR") navigate("/dashboard/familiar");
        else navigate("/dashboard/admin");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "2.5rem auto" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              margin: "0 auto 0.75rem auto",
            }}
          >
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "900", color: "#0f172a" }}>Iniciar Sesión</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Ingresa a tu cuenta de SincroAula
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="ejemplo@sincroaula.edu.ar"
                style={{ paddingLeft: "2.35rem" }}
              />
              <Mail size={16} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                style={{ paddingLeft: "2.35rem", paddingRight: "2.35rem" }}
              />
              <Lock size={16} color="#94a3b8" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)" }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: "0.75rem" }}>
            <span>{loading ? "Iniciando sesión..." : "Ingresar"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Acceso Rápido Demo en 1 clic */}
        <div style={{ marginBottom: "1.5rem" }}>
          <QuickDemoButtons />
        </div>

        <div style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
          ¿No tienes una cuenta aún?{" "}
          <Link to="/register" style={{ color: "var(--primary)", fontWeight: "700" }}>
            Registrarse aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
