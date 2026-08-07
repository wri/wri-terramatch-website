import { Box, Grid, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentType, SVGProps } from "react";

import * as BoundaryPolygonModule from "./BoundaryPolygon.svg";
import {
  type BoundaryStatus,
  type PolygonState,
  FILL_OPACITY,
  INTERACTION_STATES,
  POLYGON_STATES,
  POLYGON_VERTICES,
  ROW_TEMPLATE,
  ROWS,
  STATE_LABELS,
  STATUS_COLORS,
  STATUSES
} from "./MapBoundaryPolygon.constants";

const BoundaryPolygon = (
  BoundaryPolygonModule as unknown as {
    ReactComponent: ComponentType<SVGProps<SVGSVGElement>>;
  }
).ReactComponent;

type MapBoundaryPolygonProps = {
  state?: PolygonState;
  status: BoundaryStatus;
};

const EditableVertices = () => (
  <svg className="boundary-polygon__vertices" viewBox="0 0 202 218" fill="none" aria-hidden="true">
    {POLYGON_VERTICES.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="currentColor" strokeWidth="2" />
    ))}
  </svg>
);

const ExternalPattern = () => (
  <Box
    position="absolute"
    inset={0}
    backgroundColor="neutral.100"
    backgroundImage="linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(-45deg, currentColor 25%, transparent 25%), linear-gradient(45deg, transparent 75%, currentColor 75%), linear-gradient(-45deg, transparent 75%, currentColor 75%)"
    backgroundPosition="0 0, 0 5px, 5px -5px, -5px 0"
    backgroundSize="10px 10px"
    clipPath="polygon(0.3% 75.5%, 47.7% 99.4%, 99.3% 99.4%, 83.5% 59.4%, 99.3% 19.5%, 47.7% 0.3%, 16.9% 32.5%)"
    aria-hidden="true"
  />
);

const OverlapWarning = () => (
  <Box
    position="absolute"
    top="47%"
    left="54%"
    display="grid"
    boxSize="1.125rem"
    placeItems="center"
    transform="translate(-50%, -50%)"
    color="neutral.100"
    backgroundColor="error.500"
    border="0.1875rem solid"
    borderColor="neutral.100"
    borderRadius="full"
    textStyle="50-bold"
    lineHeight="1"
    aria-hidden="true"
  >
    !
  </Box>
);

const MapBoundaryPolygon = ({ state = "default", status }: MapBoundaryPolygonProps) => {
  const isEditable = state === "editable";
  const isExternal = state === "external";

  return (
    <Box
      position="relative"
      boxSize="5rem"
      color={STATUS_COLORS[status]}
      role="img"
      aria-label={`${status}, ${STATE_LABELS[state]}`}
      css={{
        "& > svg": { position: "absolute", inset: 0, width: "100%", height: "100%" },
        "& .boundary-polygon__shape": { overflow: "hidden" },
        "& .boundary-polygon__shape path": {
          fillOpacity: FILL_OPACITY[state],
          strokeWidth: state === "default" ? "1px" : "2px",
          strokeDasharray: isEditable ? "2px 2px" : "none"
        },
        "& .boundary-polygon__vertices": { pointerEvents: "none", overflow: "visible" },
        "& .boundary-polygon__vertices circle": { stroke: "var(--chakra-colors-neutral-100)" }
      }}
    >
      <BoundaryPolygon className="boundary-polygon__shape" aria-hidden="true" />
      {isExternal && <ExternalPattern />}
      {isEditable && <EditableVertices />}
      {(state === "selected-overlap" || isExternal) && <OverlapWarning />}
    </Box>
  );
};

const meta = {
  title: "Redesign Components/Geospatial/Map Boundary Polygon",
  component: MapBoundaryPolygon,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    status: { control: "select", options: STATUSES },
    state: { control: "select", options: POLYGON_STATES }
  }
} satisfies Meta<typeof MapBoundaryPolygon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { state: "default", status: "Draft" }
};

export const AllStates: Story = {
  args: { state: "default", status: "Draft" },
  parameters: { controls: { disable: true } },
  render: () => (
    <Box
      width="min(53.75rem, calc(100vw - 2rem))"
      minWidth="53.5rem"
      padding="2.625rem 2.5rem 3rem"
      overflow="auto"
      color="neutral.900"
      backgroundColor="neutral.200"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius="1.5rem"
    >
      <Grid
        gridTemplateColumns="6.375rem repeat(5, minmax(8.125rem, 1fr))"
        alignItems="end"
        marginBottom="1.375rem"
        paddingX="1.25rem"
        aria-hidden="true"
      >
        <Box />
        {INTERACTION_STATES.map(state => (
          <Text paddingX="0.5rem" textStyle="300" textAlign="center" key={state}>
            {STATE_LABELS[state]}
          </Text>
        ))}
      </Grid>

      <Grid gridTemplateColumns="6.375rem 1fr">
        <Grid gridTemplateRows={ROW_TEMPLATE} alignItems="center" paddingLeft="1.25rem" aria-hidden="true">
          {ROWS.map(({ status }) => (
            <Text maxWidth="7.5rem" textStyle="300" key={status}>
              {status}
            </Text>
          ))}
        </Grid>

        <Grid
          gridTemplateColumns="repeat(5, minmax(8.125rem, 1fr))"
          gridTemplateRows={ROW_TEMPLATE}
          placeItems="center"
          paddingX="1.25rem"
          border="1px dashed"
          borderColor="neutralActive.3"
        >
          {ROWS.flatMap(({ status, states }) =>
            states.map((state, columnIndex) => (
              <Grid
                placeItems="center"
                width="100%"
                height="100%"
                padding="1.125rem"
                key={`${status}-${INTERACTION_STATES[columnIndex]}`}
              >
                {state && <MapBoundaryPolygon state={state} status={status} />}
              </Grid>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  )
};
