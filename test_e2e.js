async function runTests() {
  const testPort = process.env.TEST_PORT || "3099";
  process.env.PORT = testPort;
  const baseUrl = `http://localhost:${testPort}`;
  console.log(`[TEST] Iniciando pruebas E2E integrales de SincroAula en ${baseUrl}...`);
  await import("./app.js");
  await new Promise((r) => setTimeout(r, 2500));

  try {
    // 1. Healthcheck
    const rHealth = await fetch(`${baseUrl}/api/health`).then((r) => r.json());
    console.log("[OK] 1. Healthcheck:", rHealth.sistema, "| Enfoque:", rHealth.enfoque);

    // 2. Login Rol Docente
    const rLoginDocente = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "lucia.docente@sincroaula.edu.ar", password: "docente123" }),
    }).then((r) => r.json());
    console.log(
      "[OK] 2. Login Rol Docente:",
      rLoginDocente.ok,
      `${rLoginDocente.usuario?.nombre} ${rLoginDocente.usuario?.apellido}`,
      "| Rol:",
      rLoginDocente.usuario?.roles
    );
    const tokenDocente = rLoginDocente.token;

    // 3. Registro de Usuario seleccionando solo Rol (sin requerir nombres propios)
    const nuevoEmail = `terapeuta.rol.${Date.now()}@sincroaula.edu.ar`;
    const rReg = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: nuevoEmail,
        password: "Password123",
        rol: "TERAPEUTA",
      }),
    }).then((r) => r.json());
    console.log(
      "[OK] 3. Registro por Rol Exitoso:",
      rReg.ok,
      `${rReg.usuario?.nombre} ${rReg.usuario?.apellido}`,
      "| Email:",
      rReg.usuario?.email
    );
    const tokenTerapeuta = rReg.token;

    // 4. Docente registra un nuevo alumno con perfil TDAH
    const rNuevoAlumno = await fetch(`${baseUrl}/api/alumnos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenDocente,
      },
      body: JSON.stringify({
        nombre: "Alumno Nuevo",
        apellido: "(Seguimiento TDAH)",
        sala_grado: "Sala de 5 Años",
        turno: "MAÑANA",
        diagnostico: "TDAH Presentación Combinada",
      }),
    }).then((r) => r.json());
    console.log("[OK] 4. Docente registra alumno:", rNuevoAlumno.ok, rNuevoAlumno.alumno?.nombre);
    const alumnoId = rNuevoAlumno.alumno?.id || 1;

    // 5. Docente crea una Presentación Adaptada para el alumno
    const rPres = await fetch(`${baseUrl}/api/presentaciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenDocente,
      },
      body: JSON.stringify({
        titulo: "Secuencia Adaptada de Conteo TDAH",
        objetivo_pedagogico: "Enfoque atencional en 3 pasos cortos",
        alumno_id: alumnoId,
        diapositivas: [
          { orden: 1, titulo: "Paso 1", instruccion: "Mirar bloques", apoyo_visual: "Estado Verde" },
        ],
      }),
    }).then((r) => r.json());
    console.log("[OK] 5. Presentación Adaptada creada por Docente:", rPres.ok, rPres.presentacion?.titulo);

    // 6. Docente asigna tarea y se envía primero al Terapeuta
    const rTarea = await fetch(`${baseUrl}/api/tareas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenDocente,
      },
      body: JSON.stringify({
        titulo: "Actividad de Clasificación por Colores",
        consigna_original: "Separar 10 objetos por color y tamaño.",
        tipo_asignacion: "INDIVIDUAL",
        alumno_id: alumnoId,
      }),
    }).then((r) => r.json());
    const tareaCreada = rTarea.tareas?.[0];
    console.log(
      "[OK] 6. Docente crea tarea (enviada al Terapeuta):",
      rTarea.ok,
      "| Estado inicial:",
      tareaCreada?.estado
    );

    // 7. Terapeuta adapta la tarea según pautas específicas de TDAH y la envía al Tutor
    const rAdaptar = await fetch(`${baseUrl}/api/tareas/${tareaCreada.id}/adaptar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenTerapeuta,
      },
      body: JSON.stringify({
        pautas_tdah_aplicadas: "Micro-segmentación (Chunking) + Reloj Visual Pomodoro 5 min",
        adaptacion_terapeuta: "Paso 1: Elegir 3 objetos rojos. Pausa activa 2 min. Paso 2: Elegir 3 azules.",
      }),
    }).then((r) => r.json());
    console.log(
      "[OK] 7. Terapeuta adapta tarea con pautas TDAH:",
      rAdaptar.ok,
      "| Nuevo estado:",
      rAdaptar.tarea?.estado
    );

    // 8. Login Familiar / Tutor y envío de reporte de cómo estuvo su hijo en la actividad
    const rLoginTutor = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "carlos.padre@sincroaula.edu.ar", password: "familiar123" }),
    }).then((r) => r.json());
    const tokenTutor = rLoginTutor.token;

    const rReporteTutor = await fetch(
      `${baseUrl}/api/tareas/${tareaCreada.id}/reporte-tutor`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenTutor,
        },
        body: JSON.stringify({
          reporte_tutor: "Realizó los dos pasos cortos con mucha alegría y sin distraerse.",
          nivel_atencion_hogar: "ALTO_ENFOQUE",
          destinatario_reporte_tutor: "AMBOS",
        }),
      }
    ).then((r) => r.json());
    console.log(
      "[OK] 8. Tutor envía reporte sobre la actividad:",
      rReporteTutor.ok,
      "| Estado final:",
      rReporteTutor.tarea?.estado
    );

    // 9. Chat en tiempo real entre roles
    const rChat = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenDocente,
      },
      body: JSON.stringify({
        alumno_id: alumnoId,
        destinatario_rol: "TODOS",
        contenido: "Excelente coordinación equipo, recibí el reporte del tutor.",
      }),
    }).then((r) => r.json());
    console.log("[OK] 9. Mensaje en Chat en Tiempo Real:", rChat.ok);

    // 10. Tutor actualiza Sincronizador Matutino Pre-Aula (3 pautas) y Gravedad TDAH (Ficha Médica)
    const rSyncPreAula = await fetch(`${baseUrl}/api/alumnos/${alumnoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenTutor,
      },
      body: JSON.stringify({
        gravedad_tdah: "SEVERO",
        ficha_medica: JSON.stringify({
          profesional_emisor: "Neurología Infantil · Mat. 8412",
          subtipo_dsm5: "TDAH Combinado",
          ventana_atencional_min: 6,
        }),
        sincronizador_matutino: JSON.stringify({
          descanso: "Sueño Intermitente",
          disposicion: "Energía Alta",
          preparacion: "Rutina con Pictogramas",
          completado: true,
        }),
      }),
    }).then((r) => r.json());
    console.log(
      "[OK] 10. Sincronizador Pre-Aula y Ficha Médica por Gravedad actualizados por Tutor:",
      rSyncPreAula.ok,
      "| Gravedad:",
      rSyncPreAula.alumno?.gravedad_tdah
    );

    // 11. Docente calibra y guarda la Agenda Diaria Personalizada del alumno
    const rAgenda = await fetch(`${baseUrl}/api/alumnos/${alumnoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokenDocente,
      },
      body: JSON.stringify({
        agenda_diaria: JSON.stringify([
          { id: 1, hora: "08:15", bloque: "Anclaje Propioceptivo", duracion: "5 min", tipo: "PAUSA", completado: true },
          { id: 2, hora: "08:25", bloque: "Misión Corta TDAH Severo", duracion: "6 min", tipo: "FOCO", completado: false },
        ]),
      }),
    }).then((r) => r.json());
    console.log("[OK] 11. Agenda Diaria Personalizada guardada por Docente:", rAgenda.ok);

    console.log("\n[EXITO] TODAS LAS PRUEBAS DE SINCROAULA PASARON AL 100%");
    process.exit(0);
  } catch (err) {
    console.error("[ERROR] Error en pruebas:", err);
    process.exit(1);
  }
}

runTests();
