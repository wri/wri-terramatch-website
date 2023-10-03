import { ComponentStory } from "@storybook/react";

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

const Template: ComponentStory<typeof List> = ({
  numberOfItems,
  ...args
}: ListProps<any, any> & { numberOfItems: number }) => {
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
  // @ts-expect-error
  numberOfItems: 5
};
