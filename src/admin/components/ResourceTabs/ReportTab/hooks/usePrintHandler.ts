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

  /**
   * Create debug print button (in development mode only)
   */
  const addDebugPrintButton = () => {
    useEffect(() => {
      if (process.env.NODE_ENV !== "development") {
        return;
      }

      const printButton = document.createElement("button");
      printButton.textContent = "Print Report (Debug)";
      printButton.style.position = "fixed";
      printButton.style.bottom = "20px";
      printButton.style.right = "20px";
      printButton.style.zIndex = "9999";
      printButton.style.padding = "10px";
      printButton.style.backgroundColor = "#f0f0f0";
      printButton.style.border = "1px solid #ccc";
      printButton.style.borderRadius = "4px";
      printButton.style.cursor = "pointer";

      printButton.addEventListener("click", handlePrint);
      document.body.appendChild(printButton);

      return () => {
        if (document.body.contains(printButton)) {
          document.body.removeChild(printButton);
        }
      };
    }, []);
  };

  return {
    handlePrint,
    addDebugPrintButton
  };
};
