import { Slider as WriSlider } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Slider: FC<ComponentProps<typeof WriSlider>> = props => <WriSlider {...props} />;

export default Slider;
