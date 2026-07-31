import { Toolbar } from "@worldresources/wri-design-systems";
import { ComponentProps, FC } from "react";

type ToolbarProps = ComponentProps<typeof Toolbar>;

export interface MapControlsProps extends Partial<ToolbarProps> {}

const MapControls: FC<MapControlsProps> = ({ items, ...rest }: MapControlsProps) => {
  return <Toolbar items={items ?? []} {...rest} />;
};

export default MapControls;
