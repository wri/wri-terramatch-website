import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
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

  const { handleExport, loading: exportLoader } = useGetExportEntityHandler("sites", site.uuid, site.name ?? "");

  const handleProjectNav = useCallback(() => {
    router.push(`/project/${projectUuid}`);
  }, [router, projectUuid]);

  const handleMyProjectsNav = useCallback(() => {
    router.push(`/my-projects`);
  }, [router]);

  const handleExportClick = useCallback(() => {
    handleExport();
  }, [handleExport]);

  return (
    <Box gap={2} className="flex flex-col">
      <Text textStyle="400" color="neutral.900" className="-ml-[8px] flex items-center gap-2">
        <Button variant="borderless" size="small" className="-mr-2" onClick={handleProjectNav}>
          {projectName}
        </Button>
        <SeparatorDot />
        <Button variant="borderless" size="small" className="-ml-2" onClick={handleMyProjectsNav}>
          {organization}
        </Button>
      </Text>
      <DateRange startDate={startDate} endDate={endDate} />
      {description != null ? (
        <DescriptionHeader
          description={description}
          backgroundColor="neutral.100"
          downloadButtonProps={{
            variant: "secondary",
            size: "small",
            leftIcon: <DownloadIcon />,
            className: "w-auto",
            onClick: handleExportClick,
            loading: exportLoader,
            children: t("Download Site Files")
          }}
          maxLines={2}
        />
      ) : (
        <div className="flex w-fit gap-2">
          <Button variant="secondary" size="small" leftIcon={<EditIcon />} className="w-auto">
            {t("Edit")}
          </Button>
          <Button
            variant="secondary"
            size="small"
            leftIcon={<DownloadIcon />}
            className="w-auto"
            onClick={handleExportClick}
            loading={exportLoader}
          >
            {t("Download Site Files")}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default SiteInfo;
