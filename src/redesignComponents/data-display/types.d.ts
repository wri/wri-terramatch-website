import { DetailedHTMLProps, HTMLAttributes } from "react";

import { ProgressState } from "../actions/Tags/ProgressTag/ProgressTag";

export interface DonutChartProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  progress: number;
  size?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export interface ProgressBarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  progress: number;
  width?: string | number;
  height?: string | number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export interface MetricCardProps {
  title: string;
  progress: number;
  goal: number;
  tooltipContent?: ReactNode;
  variant?: "simple" | "progressBar" | "donutChart";
  icon?: ReactNode;
  color?: string;
}

export interface MultiMetricCardProps {
  title: string;
  status?: ProgressState;
  metrics: MetricCardProps[];
}
