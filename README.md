AI Resume Generator and Cover Letter Generator (MVP)

This workspace contains a minimal, self-contained MVP scaffold for the AI Resume Generator & Cover Letter Generator product brief.

Components:
- server/: Express API, JSON persistence (lowdb), core models, generator enforcing "No Lies Mode" (evidence-first).
- client/: Minimal single-page UI to create a master profile, paste a vacancy, and generate tailored outputs.

Run the API server:

1. Install server dependencies

```bash
cd server
npm install
npm start
```

2. Open the client UI (served as static files) in a browser: open `client/index.html` directly or use a static server.

Notes:
- This is an initial MVP scaffold implementing the required data model, a deterministic generation engine that only uses user-provided facts, persistence, basic exports, and a simple UI.
- It is intentionally small so you can iterate. Replace generator stubs with real LLM orchestration later.
# CV_Builder_WAD