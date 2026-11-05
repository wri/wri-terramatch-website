import type { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import type { PolygonTableRow } from "../../site/[uuid]/components/PolygonTableRow";
import { mapSitePolygonToTableRow } from "../../site/[uuid]/components/polygonTableRow.utils";

export const toPolygonReviewTableRow = (polygon: SitePolygonLightDto, t: (key: string) => string): PolygonTableRow => ({
  ...mapSitePolygonToTableRow(polygon, t),
  entity: {
    siteUuid: polygon.siteId,
    siteName: polygon.siteName,
    projectUuid: polygon.projectId,
    projectName: polygon.projectName
  }
});

export const getPolygonRowId = (polygon: SitePolygonLightDto) => polygon.polygonUuid ?? polygon.uuid;
