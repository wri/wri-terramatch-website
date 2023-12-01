import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useState } from "react";

import { ToastType, useToastContext } from "@/context/toast.provider";

const WrappedQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { openToast } = useToastContext();
  const t = useT();
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
        return t("Error: Unauthorized action, try logging out and in again");
      case 404:
        return t("Error: Could not find resource, try refreshing page");
      case 500:
        return t("Error: Unexpected Server Error, try again later");
      case 504:
        return t("Error: Server Timeout, try again later");
      default:
        return t("Error: Unexpected Error, try again later");
    }
  };

  const [queryClient] = useState(() => {
    const onError = (err: any) => {
      const text = getErrorText(err?.statusCode);
      if (text) {
        openToast(getErrorText(err?.statusCode), ToastType.ERROR);
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
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default WrappedQueryClientProvider;
