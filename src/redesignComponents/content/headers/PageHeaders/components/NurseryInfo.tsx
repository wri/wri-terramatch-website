import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";

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
  const { handleEdit, EditModals } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: nursery.uuid,
    entityStatus: nursery.status ?? "draft",
    updateRequestStatus: nursery.updateRequestStatus,
    feedback: nursery.feedback,
    useInformationRequiredModal: true
  });
  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("nurseries", nursery.uuid);

  const handleEditClick = useCallback(() => handleEdit(), [handleEdit]);

  return (
    <Box gap={2} className="flex flex-col">
      {EditModals}
      <Text
        textStyle="400"
        color="neutral.900"
        className="-ml-[0.5rem] flex items-center gap-2 mobile:w-full mobile:max-w-full mobile:overflow-x-auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          "&": { msOverflowStyle: "none", scrollbarWidth: "none" }
        }}
      >
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
