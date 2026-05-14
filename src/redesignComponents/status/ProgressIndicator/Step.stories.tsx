import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { Step } from "./Step";

const meta = {
  title: "Redesign Components/Status/Progress Indicator/Step",
  component: Step,
  parameters: {
    layout: "padded"
  },
  tags: ["autodocs"],
  argTypes: {
    index: {
      control: "number",
      description: "The step number to display"
    },
    status: {
      control: "select",
      options: ["completed", "active", "available", "disabled", "error"],
      description: "The status of the step"
    },
    label: {
      control: "text",
      description: "The label text for the step"
    }
  }
} satisfies Meta<typeof Step>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completed: Story = {
  args: {
    index: 1,
    status: "completed",
    label: "Label"
  }
};

export const Active: Story = {
  args: {
    index: 1,
    status: "active",
    label: "Label"
  }
};

export const Available: Story = {
  args: {
    index: 1,
    status: "available",
    label: "Label"
  }
};

export const Disabled: Story = {
  args: {
    index: 1,
    status: "disabled",
    label: "Label"
  }
};

export const Error: Story = {
  args: {
    index: 1,
    status: "error",
    label: "Label"
  }
};

const InteractionCell = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={4} minH="7.5rem" justifyContent="center">
      <Flex alignItems="center" gap={2} justifyContent="center">
        {children}
      </Flex>
    </Box>
  );
};

export const AllStatesAndInteractions: Story = {
  args: {
    index: 1,
    status: "active",
    label: "Label"
  },
  render: () => {
    const componentStates: Array<{
      status: "completed" | "active" | "available" | "disabled" | "error";
      name: string;
    }> = [
      { status: "completed", name: "Complete" },
      { status: "active", name: "Active" },
      { status: "available", name: "Available" },
      { status: "disabled", name: "Disabled" },
      { status: "error", name: "Error" }
    ];

    const interactionStates = [
      { name: "Initial", className: "" },
      { name: "Hover", className: "hover" },
      { name: "Pressed", className: "pressed" },
      { name: "Focused", className: "focused" }
    ];

    return (
      <Box p={6} bg="gray.50" borderRadius="lg">
        <Box>
          <SimpleGrid columns={6} gap={4} mb={4}>
            <Box />
            {componentStates.map(state => (
              <Box key={`header-${state.status}`} textAlign="center">
                <Text fontSize="sm" fontWeight="semibold">
                  {state.name}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {interactionStates.map(interaction => (
            <SimpleGrid key={interaction.name} columns={6} gap={4} mb={4}>
              <Box display="flex" alignItems="center" justifyContent="flex-end" pr={4}>
                <Text fontSize="sm" fontWeight="semibold">
                  {interaction.name}
                </Text>
              </Box>
              {componentStates.map(state => (
                <InteractionCell key={`${state.status}-${interaction.name}`}>
                  <Step
                    index={1}
                    status={state.status}
                    label="Label"
                    isFocused={interaction.name === "Focused" && state.status != "disabled"}
                    isHovered={interaction.name === "Hover" && state.status != "disabled"}
                    isPressed={interaction.name === "Pressed" && state.status != "disabled"}
                  />
                </InteractionCell>
              ))}
            </SimpleGrid>
          ))}
        </Box>
      </Box>
    );
  }
};

export const AllStates: Story = {
  args: {
    index: 1,
    status: "active",
    label: "Label"
  },
  render: () => (
    <Box display="flex" gap={6} flexWrap="wrap" alignItems="center" p={4}>
      <Box textAlign="center">
        <Step index={1} status="completed" label="Label" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Completed
        </Text>
      </Box>
      <Box textAlign="center">
        <Step index={1} status="active" label="Label" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Active
        </Text>
      </Box>
      <Box textAlign="center">
        <Step index={1} status="available" label="Label" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Available
        </Text>
      </Box>
      <Box textAlign="center">
        <Step index={1} status="disabled" label="Label" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Disabled
        </Text>
      </Box>
      <Box textAlign="center">
        <Step index={1} status="error" label="Label" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Error
        </Text>
      </Box>
    </Box>
  )
};

export const DifferentStepNumbers: Story = {
  args: {
    index: 1,
    status: "active",
    label: "Label"
  },
  render: () => (
    <Box display="flex" gap={6} flexWrap="wrap" alignItems="center" p={4}>
      <Box textAlign="center">
        <Step index={1} status="active" label="Step 1" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Step 1
        </Text>
      </Box>
      <Box textAlign="center">
        <Step index={2} status="active" label="Step 2" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Step 2
        </Text>
      </Box>
      <Box textAlign="center">
        <Step index={3} status="active" label="Step 3" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Step 3
        </Text>
      </Box>
      <Box textAlign="center">
        <Step index={10} status="active" label="Step 10" />
        <Text fontSize="xs" color="gray.600" mt={2}>
          Step 10
        </Text>
      </Box>
    </Box>
  )
};
