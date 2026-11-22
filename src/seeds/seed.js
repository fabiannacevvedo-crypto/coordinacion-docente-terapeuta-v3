import {
  sequelize,
  UserModel,
  RoleModel,
  UserRoleModel,
  DocentePerfilModel,
  TerapeutaPerfilModel,
  FamiliarPerfilModel,
  AlumnoModel,
  VinculoAlumnoModel,
  ReporteModel,
  EstrategiaModel,
  AlumnoEstrategiaModel,
  AlertaCoordinacionModel,
  TareaModel,
  MensajeChatModel,
  PresentacionAdaptadaModel,
} from "../models/index.js";
import { asegurarBaseDeDatosMySQL } from "../config/database.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

export async function runSeed() {
  console.log("[SincroAula] Iniciando siembra de datos iniciales...");

  await asegurarBaseDeDatosMySQL();
  await sequelize.sync({ alter: true });

  // 1. Crear Roles
  const rolesData = [
    { name: "ADMIN", description: "Administrador general del sistema" },
    { name: "DOCENTE", description: "Docente de sala a cargo de la enseñanza y seguimiento" },
    { name: "TERAPEUTA", description: "Terapeuta o Acompañante Terapéutico (AT) especializado en TDAH" },
    { name: "FAMILIAR", description: "Padre, Madre o Tutor Familiar del alumno" },
  ];

  const rolesMap = {};
  for (const r of rolesData) {
    const [role] = await RoleModel.findOrCreate({
      where: { name: r.name },
      defaults: r,
    });
    rolesMap[r.name] = role;
  }
  console.log("[OK] Roles inicializados");

  // 2. Crear Usuarios Demo
  const adminPass = await hashPassword("admin123");
  const docentePass = await hashPassword("docente123");
  const terapeutaPass = await hashPassword("terapeuta123");
  const familiarPass = await hashPassword("familiar123");

  // Admin
  const [admin] = await UserModel.findOrCreate({
    where: { email: "admin@sincroaula.edu.ar" },
    defaults: {
      nombre: "Rol",
      apellido: "Administrador",
      email: "admin@sincroaula.edu.ar",
      password: adminPass,
      telefono: "3704-000001",
      estado_verificacion: "APROBADO",
    },
  });
  await admin.update({ nombre: "Rol", apellido: "Administrador" });
  await UserRoleModel.findOrCreate({
    where: { user_id: admin.id, role_id: rolesMap["ADMIN"].id },
  });

  // Docente
  const [docente] = await UserModel.findOrCreate({
    where: { email: "lucia.docente@sincroaula.edu.ar" },
    defaults: {
      nombre: "Rol",
      apellido: "Docente",
      email: "lucia.docente@sincroaula.edu.ar",
      password: docentePass,
      telefono: "3704-112233",
      estado_verificacion: "APROBADO",
    },
  });
  await docente.update({ nombre: "Rol", apellido: "Docente" });
  await UserRoleModel.findOrCreate({
    where: { user_id: docente.id, role_id: rolesMap["DOCENTE"].id },
  });
  await DocentePerfilModel.findOrCreate({
    where: { user_id: docente.id },
    defaults: {
      user_id: docente.id,
      institucion: "Institución Educativa Nivel Inicial",
      cue_escuela: "340058200",
      cargo: "Docente Titular de Sala",
      nivel_educativo: "Nivel Inicial",
      constancia_adjunta: "resolucion_docente_titular.pdf",
      verificado_institucional: true,
    },
  });

  // Terapeuta
  const [terapeuta] = await UserModel.findOrCreate({
    where: { email: "mateo.terapeuta@sincroaula.edu.ar" },
    defaults: {
      nombre: "Rol",
      apellido: "Terapeuta",
      email: "mateo.terapeuta@sincroaula.edu.ar",
      password: terapeutaPass,
      telefono: "3704-445566",
      estado_verificacion: "APROBADO",
    },
  });
  await terapeuta.update({ nombre: "Rol", apellido: "Terapeuta" });
  await UserRoleModel.findOrCreate({
    where: { user_id: terapeuta.id, role_id: rolesMap["TERAPEUTA"].id },
  });
  await TerapeutaPerfilModel.findOrCreate({
    where: { user_id: terapeuta.id },
    defaults: {
      user_id: terapeuta.id,
      especialidad: "Acompañante Terapéutico Especializado en TDAH",
      matricula_tipo: "MP",
      matricula_numero: "AT-492",
      colegio_profesional: "Colegio de Profesionales de Salud y Psicopedagogía",
      jurisdiccion: "Nacional / Provincial",
      credencial_adjunta: "matricula_terapeuta_tdah.pdf",
      verificado_salud: true,
    },
  });

  // Familiar / Tutor
  const [familiar] = await UserModel.findOrCreate({
    where: { email: "carlos.padre@sincroaula.edu.ar" },
    defaults: {
      nombre: "Familiar",
      apellido: "Tutor",
      email: "carlos.padre@sincroaula.edu.ar",
      password: familiarPass,
      telefono: "3704-778899",
      estado_verificacion: "APROBADO",
    },
  });
  await familiar.update({ nombre: "Familiar", apellido: "Tutor" });
  await UserRoleModel.findOrCreate({
    where: { user_id: familiar.id, role_id: rolesMap["FAMILIAR"].id },
  });
  await FamiliarPerfilModel.findOrCreate({
    where: { user_id: familiar.id },
    defaults: {
      user_id: familiar.id,
      dni: "34821904",
      parentesco: "TUTOR_LEGAL",
      codigo_vinculacion: "FAM-MAU-2026",
      documento_adjunto: "vinculacion_familiar.pdf",
      verificado_tutela: true,
    },
  });
  console.log("[OK] Usuarios base creados (Rol Docente, Rol Terapeuta, Familiar Tutor, Administrador)");

  // 3. Crear Alumnos con orientación en TDAH
  const [alumno1] = await AlumnoModel.findOrCreate({
    where: { codigo_familiar: "FAM-MAU-2026" },
    defaults: {
      nombre: "Alumno 1",
      apellido: "(Seguimiento TDAH Combinado)",
      fecha_nacimiento: "2020-04-15",
      diagnostico: "TDAH Presentación Combinada (Inatención e Hiperactividad-Impulsividad) con sensibilidad auditiva",
      sala_grado: "Sala de 5 Años - Turno Mañana",
      turno: "MAÑANA",
      semaforo_actual: "VERDE",
      observaciones: "Responde de manera sobresaliente a micro-segmentación de consignas (Chunking), apoyos visuales y bloques cortos de 10 minutos con descarga motriz.",
      codigo_familiar: "FAM-MAU-2026",
    },
  });
  await alumno1.update({
    diagnostico: "TDAH Presentación Combinada (Inatención e Hiperactividad-Impulsividad) con sensibilidad auditiva",
    observaciones: "Responde de manera sobresaliente a micro-segmentación de consignas (Chunking), apoyos visuales y bloques cortos de 10 minutos con descarga motriz.",
  });

  const [alumno2] = await AlumnoModel.findOrCreate({
    where: { codigo_familiar: "FAM-SOF-2026" },
    defaults: {
      nombre: "Alumna 2",
      apellido: "(TDAH Predominio Hiperactivo)",
      fecha_nacimiento: "2020-09-20",
      diagnostico: "TDAH con predominio hiperactivo-impulsivo en transiciones áulicas",
      sala_grado: "Sala de 5 Años - Turno Mañana",
      turno: "MAÑANA",
      semaforo_actual: "AMARILLO",
      observaciones: "Requiere pausas kinestésicas activas, economía de fichas positiva y anticipación con reloj visual 5 minutos antes de cambiar de actividad.",
      codigo_familiar: "FAM-SOF-2026",
    },
  });

  const [alumno3] = await AlumnoModel.findOrCreate({
    where: { codigo_familiar: "FAM-LUC-2026" },
    defaults: {
      nombre: "Alumno 3",
      apellido: "(TDAH Predominio Inatento)",
      fecha_nacimiento: "2021-02-10",
      diagnostico: "TDAH con predominio de déficit de atención y fatiga en memoria de trabajo",
      sala_grado: "Sala de 4 Años - Turno Mañana",
      turno: "MAÑANA",
      semaforo_actual: "VERDE",
      observaciones: "Necesita reducción de distractores visuales en hoja (diseño limpio), instrucciones de un solo paso y refuerzo verbal inmediato.",
      codigo_familiar: "FAM-LUC-2026",
    },
  });
  console.log("[OK] Alumnos con perfiles neuroeducativos TDAH inicializados");

  // 4. Vínculos Equipo Interdisciplinario -> Alumnos
  for (const alum of [alumno1, alumno2, alumno3]) {
    await VinculoAlumnoModel.findOrCreate({
      where: { alumno_id: alum.id, user_id: docente.id },
      defaults: { alumno_id: alum.id, user_id: docente.id, tipo_vinculo: "DOCENTE_AULA", estado: "ACTIVO" },
    });
    await VinculoAlumnoModel.findOrCreate({
      where: { alumno_id: alum.id, user_id: terapeuta.id },
      defaults: { alumno_id: alum.id, user_id: terapeuta.id, tipo_vinculo: "TERAPEUTA_ACOMPANIANTE", estado: "ACTIVO" },
    });
    await VinculoAlumnoModel.findOrCreate({
      where: { alumno_id: alum.id, user_id: familiar.id },
      defaults: { alumno_id: alum.id, user_id: familiar.id, tipo_vinculo: "TUTOR_FAMILIAR", estado: "ACTIVO" },
    });
  }

  // 5. Catálogo de Estrategias Clínicas y Tecnológicas orientadas a TDAH
  const estrategias = [
    {
      nombre: "Micro-segmentación de consignas (Chunking Ejecutivo)",
      categoria: "PEDAGOGICA",
      descripcion: "Dividir toda tarea escolar en micro-misiones de un solo paso verificable para no saturar la memoria de trabajo en niños con TDAH.",
      pasos_guia: "1. Entregar solo el Paso 1 visible. 2. Validar con check visual al terminar. 3. Habilitar el Paso 2 con refuerzo inmediato.",
      icono: "check-circle",
      color_tag: "#10b981",
    },
    {
      nombre: "Temporizador Visual Time-Timer (Bloques de Enfoque 10+3)",
      categoria: "CONDUCTUAL",
      descripcion: "Externalización del tiempo mediante disco visual regresivo de 10 minutos de foco atencional seguidos de 3 minutos de pausa motora.",
      pasos_guia: "1. Mostrar el reloj visual en pantalla. 2. Acordar la meta breve antes de que el color desaparezca. 3. Celebrar y realizar pausa activa.",
      icono: "clock",
      color_tag: "#3b82f6",
    },
    {
      nombre: "Autoinstrucciones de Meichenbaum (Guía Interna TDAH)",
      categoria: "COMUNICACION",
      descripcion: "Entrenamiento cognitivo en 4 pasos para frenar la impulsividad antes de responder: 1. Paro y miro, 2. ¿Qué debo hacer?, 3. Lo hago con calma, 4. Me felicito.",
      pasos_guia: "Colocar la tarjeta visual de los 4 pasos en el pupitre y guiar verbalmente el primer paso.",
      icono: "brain",
      color_tag: "#8b5cf6",
    },
    {
      nombre: "Pausa Kinestésica y Propioceptiva Programada",
      categoria: "SENSORIAL",
      descripcion: "Canalización saludable de la hiperactividad motora mediante encargos activos en el aula o ejercicios de presión articular.",
      pasos_guia: "Asignar rol de 'ayudante de materiales' o realizar 2 minutos de estiramiento guiado antes de actividades sedentarias.",
      icono: "activity",
      color_tag: "#f59e0b",
    },
    {
      nombre: "Adecuación de Doble Canal y Filtro de Distractores",
      categoria: "SENSORIAL",
      descripcion: "Reducción de sobrecarga visual en láminas y uso de ruido marrón/blanco suave o auriculares atenuadores ante ruidos externos.",
      pasos_guia: "Presentar una sola actividad por pantalla/hoja con tipografía clara y alto contraste.",
      icono: "headphones",
      color_tag: "#06b6d4",
    },
  ];

  for (const est of estrategias) {
    const [estrategiaCreada] = await EstrategiaModel.findOrCreate({
      where: { nombre: est.nombre },
      defaults: est,
    });
    await AlumnoEstrategiaModel.findOrCreate({
      where: { alumno_id: alumno1.id, estrategia_id: estrategiaCreada.id },
      defaults: {
        alumno_id: alumno1.id,
        estrategia_id: estrategiaCreada.id,
        efectividad: "ALTA",
        notas: "Excelente respuesta atencional tanto en sala como en las actividades del hogar.",
      },
    });
  }
  console.log("[OK] Catálogo de estrategias TDAH inicializado");

  // 6. Tareas de Ejemplo en el Circuito Docente -> Terapeuta -> Tutor Familiar
  const countTareas = await TareaModel.count();
  if (countTareas === 0) {
    // Tarea 1: Ya adaptada por el Terapeuta y lista para el Tutor Familiar
    await TareaModel.create({
      titulo: "Clasificación de Figuras y Colores con Secuencia Visual",
      consigna_original:
        "Recortar las 12 figuras geométricas de la lámina, agruparlas por color primario, pegarlas en el cuaderno y pintar el paisaje de fondo.",
      tipo_asignacion: "INDIVIDUAL",
      alumno_id: alumno1.id,
      docente_id: docente.id,
      terapeuta_id: terapeuta.id,
      subtipo_tdah_objetivo: "TDAH Combinado (Control de Impulsividad y Memoria de Trabajo)",
      pautas_tdah_aplicadas:
        "Micro-segmentación en 3 pasos cortos (Chunking) + Uso de Temporizador Visual de 8 min + Eliminación de estímulo distractor (paisaje de fondo opcional)",
      adaptacion_terapeuta:
        "MISIÓN EN 3 PASOS CORTOS (Con pausa activa intermedia):\n• PASO 1 (5 min): Elegimos solo 4 figuras grandes (rojas y azules) y las separamos sobre la mesa.\n• PAUSA ACTIVA (2 min): Estiramos brazos y caminamos antes de pegar.\n• PASO 2 (5 min): Pegamos las 4 figuras en la hoja limpia sin bordes distractores.\n• PASO 3 (Logro): Chocamos los cinco y marcamos la insignia de misión cumplida.",
      recursos_apoyo: "Temporizador visual 5 min + Pictograma 'Primero recorto, después pego'",
      estado: "ADAPTADA_ENVIADA_TUTOR",
      fecha_entrega: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    });

    // Tarea 2: Creada por el Docente en conjunto y PENDIENTE de que el Terapeuta la adapte antes de ir al Tutor
    await TareaModel.create({
      titulo: "Cuento Secuenciado: Los Animales de la Selva",
      consigna_original:
        "Escuchar el cuento leído en clase, ordenar las 5 viñetas temporales de principio a fin y describir oralmente qué hace cada personaje.",
      tipo_asignacion: "CONJUNTO",
      alumno_id: alumno1.id,
      docente_id: docente.id,
      terapeuta_id: null,
      subtipo_tdah_objetivo: "TDAH - Sostén de Atención Auditiva y Secuenciación Ejecutiva",
      estado: "PENDIENTE_TERAPEUTA",
      fecha_entrega: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    });

    // Tarea 3: Completada con devolución del Tutor Familiar
    await TareaModel.create({
      titulo: "Juego de Conteo con Bloques Sensoriales (1 al 5)",
      consigna_original:
        "Agrupar bloques según el número indicado en cada tarjeta y registrar la cantidad.",
      tipo_asignacion: "INDIVIDUAL",
      alumno_id: alumno1.id,
      docente_id: docente.id,
      terapeuta_id: terapeuta.id,
      subtipo_tdah_objetivo: "TDAH - Regulación Motriz y Foco Atencional Manipulativo",
      pautas_tdah_aplicadas:
        "Aprendizaje kinestésico manipulativo + Economía de fichas con estrellas + Bloques de 6 minutos",
      adaptacion_terapeuta:
        "1. Usar bloques reales de colores sobre alfombra libre de otros juguetes.\n2. Colocar una sola tarjeta numérica a la vez.\n3. Por cada tarjeta completada, colocar una ficha verde en el tablero de logros.",
      recursos_apoyo: "Tablero de Economía de Fichas + Bloques grandes",
      estado: "COMPLETADA_POR_TUTOR",
      reporte_tutor:
        "¡Excelente actividad! Con la división en pasos cortos y el reloj visual estuvo súper concentrado, no se frustró y pidió hacerlo una vez más.",
      nivel_atencion_hogar: "ALTO_ENFOQUE",
      destinatario_reporte_tutor: "AMBOS",
      fecha_entrega: new Date().toISOString().split("T")[0],
    });
  }

  // 7. Presentaciones Adaptadas creadas por el Docente para los alumnos
  const countPres = await PresentacionAdaptadaModel.count();
  if (countPres === 0) {
    await PresentacionAdaptadaModel.create({
      titulo: "Rutina Visual de la Mañana y Conteo Divertido (Adaptada TDAH)",
      objetivo_pedagogico:
        "Anticipar la estructura de la clase reduciendo la ansiedad ejecutiva y practicar números del 1 al 3 con estímulo visual limpio.",
      alumno_id: alumno1.id,
      docente_id: docente.id,
      perfil_sensorial_tdah: "Diseño Minimalista sin Distractores + 1 Consigna por Diapositiva",
      compartida_con_familia: true,
      diapositivas_json: JSON.stringify([
        {
          orden: 1,
          titulo: "1. ¡Bienvenidos! Nos saludamos con calma",
          instruccion: "Miramos la pantalla, respiramos profundo 3 veces y chocamos las manos con el compañero.",
          apoyo_visual: "Estado Verde · 3 minutos",
          pauta_tdah: "Anclaje atencional inicial sin sobrecarga sonora",
        },
        {
          orden: 2,
          titulo: "2. Misión Corta: Buscamos 3 Bloques Azules",
          instruccion: "Solo buscamos bloques de color AZUL y los ponemos dentro de la caja.",
          apoyo_visual: "3 Bloques Azules · Reloj Visual: 5 minutos",
          pauta_tdah: "Consigna única y concreta con movimiento motor permitido",
        },
        {
          orden: 3,
          titulo: "3. Pausa Activa de Movimiento",
          instruccion: "Nos paramos, estiramos los brazos al techo y sacudimos las manos durante 1 minuto.",
          apoyo_visual: "Descarga Kinestésica Regulada",
          pauta_tdah: "Prevención de fatiga atencional e impulsividad",
        },
        {
          orden: 4,
          titulo: "4. ¡Logro Desbloqueado!",
          instruccion: "Guardamos los bloques y ganamos la insignia de Gran Equipo del día.",
          apoyo_visual: "Refuerzo Positivo Inmediato",
          pauta_tdah: "Dopamina positiva por cierre exitoso de tarea",
        },
      ]),
    });
  }

  // 8. Mensajes iniciales del Chat en Tiempo Real
  const countChat = await MensajeChatModel.count();
  if (countChat === 0) {
    await MensajeChatModel.create({
      alumno_id: alumno1.id,
      emisor_id: docente.id,
      emisor_rol: "DOCENTE",
      destinatario_rol: "TERAPEUTA",
      contenido:
        "Hola equipo, acabo de cargar la actividad de Clasificación y el Cuento Secuenciado para que puedan adaptarlos con pautas TDAH antes de enviarlos a la familia.",
      tipo_mensaje: "CHAT",
    });

    await MensajeChatModel.create({
      alumno_id: alumno1.id,
      emisor_id: terapeuta.id,
      emisor_rol: "TERAPEUTA",
      destinatario_rol: "TODOS",
      contenido:
        "¡Perfecto! Ya adapté la tarea de Clasificación aplicando micro-segmentación en 3 pasos cortos y pausa activa de 2 minutos. Ya está disponible en el Portal del Tutor.",
      tipo_mensaje: "PAUTA_TERAPEUTICA",
    });

    await MensajeChatModel.create({
      alumno_id: alumno1.id,
      emisor_id: familiar.id,
      emisor_rol: "FAMILIAR",
      destinatario_rol: "TODOS",
      contenido:
        "¡Muchas gracias a ambos! Vimos la adaptación paso a paso con el nombre del Docente y del Terapeuta. Hoy trabajamos en casa con el temporizador visual y estuvo muy motivado.",
      tipo_mensaje: "REPORTE_TAREA",
    });
  }

  // 9. Reportes Diarios con Semáforo Emocional
  await ReporteModel.findOrCreate({
    where: { titulo: "Excelente enfoque con consignas micro-segmentadas" },
    defaults: {
      alumno_id: alumno1.id,
      autor_id: docente.id,
      fecha: new Date().toISOString().split("T")[0],
      semaforo_emocional: "VERDE",
      titulo: "Excelente enfoque con consignas micro-segmentadas",
      descripcion:
        "El alumno completó los 3 bloques de trabajo en sala utilizando el temporizador visual y tarjetas de un solo paso sin presentar frustración.",
      estrategia_utilizada: "Micro-segmentación de consignas (Chunking) y refuerzo positivo inmediato",
      respuesta_alumno: "Mostró entusiasmo al marcar cada paso completado en su tablero visual.",
      compartido_con_familia: true,
    },
  });

  await ReporteModel.findOrCreate({
    where: { titulo: "Regulación exitosa ante transición de actividad" },
    defaults: {
      alumno_id: alumno1.id,
      autor_id: terapeuta.id,
      fecha: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      semaforo_emocional: "AMARILLO",
      titulo: "Regulación exitosa ante transición de actividad",
      descripcion:
        "Durante el cambio hacia el patio se observó inquietud motora e impulsividad. Se intervino anticipando con el reloj visual y asignándole el rol de ayudante de materiales.",
      estrategia_utilizada: "Pausa kinestésica programada y autoinstrucciones de Meichenbaum",
      respuesta_alumno: "Canalizó la energía positivamente y regresó a estado verde en 4 minutos.",
      compartido_con_familia: true,
    },
  });

  // 10. Alertas de Coordinación en Tiempo Real
  await AlertaCoordinacionModel.findOrCreate({
    where: { mensaje: "Iniciamos actividad grupal en 5 min: activar anticipación visual y filtro de distractores" },
    defaults: {
      alumno_id: alumno1.id,
      emisor_id: docente.id,
      receptor_rol: "TERAPEUTA",
      tipo_alerta: "CAMBIO_ACTIVIDAD",
      mensaje: "Iniciamos actividad grupal en 5 min: activar anticipación visual y filtro de distractores",
      nivel_urgencia: "MEDIA",
      estado: "PENDIENTE",
    },
  });

  console.log("[OK] Siembra de datos completada exitosamente en SincroAula.");
}

// Ejecutar directamente si se llama por CLI
if (process.argv[1]?.includes("seed.js")) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[ERROR] Error en seed:", err);
      process.exit(1);
    });
}
