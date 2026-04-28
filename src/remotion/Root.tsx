// Registered via registerRoot for `remotion render` / programmatic renderMedia. The Vite
// editor consumes StickmanComposition through @remotion/player directly, so this file is
// intentionally not imported by the Vite entry — it's the entry point for the CLI bundler.

import { Composition, registerRoot } from 'remotion';
import { StickmanComposition } from './StickmanComposition';
import { DEFAULT_COMPOSITION_PROPS } from './defaultProps';
import { DEFAULT_FPS } from '../skeleton/canvas';
import { CompositionPropsSchema } from '../schema/animationDocument';

export const RemotionRoot = () => (
  <>
    <Composition
      id="Stickman"
      component={StickmanComposition}
      schema={CompositionPropsSchema}
      durationInFrames={DEFAULT_FPS}
      fps={DEFAULT_FPS}
      width={DEFAULT_COMPOSITION_PROPS.canvas.width}
      height={DEFAULT_COMPOSITION_PROPS.canvas.height}
      defaultProps={DEFAULT_COMPOSITION_PROPS}
      calculateMetadata={({ props }) => {
        const fps = props.canvas.fps ?? DEFAULT_FPS;
        return {
          fps,
          durationInFrames: Math.max(
            1,
            Math.round(props.animationParams.durationSeconds * fps),
          ),
          width: props.canvas.width,
          height: props.canvas.height,
        };
      }}
    />
  </>
);

registerRoot(RemotionRoot);
