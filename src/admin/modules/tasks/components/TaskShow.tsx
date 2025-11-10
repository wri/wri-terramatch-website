import { Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { grey } from "@mui/material/colors";
import { useT } from "@transifex/react";
import React, { FC, useCallback, useRef } from "react";
import { Show, ShowButton, useShowContext } from "react-admin";

import ModalBulkApprove from "@/admin/components/extensive/Modal/ModalBulkApprove";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import {
  useLightNurseryReport,
  useLightNurseryReportList,
  useLightProjectReport,
  useLightSiteReport,
  useLightSiteReportList,
  useLightSRPReport
} from "@/connections/Entity";
import { useTask } from "@/connections/Task";
import { APPROVED } from "@/constants/statuses";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  NurseryReportLightDto,
  ProjectReportLightDto,
  SiteReportLightDto,
  SrpReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
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
  report: ProjectReportLightDto | SiteReportLightDto | NurseryReportLightDto | SrpReportLightDto;
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
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        <CustomChipField label={ReadableStatus[report.status ?? ""]} />
      </TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>{t(ReadableStatus[report.updateRequestStatus ?? ""])}</TableCell>
      <TableCell sx={{ whiteSpace: "nowrap" }}>
        {report.submittedAt == null ? null : format(new Date(report.submittedAt))}
      </TableCell>
      <TableCell align="center">
        {"nothingToReport" in report && report?.nothingToReport ? (
          <Icon name={IconNames.CROSS} className="h-6 w-6" />
        ) : null}
      </TableCell>
      <TableCell align="center">
        <ShowButton record={{ ...report, id: report.uuid }} resource={resource} />
      </TableCell>
    </TableRow>
  );
};

const ProjectReportRow: FC<{ uuid: string }> = ({ uuid }) => {
  const [, { data }] = useLightProjectReport({ id: uuid });
  if (data == null) return null;
  return (
    <ReportRow report={data} typeLabel="Project Report" parentName={data.projectName ?? ""} resource="projectReport" />
  );
};

const SiteReportRow: FC<{ uuid: string }> = ({ uuid }) => {
  const [, { data }] = useLightSiteReport({ id: uuid });
  if (data == null) return null;
  return <ReportRow report={data} typeLabel="Site Report" parentName={data.siteName ?? ""} resource="siteReport" />;
};

const NurseryReportRow: FC<{ uuid: string }> = ({ uuid }) => {
  const [, { data }] = useLightNurseryReport({ id: uuid });
  if (data == null) return null;
  return (
    <ReportRow report={data} typeLabel="Nursery Report" parentName={data.nurseryName ?? ""} resource="nurseryReport" />
  );
};

const SrpReportRow: FC<{ uuid: string }> = ({ uuid }) => {
  const [, { data }] = useLightSRPReport({ id: uuid });
  if (data == null) return null;
  return <ReportRow report={data} typeLabel="SRP Report" parentName={data.projectName ?? ""} resource="srpReport" />;
};

type SelectedItem = {
  id: string;
  name: string;
  type: string;
  dateSubmitted: string;
};

function ShowReports() {
  const { isLoading, record: task } = useShowContext();
  const t = useT();
  const { format } = useDate();
  const { openModal, closeModal } = useModalContext();
  const { openNotification } = useNotificationContext();
  const [, { update: updateTask, isUpdating: taskIsUpdating, updateFailure: taskUpdateFailure }] = useTask({
    id: task?.uuid
  });

  const siteReportUuids = task?.siteReportUuids ?? [];
  const nurseryReportUuids = task?.nurseryReportUuids ?? [];
  const [, { data: siteReports = [] }] = useLightSiteReportList({ ids: siteReportUuids });
  const [, { data: nurseryReports = [] }] = useLightNurseryReportList({ ids: nurseryReportUuids });

  const selectableReports: SelectedItem[] = React.useMemo(() => {
    const reports: SelectedItem[] = [];
    siteReports.forEach((report: any) => {
      if (
        report &&
        report.status !== APPROVED &&
        report.nothingToReport === true &&
        report.updateRequestStatus === "no-update"
      ) {
        reports.push({
          id: report.uuid,
          name: report.siteName ?? report.reportTitle ?? "",
          type: "Site",
          dateSubmitted: report.submittedAt ? format(new Date(report.submittedAt)) : ""
        });
      }
    });
    nurseryReports.forEach((report: any) => {
      if (
        report &&
        report.status !== APPROVED &&
        report.nothingToReport === true &&
        report.updateRequestStatus === "no-update"
      ) {
        reports.push({
          id: report.uuid,
          name: report.nurseryName ?? report.reportTitle ?? "",
          type: "Nursery",
          dateSubmitted: report.submittedAt ? format(new Date(report.submittedAt)) : ""
        });
      }
    });
    return reports;
  }, [siteReports, nurseryReports, format]);

  const currentSelectedReportsRef = useRef<SelectedItem[]>([]);
  const openModalHandlerBulkApprove = () => {
    let currentSelectedReports: SelectedItem[] = [];
    openModal(
      ModalId.APPROVE_POLYGONS,
      <ModalBulkApprove
        title="Bulk Approve - Nothing to Report"
        data={selectableReports}
        onClose={() => closeModal(ModalId.APPROVE_POLYGONS)}
        content={`This project has indicated there is nothing to report for the following reports that were due [task due date]. Press "select all" to bulk approve these reports (you can manually adjust your selection before final approval if needed).`}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            closeModal(ModalId.APPROVE_POLYGONS);
            openModalHandlerBulkConfirm(currentSelectedReports);
          },
          disabled: selectableReports.length <= 0
        }}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.APPROVE_POLYGONS)
        }}
        primaryButtonText="Next"
        secondaryButtonText="Cancel"
        onSelectionChange={selectedIds => {
          currentSelectedReports = selectedIds;
          currentSelectedReportsRef.current = selectedIds;
        }}
      />
    );
  };

  const openModalHandlerBulkConfirm = (currentSelectedReports: SelectedItem[]) => {
    openModal(
      ModalId.CONFIRM_POLYGON_APPROVAL,
      <ModalConfirm
        className="pointer-events-auto z-[99999]"
        title={"Confirm Bulk Approval"}
        content={
          <div className="max-h-[140px] overflow-y-auto lg:max-h-[150px]">
            {currentSelectedReports.length > 0 ? (
              currentSelectedReports.map(report => (
                <li key={report.id} className="text-12-light">
                  {report.type} Report - {report.name} - {report.dateSubmitted}
                </li>
              ))
            ) : (
              <li className="text-12-light">No reports selected</li>
            )}
          </div>
        }
        commentArea
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_APPROVAL)}
        onConfirm={(text: string) => {
          const siteReportUuids = currentSelectedReports
            .filter(report => report.type === "Site")
            .map(report => report.id);
          const nurseryReportUuids = currentSelectedReports
            .filter(report => report.type === "Nursery")
            .map(report => report.id);
          if (updateTask != null) {
            updateTask({
              feedback: text ?? "",
              siteReportNothingToReportUuids: siteReportUuids,
              nurseryReportNothingToReportUuids: nurseryReportUuids
            });
          }
        }}
      />
    );
  };

  useRequestComplete(
    taskIsUpdating,
    useCallback(() => {
      if (taskUpdateFailure == null) {
        openNotification("success", "Reports approved successfully", "");
        closeModal(ModalId.CONFIRM_POLYGON_APPROVAL);
        closeModal(ModalId.APPROVE_POLYGONS);
      } else {
        openNotification("error", "Failed to approve reports", taskUpdateFailure.message ?? "An error occurred");
      }
    }, [closeModal, openNotification, taskUpdateFailure])
  );

  return isLoading ? null : (
    <Card sx={{ padding: 4 }}>
      <div className="m-6 flex items-center justify-between gap-6 rounded-2xl border border-neutral-300 px-6 py-4">
        <Text variant="text-20-bold" className="w-full leading-none">
          {task.projectName ?? "N/A"}
        </Text>
        <div className="grid shrink-0 grid-cols-3 items-center gap-y-2 gap-x-6">
          <Text variant="text-12-light" className="leading-none">
            Status
          </Text>
          <Text variant="text-12-light" className="whitespace-nowrap leading-none">
            Due Date
          </Text>
          <Text variant="text-12-light" className="whitespace-nowrap leading-none">
            Trees Planted
          </Text>
          <CustomChipField label={ReadableStatus[task.status ?? ""]} />
          <Text variant="text-14-bold" className="leading-none">
            {format(new Date(task.dueAt))}
          </Text>
          <Text variant="text-14-bold" className="leading-none">
            {task.treesPlantedCount}
          </Text>
        </div>
        <Button onClick={openModalHandlerBulkApprove} variant="primary">
          Bulk Approve &quot;Nothing to Report&quot;
        </Button>
      </div>
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Report Type")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Entity")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Status")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Change Request")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Date Submitted")}</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{t("Nothing to Report")}</TableCell>
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
            {task.srpReportUuids?.map((uuid: string) => (
              <SrpReportRow key={uuid} uuid={uuid} />
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
