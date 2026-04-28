import { useRef } from 'react';
import { HEAD_RADIUS } from '../skeleton/defaultSkeleton';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../skeleton/canvas';
import { poseToJointWorld } from '../skeleton/forwardKinematics';
import type { Pose } from '../skeleton/types';
import { useEditorStore } from '../store/useEditorStore';
import { JointHandle } from './JointHandle';

export { CANVAS_WIDTH, CANVAS_HEIGHT };

interface Props {
  pose: Pose;
  editable?: boolean;
}

export function StickmanCanvas({ pose, editable = false }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const bones = useEditorStore((s) => s.bones);
  const canvas = useEditorStore((s) => s.canvas);
  const world = poseToJointWorld(pose, bones);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${canvas.width} ${canvas.height}`}
      width={canvas.width}
      height={canvas.height}
      className="bg-base-200 rounded-lg border border-base-300"
    >
      <rect x={0} y={0} width={canvas.width} height={canvas.height} fill="transparent" />
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
              stroke="currentColor"
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
              stroke="currentColor"
              strokeWidth={4}
            />
          );
        })}
      {editable &&
        bones
          .filter((b) => b.parent !== null)
          .map((b) => {
            const w = world[b.id];
            return <JointHandle key={b.id} jointId={b.id} svgRef={svgRef} cx={w.end.x} cy={w.end.y} />;
          })}
      {editable && (() => {
        const root = bones.find((b) => b.parent === null);
        if (!root) return null;
        const w = world[root.id];
        return (
          <JointHandle jointId={root.id} svgRef={svgRef} cx={w.end.x} cy={w.end.y} isRoot />
        );
      })()}
    </svg>
  );
}
