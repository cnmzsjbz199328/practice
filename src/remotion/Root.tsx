// Registered via registerRoot for future `remotion render` use. The Vite editor consumes
// StickmanComposition through @remotion/player directly, so this file is intentionally not
// imported by the Vite entry. Adding @remotion/cli + an entry that imports this file is the
// only step needed to enable MP4 rendering.

import { Composition, registerRoot } from 'remotion';
import { StickmanComposition } from './StickmanComposition';
import type { StickmanCompositionProps } from './StickmanComposition';
import { DEFAULT_POSE } from '../skeleton/defaultSkeleton';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../components/StickmanCanvas';

const FPS = 30;

const DEFAULT_PROPS: StickmanCompositionProps = {
  keyframes: [{ id: 'k0', time: 0, pose: DEFAULT_POSE }],
  animationParams: { durationSeconds: 1, easing: { kind: 'ease-in-out' }, loop: true },
};

export const RemotionRoot = () => (
  <>
    <Composition
      id="Stickman"
      component={StickmanComposition}
      durationInFrames={FPS}
      fps={FPS}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      defaultProps={DEFAULT_PROPS}
      calculateMetadata={({ props }: { props: StickmanCompositionProps }) => ({
        durationInFrames: Math.max(
          1,
          Math.round(props.animationParams.durationSeconds * FPS),
        ),
        fps: FPS,
      })}
    />
  </>
);

registerRoot(RemotionRoot);
