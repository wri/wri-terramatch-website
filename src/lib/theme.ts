import { createSystem, defineTextStyles } from "@chakra-ui/react";
import { drawerSlotRecipe } from "@chakra-ui/react/theme";
import { designSystemStyles } from "@worldresources/wri-design-systems";

import { colors as rawColors } from "./theme.tokens.js";

type RawTokenGroup = Record<string | number, string>;
type ChakraToken = { value: string };
type ChakraTokenGroup = Record<string | number, ChakraToken>;

// Wrap each leaf string in Chakra's { value } token shape while keeping the
// same source-of-truth values from `theme.tokens.js` (also consumed by Tailwind).
const wrapTokenGroup = (group: RawTokenGroup): ChakraTokenGroup =>
  Object.fromEntries(Object.entries(group).map(([k, v]) => [k, { value: v }]));

const wrappedColors = Object.fromEntries(
  Object.entries(rawColors as Record<string, RawTokenGroup>).map(([k, v]) => [k, wrapTokenGroup(v)])
) as Record<keyof typeof rawColors, ChakraTokenGroup>;

const themeConfig = {
  tokens: {
    colors: wrappedColors,
    shadows: {
      200: {
        value: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)"
      }
    },
    fontSizes: {
      "1100": { value: "3.75rem" }, // 60px
      "1000": { value: "3rem" }, // 48px
      "900": { value: "2.25rem" }, // 36px
      "800": { value: "1.875rem" }, // 30px
      "700": { value: "1.5rem" }, // 24px
      "600": { value: "1.25rem" }, // 20px
      "500": { value: "1.125rem" }, // 18px
      "400": { value: "1rem" }, // 16px
      "300": { value: "0.875rem" }, // 14px
      "200": { value: "0.75rem" }, // 12px
      "50": { value: "0.5rem" } // 8px
    },
    lineHeights: {
      "1200": { value: "4.5rem" }, // 72px
      "1100": { value: "3.75rem" }, // 60px
      "1000": { value: "2.75rem" }, // 44px
      "900": { value: "2.25rem" }, // 36px
      "800": { value: "2rem" }, // 32px
      "700": { value: "1.75rem" }, // 28px
      "600": { value: "1.5rem" }, // 24px
      "500": { value: "1.25rem" }, // 20px
      "400": { value: "1rem" }, // 16px
      "300": { value: "0.75rem" }, // 12px
      "100": { value: "0.5rem" } // 8px
    }
  },
  textStyles: defineTextStyles({
    "1100": {
      description: "Headline text style - (60px font, 72px line height)",
      value: {
        fontSize: "1100",
        lineHeight: "1200",
        fontWeight: "normal"
      }
    },
    "1100-bold": {
      description: "Headline text style - (60px font, 72px line height, bold)",
      value: {
        fontSize: "1100",
        lineHeight: "1200",
        fontWeight: "bold"
      }
    },
    "1000": {
      description: "Headline text style - (48px font, 60px line height)",
      value: {
        fontSize: "1000",
        lineHeight: "1100",
        fontWeight: "normal"
      }
    },
    "1000-bold": {
      description: "Headline text style - (48px font, 60px line height, bold)",
      value: {
        fontSize: "1000",
        lineHeight: "1100",
        fontWeight: "bold"
      }
    },
    "900": {
      description: "Headline text style - (36px font, 44px line height)",
      value: {
        fontSize: "900",
        lineHeight: "1000",
        fontWeight: "normal"
      }
    },
    "900-bold": {
      description: "Headline text style - (36px font, 44px line height, bold)",
      value: {
        fontSize: "900",
        lineHeight: "1000",
        fontWeight: "bold"
      }
    },
    "800": {
      description: "Headline text style - (39px font, 36px line height)",
      value: {
        fontSize: "800",
        lineHeight: "900",
        fontWeight: "normal"
      }
    },
    "800-bold": {
      description: "Headline text style - (39px font, 36px line height, bold)",
      value: {
        fontSize: "800",
        lineHeight: "900",
        fontWeight: "bold"
      }
    },
    "700": {
      description: "Subtitle text style - (24px font, 32px line height)",
      value: {
        fontSize: "700",
        lineHeight: "800",
        fontWeight: "normal"
      }
    },
    "700-bold": {
      description: "Subtitle text style - (24px font, 32px line height, bold)",
      value: {
        fontSize: "700",
        lineHeight: "800",
        fontWeight: "bold"
      }
    },
    "600": {
      description: "Subtitle text style - (20px font, 28px line height)",
      value: {
        fontSize: "600",
        lineHeight: "700",
        fontWeight: "normal"
      }
    },
    "600-bold": {
      description: "Subtitle text style - (20px font, 28px line height, bold)",
      value: {
        fontSize: "600",
        lineHeight: "700",
        fontWeight: "bold"
      }
    },
    "500": {
      description: "Body text style - (18px font, 28px line height)",
      value: {
        fontSize: "500",
        lineHeight: "700",
        fontWeight: "normal"
      }
    },
    "500-bold": {
      description: "Body text style - (18px font, 28px line height, bold)",
      value: {
        fontSize: "500",
        lineHeight: "700",
        fontWeight: "bold"
      }
    },
    "400": {
      description: "Body text style - (16px font, 24px line height)",
      value: {
        fontSize: "400",
        lineHeight: "600",
        fontWeight: "normal"
      }
    },
    "400-bold": {
      description: "Body text style - (16px font, 24px line height, bold)",
      value: {
        fontSize: "400",
        lineHeight: "600",
        fontWeight: "bold"
      }
    },
    "300": {
      description: "Caption text style - (14px font, 20px line height)",
      value: {
        fontSize: "300",
        lineHeight: "500",
        fontWeight: "normal"
      }
    },
    "300-bold": {
      description: "Caption text style - (14px font, 20px line height, bold)",
      value: {
        fontSize: "300",
        lineHeight: "500",
        fontWeight: "bold"
      }
    },
    "200": {
      description: "Caption text style - (12px font, 16px line height)",
      value: {
        fontSize: "200",
        lineHeight: "400",
        fontWeight: "normal"
      }
    },
    "200-bold": {
      description: "Caption text style - (12px font, 16px line height, bold)",
      value: {
        fontSize: "200",
        lineHeight: "400",
        fontWeight: "bold"
      }
    },
    "50": {
      description: "Caption text style - (8px font, 8px line height)",
      value: {
        fontSize: "50",
        lineHeight: "100",
        fontWeight: "normal"
      }
    },
    "50-bold": {
      description: "Caption text style - (8px font, 8px line height, bold)",
      value: {
        fontSize: "50",
        lineHeight: "100",
        fontWeight: "bold"
      }
    }
  }),
  slotRecipes: {
    drawer: {
      ...drawerSlotRecipe,
      variants: {
        ...drawerSlotRecipe.variants,
        size: {
          ...(drawerSlotRecipe.variants?.size ?? {}),
          filterPanel: {
            content: {
              maxW: "22rem"
            }
          }
        }
      }
    }
  }
};

export const system = createSystem(designSystemStyles._config, {
  theme: themeConfig
});

type FontSizeToken = keyof typeof themeConfig.tokens.fontSizes;
type LineHeightToken = keyof typeof themeConfig.tokens.lineHeights;

export const getThemedFontSize = (token: FontSizeToken): string => {
  return themeConfig.tokens.fontSizes[token]?.value ?? "";
};

export const getThemedLineHeight = (token: LineHeightToken): string => {
  return themeConfig.tokens.lineHeights[token]?.value ?? "";
};

export const getThemedColor = (
  variant:
    | "neutral"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "accessible"
    | "neutralActive"
    | "neutralPassive"
    | "negative"
    | "attention"
    | "positive",
  index:
    | 1
    | 2
    | 3
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | "text-on-primary-mids"
    | "text-on-secondary-mids"
    | "controls-on-neutral-lights"
    | "controls-on-neutral-darks"
): string => {
  const designSystemColor = designSystemStyles.tokens.getVar(`colors.${variant}.${index}`);
  if (designSystemColor) return designSystemColor;

  const colorVariant = themeConfig.tokens.colors[variant];
  if (colorVariant && index in colorVariant) {
    return (colorVariant as Record<string | number, { value: string }>)[index]?.value ?? "";
  }

  return "";
};
