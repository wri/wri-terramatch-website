import { FC } from "react";
import { useShowContext } from "react-admin";

import Text from "@/components/elements/Text/Text";

import HeaderSecReportGemeration from "../HeaderSecReportGemeration";
import ReportDoughnutChart from "../ReportDoughnutChart";
import { ReportData } from "../types";

interface ProjectGoalsProps {
  reportData: ReportData;
}

const ProjectGoals: FC<ProjectGoalsProps> = ({ reportData }) => {
  const { record } = useShowContext();

  return (
    <div className="section-container h-full">
      <HeaderSecReportGemeration title="Project and Goals" />
      <div className="grid h-[calc(100%-2rem)] grid-cols-3 border-b border-black/10">
        <div className="flex h-full items-center justify-center">
          <ReportDoughnutChart
            label="Trees Planted"
            currentValue={record.treesPlantedCount}
            goalValue={record.treesGrownGoal}
            description={
              <div>
                <Text variant="text-12-bold" as="span" className="text-center leading-[normal] text-darkCustom">
                  {record.treesPlantedCount.toLocaleString()}
                </Text>
                &nbsp;
                <Text variant="text-10-light" as="span" className="text-center leading-[normal] text-darkCustom">
                  of {record.treesGrownGoal.toLocaleString()}
                </Text>
              </div>
            }
            color="#27A9E0"
          />
        </div>

        <div className="flex h-full items-center justify-center">
          <ReportDoughnutChart
            label="Hectares Restored"
            currentValue={record.totalHectaresRestoredSum}
            goalValue={record.totalHectaresRestoredGoal}
            description={
              <div>
                <Text variant="text-12-bold" as="span" className="text-center leading-[normal] text-darkCustom">
                  {record.totalHectaresRestoredSum.toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })}
                </Text>
                &nbsp;
                <Text variant="text-10-light" as="span" className="text-center leading-[normal] text-darkCustom">
                  of{" "}
                  {record.totalHectaresRestoredGoal.toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  })}{" "}
                  ha
                </Text>
              </div>
            }
            color="#27A9E0"
          />
        </div>
        <div className="flex h-full items-center justify-center">
          <ReportDoughnutChart
            label="Jobs Created"
            currentValue={record.totalJobsCreated}
            goalValue={record.totalJobsCreated}
            description={
              <div>
                <Text variant="text-10-bold" className="text-center leading-[normal] text-darkCustom">
                  {reportData.project.jobs.fullTime} Full-time
                </Text>
                <Text variant="text-10-bold" className="text-center leading-[normal] text-darkCustom">
                  {reportData.project.jobs.partTime} Part-time
                </Text>
              </div>
            }
            color="#27A9E0"
            hidePercentage
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectGoals;
