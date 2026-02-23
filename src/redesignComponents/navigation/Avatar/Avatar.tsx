import { Avatar as WriAvatar } from "@worldresources/wri-design-systems";
import classNames from "classnames";
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
  className?: string;
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
    variant = "default",
    className
  } = props;

  const finalSize = customSize ?? AVATAR_SIZE_MAP[size];

  console.log("avatar:", props);

  if (variant === "add") {
    return (
      <StyledAvatarWrapper className={`avatar-wrapper avatar-${size} avatar-add`}>
        <AvatarAdd
          size={size}
          finalSize={finalSize}
          onClick={onClick}
          ariaLabel={ariaLabel}
          customBackgroundColor={customBackgroundColor}
        />
      </StyledAvatarWrapper>
    );
  }

  return (
    <StyledAvatarWrapper className={classNames(className, "avatar-wrapper avatar-${size}")}>
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
