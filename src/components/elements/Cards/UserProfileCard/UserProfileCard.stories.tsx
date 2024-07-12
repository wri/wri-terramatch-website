import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Component from "./UserProfileCard";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Cards/UserProfileCard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

export const Default: Story = {
  decorators: [
    Story => {
      return (
        <div className="w-[200px]">
          <QueryClientProvider client={client}>
            <Story />
          </QueryClientProvider>
        </div>
      );
    }
  ],
  args: {
    imageUrl: "https://headshots-inc.com/wp-content/uploads/2020/11/Professional-Headshot-Poses-Blog-Post.jpg",
    status: "Pending",
    username: "johndoe",
    organisation: "SaveTheTrees",
    email: "johndoe@mail.com"
  }
};

export const NoImage: Story = {
  decorators: [
    Story => {
      return (
        <div className="w-[200px]">
          <QueryClientProvider client={client}>
            <Story />
          </QueryClientProvider>
        </div>
      );
    }
  ],
  args: {
    status: "Accepted",
    username: "janedoe",
    organisation: "WeLoveTrees",
    email: "jane@mail.com"
  }
};
