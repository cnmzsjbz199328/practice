import { useCurrentFrame, useVideoConfig } from 'remotion';
import { BONES, HEAD_RADIUS } from '../skeleton/defaultSkeleton';
import { poseToJointWorld } from '../skeleton/forwardKinematics';
import { interpolatePose } from '../skeleton/interpolate';
import type { AnimationParams, Keyframe } from '../skeleton/types';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../components/StickmanCanvas';

export interface StickmanCompositionProps {
  keyframes: Keyframe[];
  animationParams: AnimationParams;
}

export function StickmanComposition({ keyframes, animationParams }: StickmanCompositionProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const denom = Math.max(1, durationInFrames - 1);
  const tNorm = frame / denom;
  const tSeconds = tNorm * animationParams.durationSeconds;

  const pose = interpolatePose(keyframes, tSeconds, animationParams.easing);
  const world = poseToJointWorld(pose, BONES);

  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      width="100%"
      height="100%"
      style={{ background: '#1d232a' }}
    >
      {BONES.filter((b) => b.parent !== null && !b.isHead).map((b) => {
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
      <circle
        cx={world.head.end.x}
        cy={world.head.end.y}
        r={HEAD_RADIUS}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={4}
      />
    </svg>
  );
}
