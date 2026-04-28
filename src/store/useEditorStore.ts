import { create } from 'zustand';
import { BONES, DEFAULT_POSE } from '../skeleton/defaultSkeleton';
import type { AnimationParams, Bone, JointId, Keyframe, Pose } from '../skeleton/types';

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function clonePose(p: Pose): Pose {
  return { rootX: p.rootX, rootY: p.rootY, angles: { ...p.angles } };
}

interface EditorState {
  bones: Bone[];
  keyframes: Keyframe[];
  selectedKeyframeId: string;
  animationParams: AnimationParams;

  selectKeyframe: (id: string) => void;
  addKeyframeAt: (time: number) => void;
  removeKeyframe: (id: string) => void;
  updateJointAngle: (jointId: JointId, angle: number) => void;
  updateRoot: (x: number, y: number) => void;
  setKeyframeTime: (id: string, time: number) => void;
  setAnimationParams: (p: Partial<AnimationParams>) => void;
  getSelectedPose: () => Pose | null;
}

const initialKeyframes: Keyframe[] = [
  { id: makeId(), time: 0, pose: clonePose(DEFAULT_POSE) },
  {
    id: makeId(),
    time: 1,
    pose: {
      ...clonePose(DEFAULT_POSE),
      angles: {
        ...DEFAULT_POSE.angles,
        leftUpperArm: (DEFAULT_POSE.angles.leftUpperArm ?? 0) - 0.6,
        rightUpperArm: (DEFAULT_POSE.angles.rightUpperArm ?? 0) + 0.6,
      },
    },
  },
];

export const useEditorStore = create<EditorState>((set, get) => ({
  bones: BONES,
  keyframes: initialKeyframes,
  selectedKeyframeId: initialKeyframes[0].id,
  animationParams: {
    durationSeconds: 1,
    easing: { kind: 'ease-in-out' },
    loop: true,
  },

  selectKeyframe: (id) => set({ selectedKeyframeId: id }),

  addKeyframeAt: (time) =>
    set((state) => {
      const sourcePose =
        state.keyframes.find((k) => k.id === state.selectedKeyframeId)?.pose ?? DEFAULT_POSE;
      const kf: Keyframe = { id: makeId(), time, pose: clonePose(sourcePose) };
      const next = [...state.keyframes, kf].sort((a, b) => a.time - b.time);
      return { keyframes: next, selectedKeyframeId: kf.id };
    }),

  removeKeyframe: (id) =>
    set((state) => {
      if (state.keyframes.length <= 1) return state;
      const next = state.keyframes.filter((k) => k.id !== id);
      const selected =
        state.selectedKeyframeId === id ? next[0].id : state.selectedKeyframeId;
      return { keyframes: next, selectedKeyframeId: selected };
    }),

  updateJointAngle: (jointId, angle) =>
    set((state) => ({
      keyframes: state.keyframes.map((k) =>
        k.id === state.selectedKeyframeId
          ? { ...k, pose: { ...k.pose, angles: { ...k.pose.angles, [jointId]: angle } } }
          : k,
      ),
    })),

  updateRoot: (x, y) =>
    set((state) => ({
      keyframes: state.keyframes.map((k) =>
        k.id === state.selectedKeyframeId ? { ...k, pose: { ...k.pose, rootX: x, rootY: y } } : k,
      ),
    })),

  setKeyframeTime: (id, time) =>
    set((state) => {
      const next = state.keyframes
        .map((k) => (k.id === id ? { ...k, time } : k))
        .sort((a, b) => a.time - b.time);
      return { keyframes: next };
    }),

  setAnimationParams: (p) =>
    set((state) => ({ animationParams: { ...state.animationParams, ...p } })),

  getSelectedPose: () => {
    const s = get();
    return s.keyframes.find((k) => k.id === s.selectedKeyframeId)?.pose ?? null;
  },
}));
