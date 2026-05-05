import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { system } from "@/lib/theme";
import ApiSlice from "@/store/apiSlice";

const popupQueryClient = new QueryClient();

type PopupProvidersProps = {
  children: ReactNode;
};

const PopupProviders = ({ children }: PopupProvidersProps) => {
  return (
    <ReduxProvider store={ApiSlice.redux}>
      <ChakraProvider value={system}>
        <QueryClientProvider client={popupQueryClient}>{children}</QueryClientProvider>
      </ChakraProvider>
    </ReduxProvider>
  );
};

export default PopupProviders;
