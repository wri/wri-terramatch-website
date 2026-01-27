import { Avatar as WriAvatar } from "@worldresources/wri-design-systems";
import { FC } from "react";

import AvatarAdd from "./components/AvatarAdd";
import { AVATAR_SIZE_MAP } from "./constants";
import { StyledAvatarWrapper } from "./styled";

export interface AvatarProps {
  name: string;
  ariaLabel?: string;
  size?: "small" | "medium";
  customSize?: string;
  src?: string;
  srcSet?: string;
  onClick?: () => void;
  notificationCount?: number;
  disabled?: boolean;
  customBackgroundColor?: string;
  variant?: "default" | "add";
}

const Avatar: FC<AvatarProps> = props => {
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

  const finalSize = customSize ?? AVATAR_SIZE_MAP[size];

  if (variant === "add") {
    return (
      <AvatarAdd
        size={size}
        finalSize={finalSize}
        onClick={onClick}
        ariaLabel={ariaLabel}
        customBackgroundColor={customBackgroundColor}
      />
    );
  }

  return (
    <StyledAvatarWrapper className={`avatar-wrapper avatar-${size}`}>
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
    </StyledAvatarWrapper>
  );
};

export default Avatar;
