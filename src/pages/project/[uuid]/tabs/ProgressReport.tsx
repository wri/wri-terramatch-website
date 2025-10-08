import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";

import DisturbanceReportsTab from "./DisturbanceReports";
import ReportingTasksTab from "./ReportingTasks";

interface ProgressReportProps {
  projectUUID: string;
}

const ProgressReportTab = ({ projectUUID }: ProgressReportProps) => {
  const t = useT();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const subTabs = [
    {
      title: t("Progress Reports"),
      body: <ReportingTasksTab projectUUID={projectUUID} />
    },
    {
      title: t("Disturbance Reports"),
      body: <DisturbanceReportsTab projectUUID={projectUUID} />
    }
  ];

  // Map of sub-tab keys to indices
  const subTabKeys = ["progress-reports", "disturbance-reports"];

  // Get the sub-tab from URL or default to first tab
  const currentSubTab = router.query.subTab as string;
  const defaultIndex = subTabKeys.indexOf(currentSubTab);
  const activeIndex = defaultIndex >= 0 ? defaultIndex : 0;

  useEffect(() => {
    setSelectedIndex(activeIndex);
  }, [activeIndex]);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);

    // Update URL with sub-tab parameter
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          subTab: subTabKeys[index]
        }
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <div className="bg-neutral-50 pt-6 pb-0">
        <div className="mx-auto w-full max-w-[82vw] px-10 xl:px-0">
          <div className="flex w-full justify-start">
            <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
              {subTabs.map((item, index) => (
                <Button
                  key={index}
                  variant={selectedIndex === index ? "white-toggle" : "transparent-toggle"}
                  onClick={() => handleTabChange(index)}
                >
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {subTabs[selectedIndex]?.body}
    </>
  );
};

export default ProgressReportTab;
