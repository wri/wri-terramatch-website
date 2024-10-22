import { faker } from "@faker-js/faker";
import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Toast from "@/components/elements/Toast/Toast";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import ModalProvider from "@/context/modal.provider";
import ToastProvider from "@/context/toast.provider";

import Component from "./Map";
import sample from "./sample.json";
import sample2 from "./sample-2.json";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Mapbox",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  decorators: [
    Story => (
      <ModalProvider>
        <ToastProvider>
          <QueryClientProvider client={new QueryClient()}>
            <Story />
            <ModalRoot />
            <Toast />
          </QueryClientProvider>
        </ToastProvider>
      </ModalProvider>
    )
  ],
  args: {
    onGeojsonChange: console.log,
    onError: errors => console.log(JSON.stringify(errors))
  }
};

export const Editable: Story = {
  ...Default,
  args: {
    ...Default.args,
    editable: true
  }
};

export const PreLoaded: Story = {
  ...Default,
  args: {
    ...Default.args,
    geojson: sample,
    editable: true
  }
};

export const PreLoaded2: Story = {
  ...Default,
  args: {
    ...Default.args,
    geojson: sample2
  }
};

export const PreLoadedWithImages: Story = {
  args: {
    ...Default.args,
    imageLayerGeojson: {
      type: "FeatureCollection",
      features: faker.helpers.multiple(
        () => ({
          type: "Feature",
          properties: {
            id: faker.string.uuid(),
            image_url: faker.image.url({ width: 512, height: 512 }),
            thumb_url: faker.image.url({ width: 128, height: 128 })
          },
          geometry: {
            type: "Point",
            coordinates: [faker.location.longitude(), faker.location.latitude()]
          }
        }),
        { count: 200 }
      )
    }
  }
};

export const PreLoadedWithImagesAndPolygons: Story = {
  args: {
    ...Default.args,
    geojson: sample2,
    imageLayerGeojson: {
      type: "FeatureCollection",
      features: faker.helpers.multiple(
        () => ({
          type: "Feature",
          properties: {
            id: faker.string.uuid(),
            image_url: faker.image.url({ width: 128, height: 128 })
          },
          geometry: {
            type: "Point",
            coordinates: [
              faker.location.longitude({ min: 14.5, max: 16 }),
              faker.location.latitude({ min: 23, max: 24 })
            ]
          }
        }),
        { count: 200 }
      )
    }
  }
};
