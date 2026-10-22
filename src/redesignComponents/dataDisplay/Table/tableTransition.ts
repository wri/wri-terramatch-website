export const TABLE_TRANSITION_MS = 500;

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const EASE_IN_OUT_CUBIC_CSS = "cubic-bezier(0.65, 0, 0.35, 1)";

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
