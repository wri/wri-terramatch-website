import { FC } from "react";

import { BASE_FONT_SIZE, RESPONSIVE_FONT_SIZES } from "./ResponsiveTypography";

const LAYOUT_CHROME_SCALE_CSS = RESPONSIVE_FONT_SIZES.map(
  ({ minWidth, fontSize }) =>
    `@media (min-width: ${minWidth}px) { html:not(:has(style[data-responsive-typography])) { --layout-chrome-zoom: ${
      fontSize / BASE_FONT_SIZE
    }; } }`
).join("\n");

const LayoutChromeScale: FC = () => <style>{LAYOUT_CHROME_SCALE_CSS}</style>;

export default LayoutChromeScale;
