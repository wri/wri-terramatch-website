import { FC } from "react";

import { GrdTitleEmployment, GridsContentReport, GridsTitleReport } from "../GridsReportContent";
import HeaderSecReportGemeration from "../HeaderSecReportGemeration";
import { ReportData } from "../types";

interface EmploymentDemographicsProps {
  reportData: ReportData;
}

const EmploymentDemographics: FC<EmploymentDemographicsProps> = ({ reportData }) => {
  return (
    <div className="section-container">
      <HeaderSecReportGemeration title="Employment Opportunities Created by Demographics" />
      <div className="grid grid-cols-8 divide-y-2 divide-black/10 border-b-2 border-black/10">
        <GrdTitleEmployment />

        <GridsTitleReport title="Full Time Jobs created" className="col-span-3" />
        <GridsContentReport content={reportData.employment.demographics.fullTime.total} />
        <GridsContentReport content={reportData.employment.demographics.fullTime.male} />
        <GridsContentReport content={reportData.employment.demographics.fullTime.female} />
        <GridsContentReport content={reportData.employment.demographics.fullTime.youth} />
        <GridsContentReport content={reportData.employment.demographics.fullTime.nonYouth} />

        <GridsTitleReport title="Part Time Jobs created" className="col-span-3" />
        <GridsContentReport content={reportData.employment.demographics.partTime.total} />
        <GridsContentReport content={reportData.employment.demographics.partTime.male} />
        <GridsContentReport content={reportData.employment.demographics.partTime.female} />
        <GridsContentReport content={reportData.employment.demographics.partTime.youth} />
        <GridsContentReport content={reportData.employment.demographics.partTime.nonYouth} />

        <GridsTitleReport title="Volunteers created" className="col-span-3" />
        <GridsContentReport content={reportData.employment.demographics.volunteers.total} />
        <GridsContentReport content={reportData.employment.demographics.volunteers.male} />
        <GridsContentReport content={reportData.employment.demographics.volunteers.female} />
        <GridsContentReport content={reportData.employment.demographics.volunteers.youth} />
        <GridsContentReport content={reportData.employment.demographics.volunteers.nonYouth} />
      </div>
    </div>
  );
};

export default EmploymentDemographics;
