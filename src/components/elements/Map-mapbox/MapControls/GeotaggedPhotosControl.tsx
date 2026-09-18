import { useT } from "@transifex/react";
import type { FC } from "react";
import { useCallback, useMemo } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { PhotosIcon } from "@/redesignComponents/foundations/Icons";
import MapControls from "@/redesignComponents/geospatial/MapControls/MapControls";
import Badge from "@/redesignComponents/status/Badge/Badge";

export const GeotaggedPhotosControl: FC = () => {
  const t = useT();
  const { geotaggedPhotosMapVisible, setGeotaggedPhotosMapVisible, mediaFiles } = useMapAreaContext();

  const geotaggedPhotosCount = useMemo(
    (): number => mediaFiles.filter(file => file.lat != null && file.lng != null).length,
    [mediaFiles]
  );

  const hasGeotaggedPhotos = geotaggedPhotosCount > 0;
  const isActive = hasGeotaggedPhotos && geotaggedPhotosMapVisible;
  const tooltipText = isActive ? t("Hide geotagged photos") : t("Show geotagged photos");

  const handleToggle = useCallback((): void => {
    if (!hasGeotaggedPhotos) return;
    setGeotaggedPhotosMapVisible(!geotaggedPhotosMapVisible);
  }, [geotaggedPhotosMapVisible, hasGeotaggedPhotos, setGeotaggedPhotosMapVisible]);

  const items = useMemo(
    () => [
      {
        active: isActive,
        ariaLabel: tooltipText,
        disabled: !hasGeotaggedPhotos,
        icon: <PhotosIcon />,
        label: "Geotagged photos",
        onClick: handleToggle,
        tooltip: tooltipText
      }
    ],
    [handleToggle, hasGeotaggedPhotos, isActive, tooltipText]
  );

  return (
    <Badge
      variant="information"
      hasNotification={hasGeotaggedPhotos}
      notificationCount={geotaggedPhotosCount}
      css={{
        "& div:has(> p[aria-label])": {
          top: 0,
          right: 0,
          left: "auto",
          transform: "translate(25%, -25%)"
        }
      }}
    >
      <MapControls items={items} />
    </Badge>
  );
};
