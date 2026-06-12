import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Link from "next/link";
import { FC } from "react";

import { toFramework } from "@/context/framework.provider";
import { ProjectReportFullDto, TaskFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFrameworkTitle } from "@/hooks/useFrameworkTitle";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

import PageHeader from "../PageHeader";

export interface ProjectReportHeaderProps {
  report: ProjectReportFullDto;
  title: string;
  task?: TaskFullDto;
}

const ProjectReportHeader: FC<ProjectReportHeaderProps> = ({ report, title, task }) => {
  const t = useT();
  const frameworkTitle = useFrameworkTitle();
  const reportingWindow = useReportingWindow(toFramework(report.frameworkKey), task?.dueAt);

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("project-reports", report.uuid);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "project-reports",
    entityUUID: report.uuid,
    entityStatus: report.status,
    updateRequestStatus: report.updateRequestStatus
  });

  return (
    <>
      <PageHeader title={title} />
      <Box display="flex" gap={4} px={6} py={5} justifyContent="space-between" className="mobile:flex-col">
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
              as={Link}
              href={`/project/${report.projectUuid}`}
            >
              {report.projectName}
            </Button>
            {frameworkTitle && (
              <>
                <span className="text-sm text-theme-neutral-300">·</span>
                <Text as="span" textStyle="400" color="neutral.600">
                  {frameworkTitle}
                </Text>
              </>
            )}
          </Text>
          {reportingWindow && (
            <Text textStyle="300" color="neutral.600">
              {reportingWindow}
            </Text>
          )}
        </Flex>
        <Flex gap={2} alignItems="flex-start" className="mobile:w-full">
          {report.status === "started" ? (
            <Button as={Link} href={`/entity/project-reports/edit/${report.uuid}`}>
              {t("Continue Report")}
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="small"
                leftIcon={<DownloadIcon />}
                onClick={handleExport}
                loading={exportLoader}
              >
                {t("Export")}
              </Button>
              <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={() => handleEdit()}>
                {t("Edit")}
              </Button>
            </>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default ProjectReportHeader;
