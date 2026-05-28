import { useCallback, useEffect, useRef, useState } from "react";

const CLAMP_THRESHOLD_PX = 1;

export interface UseClampedTextReturn {
  descriptionRef: React.RefObject<HTMLParagraphElement>;
  isClamped: boolean;
  isExpanded: boolean;
  toggleExpand: () => void;
}

export const useClampedText = (description: string | undefined): UseClampedTextReturn => {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const isMountedRef = useRef(true);

  const [isClamped, setIsClamped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const checkClamped = useCallback(() => {
    const element = descriptionRef.current;

    if (element == null) {
      return;
    }

    if (isExpanded) {
      setIsClamped(false);
      return;
    }

    const overflowPx = element.scrollHeight - element.clientHeight;

    setIsClamped(overflowPx > CLAMP_THRESHOLD_PX);
  }, [isExpanded]);

  useEffect(() => {
    isMountedRef.current = true;

    if (description == null) {
      return;
    }

    const element = descriptionRef.current;

    if (element == null) {
      return;
    }

    let rafId = 0;

    const scheduleCheck = () => {
      cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!isMountedRef.current) {
          return;
        }

        checkClamped();
      });
    };

    scheduleCheck();

    const resizeObserver = new ResizeObserver(scheduleCheck);

    resizeObserver.observe(element);

    window.addEventListener("resize", scheduleCheck);

    document.fonts?.ready
      .then(() => {
        if (isMountedRef.current) {
          scheduleCheck();
        }
      })
      .catch(() => undefined);

    return () => {
      isMountedRef.current = false;

      cancelAnimationFrame(rafId);

      resizeObserver.disconnect();

      window.removeEventListener("resize", scheduleCheck);
    };
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
