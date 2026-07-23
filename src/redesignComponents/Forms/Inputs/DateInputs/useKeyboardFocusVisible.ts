import { useEffect } from "react";

export const KEYBOARD_FOCUS_ATTRIBUTE = "data-keyboard-focus";

let subscriberCount = 0;

const enableKeyboardFocus = (event: KeyboardEvent) => {
  // Only show focus if Tab is pressed
  if (event.key !== "Tab") return;
  document.documentElement.setAttribute(KEYBOARD_FOCUS_ATTRIBUTE, "");
};

const disableKeyboardFocus = () => {
  document.documentElement.removeAttribute(KEYBOARD_FOCUS_ATTRIBUTE);
};

// Keeps track of keyboard vs pointer interaction and updates <html> attribute
export const useKeyboardFocusVisible = (): void => {
  useEffect(() => {
    subscriberCount += 1;
    if (subscriberCount === 1) {
      window.addEventListener("keydown", enableKeyboardFocus, true);
      window.addEventListener("pointerdown", disableKeyboardFocus, true);
    }
    return () => {
      subscriberCount -= 1;
      if (subscriberCount === 0) {
        window.removeEventListener("keydown", enableKeyboardFocus, true);
        window.removeEventListener("pointerdown", disableKeyboardFocus, true);
        document.documentElement.removeAttribute(KEYBOARD_FOCUS_ATTRIBUTE);
      }
    };
  }, []);
};

export default useKeyboardFocusVisible;
