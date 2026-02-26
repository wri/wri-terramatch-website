import { RadioList as WriRadioList } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const RadioList: FC<ComponentProps<typeof WriRadioList>> = props => <WriRadioList {...props} />;

export default RadioList;
