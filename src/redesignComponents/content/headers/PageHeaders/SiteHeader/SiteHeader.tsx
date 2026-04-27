import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formatMonthYear } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";

import SiteInfo from "../components/SiteInfo";
import SitePlantingStatus from "../components/SitePlantingStatus";
import PageHeader from "../PageHeader";

export interface SiteHeaderProps {
  site: SiteFullDto;
}

const SiteHeader: FC<SiteHeaderProps> = ({ site }) => (
  <>
    <PageHeader title={site.name ?? ""} />
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

export default SiteHeader;
