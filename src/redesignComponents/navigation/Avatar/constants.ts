export type AvatarSize = "small" | "medium" | "large";

// Size mapping in rem (16px = 1rem)
export const AVATAR_SIZE_MAP: Record<AvatarSize, string> = {
  small: "1.5625rem", // 25px
  medium: "2.375rem", // 38px
  large: "3rem" // 48px
};

// Icon size mapping for "add" variant (chakra boxSize)
export const AVATAR_ICON_SIZE_MAP: Record<AvatarSize, number> = {
  small: 4,
  medium: 6,
  large: 8
};
