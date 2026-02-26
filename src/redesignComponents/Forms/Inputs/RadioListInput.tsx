import { RadioList as WriRadioList } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const RadioListInput: FC<ComponentProps<typeof WriRadioList>> = props => <WriRadioList {...props} />;

export default RadioListInput;
