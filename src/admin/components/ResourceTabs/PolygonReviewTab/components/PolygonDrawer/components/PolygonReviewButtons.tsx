import React from "react";

import Button from "@/components/elements/Button/Button";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";

import AddDataButton from "../../AddDataButton";

const PolygonReviewButtons = ({
  openFormModalHandlerAddPolygon,
  downloadSiteGeoJsonPolygons,
  openFormModalHandlerSubmitPolygon,
  record,
  openFormModalHandlerUploadImages
}: {
  openFormModalHandlerAddPolygon: () => void;
  downloadSiteGeoJsonPolygons: (uuid: string) => void;
  openFormModalHandlerSubmitPolygon: () => void;
  record: { uuid: string };
  openFormModalHandlerUploadImages: () => void;
}) => {
  const polygonStatusLabels = [
    { id: "1", label: "Draft" },
    { id: "2", label: "Awaiting Approval" },
    { id: "3", label: "Needs More Information" },
    { id: "4", label: "Planting In Progress" },
    { id: "5", label: "Approved" }
  ];

  return (
    <div className="flex items-start gap-3">
      <div className="w-full">
        <div className="mb-2">
          <Text variant="text-16-bold" className="mb-2 text-darkCustom">
            Polygon Review
          </Text>
          <Text variant="text-14-light" className="text-darkCustom">
            Add, remove or edit polygons that are associated to a site. Polygons may be edited in the map below;
            exported, modified in QGIS or ArcGIS and imported again; or fed through the mobile application.
          </Text>
        </div>
        <div className="flex gap-3">
          <AddDataButton
            openFormModalHandlerAddPolygon={openFormModalHandlerAddPolygon}
            openFormModalHandlerUploadImages={openFormModalHandlerUploadImages}
          />
          <Button
            variant="white-page-admin"
            className="flex-1"
            iconProps={{
              className: "w-4 h-4 group-hover-text-primary-500",
              name: IconNames.DOWNLOAD_PA
            }}
            onClick={() => {
              downloadSiteGeoJsonPolygons(record.uuid);
            }}
          >
            Download
          </Button>
          <Button className="flex-1 px-3" onClick={openFormModalHandlerSubmitPolygon}>
            <Text variant="text-14-bold" className="text-white">
              approve polygons
            </Text>
          </Button>
        </div>
      </div>
      <div className="mt-4 w-full rounded-lg border border-grey-750 p-4">
        <Text variant="text-14" className="mb-3 text-blueCustom-250">
          Site Status
        </Text>
        <div className="h-fit w-full">
          <StepProgressbar color="primary" value={50} labels={polygonStatusLabels} labelVariant="text-10" />
        </div>
      </div>
    </div>
  );
};

export default PolygonReviewButtons;
