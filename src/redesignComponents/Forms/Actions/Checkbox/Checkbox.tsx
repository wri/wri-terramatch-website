import { Checkbox as WriCheckbox } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

type CheckboxProps = ComponentProps<typeof WriCheckbox>;

const Checkbox: FC<CheckboxProps> = props => <WriCheckbox {...props} />;

export default Checkbox;
