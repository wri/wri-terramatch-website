export type AvatarSize = "small" | "medium" | "large";

export const AVATAR_SIZE_MAP: Record<AvatarSize, string> = {
  small: "1.5625rem",
  medium: "2.375rem",
  large: "3rem"
};

// Icon size mapping for "add" variant (chakra boxSize)
export const AVATAR_ICON_SIZE_MAP: Record<AvatarSize, number> = {
  small: 4,
  medium: 6,
  large: 8
};
