// Terminal prompts shared by the setup scripts.
import { createInterface } from "node:readline";

export function readLine(promptText: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

/** Reads a line without showing it. Typing and pasting both work. */
export function readHidden(promptText: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    if (!stdin.isTTY) {
      reject(new Error("Run this in your own terminal window; hidden input needs one."));
      return;
    }

    process.stdout.write(promptText);
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    let input = "";

    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onData);
      process.stdout.write("\n");
    };

    const onData = (chunk: string) => {
      // Some terminals wrap pasted text in these markers.
      for (const char of chunk.replace(/\x1b\[20[01]~/g, "")) {
        if (char === "\n" || char === "\r") {
          cleanup();
          resolve(input);
          return;
        }
        if (char === "\u0003") {
          cleanup();
          reject(new Error("Aborted by user"));
          return;
        }
        if (char === "\u007f" || char === "\b") input = input.slice(0, -1);
        else input += char;
      }
    };

    stdin.on("data", onData);
  });
}
