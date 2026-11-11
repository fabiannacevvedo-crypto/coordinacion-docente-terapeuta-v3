# SincroAula v3 - Coordinación Docente-Terapeuta

> **Plataforma Colaborativa e Interactiva para la Educación Inclusiva en el Nivel Inicial**  
> Desarrollado para la materia **Práctica Profesionalizante I (Unidad N° 1 - Desafío de una Innovación)**  
> **Tecnicatura Superior en Desarrollo de Software Multiplataforma · Instituto Politécnico Formosa**  
> **Equipo RedNeC:** Acevedo Cristian · Falcón Santiago · Sánchez Gastón  
> **Profesor:** Miguel Mateo Badaracco

---

## 📌 1. El Problema y la Propuesta de Valor

En las salas de 4 y 5 años de educación inclusiva de la provincia de Formosa, la falta sistemática de un canal de comunicación digital entre la **docente de sala** y el **acompañante terapéutico (AT)** genera contradicciones en las instrucciones pedagógicas hacia el alumno con necesidades especiales (ej. *Mauricio*). Esto provoca sobrecarga sensorial, desregulación motriz o llanto, y frustración en el niño y su familia.

**SincroAula v3** resuelve esta problemática unificando la tríada educativa en un entorno digital interactivo en tiempo real con:
1. **Semáforo Emocional y Sensorial en Vivo:** 🟢 Verde (Calmo/Regulado), 🟡 Amarillo (Inquieto/Alerta), 🔴 Rojo (Desregulado/Pausa).
2. **Avisos Preventivos Inmediatos al AT:** Notificaciones en 1 clic para anticipar cambios de actividad o ruidos fuertes sin interrumpir la clase.
3. **Caja de Herramientas Sensoriales:** Guía interactiva animada de respiración consciente 4-4-4 y protocolos de descompresión sensorial.
4. **Portal Familiar Transparente:** Resumen diario sin tecnicismos "¿Cómo estuvo hoy?", junto a un medallero de logros pedagógicos.
5. **Workspace de Presentación estilo Pitch.com:** Carrusel dinámico de diapositivas interactivas para defender el proyecto ante evaluadores.

---

## 🏗️ 2. Arquitectura del Proyecto y Buenas Prácticas del Politécnico

El proyecto cumple estrictamente con las consignas académicas de la institución:
- **Uso exclusivo de ESModules (`import` / `export`).**
- **Manejo riguroso de errores con bloques `try / catch` en todos los controladores.**
- **Códigos de estado HTTP semánticos:** `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`.
- **Validaciones exhaustivas con `express-validator`:** Implementación de `.optional()` y `matchedData(req)` en rutas de actualización `PUT`.
- **Eliminación Lógica (`paranoid: true`) con Sequelize:** Preservación de legajos históricos (`deleted_at`) mediante `.destroy()`, permitiendo restauración de registros.
- **Autenticación Robusta:** JWT firmado y transmitido en cookies seguras `httpOnly` y cabeceras `Authorization: Bearer`.
- **Hasheo de Contraseñas:** Algoritmo seguro `bcryptjs` con 10 rondas de salt.
- **Soporte Dual de Base de Datos:**
  - **MySQL (WampServer):** Configurado para el puerto estándar `3306` con usuario `root`.
  - **SQLite Resiliente:** Si el evaluador no tiene WampServer activo al momento de la prueba, la aplicación cambia de forma transparente y automática a SQLite persistente (`rednec_sincroaula_v3.sqlite`), garantizando un funcionamiento del 100% sin configuraciones previas.

---

## 📂 3. Estructura de Carpetas y Mapa de Archivos

```
coordinacion-docente-terapeuta-v3/
├── app.js                          # Servidor Express, middlewares globales, rutas y servido estático SPA
├── package.json                    # Dependencias y scripts de ejecución concurrentes (API + Vite)
├── .env / .env.example             # Variables de entorno (puertos, secretos JWT, credenciales BD)
├── .gitignore                      # Exclusión de node_modules, .env y dist
├── test_e2e.js                     # Suite de pruebas automatizadas integrales
│
├── src/                            # Código fuente del Backend
│   ├── config/
│   │   └── database.js             # Conexión Sequelize con detección MySQL WampServer / SQLite portable
│   ├── helpers/
│   │   ├── bcrypt.helper.js        # Utilidades para hasheo y comparación de contraseñas
│   │   └── jwt.helper.js           # Generación y verificación de tokens JWT firmados
│   ├── middlewares/
│   │   ├── auth.middleware.js      # Verificación de JWT desde cookies HttpOnly o Bearer header
│   │   ├── roles.middleware.js     # Control de acceso basado en roles (RBAC: Docente, Terapeuta, Familiar, Admin)
│   │   └── validate.middleware.js  # Middleware reutilizable para formatear errores de express-validator
│   ├── models/
│   │   ├── index.js                # Asociación de relaciones 1:1, 1:N y N:M con alias limpios y cascadas
│   │   ├── user.model.js           # Modelo Usuario (paranoid: true para eliminación lógica)
│   │   ├── role.model.js           # Catálogo de roles del sistema
│   │   ├── user_role.model.js      # Tabla intermedia N:M de asignación de roles
│   │   ├── docente_perfil.model.js # Perfil docente (CUE, institución, cargo)
│   │   ├── terapeuta_perfil.model.js # Perfil terapeuta (matrícula, especialidad, colegio)
│   │   ├── familiar_perfil.model.js  # Perfil tutor (DNI, parentesco, código escolar)
│   │   ├── alumno.model.js         # Legajo del alumno (sala, diagnóstico, semáforo en vivo, paranoid: true)
│   │   ├── vinculo_alumno.model.js # Tabla asociativa entre profesionales/familia y el alumno
│   │   ├── reporte.model.js        # Bitácora diaria con semáforo emocional (paranoid: true)
│   │   ├── estrategia.model.js     # Catálogo de estrategias sensoriales y pedagógicas
│   │   ├── alumno_estrategia.model.js # Estrategias activas vinculadas a cada alumno
│   │   └── alerta_coordinacion.model.js # Alertas preventivas en tiempo real de aula
│   ├── validations/
│   │   ├── auth.validation.js      # Validaciones para registro y login
│   │   ├── user.validation.js      # Validaciones con .optional() y matchedData() para usuarios
│   │   ├── alumno.validation.js    # Validaciones para ficha del alumno
│   │   ├── reporte.validation.js   # Validaciones para bitácora y semáforo
│   │   └── alerta.validation.js    # Validaciones para alertas de urgencia
│   ├── controllers/
│   │   ├── auth.controller.js      # REGISTRO, LOGIN, LOGOUT y PERFIL (con cookies HttpOnly)
│   │   ├── user.controller.js      # CRUD EXCLUSIVO DE USUARIOS (obtención, update y eliminación lógica)
│   │   ├── alumno.controller.js    # CRUD de alumnos y vinculación interdisciplinaria
│   │   ├── reporte.controller.js   # Gestión de bitácora y actualización de semáforo actual
│   │   ├── alerta.controller.js    # Emisión y atención de alertas de aula
│   │   ├── estrategia.controller.js # Catálogo de técnicas psicopedagógicas
│   │   └── admin.controller.js     # Estadísticas globales y validación de perfiles
│   ├── routes/
│   │   ├── auth.routes.js          # /api/auth
│   │   ├── user.routes.js          # /api/users
│   │   ├── alumno.routes.js        # /api/alumnos
│   │   ├── reporte.routes.js       # /api/reportes
│   │   ├── alerta.routes.js        # /api/alertas
│   │   ├── estrategia.routes.js    # /api/estrategias
│   │   └── admin.routes.js         # /api/admin
│   └── seeds/
│       └── seed.js                 # Sembrado automático de roles, usuarios demo, alumnos y estrategias
│
└── frontend/                       # Frontend Interactivo en React 18 + Vite
    ├── package.json                # React Router DOM, Lucide Icons, Vite
    ├── vite.config.js              # Configuración de Vite con proxy hacia /api
    ├── index.html                  # Plantilla HTML con tipografía moderna Outfit y Plus Jakarta Sans
    └── src/
        ├── index.css               # Sistema de estilos Pitch: gradientes, semáforo, animaciones y glassmorphism
        ├── services/api.js         # Cliente HTTP unificado con soporte credentials include
        ├── context/AuthContext.jsx  # Proveedor de autenticación, roles y modo Quick Demo en 1 clic
        ├── components/
        │   ├── common/             # SemaforoBadge interactivo y QuickDemoButtons
        │   ├── layout/             # Navbar moderno con indicador de rol y Footer institucional
        │   ├── pitch/              # PitchPresentationDeck (carrusel de diapositivas interactivas)
        │   ├── docente/            # AlertaModal para avisar al terapeuta
        │   └── terapeuta/          # SensoryToolbox (respiración guiada animada 4-4-4)
        └── pages/
            ├── Home.jsx            # Landing page Pitch con showcase interactivo
            ├── Login.jsx           # Login con botones de 1-clic para cuentas demo
            ├── Register.jsx        # Registro guiado con botón "Llenar con datos válidos"
            ├── PitchWorkspace.jsx  # Workspace completo de presentación para la defensa
            ├── DashboardDocente.jsx # Aula en vivo, cambio rápido de semáforo y bitácora
            ├── DashboardTerapeuta.jsx # Seguimiento conductual y herramientas sensoriales
            ├── DashboardFamiliar.jsx # "¿Cómo estuvo hoy?", medallero de logros y notas
            ├── DashboardAdmin.jsx  # Control de usuarios, eliminación lógica y restauración
            └── AlumnoDetalle.jsx   # Ficha 360° del alumno y equipo interdisciplinario
```

---

## 🔑 4. Cuentas de Demostración Preconfiguradas (1 Clic)

Para facilitar la evaluación instantánea, el sistema incluye usuarios demo ya inicializados:

| Rol | Correo Electrónico | Contraseña | Perfil Demostrativo |
| :--- | :--- | :--- | :--- |
| **Docente** | `lucia.docente@sincroaula.edu.ar` | `docente123` | Titular de Sala Amarilla (4 Años), Jardín N° 2 Formosa |
| **Terapeuta (AT)** | `mateo.terapeuta@sincroaula.edu.ar` | `terapeuta123` | Acompañante Terapéutico, Matrícula Formosa-AT-492 |
| **Tutor / Familiar** | `carlos.padre@sincroaula.edu.ar` | `familiar123` | Padre de Mauricio (Alumno con TEA Grado 1) |
| **Administrador** | `admin@sincroaula.edu.ar` | `admin123` | Administrador general de la plataforma |

> 💡 **Nota sobre el Registro:** En la pantalla `/register`, se agregó un botón destacado: **"🪄 Llenar con datos válidos"**. Al presionarlo, autocompleta instantáneamente todos los campos requeridos (con CUE válido, matrícula válida o código de vinculación familiar), permitiendo registrar nuevos usuarios en un solo clic sin bloqueos.

---

## 🚀 5. Instrucciones de Instalación y Ejecución

### Prerrequisitos
- Node.js versión 18 o superior instalado.
- Opcional: WampServer si se desea correr con MySQL local (si no está abierto, se utiliza SQLite automáticamente sin errores).

### Paso 1: Clonar o posicionarse en el proyecto
```bash
cd coordinacion-docente-terapeuta-v3
```

### Paso 2: Ejecución del Proyecto
Para iniciar tanto el Backend como el Frontend de manera simultánea en una sola consola:
```bash
npm run dev
```
- **Backend API:** [http://localhost:3001](http://localhost:3001)
- **Frontend Interactivo:** [http://localhost:5173](http://localhost:5173)
- **Diagnóstico y Healthcheck:** [http://localhost:3001/api/health](http://localhost:3001/api/health)

### Paso 3: Compilar Frontend para Producción (Opcional)
```bash
npm run build:frontend
npm start
```
Con esto, el servidor Express sirve directamente la aplicación React desde el puerto `3001`.

### Paso 4: Ejecutar Pruebas Automatizadas
```bash
npm test
```

---

## 📡 6. Referencia de Endpoints de la API REST

### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registro público con asignación de rol y perfil.
- `POST /api/auth/login` - Autenticación con generación de token JWT en cookie segura `httpOnly`.
- `GET /api/auth/profile` - Obtiene los datos del usuario autenticado actual.
- `PUT /api/auth/profile` - Actualiza información personal del perfil autenticado.
- `POST /api/auth/logout` - Cierre de sesión y limpieza de cookies de sesión.

### Usuarios y Eliminación Lógica (`/api/users`)
- `GET /api/users` - Listar usuarios registrados con filtros y perfiles (solo Admin).
- `GET /api/users/:id` - Obtener información completa de un usuario por su ID.
- `POST /api/users` - Crear usuario administrativamente.
- `PUT /api/users/:id` - Actualización con `.optional()` y `matchedData()`.
- `DELETE /api/users/:id` - Eliminación lógica mediante Sequelize (`paranoid: true`).
- `POST /api/users/:id/restore` - Restaurar usuario previamente eliminado.

### Alumnos (`/api/alumnos`)
- `GET /api/alumnos` - Listar alumnos vinculados al docente, terapeuta o familia.
- `GET /api/alumnos/:id` - Ficha 360° con equipo, estrategias y reportes.
- `POST /api/alumnos` - Registrar nuevo alumno con código de vinculación familiar.
- `PUT /api/alumnos/:id` - Actualizar datos y cambiar semáforo emocional en vivo.
- `DELETE /api/alumnos/:id` - Eliminación lógica de alumno.
- `POST /api/alumnos/:id/vincular` - Asignar profesional al equipo del alumno.

### Bitácora y Reportes Diarios (`/api/reportes`)
- `GET /api/reportes` - Consultar reportes con filtros por alumno, fecha o semáforo.
- `POST /api/reportes` - Crear nueva observación (actualiza en simultáneo el semáforo del alumno).
- `PUT /api/reportes/:id` - Modificar reporte existente (solo autor o admin).
- `DELETE /api/reportes/:id` - Eliminación lógica de reporte.

### Alertas de Aula (`/api/alertas`)
- `GET /api/alertas` - Listar alertas emitidas desde el aula.
- `POST /api/alertas` - Docente emite aviso inmediato de desregulación o cambio de actividad.
- `PUT /api/alertas/:id/atender` - Terapeuta marca la alerta como atendida.

### Catálogo de Estrategias (`/api/estrategias`)
- `GET /api/estrategias` - Catálogo de intervenciones sensoriales, conductuales y pedagógicas.
- `POST /api/estrategias/asociar` - Asignar estrategia recomendada al legajo del alumno.
