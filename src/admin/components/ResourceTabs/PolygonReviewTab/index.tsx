import { Grid, Stack } from "@mui/material";
import { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Map from "@/components/elements/Map-mapbox/Map";
import Menu from "@/components/elements/Menu/Menu";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { GetV2FormsENTITYUUIDResponse, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";
import { EntityName } from "@/types/common";

import SitePolygonReviewAside from "./components/PolygonReviewAside";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
  label: string;
}

const PolygonReviewAside: FC<{ type: EntityName }> = ({ type }) => {
  switch (type) {
    case "sites":
      return <SitePolygonReviewAside />;
    default:
      return null;
  }
};

const PolygonReviewTab: FC<IProps> = props => {
  const { isLoading: ctxLoading, record } = useShowContext();

  const { isLoading: queryLoading } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>({
    pathParams: {
      uuid: record.uuid,
      entity: props.type
    }
  });

  const isLoading = ctxLoading || queryLoading;

  if (isLoading) return null;

  const addMenuItems = [
    {
      id: "1",
      render: () => <Text variant="text-12-bold">Create Polygons</Text>
    },
    {
      id: "2",
      render: () => <Text variant="text-12-bold">Add Polygon Data</Text>
    },
    {
      id: "3",
      render: () => <Text variant="text-12-bold">Upload Images</Text>
    }
  ];

  const polygonStatusLabels = [
    { id: "1", label: "Site Approved" },
    { id: "2", label: "Polygons Submitted" },
    { id: "3", label: "Polygons Approved" },
    { id: "4", label: "Monitoring Begins" }
  ];
  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab {...props}>
        <Grid spacing={2} container>
          <Grid xs={8}>
            <Stack gap={4} className="pl-8 pt-9">
              <div className="flex items-start gap-3">
                <div className="w-full">
                  <div className="mb-2">
                    <Text variant="text-16-bold" className="mb-2 text-grey-300">
                      Polygon Review
                    </Text>
                    <Text variant="text-14-light" className="text-grey-300">
                      Add, remove or edit polygons that are associated to a site. Polygons may be edited in the map
                      below; exported, moified in QGIS or ArcGIS and imported again; or fed through the mobile
                      application.
                    </Text>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Menu menu={addMenuItems} className="flex-1">
                      <Button
                        variant="sky-page-admin"
                        className="h-fit w-full whitespace-nowrap"
                        iconProps={{
                          className: "w-4 h-4",
                          name: IconNames.PLUS_PA
                        }}
                      >
                        Add Data
                      </Button>
                    </Menu>
                    <Button
                      variant="white-page-admin"
                      className="flex-1"
                      iconProps={{
                        className: "w-4 h-4 group-hover-text-primary-500",
                        name: IconNames.DOWNLOAD_PA
                      }}
                    >
                      Download
                    </Button>
                    <Button className="flex-1 px-3">
                      <Text variant="text-14-bold" className="text-white">
                        approve polygons
                      </Text>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 w-full rounded-lg border border-grey-750 p-4">
                  <Text variant="text-14" className="mb-3 text-grey-250">
                    Polygon Status
                  </Text>
                  <div className="h-fit w-full">
                    <StepProgressbar color="primary" value={80} labels={polygonStatusLabels} />
                  </div>
                </div>
              </div>

              <Map className="rounded-lg" status={true} />
              <div>
                <div>
                  <Text variant="text-16-bold" className="mb-2 text-grey-300">
                    Site Attribute Table
                  </Text>
                  <Text variant="text-14-light" className="text-grey-300">
                    Edit attribute table for all polygons quickly through the table below. Alternatively, open a polygon
                    and edit the attributes in the map above.
                  </Text>
                </div>
                TODO TABLE
              </div>
            </Stack>
          </Grid>
          <Grid xs={4} className="pl-8 pr-4 pt-9">
            <PolygonReviewAside type={props.type} />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default PolygonReviewTab;
