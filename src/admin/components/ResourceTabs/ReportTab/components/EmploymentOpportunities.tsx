import { Card, Grid, Typography } from "@mui/material";
import { FC } from "react";

import ReportPieChart from "../ReportPieChart";
import { tableStyles } from "../styles/printStyles";
import { ReportData } from "../types";

interface EmploymentOpportunitiesProps {
  reportData: ReportData;
}

const EmploymentOpportunities: FC<EmploymentOpportunitiesProps> = ({ reportData }) => {
  return (
    <div className="print-page-break section-container">
      <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
        Employment Opportunities Created
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: "100%" }}>
            <ReportPieChart
              data={{
                fullTime: reportData.employment.fullTimeJobs,
                partTime: reportData.employment.partTimeJobs,
                volunteers: reportData.employment.volunteers
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}></Grid>
      </Grid>
      <div style={{ marginTop: "30px" }}>
        <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
          Employment Opportunities Created by Demographics
        </Typography>

        <table style={{ ...tableStyles.table, borderCollapse: "collapse" as const }}>
          <thead>
            <tr>
              <th style={{ ...tableStyles.headerCell, textAlign: "left" as const }}>Category</th>
              <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Total</th>
              <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Male</th>
              <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Female</th>
              <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Youth</th>
              <th style={{ ...tableStyles.headerCell, textAlign: "right" as const }}>Non-Youth</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...tableStyles.boldCell, textAlign: "left" as const }}>Full-time</td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.fullTime.total}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.fullTime.male}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.fullTime.female}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.fullTime.youth}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.fullTime.nonYouth}
              </td>
            </tr>
            <tr>
              <td style={{ ...tableStyles.boldCell, textAlign: "left" as const }}>Part-time</td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.partTime.total}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.partTime.male}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.partTime.female}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.partTime.youth}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.partTime.nonYouth}
              </td>
            </tr>
            <tr>
              <td style={{ ...tableStyles.boldCell, textAlign: "left" as const }}>Volunteers</td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.volunteers.total}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.volunteers.male}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.volunteers.female}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.volunteers.youth}
              </td>
              <td style={{ ...tableStyles.rightAlignedCell, textAlign: "right" as const }}>
                {reportData.employment.demographics.volunteers.nonYouth}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmploymentOpportunities;
