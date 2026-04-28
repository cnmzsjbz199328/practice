// SMIL emitter. Mirrors `src/skeleton/interpolate.ts` semantics: per-segment easing applied
// via keySplines, broadcast to all (N-1) segments. Any change in editor preview semantics
// (interpolate.ts) MUST be reflected here.

import { poseToJointWorld } from '../skeleton/forwardKinematics';
import { easingToCubicBezier } from '../skeleton/interpolate';
import type { AnimationParams, Bone, Keyframe } from '../skeleton/types';
import { HEAD_RADIUS } from '../skeleton/defaultSkeleton';

interface Canvas {
  width: number;
  height: number;
}

function fmt(n: number): string {
  return Number.isFinite(n) ? (Math.round(n * 100) / 100).toString() : '0';
}

function buildAnimate(
  attr: string,
  values: number[],
  keyTimes: number[],
  durSeconds: number,
  loop: boolean,
  keySplinesAttr: string | null,
): string {
  const valuesStr = values.map(fmt).join(';');
  const keyTimesStr = keyTimes.map((t) => fmt(t)).join(';');
  const repeat = loop ? 'indefinite' : '1';
  const baseAttrs = [
    `attributeName="${attr}"`,
    `dur="${fmt(durSeconds)}s"`,
    `repeatCount="${repeat}"`,
    `keyTimes="${keyTimesStr}"`,
    `values="${valuesStr}"`,
    `fill="freeze"`,
  ];
  if (keySplinesAttr) {
    baseAttrs.push(`calcMode="spline"`);
    baseAttrs.push(`keySplines="${keySplinesAttr}"`);
  }
  return `    <animate ${baseAttrs.join(' ')} />`;
}

export function emitSmilSvg(
  keyframes: Keyframe[],
  params: AnimationParams,
  bones: Bone[],
  canvas: Canvas,
): string {
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);
  if (sorted.length === 0) {
    throw new Error('emitSmilSvg: no keyframes');
  }

  const dur = Math.max(0.0001, params.durationSeconds);
  const N = sorted.length;
  const keyTimes =
    N === 1 ? [0, 1] : sorted.map((k) => Math.max(0, Math.min(1, k.time / dur)));
  if (N === 1) keyTimes.push(1);

  const cp = easingToCubicBezier(params.easing);
  const segments = Math.max(1, keyTimes.length - 1);
  const keySplinesAttr = cp
    ? Array.from({ length: segments }, () => `${cp[0]} ${cp[1]} ${cp[2]} ${cp[3]}`).join(';')
    : null;

  const worldPerKf = sorted.map((k) => poseToJointWorld(k.pose, bones));
  const sample = (vals: number[]) => (N === 1 ? [vals[0], vals[0]] : vals);

  const lines: string[] = [];
  for (const bone of bones) {
    if (bone.parent === null) continue;
    if (bone.isHead) continue;
    const x1 = sample(worldPerKf.map((w) => w[bone.id].start.x));
    const y1 = sample(worldPerKf.map((w) => w[bone.id].start.y));
    const x2 = sample(worldPerKf.map((w) => w[bone.id].end.x));
    const y2 = sample(worldPerKf.map((w) => w[bone.id].end.y));
    lines.push(
      `  <line x1="${fmt(x1[0])}" y1="${fmt(y1[0])}" x2="${fmt(x2[0])}" y2="${fmt(y2[0])}" stroke="black" stroke-width="4" stroke-linecap="round">`,
      buildAnimate('x1', x1, keyTimes, dur, params.loop, keySplinesAttr),
      buildAnimate('y1', y1, keyTimes, dur, params.loop, keySplinesAttr),
      buildAnimate('x2', x2, keyTimes, dur, params.loop, keySplinesAttr),
      buildAnimate('y2', y2, keyTimes, dur, params.loop, keySplinesAttr),
      `  </line>`,
    );
  }

  const headBone = bones.find((b) => b.isHead);
  if (headBone) {
    const cx = sample(worldPerKf.map((w) => w[headBone.id].end.x));
    const cy = sample(worldPerKf.map((w) => w[headBone.id].end.y));
    lines.push(
      `  <circle cx="${fmt(cx[0])}" cy="${fmt(cy[0])}" r="${HEAD_RADIUS}" fill="none" stroke="black" stroke-width="4">`,
      buildAnimate('cx', cx, keyTimes, dur, params.loop, keySplinesAttr),
      buildAnimate('cy', cy, keyTimes, dur, params.loop, keySplinesAttr),
      `  </circle>`,
    );
  }

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas.width} ${canvas.height}" width="${canvas.width}" height="${canvas.height}">`,
    ...lines,
    `</svg>`,
    '',
  ].join('\n');
}
