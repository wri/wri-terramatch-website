import { Toolbar } from "@worldresources/wri-design-systems";

import { DownloadIcon } from "@/redesignComponents/foundations/Icons/DownloadIcon";
import { MinusIcon } from "@/redesignComponents/foundations/Icons/MinusIcon";
import { PlusIcon } from "@/redesignComponents/foundations/Icons/PlusIcon";

const MapControls = () => {
  return (
    <Toolbar
      defaultGaps
      items={[
        {
          ariaLabel: "zoom in",
          gap: false,
          icon: <PlusIcon />,
          label: "zoom in"
        },
        {
          ariaLabel: "zoom out",
          icon: <MinusIcon />,
          label: "zoom out"
        },
        {
          ariaLabel: "print",
          icon: <DownloadIcon />,
          label: "Print"
        }
      ]}
      showExpandedToggle
      vertical
    />
  );
};

export default MapControls;
