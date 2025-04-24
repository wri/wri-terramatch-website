import { Typography } from "@mui/material";
import { FC } from "react";
import { useShowContext } from "react-admin";

import { tableStyles } from "../styles/printStyles";
import { BeneficiaryData } from "../types";

interface GeneralInformationProps {
  beneficiaryData: BeneficiaryData;
}

const GeneralInformation: FC<GeneralInformationProps> = ({ beneficiaryData }) => {
  const { record } = useShowContext();

  return (
    <div className="section-container">
      <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>
        Background Information for site visit
      </Typography>

      <div className="section-container">
        <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
          General
        </Typography>

        <table style={{ ...tableStyles.table, borderCollapse: "collapse" as const }}>
          <tbody>
            <tr>
              <td style={{ ...tableStyles.boldCell, width: "25%", textAlign: "left" as const }}>Organization Name:</td>
              <td style={tableStyles.cell}>{record.organisationName}</td>
              <td style={{ ...tableStyles.boldCell, width: "25%", textAlign: "left" as const }}>Project name:</td>
              <td style={tableStyles.cell}>{record.name}</td>
            </tr>
            <tr>
              <td style={{ ...tableStyles.boldCell, textAlign: "left" as const }}>Number of sites:</td>
              <td style={tableStyles.cell}>{record.totalSites}</td>
              <td style={{ ...tableStyles.boldCell, textAlign: "left" as const }}>Most recent survival rate:</td>
              <td style={tableStyles.cell}>{80}%</td>
            </tr>
            <tr>
              <td style={{ ...tableStyles.boldCell, textAlign: "left" as const }}>Total direct beneficiaries:</td>
              <td style={tableStyles.cell}>{beneficiaryData.beneficiaries}</td>
              <td style={{ ...tableStyles.boldCell, textAlign: "left" as const }}>
                Total smallholder farmers engaged:
              </td>
              <td style={tableStyles.cell}>{beneficiaryData.farmers}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralInformation;
