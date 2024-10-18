import React from "react";

interface CustomBarProps {
  fill: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CustomBar: React.FC<CustomBarProps> = ({ fill, x, y, width, height }) => {
  const radius = 5;
  const path = `
    M${x},${y + height}
    L${x},${y + radius}
    Q${x},${y} ${x + radius},${y}
    L${x + width - radius},${y}
    Q${x + width},${y} ${x + width},${y + radius}
    L${x + width},${y + height}
    Z
  `;

  return <path d={path} fill={fill} />;
};
