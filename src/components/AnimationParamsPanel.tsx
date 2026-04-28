import { useEditorStore } from '../store/useEditorStore';
import type { EasingSpec } from '../skeleton/types';
import { ExportButton } from './ExportButton';

const EASING_PRESETS: { label: string; value: EasingSpec }[] = [
  { label: 'Linear', value: { kind: 'linear' } },
  { label: 'Ease-in-out', value: { kind: 'ease-in-out' } },
];

function easingKey(e: EasingSpec): string {
  return e.kind === 'cubic-bezier' ? `cb:${e.p1x},${e.p1y},${e.p2x},${e.p2y}` : e.kind;
}

export function AnimationParamsPanel() {
  const params = useEditorStore((s) => s.animationParams);
  const setParams = useEditorStore((s) => s.setAnimationParams);

  const isCustom = params.easing.kind === 'cubic-bezier';
  const cb =
    params.easing.kind === 'cubic-bezier'
      ? params.easing
      : { p1x: 0.42, p1y: 0, p2x: 0.58, p2y: 1 };

  return (
    <div className="card bg-base-200 p-3 space-y-3">
      <h3 className="font-semibold">Animation</h3>

      <label className="form-control">
        <span className="label-text">Duration (seconds)</span>
        <input
          type="number"
          step={0.1}
          min={0.1}
          value={params.durationSeconds}
          onChange={(e) => setParams({ durationSeconds: Math.max(0.1, parseFloat(e.target.value) || 0.1) })}
          className="input input-bordered input-sm"
        />
      </label>

      <label className="form-control">
        <span className="label-text">Easing</span>
        <select
          className="select select-bordered select-sm"
          value={isCustom ? 'cubic-bezier' : easingKey(params.easing)}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'cubic-bezier') {
              setParams({ easing: { kind: 'cubic-bezier', ...cb } });
            } else {
              const preset = EASING_PRESETS.find((p) => easingKey(p.value) === v);
              if (preset) setParams({ easing: preset.value });
            }
          }}
        >
          {EASING_PRESETS.map((p) => (
            <option key={easingKey(p.value)} value={easingKey(p.value)}>
              {p.label}
            </option>
          ))}
          <option value="cubic-bezier">Cubic-bezier (custom)</option>
        </select>
      </label>

      {isCustom && (
        <div className="grid grid-cols-4 gap-2">
          {(['p1x', 'p1y', 'p2x', 'p2y'] as const).map((k) => (
            <label key={k} className="form-control">
              <span className="label-text text-xs">{k}</span>
              <input
                type="number"
                step={0.05}
                value={cb[k]}
                onChange={(e) =>
                  setParams({
                    easing: { kind: 'cubic-bezier', ...cb, [k]: parseFloat(e.target.value) || 0 },
                  })
                }
                className="input input-bordered input-xs"
              />
            </label>
          ))}
        </div>
      )}

      <label className="cursor-pointer label justify-start gap-2">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={params.loop}
          onChange={(e) => setParams({ loop: e.target.checked })}
        />
        <span className="label-text">Loop</span>
      </label>

      <ExportButton />
    </div>
  );
}
