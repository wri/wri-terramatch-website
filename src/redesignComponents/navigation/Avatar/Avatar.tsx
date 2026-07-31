import { Avatar as WriAvatar } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

import AvatarAdd from "./components/AvatarAdd";
import { AVATAR_SIZE_MAP, AvatarSize } from "./constants";

type WriAvatarProps = ComponentProps<typeof WriAvatar>;

export interface AvatarProps extends WriAvatarProps {
  variant?: "default" | "add";
  className?: string;
  size?: AvatarSize;
}

const Avatar: FC<AvatarProps> = ({
  variant = "default",
  className,
  size = "medium",
  customSize,
  onClick,
  ariaLabel,
  customBackgroundColor,
  ...props
}) => {
  if (variant === "add") {
    return (
      <AvatarAdd
        size={size}
        finalSize={customSize ?? AVATAR_SIZE_MAP[size]}
        onClick={onClick}
        ariaLabel={ariaLabel}
        customBackgroundColor={customBackgroundColor}
        className={className}
      />
    );
  }

  const avatar = (
    <WriAvatar
      {...props}
      size={size}
      customSize={customSize}
      onClick={onClick}
      ariaLabel={ariaLabel}
      customBackgroundColor={customBackgroundColor}
    />
  );

  return className ? <div className={className}>{avatar}</div> : avatar;
};

export default Avatar;
