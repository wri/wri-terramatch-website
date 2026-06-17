import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo } from "react";

import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { useModalContext } from "@/context/modal.provider";
import { ProjectReportFullDto, SiteReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { formatMonthYear } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";
import { EntityName } from "@/types/common";

import DateRange from "../components/DateRange";
import SeparatorDot from "../components/SeparatorDot";
import PageHeader from "../PageHeader";

export interface ReportHeaderProps {
  report: ProjectReportFullDto | SiteReportFullDto;
  title: string;
  dueAt?: string | null;
  entityName: EntityName;
}

const ReportHeader: FC<ReportHeaderProps> = ({ report, title, dueAt, entityName }) => {
  const t = useT();
  const router = useRouter();
  const { openModal } = useModalContext();

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(entityName, report.uuid);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: entityName as EntityName,
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus
  });

  const needMoreInformation =
    report.updateRequestStatus === NEEDS_MORE_INFORMATION || report.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval = report.updateRequestStatus === AWAITING_APPROVAL || report.status === AWAITING_APPROVAL;
  const statusProps = useMemo(() => getStatusProps(t, report, report.status), [t, report]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval && statusProps != null) {
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps}
          feedback={report.feedback}
          needMoreInformation={needMoreInformation}
          entityName="projectReports"
          entityUuid={report.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [awaitingApproval, handleEdit, needMoreInformation, openModal, report.feedback, report.uuid, statusProps]);

  return (
    <>
      <PageHeader title={title} />
      <Box gapX={4} px={6} py={5} justifyContent="space-between" className="mobile:flex-col">
        <Flex gap={2} direction="column">
          <Text
            textStyle="400"
            color="neutral.900"
            className="-ml-[0.5rem] flex items-center gap-2 mobile:w-full mobile:max-w-full mobile:overflow-x-auto"
          >
            <Button
              variant="borderless"
              size="small"
              className="-mr-2"
              onClick={() => report.projectUuid != null && router.push(`/project/${report.projectUuid}`)}
            >
              {report.projectName ?? "—"}
            </Button>
            <SeparatorDot />
            <Button
              variant="borderless"
              size="small"
              className="-ml-2"
              onClick={() => report.organisationUuid != null && router.push(`/organization/${report.organisationUuid}`)}
            >
              {report.organisationName ?? "—"}
            </Button>
          </Text>
          <DateRange
            startDate={formatMonthYear(dueAt ?? report.dueAt)}
            endDate={formatMonthYear(report.updatedAt)}
            startDateLabel="Due:"
            endDateLabel="Last updated:"
          />
          <Flex gap={2} className="items-center" mb={2.5}>
            <Text textStyle="300" color="neutral.800" lineHeight="normal">
              {t("Submitted by:")}
            </Text>
            {report.createdByFirstName !== null && report.createdByLastName !== null ? (
              <>
                <Avatar
                  ariaLabel={`${report.createdByFirstName} ${report.createdByLastName} avatar`}
                  name={`${report.createdByFirstName} ${report.createdByLastName}`}
                  size="small"
                />
                <Text textStyle="400-bold" color="neutral.900" lineHeight="normal">
                  {report.createdByFirstName} {report.createdByLastName}
                </Text>
              </>
            ) : (
              <Text textStyle="400" color="neutral.600" lineHeight="normal">
                —
              </Text>
            )}
          </Flex>
          <Flex gap={2} alignItems="flex-start" className="mobile:w-full">
            <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={handleEditClick}>
              {t("Edit")}
            </Button>
            <Button
              variant="secondary"
              size="small"
              leftIcon={<DownloadIcon />}
              onClick={handleExport}
              loading={exportLoader}
            >
              {t("Download")}
            </Button>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default ReportHeader;
