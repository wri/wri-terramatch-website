import "./Avatar.css";

import { Avatar as WriAvatar } from "@worldresources/wri-design-systems";

import { UserAdd } from "@/redesignComponents/foundations/Icons/UserAdd";

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

  // Size mapping in rem (16px = 1rem)
  const sizeMap = {
    small: "1.5625rem", // 25px
    medium: "2.375rem", // 38px
    large: "3rem" // 48px
  };

  // Icon size mapping for "add" variant
  const iconSizeMap = {
    small: 4, // chakra boxSize
    medium: 6,
    large: 8
  };

  // Use customSize if provided, otherwise use the mapped size
  const finalSize = customSize || sizeMap[size];

  // Render "add" variant with UserAdd icon
  if (variant === "add") {
    return (
      <div
        className={`avatar-wrapper avatar-${size} avatar-add`}
        onClick={onClick}
        aria-label={ariaLabel}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        style={{
          width: finalSize,
          height: finalSize,
          backgroundColor: customBackgroundColor || "#E5E7EB",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: onClick ? "pointer" : "default",
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? "none" : "auto"
        }}
      >
        <UserAdd boxSize={iconSizeMap[size]} color="#6B7280" />
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
