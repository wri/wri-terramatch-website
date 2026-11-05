import { FC, useEffect, useRef } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

type PolygonReviewSiteSyncProps = {
  siteUuid?: string;
  site?: SiteFullDto;
};

const PolygonReviewSiteSync: FC<PolygonReviewSiteSyncProps> = ({ siteUuid, site }) => {
  const { setSiteData } = useMapAreaContext();
  const { closePolygonEdit } = usePolygonEditDrawer();
  const previousSiteUuidRef = useRef(siteUuid);

  useEffect(() => {
    setSiteData(site);
  }, [setSiteData, site]);

  // Keyed on the filter rather than the loaded site, so the site finishing loading doesn't close an open drawer.
  useEffect(() => {
    if (previousSiteUuidRef.current === siteUuid) return;
    previousSiteUuidRef.current = siteUuid;
    closePolygonEdit();
  }, [closePolygonEdit, siteUuid]);

  return null;
};

export default PolygonReviewSiteSync;
