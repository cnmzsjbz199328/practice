#!/usr/bin/env tsx
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { parseAnimationDocument } from '../src/schema/animationDocument';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Args {
  input: string;
  output: string;
  composition: string;
  quality: 'low' | 'default' | 'high';
}

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  let composition = 'Stickman';
  let quality: Args['quality'] = 'default';
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--composition=')) composition = a.slice('--composition='.length);
    else if (a === '--composition') composition = argv[++i];
    else if (a.startsWith('--quality=')) quality = a.slice('--quality='.length) as Args['quality'];
    else if (a === '--quality') quality = argv[++i] as Args['quality'];
    else positional.push(a);
  }
  if (positional.length < 2) {
    throw new Error(
      'Usage: npm run render -- <input.json> <output.mp4> [--composition=Stickman] [--quality=low|default|high]',
    );
  }
  return { input: positional[0], output: positional[1], composition, quality };
}

const CRF: Record<Args['quality'], number> = { low: 28, default: 23, high: 18 };

function bar(progress: number): string {
  const total = 30;
  const filled = Math.round(progress * total);
  return `[${'#'.repeat(filled)}${'-'.repeat(total - filled)}] ${(progress * 100).toFixed(1)}%`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..');
  const inputPath = path.resolve(args.input);
  const outputPath = path.resolve(args.output);

  // 1. Validate JSON before launching webpack/Chromium.
  const raw = await fs.readFile(inputPath, 'utf8');
  const parsed = JSON.parse(raw);
  const doc = parseAnimationDocument(parsed);
  console.log(
    `[render] validated ${path.basename(inputPath)}: ${doc.bones.length} bones, ` +
      `${doc.keyframes.length} keyframes, ${doc.animationParams.durationSeconds}s ` +
      `@${doc.canvas.fps ?? 30}fps`,
  );

  // 2. Bundle the Remotion entry.
  console.log('[render] bundling Remotion entry…');
  const serveUrl = await bundle({
    entryPoint: path.join(repoRoot, 'src/remotion/Root.tsx'),
    webpackOverride: (c) => c,
  });

  // 3. Pick the composition with the document as inputProps.
  const inputProps = {
    canvas: doc.canvas,
    bones: doc.bones,
    keyframes: doc.keyframes,
    animationParams: doc.animationParams,
  };
  const composition = await selectComposition({
    serveUrl,
    id: args.composition,
    inputProps,
  });
  console.log(
    `[render] composition: ${composition.id} ${composition.width}x${composition.height} ` +
      `${composition.fps}fps ${composition.durationInFrames} frames`,
  );

  // 4. Render.
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    crf: CRF[args.quality],
    onProgress: ({ progress }) => {
      process.stdout.write(`\r[render] ${bar(progress)}`);
    },
  });
  process.stdout.write('\n');
  console.log(`[render] wrote ${outputPath}`);
}

main().catch((err) => {
  process.stderr.write(`\n[render] error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
