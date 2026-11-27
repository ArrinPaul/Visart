// Small helpers for editing .env.local without disturbing the other lines.

const line = (name: string) => new RegExp(`^${name}=(.*?)(\\r?)$`, "m");

export function getEnvValue(text: string, name: string): string {
  return line(name).exec(text)?.[1].trim() ?? "";
}

export function setEnvValue(text: string, name: string, value: string): string {
  if (line(name).test(text)) {
    // A function replacement so "$" in a value is kept as typed.
    return text.replace(line(name), (_match, _old, cr) => `${name}=${value}${cr}`);
  }
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const base = text === "" || text.endsWith("\n") ? text : text + eol;
  return `${base}${name}=${value}${eol}`;
}

/** Why a pasted Supabase key looks wrong, or null if it looks right. */
export function keyProblem(kind: "publishable" | "secret", value: string): string | null {
  const prefix = `sb_${kind}_`;
  if (/\s/.test(value)) return "The key contains spaces. Copy it again.";
  if (!value.startsWith(prefix) || value.length < prefix.length + 10) {
    return `A ${kind} key starts with ${prefix}`;
  }
  return null;
}
