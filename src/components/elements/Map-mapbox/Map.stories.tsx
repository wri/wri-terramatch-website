import { Meta, StoryObj } from "@storybook/react";

import Toast from "@/components/elements/Toast/Toast";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import ModalProvider from "@/context/modal.provider";
import ToastProvider from "@/context/toast.provider";
import Log from "@/utils/log";

import Component from "./Map";
import sampleRaw from "./sample.json";
import sample2Raw from "./sample-2.json";

const sample = sampleRaw as unknown as GeoJSON.FeatureCollection;
const sample2 = sample2Raw as unknown as GeoJSON.FeatureCollection;

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
          <Story />
          <ModalRoot />
          <Toast />
        </ToastProvider>
      </ModalProvider>
    )
  ],
  args: {
    onGeojsonChange: Log.info,
    onError: errors => Log.info(JSON.stringify(errors))
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
