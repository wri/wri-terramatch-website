import type { FC } from "react";
import { useState } from "react";

import { PhotosIcon } from "@/redesignComponents/foundations/Icons";
import MapControls from "@/redesignComponents/geospatial/MapControls/MapControls";
import Badge from "@/redesignComponents/status/Badge/Badge";

type GeotaggedPhotosControlProps = {
  count?: number;
};

export const GeotaggedPhotosControl: FC<GeotaggedPhotosControlProps> = ({ count = 12 }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Badge
      variant="information"
      hasNotification
      notificationCount={count}
      css={{
        "& div:has(> p[aria-label])": {
          top: 0,
          right: 0,
          left: "auto",
          transform: "translate(25%, -25%)"
        }
      }}
    >
      <MapControls
        items={[
          {
            active: isActive,
            ariaLabel: "Geotagged photos",
            icon: <PhotosIcon />,
            label: "Geotagged photos",
            onClick: () => setIsActive(prev => !prev)
          }
        ]}
      />
    </Badge>
  );
};
