import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "@worldresources/wri-design-systems";

import { TranslatedText } from "@/i18n/types";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";

import Checkbox from "../../Forms/Actions/Checkbox/Checkbox";
import Search from "../../Forms/Actions/Search/Search";
import CheckboxList from "../../Forms/Inputs/CheckboxList";
import { LanguageIcon } from "../../foundations/Icons";
import FilterPanel from "./FilterPanel";
import FilterCard from "./FilterPanelElements/FilteCards";

const sampleOptions = [
  {
    id: "1",
    label: "Location Name 1",
    caption: "City • Address",
    icon: <LanguageIcon />
  },
  {
    id: "2",
    label: "Location Name 2",
    caption: "City • Address",
    icon: <LanguageIcon />
  },
  {
    id: "3",
    label: "Location Name 3",
    caption: "City • Address",
    icon: <LanguageIcon />
  },
  {
    id: "4",
    label: "Location Name 4",
    caption: "City • Address",
    icon: <LanguageIcon />
  },
  {
    id: "5",
    label: "Location Name 5",
    caption: "City • Address",
    icon: <LanguageIcon />
  }
];

const meta = {
  title: "Redesign Components/Containers/Panel/Filter Panel",
  component: FilterPanel,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Filters" as TranslatedText,
    content: <></>
  },
  render: function Render(args) {
    return (
      <FilterPanel
        {...args}
        variant="fixed"
        className="h-[48.125rem]"
        content={
          <>
            <Search options={sampleOptions} placeholder="Search" />
            <div style={{ display: "flex", gap: "0.625rem", marginBottom: "0.75rem" }}>
              <Tag variant="info-white" label="Label" closable />
              <Tag variant="info-white" label="Label 1" closable />
            </div>
            <FilterCard label="Label" caption="Caption">
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                    marginBottom: "2.5rem"
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
                    gap: "1.25rem",
                    marginBottom: "2.5rem"
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
    );
  }
};
