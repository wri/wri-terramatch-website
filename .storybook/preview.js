import "src/styles/globals.css";
import * as NextImage from "next/image";
import { ChakraProvider } from "@chakra-ui/react";
import { StoreProvider } from "../src/utils/testStore";
import { system } from "../src/lib/theme";

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
        blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAbEAADAAMBAQAAAAAAAAAAAAABAgMABAURUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAECEf/aAAwDAQACEQMRAD8Anz9voy1dCI2mectSE5ioFCqia+KCwJ8HzGMZPqJb1oPEf//Z"
      />
    )
  });
}

export const decorators = [
  (Story, options) => {
    const { parameters } = options;

    return (
      <ChakraProvider value={system}>
        <StoreProvider storeBuilder={parameters.storeBuilder}>
          <Story {...options} />
        </StoreProvider>
      </ChakraProvider>
    );
  }
];
