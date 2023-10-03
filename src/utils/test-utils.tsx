import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as rtlRender } from "@testing-library/react";
import { FC } from "react";

interface WrapperProps {
  children?: React.ReactNode;
}

function render(ui: JSX.Element, { ...renderOptions } = {}) {
  const Wrapper: FC<WrapperProps> = ({ children }) => {
    return (
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                refetchOnWindowFocus: false,
                useErrorBoundary: true
              }
            }
          })
        }
      >
        {children}
      </QueryClientProvider>
    );
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

const wait = (time: number) => new Promise(r => setTimeout(r, time));

// re-export everything
export * from "@testing-library/react";

// override render method
export { render, wait };
