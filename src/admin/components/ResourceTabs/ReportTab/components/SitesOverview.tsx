import { Typography } from "@mui/material";
import { FC } from "react";

import { tableStyles } from "../styles/printStyles";
import { Site } from "../types";

interface SitesOverviewProps {
  sites: Site[];
}

const SitesOverview: FC<SitesOverviewProps> = ({ sites }) => {
  return (
    <div className="print-page-break section-container">
      <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
        Sites
      </Typography>

      <table style={{ ...tableStyles.table, borderCollapse: "collapse" as const }}>
        <thead>
          <tr>
            <th style={{ ...tableStyles.headerCell, textAlign: "left" as const }}>Site Name</th>
            <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Hectare Goal</th>
            <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Hectares Under Restoration</th>
            <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Total Disturbances</th>
            <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Climatic</th>
            <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Man-made</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site, index) => (
            <tr key={index}>
              <td style={{ ...tableStyles.cell, textAlign: "left" as const }}>{site.name}</td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {site.hectaresToRestoreGoal.toLocaleString()}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {site.totalHectaresRestoredSum?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {site.totalReportedDisturbances}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {site.climaticDisturbances}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {site.manmadeDisturbances}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SitesOverview;
