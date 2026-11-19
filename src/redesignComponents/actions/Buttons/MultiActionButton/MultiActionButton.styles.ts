import type { SystemStyleObject } from "@chakra-ui/react";

export const secondaryTextColorClass = "!text-theme-neutral-800";

// WRI puts `className` on the main button, not on the `role="group"` root, so the root is stretched from outside.
export const fullWidthGroupCss: SystemStyleObject = {
  "& > [role='group']": { flex: "1 1 auto" }
};

// Download buttons use the brand blue for both the main action and the dropdown trigger.
export const downloadButtonGroupCss: SystemStyleObject = {
  "& button": { backgroundColor: "rgb(8, 68, 94)", borderColor: "rgb(8, 68, 94)", color: "white" },
  "& button svg": { color: "white" }
};
