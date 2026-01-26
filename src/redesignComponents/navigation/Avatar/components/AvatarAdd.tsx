import { UserAdd } from "@/redesignComponents/foundations/Icons/UserAdd";

import { AVATAR_ICON_SIZE_MAP } from "../constants";
import { StyledAvatarWrapper } from "../styled";

interface AvatarAddProps {
  size: "small" | "medium";
  finalSize: string;
  onClick?: () => void;
  ariaLabel?: string;
  customBackgroundColor?: string;
}

export const AvatarAdd = ({ size, finalSize, onClick, ariaLabel, customBackgroundColor }: AvatarAddProps) => {
  return (
    <StyledAvatarWrapper
      className={`avatar-small pointer-events-auto flex cursor-pointer items-center justify-center rounded-full avatar-${size} avatar-add bg-theme-neutral-200 disabled:cursor-default disabled:opacity-50`}
      onClick={onClick}
      aria-label={ariaLabel}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        width: finalSize,
        height: finalSize,
        backgroundColor: customBackgroundColor || "#E5E7EB"
      }}
    >
      <UserAdd boxSize={AVATAR_ICON_SIZE_MAP[size]} className="text-theme-neutral-700" />
    </StyledAvatarWrapper>
  );
};

export default AvatarAdd;
