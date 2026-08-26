import { Combobox as WriCombobox } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Combobox: FC<ComponentProps<typeof WriCombobox>> = props => <WriCombobox {...props} />;

export default Combobox;
