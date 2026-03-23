import { Icon, IconProps } from "@chakra-ui/react";
import React, { FC } from "react";

import { getThemedColor } from "@/lib/theme";

export interface TreeCircleProps extends IconProps {
  color?: string;
  innerBgColor?: string;
  outerBgColor?: string;
  borderColor?: string;
}

export const TreeCircleIcon: FC<TreeCircleProps> = (props: TreeCircleProps) => {
  const {
    color = getThemedColor("secondary", 800),
    innerBgColor = getThemedColor("secondary", 300),
    outerBgColor = getThemedColor("neutral", 100),
    borderColor = getThemedColor("secondary", 500)
  } = props;
  return (
    <Icon {...props}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ backgroundColor: outerBgColor }}
      >
        <path
          d="M12 0.5C18.3513 0.5 23.5 5.64873 23.5 12C23.5 18.3513 18.3513 23.5 12 23.5C5.64873 23.5 0.5 18.3513 0.5 12C0.5 5.64873 5.64873 0.5 12 0.5Z"
          fill={innerBgColor}
        />
        <path
          d="M12 0.5C18.3513 0.5 23.5 5.64873 23.5 12C23.5 18.3513 18.3513 23.5 12 23.5C5.64873 23.5 0.5 18.3513 0.5 12C0.5 5.64873 5.64873 0.5 12 0.5Z"
          stroke={borderColor}
        />
        <path
          d="M7.1 19V17.6H11.3V14.8H9.9C8.93167 14.8 8.10625 14.4587 7.42375 13.7762C6.74125 13.0938 6.4 12.2683 6.4 11.3C6.4 10.6 6.5925 9.95542 6.9775 9.36625C7.3625 8.77708 7.88167 8.34833 8.535 8.08C8.64 7.205 9.02208 6.47292 9.68125 5.88375C10.3404 5.29458 11.1133 5 12 5C12.8867 5 13.6596 5.29458 14.3188 5.88375C14.9779 6.47292 15.36 7.205 15.465 8.08C16.1183 8.34833 16.6375 8.77708 17.0225 9.36625C17.4075 9.95542 17.6 10.6 17.6 11.3C17.6 12.2683 17.2588 13.0938 16.5763 13.7762C15.8938 14.4587 15.0683 14.8 14.1 14.8H12.7V17.6H16.9V19H7.1Z"
          fill={color}
        />
      </svg>
    </Icon>
  );
};

export default TreeCircleIcon;
