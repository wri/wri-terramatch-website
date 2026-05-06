import { useT } from "@transifex/react";
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
  const t = useT();
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
              <FilterCard label={t("Submission Status")}>
                <Checkbox name="submission-status-draft" value="draft" defaultChecked>
                  {t("Draft")}
                </Checkbox>
                <Checkbox name="submission-status-pending-approval" value="pending-approval">
                  {t("Pending Approval")}
                </Checkbox>
                <Checkbox name="submission-status-information-required" value="information-required">
                  {t("Information Required")}
                </Checkbox>
                <Checkbox name="submission-status-approved" value="approved">
                  {t("Approved")}
                </Checkbox>
              </FilterCard>
              <FilterCard label={t("System Validation")}>
                <Checkbox name="system-validation-not-started" value="not-started">
                  {t("Not Started")}
                </Checkbox>
                <Checkbox name="system-validation-failed" value="failed" defaultChecked>
                  {t("Failed")}
                </Checkbox>
                <Checkbox name="system-validation-partially-passed" value="partially-passed" defaultChecked>
                  {t("Partially Passed")}
                </Checkbox>
                <Checkbox name="system-validation-passed" value="passed">
                  {t("Passed")}
                </Checkbox>
              </FilterCard>
              <FilterCard label={t("Plant Start Date")}>
                <DateRangeInput />
              </FilterCard>
              <FilterCard label={t("Restoration Practice")}>
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
                  placeholder={t("Please Select")}
                />
              </FilterCard>
              <FilterCard label={t("Target Land Use")}>
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
                  placeholder={t("Please Select")}
                />
              </FilterCard>
              <FilterCard label={t("Submission Cycle")}>
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
                  placeholder={t("Please Select")}
                />
              </FilterCard>
              <FilterCard label={t("Overlap")}>
                <Switch name="overlap" defaultChecked>
                  {t("Show Polygon Overlaps")}
                </Switch>
              </FilterCard>
            </>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  children: t("Clear all"),
                  variant: "secondary"
                },
                {
                  children: t("Apply"),
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
