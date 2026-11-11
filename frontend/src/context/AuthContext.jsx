import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar usuario inicial al montar
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const storedUser = localStorage.getItem("sincroaula_user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setRoles(parsed.roles || []);
        }

        // Refrescar perfil desde la API
        const res = await api.getProfile();
        if (res.ok && res.usuario) {
          setUser(res.usuario);
          setRoles(res.roles || []);
          localStorage.setItem("sincroaula_user", JSON.stringify(res.usuario));
        }
      } catch (err) {
        // Si falló verificación de sesión, limpiar estado local
        setUser(null);
        setRoles([]);
        localStorage.removeItem("sincroaula_token");
        localStorage.removeItem("sincroaula_user");
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.ok) {
      setUser(res.usuario);
      setRoles(res.usuario.roles || []);
      if (res.token) {
        localStorage.setItem("sincroaula_token", res.token);
      }
      localStorage.setItem("sincroaula_user", JSON.stringify(res.usuario));
    }
    return res;
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    if (res.ok) {
      setUser(res.usuario);
      setRoles(res.usuario.roles || []);
      if (res.token) {
        localStorage.setItem("sincroaula_token", res.token);
      }
      localStorage.setItem("sincroaula_user", JSON.stringify(res.usuario));
    }
    return res;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn("Error cerrando sesión en API:", e);
    }
    setUser(null);
    setRoles([]);
    localStorage.removeItem("sincroaula_token");
    localStorage.removeItem("sincroaula_user");
  };

  // Acceso demo instantáneo en 1 click para evaluación
  const quickDemoLogin = async (rol) => {
    const demoCredentials = {
      DOCENTE: { email: "lucia.docente@sincroaula.edu.ar", pass: "docente123" },
      TERAPEUTA: { email: "mateo.terapeuta@sincroaula.edu.ar", pass: "terapeuta123" },
      FAMILIAR: { email: "carlos.padre@sincroaula.edu.ar", pass: "familiar123" },
      ADMIN: { email: "admin@sincroaula.edu.ar", pass: "admin123" },
    };

    const cred = demoCredentials[rol];
    if (cred) {
      return await login(cred.email, cred.pass);
    }
  };

  const hasRole = (roleName) => roles.includes(roleName) || roles.includes("ADMIN");

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
