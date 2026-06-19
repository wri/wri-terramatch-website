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
  progressLabel?: string;
  goal: number;
  tooltipContent?: ReactNode;
  variant?: MetricCardVariant;
  icon?: ReactNode;
  color?: string;
  type?: string;
  className?: string;
  classNameTitle?: string;
  frameworkKey?: string;
  metricLabel?: string;
}

export interface MetricCardCommonVariantProps
  extends Pick<
    MetricCardProps,
    | "title"
    | "progress"
    | "progressLabel"
    | "goal"
    | "tooltipContent"
    | "color"
    | "type"
    | "frameworkKey"
    | "metricLabel"
  > {
  iconWithColor: ReactNode;
  classNameTitle?: string;
}

export type NoGoalMetricCardContentProps = Pick<
  MetricCardCommonVariantProps,
  | "title"
  | "progress"
  | "progressLabel"
  | "color"
  | "iconWithColor"
  | "type"
  | "tooltipContent"
  | "classNameTitle"
  | "metricLabel"
>;

export type ProgressBarMetricCardContentProps = Pick<
  MetricCardCommonVariantProps,
  | "title"
  | "progress"
  | "progressLabel"
  | "goal"
  | "color"
  | "iconWithColor"
  | "type"
  | "tooltipContent"
  | "classNameTitle"
  | "metricLabel"
>;

export type DonutChartMetricCardContentProps = MetricCardCommonVariantProps;

export interface MultiMetricCardProps {
  title: string;
  status?: ProgressState;
  metrics: MetricCardProps[];
  labelStatus: string;
}
