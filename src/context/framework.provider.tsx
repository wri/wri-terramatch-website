import { ComponentType, createContext, ReactNode, useContext, useMemo } from "react";
import { useShowContext } from "react-admin";

export enum Framework {
  PPC = "ppc",
  TF = "terrafund",
  TF_LANDSCAPES = "terrafund-landscapes",
  ENTERPRISES = "enterprises",
  HBF = "hbf",
  EPA_GHANA_PILOT = "epa-ghana-pilot",
  FF = "fundo-flora",

  UNDEFINED = "undefined"
}

export const ALL_TF = [Framework.TF, Framework.TF_LANDSCAPES, Framework.ENTERPRISES] as const;
export const isTerrafund = (framework: Framework) => ALL_TF.includes(framework as (typeof ALL_TF)[number]);

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
