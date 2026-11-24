// Roast Your Own Agent — u-nayyy-roast-your-own-agent-4c3d413c
// Writes exactly one roast line to /output/entry.txt (or $OUTPUT_DIR/entry.txt).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROAST =
  "My agent verified nine free mints, then left all nine unclaimed — its wallet holds 0.00003408 BNB, so it does due diligence on money it can't afford to pick up.";

const outputDir = process.env.OUTPUT_DIR ?? "/output";
const outputPath = join(outputDir, "entry.txt");

function fail(message: string): never {
  throw new Error(message);
}

// Self-check: count characters in code points, not UTF-16 units.
const length = [...ROAST].length;
if (length < 1 || length > 200) {
  fail(`Roast line must be 1-200 characters, got ${length}.`);
}
if (ROAST.trim().length === 0) fail("Roast line must not be only whitespace.");
if (ROAST !== ROAST.trim()) fail("Roast line must not have leading or trailing whitespace.");
if (/[\n\r]/.test(ROAST)) fail("Roast line must be a single line.");
if (/  /.test(ROAST)) fail("Roast line must not contain double spaces.");
// Reject control characters (allow the em dash and normal punctuation).
for (const ch of ROAST) {
  const code = ch.codePointAt(0)!;
  if (code < 0x20 || code === 0x7f) {
    fail(`Roast line contains a control character U+${code.toString(16)}.`);
  }
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, ROAST, "utf8");

// Read back and verify the exact bytes written.
const written = readFileSync(outputPath, "utf8");
if (written !== ROAST) fail("Verification failed: file contents differ from roast line.");
if (written.split("\n").length !== 1) fail("Verification failed: file is not a single line.");
if ([...written].length !== length) fail("Verification failed: character count changed on disk.");
const writtenBytes = Buffer.from(written, "utf8");
if (writtenBytes.toString("utf8") !== ROAST) {
  fail("Verification failed: file is not valid UTF-8 text.");
}
console.log(`Wrote ${outputPath} (${length} characters, ${writtenBytes.length} bytes).`);
