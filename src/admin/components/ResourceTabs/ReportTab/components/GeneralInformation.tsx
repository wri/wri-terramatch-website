import { FC } from "react";
import { useShowContext } from "react-admin";

import { GridsContentReport } from "../GridsReportContent";
import { GridsTitleReport } from "../GridsReportContent";
import HeaderSecReportGemeration from "../HeaderSecReportGemeration";
import { BeneficiaryData, ReportData } from "../types";

interface GeneralInformationProps {
  beneficiaryData: BeneficiaryData;
  reportData: ReportData;
}

const GeneralInformation: FC<GeneralInformationProps> = ({ beneficiaryData, reportData }) => {
  const { record } = useShowContext();

  return (
    <div className="section-container">
      <HeaderSecReportGemeration title="General" />
      <div className="grid grid-cols-2 divide-y divide-black/10 border-b border-black/10">
        <GridsTitleReport title="Organization Name" />
        <GridsContentReport content={record.organisationName} />
        <GridsTitleReport title="Project Name" />
        <GridsContentReport content={record.name} />
        <GridsTitleReport title="Number of sites" />
        <GridsContentReport content={record.totalSites} />
        <GridsTitleReport title="Most recent survival rate" />
        <GridsContentReport
          content={reportData?.metrics?.survivalRate ? `${reportData?.metrics?.survivalRate}%` : "-"}
        />
        <GridsTitleReport title="Total direct beneficiaries" />
        <GridsContentReport content={beneficiaryData.beneficiaries} />
        <GridsTitleReport title="Total smallholder farmers engaged" />
        <GridsContentReport content={beneficiaryData.farmers} />
      </div>
    </div>
  );
};

export default GeneralInformation;
