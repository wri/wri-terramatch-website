import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CommentaryBoxProps as Props } from "./CommentaryBox";
import Component from "./CommentaryBox";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/CommentaryBox",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

export const Default: Story = {
  render: (args: Props) => (
    <div className="flex items-center justify-center p-8">
      <QueryClientProvider client={client}>
        <Component {...args} />
      </QueryClientProvider>
    </div>
  ),
  args: {
    name: "Ricardo",
    lastName: "Saavedra",
    buttonSendOnBox: true
  }
};
