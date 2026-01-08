import { Meta, StoryObj } from "@storybook/react";

import Accordion from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Redesign Terramatch/Accordion",
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: "Accordion component built on top of ExtendableCard from WRI Design Systems."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const header = (
  <div className="flex w-full items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[16px] leading-[24px] text-[#1A1919]">Label:</span>
        <span className="text-[20px] leading-[28px] text-[#032230]">Header Title</span>
      </div>
      <div className="rounded-full border bg-[#032230] px-2 py-1">
        <span className="font-inter flex text-[14px] font-bold leading-[20px] text-[#ffffff]">Label</span>
      </div>
    </div>
    <div className="rounded border px-2 py-1.5">
      <span className="font-inter flex text-[12px] font-bold leading-[16px] text-[#3D3B3B]">Label</span>
    </div>
  </div>
);

export const Default: Story = {
  args: {
    header: header,
    children: "This is the accordion content. You can put any content here."
  }
};

export const LongContent: Story = {
  args: {
    header: header,
    children: (
      <div>
        <p>This is a longer content example.</p>
        <p>You can include multiple paragraphs, lists, or any other React components.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    )
  }
};
