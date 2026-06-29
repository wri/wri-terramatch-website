import { ChakraProvider } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { system } from "@/lib/theme";
import ApiSlice from "@/store/apiSlice";

type PopupProvidersProps = {
  children: ReactNode;
};

const PopupProviders: FC<PopupProvidersProps> = ({ children }) => {
  return (
    <ReduxProvider store={ApiSlice.redux}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ReduxProvider>
  );
};

export default PopupProviders;
