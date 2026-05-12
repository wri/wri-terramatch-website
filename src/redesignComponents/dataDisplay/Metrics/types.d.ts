import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import type { ProgressState } from "../../actions/Tags/ProgressTag/ProgressTag";

// -----------------------------------------------------------------------------
// Chart primitives (layout / DOM props + numeric display)
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// MetricCard — public surface
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// MetricCard — props passed into inner content layouts (module-local aliases)
// -----------------------------------------------------------------------------

type MetricCardFieldsForContentVariants =
  | "title"
  | "progress"
  | "goal"
  | "progressSuffix"
  | "goalSuffix"
  | "tooltipContent"
  | "color"
  | "type"
  | "frameworkKey"
  | "selection";

export interface MetricCardCommonVariantProps extends Pick<MetricCardProps, MetricCardFieldsForContentVariants> {
  iconWithColor: ReactNode;
  classNameTitle?: string;
}

type NoGoalMetricCardContentKeys =
  | "title"
  | "progress"
  | "progressSuffix"
  | "color"
  | "iconWithColor"
  | "type"
  | "tooltipContent"
  | "classNameTitle"
  | "selection";

export type NoGoalMetricCardContentProps = Pick<MetricCardCommonVariantProps, NoGoalMetricCardContentKeys>;

type ProgressBarMetricCardContentKeys =
  | "title"
  | "progress"
  | "goal"
  | "progressSuffix"
  | "goalSuffix"
  | "color"
  | "iconWithColor"
  | "type"
  | "tooltipContent"
  | "classNameTitle";

export type ProgressBarMetricCardContentProps = Pick<MetricCardCommonVariantProps, ProgressBarMetricCardContentKeys>;

export type DonutChartMetricCardContentProps = MetricCardCommonVariantProps;

// -----------------------------------------------------------------------------
// MultiMetricCard
// -----------------------------------------------------------------------------

export interface MultiMetricCardProps {
  title: string;
  status?: ProgressState;
  metrics: MetricCardProps[];
  labelStatus: string;
}
