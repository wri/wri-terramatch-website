import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useMemo } from "react";

import { ToastType, useToastContext } from "@/context/toast.provider";

const getErrorText = (statusCode?: number) => {
  if (
    statusCode &&
    statusCode >= 400 &&
    statusCode <= 499 &&
    statusCode !== 401 &&
    statusCode !== 403 &&
    statusCode !== 404
  ) {
    // Allow client side errors - should be handled by use case.
    return;
  }

  switch (statusCode) {
    case 401:
    case 403:
      return "Error: Unauthorized action, try logging out and in again";
    case 404:
      return "Error: Could not find resource, try refreshing page";
    case 500:
      return "Error: Unexpected Server Error, try again later";
    case 504:
      return "Error: Server Timeout, try again later";
    default:
      return "Error: Unexpected Error, try again later";
  }
};

const WrappedQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { openToast } = useToastContext();
  const t = useT();

  const queryClient = useMemo(() => {
    const onError = (err: any) => {
      const text = getErrorText(err?.statusCode);
      if (text) {
        openToast(t(getErrorText(err?.statusCode)), ToastType.ERROR);
      }
    };

    return new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          onError
        },
        mutations: {
          onError
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default WrappedQueryClientProvider;
