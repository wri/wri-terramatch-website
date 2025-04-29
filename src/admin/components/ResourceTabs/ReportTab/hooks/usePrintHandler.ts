import { useEffect } from "react";

import { printStyles } from "../styles/printStyles";

export const usePrintHandler = () => {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePrint();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /**
   * Trigger print operation with proper formatting
   */
  const handlePrint = () => {
    const content = document.getElementById("printable-report-content");
    if (content) {
      content.style.display = "block";
      content.style.visibility = "visible";
      content.style.height = "auto";
      content.style.overflow = "visible";

      setTimeout(() => {
        window.print();
      }, 100);
    } else {
      window.print();
    }
  };

  return {
    handlePrint
  };
};
