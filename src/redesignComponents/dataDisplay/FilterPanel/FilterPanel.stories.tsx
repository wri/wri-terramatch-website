import { Box, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "@worldresources/wri-design-systems";
import React from "react";

import { getThemedColor } from "@/lib/theme";

import Button from "../../actions/Buttons/Button/Button";
import CloseButton from "../../actions/Buttons/CloseButton/CloseButton";
import Panel from "../../containers/Panel/Panel";
import Checkbox from "../../Forms/Actions/Checkbox/Checkbox";
import Search from "../../Forms/Actions/Search/Search";
import CheckboxList from "../../Forms/Inputs/CheckboxList";
import { LanguageIcon } from "../../foundations/Icons";

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
  title: "Redesign Components/Data Display/Filter Panel",
  component: Panel,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"]
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilterPanel: Story = {
  args: {
    content: <div>content</div>
  },
  render: function Render(args) {
    return (
      <Panel
        variant="fixed"
        header={
          <Box
            style={{
              padding: "20px",
              borderBottom: `1px solid ${getThemedColor("neutral", 300)}`
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "700" }}>Filters</Text>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Text
                  style={{
                    color: getThemedColor("neutral", 700),
                    fontWeight: 400
                  }}
                >
                  Close
                </Text>
                <CloseButton />
              </div>
            </div>
          </Box>
        }
        content={
          <div style={{ maxHeight: "500px" }}>
            <div>
              <Box
                style={{
                  border: `1px solid ${getThemedColor("neutral", 300)}`,
                  padding: "15px",
                  margin: "15px",
                  borderRadius: "5px"
                }}
              >
                <h2>Label</h2>
                <p>Caption</p>

                <Search options={sampleOptions} placeholder="Search" />
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <Tag variant="info-white" label="Label" closable />
                  <Tag variant="info-white" label="Label" closable />
                </div>
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
              </Box>
            </div>
            <div>
              <Box
                style={{
                  border: `1px solid ${getThemedColor("neutral", 300)}`,
                  padding: "15px",
                  margin: "15px",
                  borderRadius: "5px"
                }}
              >
                <h2>Label</h2>
                <p>Caption</p>

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
              </Box>
            </div>
          </div>
        }
        footer={
          <div
            style={{
              width: "100%",
              display: "flex",
              padding: "10px",
              background: "white",
              gap: "15px"
            }}
          >
            <Button style={{ flex: 1 }} variant="secondary">
              Clear All
            </Button>
            <Button style={{ flex: 1 }} variant="primary">
              Apply
            </Button>
          </div>
        }
      />
    );
  }
};
