import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo } from "react";

import EntityStatusModal, { StatusProps } from "@/components/extensive/EntityStatusModal";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { AWAITING_APPROVAL, NEEDS_MORE_INFORMATION } from "@/constants/statuses";
import { useModalContext } from "@/context/modal.provider";
import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

import DateRange from "./DateRange";
import DescriptionHeader from "./DescriptionHeader";
import SeparatorDot from "./SeparatorDot";

export interface NurseryInfoProps {
  nursery: NurseryFullDto;
  organization: string;
  projectName: string;
  projectUuid: string;
  startDate: string;
  endDate: string;
  description?: string;
}

const NurseryInfo: FC<NurseryInfoProps> = ({
  nursery,
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
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: nursery.uuid,
    entityStatus: nursery.status ?? "started",
    updateRequestStatus: nursery.updateRequestStatus ?? "no-update"
  });
  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("nurseries", nursery.uuid);

  const needMoreInformation =
    nursery.updateRequestStatus === NEEDS_MORE_INFORMATION || nursery.status === NEEDS_MORE_INFORMATION;
  const awaitingApproval = nursery.updateRequestStatus === AWAITING_APPROVAL || nursery.status === AWAITING_APPROVAL;
  const hasUpdateRequest = !["draft", "no-update", "approved"].includes(nursery.updateRequestStatus ?? "");

  const statusProps: StatusProps | undefined = useMemo(() => {
    if (!needMoreInformation) return undefined;
    const titlePrefix = hasUpdateRequest ? "Change Request Status:" : "Status:";
    return {
      title: t(`${titlePrefix} More Info Requested`),
      icon: IconNames.EXCLAMATION_CIRCLE_FILL,
      className: "fill-tertiary"
    };
  }, [needMoreInformation, hasUpdateRequest, t]);

  const handleEditClick = useCallback(() => {
    if (needMoreInformation && !awaitingApproval && statusProps != null) {
      openModal(
        ModalId.STATUS,
        <EntityStatusModal
          statusProps={statusProps}
          feedback={nursery.feedback}
          needMoreInformation={needMoreInformation}
          entityName="nurseries"
          entityUuid={nursery.uuid}
        />
      );
    } else {
      handleEdit();
    }
  }, [needMoreInformation, statusProps, openModal, nursery.feedback, nursery.uuid, handleEdit, awaitingApproval]);

  return (
    <Box gap={2} className="flex flex-col">
      <Text textStyle="400" color="neutral.900" className="-ml-[0.5rem] flex items-center gap-2">
        <Button
          variant="borderless"
          size="small"
          className="-mr-2 mobile:block mobile:!w-[12.5rem] mobile:truncate"
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
            children: t("Download Nursery Files")
          }}
        />
      ) : (
        <div className="flex w-fit gap-2">
          <Button variant="secondary" size="small" leftIcon={<EditIcon />} className="w-auto" onClick={handleEditClick}>
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
            {t("Download Nursery Files")}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default NurseryInfo;
