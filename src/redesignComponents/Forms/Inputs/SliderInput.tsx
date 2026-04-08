import { SliderInput as WriSliderInput } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const SliderInput: FC<ComponentProps<typeof WriSliderInput>> = props => <WriSliderInput {...props} />;

export default SliderInput;
