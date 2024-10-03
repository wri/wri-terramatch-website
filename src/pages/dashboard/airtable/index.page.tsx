import React, { useState } from "react";

import Button from "@/components/elements/Button/Button";
import Drawer from "@/components/elements/Drawer/Drawer";
import { DRAWER_VARIANT_FILTER } from "@/components/elements/Drawer/DrawerVariants";
import Checkbox from "@/components/elements/Inputs/Checkbox/Checkbox";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { VARIANT_DROPDOWN_FILTER } from "@/components/elements/Inputs/Dropdown/DropdownVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_AIRTABLE_DASHBOARD } from "@/components/elements/Table/TableVariants";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

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
    <div className="h-full overflow-hidden bg-neutral-70 py-8 px-14">
      <Drawer
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
        title={
          <Text variant="text-20-light" className="mt-6">
            Filter
          </Text>
        }
        isScrolledDefault={true}
        variant={DRAWER_VARIANT_FILTER}
      >
        <div className="mb-6 flex flex-col gap-6 overflow-auto pr-2">
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
      </Drawer>
      <Table
        variant={VARIANT_TABLE_AIRTABLE_DASHBOARD}
        hasPagination
        classNameWrapper=" py-8 !px-9 bg-white rounded-3xl"
        invertSelectPagination={true}
        data={[
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          },
          {
            projectName: {
              title: "Harit Bharat Fund Base",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              link: "",
              image: "/images/airtable-card.png",
              year: "2023"
            },
            lastUpdate: "9 January 2024"
          }
        ]}
        columns={[
          {
            accessorKey: "projectName",
            header: "Project Name",
            enableSorting: false,
            cell: (props: any) => {
              const { title, description, link, image, year } = props.getValue();

              return (
                <button
                  className="flex w-full items-center gap-2"
                  onClick={e => {
                    e.stopPropagation();
                    setIsDrawerOpen(!isDrawerOpen);
                  }}
                >
                  <img src={image} alt="project-img" className="h-10 w-10 rounded" />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Text variant="text-14-semibold">
                        {title} - {year}
                      </Text>
                      <Text variant="text-14-light" className="text-blueCustom-900">
                        Airtable
                      </Text>
                      <a href={link} target="_blank" rel="noreferrer">
                        <Icon name={IconNames.LINK_AIRTABLE} className="h-3 w-3" />
                      </a>
                    </div>
                    <Text variant="text-14-light" className="text-darkCustom-50">
                      {description}
                    </Text>
                  </div>
                </button>
              );
            }
          },
          {
            accessorKey: "lastUpdate",
            header: "Last Update",
            enableSorting: false
          }
        ]}
      />
    </div>
  );
};

export default AirTable;
