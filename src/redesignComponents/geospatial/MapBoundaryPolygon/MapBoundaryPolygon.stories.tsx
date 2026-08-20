import { Box, Grid, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentType, SVGProps } from "react";

import * as BoundaryPolygonModule from "./BoundaryPolygon.svg";
import {
  type BoundaryStatus,
  type PolygonStyle,
  FILL_OPACITY,
  POLYGON_VERTICES,
  ROW_TEMPLATE,
  ROWS,
  STATUS_COLORS,
  STYLES
} from "./MapBoundaryPolygon.constants";

const BoundaryPolygon = (
  BoundaryPolygonModule as unknown as {
    ReactComponent: ComponentType<SVGProps<SVGSVGElement>>;
  }
).ReactComponent;

type MapBoundaryPolygonProps = {
  style?: PolygonStyle;
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

const MapBoundaryPolygon = ({ style = "Default", status }: MapBoundaryPolygonProps) => {
  const appliedStyle = status === "External" ? "Selected Overlap" : style;
  const isEditable = appliedStyle === "Editable";
  const isExternal = status === "External";

  return (
    <Box
      position="relative"
      boxSize={{ base: "2.5rem", sm: "3.5rem", md: "5rem" }}
      color={STATUS_COLORS[status]}
      role="img"
      aria-label={`${status}, ${appliedStyle}`}
      css={{
        "& > svg": { position: "absolute", inset: 0, width: "100%", height: "100%" },
        "& .boundary-polygon__shape": { overflow: "hidden" },
        "& .boundary-polygon__shape path": {
          fillOpacity: FILL_OPACITY[appliedStyle],
          strokeWidth: appliedStyle === "Default" ? "1px" : "2px",
          strokeDasharray: isEditable ? "2px 2px" : "none"
        },
        "& .boundary-polygon__vertices": { pointerEvents: "none", overflow: "visible" },
        "& .boundary-polygon__vertices circle": { stroke: "var(--chakra-colors-neutral-100)" }
      }}
    >
      <BoundaryPolygon className="boundary-polygon__shape" aria-hidden="true" />
      {isExternal && <ExternalPattern />}
      {isEditable && <EditableVertices />}
      {appliedStyle === "Selected Overlap" && <OverlapWarning />}
    </Box>
  );
};

const meta = {
  title: "Redesign Components/Geospatial/Map Boundary Polygon",
  parameters: {
    layout: "centered",
    controls: { disable: true }
  }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllStates: Story = {
  render: () => (
    <Box
      width={{ base: "calc(100vw - 1rem)", sm: "calc(100vw - 2rem)" }}
      maxWidth="53.75rem"
      padding={{ base: "1.25rem 0.5rem 1.5rem", sm: "1.75rem 1rem 2rem", lg: "2.625rem 2.5rem 3rem" }}
      overflow="hidden"
      color="neutral.900"
      backgroundColor="neutral.200"
      border="1px solid"
      borderColor="neutral.300"
      borderRadius={{ base: "1rem", md: "1.5rem" }}
    >
      <Grid
        gridTemplateColumns={{
          base: "4.25rem repeat(5, minmax(0, 1fr))",
          sm: "5.75rem repeat(5, minmax(0, 1fr))",
          md: "6.375rem repeat(5, minmax(0, 1fr))"
        }}
        alignItems="end"
        marginBottom={{ base: "0.75rem", sm: "1rem", md: "1.375rem" }}
        paddingX={{ base: 0, sm: "0.5rem", md: "1.25rem" }}
        aria-hidden="true"
      >
        <Box />
        {STYLES.map(style => (
          <Text
            paddingX={{ base: "0.125rem", sm: "0.25rem", md: "0.5rem" }}
            fontSize={{ base: "0.625rem", sm: "0.75rem", md: "0.875rem" }}
            lineHeight={{ base: "0.75rem", sm: "1rem", md: "1.25rem" }}
            textStyle="300"
            textAlign="center"
            key={style}
          >
            {style}
          </Text>
        ))}
      </Grid>

      <Grid gridTemplateColumns={{ base: "4.25rem 1fr", sm: "5.75rem 1fr", md: "6.375rem 1fr" }}>
        <Grid
          gridTemplateRows={ROW_TEMPLATE}
          alignItems="center"
          paddingLeft={{ base: "0.25rem", sm: "0.5rem", md: "1.25rem" }}
          aria-hidden="true"
        >
          {ROWS.map(({ status }) => (
            <Text
              maxWidth="7.5rem"
              paddingRight="0.25rem"
              fontSize={{ base: "0.625rem", sm: "0.75rem", md: "0.875rem" }}
              lineHeight={{ base: "0.75rem", sm: "1rem", md: "1.25rem" }}
              textStyle="300"
              key={status}
            >
              {status}
            </Text>
          ))}
        </Grid>

        <Grid
          gridTemplateColumns="repeat(5, minmax(0, 1fr))"
          gridTemplateRows={ROW_TEMPLATE}
          placeItems="center"
          paddingX={{ base: 0, sm: "0.5rem", md: "1.25rem" }}
          border="1px dashed"
          borderColor="neutralActive.3"
        >
          {ROWS.flatMap(({ status, styles }) =>
            styles.map((style, columnIndex) => (
              <Grid
                placeItems="center"
                width="100%"
                height="100%"
                padding={{ base: "0.125rem", sm: "0.5rem", md: "0.75rem", lg: "1.125rem" }}
                key={`${status}-${STYLES[columnIndex]}`}
              >
                {style && <MapBoundaryPolygon style={style} status={status} />}
              </Grid>
            ))
          )}
        </Grid>
      </Grid>
    </Box>
  )
};
