import { Box } from "@chakra-ui/react";
import { Toolbar } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

type ToolbarProps = ComponentProps<typeof Toolbar>;

export interface MapControlsProps extends Partial<ToolbarProps> {}

const MapControls: FC<MapControlsProps> = ({ items, ...rest }: MapControlsProps) => {
  return (
    <Box
      className="map-controls"
      css={{
        "& .toolbar-item-button > div": {
          justifyContent: "flex-start !important"
        }
      }}
    >
      <Toolbar items={items ?? []} {...rest} />
    </Box>
  );
};

export default MapControls;
