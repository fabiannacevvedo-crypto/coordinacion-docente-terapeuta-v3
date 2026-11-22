import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { asegurarBaseDeDatosMySQL, getActiveDialect } from "./src/config/database.js";
import { sequelize, UserModel, TareaModel } from "./src/models/index.js";
import { runSeed } from "./src/seeds/seed.js";

// Importación de rutas modulares (Arquitectura SincroAula)
import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import alumnoRoutes from "./src/routes/alumno.routes.js";
import reporteRoutes from "./src/routes/reporte.routes.js";
import alertaRoutes from "./src/routes/alerta.routes.js";
import estrategiaRoutes from "./src/routes/estrategia.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import tareaRoutes from "./src/routes/tarea.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import presentacionRoutes from "./src/routes/presentacion.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const distPath = path.join(__dirname, "frontend", "dist");

// ======================================
// CONFIGURACIÓN DE CORS Y MIDDLEWARES
// ======================================
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origen bloqueado por política de CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ======================================
// CONEXIÓN Y SINCRONIZACIÓN DE LA BASE DE DATOS
// ======================================
(async () => {
  try {
    await asegurarBaseDeDatosMySQL();
    await sequelize.authenticate();
    console.log(`🚀 Base de datos conectada exitosamente [Dialecto activo: ${getActiveDialect().toUpperCase()}]`);

    // Sincronizar modelos y asociaciones
    await sequelize.sync();
    console.log("📦 Modelos Sequelize sincronizados (Paranoid Soft Delete, Relaciones 1:1, 1:N, N:M)");

    // Auto-siembra de datos de prueba si la base está recién creada o si faltan tareas TDAH
    const cantidadUsuarios = await UserModel.count();
    const cantidadTareas = await TareaModel.count();
    if (cantidadUsuarios === 0 || cantidadTareas === 0) {
      console.log("ℹ️ Inicializando datos base y módulos neuroeducativos TDAH...");
      await runSeed();
    }
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error.message);
  }
})();

// ======================================
// RUTAS DE LA API RESTful
// ======================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alumnos", alumnoRoutes);
app.use("/api/reportes", reporteRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api/estrategias", estrategiaRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tareas", tareaRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/presentaciones", presentacionRoutes);

// Endpoint de diagnóstico del sistema
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    sistema: "SincroAula - Coordinación Docente, Terapeuta y Familia",
    version: "1.0.0",
    dialecto_bd: getActiveDialect(),
    enfoque: "Educación Inclusiva y Abordaje Neuroeducativo TDAH",
    timestamp: new Date().toISOString(),
  });
});

// ======================================
// SERVIDO ESTÁTICO DEL FRONTEND REACT (PRODUCCIÓN / SINGLE PAGE APP)
// ======================================
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback SPA para rutas de React
app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ ok: false, mensaje: "Endpoint no encontrado" });
  }

  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>SincroAula - Servidor Activo</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
        .card { max-width: 620px; background: #1e293b; padding: 2.5rem; border-radius: 16px; border: 1px solid #334155; box-shadow: 0 20px 40px rgba(0,0,0,0.4); text-align: center; }
        h1 { color: #38bdf8; margin-top: 0; font-size: 1.8rem; }
        p { color: #94a3b8; line-height: 1.6; }
        .badge { display: inline-block; background: #0284c7; color: white; padding: 0.35rem 0.85rem; border-radius: 9999px; font-weight: 700; font-size: 0.8rem; margin-bottom: 1rem; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 1rem; transition: background 0.2s; }
        .btn:hover { background: #1d4ed8; }
        code { background: #0f172a; color: #f43f5e; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">API BACKEND SINCROAULA</div>
        <h1>Servidor Express Activo</h1>
        <p>El backend de <strong>SincroAula</strong> está corriendo correctamente en el puerto <code>${PORT}</code>.</p>
        <p>Para visualizar la interfaz interactiva de React, ejecute:</p>
        <p><code>npm run dev</code> en la raíz del proyecto, o <code>npm run build:frontend</code> para compilar.</p>
        <a href="/api/health" class="btn">Ver Estado del Sistema (/api/health)</a>
      </div>
    </body>
    </html>
  `);
});

// Manejo de errores no capturados
app.use((err, req, res, next) => {
  console.error("🔥 Error no controlado:", err);
  res.status(500).json({
    ok: false,
    mensaje: "Error interno en el servidor",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌟 SincroAula corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación API y Healthcheck en http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});

export default app;
