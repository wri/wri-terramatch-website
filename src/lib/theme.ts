import { createSystem, defineTextStyles } from "@chakra-ui/react";
import { drawerSlotRecipe } from "@chakra-ui/react/theme";
import { designSystemStyles } from "@worldresources/wri-design-systems";

const themeConfig = {
  tokens: {
    colors: {
      neutral: {
        100: { value: "#FFFFFF" },
        200: { value: "#F6F6F6" },
        300: { value: "#E7E6E6" },
        400: { value: "#C9C9C9" },
        500: { value: "#B0B0B0" },
        600: { value: "#A1A1A1" },
        700: { value: "#5C5959" },
        800: { value: "#3D3B3B" },
        900: { value: "#1A1919" }
      },
      primary: {
        100: { value: "#F7FBFD" },
        200: { value: "#E7F7FD" },
        300: { value: "#CCECFA" },
        400: { value: "#9AD9F4" },
        500: { value: "#78CAED" },
        600: { value: "#50B6E2" },
        700: { value: "#11688D" },
        800: { value: "#08445E" },
        900: { value: "#032230" }
      },
      secondary: {
        100: { value: "#FAFDF7" },
        200: { value: "#F2FBE4" },
        300: { value: "#E6F7CF" },
        400: { value: "#CCEBA2" },
        500: { value: "#ABDC6A" },
        600: { value: "#8ECA3F" },
        700: { value: "#477010" },
        800: { value: "#284206" },
        900: { value: "#162602" },
        neutral: { value: "#E9F1ED" }
      },
      success: {
        100: { value: "#EBF5F2" },
        200: { value: "#D3EED1" },
        300: { value: "#C2E5DC" },
        500: { value: "#009E77" },
        900: { value: "#00664D" }
      },
      warning: {
        100: { value: "#FBF7EA" },
        200: { value: "#E3CC8F" },
        300: { value: "#EEDDA5" },
        500: { value: "#A88100" },
        900: { value: "#715804" }
      },
      error: {
        100: { value: "#FFEFED" },
        150: { value: "#FFE3DF" },
        200: { value: "#EDA1A9" },
        300: { value: "#F6C5C1" },
        500: { value: "#C11101" },
        900: { value: "#8D0D01" }
      },
      negative: {
        1: { value: "#E72828" },
        2: { value: "#D40909" }
      },
      attention: {
        1: { value: "#FFC506" },
        2: { value: "#CE8303" }
      },
      positive: {
        1: { value: "#18CD49" },
        2: { value: "#2AA04A" }
      },
      neutralActive: {
        1: { value: "#0096FA" },
        2: { value: "#298ED2" },
        3: { value: "#7485F7" }
      },
      neutralPassive: {
        1: { value: "#C9C9C9" },
        2: { value: "#8D8D8D" }
      },
      accessible: {
        "text-on-primary-mids": { value: "#032230" },
        "text-on-secondary-mids": { value: "#F7FBFD" },
        "controls-on-neutral-lights": { value: "#11688D" },
        "controls-on-neutral-darks": { value: "#CCECFA" }
      }
    },
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
