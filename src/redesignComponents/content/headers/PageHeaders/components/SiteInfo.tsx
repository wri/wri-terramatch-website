import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo } from "react";

import { getStatusProps } from "@/components/extensive/EntityStatusBar";
import EntityStatusModal from "@/components/extensive/EntityStatusModal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { useModalContext } from "@/context/modal.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

import DateRange from "./DateRange";
import DescriptionHeader from "./DescriptionHeader";
import SeparatorDot from "./SeparatorDot";

export interface SiteInfoProps {
  site: SiteFullDto;
  organization: string;
  projectName: string;
  projectUuid: string;
  startDate: string;
  endDate: string;
  description?: string;
}

const SiteInfo: FC<SiteInfoProps> = ({
  site,
  organization,
  projectName,
  projectUuid,
  startDate,
  endDate,
  description
}) => {
  const t = useT();
  const router = useRouter();
  const { openModal } = useModalContext();

  const needMoreInformation =
    site.updateRequestStatus === NEEDS_MORE_INFORMATION || site.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval = site.updateRequestStatus === AWAITING_APPROVAL || site.status === AWAITING_APPROVAL;
  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("sites", site.uuid, site.name ?? "");
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: site.uuid,
    entityStatus: site.status as string,
    updateRequestStatus: site.updateRequestStatus as string
  });

  const statusProps = useMemo(() => getStatusProps(t, site, site.status!), [t, site]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval) {
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps!}
          feedback={site.feedback}
          needMoreInformation={needMoreInformation}
          entityName="sites"
          entityUuid={site.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [needMoreInformation, statusProps, openModal, site.feedback, site.uuid, handleEdit, awaitingApproval]);

  return (
    <Box gap={2} className="flex flex-col">
      <Text textStyle="400" color="neutral.900" className="-ml-[8px] flex items-center gap-2">
        <Button
          variant="borderless"
          size="small"
          className="-mr-2"
          onClick={() => router.push(`/project/${projectUuid}`)}
        >
          {projectName}
        </Button>
        <SeparatorDot />
        <Button variant="borderless" size="small" className="-ml-2" onClick={() => router.push(`/my-projects`)}>
          {organization}
        </Button>
      </Text>
      <DateRange startDate={startDate} endDate={endDate} />
      {description != null ? (
        <DescriptionHeader
          description={description}
          handleEdit={handleEditClick}
          backgroundColor="neutral.100"
          downloadButtonProps={{
            variant: "secondary",
            size: "small",
            leftIcon: <DownloadIcon />,
            className: "w-auto",
            onClick: handleExport,
            loading: exportLoader,
            children: t("Download Site Files")
          }}
          maxLines={2}
          readMoreOnClick={() => router.push(`/site/${site.uuid}?tab=details`)}
          id={site.ppcExternalId?.toString() ?? "-"}
        />
      ) : (
        <>
          <Flex gap={1} className="items-center">
            <Text textStyle="300" color="neutral.900">
              {t("ID:")}
            </Text>
            <Text textStyle="300-bold" color="neutral.900">
              {site.ppcExternalId ?? "-"}
            </Text>
          </Flex>
          <div className="flex w-fit gap-2">
            <Button
              variant="secondary"
              size="small"
              leftIcon={<EditIcon />}
              className="w-auto"
              onClick={handleEditClick}
            >
              {t("Edit")}
            </Button>
            <Button
              variant="secondary"
              size="small"
              leftIcon={<DownloadIcon />}
              className="w-auto"
              onClick={handleExport}
              loading={exportLoader}
            >
              {t("Download Site Files")}
            </Button>
          </div>
        </>
      )}
    </Box>
  );
};

export default SiteInfo;
