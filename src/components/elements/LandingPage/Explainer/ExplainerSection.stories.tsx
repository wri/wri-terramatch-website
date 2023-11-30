import { Meta, StoryObj } from "@storybook/react";

import { IconNames } from "@/components/extensive/Icon/Icon";

import Component from ".";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/LandingPage/ExplainerSection",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    items: [
      {
        title: "1. Apply for Funding",
        description:
          "We are working with hundreds of funders in the restoration space who are eager to support locally-led projects. We will host requests for proposals on TerraMatch when new rounds of capital are ready to be deployed.",
        iconName: IconNames.USER_CIRCLE
      },
      {
        title: "2. Find Support",
        description:
          "TerraMatch is committed to support restoration project developers grow. We will host applications cohort-based accelerator programs for those who are looking to level up their operations and offer guidance for those who do not match with any of our programs",
        iconName: IconNames.DOCUMENT_CIRCLE
      },
      {
        title: "3. Report + Monitor",
        description:
          "Funders who are looking to invest in planting trees the right way rely on TerraMatch’s monitoring and reporting capabilities, which marry the best in field-collected data with cutting-edge satellite insights, to ensure that their investments in locally led restoration have a real impact on communities and ecosystems.",
        iconName: IconNames.TREE_CIRCLE
      }
    ]
  }
};
