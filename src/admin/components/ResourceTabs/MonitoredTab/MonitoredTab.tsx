import { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import DataCard from "./components/DataCard";
import HeaderMonitoredTab from "./components/HeaderMonitoredTab";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  // const openRunAnalysis = () => {
  //   openModal(
  //     ModalId.MODAL_RUN_ANALYSIS,
  //     <ModalRunAnalysis
  //       title="Run Analysis "
  //       content="Project Developers may submit one or all polygons for review."
  //       primaryButtonText="Submit"
  //       primaryButtonProps={{
  //         className: "px-8 py-3",
  //         variant: "primary",
  //         onClick: () => {
  //           closeModal(ModalId.MODAL_RUN_ANALYSIS);
  //         }
  //       }}
  //       onClose={() => closeModal(ModalId.MODAL_RUN_ANALYSIS)}
  //       secondaryButtonText="Cancel"
  //       secondaryButtonProps={{
  //         className: "px-8 py-3",
  //         variant: "white-page-admin",
  //         onClick: () => closeModal(ModalId.MODAL_RUN_ANALYSIS)
  //       }}
  //     />
  //   );
  // };

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
