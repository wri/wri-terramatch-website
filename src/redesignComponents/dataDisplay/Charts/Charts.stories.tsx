import { Meta, StoryObj } from "@storybook/react";

import ChartCard from "./ChartCard";
import ChartEmptyState from "./ChartEmptyState";
import ChartLegend from "./ChartLegend";
import { CHART_COLORS } from "./chartTheme";
import ChartTooltip from "./ChartTooltip";

const meta: Meta<typeof ChartCard> = {
  title: "Redesign Components/Data Display/Charts",
  component: ChartCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Building blocks for Recharts-based charts styled with the WRI design system: a card wrapper, a legend and a hover tooltip."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof ChartCard>;

const LEGEND_ITEMS = [
  { label: "Revenue", color: CHART_COLORS.positive },
  { label: "Expenses", color: CHART_COLORS.neutralPassive },
  { label: "Net Profit", color: CHART_COLORS.neutralActive }
];

export const Card: Story = {
  render: () => (
    <ChartCard title="Net Profit" subtitle="Annual revenue, expenses, and net profit (USD)" maxWidth="28rem">
      <div style={{ height: "13.5rem", background: CHART_COLORS.cursor }} />
      <ChartLegend items={LEGEND_ITEMS} />
    </ChartCard>
  )
};

export const Legend: Story = {
  render: () => <ChartLegend items={LEGEND_ITEMS} />
};

export const TooltipList: Story = {
  render: () => (
    <ChartTooltip
      title="2023"
      rows={[
        { label: "Ratio", value: "0.49", color: CHART_COLORS.negative },
        { label: "Assets", value: "$120,000", dividerBefore: true },
        { label: "Liabilities", value: "$245,000" }
      ]}
    />
  )
};

export const TooltipHighlight: Story = {
  render: () => (
    <ChartTooltip variant="highlight" title="2023" rows={[{ label: "Capital Raised", value: "$123,000" }]} />
  )
};

export const EmptyState: Story = {
  render: () => (
    <ChartCard title="Operating Budget" subtitle="Annual operating budget (USD)" maxWidth="28rem">
      <ChartEmptyState message="No operating budget has been reported yet." />
    </ChartCard>
  )
};
