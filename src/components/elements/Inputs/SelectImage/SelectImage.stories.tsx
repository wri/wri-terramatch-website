import { Meta, StoryObj } from "@storybook/react";

import Log from "@/utils/log";

import Component from "./SelectImage";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/SelectImage",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    label: "Select Image label",
    description: "Select Image description",
    placeholder: "placeholder",
    onChange: Log.info,
    options: [
      {
        title: "Option 1",
        value: 1,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      },
      {
        title: "Option 2",
        value: 2,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      },
      {
        title: "Option 3",
        value: 3,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      },
      {
        title: "Option 4",
        value: 4,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      },
      {
        title: "Option 5",
        value: 5,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      },
      {
        title: "Option 6",
        value: 6,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      },
      {
        title: "Option 7",
        value: 7,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      },
      {
        title: "Option 8",
        value: 8,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      },
      {
        title: "Option 9",
        value: 9,
        meta: {
          image_url:
            "https://cdn.britannica.com/98/214598-050-9879F2FA/giant-sequoia-tree-Sequoia-National-Park-California.jpg"
        }
      }
    ]
  }
};
