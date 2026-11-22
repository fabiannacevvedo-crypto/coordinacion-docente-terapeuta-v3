# SincroAula — Plataforma de Coordinación Neuroeducativa y Terapéutica (Especializada en TDAH)

**SincroAula** es una plataforma web interactiva y colaborativa diseñada para sincronizar en tiempo real el trabajo del **Rol Docente**, el **Rol Terapeuta (Acompañante Terapéutico)** y el **Familiar / Tutor**, con un enfoque especializado en el abordaje pedagógico, clínico y tecnológico del **Trastorno por Déficit de Atención e Hiperactividad (TDAH)**.

---

## Guía de Funcionalidades Implementadas y Cómo Favorecen a la Plataforma

### 1. Identidad Limpia y Registro Ágil por Rol (Sin Nombres Propios)
- **Marca Unificada `SincroAula`**: Se eliminaron todas las referencias a versiones preliminares (`v3`), `Workspace Pitch` e identificadores institucionales/autores antiguos en toda la interfaz y en el pie de página (`Footer`).
- **Problema Explicado de Forma Genérica**: En el *Showcase Interactivo: Proyecto SincroAula* se expone la problemática real de descoordinación áulica de manera genérica entre el rol docente, el acompañante terapéutico y el alumno con TDAH, sin utilizar nombres propios.
- **Registro e Inicio de Sesión Exclusivamente por Rol**: Al registrarse o ingresar con acceso rápido, el usuario selecciona únicamente su rol (**Rol Docente**, **Rol Terapeuta** o **Familiar / Tutor**) sin necesidad de cargar nombres personales.

### 2. Panel del Rol Docente: Gestión Integral del Aula Inclusiva
- **Creación de Presentaciones Adaptadas para el Alumno**: Reubicada exclusivamente dentro del panel del Docente. Permite crear diapositivas pedagógicas con **diseño minimalista sin distractores**, **1 sola consigna por pantalla**, apoyo visual y temporización sugerida para alumnos con TDAH. Incluye plantillas rápidas de un clic y visor interactivo en modo aula.
- **Registro de Alumnos con Perfil TDAH**: El docente puede dar de alta nuevos alumnos indicando su sala, turno, subtipo de TDAH (Combinado, Predominio Inatento o Predominio Hiperactivo-Impulsivo) y pautas iniciales, generando automáticamente el código de vinculación familiar y enlazándolo con el equipo terapéutico.
- **Asignación de Tareas (Individual o en Conjunto) con Envío Previo al Terapeuta**: El docente redacta la tarea y elige si la asigna a un alumno en particular o a toda la sala en conjunto. **Antes de ser enviada al Padre/Tutor**, la tarea pasa automáticamente a la bandeja del **Rol Terapeuta** (`estado: PENDIENTE_TERAPEUTA`) para su adaptación clínica.
- **Chat en Tiempo Real con Padres y Terapeutas**: Canal instantáneo con respuestas rápidas y selector de destinatario.

### 3. Panel del Rol Terapeuta / AT: Adaptación TDAH y Caja de Herramientas Expandida
- **Bandeja de Adaptación Curricular y Ejecutiva TDAH**: El terapeuta recibe las tareas creadas por el docente antes de que lleguen a la familia. Mediante un editor especializado con etiquetas de 1 clic, aplica pautas neuroeducativas orientadas al TDAH:
  - **Micro-segmentación de consignas (*Chunking*)**: División de tareas largas en misiones cortas de 3 pasos para no saturar la memoria de trabajo.
  - **Externalización del Tiempo (*Pomodoro Escolar / Time-Timer*)**: Bloques de enfoque de 5 a 10 minutos con pausas activas.
  - **Pausas Kinestésicas y Propioceptivas**: Canalización saludable de la hiperactividad motora.
  - **Reducción de Estímulos Distractores y Doble Canal Sensorial**.
- **Caja de Herramientas Clínicas y Sensoriales Expandida (`SensoryToolbox`)**:
  1. **Guía de Respiración 4-4-4**: Animación visual interactiva para descompresión sensorial y regulación vagal.
  2. **Reloj Visual TDAH (*Time-Timer* / Pomodoro)**: Temporizador regresivo con barra de progreso visual para bloques de 3, 5 y 10 minutos.
  3. **Autoinstrucciones de Meichenbaum**: Checklist interactivo de 4 pasos (*1. Paro y miro, 2. ¿Qué tengo que hacer?, 3. Lo hago con calma, 4. Reviso y me felicito*) para entrenar el freno inhibitorio ante la impulsividad.
  4. **Tablero de Economía de Fichas Dopaminérgica**: Sistema interactivo de estrellas y recompensas inmediatas para sostener la motivación en el TDAH.
  5. **Monitoreo de Función Ejecutiva en Vivo**: Deslizadores de *Foco Atencional Sostenido* vs. *Inquietud Motora / Impulsividad*.

### 4. Portal del Familiar / Tutor: Transparencia y Reporte Directo de Actividades
- **Visualización de Tareas y Adaptaciones TDAH**: El tutor visualiza cada tarea enviada junto con el **nombre del Docente asignador**, el **nombre del Terapeuta adaptador** y el **Tutor responsable**, viendo tanto la consigna original como la adaptación paso a paso para el hogar.
- **Envío de Reporte o Mensaje sobre el Desempeño del Hijo**: En cada actividad, el tutor cuenta con un botón para reportar cómo estuvo su hijo (nivel de enfoque alcanzado y comentario detallado), pudiendo **elegir si envía el reporte al Rol Docente, al Rol Terapeuta o a Ambos simultáneamente**.
- **Acceso a Presentaciones Adaptadas, Medallero de Logros y Chat Directo**.

---

## Fundamento Tecnológico y Terapéutico: El Acompañante Terapéutico en TDAH llevado a lo Digital

| Práctica Clínica Actual en TDAH | Implementación Tecnológica en SincroAula | Cómo Favorece a la Coordinación |
| :--- | :--- | :--- |
| **Andamiaje de Memoria de Trabajo (*Chunking*)** | Circuito `Docente → Terapeuta → Tutor` con micro-segmentación de consignas. | Evita que el niño reciba tareas abrumadoras en casa; el tutor recibe pasos cortos y accionables validados por el AT. |
| **Externalización del Tiempo (*Time Blindness*)** | Temporizador Visual Regresivo (*Time-Timer*) integrado en la Caja de Herramientas. | Reduce la ansiedad de transición y permite pactar bloques cortos de foco atencional en el aula y en casa. |
| **Freno Inhibitorio e Impulsividad** | Módulo interactivo de **Autoinstrucciones de Meichenbaum** y **Presentaciones sin Distractores**. | Estandariza el lenguaje visual entre docente y terapeuta para guiar la autorregulación verbal y ejecutiva. |
| **Motivación y Refuerzo Inmediato** | **Economía de Fichas Digital** y Medallero Semanal en el Portal Familiar. | Conecta los logros del aula con la celebración en el hogar, reforzando positivamente la dopamina y autoestima. |
| **Monitoreo Ecológico Multimodal** | Reporte Familiar post-tarea con selector de destinatario + Chat en Tiempo Real. | Cierra el bucle clínico: el docente y el terapeuta conocen al instante cómo respondió el alumno en casa. |

---

## Tecnologías Utilizadas

1. **Backend (API RESTful & ORM)**:
   - **Node.js + Express**: Arquitectura modular separada en controladores (`auth`, `user`, `alumno`, `tarea`, `chat`, `presentacion`, `reporte`, `alerta`, `estrategia`, `admin`), rutas y middlewares.
   - **Sequelize ORM**: Modelos relacionales (`1:1`, `1:N`, `N:M`) con soporte dual automático para **MySQL** y **SQLite** portable, e integridad histórica mediante borrado lógico (`paranoid: true`).
   - **Seguridad y Validación**: Autenticación con **JWT (`jsonwebtoken`)** en cookies `httpOnly` + cabeceras `Bearer`, encriptación de contraseñas con **`bcryptjs`**, control de acceso basado en roles (**RBAC**) y validación de datos con **`express-validator`**.

2. **Frontend (Single Page Application)**:
   - **React 18 + Vite**: Interfaz reactiva de alto rendimiento con estado global de sesión (`AuthContext`).
   - **React Router DOM v6**: Rutas protegidas por rol (`/dashboard/docente`, `/dashboard/terapeuta`, `/dashboard/familiar`, `/dashboard/admin`).
   - **Lucide React + CSS Moderno**: Iconografía intuitiva, semáforos sensoriales animados y diseño accesible de bajo estímulo distractor.

---

## Cómo Utilizar la Plataforma Paso a Paso

### 1. Instalación y Puesta en Marcha
```bash
# 1. Instalar dependencias del backend y frontend
npm install
npm install --prefix frontend

# 2. Compilar el frontend de producción (servido automáticamente por Express)
npm run build:frontend

# 3. Iniciar el servidor unificado en http://localhost:3001
npm start

# (Opcional) Ejecutar modo desarrollo concurrente (Backend + Vite)
npm run dev
```

### 2. Flujo Recomendado de Prueba (Circuito Completo TDAH)
1. **Ingresar como Rol Docente** (usando el botón de *Acceso Directo por Rol -> Rol Docente* o registrándose como Docente):
   - Ir a **Creación de Presentaciones Adaptadas para el Alumno** y crear o proyectar una presentación paso a paso.
   - Hacer clic en **Registrar Alumno** para dar de alta un nuevo estudiante con perfil TDAH.
   - Hacer clic en **Asignar Tarea (Enviar a Terapeuta)**, elegir modalidad *Individual* o *En Conjunto* y enviarla.
2. **Ingresar como Rol Terapeuta** (*Acceso Directo por Rol -> Rol Terapeuta*):
   - En la **Bandeja de Tareas para Adaptar a TDAH**, hacer clic en **Adaptar con Pautas TDAH y Enviar al Tutor**.
   - Seleccionar las pautas clínicas (ej. *Micro-segmentación Chunking*, *Temporizador Pomodoro*, *Autoinstrucciones*) y guardar.
   - Probar las 4 pestañas de la **Caja de Herramientas Clínicas y Sensoriales TDAH** (Respiración 4-4-4, Reloj Visual, Autoinstrucciones y Economía de Fichas).
3. **Ingresar como Familiar / Tutor** (*Acceso Directo por Rol -> Familiar / Tutor*):
   - Visualizar la tarea ya adaptada con los nombres de los roles responsables (**Rol Docente**, **Rol Terapeuta** y **Familiar Tutor**).
   - Hacer clic en **Enviar Reporte / Mensaje de cómo estuvo mi hijo**, elegir si enviarlo al **Docente**, al **Terapeuta** o a **Ambos**, seleccionar el nivel de foco y enviar.
4. **Verificar Pruebas Automatizadas E2E**:
   ```bash
   npm test
   ```
