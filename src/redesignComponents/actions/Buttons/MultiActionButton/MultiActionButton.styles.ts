import type { SystemStyleObject } from "@chakra-ui/react";

import { getThemedColor } from "@/lib/theme";

export const secondaryTextColorClass = "!text-theme-neutral-800";

// WRI puts `className` on the main button, not on the `role="group"` root, so the root is stretched from outside.
export const fullWidthGroupCss: SystemStyleObject = {
  "& > [role='group']": { flex: "1 1 auto" }
};

// Light label and arrow for dark backgrounds. Scoped to the wrapper so it reaches both the main button and the trigger.
export const darkTypeVariantCss: SystemStyleObject = {
  "& button, & button svg": { color: `${getThemedColor("neutral", 100)} !important` },
  "& button:disabled, & button:disabled svg": { color: `${getThemedColor("neutral", 400)} !important` }
};
