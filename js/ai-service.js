// Future secure AI adapter.
// GitHub Pages is public client-side code, so no API keys or private tokens belong here.
// v1 intentionally uses deterministic local clinical-engine.js and goal-engine.js logic.
export const aiService={
  available:false,
  async summarize(){throw new Error("Secure AI backend is not configured.")}
};
