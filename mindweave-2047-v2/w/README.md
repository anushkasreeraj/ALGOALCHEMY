# MINDWEAVE 2047
Age-aware, psychology-informed social network (frontend-only demo). React + TS + Vite + Tailwind + Zustand.
## Login
`/login` offers one-click demo profiles (no passwords) or "Create a new profile" (onboarding). Log out from Settings or the right rail.
## Run
`npm install && npm run dev` · Build: `npm run build` (outputs `dist/`)
## Deploy
- **Vercel**: import repo, framework Vite (build `npm run build`, output `dist`). `vercel.json` handles SPA fallback.
- **Netlify**: import repo; `netlify.toml` + `public/_redirects` handle build and SPA fallback.
## AI
`src/aiService.ts` uses deterministic demo rules (`socialMoodMirror.ts`). To go model-backed, set `VITE_AI_ENDPOINT` to your own serverless function that holds the API key. No keys in frontend code.
## Limitations
Data lives in localStorage only; messages are not real-time/shared; no real auth or age verification; reports/blocks are local.
