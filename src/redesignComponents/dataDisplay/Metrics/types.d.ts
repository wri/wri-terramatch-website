import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import { ProgressState } from "../actions/Tags/ProgressTag/ProgressTag";

export interface DonutChartProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  progress: number;
  size?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  className?: string;
  type?: string;
}

export interface ProgressBarProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  progress: number;
  width?: string | number;
  height?: string | number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export type MetricCardVariant = "medium" | "large" | "progressBar" | "donutChart";
export interface MetricCardProps {
  title: string;
  progress: number;
  goal: number;
  tooltipContent?: ReactNode;
  variant?: MetricCardVariant;
  icon?: ReactNode;
  color?: string;
  type?: string;
  className?: string;
  classNameTitle?: string;
}

export interface MetricCardCommonVariantProps
  extends Pick<MetricCardProps, "title" | "progress" | "goal" | "tooltipContent" | "color" | "type"> {
  iconWithColor: ReactNode;
  classNameTitle?: string;
}

export type NoGoalMetricCardContentProps = Pick<
  MetricCardCommonVariantProps,
  "title" | "progress" | "color" | "iconWithColor" | "type" | "tooltipContent"
>;

export type ProgressBarMetricCardContentProps = Pick<
  MetricCardCommonVariantProps,
  "title" | "progress" | "goal" | "color" | "iconWithColor" | "type" | "tooltipContent"
>;

export type DonutChartMetricCardContentProps = MetricCardCommonVariantProps;

export interface MultiMetricCardProps {
  title: string;
  status?: ProgressState;
  metrics: MetricCardProps[];
  labelStatus: string;
}
