export const LANDSCAPE_MAPPINGS = {
  "Greater Rift Valley of Kenya": "grv",
  "Ghana Cocoa Belt": "gcb",
  "Lake Kivu & Rusizi River Basin": "ikr"
} as const;

export type LandscapeName = keyof typeof LANDSCAPE_MAPPINGS;
export type LandscapeCode = (typeof LANDSCAPE_MAPPINGS)[LandscapeName];

export const CODE_TO_NAME_MAPPING = Object.fromEntries(
  Object.entries(LANDSCAPE_MAPPINGS).map(([name, code]) => [code, name])
) as Record<LandscapeCode, LandscapeName>;

export const LANDSCAPE_OPTIONS = Object.keys(LANDSCAPE_MAPPINGS).map(name => ({
  title: name,
  value: name
}));

export const convertNamesToCodes = (names: string[]): LandscapeCode[] => {
  return names.map(name => LANDSCAPE_MAPPINGS[name as LandscapeName] ?? name).filter(isValidLandscapeCode);
};

export const convertCodesToNames = (codes: string[]): string[] => {
  return codes.map(code => CODE_TO_NAME_MAPPING[code as LandscapeCode] ?? code);
};

export const isValidLandscapeName = (name: string): name is LandscapeName => {
  return name in LANDSCAPE_MAPPINGS;
};

export const isValidLandscapeCode = (code: string): code is LandscapeCode => {
  return code in CODE_TO_NAME_MAPPING;
};
