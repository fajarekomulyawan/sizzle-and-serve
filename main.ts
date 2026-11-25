// Sizzle & Serve — hand-in program for make.fun's best cooking game.
//
// The game itself is the static site in game/ (open game/index.html in
// a desktop browser; it plays offline, no network). This program does
// the hand-in: it copies game/ and screenshots/ into the output
// directory and writes dossier.json there with the vendored make.fun
// library, exactly as the grader expects.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Node 22, standard library only.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The caps are the scorer's own, passed to buildDossier unchanged:
// at most 4 screenshots of 256 KiB each, at most 993 game files and
// 48 MiB in game/, every game path at most 1000 bytes, and the
// dossier's source text capped at 160 KiB.
const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(out, 'dossier.json'), dossier);
console.log('handed in: game/ + screenshots/ + dossier.json -> ' + out);
