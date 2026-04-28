import { useRef } from 'react';
import { BONES, HEAD_RADIUS } from '../skeleton/defaultSkeleton';
import { poseToJointWorld } from '../skeleton/forwardKinematics';
import type { Pose } from '../skeleton/types';
import { JointHandle } from './JointHandle';

export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 360;

interface Props {
  pose: Pose;
  editable?: boolean;
}

export function StickmanCanvas({ pose, editable = false }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const world = poseToJointWorld(pose, BONES);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="bg-base-200 rounded-lg border border-base-300"
    >
      <rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="transparent" />
      {BONES.filter((b) => b.parent !== null && !b.isHead).map((b) => {
        const w = world[b.id];
        return (
          <line
            key={b.id}
            x1={w.start.x}
            y1={w.start.y}
            x2={w.end.x}
            y2={w.end.y}
            stroke="currentColor"
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
      {(() => {
        const h = world.head;
        return (
          <circle cx={h.end.x} cy={h.end.y} r={HEAD_RADIUS} fill="none" stroke="currentColor" strokeWidth={4} />
        );
      })()}
      {editable &&
        BONES.filter((b) => b.parent !== null).map((b) => {
          const w = world[b.id];
          return <JointHandle key={b.id} jointId={b.id} svgRef={svgRef} cx={w.end.x} cy={w.end.y} />;
        })}
      {editable && (
        <JointHandle jointId="pelvis" svgRef={svgRef} cx={world.pelvis.end.x} cy={world.pelvis.end.y} isRoot />
      )}
    </svg>
  );
}
