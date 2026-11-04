import { FC, useEffect, useRef } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

type PolygonReviewSiteSyncProps = {
  site?: SiteFullDto;
};

const PolygonReviewSiteSync: FC<PolygonReviewSiteSyncProps> = ({ site }) => {
  const { setSiteData } = useMapAreaContext();
  const { closePolygonEdit } = usePolygonEditDrawer();
  const siteUuid = site?.uuid;
  const previousSiteUuidRef = useRef(siteUuid);

  useEffect(() => {
    setSiteData(site);
  }, [setSiteData, site]);

  useEffect(() => {
    if (previousSiteUuidRef.current === siteUuid) return;
    previousSiteUuidRef.current = siteUuid;
    closePolygonEdit();
  }, [closePolygonEdit, siteUuid]);

  return null;
};

export default PolygonReviewSiteSync;
