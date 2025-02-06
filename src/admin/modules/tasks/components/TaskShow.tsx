import {
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useT } from "@transifex/react";
import { camelCase } from "lodash";
import { useMemo } from "react";
import { RaRecord, Show, ShowButton, useShowContext } from "react-admin";

import { useGetV2TasksUUIDReports } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";

const ReadableStatus: { [index: string]: string } = {
  due: "Due",
  started: "Started",
  "awaiting-approval": "Awaiting approval",
  "needs-more-information": "Needs more information",
  approved: "Approved",
  draft: "Draft",
  "no-update": "No update"
};

const ReportType: { [index: string]: string } = {
  "project-report": "Project Report",
  "site-report": "Site Report",
  "nursery-report": "Nursery Report"
};

const REPORT_SORT_ORRDER = ["project-report", "site-report", "nursery-report"];

function ShowReports() {
  const { isLoading: ctxLoading, record: task } = useShowContext();
  const { data: reportsResponse, isLoading: reportsLoading } = useGetV2TasksUUIDReports(
    {
      pathParams: { uuid: task?.uuid }
    },
    {
      enabled: !ctxLoading
    }
  );

  const reports = useMemo(() => {
    const reports = (reportsResponse?.data ?? []).map(report => ({
      ...report,
      id: report.uuid,
      resource: camelCase(report.type)
    }));
    reports.sort((reportA, reportB) => {
      const orderA = REPORT_SORT_ORRDER.indexOf(reportA.type ?? "");
      const orderB = REPORT_SORT_ORRDER.indexOf(reportB.type ?? "");
      return orderA < orderB ? -1 : orderB < orderA ? 1 : 0;
    });
    return reports;
  }, [reportsResponse]);

  const t = useT();
  const { format } = useDate();

  if (reportsLoading) return null;
  return (
    <Card sx={{ padding: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        {t("Project Name:")} {task.project.name}
      </Typography>
      <Typography>
        {t("Task Status:")} {task.readable_status}
      </Typography>
      <Typography>
        {t("Task Due Date:")} {format(new Date(task.due_at))}
      </Typography>
      <Typography>
        {t("Trees Planted:")} {task.number_of_trees_planted}
      </Typography>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Report Type")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Entity")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Status")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Change Request")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Date Submitted")}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map(report => (
              <TableRow
                key={report.uuid}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0
                  },
                  "&:nth-of-type(even)": {
                    backgroundColor: grey[200]
                  }
                }}
              >
                <TableCell sx={{ whiteSpace: "nowrap" }} component="th" scope="row">
                  {t(ReportType[report.type ?? ""])}
                </TableCell>
                <TableCell>{report.parent_name}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>{t(ReadableStatus[report.status ?? ""])}</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {t(ReadableStatus[report.update_request_status ?? ""])}
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {report.submitted_at == null ? null : format(new Date(report.submitted_at))}
                </TableCell>
                <TableCell align="center">
                  <ShowButton record={report as RaRecord} resource={report.resource} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

const TaskShow = () => (
  <Show>
    <ShowReports />
  </Show>
);

export default TaskShow;
