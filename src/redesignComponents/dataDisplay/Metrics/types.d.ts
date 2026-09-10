import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import type { ProgressState } from "../../actions/Tags/ProgressTag/ProgressTag";
export interface DonutChartProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  progress: number;
  size?: number;
  color?: string;
  backgroundColor?: string;
  children?: ReactNode;
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
  filtered?: number;
  metricLabel?: string;
  widthProgressBar?: string;
}

type MetricCardFieldsForContentVariants =
  | "title"
  | "progress"
  | "progressLabel"
  | "goal"
  | "progressSuffix"
  | "goalSuffix"
  | "tooltipContent"
  | "color"
  | "type"
  | "frameworkKey"
  | "metricLabel"
  | "widthProgressBar";

export interface MetricCardCommonVariantProps extends Pick<MetricCardProps, MetricCardFieldsForContentVariants> {
  iconWithColor: ReactNode;
  classNameTitle?: string;
}

type NoGoalMetricCardContentKeys =
  | "title"
  | "progress"
  | "progressLabel"
  | "progressSuffix"
  | "color"
  | "iconWithColor"
  | "type"
  | "tooltipContent"
  | "classNameTitle"
  | "metricLabel";

export type NoGoalMetricCardContentProps = Pick<MetricCardCommonVariantProps, NoGoalMetricCardContentKeys>;

type ProgressBarMetricCardContentKeys =
  | "title"
  | "progress"
  | "progressLabel"
  | "goal"
  | "progressSuffix"
  | "goalSuffix"
  | "color"
  | "iconWithColor"
  | "type"
  | "tooltipContent"
  | "classNameTitle"
  | "metricLabel"
  | "widthProgressBar";

export type ProgressBarMetricCardContentProps = Pick<MetricCardCommonVariantProps, ProgressBarMetricCardContentKeys>;

export type DonutChartMetricCardContentProps = MetricCardCommonVariantProps;
export interface MultiMetricCardProps {
  title: string;
  status?: ProgressState;
  metrics: MetricCardProps[];
  labelStatus: string;
}
