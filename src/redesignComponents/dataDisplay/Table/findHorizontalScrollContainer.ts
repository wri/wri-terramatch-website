export const findHorizontalScrollContainer = (root: HTMLElement | null): HTMLElement | null => {
  if (root == null) {
    return null;
  }

  const preferredScrollContainer = root.querySelector<HTMLElement>(":scope > div > div");
  if (preferredScrollContainer != null) {
    const { overflowX } = getComputedStyle(preferredScrollContainer);
    if (overflowX === "auto" || overflowX === "scroll") {
      return preferredScrollContainer;
    }
  }

  for (const element of root.querySelectorAll<HTMLElement>("div")) {
    const { overflowX } = getComputedStyle(element);
    if (overflowX === "auto" || overflowX === "scroll") {
      return element;
    }
  }

  return null;
};
