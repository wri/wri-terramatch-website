import { FC } from "react";

import { TreeSpeciesDto } from "@/generated/v3/entityService/entityServiceSchemas";

import { BeneficiaryData, EmploymentDemographicData, ReportData, Site } from "../types";
import EmploymentOpportunities from "./EmploymentOpportunities";
import GeneralInformation from "./GeneralInformation";
import ProjectGoals from "./ProjectGoals";
import SitesOverview from "./SitesOverview";
import TreeSpeciesSection from "./TreeSpeciesSection";

interface ReportContentProps {
  beneficiaryData: BeneficiaryData;
  employmentData: EmploymentDemographicData;
  reportData: ReportData;
  sites: Site[];
  plants: TreeSpeciesDto[];
}

const ReportContent: FC<ReportContentProps> = ({ beneficiaryData, employmentData, reportData, sites, plants }) => {
  return (
    <div id="printable-report-content">
      <GeneralInformation beneficiaryData={beneficiaryData} reportData={reportData} />

      <ProjectGoals reportData={reportData} />

      <EmploymentOpportunities reportData={reportData} />

      <SitesOverview sites={sites} />

      <TreeSpeciesSection sites={sites} plants={plants} />
    </div>
  );
};

export default ReportContent;
