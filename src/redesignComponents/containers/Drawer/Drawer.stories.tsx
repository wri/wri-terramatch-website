import { Flex, Text } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";
import { Tag } from "@worldresources/wri-design-systems";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";

import Checkbox from "../../Forms/Actions/Checkbox/Checkbox";
import Search from "../../Forms/Actions/Search/Search";
import CheckboxList from "../../Forms/Inputs/CheckboxList";
import FilterPanel from "../FilterPanel/FilterPanel";
import FilterCard from "../FilterPanel/FilterPanelElements/FilteCards";
import Drawer from "./Drawer";

const meta: Meta<typeof Drawer> = {
  title: "Redesign Components/Containers/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    trigger: {
      control: "text"
    },
    children: {
      control: "text"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const sampleOptions = [
  { label: "Option 1", value: "1" },
  { label: "Option 2", value: "2" },
  { label: "Option 3", value: "3" }
];

export const DrawerDefault: Story = {
  args: {
    trigger: <Button>Open Drawer</Button>,
    children: ({ onClose }) => (
      <Flex flexDirection="column" gap={4} padding={4}>
        <Flex gap={2} justifyContent="space-between">
          <Text>Title</Text>
          <CloseButton onClick={onClose} />
        </Flex>
        <Flex>Content</Flex>
      </Flex>
    )
  }
};

export const DrawerFilterPanel: Story = {
  args: {
    trigger: <Button>Open Drawer</Button>,
    children: ({ onClose }) => (
      <FilterPanel
        title="Filters"
        variant="fixed"
        onClose={onClose}
        className="h-screen"
        content={
          <>
            <Search options={sampleOptions} placeholder="Search" />
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <Tag variant="info-white" label="Label" closable />
              <Tag variant="info-white" label="Label 1" closable />
            </div>
            <FilterCard label="Label" caption="Caption">
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    marginBottom: "40px"
                  }}
                >
                  <Checkbox name="Checkbox" value="1" defaultChecked>
                    Label
                  </Checkbox>
                  <CheckboxList
                    label={{ type: "checkbox", label: "Label", name: "all" }}
                    checkboxes={[
                      {
                        children: "Label",
                        name: "checkbox-1",
                        value: "checkbox-1"
                      },
                      {
                        children: "Label",
                        name: "checkbox-2",
                        value: "checkbox-2"
                      },
                      {
                        children: "Label",
                        name: "checkbox-3",
                        value: "checkbox-3"
                      }
                    ]}
                  />

                  <CheckboxList
                    label={{ type: "checkbox", label: "Label", name: "all" }}
                    checkboxes={[
                      {
                        children: "Label",
                        name: "checkbox-1",
                        value: "checkbox-1"
                      },
                      {
                        children: "Label",
                        name: "checkbox-2",
                        value: "checkbox-2"
                      },
                      {
                        children: "Label",
                        name: "checkbox-3",
                        value: "checkbox-3"
                      },
                      {
                        children: "Label",
                        name: "checkbox-4",
                        value: "checkbox-4"
                      },
                      {
                        children: "Label",
                        name: "checkbox-5",
                        value: "checkbox-5"
                      }
                    ]}
                  />
                  <Checkbox name="Checkbox2" value="1" defaultChecked>
                    Label
                  </Checkbox>
                  <Checkbox name="Checkbox3" value="1" defaultChecked>
                    Label
                  </Checkbox>
                </div>
              </div>
            </FilterCard>
            <FilterCard label="Label" caption="Caption">
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    marginBottom: "40px"
                  }}
                >
                  <Checkbox name="Checkbox" value="1" defaultChecked>
                    Label
                  </Checkbox>

                  <Checkbox name="Checkbox2" value="1" defaultChecked>
                    Label
                  </Checkbox>
                  <Checkbox name="Checkbox3" value="1" defaultChecked>
                    Label
                  </Checkbox>
                </div>
              </div>
            </FilterCard>
          </>
        }
        footer={
          <ButtonGroup
            className=""
            buttons={[
              {
                children: "Clear All",
                variant: "secondary"
              },
              {
                children: "Apply",
                variant: "primary"
              }
            ]}
          />
        }
      />
    )
  }
};
