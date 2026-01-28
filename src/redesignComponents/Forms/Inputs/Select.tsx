import { Select as WriSelect } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Select: FC<ComponentProps<typeof WriSelect>> = props => <WriSelect {...props} />;

export default Select;
