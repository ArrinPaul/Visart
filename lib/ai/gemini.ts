// Shared Gemini access: client, model roster and retry/fallback behaviour.
import { GoogleGenAI, type GenerateContentParameters, type GenerateContentResponse } from "@google/genai";

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  return new GoogleGenAI({ apiKey });
}

/** GEMINI_MODEL first (if set), then the fallback roster. */
export function getCandidateModels(): string[] {
  return Array.from(
    new Set(
      [
        process.env.GEMINI_MODEL,
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.6-flash",
        "gemini-3.1-flash-lite",
        "gemini-3.7-flash",
      ].filter(Boolean) as string[]
    )
  );
}

export function isTransientError(message: string): boolean {
  const lower = message.toLowerCase();
  return [
    "503",
    "unavailable",
    "429",
    "high demand",
    "resource_exhausted",
    "fetch failed",
    "econnreset",
    "etimedout",
    "timeout",
    "socket",
    "overloaded",
    "not found",
    "404",
  ].some((marker) => lower.includes(marker));
}

/**
 * Tries each candidate model until one returns text. A transient error waits `delayMs * attempt`
 * and retries the same model up to `attempts` times; any other error moves to the next model.
 */
export async function generateWithFallback(
  ai: GoogleGenAI,
  request: Omit<GenerateContentParameters, "model">,
  options: { attempts: number; delayMs: number; label: string }
): Promise<{ response?: GenerateContentResponse; lastError?: unknown }> {
  let response: GenerateContentResponse | undefined;
  let lastError: unknown;

  for (const model of getCandidateModels()) {
    for (let attempt = 1; attempt <= options.attempts; attempt++) {
      try {
        response = await ai.models.generateContent({ ...request, model });
        if (response?.text) return { response };
      } catch (err) {
        lastError = err;
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[${options.label}] ${model} failed (attempt ${attempt}): ${message}`);
        if (!isTransientError(message)) break;
        await new Promise((resolve) => setTimeout(resolve, attempt * options.delayMs));
      }
    }
  }

  return { response, lastError };
}
