import { Box } from "@chakra-ui/react";
import { FC } from "react";

import OverviewMapArea from "@/components/elements/Map-mapbox/components/OverviewMapArea";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface SiteMapTabProps {
  site: SiteFullDto;
}

const SiteMapTab: FC<SiteMapTabProps> = ({ site }) => (
  <PageBody className="mx-auto w-[82vw] bg-theme-neutral-100 px-4 py-7">
    <Box className="relative h-auto">
      <OverviewMapArea entityModel={site} type="sites" className="max-h-[432px]" />
    </Box>
    <br />
    <br />
    <br />
  </PageBody>
);

export default SiteMapTab;
