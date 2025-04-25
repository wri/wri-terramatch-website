import { FC } from "react";

import HeaderSecReportGemeration from "../HeaderSecReportGemeration";
import ReportPieChart from "../ReportPieChart";
import { ReportData } from "../types";

interface EmploymentOpportunitiesProps {
  reportData: ReportData;
}

const EmploymentOpportunities: FC<EmploymentOpportunitiesProps> = ({ reportData }) => {
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
      </div>
    </div>
  );
};

export default EmploymentOpportunities;
