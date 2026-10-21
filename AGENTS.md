# Cropwise project guide

## Architecture

This is a React 19 / TypeScript TanStack Start app hosted on Netlify. `src/routes/index.tsx` contains the responsive workspace, photo scan workflow, disease library, and assistant dialog. `src/routes/__root.tsx` owns the document and share metadata. `src/styles.css` contains Tailwind setup and the Cropwise visual system: forest green, warm botanical neutrals, DM Sans, and Manrope.

`src/lib/diseases.ts` contains curated introductory guides, not user records. `netlify/functions/crop-ai.mts` exposes POST `/api/crop-ai` for multimodal assessments and conversational advice through Gemini and Netlify AI Gateway. Keep provider SDK construction inside the handler. Do not expose credentials or inference SDKs in client code. `public/img/crop-hero.png` is a generated editorial asset served through Netlify Image CDN. `src/components/ui` contains reusable Radix controls; dialogs use these for keyboard and focus handling.

## Conventions

Use typed React components, descriptive camelCase functions, and Lucide icons. Preserve responsive layouts and reduced-motion support. Validate input both client-side and server-side, retain inline error messages, and disable duplicate requests while pending. Never claim comprehensive disease coverage or confirmed diagnoses. Keep uncertainty and local expert confirmation in agricultural advice. Library images illustrate crops, not disease symptoms.

Photos and conversations are intentionally ephemeral React state; there is no history or account feature. Do not add browser storage or local JSON persistence. If persistence is requested, follow the Netlify storage skills and use platform primitives.

The router generates `src/routeTree.gen.ts`; do not edit it. The project uses pnpm. The platform installs dependencies and validates builds automatically; do not run local build, test, typecheck, or development commands during managed agent runs.
