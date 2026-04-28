import type { Bone, JointId, Pose } from './types';

export const BONES: Bone[] = [
  { id: 'pelvis', parent: null, length: 0 },
  { id: 'torso', parent: 'pelvis', length: 80 },
  { id: 'head', parent: 'torso', length: 40, isHead: true },
  { id: 'leftUpperArm', parent: 'torso', length: 50 },
  { id: 'leftLowerArm', parent: 'leftUpperArm', length: 50 },
  { id: 'rightUpperArm', parent: 'torso', length: 50 },
  { id: 'rightLowerArm', parent: 'rightUpperArm', length: 50 },
  { id: 'leftUpperLeg', parent: 'pelvis', length: 60 },
  { id: 'leftLowerLeg', parent: 'leftUpperLeg', length: 60 },
  { id: 'rightUpperLeg', parent: 'pelvis', length: 60 },
  { id: 'rightLowerLeg', parent: 'rightUpperLeg', length: 60 },
];

const D = (deg: number) => (deg * Math.PI) / 180;

export const DEFAULT_POSE: Pose = {
  rootX: 240,
  rootY: 220,
  angles: {
    pelvis: 0,
    torso: D(-90),
    head: D(0),
    leftUpperArm: D(120),
    leftLowerArm: D(0),
    rightUpperArm: D(60),
    rightLowerArm: D(0),
    leftUpperLeg: D(110),
    leftLowerLeg: D(0),
    rightUpperLeg: D(70),
    rightLowerLeg: D(0),
  },
};

export const HEAD_RADIUS = 18;

export const JOINT_IDS: JointId[] = BONES.map((b) => b.id);
