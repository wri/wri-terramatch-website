import { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import { EntityName } from "@/types/common";

import DataCard from "./components/DataCard";
import HeaderMonitoredTab from "./components/HeaderMonitoredTab";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  type: EntityName;
}

const MonitoredTab: FC<IProps> = ({ label, type, ...rest }) => (
  <TabbedShowLayout.Tab label={label ?? "Monitored Data"} {...rest}>
    <div className="flex w-full flex-col gap-4 p-3">
      <HeaderMonitoredTab type={type} />
      <DataCard type={type} />
    </div>
  </TabbedShowLayout.Tab>
);

export default MonitoredTab;
