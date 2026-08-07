import { Slider as WriSlider } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Slider: FC<ComponentProps<typeof WriSlider>> = ({ ...rest }) => {
  return <WriSlider {...rest} />;
};

export default Slider;
