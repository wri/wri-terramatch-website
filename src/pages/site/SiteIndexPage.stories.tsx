import type { Meta, StoryObj } from "@storybook/react";

import SiteIndexPage from "./index.page";

const meta: Meta<typeof SiteIndexPage> = {
  title: "Pages/Sites/Site Index Mock",
  component: SiteIndexPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      router: {
        pathname: "/site",
        asPath: "/site"
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
