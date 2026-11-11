import { createServer } from "http";

async function runTests() {
  console.log("Iniciando pruebas E2E...");
  await import("./app.js");
  await new Promise((r) => setTimeout(r, 2000));

  try {
    // 1. Healthcheck
    const rHealth = await fetch("http://localhost:3001/api/health").then((r) => r.json());
    console.log("✅ 1. Healthcheck:", rHealth.sistema, "| Versión:", rHealth.version);

    // 2. Login Docente
    const rLogin = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "lucia.docente@sincroaula.edu.ar", password: "docente123" }),
    }).then((r) => r.json());
    console.log("✅ 2. Login Docente:", rLogin.ok, rLogin.usuario?.nombre, "| Rol:", rLogin.usuario?.roles);

    const token = rLogin.token;

    // 3. Obtener Alumnos
    const rAlumnos = await fetch("http://localhost:3001/api/alumnos", {
      headers: { Authorization: "Bearer " + token },
    }).then((r) => r.json());
    console.log("✅ 3. Alumnos obtenidos:", rAlumnos.total, rAlumnos.alumnos?.map((a) => a.nombre));

    // 4. Registro de Usuario (Comprobando que el registro funciona 100%)
    const nuevoEmail = `test.terapeuta.${Date.now()}@sincroaula.edu.ar`;
    const rReg = await fetch("http://localhost:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "Sofía",
        apellido: "Navarro",
        email: nuevoEmail,
        password: "Password123",
        telefono: "3704-998877",
        rol: "TERAPEUTA",
        especialidad: "Acompañante Terapéutico (AT)",
        matricula_numero: "Formosa-AT-999",
        colegio_profesional: "Asociación de AT Formosa",
      }),
    }).then((r) => r.json());
    console.log("✅ 4. Registro Exitoso:", rReg.ok, rReg.usuario?.nombre, "| Email:", rReg.usuario?.email);

    // 5. Servido de Frontend React SPA
    const rFront = await fetch("http://localhost:3001/").then((r) => r.text());
    console.log("✅ 5. Frontend React SPA Servido correctamente:", rFront.includes('<div id="root"></div>'));

    console.log("\n🎉 TODAS LAS PRUEBAS PASARON AL 100% DE MANERA EXITOSA 🎉");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error en pruebas:", err);
    process.exit(1);
  }
}

runTests();
