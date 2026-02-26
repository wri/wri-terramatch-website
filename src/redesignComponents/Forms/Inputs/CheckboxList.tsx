import { CheckboxList as WriCheckboxList } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const CheckboxList: FC<ComponentProps<typeof WriCheckboxList>> = props => <WriCheckboxList {...props} />;

export default CheckboxList;
