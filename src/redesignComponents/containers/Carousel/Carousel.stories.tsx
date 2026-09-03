import { Box, Text } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MetricCard from "@/redesignComponents/dataDisplay/Metrics/MetricCard";
import { AreaHectaresIcon, JobsIcon, TreeIcon } from "@/redesignComponents/foundations/Icons";

import Carousel from "./Carousel";

const meta: Meta<typeof Carousel> = {
  title: "Redesign Components/Containers/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Horizontal carousel that shows left/right controls only when the content overflows its container."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const OverflowItems = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }, (_, index) => (
      <Button key={index} variant="secondary" size="small" className="shrink-0">
        <Text textStyle="200-bold">Item {index + 1}</Text>
      </Button>
    ))}
  </>
);

export const Default: Story = {
  name: "Overflowing content",
  render: () => (
    <Box maxW="28rem">
      <Carousel>
        <OverflowItems count={12} />
      </Carousel>
    </Box>
  )
};

export const WithoutOverflow: Story = {
  name: "Fits without scrolling",
  render: () => (
    <Box maxW="28rem">
      <Carousel>
        <OverflowItems count={2} />
      </Carousel>
    </Box>
  )
};

export const MetricCardsOverflow: Story = {
  name: "Metric cards overflow",
  render: () => (
    <Box maxW="40rem">
      <Carousel gap={4}>
        <MetricCard
          title="Trees Growing"
          progress={624000}
          goal={1000000}
          variant="progressBar"
          widthProgressBar="5rem"
          icon={<TreeIcon />}
          color="secondary.600"
          filtered={113455}
          selection={56727}
          className="min-w-fit shrink-0 flex-1"
        />
        <MetricCard
          title="Area restored (Ha)"
          progress={2460}
          goal={4000}
          variant="progressBar"
          widthProgressBar="5rem"
          color="secondary.700"
          icon={<AreaHectaresIcon />}
          filtered={447}
          selection={224}
          className="min-w-fit shrink-0 flex-1"
        />
        <MetricCard
          title="Workdays"
          progress={18800}
          goal={30000}
          variant="progressBar"
          widthProgressBar="5rem"
          icon={<JobsIcon />}
          filtered={3418}
          selection={1709}
          className="min-w-fit shrink-0 flex-1"
        />
      </Carousel>
    </Box>
  )
};
