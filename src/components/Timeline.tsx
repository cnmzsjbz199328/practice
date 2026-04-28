import { useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { KeyframeMarker } from './KeyframeMarker';

export function Timeline() {
  const trackRef = useRef<HTMLDivElement>(null);
  const keyframes = useEditorStore((s) => s.keyframes);
  const duration = useEditorStore((s) => s.animationParams.durationSeconds);
  const addKeyframeAt = useEditorStore((s) => s.addKeyframeAt);

  function onTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const u = (e.clientX - rect.left) / rect.width;
    const time = Math.max(0, Math.min(duration, u * duration));
    addKeyframeAt(time);
  }

  return (
    <div className="card bg-base-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Timeline</h3>
        <span className="text-xs opacity-70">click empty area to add keyframe</span>
      </div>
      <div
        ref={trackRef}
        onClick={onTrackClick}
        className="relative h-12 bg-base-300 rounded cursor-crosshair"
      >
        {keyframes.map((k) => (
          <KeyframeMarker key={k.id} keyframe={k} duration={duration} />
        ))}
        <div className="absolute left-0 top-1/2 w-full border-t border-base-content/20 pointer-events-none" />
      </div>
      <div className="flex justify-between text-xs opacity-60 mt-1">
        <span>0s</span>
        <span>{duration.toFixed(2)}s</span>
      </div>
    </div>
  );
}
