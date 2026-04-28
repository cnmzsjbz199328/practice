import { useEditorStore } from '../store/useEditorStore';
import type { Keyframe } from '../skeleton/types';

interface Props {
  keyframe: Keyframe;
  duration: number;
}

export function KeyframeMarker({ keyframe, duration }: Props) {
  const selectedId = useEditorStore((s) => s.selectedKeyframeId);
  const select = useEditorStore((s) => s.selectKeyframe);
  const remove = useEditorStore((s) => s.removeKeyframe);
  const totalKfs = useEditorStore((s) => s.keyframes.length);

  const u = duration > 0 ? Math.max(0, Math.min(1, keyframe.time / duration)) : 0;
  const isSelected = selectedId === keyframe.id;

  return (
    <div
      style={{ left: `calc(${u * 100}% - 10px)` }}
      className="absolute top-1 group"
      onClick={(e) => {
        e.stopPropagation();
        select(keyframe.id);
      }}
    >
      <div
        className={`w-5 h-10 rounded ${isSelected ? 'bg-primary' : 'bg-base-content/40'} cursor-pointer flex items-center justify-center`}
        title={`${keyframe.time.toFixed(2)}s`}
      >
        <span className="text-[10px] text-base-100">{keyframe.time.toFixed(1)}</span>
      </div>
      {totalKfs > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            remove(keyframe.id);
          }}
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-error text-error-content text-[10px] hidden group-hover:flex items-center justify-center"
          title="remove keyframe"
        >
          x
        </button>
      )}
    </div>
  );
}
