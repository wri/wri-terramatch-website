import { RefObject, useEffect } from "react";

export interface ActiveSort {
  key: string;
  order: string;
}

/**
 * Custom hook to inject styles for table sort buttons
 * Overrides Chakra UI default sort button colors and handles active sorting state
 * @param activeSorts - Map of column keys to their sort order (asc/desc)
 * @param tableRef - Ref to the table wrapper element
 */
export const useTableStyles = (activeSorts?: Map<string, string>, tableRef?: RefObject<HTMLDivElement>) => {
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

        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"][data-sort-active="asc"],
        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"][data-sort-active="desc"] {
          opacity: 1 !important;
        }

        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"][data-sort-active="asc"] svg path,
        .custom-table-wrapper .chakra-table__columnHeader .chakra-button[type="button"][data-sort-active="desc"] svg path {
          fill: #27a9e0 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Apply active state to sorted column buttons
  useEffect(() => {
    if (!tableRef?.current) return;

    const timeoutId = setTimeout(() => {
      const tableElement = tableRef.current;
      if (!tableElement) return;

      const allButtons = tableElement.querySelectorAll('.chakra-table__columnHeader .chakra-button[type="button"]');
      allButtons.forEach(button => {
        button.removeAttribute("data-sort-active");
      });

      if (activeSorts && activeSorts.size > 0) {
        const headers = tableElement.querySelectorAll(".chakra-table__columnHeader");

        headers.forEach(header => {
          const columnKey = header.getAttribute("data-column-key");
          const headerSpan = header.querySelector("span");
          const headerText = headerSpan?.textContent?.trim() || header.textContent?.trim();

          const sortOrder = activeSorts.get(columnKey || "") || activeSorts.get(headerText || "");

          if (sortOrder) {
            const buttons = header.querySelectorAll('.chakra-button[type="button"]');

            buttons.forEach(button => {
              const ariaLabel = button.getAttribute("aria-label")?.toLowerCase();

              if (ariaLabel === "ascending" && sortOrder === "asc") {
                button.setAttribute("data-sort-active", "asc");
              } else if (ariaLabel === "descending" && sortOrder === "desc") {
                button.setAttribute("data-sort-active", "desc");
              }
            });
          }
        });
      }
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [activeSorts, tableRef]);
};
