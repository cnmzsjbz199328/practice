import { useEditorStore } from './store/useEditorStore';
import { StickmanCanvas } from './components/StickmanCanvas';
import { Timeline } from './components/Timeline';
import { PreviewPlayer } from './components/PreviewPlayer';
import { AnimationParamsPanel } from './components/AnimationParamsPanel';
import { DEFAULT_POSE } from './skeleton/defaultSkeleton';

function App() {
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const keyframe = useEditorStore((s) =>
    s.keyframes.find((k) => k.id === s.selectedKeyframeId),
  );
  const pose = keyframe?.pose ?? DEFAULT_POSE;

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Stickman SMIL Editor</h1>
        <p className="text-sm opacity-70">
          Pose the stickman per keyframe, preview with Remotion, export a standalone SVG with
          native <code>&lt;animate&gt;</code> tags.
        </p>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-[auto_320px] gap-6">
        <div className="space-y-4">
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs opacity-70">
              editing keyframe: <code>{selectedKeyframeId}</code>
            </span>
            <StickmanCanvas pose={pose} editable />
          </div>
          <Timeline />
          <div>
            <h3 className="font-semibold mb-2">Preview (Remotion)</h3>
            <PreviewPlayer />
          </div>
        </div>
        <aside>
          <AnimationParamsPanel />
        </aside>
      </main>
    </div>
  );
}

export default App;
