import { getThemedColor } from "@/lib/theme";
import { JobsCircle, SeedsCircle, TreeCircle } from "@/redesignComponents/foundations/Icons";

export interface MetricIconProps {
  type: "trees" | "saplings" | "jobs";
  disabled?: boolean;
}

const MetricIcon: React.FC<MetricIconProps> = ({ type, disabled }) => {
  switch (type) {
    case "trees":
      return (
        <TreeCircle
          className="h-6 w-6"
          {...(disabled && {
            color: getThemedColor("neutral", 400),
            innerBgColor: getThemedColor("neutral", 200),
            borderColor: getThemedColor("neutral", 300)
          })}
        />
      );
    case "saplings":
      return (
        <SeedsCircle
          className="h-6 w-6"
          {...(disabled && {
            color: getThemedColor("neutral", 400),
            innerBgColor: getThemedColor("neutral", 200),
            borderColor: getThemedColor("neutral", 300)
          })}
        />
      );
    case "jobs":
      return (
        <JobsCircle
          className="h-6 w-6"
          {...(disabled && {
            color: getThemedColor("neutral", 400),
            innerBgColor: getThemedColor("neutral", 200),
            borderColor: getThemedColor("neutral", 300)
          })}
        />
      );
  }
};

export default MetricIcon;
