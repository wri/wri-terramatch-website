import { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import DataCard from "./components/DataCard";
import HeaderMonitoredTab from "./components/HeaderMonitoredTab";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  return (
    <TabbedShowLayout.Tab label={label ?? "Monitored Data"} {...rest}>
      <div className="flex w-full flex-col gap-4 p-3">
        <HeaderMonitoredTab />
        <DataCard />
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default MonitoredTab;
