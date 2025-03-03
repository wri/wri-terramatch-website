import React from "react";

import Dropdown, { DropdownProps } from "@/components/elements/Inputs/Dropdown/Dropdown";

import BlurContainer from "./BlurContainer";

interface BlurContainerMobileProps extends DropdownProps {
  className?: string;
  disabled?: boolean;
  isMobile?: boolean;
}

const ResponsiveDropdownContainer = (props: BlurContainerMobileProps) => {
  const { className, disabled, isMobile, ...rest } = props;
  return isMobile ? (
    <Dropdown {...rest} />
  ) : (
    <BlurContainer className={className} disabled={disabled}>
      <Dropdown {...rest} />
    </BlurContainer>
  );
};

export default ResponsiveDropdownContainer;
