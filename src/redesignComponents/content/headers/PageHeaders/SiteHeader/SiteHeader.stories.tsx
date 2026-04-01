import type { Meta, StoryObj } from "@storybook/react";

import { SiteFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import SiteHeader, { SiteHeaderProps } from "./SiteHeader";

const meta: Meta<typeof SiteHeader> = {
  title: "Redesign Components/Content/Headers/Site Header",
  component: SiteHeader,
  tags: ["autodocs"],
  argTypes: {
    site: {
      control: "object",
      description: "The site data object"
    }
  }
};

export default meta;

type Story = StoryObj<SiteHeaderProps>;

const baseSite: SiteFullDto = {
  organisationName: "Organisation Name",
  projectName: "Project Name",
  projectUuid: "00000000-0000-0000-0000-000000000000",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vestibulum in lorem in rutrum. Vestibulum in dictum turpis, id congue augue. Aliquam aliquam turpis iaculis bibendum fermentum. Nam pretium viverra ante, vel posuere arcu porttitor quis. Pellentesque a porttitor purus, a molestie orci. Quisque sodales porttitor",
  startDate: "2024-01-01",
  endDate: "2026-12-31",
  name: "Site Name",
  uuid: "550e8400-e29b-41d4-a716-446655440099",
  status: "approved",
  updateRequestStatus: "no-update",
  plantingStatus: "in-progress",
  restorationStrategy: "Tree Planting",
  landUseTypes: "Agroforesty",
  feedback: null
} as unknown as SiteFullDto;

export const Default: Story = {
  args: {
    site: {
      ...baseSite
    }
  }
};

export const WithoutLandUseTypes: Story = {
  args: {
    site: {
      ...baseSite,
      landUseTypes: null
    }
  }
};

export const WithoutStatus: Story = {
  args: {
    site: {
      ...baseSite,
      landUseTypes: null,
      restorationStrategy: null,
      description: null
    }
  }
};
