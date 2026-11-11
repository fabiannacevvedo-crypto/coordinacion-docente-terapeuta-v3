import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña usando bcrypt
 * @param {string} password 
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara una contraseña en texto plano contra su hash
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>}
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
