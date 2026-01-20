import "./Avatar.css";

import { Avatar as WriAvatar } from "@worldresources/wri-design-systems";

import { UserAdd } from "@/redesignComponents/foundations/Icons/UserAdd";

import { AVATAR_ICON_SIZE_MAP, AVATAR_SIZE_MAP } from "./constants";

export interface AvatarProps {
  name: string;
  ariaLabel?: string;
  size?: "small" | "medium" | "large";
  customSize?: string;
  src?: string;
  srcSet?: string;
  onClick?: () => void;
  notificationCount?: number;
  disabled?: boolean;
  customBackgroundColor?: string;
  variant?: "default" | "add";
}

const Avatar = (props: AvatarProps) => {
  const {
    name,
    ariaLabel,
    size = "medium",
    customSize,
    src,
    srcSet,
    onClick,
    notificationCount,
    disabled,
    customBackgroundColor,
    variant = "default"
  } = props;

  // Use customSize if provided, otherwise use the mapped size
  const finalSize = customSize || AVATAR_SIZE_MAP[size];

  // Render "add" variant with UserAdd icon
  if (variant === "add") {
    return (
      <div
        className={`avatar-wrapper avatar-${size} avatar-add pointer-events-auto flex cursor-pointer items-center justify-center rounded-full bg-theme-neutral-200 opacity-100 disabled:cursor-default disabled:opacity-50`}
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
      </div>
    );
  }

  // Render default avatar
  return (
    <div className={`avatar-wrapper avatar-${size}`}>
      <WriAvatar
        name={name}
        ariaLabel={ariaLabel}
        size={size}
        customSize={finalSize}
        src={src}
        srcSet={srcSet}
        onClick={onClick}
        notificationCount={notificationCount}
        disabled={disabled}
        customBackgroundColor={customBackgroundColor}
      />
    </div>
  );
};

export default Avatar;
