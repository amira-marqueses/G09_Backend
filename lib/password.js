import crypto from "crypto";

const PBKDF2_ITERATIONS = 120000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(plainPassword, salt, PBKDF2_ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return `${PBKDF2_ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(plainPassword, storedPasswordHash) {
  const [iterationsRaw, salt, originalHash] = String(storedPasswordHash).split(":");
  const iterations = Number(iterationsRaw);

  if (!iterations || !salt || !originalHash) {
    return false;
  }

  const computedHash = crypto
    .pbkdf2Sync(plainPassword, salt, iterations, KEY_LENGTH, DIGEST)
    .toString("hex");

  const originalBuffer = Buffer.from(originalHash, "hex");
  const computedBuffer = Buffer.from(computedHash, "hex");

  if (originalBuffer.length !== computedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalBuffer, computedBuffer);
}
