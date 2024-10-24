import React from "react";

export const CustomXAxisTick: React.FC<any> = props => {
  const { x, y, payload } = props;
  const words = payload.value.split(" ");
  const lineHeight = 16;
  const topPadding = 20;
  let lines: string[] = [];
  let currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    if (testLine.length > 16) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={topPadding}
          dy={index * lineHeight}
          textAnchor="middle"
          fill="#374151"
          className="text-sm"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

export default CustomXAxisTick;
