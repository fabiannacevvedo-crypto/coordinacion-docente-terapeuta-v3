import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  GraduationCap,
  Stethoscope,
  Users,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  School,
  FileCheck,
} from "lucide-react";

export const Register = () => {
  const [rol, setRol] = useState("DOCENTE");
  const [formData, setFormData] = useState({
    nombre: "Rol",
    apellido: "Docente",
    email: "",
    password: "",
    telefono: "",
    // Docente
    institucion: "Institución Educativa Nivel Inicial",
    cue_escuela: "340081234",
    cargo: "Docente de Sala",
    nivel_educativo: "Nivel Inicial",
    // Terapeuta
    especialidad: "Acompañante Terapéutico Especializado en TDAH",
    matricula_tipo: "MN",
    matricula_numero: "AT-2026",
    colegio_profesional: "Colegio de Profesionales de Salud",
    jurisdiccion: "Nacional / Provincial",
    // Familiar
    dni: "35111222",
    parentesco: "TUTOR_LEGAL",
    codigo_vinculacion: "FAM-MAU-2026",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (nuevoRol) => {
    setRol(nuevoRol);
    if (nuevoRol === "DOCENTE") {
      setFormData((prev) => ({ ...prev, nombre: "Rol", apellido: "Docente" }));
    } else if (nuevoRol === "TERAPEUTA") {
      setFormData((prev) => ({ ...prev, nombre: "Rol", apellido: "Terapeuta" }));
    } else {
      setFormData((prev) => ({ ...prev, nombre: "Familiar", apellido: "Tutor" }));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Autocompletar con datos de prueba sin nombres propios (solo Rol Docente, Terapeuta o Familiar Tutor)
  const autocompletarDatosPrueba = (rolSeleccionado = rol) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);

    if (rolSeleccionado === "DOCENTE") {
      setRol("DOCENTE");
      setFormData({
        nombre: "Rol",
        apellido: "Docente",
        email: `docente${randomSuffix}@sincroaula.edu.ar`,
        password: "Password123",
        telefono: "3704-551122",
        institucion: "Escuela de Nivel Inicial N° 5",
        cue_escuela: "340081234",
        cargo: "Docente de Sala (5 Años)",
        nivel_educativo: "Nivel Inicial",
        especialidad: "Acompañante Terapéutico Especializado en TDAH",
        matricula_tipo: "MN",
        matricula_numero: "MN-9821",
        colegio_profesional: "Colegio de Profesionales",
        jurisdiccion: "Provincial",
        dni: "35111222",
        parentesco: "TUTOR_LEGAL",
        codigo_vinculacion: "FAM-MAU-2026",
      });
    } else if (rolSeleccionado === "TERAPEUTA") {
      setRol("TERAPEUTA");
      setFormData({
        nombre: "Rol",
        apellido: "Terapeuta",
        email: `terapeuta${randomSuffix}@sincroaula.edu.ar`,
        password: "Password123",
        telefono: "3704-889900",
        institucion: "Gabinete de Apoyo Neuroeducativo TDAH",
        cue_escuela: "340081234",
        cargo: "Acompañante Terapéutico Escolar",
        nivel_educativo: "Nivel Inicial",
        especialidad: "Acompañante Terapéutico Especializado en TDAH",
        matricula_tipo: "MP",
        matricula_numero: "AT-781",
        colegio_profesional: "Asociación de Acompañantes Terapéuticos",
        jurisdiccion: "Provincial",
        dni: "36222333",
        parentesco: "TUTOR_LEGAL",
        codigo_vinculacion: "FAM-MAU-2026",
      });
    } else {
      setRol("FAMILIAR");
      setFormData({
        nombre: "Familiar",
        apellido: "Tutor",
        email: `tutor${randomSuffix}@sincroaula.edu.ar`,
        password: "Password123",
        telefono: "3704-334455",
        institucion: "Hogar",
        cue_escuela: "340081234",
        cargo: "Tutor",
        nivel_educativo: "Nivel Inicial",
        especialidad: "Acompañante Terapéutico Especializado en TDAH",
        matricula_tipo: "MN",
        matricula_numero: "MN-9821",
        colegio_profesional: "Colegio de Profesionales",
        jurisdiccion: "Provincial",
        dni: "37444555",
        parentesco: "TUTOR_LEGAL",
        codigo_vinculacion: "FAM-MAU-2026",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { ...formData, rol };
      const res = await register(payload);
      if (res.ok) {
        if (rol === "DOCENTE") navigate("/dashboard/docente");
        else if (rol === "TERAPEUTA") navigate("/dashboard/terapeuta");
        else navigate("/dashboard/familiar");
      }
    } catch (err) {
      setError(err.message || "Error al completar el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "2rem auto" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#0f172a" }}>Crear Cuenta en SincroAula</h1>
          <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
            Selecciona únicamente tu rol (Docente, Terapeuta o Familiar Tutor) para habilitar tu espacio colaborativo
          </p>
        </div>

        {/* Botón Destacado de Autocompletar por Rol */}
        <div
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
            border: "1px dashed #3b82f6",
            padding: "0.85rem 1rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.825rem", color: "#1e40af", fontWeight: "600" }}>
            <Sparkles size={18} color="#2563eb" />
            <span>¿Quieres completar automáticamente las credenciales del rol seleccionado?</span>
          </div>
          <button
            type="button"
            onClick={() => autocompletarDatosPrueba(rol)}
            className="btn btn-primary btn-sm"
            style={{ fontSize: "0.775rem" }}
          >
            Autocompletar Rol
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Selector de Rol (Sin nombres propios) */}
        <div style={{ marginBottom: "0.5rem", fontSize: "0.825rem", fontWeight: "700", color: "#334155" }}>
          1. Selecciona tu Rol en la Plataforma:
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button
            type="button"
            onClick={() => handleRoleSelect("DOCENTE")}
            style={{
              padding: "0.95rem 0.75rem",
              borderRadius: "12px",
              border: `2px solid ${rol === "DOCENTE" ? "var(--docente-color)" : "var(--surface-border)"}`,
              background: rol === "DOCENTE" ? "var(--docente-bg)" : "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
              cursor: "pointer",
            }}
          >
            <GraduationCap size={24} color={rol === "DOCENTE" ? "var(--docente-color)" : "#64748b"} />
            <span style={{ fontSize: "0.875rem", fontWeight: "800", color: rol === "DOCENTE" ? "var(--docente-color)" : "#334155" }}>
              Rol Docente
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("TERAPEUTA")}
            style={{
              padding: "0.95rem 0.75rem",
              borderRadius: "12px",
              border: `2px solid ${rol === "TERAPEUTA" ? "var(--terapeuta-color)" : "var(--surface-border)"}`,
              background: rol === "TERAPEUTA" ? "var(--terapeuta-bg)" : "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
              cursor: "pointer",
            }}
          >
            <Stethoscope size={24} color={rol === "TERAPEUTA" ? "var(--terapeuta-color)" : "#64748b"} />
            <span style={{ fontSize: "0.875rem", fontWeight: "800", color: rol === "TERAPEUTA" ? "var(--terapeuta-color)" : "#334155" }}>
              Rol Terapeuta
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect("FAMILIAR")}
            style={{
              padding: "0.95rem 0.75rem",
              borderRadius: "12px",
              border: `2px solid ${rol === "FAMILIAR" ? "var(--familiar-color)" : "var(--surface-border)"}`,
              background: rol === "FAMILIAR" ? "var(--familiar-bg)" : "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.35rem",
              cursor: "pointer",
            }}
          >
            <Users size={24} color={rol === "FAMILIAR" ? "var(--familiar-color)" : "#64748b"} />
            <span style={{ fontSize: "0.875rem", fontWeight: "800", color: rol === "FAMILIAR" ? "var(--familiar-color)" : "#334155" }}>
              Familiar / Tutor
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Credenciales de Acceso por Rol (Sin pedir nombres personales) */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Identificación de Rol Asignada</label>
              <input
                type="text"
                readOnly
                value={
                  rol === "DOCENTE"
                    ? "Rol Docente"
                    : rol === "TERAPEUTA"
                    ? "Rol Terapeuta"
                    : "Familiar Tutor"
                }
                className="form-input"
                style={{ background: "#f8fafc", fontWeight: "700", color: "#334155" }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono de Contacto (Opcional)</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="form-input" placeholder="3704-xxxxxx" />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Correo Electrónico Institucional / Personal</label>
              <input type="email" required name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="rol@sincroaula.edu.ar" />
            </div>
            <div className="form-group">
              <label className="form-label">Contraseña (Mínimo 6 caracteres)</label>
              <input type="password" required name="password" value={formData.password} onChange={handleChange} className="form-input" placeholder="••••••••" />
            </div>
          </div>

          {/* CAMPOS ESPECÍFICOS SEGÚN ROL */}
          {rol === "DOCENTE" && (
            <div style={{ background: "var(--docente-bg)", padding: "1.25rem", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid #bfdbfe" }}>
              <div style={{ fontWeight: "800", fontSize: "0.9rem", color: "var(--docente-color)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <School size={18} />
                <span>Configuración del Espacio Docente</span>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Institución Educativa</label>
                  <input type="text" required name="institucion" value={formData.institucion} onChange={handleChange} className="form-input" placeholder="Jardín / Escuela..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Código CUE</label>
                  <input type="text" required name="cue_escuela" value={formData.cue_escuela} onChange={handleChange} className="form-input" placeholder="Ej: 340081234" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sala / Grado a Cargo</label>
                <input type="text" required name="cargo" value={formData.cargo} onChange={handleChange} className="form-input" placeholder="Docente Titular de Sala" />
              </div>
            </div>
          )}

          {rol === "TERAPEUTA" && (
            <div style={{ background: "var(--terapeuta-bg)", padding: "1.25rem", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid #ddd6fe" }}>
              <div style={{ fontWeight: "800", fontSize: "0.9rem", color: "var(--terapeuta-color)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ShieldCheck size={18} />
                <span>Especialidad Terapéutica y Abordaje TDAH</span>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Especialidad</label>
                  <select name="especialidad" value={formData.especialidad} onChange={handleChange} className="form-select">
                    <option value="Acompañante Terapéutico Especializado en TDAH">Acompañante Terapéutico Especializado en TDAH</option>
                    <option value="Psicopedagogía Clínica (TDAH)">Psicopedagogía Clínica (TDAH)</option>
                    <option value="Psicología Cognitivo-Conductual Infantil">Psicología Cognitivo-Conductual Infantil</option>
                    <option value="Terapia Ocupacional e Integración Sensorial">Terapia Ocupacional e Integración Sensorial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Número de Matrícula</label>
                  <input type="text" required name="matricula_numero" value={formData.matricula_numero} onChange={handleChange} className="form-input" placeholder="Ej: AT-492" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Entidad Habilitante</label>
                <input type="text" required name="colegio_profesional" value={formData.colegio_profesional} onChange={handleChange} className="form-input" placeholder="Asociación / Colegio Profesional" />
              </div>
            </div>
          )}

          {rol === "FAMILIAR" && (
            <div style={{ background: "var(--familiar-bg)", padding: "1.25rem", borderRadius: "12px", marginBottom: "1.5rem", border: "1px solid #a7f3d0" }}>
              <div style={{ fontWeight: "800", fontSize: "0.9rem", color: "var(--familiar-color)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FileCheck size={18} />
                <span>Vinculación Familiar / Tutor</span>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Vínculo con el Alumno</label>
                  <select name="parentesco" value={formData.parentesco} onChange={handleChange} className="form-select">
                    <option value="TUTOR_LEGAL">Familiar / Tutor</option>
                    <option value="MADRE">Madre</option>
                    <option value="PADRE">Padre</option>
                    <option value="FAMILIAR">Familiar a Cargo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Código de Vinculación del Alumno</label>
                  <input type="text" name="codigo_vinculacion" value={formData.codigo_vinculacion} onChange={handleChange} className="form-input" placeholder="Ej: FAM-MAU-2026" />
                </div>
              </div>
              <div className="form-hint">Al ingresar el código escolar quedarás vinculado automáticamente al seguimiento de tareas y adaptaciones TDAH del alumno.</div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary btn-block" style={{ padding: "0.85rem" }}>
            <span>{loading ? "Procesando Registro..." : `Registrarme como ${rol === "DOCENTE" ? "Rol Docente" : rol === "TERAPEUTA" ? "Rol Terapeuta" : "Familiar / Tutor"}`}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: "700" }}>
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
