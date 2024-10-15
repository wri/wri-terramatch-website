export const formatNumberUS = (value: number) =>
  value ? (value >= 1000000 ? `${(value / 1000000).toFixed(2)}M` : value.toLocaleString("en-US")) : "";
