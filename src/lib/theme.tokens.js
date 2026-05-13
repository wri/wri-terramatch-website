/** @type {Record<string, Record<string | number, string>>} */
const colors = {
  neutral: {
    100: "#FFFFFF",
    200: "#F6F6F6",
    300: "#E7E6E6",
    400: "#C9C9C9",
    500: "#B0B0B0",
    600: "#A1A1A1",
    700: "#5C5959",
    800: "#3D3B3B",
    900: "#1A1919"
  },
  primary: {
    100: "#F7FBFD",
    200: "#E7F7FD",
    300: "#CCECFA",
    400: "#9AD9F4",
    500: "#78CAED",
    600: "#50B6E2",
    700: "#11688D",
    800: "#08445E",
    900: "#032230"
  },
  secondary: {
    100: "#FAFDF7",
    200: "#F2FBE4",
    300: "#E6F7CF",
    400: "#CCEBA2",
    500: "#ABDC6A",
    600: "#8ECA3F",
    700: "#477010",
    800: "#284206",
    900: "#162602",
    neutral: "#E9F1ED"
  },
  success: {
    100: "#EBF5F2",
    200: "#D3EED1",
    300: "#C2E5DC",
    500: "#009E77",
    900: "#00664D"
  },
  warning: {
    100: "#FBF7EA",
    200: "#E3CC8F",
    300: "#EEDDA5",
    500: "#A88100",
    900: "#715804"
  },
  error: {
    100: "#FFEFED",
    150: "#FFE3DF",
    200: "#EDA1A9",
    300: "#F6C5C1",
    500: "#C11101",
    900: "#8D0D01"
  },
  negative: {
    1: "#E72828",
    2: "#D40909"
  },
  attention: {
    1: "#FFC506",
    2: "#CE8303"
  },
  positive: {
    1: "#18CD49",
    2: "#2AA04A"
  },
  neutralActive: {
    1: "#0096FA",
    2: "#298ED2",
    3: "#7485F7"
  },
  neutralPassive: {
    1: "#C9C9C9",
    2: "#8D8D8D"
  },
  accessible: {
    "text-on-primary-mids": "#032230",
    "text-on-secondary-mids": "#F7FBFD",
    "controls-on-neutral-lights": "#11688D",
    "controls-on-neutral-darks": "#CCECFA"
  }
};

module.exports = { colors };
