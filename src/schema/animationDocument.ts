import { z } from 'zod';

export const CURRENT_VERSION = 1 as const;

const BoneSchema = z.object({
  id: z.string(),
  parent: z.string().nullable(),
  length: z.number().nonnegative(),
  isHead: z.boolean().optional(),
});

const PoseSchema = z.object({
  rootX: z.number(),
  rootY: z.number(),
  angles: z.record(z.string(), z.number()),
});

const KeyframeSchema = z.object({
  id: z.string(),
  time: z.number().nonnegative(),
  pose: PoseSchema,
});

const EasingSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('linear') }),
  z.object({ kind: z.literal('ease-in-out') }),
  z.object({
    kind: z.literal('cubic-bezier'),
    p1x: z.number(),
    p1y: z.number(),
    p2x: z.number(),
    p2y: z.number(),
  }),
]);

const AnimationParamsSchema = z.object({
  durationSeconds: z.number().positive(),
  easing: EasingSchema,
  loop: z.boolean(),
});

const CanvasSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  fps: z.number().positive().optional(),
});

export const CompositionPropsSchema = z.object({
  canvas: CanvasSchema,
  bones: z.array(BoneSchema).min(1),
  keyframes: z.array(KeyframeSchema).min(1),
  animationParams: AnimationParamsSchema,
});

export const AnimationDocumentSchema = CompositionPropsSchema.extend({
  version: z.literal(CURRENT_VERSION),
});

export type CompositionProps = z.infer<typeof CompositionPropsSchema>;
export type AnimationDocument = z.infer<typeof AnimationDocumentSchema>;

export function parseAnimationDocument(input: unknown): AnimationDocument {
  if (input && typeof input === 'object' && 'version' in input) {
    const v = (input as { version: unknown }).version;
    if (typeof v === 'number' && v !== CURRENT_VERSION) {
      throw new Error(
        `Unsupported animation document version: ${v}. This editor reads version ${CURRENT_VERSION}.`,
      );
    }
  }
  return AnimationDocumentSchema.parse(input);
}

export function serializeAnimationDocument(doc: AnimationDocument): string {
  return JSON.stringify(doc, null, 2);
}
