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
import { FC } from "react";
import { Show, ShowButton, useShowContext } from "react-admin";

import { useLightNurseryReport, useLightProjectReport, useLightSiteReport } from "@/connections/Entity";
import {
  NurseryReportLightDto,
  ProjectReportLightDto,
  SiteReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
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

type ReportRowProps = {
  report: ProjectReportLightDto | SiteReportLightDto | NurseryReportLightDto;
  typeLabel: string;
  parentName: string;
  resource: string;
};

const ReportRow: FC<ReportRowProps> = ({ report, typeLabel, parentName, resource }) => {
  const t = useT();
  const { format } = useDate();
  return (
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
        {t(typeLabel)}
      </TableCell>
      <TableCell>{parentName}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>{t(ReadableStatus[report.status ?? ""])}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>{t(ReadableStatus[report.updateRequestStatus ?? ""])}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {report.submittedAt == null ? null : format(new Date(report.submittedAt))}
      </TableCell>
      <TableCell align="center">
        <ShowButton record={{ ...report, id: report.uuid }} resource={resource} />
      </TableCell>
    </TableRow>
  );
};

const ProjectReportRow: FC<{ uuid: string }> = ({ uuid }) => {
  const [, { entity }] = useLightProjectReport({ uuid });
  if (entity == null) return null;
  return (
    <ReportRow
      report={entity}
      typeLabel="Project Report"
      parentName={entity.projectName ?? ""}
      resource="projectReport"
    />
  );
};

const SiteReportRow: FC<{ uuid: string }> = ({ uuid }) => {
  const [, { entity }] = useLightSiteReport({ uuid });
  if (entity == null) return null;
  return <ReportRow report={entity} typeLabel="Site Report" parentName={entity.siteName ?? ""} resource="siteReport" />;
};

const NurseryReportRow: FC<{ uuid: string }> = ({ uuid }) => {
  const [, { entity }] = useLightNurseryReport({ uuid });
  if (entity == null) return null;
  return (
    <ReportRow
      report={entity}
      typeLabel="Nursery Report"
      parentName={entity.nurseryName ?? ""}
      resource="nurseryReport"
    />
  );
};

function ShowReports() {
  const { isLoading, record: task } = useShowContext();

  const t = useT();
  const { format } = useDate();

  return isLoading ? null : (
    <Card sx={{ padding: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
        {t("Project Name:")} {task.projectName}
      </Typography>
      <Typography>
        {t("Task Status:")} {t(ReadableStatus[task.status])}
      </Typography>
      <Typography>
        {t("Task Due Date:")} {format(new Date(task.dueAt))}
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
            {task.projectReportUuid && <ProjectReportRow uuid={task.projectReportUuid} />}
            {task.siteReportUuids?.map((uuid: string) => (
              <SiteReportRow key={uuid} uuid={uuid} />
            ))}
            {task.nurseryReportUuids?.map((uuid: string) => (
              <NurseryReportRow key={uuid} uuid={uuid} />
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
