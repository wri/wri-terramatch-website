import { FC } from "react";

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
    <div className="section-container h-full grid-cols-3 border-b-2 border-black/10">
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
          <div className="flex flex-col">
            {chartData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center text-sm">
                <div
                  className="mr-3 h-4 w-4 rounded"
                  style={{ backgroundColor: entry.color, WebkitPrintColorAdjust: "exact" }}
                />
                <span className="text-10-light px-2 py-2 leading-[normal] text-black">{entry.name}:</span>
                <span className="text-10-light px-2 py-2 leading-[normal] text-black">{entry.value}</span>
              </div>
            ))}
            <div className="mt-2 border-t border-black/20 pt-3">
              <div className="flex items-center text-sm">
                <span className="text-10-light px-2 py-2 leading-[normal] text-black">Total:</span>
                <span className="text-10-light px-2 py-2 leading-[normal] text-black">{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploymentOpportunities;
