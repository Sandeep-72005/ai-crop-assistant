# Cropwise

Cropwise is an AI crop health companion with photo-based assessment, practical treatment and prevention guidance, a searchable starter disease library, and a personal agricultural assistant.

It uses React 19, TypeScript, TanStack Start, Tailwind CSS, Radix dialogs, Lucide icons, and Netlify Functions. Gemini multimodal inference runs through Netlify AI Gateway. The generated hero asset is served through Netlify Image CDN.

## Local development

Install dependencies with `pnpm install`. Run `netlify dev --port 8889` using a linked Netlify project so functions and AI Gateway are available. Open the address printed by the CLI. Netlify runs the production build during deployment.

## Behavior

Upload a JPEG, PNG, or WebP photo up to 4 MB, optionally select a crop and add observations, then choose Analyze crop. The assistant can discuss the resulting assessment or answer other growing questions. Photos, assessments, and conversations are session-only and are not saved by this application. Photos and questions are sent to the AI provider for inference.

Photo assessments are suggestions, not confirmed diagnoses. The app does not promise detection of every disease; uncertain, severe, and spreading problems should be confirmed with a local agricultural expert. Disease library photographs illustrate crops rather than diagnostic symptoms.
