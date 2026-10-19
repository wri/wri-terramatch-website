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

export type ScrollAlignment = "start" | "center";

/**
 * The element's natural height, measured from its children. `scrollHeight` can't be used: it never reports less
 * than the element's own box, which a height transition is still holding at the previous (taller) height.
 */
const getContentHeight = (element: HTMLElement) => {
  const { top, height } = element.getBoundingClientRect();
  const children = Array.from(element.children);
  if (children.length === 0) return height;
  return Math.max(...children.map(child => child.getBoundingClientRect().bottom)) - top;
};

/**
 * Scrolls the element within its nearest scroll container, below any sticky elements: `start` puts its top at the
 * top of the visible area, `center` puts it in the middle (falling back to `start` when it's taller than that area).
 * The height used for centering is the element's content height, so it's already the final one while a height
 * transition still holds the element at its previous height (see `getContentHeight`).
 */
export const scrollToElement = (element: HTMLElement, alignment: ScrollAlignment) => {
  const scrollContainer = findVerticalScrollContainer(element);
  const isDocument = scrollContainer === document.scrollingElement;
  const containerTop = isDocument ? 0 : scrollContainer.getBoundingClientRect().top;
  const stickyOffset = getStickyOffset(element, scrollContainer);
  const visibleHeight = scrollContainer.clientHeight - stickyOffset;
  const centerOffset = alignment === "center" ? Math.max(0, (visibleHeight - getContentHeight(element)) / 2) : 0;
  const start = scrollContainer.scrollTop;
  const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const target = Math.min(
    maxScrollTop,
    Math.max(0, start + element.getBoundingClientRect().top - containerTop - stickyOffset - centerOffset)
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
