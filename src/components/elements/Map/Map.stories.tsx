import { Meta, StoryObj } from "@storybook/react";

import Component from "./Map";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Map",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const View: Story = {
  args: {
    t: (t: string) => t,
    captureInterventionTypes: true,
    geojson: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            shape: "Polygon",
            name: "Unnamed Layer",
            category: "default"
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-73.998832, 40.715013],
                [-73.998606, 40.713582],
                [-73.997608, 40.713996],
                [-73.997201, 40.714655],
                [-73.998832, 40.715013]
              ]
            ]
          },
          id: "af16e5ff-38a5-4d41-9441-bc964a8c5cdb"
        }
      ]
    }
  }
};

export const EditView: Story = {
  args: {
    ...View.args,
    editMode: true
  }
};
