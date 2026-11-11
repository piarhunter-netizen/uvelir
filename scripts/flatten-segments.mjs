// Next.js кладёт файлы предзагрузки как out/catalog/__next.catalog/__PAGE__.txt,
// а браузер запрашивает out/catalog/__next.catalog.__PAGE__.txt.
// На статическом хостинге (GitHub Pages, nginx) делаем копии с плоскими именами.
import { copyFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
let count = 0;

function flatten(dir, prefix, target) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const flat = `${prefix}.${name}`;
    if (statSync(p).isDirectory()) flatten(p, flat, target);
    else {
      copyFileSync(p, join(target, flat));
      count++;
    }
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory() || name === "_next") continue;
    if (name.startsWith("__next.")) flatten(p, name, dir);
    else walk(p);
  }
}

if (existsSync(root)) {
  walk(root);
  console.log(`flatten-segments: ${count} файлов`);
}
