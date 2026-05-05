import { Box } from "@chakra-ui/react";
import { FC } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface SitePolygonsTabProps {
  site: SiteFullDto;
}

const SitePolygonsTab: FC<SitePolygonsTabProps> = ({ site }) => {
  return (
    <PageContent>
      <Box h={"25rem"} w={"100%"} rounded={"0.125rem"} position={"relative"}>
        <PolygonsMap entityModel={site} type="sites" className="max-h-full overflow-hidden rounded-[0.125rem]" />
      </Box>
    </PageContent>
  );
};

export default SitePolygonsTab;
