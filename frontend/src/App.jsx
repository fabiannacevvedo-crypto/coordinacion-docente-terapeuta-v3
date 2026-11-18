import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";

// Páginas
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { DashboardDocente } from "./pages/DashboardDocente.jsx";
import { DashboardTerapeuta } from "./pages/DashboardTerapeuta.jsx";
import { DashboardFamiliar } from "./pages/DashboardFamiliar.jsx";
import { DashboardAdmin } from "./pages/DashboardAdmin.jsx";
import { AlumnoDetalle } from "./pages/AlumnoDetalle.jsx";

// Ruta protegida por autenticación
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center" }}>Verificando credenciales...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some((r) => roles.includes(r) || roles.includes("ADMIN"))) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Paneles de Roles */}
              <Route
                path="/dashboard/docente"
                element={
                  <ProtectedRoute allowedRoles={["DOCENTE"]}>
                    <DashboardDocente />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/terapeuta"
                element={
                  <ProtectedRoute allowedRoles={["TERAPEUTA"]}>
                    <DashboardTerapeuta />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/familiar"
                element={
                  <ProtectedRoute allowedRoles={["FAMILIAR"]}>
                    <DashboardFamiliar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/admin"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <DashboardAdmin />
                  </ProtectedRoute>
                }
              />

              {/* Detalle Alumno */}
              <Route
                path="/alumnos/:id"
                element={
                  <ProtectedRoute>
                    <AlumnoDetalle />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
