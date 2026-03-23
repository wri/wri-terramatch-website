import { Panel as WriPanel } from "@worldresources/wri-design-systems";
import React, { ComponentProps, FC } from "react";

const Panel: FC<ComponentProps<typeof WriPanel>> = props => {
  return <WriPanel {...props} />;
};

export default Panel;
