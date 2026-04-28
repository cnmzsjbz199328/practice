// Bone IDs are arbitrary strings now that the document is JSON-driven. The default
// skeleton uses the names below, but loaded documents may use any string ids.
export type JointId = string;

export type DefaultJointId =
  | 'pelvis'
  | 'torso'
  | 'head'
  | 'leftUpperArm'
  | 'leftLowerArm'
  | 'rightUpperArm'
  | 'rightLowerArm'
  | 'leftUpperLeg'
  | 'leftLowerLeg'
  | 'rightUpperLeg'
  | 'rightLowerLeg';

export interface Bone {
  id: JointId;
  parent: JointId | null;
  length: number;
  isHead?: boolean;
}

export interface Pose {
  rootX: number;
  rootY: number;
  angles: Record<JointId, number>;
}

export interface Keyframe {
  id: string;
  time: number;
  pose: Pose;
}

export type EasingSpec =
  | { kind: 'linear' }
  | { kind: 'ease-in-out' }
  | { kind: 'cubic-bezier'; p1x: number; p1y: number; p2x: number; p2y: number };

export interface AnimationParams {
  durationSeconds: number;
  easing: EasingSpec;
  loop: boolean;
}
