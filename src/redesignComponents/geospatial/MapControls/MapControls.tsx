import { Toolbar } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

type ToolbarProps = ComponentProps<typeof Toolbar>;

export type MapControlsProps = Partial<ToolbarProps>;

const MapControls: FC<MapControlsProps> = ({ items = [], ...rest }) => {
  return <Toolbar items={items} {...rest} />;
};

export default MapControls;
