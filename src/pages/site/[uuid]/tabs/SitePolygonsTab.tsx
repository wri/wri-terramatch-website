import { FC } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import SitePolygonsWorkspace from "../sitePolygonReview/SitePolygonsWorkspace";

interface SitePolygonsTabProps {
  site: SiteFullDto;
}

const SitePolygonsTab: FC<SitePolygonsTabProps> = ({ site }) => (
  <SitePolygonsWorkspace site={site} variant="champions" />
);

export default SitePolygonsTab;
