// One-command local setup: stores the Supabase keys in .env.local and creates the admin account.
// Usage (in your own terminal): npm run setup
//
// Everything you enter stays on this machine, apart from the calls to your own Supabase project.
// Nothing secret is printed.
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { normalizeEmail } from "../lib/auth/email.ts";
import { hashPassword } from "../lib/auth/password.ts";
import { getEnvValue, keyProblem, setEnvValue } from "../lib/setup/envFile.ts";
import { readHidden, readLine } from "./prompt.mts";

const ENV_FILE = ".env.local";
const MIN_PASSWORD = 10;

async function askKey(label: string, kind: "publishable" | "secret", current: string): Promise<string> {
  for (;;) {
    const keep = current ? " (Enter keeps the saved one)" : "";
    const value = (await readHidden(`${label}${keep}: `)).trim();
    if (!value && current) return current;
    const problem = keyProblem(kind, value);
    if (!problem) return value;
    console.log(`  ${problem}`);
  }
}

async function main() {
  if (!existsSync(ENV_FILE)) throw new Error(`${ENV_FILE} not found. Run this from the project folder.`);
  let env = readFileSync(ENV_FILE, "utf8");
  const url = getEnvValue(env, "NEXT_PUBLIC_SUPABASE_URL");
  if (!url.startsWith("https://")) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set in .env.local.");

  console.log(`VISART setup for ${url}`);
  console.log("Keys: Supabase dashboard > Project Settings > API Keys. Pasting is hidden on screen.");
  console.log("Use a NEW secret key if the old one was ever shared.\n");

  const publishable = await askKey(
    "Publishable key", "publishable", getEnvValue(env, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"));
  const secret = await askKey("Secret key", "secret", getEnvValue(env, "SUPABASE_SERVICE_ROLE_KEY"));

  env = setEnvValue(env, "NEXT_PUBLIC_SUPABASE_ANON_KEY", publishable);
  env = setEnvValue(env, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", publishable);
  env = setEnvValue(env, "SUPABASE_SERVICE_ROLE_KEY", secret);
  if (!getEnvValue(env, "ML_SERVICE_SECRET")) {
    env = setEnvValue(env, "ML_SERVICE_SECRET", randomBytes(32).toString("hex"));
  }
  writeFileSync(ENV_FILE, env);
  console.log("\nSaved to .env.local.");

  const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

  const existing = await db.from("admin_users").select("email");
  if (existing.error) throw new Error(`Could not reach the database: ${existing.error.message}`);
  const buckets = await db.storage.listBuckets();
  const hasBucket = buckets.data?.some((b) => b.name === "product-images");
  console.log(`Database connected. Image bucket: ${hasBucket ? "found" : "MISSING"}.`);

  console.log("\nCreate your admin login.");
  const email = normalizeEmail(await readLine("Admin email: "));
  if (!email.includes("@")) throw new Error("That is not an email address.");
  if (existing.data.some((row) => normalizeEmail(row.email) === email)) {
    console.log("That admin already exists. Nothing changed.");
    return;
  }
  const password = await readHidden(`Password (hidden, ${MIN_PASSWORD}+ characters): `);
  if (password.length < MIN_PASSWORD) throw new Error("Password is too short. Run npm run setup again.");
  if ((await readHidden("Repeat password: ")) !== password) {
    throw new Error("Passwords did not match. Run npm run setup again.");
  }

  const { error } = await db.from("admin_users").insert({ email, password_hash: await hashPassword(password) });
  if (error) throw new Error(`Could not create the admin: ${error.message}`);
  console.log("\nAdmin created. Now run: npm run dev   and sign in at http://localhost:3000/admin");
}

main().catch((err) => {
  console.error(`\nSetup stopped: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
