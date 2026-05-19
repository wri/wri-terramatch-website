import { RefObject, useCallback, useEffect, useRef, useState } from "react";

const MAX_LINES = 3;
const CHECK_DELAY = 0;

export interface UseClampedTextReturn {
  descriptionRef: RefObject<HTMLParagraphElement | null>;
  isClamped: boolean;
  isExpanded: boolean;
  toggleExpand: () => void;
}

export const useClampedText = (description: string | undefined, maxLines: number = MAX_LINES): UseClampedTextReturn => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const checkClamped = useCallback(() => {
    if (descriptionRef.current != null) {
      const element = descriptionRef.current;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
      const maxHeight = lineHeight * maxLines;
      const isCurrentlyClamped = element.scrollHeight > maxHeight;
      setIsClamped(isCurrentlyClamped);
    }
  }, [maxLines]);

  useEffect(() => {
    if (description != null) {
      const timeoutId = setTimeout(checkClamped, CHECK_DELAY);
      window.addEventListener("resize", checkClamped);
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("resize", checkClamped);
      };
    }
  }, [description, isExpanded, checkClamped]);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return {
    descriptionRef,
    isClamped,
    isExpanded,
    toggleExpand
  };
};
