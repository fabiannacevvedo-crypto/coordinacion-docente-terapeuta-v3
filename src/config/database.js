import { Sequelize } from "sequelize";
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIALECT = (process.env.DB_DIALECT || "sqlite").toLowerCase();
const DB_NAME = process.env.DB_NAME || "sincroaula_db";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT) || 3306;

/**
 * Función para verificar y crear la base de datos en MySQL si el dialecto configurado es mysql
 */
export async function asegurarBaseDeDatosMySQL() {
  if (DB_DIALECT !== "mysql") return;

  try {
    const conexion = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      connectTimeout: 3000,
    });
    await conexion.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await conexion.end();
    console.log(`[OK] Base de datos MySQL verificada/creada exitosamente (\`${DB_NAME}\`)`);
  } catch (error) {
    console.warn(`[WARN] Advertencia de conexión a MySQL (puerto ${DB_PORT}): ${error.message}`);
    console.warn("[INFO] Para usar MySQL, asegúrese de iniciar WampServer. O utilice DB_DIALECT=sqlite para ejecución portátil instantánea.");
  }
}

let sequelizeInstance = null;

if (DB_DIALECT === "mysql") {
  sequelizeInstance = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // SQLite: modo portátil y resiliente con archivo persistente en la raíz del proyecto
  const sqliteStorage = path.resolve(__dirname, "../../sincroaula.sqlite");
  sequelizeInstance = new Sequelize({
    dialect: "sqlite",
    storage: sqliteStorage,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  });
}

export const sequelize = sequelizeInstance;
export const getActiveDialect = () => DB_DIALECT;

export default sequelize;
