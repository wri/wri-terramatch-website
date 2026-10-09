import { FC } from "react";

export const BASE_FONT_SIZE = 16;

export const RESPONSIVE_FONT_SIZES = [
  { minWidth: 1800, fontSize: 18 },
  { minWidth: 2400, fontSize: 22 },
  { minWidth: 3700, fontSize: 26 }
] as const;

const RESPONSIVE_TYPOGRAPHY_CSS = RESPONSIVE_FONT_SIZES.map(
  ({ minWidth, fontSize }) => `@media (min-width: ${minWidth}px) { html { font-size: ${fontSize}px; } }`
).join("\n");

const ResponsiveTypography: FC = () => <style data-responsive-typography>{RESPONSIVE_TYPOGRAPHY_CSS}</style>;

export default ResponsiveTypography;
