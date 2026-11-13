import { create } from 'zustand';

export type ToastTone = 'default' | 'success' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
}

interface ToastState {
  toasts: ToastItem[];
  show: (
    message: string,
    opts?: { tone?: ToastTone; action?: ToastItem['action']; durationMs?: number },
  ) => number;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, { tone = 'default', action, durationMs = 4000 } = {}) => {
    const id = nextId++;
    set({ toasts: [...get().toasts, { id, message, tone, action }] });
    if (durationMs > 0) setTimeout(() => get().dismiss(id), durationMs);
    return id;
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

/** Imperative helper for ViewModels. */
export const toast = {
  show: (...args: Parameters<ToastState['show']>) => useToastStore.getState().show(...args),
  dismiss: (id: number) => useToastStore.getState().dismiss(id),
};
