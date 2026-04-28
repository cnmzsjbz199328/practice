import { useEditorStore } from '../store/useEditorStore';
import { emitSmilSvg } from '../export/emitSmilSvg';
import { downloadString } from '../export/download';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './StickmanCanvas';

export function ExportButton() {
  const keyframes = useEditorStore((s) => s.keyframes);
  const params = useEditorStore((s) => s.animationParams);
  const bones = useEditorStore((s) => s.bones);

  function onExport() {
    const svg = emitSmilSvg(keyframes, params, bones, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });
    downloadString('stickman.svg', svg, 'image/svg+xml');
  }

  return (
    <button onClick={onExport} className="btn btn-primary btn-sm w-full">
      Export SMIL SVG
    </button>
  );
}
