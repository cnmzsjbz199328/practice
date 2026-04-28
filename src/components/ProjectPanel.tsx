import { useRef, useState } from 'react';
import { useEditorStore, buildDocumentFromStore } from '../store/useEditorStore';
import {
  parseAnimationDocument,
  serializeAnimationDocument,
} from '../schema/animationDocument';
import { downloadString } from '../export/download';

const EXAMPLES: Record<string, string> = {
  wave: '/examples/wave.json',
  walk: '/examples/walk.json',
  jump: '/examples/jump.json',
};

export function ProjectPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const loadDocument = useEditorStore((s) => s.loadDocument);
  const [error, setError] = useState<string | null>(null);

  function onSave() {
    const doc = buildDocumentFromStore(useEditorStore.getState());
    downloadString('animation.json', serializeAnimationDocument(doc), 'application/json');
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const doc = parseAnimationDocument(parsed);
      loadDocument(doc);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      e.target.value = '';
    }
  }

  async function onLoadExample(e: React.ChangeEvent<HTMLSelectElement>) {
    const key = e.target.value;
    if (!key) return;
    e.target.value = '';
    const url = EXAMPLES[key];
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const doc = parseAnimationDocument(await res.json());
      loadDocument(doc);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="card bg-base-200 p-3 space-y-2">
      <h3 className="font-semibold">Project</h3>
      <div className="flex gap-2">
        <button onClick={onSave} className="btn btn-sm btn-outline flex-1">
          Save JSON
        </button>
        <button onClick={() => fileRef.current?.click()} className="btn btn-sm btn-outline flex-1">
          Load JSON
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={onFileChange}
      />
      <select
        className="select select-bordered select-sm w-full"
        defaultValue=""
        onChange={onLoadExample}
      >
        <option value="" disabled>
          Load example…
        </option>
        {Object.keys(EXAMPLES).map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      {error && (
        <div className="alert alert-error text-xs whitespace-pre-wrap">{error}</div>
      )}
    </div>
  );
}
