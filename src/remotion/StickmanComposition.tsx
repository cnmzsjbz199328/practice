import { useCurrentFrame, useVideoConfig } from 'remotion';
import { HEAD_RADIUS } from '../skeleton/defaultSkeleton';
import { poseToJointWorld } from '../skeleton/forwardKinematics';
import { interpolatePose } from '../skeleton/interpolate';
import type { CompositionProps } from '../schema/animationDocument';

export type StickmanCompositionProps = CompositionProps;

export function StickmanComposition({
  bones,
  keyframes,
  animationParams,
  canvas,
}: StickmanCompositionProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const denom = Math.max(1, durationInFrames - 1);
  const tNorm = frame / denom;
  const tSeconds = tNorm * animationParams.durationSeconds;

  const pose = interpolatePose(keyframes, tSeconds, animationParams.easing);
  const world = poseToJointWorld(pose, bones);

  return (
    <svg
      viewBox={`0 0 ${canvas.width} ${canvas.height}`}
      width="100%"
      height="100%"
      style={{ background: '#1d232a' }}
    >
      {bones
        .filter((b) => b.parent !== null && !b.isHead)
        .map((b) => {
          const w = world[b.id];
          return (
            <line
              key={b.id}
              x1={w.start.x}
              y1={w.start.y}
              x2={w.end.x}
              y2={w.end.y}
              stroke="#e5e7eb"
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
      {bones
        .filter((b) => b.isHead)
        .map((b) => {
          const w = world[b.id];
          return (
            <circle
              key={b.id}
              cx={w.end.x}
              cy={w.end.y}
              r={HEAD_RADIUS}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={4}
            />
          );
        })}
    </svg>
  );
}
