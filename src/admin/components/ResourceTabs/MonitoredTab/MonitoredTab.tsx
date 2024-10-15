import { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import Input from "@/components/elements/Inputs/Input/Input";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  return (
    <TabbedShowLayout.Tab label={label ?? "Monitored Data"} {...rest}>
      <div className="flex w-full gap-4">
        <div className="w-1/5">
          Map
          <Input
            name="email"
            type="text"
            label="Polygon Name"
            variant={"login"}
            required={false}
            placeholder=" "
            id="email"
            labelClassName="opacity-50 text-blueCustom-700 origin-left
              transition-transform duration-[0.3s,color] delay-[0.3s]
              absolute label-login text-14-light normal-case"
            classNameContainerInput="!mt-0"
            classNameError="!mt-0"
          />
        </div>
        <div>Analysis is due for 345 Polygons for this project. Please run analysis.</div>
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default MonitoredTab;
