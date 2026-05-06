import React, { FC } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import DateRangeInput from "@/redesignComponents/Forms/Inputs/DateInputs/DateRangeInputs/DateRangeInput";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";

interface PolygonFilterDrawerProps {
  trigger?: React.ReactNode;
}

const PolygonFilterDrawer: FC<PolygonFilterDrawerProps> = ({ trigger }) => {
  return (
    <Drawer trigger={trigger}>
      {({ onClose }) => (
        <FilterPanel
          title="Filters"
          variant="fixed"
          onClose={onClose}
          className="h-screen"
          content={
            <>
              <FilterCard label="Submission Status">
                <Checkbox name="submission-status-draft" value="draft" defaultChecked>
                  Draft
                </Checkbox>
                <Checkbox name="submission-status-pending-approval" value="pending-approval">
                  Pending Approval
                </Checkbox>
                <Checkbox name="submission-status-information-required" value="information-required">
                  Information Required
                </Checkbox>
                <Checkbox name="submission-status-approved" value="approved">
                  Approved
                </Checkbox>
              </FilterCard>
              <FilterCard label="System Validation">
                <Checkbox name="system-validation-not-started" value="not-started">
                  Not Started
                </Checkbox>
                <Checkbox name="system-validation-failed" value="failed" defaultChecked>
                  Failed
                </Checkbox>
                <Checkbox name="system-validation-partially-passed" value="partially-passed" defaultChecked>
                  Partially Passed
                </Checkbox>
                <Checkbox name="system-validation-passed" value="passed">
                  Passed
                </Checkbox>
              </FilterCard>
              <FilterCard label="Plant Start Date">
                <DateRangeInput />
              </FilterCard>
              <FilterCard label="Restoration Practice">
                <SelectInput
                  items={[
                    {
                      label: "Option 1",
                      value: "option-1"
                    },
                    {
                      label: "Option 2",
                      value: "option-2"
                    },
                    {
                      label: "Option 3",
                      value: "option-3"
                    }
                  ]}
                  onChange={function noRefCheck() {}}
                  placeholder="Please select"
                />
              </FilterCard>
              <FilterCard label="Target Land Use">
                <SelectInput
                  items={[
                    {
                      label: "Option 1",
                      value: "option-1"
                    },
                    {
                      label: "Option 2",
                      value: "option-2"
                    },
                    {
                      label: "Option 3",
                      value: "option-3"
                    }
                  ]}
                  onChange={function noRefCheck() {}}
                  placeholder="Please select"
                />
              </FilterCard>
              <FilterCard label="Submission Cycle">
                <SelectInput
                  items={[
                    {
                      label: "Option 1",
                      value: "option-1"
                    },
                    {
                      label: "Option 2",
                      value: "option-2"
                    },
                    {
                      label: "Option 3",
                      value: "option-3"
                    }
                  ]}
                  onChange={function noRefCheck() {}}
                  placeholder="Please select"
                />
              </FilterCard>
              <FilterCard label="Overlap">
                <Switch name="overlap" defaultChecked>
                  Show Polygon Overlaps
                </Switch>
              </FilterCard>
            </>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  children: "Clear all",
                  variant: "secondary"
                },
                {
                  children: "Apply",
                  variant: "primary",
                  onClick: onClose
                }
              ]}
            />
          }
        />
      )}
    </Drawer>
  );
};

export default PolygonFilterDrawer;
