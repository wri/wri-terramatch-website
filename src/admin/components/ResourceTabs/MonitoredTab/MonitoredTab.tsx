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
        <div className="flex w-1/5 flex-col gap-4">
          <div className="relative overflow-hidden rounded-lg">
            <img src="/images/map-img.png" alt="Monitored" />
            <div className="absolute z-10 flex content-center ">
              <button className="rounded-full bg-white px-2 py-1 text-primary">View Map</button>
            </div>
          </div>
          <Input
            name="email"
            type="text"
            label="Polygon Name"
            variant={"monitored"}
            required={false}
            placeholder=" "
            id="email"
            labelClassName="capitalize text-14 mb-2"
            classNameContainerInput="!mt-0"
            containerClassName="flex flex-col gap-1.5"
            classNameError="!mt-0"
          />
        </div>
        <div>Analysis is due for 345 Polygons for this project. Please run analysis.</div>
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default MonitoredTab;
