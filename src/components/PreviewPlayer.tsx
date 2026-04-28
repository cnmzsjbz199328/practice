import { Player } from '@remotion/player';
import { useEditorStore } from '../store/useEditorStore';
import { StickmanComposition } from '../remotion/StickmanComposition';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './StickmanCanvas';

const FPS = 30;

export function PreviewPlayer() {
  const keyframes = useEditorStore((s) => s.keyframes);
  const animationParams = useEditorStore((s) => s.animationParams);
  const durationInFrames = Math.max(1, Math.round(animationParams.durationSeconds * FPS));

  return (
    <Player
      key={`${durationInFrames}-${animationParams.loop ? 1 : 0}`}
      component={StickmanComposition}
      inputProps={{ keyframes, animationParams }}
      durationInFrames={durationInFrames}
      fps={FPS}
      compositionWidth={CANVAS_WIDTH}
      compositionHeight={CANVAS_HEIGHT}
      style={{ width: '100%', maxWidth: CANVAS_WIDTH, aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
      controls
      loop={animationParams.loop}
      autoPlay
    />
  );
}
