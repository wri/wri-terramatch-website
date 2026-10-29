import { easeInOutCubic, prefersReducedMotion, TABLE_TRANSITION_MS } from "./tableTransition";

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

const getStickyBottom = (element: Element): number => {
  const { display, position, top } = getComputedStyle(element);
  if (display === "contents") return Math.max(0, ...Array.from(element.children, getStickyBottom));
  if (position !== "sticky") return 0;
  const stickyTop = parseFloat(top);
  return (Number.isNaN(stickyTop) ? 0 : stickyTop) + element.getBoundingClientRect().height;
};

const getStickyOffset = (element: HTMLElement, scrollContainer: HTMLElement) => {
  let offset = 0;
  for (let node: HTMLElement | null = element; node != null && node !== scrollContainer; node = node.parentElement) {
    for (let sibling = node.previousElementSibling; sibling != null; sibling = sibling.previousElementSibling) {
      offset = Math.max(offset, getStickyBottom(sibling));
    }
  }
  return offset;
};

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
