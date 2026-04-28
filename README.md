# Stickman SMIL Editor

A simple stickman SVG animation editor inspired by [`madeindjs/stickman`](https://github.com/madeindjs/stickman).
Pose a stick figure with draggable joints across multiple keyframes, preview in real time with
[Remotion](https://www.remotion.dev/), and **export a standalone SVG** that animates itself
using native SMIL `<animate>` tags — no CSS or JavaScript required at runtime.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + DaisyUI
- Remotion (`@remotion/player`) for live preview
- Zustand for editor state

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
npm run typecheck
```

## How it works

- **Skeleton**: parent-relative angles (forward kinematics) — bone lengths stay constant for
  free, joint dragging is a one-bone `atan2`, and angle interpolation is rotational.
- **Live preview**: `@remotion/player` renders the same scene the export will produce. The
  Remotion path and the SMIL path share `interpolatePose` semantics (segment-local easing,
  shortest-arc angle lerp) so the preview matches the exported file.
- **Export**: each bone becomes a `<line>` with four `<animate>` children
  (`x1`/`y1`/`x2`/`y2`) and the head becomes a `<circle>` with `cx`/`cy` animates.
  `keyTimes` come from keyframe times, `values` from forward-kinematics-resolved world
  coordinates, and `keySplines` carries the easing.

## SMIL caveat

SMIL `<animate>` is supported in Chrome, Firefox, Safari, and Edge. IE never supported it
(irrelevant). If a custom Bezier easing is set, `keySplines` is broadcast across all
keyframe segments — per-segment easing is not yet exposed in the UI but the type model
already reserves a `Keyframe.outEasing` slot.

## Out of scope (MVP)

- MP4 rendering via `@remotion/renderer` — `Root.tsx` already registers a `Composition`,
  so adding it later is purely additive.
- SVG import, undo/redo, persistence.
