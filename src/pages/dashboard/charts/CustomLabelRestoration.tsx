import { FC } from "react";

export const CustomLabel: FC<any> = props => {
  const { x, y, width, height, value } = props;
  const textHeight = 16;
  const padding = 4;
  const isSmallBar = height < textHeight + padding;
  return (
    <text
      x={x + width / 2}
      y={isSmallBar ? y - 8 : y + height / 2}
      fill={isSmallBar ? "#000000" : "white"}
      textAnchor="middle"
      dominantBaseline={isSmallBar ? "text-after-edge" : "middle"}
      className="text-12"
    >
      {`${Math.round(value).toLocaleString()} ha`}
    </text>
  );
};

export default CustomLabel;
