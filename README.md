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

2. Open the client UI in a browser after starting the API server:

```bash
# with server started (see step 1), open:
http://localhost:4000/
```

Note: The API now serves the client SPA at the root path.

Notes:
- This is an initial MVP scaffold implementing the required data model, a deterministic generation engine that only uses user-provided facts, persistence, basic exports, and a simple UI.
- It is intentionally small so you can iterate. Replace generator stubs with real LLM orchestration later.

Current workflow

1. Open the app at `http://localhost:4000/`.
2. Register and log in from the Authentication section.
3. Select web page language (EN/RU), resume language (EN/RU), and target region (including Russia/CIS).
4. Upload a resume (PDF/DOCX) or paste text, then save profile.
5. Paste vacancy text, run compare/generation, and export TXT/PDF.

Security behavior

- Protected actions now require login (JWT): profile save, resume upload, generation, compare, interview prep, and exports.
- If not logged in, the UI blocks these actions and asks the user to log in first.
# CV_Builder_WAD