import { createSystem } from "@chakra-ui/react";
import { designSystemStyles } from "@worldresources/wri-design-systems";

export const system = createSystem(designSystemStyles._config, {
  theme: {
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
          900: { value: "#162602" }
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
          200: { value: "#EDA1A9" },
          300: { value: "#F6C5C1" },
          500: { value: "#C11101" },
          900: { value: "#8D0D01" }
        },
        accessible: {
          "text-on-primary-mids": { value: "#032230" },
          "text-on-secondary-mids": { value: "#F7FBFD" },
          "controls-on-neutral-lights": { value: "#477010" },
          "controls-on-neutral-darks": { value: "#284206" }
        }
      }
    }
  }
});
