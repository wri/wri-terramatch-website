import { FC } from "react";

import { TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";

import ResportTabHeader from "../ResportTabHeader";
import { BeneficiaryData, ReportData, Site } from "../types";
import EmploymentDemographics from "./EmploymentDemographics";
import EmploymentOpportunities from "./EmploymentOpportunities";
import GeneralInformation from "./GeneralInformation";
import ProjectGoals from "./ProjectGoals";
import SitesOverview from "./SitesOverview";
import TreeSpeciesSection from "./TreeSpeciesSection";

interface ReportContentProps {
  beneficiaryData: BeneficiaryData;
  reportData: ReportData;
  sites: Site[];
  plants: TreeSpeciesDto[];
}

const ReportContent: FC<ReportContentProps> = ({ beneficiaryData, reportData, sites, plants }) => {
  return (
    <div id="printable-report-content" className="!p-0">
      <ResportTabHeader />
      <div className="grid grid-cols-2 gap-y-6 gap-x-2 py-6">
        <GeneralInformation beneficiaryData={beneficiaryData} reportData={reportData} />

        <ProjectGoals reportData={reportData} />

        <EmploymentOpportunities reportData={reportData} />

        <EmploymentDemographics reportData={reportData} />

        <SitesOverview sites={sites} />

        <TreeSpeciesSection sites={sites} plants={plants} />
      </div>
    </div>
  );
};

export default ReportContent;
