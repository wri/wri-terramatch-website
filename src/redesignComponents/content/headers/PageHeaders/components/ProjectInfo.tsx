import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo } from "react";
import Twemoji from "react-twemoji";

import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useMyOrg } from "@/connections/Organisation";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { useModalContext } from "@/context/modal.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ProgressTag, ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { ChevronRightIcon, DownloadIcon } from "@/redesignComponents/foundations/Icons";

import DateRange from "./DateRange";
import DescriptionHeader from "./DescriptionHeader";
import SeparatorDot from "./SeparatorDot";

export interface ProjectInfoProps {
  title: string;
  tag: ProgressTagProps;
  organization: string;
  country: string;
  countryFlag: string;
  startDate: string;
  endDate: string;
  description?: string;
  project: ProjectFullDto;
}

const ProjectInfo: FC<ProjectInfoProps> = ({
  title,
  tag,
  organization,
  country,
  countryFlag,
  startDate,
  endDate,
  description,
  project
}) => {
  const t = useT();
  const { openModal } = useModalContext();
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "projects",
    entityUUID: project.uuid,
    entityStatus: project.status ?? "started",
    updateRequestStatus: project.updateRequestStatus ?? "no-update"
  });
  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("projects", project.uuid);
  const [, myOrg] = useMyOrg();
  const router = useRouter();

  const handleOrganizationNav = useCallback(() => {
    const orgId = myOrg?.organisationId;
    router.push(orgId != null ? `/organization/${orgId}` : "/");
  }, [router, myOrg?.organisationId]);

  const needMoreInformation =
    project.updateRequestStatus === NEEDS_MORE_INFORMATION || project.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval = project.updateRequestStatus === AWAITING_APPROVAL || project.status === AWAITING_APPROVAL;
  const statusProps = useMemo(() => getStatusProps(t, project, project.status!), [t, project]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval) {
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps!}
          feedback={project.feedback}
          needMoreInformation={needMoreInformation}
          entityName="projects"
          entityUuid={project.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [needMoreInformation, statusProps, openModal, project.feedback, project.uuid, handleEdit, awaitingApproval]);

  return (
    <Box gap={2} className="flex flex-col">
      <Text
        fontSize="28px"
        lineHeight="36px"
        color="primary.900"
        fontWeight="bold"
        className="flex items-baseline gap-3"
      >
        {title} <ProgressTag {...tag} />
      </Text>
      <Text textStyle="400" color="neutral.900" className="-ml-[8px] flex items-center gap-2">
        <Button variant="borderless" size="small" className="-mr-2" onClick={handleOrganizationNav}>
          {organization}
        </Button>
        <SeparatorDot />
        <Twemoji options={{ className: "h-4 w-4" }}>{countryFlag}</Twemoji>
        <Text textStyle="300" color="primary.900">
          {country}
        </Text>
      </Text>
      <DateRange startDate={startDate} endDate={endDate} />
      {description != null ? (
        <DescriptionHeader
          description={description}
          handleEdit={handleEditClick}
          downloadButtonProps={{
            variant: "secondary",
            size: "small",
            leftIcon: <DownloadIcon />,
            onClick: handleExport,
            loading: exportLoader,
            children: t("Download Project Files")
          }}
          readMoreOnClick={() => router.push(`/project/${project.uuid}?tab=details`)}
        />
      ) : (
        <div className="w-fit">
          <Button
            onClick={handleEditClick}
            variant="secondary"
            size="small"
            rightIcon={<ChevronRightIcon />}
            className="mr-3 w-auto"
          >
            {t("Add Project Information")}
          </Button>
          <Button
            variant="secondary"
            size="small"
            leftIcon={<DownloadIcon />}
            onClick={handleExport}
            loading={exportLoader}
            className="mobile:mt-2"
          >
            {t("Download Project Files")}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default ProjectInfo;
