import { twMerge } from "tailwind-merge";

import { UserAddIcon } from "@/redesignComponents/foundations/Icons";

import { AVATAR_ICON_SIZE_MAP, AvatarSize } from "../constants";

interface AvatarAddProps {
  size: AvatarSize;
  finalSize: number | string;
  onClick?: () => void;
  ariaLabel?: string;
  customBackgroundColor?: string;
  className?: string;
}

export const AvatarAdd = ({
  size,
  finalSize,
  onClick,
  ariaLabel,
  customBackgroundColor,
  className
}: AvatarAddProps) => {
  return (
    <div
      className={twMerge(
        "pointer-events-auto flex cursor-pointer items-center justify-center rounded-full border border-solid border-theme-neutral-500 bg-theme-neutral-200 transition-[opacity,transform] duration-200",
        "hover:opacity-80 active:scale-95",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-primary-700",
        "disabled:cursor-default disabled:opacity-50",
        className
      )}
      onClick={onClick}
      aria-label={ariaLabel}
      role={onClick != null ? "button" : undefined}
      tabIndex={onClick != null ? 0 : undefined}
      style={{
        width: finalSize,
        height: finalSize,
        backgroundColor: customBackgroundColor
      }}
    >
      <UserAddIcon boxSize={AVATAR_ICON_SIZE_MAP[size]} className="text-theme-neutral-700" />
    </div>
  );
};

export default AvatarAdd;
