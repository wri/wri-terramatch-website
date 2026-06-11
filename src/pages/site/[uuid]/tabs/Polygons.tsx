import { FC } from "react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import SitePolygonsReviewTab from "./SitePolygonsReviewTab";

interface SitePolygonsTabProps {
  site: SiteFullDto;
}

export type { PolygonTableRow } from "../components/PolygonTableRow";

const SitePolygonsTab: FC<SitePolygonsTabProps> = ({ site }) => (
  <SitePolygonsReviewTab site={site} variant="champions" />
);

export default SitePolygonsTab;
