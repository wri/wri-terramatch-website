import "src/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { tx } from "@transifex/native";
import { Toast as WRIToast } from "@worldresources/wri-design-systems";
import * as NextImage from "next/image";
import React from "react";
import { system } from "../src/lib/theme";
import { StoreProvider } from "../src/utils/testStore";
import { BLUR_DATA_URL } from "./constants";

let hasMountedToast = false;

const SingletonToastContainer = () => {
  const isFirstMount = React.useRef(false);

  if (!hasMountedToast) {
    hasMountedToast = true;
    isFirstMount.current = true;
  }

  React.useEffect(() => {
    return () => {
      if (isFirstMount.current) {
        hasMountedToast = false;
      }
    };
  }, []);

  if (!isFirstMount.current) return null;

  return <WRIToast />;
};

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
    value: props => <OriginalNextImage {...props} unoptimized blurDataURL={BLUR_DATA_URL} />
  });
}

export const decorators = [
  (Story, options) => {
    const { parameters } = options;

    return (
      <ChakraProvider value={system}>
        <StoreProvider storeBuilder={parameters.storeBuilder}>
          <SingletonToastContainer />
          <Story {...options} />
        </StoreProvider>
      </ChakraProvider>
    );
  }
];
