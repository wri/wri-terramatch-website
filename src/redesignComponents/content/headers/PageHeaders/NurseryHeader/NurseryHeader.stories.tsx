import type { Meta, StoryObj } from "@storybook/react";

import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import NurseryHeader, { NurseryHeaderProps } from "./NurseryHeader";

const meta: Meta<typeof NurseryHeader> = {
  title: "Redesign Components/Content/Headers/Nursery Header",
  component: NurseryHeader,
  tags: ["autodocs"],
  argTypes: {
    nursery: {
      control: "object",
      description: "The nursery data object"
    }
  }
};

export default meta;

type Story = StoryObj<NurseryHeaderProps>;

const baseNursery: NurseryFullDto = {
  organisationName: "Organisation Name",
  projectName: "Project Name",
  projectUuid: "00000000-0000-0000-0000-000000000000",
  plantingContribution:
    "The Arable Nursery plays a central role in the restoration work in Songa forest and village. The trees planted here are trees in local demand such as fruit trees (Mangoes, citrus, avocadoes, pawpaw etc.) for food, commercial purposes and shade for the target households. trees for livestock feeds such as Leucaena fodder tree and others that are medicinal such as neem tree and moringa are included. These tree species are also.",
  startDate: "2024-01-01",
  endDate: "2026-12-31",
  name: "Nursery Name"
} as unknown as NurseryFullDto;

export const Default: Story = {
  args: {
    nursery: {
      ...baseNursery,
      type: "building"
    }
  }
};

export const BuildingNursery: Story = {
  args: {
    nursery: {
      ...baseNursery,
      type: "building"
    }
  }
};

export const ExpandingNursery: Story = {
  args: {
    nursery: {
      ...baseNursery,
      type: "expanding"
    }
  }
};

export const ManagingNursery: Story = {
  args: {
    nursery: {
      ...baseNursery,
      type: "managing"
    }
  }
};

export const WithoutType: Story = {
  args: {
    nursery: {
      ...baseNursery,
      plantingContribution: null,
      type: null
    }
  }
};
