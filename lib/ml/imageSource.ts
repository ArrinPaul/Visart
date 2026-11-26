// Server-only. Loads a product image from a stored URL without letting that URL (which anyone can
// write, see docs/SECURITY.md) point the server at arbitrary hosts.
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class ImageSourceError extends Error {}

export type LoadedImage = { bytes: Uint8Array; mimeType: string };

function checkType(value: string): string {
  const type = value.split(";")[0].trim().toLowerCase();
  if (!ALLOWED_TYPES.includes(type)) throw new ImageSourceError("Unsupported image type.");
  return type;
}

function checkSize(bytes: Uint8Array): Uint8Array {
  if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) {
    throw new ImageSourceError("Image is empty or too large.");
  }
  return bytes;
}

// Stops downloading as soon as the limit is passed instead of trusting content-length.
async function readLimited(res: Response): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  let total = 0;
  const reader = res.body?.getReader();
  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > MAX_IMAGE_BYTES) {
      await reader.cancel();
      throw new ImageSourceError("Image is empty or too large.");
    }
    chunks.push(value);
  }
  return checkSize(Buffer.concat(chunks));
}

export async function loadImage(
  url: string,
  supabaseUrl: string,
  fetcher: typeof fetch = fetch
): Promise<LoadedImage> {
  if (url.startsWith("data:")) {
    const comma = url.indexOf(",");
    const meta = url.slice(5, comma);
    if (comma < 0 || !meta.endsWith(";base64")) throw new ImageSourceError("Malformed data URL.");
    const mimeType = checkType(meta);
    return { mimeType, bytes: checkSize(Buffer.from(url.slice(comma + 1), "base64")) };
  }

  let target: URL;
  let allowed: URL;
  try {
    target = new URL(url);
    allowed = new URL(supabaseUrl);
  } catch {
    throw new ImageSourceError("Invalid image URL.");
  }
  if (target.origin !== allowed.origin || !target.pathname.startsWith("/storage/v1/object/public/")) {
    throw new ImageSourceError("Image is not in this project's storage.");
  }

  try {
    const res = await fetcher(target, { redirect: "error", signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new ImageSourceError(`Image request failed (${res.status}).`);
    const mimeType = checkType(res.headers.get("content-type") ?? "");
    return { mimeType, bytes: await readLimited(res) };
  } catch (err) {
    if (err instanceof ImageSourceError) throw err;
    throw new ImageSourceError("Image could not be fetched.");
  }
}
