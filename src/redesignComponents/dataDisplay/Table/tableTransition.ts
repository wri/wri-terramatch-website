// Shared by the page-change scroll and the height transition so both move as one animation.
export const TABLE_TRANSITION_MS = 500;

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// CSS equivalent of `easeInOutCubic`, for the Web Animations API.
export const EASE_IN_OUT_CUBIC_CSS = "cubic-bezier(0.65, 0, 0.35, 1)";

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
