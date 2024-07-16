import { ComponentType, createContext, ReactNode, useContext } from "react";

export enum Framework {
  PPC = "ppc",
  TF = "terrafund",
  TF_LANDSCAPES = "terrafund-landscapes",
  ENTERPRISES = "enterprises",
  HBF = "hbf",

  UNDEFINED = "undefined"
}

interface IFrameworkContext {
  framework: Framework;
}

export const FrameworkContext = createContext<IFrameworkContext>({
  framework: Framework.UNDEFINED
});

type FrameworkProviderProps = { children: ReactNode; frameworkKey?: string };

const FrameworkProvider = ({ children, frameworkKey }: FrameworkProviderProps) => {
  const framework = Object.values(Framework).includes(frameworkKey as unknown as Framework)
    ? (frameworkKey as Framework)
    : Framework.UNDEFINED;

  return <FrameworkContext.Provider value={{ framework }}>{children}</FrameworkContext.Provider>;
};

export const useFrameworkContext = () => useContext(FrameworkContext);

export interface ShowHideProps {
  // The element will only be shown if the current framework is in this list.
  show?: Framework[];
  // The element will only be shown if the current framework is not in this list. `hide` will be
  // ignored if `show` is also included.
  hide?: Framework[];
}

export const useFrameworkShowHide = ({ show, hide }: ShowHideProps) => {
  const { framework } = useFrameworkContext();

  if (show != null) return show.includes(framework);
  if (hide != null) return !hide.includes(framework);
  return true;
};

export function withFrameworkShow<T>(WrappedComponent: ComponentType<T>) {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? "Component";
  const FrameworkShowHide = (props: T & ShowHideProps) => {
    const { show, hide, ...rest } = props;
    if (!useFrameworkShowHide({ show, hide })) return null;

    return <WrappedComponent {...(rest as T & JSX.IntrinsicAttributes)} />;
  };
  FrameworkShowHide.displayName = `withFrameworkShow(${displayName})`;
  return FrameworkShowHide;
}

export default FrameworkProvider;
