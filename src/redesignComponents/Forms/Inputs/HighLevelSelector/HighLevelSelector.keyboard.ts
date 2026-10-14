import { FocusEvent, useEffect, useRef, useState } from "react";

import { fieldFocusRingStyles } from "./HighLevelSelector.styles";

type MenuNavSource = "keyboard" | "pointer";

const POINTER_EVENTS = ["pointerdown", "mousedown", "touchstart"] as const;

const isNavigationKeyDown = (event: globalThis.KeyboardEvent) => !event.metaKey && !event.altKey && !event.ctrlKey;

export const useKeyboardFocusRing = () => {
  const keyboardModality = useRef(false);
  const [showFocusRing, setShowFocusRing] = useState(false);
  const [menuNavSource, setMenuNavSource] = useState<MenuNavSource>("pointer");

  useEffect(() => {
    const handlePointer = () => {
      keyboardModality.current = false;
      setShowFocusRing(false);
      setMenuNavSource("pointer");
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!isNavigationKeyDown(event)) return;

      keyboardModality.current = true;
      setMenuNavSource("keyboard");
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
    menuContentProps: {
      "data-nav-source": menuNavSource,
      onPointerMove: () => setMenuNavSource("pointer")
    },
    rootFocusProps: {
      onBlurCapture: () => setShowFocusRing(false),
      onFocusCapture: (event: FocusEvent<HTMLElement>) => {
        const isFieldFocusTarget = (event.target as HTMLElement).hasAttribute("data-selector-focus-target");
        setShowFocusRing(isFieldFocusTarget && keyboardModality.current);
      }
    }
  };
};

export type MenuContentProps = ReturnType<typeof useKeyboardFocusRing>["menuContentProps"];
