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

import SitePolygonValidationAside from "./components/PolygonValidationAside";
import CriteriaCheckForSitePolygons from "./CriteriaCheckForSitePolygons";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
  label: string;
}

const PolygonValidationAside: FC<{ type: EntityName }> = ({ type }) => {
  switch (type) {
    case "sites":
      return <SitePolygonValidationAside />;
    default:
      return null;
  }
};

const PolygonValidationTab: FC<IProps> = props => {
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
      render: () => <Text variant="text-14-bold">Connect to Flority</Text>
    },
    {
      id: "2",
      render: () => <Text variant="text-14-bold">Create Polygons</Text>
    },
    {
      id: "3",
      render: () => <Text variant="text-14-bold">Add Polygon Data</Text>
    },
    {
      id: "4",
      render: () => <Text variant="text-14-bold">Upload Images</Text>
    }
  ];

  const criteriaMenuItems = [
    {
      id: "1",
      status: true,
      label: "Polygon 1213023412"
    },
    {
      id: "2",
      status: true,
      label: "Polygon 1234825234"
    },
    {
      id: "3",
      status: false,
      label: "Polygon 2321340880"
    },
    {
      id: "4",
      status: false,
      label: "Polygon 1234825235"
    },
    {
      id: "5",
      status: true,
      label: "Polygon 2321340881"
    },
    {
      id: "6",
      status: true,
      label: "Polygon 2321340882"
    },
    {
      id: "7",
      status: false,
      label: "Polygon 2321340883"
    },
    {
      id: "8",
      status: false,
      label: "Polygon 2321340884"
    }
  ];
  const polygonStatusLabels = [
    { id: "1", label: "Site Approved" },
    { id: "2", label: "Polygons Submitted" },
    { id: "3", label: "Polygons Approved" },
    { id: "4", label: "Planting Complete" },
    { id: "5", label: "Monitoring Begins" }
  ];
  return (
    <When condition={!isLoading}>
      <TabbedShowLayout.Tab {...props}>
        <Grid spacing={2} container>
          <Grid xs={8}>
            <Stack gap={4} className="pt-9 pl-8">
              <div className="mb-6">
                <Text variant="text-16-bold" className="mb-2 text-grey-300">
                  Polygon Validation
                </Text>
                <Text variant="text-14-light" className="text-grey-300">
                  Add, remove or edit polygons that are associated to a site. Polygons may be edited in the map below;
                  exported, moified in QGIS or ArcGIS and imported again; or fed through the mobile application.
                </Text>
              </div>
              <Grid container columns={5} columnSpacing={2}>
                <Grid item xs={2}>
                  <CriteriaCheckForSitePolygons menu={criteriaMenuItems} />
                </Grid>
                <Grid item xs={3}>
                  <div className="flex flex-wrap gap-3">
                    <Menu menu={addMenuItems} className="flex-1">
                      <Button
                        variant="sky-pa"
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
                      variant="white-pa"
                      className="flex-1"
                      iconProps={{
                        className: "w-4 h-4 group-hover-text-primary-500",
                        name: IconNames.DOWNLOAD_PA
                      }}
                    >
                      Download
                    </Button>
                    <Button className="flex-1 px-3">approve polygons</Button>
                  </div>
                  <div className="mt-4 rounded-lg border border-grey-750 p-4">
                    <Text variant="text-14" className="mb-3 text-grey-250">
                      Polygon Status
                    </Text>
                    <div className="h-fit w-full">
                      <StepProgressbar color="primary" value={80} labels={polygonStatusLabels} />
                    </div>
                  </div>
                </Grid>
              </Grid>
              <Map className="rounded-lg" />
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
          <Grid xs={4} className="pt-9 pl-8 pr-4">
            <PolygonValidationAside type={props.type} />
          </Grid>
        </Grid>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default PolygonValidationTab;
