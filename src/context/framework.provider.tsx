import { createContext, ReactNode, useContext } from "react";

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

export default FrameworkProvider;
