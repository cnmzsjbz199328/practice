import type { StickmanCompositionProps } from './StickmanComposition';

const D = (deg: number) => (deg * Math.PI) / 180;

const POSE_ARM_DOWN = {
  pelvis: 0,
  torso: D(-90),
  head: 0,
  leftUpperArm: D(120),
  leftLowerArm: 0,
  rightUpperArm: D(-90),
  rightLowerArm: -0.5,
  leftUpperLeg: D(110),
  leftLowerLeg: 0,
  rightUpperLeg: D(70),
  rightLowerLeg: 0,
};

const POSE_ARM_UP = { ...POSE_ARM_DOWN, rightLowerArm: 0.6 };

export const DEFAULT_COMPOSITION_PROPS: StickmanCompositionProps = {
  canvas: { width: 480, height: 360, fps: 30 },
  bones: [
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
  ],
  keyframes: [
    { id: 'k0', time: 0, pose: { rootX: 240, rootY: 220, angles: POSE_ARM_DOWN } },
    { id: 'k1', time: 1, pose: { rootX: 240, rootY: 220, angles: POSE_ARM_UP } },
    { id: 'k2', time: 2, pose: { rootX: 240, rootY: 220, angles: POSE_ARM_DOWN } },
  ],
  animationParams: {
    durationSeconds: 2,
    easing: { kind: 'ease-in-out' },
    loop: true,
  },
};
