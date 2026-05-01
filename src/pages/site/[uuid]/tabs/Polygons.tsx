import { Box } from "@chakra-ui/react";
import { FC } from "react";

import PolygonsMap from "@/components/elements/Map-mapbox/components/PolygonsMap";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

interface SitePolygonsTabProps {
  site: SiteFullDto;
  refetch: () => Promise<any>;
}

const SitePolygonsTab: FC<SitePolygonsTabProps> = ({ site, refetch }) => {
  return (
    <PageContent>
      <Box h={"400px"} w={"100%"} rounded={"2px"} bg={"#33694b"} position={"relative"}>
        <PolygonsMap entityModel={site} type="sites" className="max-h-[432px]" disabledPolygonPanel={true} />
      </Box>
    </PageContent>
  );
};

export default SitePolygonsTab;
