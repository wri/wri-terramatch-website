import { Box } from "@chakra-ui/react";
import { Toolbar } from "@worldresources/wri-design-systems";
import { ComponentProps, FC, useMemo } from "react";

type ToolbarProps = ComponentProps<typeof Toolbar>;

export interface MapControlsProps extends Partial<ToolbarProps> {}

const MapControls: FC<MapControlsProps> = ({ items, ...rest }: MapControlsProps) => {
  const gapStyles = useMemo(() => {
    if (!items) return {};
    const styles: Record<string, Record<string, string>> = {};

    items.forEach((item, index) => {
      const hasGap = rest.defaultGaps ? item.gap !== false : item.gap === true;

      if (!hasGap) {
        const currentSelector = `& .chakra-group > button:nth-of-type(${index + 1})`;
        styles[currentSelector] = {
          ...styles[currentSelector],
          borderBottomLeftRadius: "0 !important",
          borderBottomRightRadius: "0 !important",
          borderBottom: "none !important"
        };

        if (index + 1 < items.length) {
          const nextSelector = `& .chakra-group > button:nth-of-type(${index + 2})`;
          styles[nextSelector] = {
            ...styles[nextSelector],
            borderTopLeftRadius: "0 !important",
            borderTopRightRadius: "0 !important"
          };
        }
      }
    });

    return styles;
  }, [items, rest.defaultGaps]);

  return (
    <Box
      className="map-controls"
      css={{
        "& .toolbar-item-button > div": {
          justifyContent: "flex-start !important"
        },
        ...gapStyles
      }}
    >
      <Toolbar items={items ?? []} {...rest} />
    </Box>
  );
};

export default MapControls;
