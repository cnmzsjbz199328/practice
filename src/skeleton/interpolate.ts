// Pure shared interpolation. Mirrors `src/export/emitSmilSvg.ts`: any change to easing or
// segment-blend semantics here MUST be reflected in the SMIL emitter so the Remotion preview
// and the exported SVG remain visually equivalent.

import { cubicBezierY, shortestArcLerp } from '../util/math';
import type { EasingSpec, JointId, Keyframe, Pose } from './types';

const ALL_JOINTS: JointId[] = [
  'pelvis',
  'torso',
  'head',
  'leftUpperArm',
  'leftLowerArm',
  'rightUpperArm',
  'rightLowerArm',
  'leftUpperLeg',
  'leftLowerLeg',
  'rightUpperLeg',
  'rightLowerLeg',
];

export function easingToCubicBezier(e: EasingSpec): [number, number, number, number] | null {
  switch (e.kind) {
    case 'linear':
      return null;
    case 'ease-in-out':
      return [0.42, 0, 0.58, 1];
    case 'cubic-bezier':
      return [e.p1x, e.p1y, e.p2x, e.p2y];
  }
}

export function applyEasing(u: number, e: EasingSpec): number {
  const cp = easingToCubicBezier(e);
  if (!cp) return u;
  return cubicBezierY(cp[0], cp[1], cp[2], cp[3], u);
}

export function interpolatePose(keyframes: Keyframe[], t: number, easing: EasingSpec): Pose {
  if (keyframes.length === 0) {
    throw new Error('interpolatePose: empty keyframes');
  }
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);
  if (sorted.length === 1 || t <= sorted[0].time) return sorted[0].pose;
  const last = sorted[sorted.length - 1];
  if (t >= last.time) return last.pose;

  let i = 0;
  while (i < sorted.length - 1 && sorted[i + 1].time < t) i++;
  const a = sorted[i];
  const b = sorted[i + 1];
  const span = b.time - a.time || 1;
  const u = applyEasing((t - a.time) / span, easing);

  const angles: Record<JointId, number> = { ...a.pose.angles };
  for (const j of ALL_JOINTS) {
    angles[j] = shortestArcLerp(a.pose.angles[j], b.pose.angles[j], u);
  }
  return {
    rootX: a.pose.rootX + (b.pose.rootX - a.pose.rootX) * u,
    rootY: a.pose.rootY + (b.pose.rootY - a.pose.rootY) * u,
    angles,
  };
}
