import { useMediaQuery } from "@mui/material";
import { useT } from "@transifex/react";

const useGetReportingTasksTourSteps = (dep?: any) => {
  const t = useT();
  const isLgDisplay = useMediaQuery("(min-width:1024px)");

  return [
    {
      title: t("Submit"),
      content: t("Use this button to submit all the reporting tasks you have completed."),
      target: "#submit-button",
      disableBeacon: true,
      offset: isLgDisplay ? 60 : 30,
      disableScrolling: true
    },
    {
      title: t("Nothing to Report"),
      content: t("Click this button to indicate that there is nothing to report for this task."),
      target: "#nothing-to-report-button-0",
      disableBeacon: true,
      offset: isLgDisplay ? 60 : 30
    }
  ];
};
export default useGetReportingTasksTourSteps;
