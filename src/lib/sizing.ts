const SPACE_SCALE_UNIT_REM = 0.25;

export type SizeValue = number | string;

const formatRemValue = (value: number): string => parseFloat(value.toFixed(4)).toString();

export const resolveRemSizeValue = (value: SizeValue): string => {
  if (typeof value === "number") {
    return `${formatRemValue(value * SPACE_SCALE_UNIT_REM)}rem`;
  }
  return value;
};
