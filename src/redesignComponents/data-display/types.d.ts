import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface DonutChartProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value: number;
  size?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface ProgressBarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  value: number;
  width?: string | number;
  height?: string | number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}
