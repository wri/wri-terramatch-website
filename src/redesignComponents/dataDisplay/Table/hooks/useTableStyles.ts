import { useEffect } from "react";

/**
 * Custom hook to inject styles for table sort buttons
 * Overrides Chakra UI default sort button colors
 */
export const useTableStyles = () => {
  useEffect(() => {
    const styleId = "table-sort-custom-styles";

    // Prevent duplicate style injection
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"] {
          opacity: 0.6 !important;
          transition: opacity 0.2s ease-in-out !important;
        }

        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"]:hover {
          opacity: 1 !important;
          background-color: transparent !important;
        }

        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"] svg path {
          fill: #9ca3af !important;
          transition: fill 0.2s ease-in-out !important;
        }

        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"]:hover svg path {
          fill: #27a9e0 !important;
        }

        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"][aria-pressed="true"] svg path,
        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"][data-active="true"] svg path {
          fill: #1e88c7 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
};
