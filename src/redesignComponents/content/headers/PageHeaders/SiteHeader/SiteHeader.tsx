import { Box, Flex } from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formatMonthYear } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";
import { mapStatusToTagStateEntity } from "@/utils/mapStatusToTagStateEntity";

import SiteInfo from "../components/SiteInfo";
import SitePlantingStatus from "../components/SitePlantingStatus";
import PageHeader from "../PageHeader";

export interface SiteHeaderProps {
  site: SiteFullDto;
  reviewLabel?: string;
  showStatusTag?: boolean;
}

const SiteHeader: FC<SiteHeaderProps> = ({ site, reviewLabel, showStatusTag = false }) => {
  const statusTag = useMemo(() => mapStatusToTagStateEntity(site.status), [site.status]);

  return (
    <>
      <PageHeader
        title={site.name ?? ""}
        label={reviewLabel ?? ""}
        tag={showStatusTag && statusTag != null ? { state: statusTag.type } : undefined}
      />
      <Box display="flex" gap={4} px={6} py={5} justifyContent="space-between" className="mobile:flex-col">
        <Flex gap={5}>
          <SiteInfo
            site={site}
            organization={site.organisationName ?? "-"}
            projectName={site.projectName ?? "-"}
            projectUuid={site.projectUuid ?? ""}
            description={site.description ?? ""}
            startDate={formatMonthYear(site.startDate)}
            endDate={formatMonthYear(site.endDate)}
          />
        </Flex>
        <SitePlantingStatus site={site} />
      </Box>
    </>
  );
};

export default SiteHeader;
