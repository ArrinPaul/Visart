// Server-only by convention (not enforced by a bundler guard — see lib/ai/* for the same
// existing pattern in this repo). Must be imported only from server-side code (API routes,
// Route Handlers, or the provisioning script), never from a "use client" component. This module
// never logs a password, salt, or derived key under any code path, including error paths.
//
// Hash format (versioned, self-describing — see hashPassword/verifyPassword below):
//   scrypt$<version>$<N>$<r>$<p>$<keyLenBytes>$<saltBase64>$<derivedKeyBase64>
//
// Deliberately NOT using plain SHA-256/MD5 or a fast general-purpose hash: those are designed
// for speed, which is exactly the wrong property for password storage (it makes brute-forcing a
// leaked hash cheap). scrypt is a memory-hard KDF designed to make that expensive.

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
) => Promise<Buffer>;

const ALGO = "scrypt";
const VERSION = 1;

// Current parameters used for every newly created hash. Chosen to be comfortably above Node's
// documented scrypt defaults (N=16384, r=8, p=1) while keeping single-request latency reasonable
// for an interactive login. These are stored alongside each hash specifically so they can be
// changed later without invalidating already-stored hashes (verifyPassword always uses the
// parameters embedded in the stored hash, not these constants).
const SCRYPT_N = 16384; // CPU/memory cost factor (2^14)
const SCRYPT_R = 8; // block size
const SCRYPT_P = 1; // parallelization factor
const KEY_LENGTH_BYTES = 64;
const SALT_LENGTH_BYTES = 16;

// scrypt's peak memory use is approximately 128 * N * r bytes. Node's crypto.scrypt refuses to
// run above its `maxmem` option (default 32MB) as a safety limit. We pass an explicit maxmem
// sized to the parameters being used, both when hashing (our own fixed constants) and when
// verifying (whatever parameters are embedded in the stored hash — bounded below).
function requiredMaxMem(N: number, r: number): number {
  return 128 * N * r + 1024 * 1024; // small fixed headroom
}

// Sanity bounds applied only when *verifying* a stored hash, since those parameters are read
// back out of stored data rather than supplied by this module's own constants. This rejects a
// corrupted or tampered hash string before it can be used to request an unreasonable amount of
// memory, rather than assuming stored data is always well-formed.
const MAX_N = 1 << 20; // 1,048,576
const MAX_R = 64;
const MAX_P = 16;
const MAX_KEY_LENGTH = 256;

export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("hashPassword: password must be a non-empty string");
  }

  const salt = randomBytes(SALT_LENGTH_BYTES);
  const derivedKey = await scrypt(password, salt, KEY_LENGTH_BYTES, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: requiredMaxMem(SCRYPT_N, SCRYPT_R),
  });

  return [
    ALGO,
    String(VERSION),
    String(SCRYPT_N),
    String(SCRYPT_R),
    String(SCRYPT_P),
    String(KEY_LENGTH_BYTES),
    salt.toString("base64"),
    derivedKey.toString("base64"),
  ].join("$");
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (typeof password !== "string" || password.length === 0) return false;
  if (typeof storedHash !== "string" || storedHash.length === 0) return false;

  const parts = storedHash.split("$");
  if (parts.length !== 8) return false;

  const [algo, versionStr, nStr, rStr, pStr, keyLenStr, saltB64, hashB64] = parts;

  if (algo !== ALGO) return false;

  const version = Number(versionStr);
  const N = Number(nStr);
  const r = Number(rStr);
  const p = Number(pStr);
  const keyLen = Number(keyLenStr);

  const allIntegers = [version, N, r, p, keyLen].every(
    (n) => Number.isInteger(n) && n > 0
  );
  if (!allIntegers) return false;
  if (version !== VERSION) return false;
  if (N > MAX_N || r > MAX_R || p > MAX_P || keyLen > MAX_KEY_LENGTH) return false;

  let salt: Buffer;
  let storedDerivedKey: Buffer;
  try {
    salt = Buffer.from(saltB64, "base64");
    storedDerivedKey = Buffer.from(hashB64, "base64");
  } catch {
    return false;
  }
  if (salt.length === 0 || storedDerivedKey.length !== keyLen) return false;

  let candidateKey: Buffer;
  try {
    candidateKey = await scrypt(password, salt, keyLen, {
      N,
      r,
      p,
      maxmem: requiredMaxMem(N, r),
    });
  } catch {
    // Malformed/unsupported parameter combinations (e.g. N not a power of two) throw from
    // Node's scrypt implementation; treat that the same as "does not verify," not an error.
    return false;
  }

  if (candidateKey.length !== storedDerivedKey.length) return false;

  return timingSafeEqual(candidateKey, storedDerivedKey);
}
