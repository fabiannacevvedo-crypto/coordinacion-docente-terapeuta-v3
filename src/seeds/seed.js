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
} from "../models/index.js";
import { asegurarBaseDeDatosMySQL } from "../config/database.js";
import { hashPassword } from "../helpers/bcrypt.helper.js";

export async function runSeed() {
  console.log("🌱 Iniciando siembra de datos iniciales en SincroAula v3...");

  await asegurarBaseDeDatosMySQL();
  await sequelize.sync({ alter: true });

  // 1. Crear Roles
  const rolesData = [
    { name: "ADMIN", description: "Administrador general del sistema" },
    { name: "DOCENTE", description: "Docente de nivel inicial a cargo de la sala" },
    { name: "TERAPEUTA", description: "Acompañante Terapéutico (AT) o Profesional de Salud" },
    { name: "FAMILIAR", description: "Padre, Madre o Tutor Legal del alumno" },
  ];

  const rolesMap = {};
  for (const r of rolesData) {
    const [role] = await RoleModel.findOrCreate({
      where: { name: r.name },
      defaults: r,
    });
    rolesMap[r.name] = role;
  }
  console.log("✅ Roles inicializados");

  // 2. Crear Usuarios Demo
  const adminPass = await hashPassword("admin123");
  const docentePass = await hashPassword("docente123");
  const terapeutaPass = await hashPassword("terapeuta123");
  const familiarPass = await hashPassword("familiar123");

  // Admin
  const [admin] = await UserModel.findOrCreate({
    where: { email: "admin@sincroaula.edu.ar" },
    defaults: {
      nombre: "Administrador",
      apellido: "SincroAula",
      email: "admin@sincroaula.edu.ar",
      password: adminPass,
      telefono: "3704-000001",
      estado_verificacion: "APROBADO",
    },
  });
  await UserRoleModel.findOrCreate({
    where: { user_id: admin.id, role_id: rolesMap["ADMIN"].id },
  });

  // Docente: Lucía Gómez
  const [docente] = await UserModel.findOrCreate({
    where: { email: "lucia.docente@sincroaula.edu.ar" },
    defaults: {
      nombre: "Lucía",
      apellido: "Gómez",
      email: "lucia.docente@sincroaula.edu.ar",
      password: docentePass,
      telefono: "3704-112233",
      estado_verificacion: "APROBADO",
    },
  });
  await UserRoleModel.findOrCreate({
    where: { user_id: docente.id, role_id: rolesMap["DOCENTE"].id },
  });
  await DocentePerfilModel.findOrCreate({
    where: { user_id: docente.id },
    defaults: {
      user_id: docente.id,
      institucion: "Jardín de Infantes N° 2 - Formosa",
      cue_escuela: "340058200",
      cargo: "Docente Titular de Sala Amarilla",
      nivel_educativo: "Nivel Inicial (Sala de 4)",
      constancia_adjunta: "resolucion_docente_lucia.pdf",
      verificado_institucional: true,
    },
  });

  // Terapeuta: Mateo Acevedo (AT)
  const [terapeuta] = await UserModel.findOrCreate({
    where: { email: "mateo.terapeuta@sincroaula.edu.ar" },
    defaults: {
      nombre: "Mateo",
      apellido: "Acevedo",
      email: "mateo.terapeuta@sincroaula.edu.ar",
      password: terapeutaPass,
      telefono: "3704-445566",
      estado_verificacion: "APROBADO",
    },
  });
  await UserRoleModel.findOrCreate({
    where: { user_id: terapeuta.id, role_id: rolesMap["TERAPEUTA"].id },
  });
  await TerapeutaPerfilModel.findOrCreate({
    where: { user_id: terapeuta.id },
    defaults: {
      user_id: terapeuta.id,
      especialidad: "Acompañante Terapéutico (AT)",
      matricula_tipo: "MP",
      matricula_numero: "Formosa-AT-492",
      colegio_profesional: "Asociación de Acompañantes Terapéuticos de Formosa",
      jurisdiccion: "Formosa",
      credencial_adjunta: "matricula_terapeuta_mateo.pdf",
      verificado_salud: true,
    },
  });

  // Familiar: Carlos Falcón (Padre)
  const [familiar] = await UserModel.findOrCreate({
    where: { email: "carlos.padre@sincroaula.edu.ar" },
    defaults: {
      nombre: "Carlos",
      apellido: "Falcón",
      email: "carlos.padre@sincroaula.edu.ar",
      password: familiarPass,
      telefono: "3704-778899",
      estado_verificacion: "APROBADO",
    },
  });
  await UserRoleModel.findOrCreate({
    where: { user_id: familiar.id, role_id: rolesMap["FAMILIAR"].id },
  });
  await FamiliarPerfilModel.findOrCreate({
    where: { user_id: familiar.id },
    defaults: {
      user_id: familiar.id,
      dni: "34821904",
      parentesco: "PADRE",
      codigo_vinculacion: "FAM-MAU-2026",
      documento_adjunto: "partida_nacimiento_mauricio.pdf",
      verificado_tutela: true,
    },
  });
  console.log("✅ Usuarios demo creados (Admin, Docente Lucía, Terapeuta Mateo, Familiar Carlos)");

  // 3. Crear Alumnos
  const [alumno1] = await AlumnoModel.findOrCreate({
    where: { codigo_familiar: "FAM-MAU-2026" },
    defaults: {
      nombre: "Mauricio",
      apellido: "Falcón",
      fecha_nacimiento: "2022-04-15",
      diagnostico: "Condición del Espectro Autista (Apoyo Grado 1) con sensibilidad acústica",
      sala_grado: "Sala de 4 Años - Turno Mañana",
      turno: "MAÑANA",
      semaforo_actual: "VERDE",
      observaciones: "Responde de manera sobresaliente a apoyos visuales y consignas de un solo paso.",
      codigo_familiar: "FAM-MAU-2026",
    },
  });

  const [alumno2] = await AlumnoModel.findOrCreate({
    where: { codigo_familiar: "FAM-SOF-2026" },
    defaults: {
      nombre: "Sofía",
      apellido: "Benítez",
      fecha_nacimiento: "2021-09-20",
      diagnostico: "TDAH con desregulación motriz en transiciones",
      sala_grado: "Sala de 5 Años - Turno Mañana",
      turno: "MAÑANA",
      semaforo_actual: "AMARILLO",
      observaciones: "Requiere pausas activas antes del almuerzo y anticipación 5 minutos antes de cambiar de aula.",
      codigo_familiar: "FAM-SOF-2026",
    },
  });

  const [alumno3] = await AlumnoModel.findOrCreate({
    where: { codigo_familiar: "FAM-LUC-2026" },
    defaults: {
      nombre: "Lucas",
      apellido: "Medina",
      fecha_nacimiento: "2022-02-10",
      diagnostico: "Trastorno del lenguaje y timidez selectiva en juegos grupales",
      sala_grado: "Sala de 4 Años - Turno Mañana",
      turno: "MAÑANA",
      semaforo_actual: "VERDE",
      observaciones: "Disfruta mucho el rincón de plástica y la música suave.",
      codigo_familiar: "FAM-LUC-2026",
    },
  });
  console.log("✅ Alumnos de nivel inicial inicializados");

  // 4. Vínculos Equipo Interdisciplinario -> Alumno 1 (Mauricio)
  await VinculoAlumnoModel.findOrCreate({
    where: { alumno_id: alumno1.id, user_id: docente.id },
    defaults: { alumno_id: alumno1.id, user_id: docente.id, tipo_vinculo: "DOCENTE_AULA", estado: "ACTIVO" },
  });
  await VinculoAlumnoModel.findOrCreate({
    where: { alumno_id: alumno1.id, user_id: terapeuta.id },
    defaults: { alumno_id: alumno1.id, user_id: terapeuta.id, tipo_vinculo: "TERAPEUTA_ACOMPANIANTE", estado: "ACTIVO" },
  });
  await VinculoAlumnoModel.findOrCreate({
    where: { alumno_id: alumno1.id, user_id: familiar.id },
    defaults: { alumno_id: alumno1.id, user_id: familiar.id, tipo_vinculo: "TUTOR_FAMILIAR", estado: "ACTIVO" },
  });

  // Vínculos alumno 2 y 3
  await VinculoAlumnoModel.findOrCreate({
    where: { alumno_id: alumno2.id, user_id: docente.id },
    defaults: { alumno_id: alumno2.id, user_id: docente.id, tipo_vinculo: "DOCENTE_AULA", estado: "ACTIVO" },
  });
  await VinculoAlumnoModel.findOrCreate({
    where: { alumno_id: alumno3.id, user_id: docente.id },
    defaults: { alumno_id: alumno3.id, user_id: docente.id, tipo_vinculo: "DOCENTE_AULA", estado: "ACTIVO" },
  });

  // 5. Catálogo de Estrategias
  const estrategias = [
    {
      nombre: "Anticipación visual con panel de pictogramas",
      categoria: "COMUNICACION",
      descripcion: "Mostrar la secuencia de la clase (saludo, actividad, patio, merienda) antes de cada transición.",
      pasos_guia: "1. Señalar el pictograma actual. 2. Anticipar 'Faltan 5 minutos'. 3. Girar el pictograma hacia completado.",
      icono: "image",
      color_tag: "#3b82f6",
    },
    {
      nombre: "Respiración consciente guiada (Técnica 4-4-4)",
      categoria: "SENSORIAL",
      descripcion: "Guía visual interactiva de respiración lenta para bajar pulsaciones ante estímulos sonoros fuertes.",
      pasos_guia: "Inhalar contando hasta 4, sostener 4 segundos, exhalar en 4. Acompañar con el tacto de la mano en el pecho.",
      icono: "wind",
      color_tag: "#06b6d4",
    },
    {
      nombre: "Rincón de calma con estímulos atenuados",
      categoria: "CONDUCTUAL",
      descripcion: "Espacio dentro del aula con almohadones y luz tenue para descompresión sensorial temporal (10 min).",
      pasos_guia: "Ofrecer ir al rincón sin tono de castigo. Permitir elegir un objeto sensorial reconfortante.",
      icono: "shield-alert",
      color_tag: "#8b5cf6",
    },
    {
      nombre: "Descomposición de consignas en pasos simples",
      categoria: "PEDAGOGICA",
      descripcion: "No dar más de una instrucción a la vez en actividades de recorte, pintado y modelado.",
      pasos_guia: "1. 'Tomamos el papel'. 2. 'Cortamos en tiritas'. Esperar ejecución antes de la siguiente indicación.",
      icono: "check-circle",
      color_tag: "#10b981",
    },
    {
      nombre: "Uso de auriculares con cancelación de ruido",
      categoria: "SENSORIAL",
      descripcion: "Utilizar protectores auditivos durante actos escolares, recreos ruidosos o música alta.",
      pasos_guia: "Tenerlos al alcance del alumno. Preguntar antes de colocarlos si los prefiere ahora.",
      icono: "headphones",
      color_tag: "#f59e0b",
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
        notas: "Excelente respuesta en el aula y en casa",
      },
    });
  }
  console.log("✅ Catálogo de estrategias psicopedagógicas y sensoriales creado");

  // 6. Reportes Diarios con Semáforo Emocional
  const [rep1] = await ReporteModel.findOrCreate({
    where: { titulo: "Excelente participación en ronda de plástica" },
    defaults: {
      alumno_id: alumno1.id,
      autor_id: docente.id,
      fecha: new Date().toISOString().split("T")[0],
      semaforo_emocional: "VERDE",
      titulo: "Excelente participación en ronda de plástica",
      descripcion: "Mauricio compartió pinceles y témperas con sus compañeros durante 25 minutos sin desregularse. Logró completar el dibujo guiado.",
      estrategia_utilizada: "Anticipación visual con pictogramas y consigna de un paso",
      respuesta_alumno: "Sonrió y mostró su dibujo con orgullo al equipo y a la sala.",
      compartido_con_familia: true,
    },
  });

  const [rep2] = await ReporteModel.findOrCreate({
    where: { titulo: "Momento de sobrecarga en recreo con música" },
    defaults: {
      alumno_id: alumno1.id,
      autor_id: terapeuta.id,
      fecha: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      semaforo_emocional: "AMARILLO",
      titulo: "Momento de sobrecarga en recreo con música",
      descripcion: "Durante el recreo con parlantes de audio, Mauricio se tapó los oídos e intentó retirarse del patio hacia el pasillo.",
      estrategia_utilizada: "Colocación de auriculares canceladores de ruido y retiro al rincón de calma por 7 minutos.",
      respuesta_alumno: "Recuperó el estado verde rápidamente y pudo regresar a jugar con bloques.",
      compartido_con_familia: true,
    },
  });

  // 7. Alertas de Coordinación en Tiempo Real
  await AlertaCoordinacionModel.findOrCreate({
    where: { mensaje: "Cambio de actividad a educación física en patio cubierto (5 min)" },
    defaults: {
      alumno_id: alumno1.id,
      emisor_id: docente.id,
      receptor_rol: "TERAPEUTA",
      tipo_alerta: "CAMBIO_ACTIVIDAD",
      mensaje: "Cambio de actividad a educación física en patio cubierto (5 min)",
      nivel_urgencia: "MEDIA",
      estado: "PENDIENTE",
    },
  });

  console.log("✨ Siembra de datos completada exitosamente. Plataforma lista para operar.");
}

// Ejecutar directamente si se llama por CLI
if (process.argv[1]?.includes("seed.js")) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Error en seed:", err);
      process.exit(1);
    });
}
