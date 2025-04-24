import { Card, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { useShowContext } from "react-admin";

import ReportDoughnutChart from "../ReportDoughnutChart";
import { ReportData } from "../types";

interface ProjectGoalsProps {
  reportData: ReportData;
}

const ProjectGoals: FC<ProjectGoalsProps> = ({ reportData }) => {
  const { record } = useShowContext();

  return (
    <div className="section-container">
      <Typography variant="h6" component="h4" sx={{ marginBottom: 2 }}>
        Project and Goals
      </Typography>

      <Grid container spacing={3} className="metrics-container">
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ReportDoughnutChart
              label="Trees Planted"
              currentValue={record.treesPlantedCount}
              goalValue={record.treesGrownGoal}
              description={`${record.treesPlantedCount.toLocaleString()} of ${record.treesGrownGoal.toLocaleString()}`}
              color="#2196F3"
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ReportDoughnutChart
              label="Hectares Restored"
              currentValue={record.totalHectaresRestoredSum}
              goalValue={record.totalHectaresRestoredGoal}
              description={`${record.totalHectaresRestoredSum.toLocaleString(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })} of ${record.totalHectaresRestoredGoal.toLocaleString(undefined, {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              })} ha`}
              color="#2196F3"
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ReportDoughnutChart
              label="Jobs Created"
              currentValue={record.totalJobsCreated}
              goalValue={record.totalJobsCreated}
              description={`FT: ${reportData.project.jobs.fullTime} / PT: ${reportData.project.jobs.partTime}`}
              color="#2196F3"
              hidePercentage
            />
          </Card>
        </Grid>
      </Grid>

      <table
        style={{ width: "100%", marginBottom: "20px", borderCollapse: "collapse", display: "none" }}
        className="print-only-table"
      >
        <thead>
          <tr>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>Trees Planted</th>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>Hectares Restored</th>
            <th style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>Jobs Created</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "15px", textAlign: "center", border: "1px solid #ddd" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>{reportData.project.trees.percentage}%</div>
              <div>
                {reportData.project.trees.planted} / {reportData.project.trees.goal}
              </div>
            </td>
            <td style={{ padding: "15px", textAlign: "center", border: "1px solid #ddd" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>{reportData.project.hectares.percentage}%</div>
              <div>
                {reportData.project.hectares.restored} / {reportData.project.hectares.goal}
              </div>
            </td>
            <td style={{ padding: "15px", textAlign: "center", border: "1px solid #ddd" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {reportData.project.jobs.fullTime + reportData.project.jobs.partTime}
              </div>
              <div>
                FT: {reportData.project.jobs.fullTime} / PT: {reportData.project.jobs.partTime}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProjectGoals;
