import { useShowContext } from "ra-core";
import { type JSX, ComponentType, createContext, ReactNode, useContext, useMemo } from "react";

import { Frameworks } from "@/generated/v3/userService/userServiceConstants";

export enum Framework {
  PPC = "ppc",
  TF_NON_PROFITS = "terrafund-non-profits",
  TF_ENTERPRISES = "terrafund-enterprises",
  HBF = "hbf",
  EPA_GHANA_PILOT = "epa-ghana-pilot",
  FUNDO_FLORA = "fundo-flora",
  WCB = "wcb",
  BARKA_FUND = "barka-fund",
  POLYGON_MONITORING = "polygon-monitoring",

  UNDEFINED = "undefined"
}

type ApiFrameworkKey = keyof typeof Frameworks.FRAMEWORK_NAMES;
type AssertNever<T extends never> = T;

/**
 * Fails to compile if the Framework enum drifts from the framework keys defined by the BE (regenerated
 * from the v3 API on build). When this breaks, add or remove the mismatched member(s) in the enum above.
 */
export type FrameworkEnumMatchesApi = AssertNever<
  Exclude<ApiFrameworkKey, `${Framework}`> | Exclude<`${Framework}`, ApiFrameworkKey | `${Framework.UNDEFINED}`>
>;

export const ALL_TF = [Framework.TF_NON_PROFITS, Framework.TF_ENTERPRISES];
export const isTerrafund = (framework: Framework) => ALL_TF.includes(framework as (typeof ALL_TF)[number]);

/** TerraFund for AFR100 project banner logo: Non-Profits, Enterprises, EPA-Ghana only */
export const TERRAFUND_AFR100_BANNER_LOGO_FRAMEWORKS: readonly Framework[] = [
  Framework.TF_NON_PROFITS,
  Framework.TF_ENTERPRISES,
  Framework.EPA_GHANA_PILOT
];

export const FRAMEWORKS_WITHOUT_NURSERIES: readonly Framework[] = [Framework.PPC, Framework.HBF];

export const shouldHideNurseries = (framework: Framework) => FRAMEWORKS_WITHOUT_NURSERIES.includes(framework);

export const toFramework = (frameworkKey?: string | null) =>
  Object.values(Framework).includes(frameworkKey as unknown as Framework)
    ? (frameworkKey as Framework)
    : Framework.UNDEFINED;

export const useFramework = (frameworkKey?: string | null) => useMemo(() => toFramework(frameworkKey), [frameworkKey]);

interface IFrameworkContext {
  framework: Framework;
}

export const FrameworkContext = createContext<IFrameworkContext>({
  framework: Framework.UNDEFINED
});

type FrameworkProviderProps = { children: ReactNode; frameworkKey?: string | null };

const FrameworkProvider = ({ children, frameworkKey }: FrameworkProviderProps) => {
  const framework = useFramework(frameworkKey);
  return <FrameworkContext.Provider value={{ framework }}>{children}</FrameworkContext.Provider>;
};

export const useFrameworkContext = () => useContext(FrameworkContext);

export interface ShowHideProps {
  // The element will only be shown if the current framework is in this list.
  frameworksShow?: readonly Framework[];
  // The element will only be shown if the current framework is not in this list. `hide` will be
  // ignored if `show` is also included.
  frameworksHide?: readonly Framework[];
}

export const useFrameworkShowHide = ({ frameworksShow, frameworksHide }: ShowHideProps) => {
  const { framework } = useFrameworkContext();

  if (frameworksShow != null) return frameworksShow.includes(framework);
  if (frameworksHide != null) return !frameworksHide.includes(framework);
  return true;
};

export function withFrameworkShow<T>(WrappedComponent: ComponentType<T>) {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";
  const FrameworkShowHide = (props: T & ShowHideProps) => {
    const { frameworksShow, frameworksHide, ...rest } = props;
    if (!useFrameworkShowHide({ frameworksShow, frameworksHide })) return null;

    return <WrappedComponent {...(rest as T & JSX.IntrinsicAttributes)} />;
  };
  FrameworkShowHide.displayName = `withFrameworkShow(${displayName})`;
  return FrameworkShowHide;
}

export function RecordFrameworkProvider({ children }: { children: ReactNode }) {
  const { record } = useShowContext();
  return <FrameworkProvider frameworkKey={record?.framework_key ?? record?.frameworkKey}>{children}</FrameworkProvider>;
}

export default FrameworkProvider;
