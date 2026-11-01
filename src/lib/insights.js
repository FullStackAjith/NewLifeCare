// Opt-in, in-memory, per-session counters. Nothing is transmitted or persisted.
let state = { enabled: false, pageViews: 0, whatsappClicks: 0, formAttempts: 0 };
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const insights = {
  get: () => state,
  subscribe(l) { listeners.add(l); return () => listeners.delete(l); },
  setEnabled(enabled) { state = { ...state, enabled }; emit(); },
  reset() { state = { ...state, pageViews: 1, whatsappClicks: 0, formAttempts: 0 }; emit(); },
  track(kind) {
    if (!state.enabled) return;
    state = { ...state, [kind]: state[kind] + 1 };
    emit();
  },
};
