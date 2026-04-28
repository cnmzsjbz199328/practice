import type { Bone, JointId, Pose } from './types';

export interface JointWorld {
  start: { x: number; y: number };
  end: { x: number; y: number };
  worldAngle: number;
}

export function poseToJointWorld(
  pose: Pose,
  bones: Bone[],
): Record<JointId, JointWorld> {
  const out: Partial<Record<JointId, JointWorld>> = {};
  const byId = new Map<JointId, Bone>();
  for (const b of bones) byId.set(b.id, b);

  function resolve(id: JointId): JointWorld {
    const cached = out[id];
    if (cached) return cached;
    const bone = byId.get(id)!;
    if (bone.parent === null) {
      const node: JointWorld = {
        start: { x: pose.rootX, y: pose.rootY },
        end: { x: pose.rootX, y: pose.rootY },
        worldAngle: 0,
      };
      out[id] = node;
      return node;
    }
    const parent = resolve(bone.parent);
    const worldAngle = parent.worldAngle + pose.angles[id];
    const start = parent.end;
    const end = {
      x: start.x + bone.length * Math.cos(worldAngle),
      y: start.y + bone.length * Math.sin(worldAngle),
    };
    const node: JointWorld = { start, end, worldAngle };
    out[id] = node;
    return node;
  }

  for (const b of bones) resolve(b.id);
  return out as Record<JointId, JointWorld>;
}
