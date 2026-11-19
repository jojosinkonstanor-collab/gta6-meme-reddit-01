// gta6-meme-reddit-01 entry (Node 22, standard library only).
//
// The entry is a Reddit post: an original GTA 6 meme (meme.png in this
// repository) posted as an image post, with make.fun in its title or text
// and the entrant's play code in the posting account's profile description.
// This program does exactly one thing: it carries POST.json, the file that
// names that post's address, from the repository into /output, where the
// house reads it, reads the post from Reddit, and builds the dossier the
// judge sees. Nothing this program writes is judged.
//
// POST.json currently still holds the kit's placeholder address because the
// Reddit post has not been made yet (no verified Reddit account access in
// this session). The placeholder is kept on purpose: inventing a post URL
// would be a fake entry. Once Christian posts the meme, POST.json is updated
// with the real address from the browser and the entry is submitted.
//
// Run locally the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// In the grader's sandbox the repository is mounted at /bot and the output
// directory is /output. Locally the two environment variables stand in.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const sourcePath = join(botDir, "POST.json");
const targetPath = join(outputDir, "POST.json");

// Read the post file exactly as it is, so the copy is byte for byte.
let postFile: Buffer;
try {
  postFile = readFileSync(sourcePath);
} catch (error) {
  console.error(`cannot read ${sourcePath}: ${(error as Error).message}`);
  process.exit(1);
}

// The file must be a JSON object; refuse to hand on a broken one.
let parsed: unknown;
try {
  parsed = JSON.parse(postFile.toString("utf8"));
} catch (error) {
  console.error(`POST.json is not valid JSON: ${(error as Error).message}`);
  process.exit(1);
}
if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
  console.error("POST.json must be a JSON object with a url field");
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
try {
  writeFileSync(targetPath, postFile);
} catch (error) {
  console.error(`cannot write ${targetPath}: ${(error as Error).message}`);
  process.exit(1);
}
