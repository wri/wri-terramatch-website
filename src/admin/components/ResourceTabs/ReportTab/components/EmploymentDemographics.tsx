import { useT } from "@transifex/react";
import { FC } from "react";

import { GrdTitleEmployment, GridsContentReport, GridsTitleReport } from "../GridsReportContent";
import HeaderSecReportGemeration from "../HeaderSecReportGemeration";
import { ReportData } from "../types";

interface EmploymentDemographicsProps {
  reportData: ReportData;
}

const EmploymentDemographics: FC<EmploymentDemographicsProps> = ({ reportData }) => {
  const t = useT();
  return (
    <div className="section-container">
      <HeaderSecReportGemeration title={t("Employment Opportunities Created by Demographics")} />
      <div className="grid grid-cols-8 divide-y divide-black/10 border-b border-black/10">
        <GrdTitleEmployment />

        <GridsTitleReport title={t("Full-Time Jobs Created")} className="col-span-3" />
        <GridsContentReport content={reportData.employment.demographics.fullTime.total.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.fullTime.male.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.fullTime.female.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.fullTime.youth.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.fullTime.nonYouth.toLocaleString()} />

        <GridsTitleReport title={t("Part-Time Jobs Created")} className="col-span-3" />
        <GridsContentReport content={reportData.employment.demographics.partTime.total.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.partTime.male.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.partTime.female.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.partTime.youth.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.partTime.nonYouth.toLocaleString()} />

        <GridsTitleReport title={t("Volunteers Created")} className="col-span-3" />
        <GridsContentReport content={reportData.employment.demographics.volunteers.total.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.volunteers.male.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.volunteers.female.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.volunteers.youth.toLocaleString()} />
        <GridsContentReport content={reportData.employment.demographics.volunteers.nonYouth.toLocaleString()} />
      </div>
    </div>
  );
};

export default EmploymentDemographics;
