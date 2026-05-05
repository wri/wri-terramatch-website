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
  progressSuffix?: string;
  goalSuffix?: string;
  tooltipContent?: ReactNode;
  variant?: MetricCardVariant;
  icon?: ReactNode;
  color?: string;
  type?: string;
  className?: string;
  classNameTitle?: string;
  frameworkKey?: string;
  selection?: number;
}

export interface MetricCardCommonVariantProps
  extends Pick<
    MetricCardProps,
    | "title"
    | "progress"
    | "goal"
    | "progressSuffix"
    | "goalSuffix"
    | "tooltipContent"
    | "color"
    | "type"
    | "frameworkKey"
  > {
  iconWithColor: ReactNode;
  classNameTitle?: string;
}

export type NoGoalMetricCardContentProps = Pick<
  MetricCardCommonVariantProps,
  | "title"
  | "progress"
  | "progressSuffix"
  | "color"
  | "iconWithColor"
  | "type"
  | "tooltipContent"
  | "classNameTitle"
  | "selection"
>;

export type ProgressBarMetricCardContentProps = Pick<
  MetricCardCommonVariantProps,
  | "title"
  | "progress"
  | "goal"
  | "progressSuffix"
  | "goalSuffix"
  | "color"
  | "iconWithColor"
  | "type"
  | "tooltipContent"
  | "classNameTitle"
>;

export type DonutChartMetricCardContentProps = MetricCardCommonVariantProps;

export interface MultiMetricCardProps {
  title: string;
  status?: ProgressState;
  metrics: MetricCardProps[];
  labelStatus: string;
}
