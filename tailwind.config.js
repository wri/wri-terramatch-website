/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sx: "460px",
        small: "1350px",
        "screen-height-sm": { raw: "(max-height: 768px)" },
        md: "1400px",
        wide: "2500px",
        lg: "1900px",
        sm: "1200px",
        mobile: { max: "1200px" }
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
        imageOverlayGradient: "linear-gradient(270deg, rgba(0, 0, 0, 0.31) 0%, rgba(0, 0, 0, 0.66) 100%)",
        "square-pattern": "url('/icons/ic-bg.svg')",
        "back-map": "url('/icons/bg-map.svg')",
        dash: "url('/icons/dash.svg')",
        tree: "url('/images/tree.png')",
        "about-us-header": "url(/images/about-us-header.png)"
      },
      gridTemplateColumns: {
        1: "repeat(1, minmax(0, 1fr))",
        2: "repeat(2, minmax(0, 1fr))",
        3: "repeat(3, minmax(0, 1fr))",
        4: "repeat(4, minmax(0, 1fr))",
        5: "repeat(5, minmax(0, 1fr))",
        6: "repeat(6, minmax(0, 1fr))",
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        9: "repeat(9, minmax(0, 1fr))",
        10: "repeat(10, minmax(0, 1fr))",
        11: "repeat(11, minmax(0, 1fr))",
        12: "repeat(12, minmax(0, 1fr))",
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
        17: "repeat(17, minmax(0, 1fr))"
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
        350: "#6BBFCC",
        300: "#98CEED",
        250: "#C5FCFF",
        200: "#E5F8FF",
        100: "#F2FAFD"
      },
      secondary: {
        DEFAULT: "#8CC63F",
        600: "#7BBD31",
        500: "#8CC63F",
        400: "#BFE372",
        300: "#DFF5B0",
        200: "#E8F4CE",
        100: "#F6FDF2"
      },
      success: {
        DEFAULT: "#009344",
        600: "#29C499",
        500: "#009344",
        450: "#3BAE5B",
        410: "#27E045",
        400: "#9EDD8F",
        300: "#C7ECC4",
        200: "#E0F3E9",
        100: "#EFF9F4",
        40: "#a9e7d6"
      },
      neutral: {
        DEFAULT: "#9B9B9B",
        1000: "#000000",
        900: "#3A3A3A",
        800: "#5A5A5A",
        700: "#737373",
        650: "#747070",
        600: "#888888",
        500: "#9B9B9B",
        400: "#B1B1B1",
        480: "#C4C4C4",
        450: "#CCD4D6",
        300: "#D8D8D8",
        250: "#F7F7F7",
        200: "#E3E3E3",
        150: "#F5F7F9",
        100: "#F2F2F2",
        70: "#eeeff0",
        50: "#FAFAFA",
        40: "#f2f4f5"
      },
      tertiary: {
        DEFAULT: "#F0AB00",
        800: "#795305",
        650: "#FF8838",
        600: "#FF8938",
        550: "#FFA160",
        500: "#F0AB00",
        400: "#F3C148",
        300: "#F6D279",
        200: "#FAEAC1",
        100: "#FDFAF2",
        80: "#ffa060",
        50: "#FFF4EC"
      },
      error: {
        DEFAULT: "#D50000",
        600: "#FF4040",
        500: "#D50000",
        400: "#F5B5B5",
        300: "#F9D7D7",
        200: "#FBE6E6",
        100: "#FFF2F2"
      },
      blueCustom: {
        DEFAULT: "#13487A",
        900: "#002633",
        700: "#092C3C",
        600: "#33525c",
        250: "#11093C",
        200: "#E6E9EC",
        100: "#cfe6f4",
        50: "#f1fafd",
        30: "#ebf0f4",
        10: "#eaf7fc"
      },
      darkCustom: {
        DEFAULT: "#353535",
        300: "#525866",
        200: "#84959D",
        150: "#5D5D59",
        100: "#637579",
        60: "#35353599",
        50: "#697A7F",
        40: "#919EAB"
      },
      pinkCustom: {
        DEFAULT: "#E468EF",
        300: "#BF7589",
        200: "#FDF0FE"
      },
      purpleCustom: {
        DEFAULT: "#5674C5",
        1000: "#6C3BAA",
        500: "#4249E6",
        100: "#8096D3",
        60: "#ddddfb",
        50: "#ededfd"
      },
      grey: {
        100: "#F4F4F4",
        200: "#F0F2F2",
        350: "#E6E6E6",
        500: "#676D71",
        600: "#797A7B",
        700: "#868686",
        720: "#94A3A8",
        735: "#CECECE",
        730: "#B8C3C6",
        740: "#E0E0E0",
        750: "#E6EAEB",
        800: "#E9EDF0",
        850: "#F0F3FA",
        900: "#F6FAFD",
        925: "#F7F9FA",
        950: "#ebebeb",
        1000: "#DFE3E8"
      },
      blue: {
        DEFAULT: "#2398D8",
        50: "#0079FF",
        100: "#1B59F8",
        200: "#E9F5FC"
      },
      green: {
        DEFAULT: "#72D961",
        600: "#7BBD31",
        500: "#198E2B",
        400: "#1BA631",
        200: "#0b463e",
        100: "#28C499",
        60: "#24555C",
        50: "rgba(40, 196, 153, 0.10)",
        40: "#A2DCB3",
        35: "#B9B942",
        30: "#EAFAF5"
      },
      yellow: {
        DEFAULT: "#FCFBE8",
        700: "#F4B059",
        600: "#F8CE7B",
        550: "#F7D913",
        500: "#F3EFB0",
        300: "#FEF8EF"
      },
      red: {
        DEFAULT: "#FF6464",
        100: "#CBC8D2",
        200: "#E42222",
        300: "#D33838",
        900: "#8D2D0E",
        1000: "#632424"
      }
    },
    boxShadow: {
      DEFAULT: "0px 4px 16px rgba(0, 0, 0, 0.12)",
      all: "0 4px 6px rgba(0, 0, 0, 0.1), 0 -4px 4px rgba(0, 0, 0, 0.06)",
      "t-secondary": "0px -1px 0 #8CC63F", //to add additional border, secondary-500 1px
      none: "0 0 #0000",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      monitored: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      input: "0 0 0 3px #047CD740",
      "item-monitored": "rgba(3, 102, 214, 0.3) 0px 0px 0px 3px",
      table: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px",
      dashboard: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
      top: "0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)"
    },
    dropShadow: {
      table: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px"
    },
    fontFamily: {
      primary: ["Inter"],
      secondary: ["Georgia"]
    },
    fontSize: {
      xs: "0.75rem", //12px
      sm: "0.875rem", //14px
      base: "1rem", //16px
      md: "1.125rem", //18px
      lg: "1.25rem", //20px
      "2lg": "1.375rem", //22px
      xl: "1.5rem", //24px
      "2xl": "1.625rem", //26px
      "3xl": "1.75rem", //28px
      "3xx": "2rem", //32px
      "4xl": "2.25rem", //36px
      "5xl": "2.5rem", //40px
      //Wide extra
      "6xl": "2.75rem", //44px
      "7xl": "3rem", //48px
      "8xl": "3.5rem", //56px
      "13xl": "4.5rem", //72px
      "14xl": "4.75rem", //76px
      "15xl": "5rem" //80px
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
        "linear-gradient(270deg, rgba(0, 0, 0, 0.31) 0%, rgba(0, 0, 0, 0.66) 100%), url('/images/trees-header.webp')",
      mapsImg: "url('/images/Maps.svg')",
      dashboardHeader: 'url("/images/dashboard-header.webp")',
      impactStoryBg: 'url("/images/Impact Story - Landing Page.png")',
      tabScrollLeft: 'url("/images/mask.png")',
      tabScrollRight: 'url("/images/maskRight.png")',
      mask: 'url("/images/mask.png")'
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
