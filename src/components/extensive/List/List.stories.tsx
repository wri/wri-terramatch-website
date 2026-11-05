import { StoryFn } from "@storybook/react";

import List, { ListProps } from "./List";

export default {
  title: "Components/Extensive/List",
  component: List,
  argTypes: {
    numberOfItems: {
      type: "number",
      default: 5
    }
  }
};

const Template: StoryFn<ListProps<any, any> & { numberOfItems: number }> = ({ numberOfItems, ...args }) => {
  const items: any[] = Array.from({ length: numberOfItems }, (_, i) => ({ key: i + 1 }));

  return (
    <List
      {...args}
      items={items}
      render={(item: any) => (
        <div className="mb-2 flex h-20 w-20 items-center justify-center rounded bg-primary-400 shadow">{item.key}</div>
      )}
    />
  );
};

export const _List = Template.bind({});

_List.args = {
  numberOfItems: 5
};
