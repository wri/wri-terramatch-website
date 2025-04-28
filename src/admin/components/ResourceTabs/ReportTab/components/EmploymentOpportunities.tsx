import classNames from "classnames";
import { FC } from "react";

import Text from "@/components/elements/Text/Text";

import HeaderSecReportGemeration from "../HeaderSecReportGemeration";
import ReportPieChart from "../ReportPieChart";
import { ReportData } from "../types";

interface EmploymentOpportunitiesProps {
  reportData: ReportData;
}

const EmploymentOpportunities: FC<EmploymentOpportunitiesProps> = ({ reportData }) => {
  const total =
    reportData.employment.fullTimeJobs + reportData.employment.partTimeJobs + reportData.employment.volunteers;

  const chartData = [
    { name: "Full Time Jobs created", value: reportData.employment.fullTimeJobs, color: "#F59E0C" },
    { name: "Part Time Jobs created", value: reportData.employment.partTimeJobs, color: "#FACC14" },
    { name: "Volunteers created", value: reportData.employment.volunteers, color: "#15B8A6" }
  ];

  return (
    <div className="section-container h-fit grid-cols-3 border-b border-black/10">
      <HeaderSecReportGemeration title="Employment Opportunities Created" />

      <div className="grid grid-cols-2 gap-y-6 gap-x-2 py-6">
        <ReportPieChart
          data={{
            fullTime: reportData.employment.fullTimeJobs,
            partTime: reportData.employment.partTimeJobs,
            volunteers: reportData.employment.volunteers
          }}
        />
        <div className="flex flex-col justify-center">
          <div className="flex w-fit flex-col pr-4">
            {chartData.map((entry, index) => (
              <div
                key={`legend-${index}`}
                className={classNames("flex items-center justify-between border-b border-black/20 ", {
                  "!border-b-2 !border-black": index === chartData.length - 1
                })}
              >
                <div className="flex items-center gap-0.5">
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: entry.color, WebkitPrintColorAdjust: "exact" }}
                  />
                  <Text variant={"text-10-light"} className="px-2 py-2 leading-[normal] text-black">
                    {entry.name}
                  </Text>
                </div>
                <Text variant={"text-10-light"} className="px-2 py-2 leading-[normal] text-black">
                  {entry.value.toLocaleString()}
                </Text>
              </div>
            ))}
            <div className="flex items-center justify-end text-end">
              <Text variant={"text-10-bold"} className="px-2 py-2 text-end leading-[normal] text-black">
                {total.toLocaleString()}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploymentOpportunities;
