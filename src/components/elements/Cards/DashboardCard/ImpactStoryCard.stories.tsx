import { Meta, StoryObj } from "@storybook/react";

import ImpactStoryCard from "./ImpactStoryCard";

const meta: Meta<typeof ImpactStoryCard> = {
  title: "Components/Elements/Cards/ImpactStoryCard",
  component: ImpactStoryCard
};

export default meta;
type Story = StoryObj<typeof ImpactStoryCard>;

export const Default: Story = {
  args: {
    title: "Impact Story Title",
    description: "This is a brief description of the impact story.",
    image: "https://via.placeholder.com/150"
  }
};
