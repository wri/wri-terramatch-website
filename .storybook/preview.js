import "src/styles/globals.css";
import * as NextImage from "next/image";
import { ChakraProvider } from "@chakra-ui/react";
import { tx } from "@transifex/native";
import { StoreProvider } from "../src/utils/testStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { system } from "../src/lib/theme";
import { BLUR_DATA_URL } from "./constants";

const client = new QueryClient();

// Initialize Transifex (same as in _app.tsx)
tx.init({
  token: process.env.NEXT_PUBLIC_TRANSIFEX_TOKEN
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

// https://dev.to/jonasmerlin/how-to-use-the-next-js-image-component-in-storybook-1415
const OriginalNextImage = NextImage.default;

const descriptor = Object.getOwnPropertyDescriptor(NextImage, "default");
if (!descriptor || descriptor.configurable) {
  Object.defineProperty(NextImage, "default", {
    configurable: true,
    value: props => (
      <OriginalNextImage
        {...props}
        unoptimized
        blurDataURL={BLUR_DATA_URL}
      />
    )
  });
}

export const decorators = [
  (Story, options) => {
    const { parameters } = options;

    return (
      <ChakraProvider value={system}>
        <QueryClientProvider client={client}>
          <StoreProvider storeBuilder={parameters.storeBuilder}>
            <Story {...options} />
          </StoreProvider>
        </QueryClientProvider>
      </ChakraProvider>
    );
  }
];
