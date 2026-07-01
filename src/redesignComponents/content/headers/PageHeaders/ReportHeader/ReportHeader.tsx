import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";

import {
  DisturbanceReportFullDto,
  FinancialReportFullDto,
  NurseryReportFullDto,
  ProjectReportFullDto,
  SiteReportFullDto,
  SrpReportFullDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { formatMonthYear } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";
import { EntityName, SingularEntityName } from "@/types/common";

import DateRange from "../components/DateRange";
import SeparatorDot from "../components/SeparatorDot";
import PageHeader from "../PageHeader";

export interface ReportHeaderProps {
  report:
    | ProjectReportFullDto
    | SiteReportFullDto
    | NurseryReportFullDto
    | SrpReportFullDto
    | DisturbanceReportFullDto
    | FinancialReportFullDto;
  title: string;
  dueAt?: string | null;
  entityName: EntityName | SingularEntityName;
}

const ReportHeader: FC<ReportHeaderProps> = ({ report, title, dueAt, entityName }) => {
  const t = useT();
  const router = useRouter();

  const entityTitle = useMemo(() => {
    if (entityName === "site-report") return (report as SiteReportFullDto)?.siteName ?? "";
    if (entityName === "nursery-report") return (report as NurseryReportFullDto)?.nurseryName ?? "";
    if (entityName === "project-report") return (report as ProjectReportFullDto)?.projectName ?? "";
    if (entityName === "disturbance-report") return (report as DisturbanceReportFullDto)?.projectName ?? "";
    if (entityName === "financial-report") return (report as FinancialReportFullDto)?.organisationName ?? "";
    if (entityName === "srp-report") return (report as SrpReportFullDto)?.projectName ?? "";
  }, [entityName, report]);

  const reportTitle = useMemo(() => {
    if (entityName === "site-report") return (report as SiteReportFullDto)?.reportTitle ?? "";
    if (entityName === "nursery-report") return (report as NurseryReportFullDto)?.reportTitle ?? "";
    if (entityName === "project-report") return (report as ProjectReportFullDto)?.reportTitle ?? "";
    if (entityName === "financial-report") return (report as FinancialReportFullDto)?.reportTitle ?? "";
    if (entityName === "srp-report") return (report as SrpReportFullDto)?.reportTitle ?? "";
  }, [entityName, report]);

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler(entityName, report.uuid);
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName,
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus,
    feedback: report.feedback,
    useStatusModal: true,
    entityTitle: entityTitle ?? "",
    reportTitle: reportTitle ?? ""
  });

  return (
    <>
      {EditModals}
      <PageHeader title={title} />
      <Box gapX={4} px={6} py={5} justifyContent="space-between" className="mobile:flex-col">
        <Flex gap={2} direction="column">
          <Text
            textStyle="400"
            color="neutral.900"
            className="-ml-[0.5rem] flex items-center gap-2 mobile:w-full mobile:max-w-full mobile:overflow-x-auto"
          >
            {entityName !== "financial-report" && "projectUuid" in report && (
              <>
                <Button
                  variant="borderless"
                  size="small"
                  className="-mr-2"
                  onClick={() => report.projectUuid != null && router.push(`/project/${report.projectUuid}`)}
                >
                  {report.projectName ?? "—"}
                </Button>
                <SeparatorDot />
              </>
            )}
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
            startDateLabel={`${t("Due")}:`}
            endDateLabel={`${t("Last updated")}:`}
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
            <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={() => handleEdit()}>
              {t("Edit")}
            </Button>
            <Button
              variant="secondary"
              size="small"
              leftIcon={<DownloadIcon />}
              onClick={() => void handleExport()}
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
