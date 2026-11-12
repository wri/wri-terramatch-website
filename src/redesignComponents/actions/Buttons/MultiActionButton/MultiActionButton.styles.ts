import type { SystemStyleObject } from "@chakra-ui/react";

export const secondaryTextColorClass = "!text-theme-neutral-800";

// WRI puts `className` on the main button, not on the `role="group"` root, so the root is stretched from outside.
export const fullWidthGroupCss: SystemStyleObject = {
  "& > [role='group']": { flex: "1 1 auto" }
};
