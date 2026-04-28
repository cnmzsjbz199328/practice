import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAnimationDocument } from '../src/schema/animationDocument';

const here = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(here, '..', 'examples');

async function main() {
  const files = await fs.readdir(dir);
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    const text = await fs.readFile(path.join(dir, f), 'utf8');
    const doc = parseAnimationDocument(JSON.parse(text));
    console.log(`OK ${f}: ${doc.bones.length} bones, ${doc.keyframes.length} keyframes, ${doc.animationParams.durationSeconds}s`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
