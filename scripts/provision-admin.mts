// Phase 1, Batch 1 — manual, one-time initial admin provisioning helper.
//
// What this script does:
//   1. Prompts for an email address and a password interactively (password input is hidden,
//      never echoed to the terminal).
//   2. Normalizes the email with the exact same function the application and the database
//      uniqueness index use (lib/auth/email.ts).
//   3. Hashes the password locally with lib/auth/password.ts (Node's built-in scrypt — no
//      network call, nothing leaves this machine).
//   4. Prints a ready-to-paste SQL INSERT statement for the Supabase SQL editor.
//
// What this script deliberately does NOT do:
//   - It never accepts the password as a command-line argument (nothing in argv is read as a
//     credential — only an optional --email= flag is read, see below, and that is not secret).
//   - It never writes the plaintext password to any file.
//   - It never logs the plaintext password, at any log level, on any path including errors.
//   - It does not connect to Supabase itself and does not hold or require a service-role key —
//     the actual INSERT is a manual step the operator runs themselves in the Supabase SQL editor,
//     consistent with how supabase/schema.sql has always been applied in this project.
//   - It is not imported by any app/ or components/ file, so it is never bundled into the
//     client; it only runs standalone via Node.
//
// Usage:
//   node --experimental-strip-types scripts/provision-admin.mts
//
// (also wired up as `npm run provision:admin`)

import { createInterface } from "node:readline";
import { normalizeEmail } from "../lib/auth/email.ts";
import { hashPassword } from "../lib/auth/password.ts";

function readLine(promptText: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// No hidden-input dependency exists in this repo (and none is added here per the "do not add a
// dependency if Node's built-ins are sufficient" instruction) — this implements masked input by
// hand using the raw TTY mode Node already exposes.
function readHidden(promptText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;

    if (!stdin.isTTY) {
      reject(
        new Error(
          "This script must be run interactively in a real terminal (stdin is not a TTY), " +
            "so the password prompt can be hidden. Piping input is not supported."
        )
      );
      return;
    }

    process.stdout.write(promptText);
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");

    let input = "";

    const onData = (chunk: string) => {
      for (const char of chunk) {
        const code = char.charCodeAt(0);

        if (char === "\n" || char === "\r") {
          cleanup();
          process.stdout.write("\n");
          resolve(input);
          return;
        }

        if (code === 3) {
          // Ctrl+C
          cleanup();
          process.stdout.write("\n");
          reject(new Error("Aborted by user"));
          return;
        }

        if (code === 127 || code === 8) {
          // Backspace/Delete
          input = input.slice(0, -1);
          continue;
        }

        input += char;
      }
    };

    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
    };

    stdin.on("data", onData);
  });
}

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

async function main() {
  console.log("VISART — one-time initial admin provisioning");
  console.log("This runs entirely on your own machine. Nothing is sent over the network.\n");

  const rawEmail = await readLine("Admin email: ");
  const email = normalizeEmail(rawEmail);

  if (!email.includes("@") || email.length < 3) {
    throw new Error("That does not look like a valid email address. Aborting.");
  }

  const password = await readHidden("Admin password (hidden): ");
  const confirmPassword = await readHidden("Confirm password (hidden): ");

  if (password.length === 0) {
    throw new Error("Password cannot be empty. Aborting.");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords did not match. Aborting. (Nothing was printed or saved.)");
  }

  const passwordHash = await hashPassword(password);

  console.log("\nPassword hashed locally. Nothing above or below this line contains the");
  console.log("plaintext password — the string below is an irreversible scrypt hash.\n");

  console.log("Run the following in the Supabase SQL editor for the target project");
  console.log("(after applying supabase/migrations/0001_create_admin_users.sql),");
  console.log("then close this terminal — do not paste this into a commit, issue, or chat:\n");

  console.log(
    `insert into public.admin_users (email, password_hash) values ('${escapeSqlLiteral(
      email
    )}', '${escapeSqlLiteral(passwordHash)}');`
  );

  console.log(
    "\nTo verify the row was created WITHOUT exposing the hash or password, run instead:"
  );
  console.log(
    `  select id, email, is_active, created_at from public.admin_users where lower(trim(email)) = '${escapeSqlLiteral(
      email
    )}';`
  );
}

main().catch((err) => {
  console.error(`\nProvisioning aborted: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
