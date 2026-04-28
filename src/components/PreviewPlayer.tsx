import { Player } from '@remotion/player';
import { useEditorStore } from '../store/useEditorStore';
import { StickmanComposition } from '../remotion/StickmanComposition';
import { DEFAULT_FPS } from '../skeleton/canvas';

export function PreviewPlayer() {
  const keyframes = useEditorStore((s) => s.keyframes);
  const animationParams = useEditorStore((s) => s.animationParams);
  const bones = useEditorStore((s) => s.bones);
  const canvas = useEditorStore((s) => s.canvas);
  const fps = canvas.fps || DEFAULT_FPS;
  const durationInFrames = Math.max(1, Math.round(animationParams.durationSeconds * fps));

  return (
    <Player
      key={`${durationInFrames}-${animationParams.loop ? 1 : 0}-${canvas.width}x${canvas.height}`}
      component={StickmanComposition}
      inputProps={{ keyframes, animationParams, bones, canvas: { ...canvas } }}
      durationInFrames={durationInFrames}
      fps={fps}
      compositionWidth={canvas.width}
      compositionHeight={canvas.height}
      style={{ width: '100%', maxWidth: canvas.width, aspectRatio: `${canvas.width}/${canvas.height}` }}
      controls
      loop={animationParams.loop}
      autoPlay
    />
  );
}
