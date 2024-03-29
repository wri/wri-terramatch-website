/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sx: "460px",
        "screen-height-sm": { raw: "(max-height: 768px)" }
      },
      width: {
        "fit-content": "fit-content"
      },
      spacing: {
        0.75: "0.1875rem",
        1.75: "0.4375rem",
        3.5: "0.875rem",
        4.5: "1.125rem",
        6.5: "1.625rem",
        13: "3.25rem",
        15: "3.75rem",
        21: "5.25rem",
        25: "6.25rem",
        26: "6.5rem",
        29: "7.25rem",
        30: "7.5rem"
      },
      borderOpacity: {
        12: "0.12"
      },
      backgroundImage: {
        imageOverlayGradient: "linear-gradient(270deg, rgba(0, 0, 0, 0.31) 0%, rgba(0, 0, 0, 0.66) 100%)"
      }
    },
    colors: {
      transparent: "transparent",
      black: "#000000",
      white: "#FFFFFF",
      background: "#F5F7FA",
      primary: {
        DEFAULT: "#27A9E0",
        500: "#27A9E0",
        400: "#4EBBEA",
        300: "#98CEED",
        200: "#CEE6F4",
        100: "#F2FAFD",
        50: "#F5F7F9"
      },
      secondary: {
        DEFAULT: "#8CC63F",
        500: "#8CC63F",
        400: "#BFE372",
        300: "#DFF5B0",
        200: "#E8F4CE",
        100: "#F6FDF2"
      },
      success: {
        DEFAULT: "#009344",
        500: "#009344",
        400: "#9EDD8F",
        300: "#C7ECC4",
        200: "#E0F3E9",
        100: "#EFF9F4"
      },
      neutral: {
        DEFAULT: "#9B9B9B",
        1000: "#000000",
        900: "#3A3A3A",
        800: "#5A5A5A",
        700: "#737373",
        600: "#888888",
        500: "#9B9B9B",
        400: "#B1B1B1",
        300: "#D8D8D8",
        200: "#E3E3E3",
        150: "#F5F7F9",
        100: "#F2F2F2",
        50: "#FAFAFA"
      },
      tertiary: {
        DEFAULT: "#F0AB00",
        500: "#F0AB00",
        400: "#F3C148",
        300: "#F6D279",
        200: "#FAEAC1",
        100: "#FDFAF2"
      },
      error: {
        DEFAULT: "#D50000",
        500: "#D50000",
        400: "#F5B5B5",
        300: "#F9D7D7",
        200: "#FBE6E6",
        100: "#FFF2F2"
      }
    },

    boxShadow: {
      DEFAULT: "0px 4px 16px rgba(0, 0, 0, 0.12)",
      "t-secondary": "0px -1px 0 #8CC63F" //to add additional border, secondary-500 1px
    },
    fontFamily: {
      primary: ["Acumin Pro"],
      secondary: ["Georgia"]
    },
    fontSize: {
      xs: "0.75rem", //12px
      sm: "0.875rem", //14px
      base: "1rem", //16px
      md: "1.125rem", //18px
      lg: "1.25rem", //20px
      xl: "1.5rem", //24px
      "2xl": "1.625rem", //26px
      "3xl": "1.75rem", //28px
      "4xl": "2.25rem", //36px
      "5xl": "2.5rem" //40px
    },
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
      square: "square"
    },
    backgroundImage: {
      ppc: "url('/images/ppc.webp')",
      greenLeaves: "url('/images/green-leaves.webp')",
      heroBanner: "url('/images/bg-hero-banner.webp')",
      heroBanner2: "url('/images/bg-hero-banner-2.webp')",
      pitchPlaceholder: "url('/images/pitch-placeholder.webp')",
      taskList: "url('/images/bg-task-list.webp'), linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
      landAcceleratorThumb: "url('/images/land-accelerator-thumb.webp')",
      landAcceleratorAfricaThumb: "url('/images/land-accelerator-africa-thumb.webp')",
      terrafundRFPThumb: "url('/images/tarrafund-rfp-thumb.webp')",
      landingPageHeroBanner: "url('/images/landing-page-hero-banner.webp')",
      terrafundAfr100: "url('/images/terrafund-afr-100.webp')",
      support: "url('/images/support.webp')",
      leavesWithOverlay: "url('/images/leaves-with-overlay.webp')",
      treesHeaderWithOverlay:
        "linear-gradient(270deg, rgba(0, 0, 0, 0.31) 0%, rgba(0, 0, 0, 0.66) 100%), url('/images/trees-header.webp')"
    }
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@headlessui/tailwindcss")({ prefix: "ui" }),
    require("@tailwindcss/forms")
  ],
  safelist: [
    {
      pattern: /(bg|text|border)-(primary|secondary|tertiary|neutral|success|error)/
    },
    {
      pattern:
        /(bg|text|border)-(primary|secondary|tertiary|neutral|success|error)-(50|100|150|200|300|400|500|600|800|900|1000)/
    },
    {
      pattern: /(bg|text|border)-(white|black)/
    },
    {
      pattern: /font-(regular|bold)/
    },
    {
      pattern: /text-(xs|sm|base|md|lg)/
    }
  ]
};
