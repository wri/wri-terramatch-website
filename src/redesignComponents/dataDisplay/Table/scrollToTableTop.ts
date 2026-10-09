const isVerticallyScrollable = (node: HTMLElement) => {
  const { overflowY } = getComputedStyle(node);
  return (overflowY === "auto" || overflowY === "scroll") && node.scrollHeight > node.clientHeight;
};

const findVerticalScrollContainer = (node: HTMLElement): HTMLElement => {
  let parent = node.parentElement;
  while (parent != null) {
    if (isVerticallyScrollable(parent)) return parent;
    parent = parent.parentElement;
  }
  return document.documentElement;
};

const findStickyAncestor = (node: Element | null, container: HTMLElement, table: HTMLElement) => {
  let current = node;
  while (current != null && current !== container && !table.contains(current)) {
    if (current instanceof HTMLElement && getComputedStyle(current).position === "sticky") return current;
    current = current.parentElement;
  }
  return null;
};

const getVisibleTop = (container: HTMLElement, table: HTMLElement, x: number) => {
  let top = container === document.documentElement ? 0 : container.getBoundingClientRect().top;
  let sticky = findStickyAncestor(document.elementFromPoint(x, top + 1), container, table);
  while (sticky != null && sticky.getBoundingClientRect().bottom > top) {
    top = sticky.getBoundingClientRect().bottom;
    sticky = findStickyAncestor(document.elementFromPoint(x, top + 1), container, table);
  }
  return top;
};

export const scrollToTableTop = (table: HTMLElement) => {
  const container = findVerticalScrollContainer(table);
  const { top, left } = table.getBoundingClientRect();
  const visibleTop = getVisibleTop(container, table, left + 1);
  if (top >= visibleTop) return;
  container.scrollBy({ top: top - visibleTop, behavior: "smooth" });
};
