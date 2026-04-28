import { useEffect } from 'react';
import { useEditorStore } from './store/useEditorStore';
import { StickmanCanvas } from './components/StickmanCanvas';
import { Timeline } from './components/Timeline';
import { PreviewPlayer } from './components/PreviewPlayer';
import { AnimationParamsPanel } from './components/AnimationParamsPanel';
import { ProjectPanel } from './components/ProjectPanel';
import { DEFAULT_POSE } from './skeleton/defaultSkeleton';
import { parseAnimationDocument } from './schema/animationDocument';

function App() {
  const selectedKeyframeId = useEditorStore((s) => s.selectedKeyframeId);
  const keyframe = useEditorStore((s) =>
    s.keyframes.find((k) => k.id === s.selectedKeyframeId),
  );
  const loadDocument = useEditorStore((s) => s.loadDocument);
  const pose = keyframe?.pose ?? DEFAULT_POSE;

  useEffect(() => {
    const url = new URLSearchParams(window.location.search).get('animation');
    if (!url) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const doc = parseAnimationDocument(await res.json());
        if (!cancelled) loadDocument(doc);
      } catch (err) {
        console.error('Failed to load animation from URL:', err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadDocument]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Stickman SMIL Editor</h1>
        <p className="text-sm opacity-70">
          JSON-driven stickman animations. Save / load via the Project panel; preview with
          Remotion; render to MP4 via <code>npm run render</code>.
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
        <aside className="space-y-4">
          <ProjectPanel />
          <AnimationParamsPanel />
        </aside>
      </main>
    </div>
  );
}

export default App;
