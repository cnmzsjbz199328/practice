import { RefObject } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { poseToJointWorld } from '../skeleton/forwardKinematics';
import type { JointId } from '../skeleton/types';
import { svgPointFromEvent } from '../util/math';

interface Props {
  jointId: JointId;
  svgRef: RefObject<SVGSVGElement>;
  cx: number;
  cy: number;
  isRoot?: boolean;
}

export function JointHandle({ jointId, svgRef, cx, cy, isRoot }: Props) {
  const updateJointAngle = useEditorStore((s) => s.updateJointAngle);
  const updateRoot = useEditorStore((s) => s.updateRoot);
  const getSelectedPose = useEditorStore((s) => s.getSelectedPose);

  function onPointerDown(e: React.PointerEvent<SVGCircleElement>) {
    e.stopPropagation();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    function onMove(ev: PointerEvent) {
      if (!svgRef.current) return;
      const pt = svgPointFromEvent(svgRef.current, ev.clientX, ev.clientY);
      if (isRoot) {
        updateRoot(pt.x, pt.y);
        return;
      }
      const pose = getSelectedPose();
      if (!pose) return;
      const bones = useEditorStore.getState().bones;
      const bone = bones.find((b) => b.id === jointId);
      if (!bone || !bone.parent) return;
      const world = poseToJointWorld(pose, bones);
      const parent = world[bone.parent];
      const parentEnd = parent.end;
      const worldAngle = Math.atan2(pt.y - parentEnd.y, pt.x - parentEnd.x);
      const parentWorldAngle = parent.worldAngle;
      const localAngle = worldAngle - parentWorldAngle;
      updateJointAngle(jointId, normalize(localAngle));
    }

    function onUp(ev: PointerEvent) {
      target.releasePointerCapture(ev.pointerId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill={isRoot ? '#f59e0b' : '#38bdf8'}
      stroke="white"
      strokeWidth={1.5}
      style={{ cursor: 'grab' }}
      onPointerDown={onPointerDown}
    />
  );
}

function normalize(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}
