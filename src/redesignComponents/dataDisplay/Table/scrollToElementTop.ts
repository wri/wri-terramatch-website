import { easeInOutCubic, prefersReducedMotion, TABLE_TRANSITION_MS } from "./tableTransition";

/** Mark a container (e.g. tab content) with this attribute so tables inside it scroll to its top instead of their own. */
export const TABLE_SCROLL_ANCHOR_ATTRIBUTE = "data-table-scroll-anchor";

const isVerticallyScrollable = (element: HTMLElement) => {
  const { overflowY } = getComputedStyle(element);
  return (overflowY === "auto" || overflowY === "scroll") && element.scrollHeight > element.clientHeight;
};

const findVerticalScrollContainer = (element: HTMLElement): HTMLElement => {
  for (let node = element.parentElement; node != null; node = node.parentElement) {
    if (isVerticallyScrollable(node)) return node;
  }
  return document.scrollingElement as HTMLElement;
};

/**
 * A sticky element can only cover the target while it's stuck inside one of the target's ancestors, so the
 * only candidates are the earlier siblings of each node on the path from the target up to the scroll container.
 */
const getStickyOffset = (element: HTMLElement, scrollContainer: HTMLElement) => {
  let offset = 0;
  for (let node: HTMLElement | null = element; node != null && node !== scrollContainer; node = node.parentElement) {
    for (let sibling = node.previousElementSibling; sibling != null; sibling = sibling.previousElementSibling) {
      const { position, top } = getComputedStyle(sibling);
      if (position !== "sticky") continue;
      const stickyTop = parseFloat(top);
      offset = Math.max(offset, (Number.isNaN(stickyTop) ? 0 : stickyTop) + sibling.getBoundingClientRect().height);
    }
  }
  return offset;
};

/** Scrolls the element's top to the top of its nearest scroll container, just below any sticky elements. */
export const scrollToElementTop = (element: HTMLElement) => {
  const scrollContainer = findVerticalScrollContainer(element);
  const isDocument = scrollContainer === document.scrollingElement;
  const containerTop = isDocument ? 0 : scrollContainer.getBoundingClientRect().top;
  const start = scrollContainer.scrollTop;
  const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const target = Math.min(
    maxScrollTop,
    Math.max(0, start + element.getBoundingClientRect().top - containerTop - getStickyOffset(element, scrollContainer))
  );
  const distance = target - start;
  if (Math.abs(distance) < 1) return;

  if (prefersReducedMotion()) {
    scrollContainer.scrollTop = target;
    return;
  }

  const startTime = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - startTime) / TABLE_TRANSITION_MS, 1);
    scrollContainer.scrollTop = start + distance * easeInOutCubic(progress);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
