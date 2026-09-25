import { FocusEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { fieldFocusRingStyles } from "./HighLevelSelector.styles";

const MENU_ITEM_SELECTOR = '[role="option"][tabindex="0"]';
const MENU_NAVIGATION_KEYS = new Set(["ArrowDown", "ArrowUp", "Home", "End"]);

const handleMenuItemKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  if (event.key === "Tab") {
    event.stopPropagation();
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") return;

  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.click();
};

export const getMenuItemKeyboardProps = (disabled = false) => ({
  onKeyDown: disabled ? undefined : handleMenuItemKeyDown,
  tabIndex: disabled ? -1 : 0
});

export const handleMenuContentKeyDown = (event: KeyboardEvent<HTMLElement>) => {
  if (!MENU_NAVIGATION_KEYS.has(event.key)) return;

  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR));
  if (items.length === 0) return;

  const activeIndex = items.indexOf(document.activeElement as HTMLElement);
  const highlightedIndex = items.findIndex(item => item.hasAttribute("data-highlighted"));
  const currentIndex = activeIndex >= 0 ? activeIndex : highlightedIndex;

  let nextIndex = currentIndex;
  if (event.key === "ArrowDown") nextIndex = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, items.length - 1);
  if (event.key === "ArrowUp") nextIndex = currentIndex < 0 ? items.length - 1 : Math.max(currentIndex - 1, 0);
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = items.length - 1;

  const nextItem = items[nextIndex];
  event.preventDefault();
  window.requestAnimationFrame(() => nextItem.focus());
};

export const useAutocompleteMenuNavigation = (open: boolean) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const transferringFocus = useRef(false);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Tab" || event.shiftKey || !open) return;

    const firstItem = contentRef.current?.querySelector<HTMLElement>(MENU_ITEM_SELECTOR);
    if (!firstItem) return;

    transferringFocus.current = true;
    event.preventDefault();
    firstItem.focus();
    window.requestAnimationFrame(() => {
      transferringFocus.current = false;
    });
  };

  const shouldKeepMenuOpen = (nextOpen: boolean) => !nextOpen && transferringFocus.current;

  return { contentRef, handleInputKeyDown, shouldKeepMenuOpen };
};

const POINTER_EVENTS = ["pointerdown", "mousedown", "touchstart"] as const;

const isNavigationKeyDown = (event: globalThis.KeyboardEvent) => !event.metaKey && !event.altKey && !event.ctrlKey;

export const useKeyboardFocusRing = () => {
  const keyboardModality = useRef(false);
  const [showFocusRing, setShowFocusRing] = useState(false);

  useEffect(() => {
    const handlePointer = () => {
      keyboardModality.current = false;
      setShowFocusRing(false);
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (isNavigationKeyDown(event)) keyboardModality.current = true;
    };

    POINTER_EVENTS.forEach(type => window.addEventListener(type, handlePointer, true));
    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      POINTER_EVENTS.forEach(type => window.removeEventListener(type, handlePointer, true));
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, []);

  return {
    focusRingStyles: showFocusRing ? fieldFocusRingStyles : undefined,
    rootFocusProps: {
      onBlurCapture: () => setShowFocusRing(false),
      onFocusCapture: (event: FocusEvent<HTMLElement>) => {
        const isFieldFocusTarget = (event.target as HTMLElement).hasAttribute("data-selector-focus-target");
        setShowFocusRing(isFieldFocusTarget && keyboardModality.current);
      }
    }
  };
};
