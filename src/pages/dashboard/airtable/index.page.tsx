import React, { useState } from "react";

import Button from "@/components/elements/Button/Button";
import Drawer from "@/components/elements/Drawer/Drawer";
import { DRAWER_VARIANT_FILTER } from "@/components/elements/Drawer/DrawerVariants";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_FILTER } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_DASHBOARD_COUNTRIES } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
const AirTable = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdwonOptions = [
    {
      title: "Tree Planting",
      value: "1"
    },
    {
      title: "Direct Seeding",
      value: "2"
    },
    {
      title: "Natural Regeneration",
      value: "3"
    }
  ];

  return (
    <div className="h-full w-full bg-neutral-40 p-5">
      <Drawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        title={<Text variant="text-20-light">Filter</Text>}
        isScrolledDefault={true}
        variant={DRAWER_VARIANT_FILTER}
      >
        <div className="flex flex-col gap-6 overflow-auto pr-2">
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light">SITE STATUS</Text>
            <div className="grid grid-cols-2 gap-2">
              <Checkbox
                name={"checbox1"}
                label="Approved"
                className="flex flex-row-reverse items-center gap-1 text-darkCustom-50"
              />
              <Checkbox
                name={"checbox2"}
                label="Pending Approval"
                className="flex flex-row-reverse items-center gap-1 text-darkCustom-50"
              />
              <Checkbox
                name={"checbox3"}
                label="Rejected"
                className="flex flex-row-reverse items-center gap-1 text-darkCustom-50"
              />
              <Checkbox
                name={"checbox4"}
                label="lorem ipsum"
                className="flex flex-row-reverse items-center gap-1 text-darkCustom-50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light">FUNDING TYPE</Text>
            <div className="grid grid-cols-2 gap-2">
              <Checkbox
                name={"checbox5"}
                label="lorem ipsum"
                className="flex flex-row-reverse items-center gap-1 text-darkCustom-50"
              />
              <Checkbox
                name={"checbox6"}
                label="lorem ipsum"
                className="flex flex-row-reverse items-center gap-1 text-darkCustom-50"
              />
              <Checkbox
                name={"checbox7"}
                label="lorem ipsum"
                className="flex flex-row-reverse items-center gap-1 text-darkCustom-50"
              />
              <Checkbox
                name={"checbox8"}
                label="lorem ipsum"
                className="flex flex-row-reverse items-center gap-1 text-darkCustom-50"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light">NUMBER OF UNVERIFIED CRITERIA</Text>
            <div className="flex items-center gap-2">
              <Dropdown
                options={dropdwonOptions}
                onChange={() => {}}
                containerClassName="w-full"
                placeholder="Min."
                className="text-darkCustom-50"
                variant={VARIANT_DROPDOWN_FILTER}
              />
              <Text variant="text-14-light" className="text-darkCustom-50">
                to
              </Text>
              <Dropdown
                options={dropdwonOptions}
                onChange={() => {}}
                containerClassName="w-full"
                placeholder="Max."
                className="text-darkCustom-50"
                variant={VARIANT_DROPDOWN_FILTER}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light">NUMBER OF TREES PLANTED</Text>
            <div className="flex items-center gap-2">
              <Dropdown
                options={dropdwonOptions}
                onChange={() => {}}
                containerClassName="w-full"
                placeholder="Min."
                className="text-darkCustom-50"
                variant={VARIANT_DROPDOWN_FILTER}
              />
              <Text variant="text-14-light" className="text-darkCustom-50">
                to
              </Text>
              <Dropdown
                options={dropdwonOptions}
                onChange={() => {}}
                containerClassName="w-full"
                placeholder="Max."
                className="text-darkCustom-50"
                variant={VARIANT_DROPDOWN_FILTER}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light">ORGANIZATION</Text>
            <Dropdown
              options={dropdwonOptions}
              onChange={() => {}}
              placeholder="Select a Organization"
              className="text-darkCustom-50"
              variant={VARIANT_DROPDOWN_FILTER}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light">PROJECT</Text>
            <Dropdown
              options={dropdwonOptions}
              onChange={() => {}}
              placeholder="Select a Project"
              className="text-darkCustom-50"
              variant={VARIANT_DROPDOWN_FILTER}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="text-14-light">COUNTRY</Text>
            <Dropdown
              options={dropdwonOptions}
              onChange={() => {}}
              placeholder="Select a Country"
              className="text-darkCustom-50"
              variant={VARIANT_DROPDOWN_FILTER}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="white-border"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <Text variant="text-14-semibold" className="capitalize">
                Reset
              </Text>
            </Button>
            <Button
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <Text variant="text-14-semibold" className="capitalize">
                Apply
              </Text>
            </Button>
          </div>
        </div>
      </Drawer>
      <PageCard>
        <Table
          variant={VARIANT_TABLE_DASHBOARD_COUNTRIES}
          hasPagination
          data={[
            { projectName: "projectName", lastUpdate: "9 January 2024" },
            { projectName: "projectName", lastUpdate: "9 January 2024" },
            { projectName: "projectName", lastUpdate: "9 January 2024" },
            { projectName: "projectName", lastUpdate: "9 January 2024" },
            { projectName: "projectName", lastUpdate: "9 January 2024" },
            { projectName: "projectName", lastUpdate: "9 January 2024" },
            { projectName: "projectName", lastUpdate: "9 January 2024" },
            { projectName: "projectName", lastUpdate: "9 January 2024" },
            { projectName: "projectName", lastUpdate: "9 January 2024" }
          ]}
          columns={[
            {
              accessorKey: "projectName",
              header: "Project Name",
              enableSorting: false,
              cell: (props: any) => (
                <button
                  className="w-fit"
                  onClick={e => {
                    e.stopPropagation();
                    setIsDrawerOpen(!isDrawerOpen);
                  }}
                >
                  <Text variant="text-bold-caption-100">{props.getValue()}</Text>
                </button>
              )
            },
            {
              accessorKey: "lastUpdate",
              header: "Last Update",
              enableSorting: false
            }
          ]}
        />
      </PageCard>
    </div>
  );
};

export default AirTable;
