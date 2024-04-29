import classNames from "classnames";
import { FC, useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_AIRTABLE } from "@/components/elements/Table/TableVariants";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_BOX_AIRTABLE } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Icon from "@/components/extensive/Icon/Icon";
import ModalCloseLogo from "@/components/extensive/Modal/ModalWithClose";
import { useModalContext } from "@/context/modal.provider";

const tabIndex = { TERRAFUND: 0, PRICELESS: 1, HARIT: 2, LAND: 3 };

export interface tableProjectItemProps {
  name: string;
  description: string;
}

const airtableItemMenu = [
  {
    id: "1",
    render: () => (
      <div className="flex items-center gap-2">
        <Icon name={IconNames.EDIT} className="h-6 w-6" />
        <Text variant="text-12-bold">Edit</Text>
      </div>
    ),
    onClick: () => {}
  },
  {
    id: "2",
    render: () => (
      <div className="flex items-center gap-2">
        <Icon name={IconNames.TRASH_PA} className="h-6 w-6" />
        <Text variant="text-12-bold">Delete</Text>
      </div>
    ),
    onClick: () => {}
  }
];

const dropdownOptionsProgram = [
  {
    title: "Terrafund",
    value: 1
  },
  {
    title: "Terramatch",
    value: 2
  }
];

const dropdownOptionsCohort = [
  {
    title: "Top100",
    value: 1
  },
  {
    title: "Top50",
    value: 2
  }
];

const tableData = [
  {
    name: {
      name: "Harit Bharat Fund Base - 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    date: "9 January 2024"
  },
  {
    name: {
      name: "Harit Bharat Fund Base - 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    date: "9 January 2024"
  },
  {
    name: {
      name: "Harit Bharat Fund Base - 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    date: "9 January 2024"
  },
  {
    name: {
      name: "Harit Bharat Fund Base - 2023",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    date: "9 January 2024"
  }
];

const ProjectPipeline: FC = () => {
  const { openModal, closeModal } = useModalContext();
  const [selected, setSelected] = useState(tabIndex.TERRAFUND);
  const openFormModalHandler = () => {
    openModal(
      <ModalCloseLogo
        className="w-[556px]"
        title="Add New Pipeline"
        onCLose={closeModal}
        primaryButtonProps={{ children: "Submit Pipeline", className: "w-full text-white capitalize" }}
      >
        <div className="flex w-full flex-col gap-4">
          <Input
            labelVariant="text-14-light"
            labelClassName="capitalize"
            label="Name"
            placeholder="Input Name"
            name="other"
            type="text"
            hideErrorMessage
          />
          <Input
            label="Submitted by"
            labelClassName="capitalize"
            labelVariant="text-14-light"
            placeholder="Input Submitted by"
            value="Ricardo Saavedra, November 14, 2023"
            name="other"
            type="text"
          />
          <TextArea
            label="Description"
            labelVariant="text-14-light"
            labelClassName="capitalize"
            placeholder="Input Description"
            name=""
            className="text-14-light max-h-72 !min-h-0 resize-none rounded-lg border border-grey-750 px-4 py-3"
            containerClassName="w-full"
            rows={3}
          />
          <Dropdown
            label="Program"
            labelClassName="capitalize"
            labelVariant="text-14-light"
            placeholder="Select Program"
            options={dropdownOptionsProgram}
            defaultValue={[1]}
            onChange={() => {}}
          />
          <Dropdown
            label="Cohort"
            labelClassName="capitalize"
            labelVariant="text-14-light"
            placeholder="Select Cohort"
            options={dropdownOptionsCohort}
            defaultValue={[1]}
            onChange={() => {}}
          />
          <Input
            label="Publish For"
            labelClassName="capitalize"
            labelVariant="text-14-light"
            placeholder="Input Publish For"
            onChange={() => {}}
            name="other"
            type="text"
          />
          <Input
            label="URL"
            labelClassName="capitalize"
            labelVariant="text-14-light"
            placeholder="Input URL"
            onChange={() => {}}
            name="other"
            type="text"
          />
        </div>
      </ModalCloseLogo>
    );
  };

  return (
    <>
      <div className="flex justify-between pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Restore Local Project Pipeline
        </Text>
        <Button
          variant="white-page-admin"
          iconProps={{ name: IconNames.PLUS_PA, className: "text-neutral-950 w-5 h-5" }}
          onClick={openFormModalHandler}
        >
          <Text variant="text-14-bold" className="text-neutral-950">
            Add Pipeline
          </Text>
        </Button>
      </div>
      <div className="rounded-[20px] bg-white p-8">
        <div className="mb-8 flex items-center justify-between ">
          <div className="flex flex-col gap-1">
            <Text variant="text-24-bold">AFR100 References</Text>
            <Text variant="text-16-light">Access publicly available curated infographics and dashboards. </Text>
          </div>
          <FilterSearchBox onChange={() => {}} placeholder="Search" variant={FILTER_SEARCH_BOX_AIRTABLE} />
        </div>
        <div className="mb-4 flex items-center gap-8">
          <Button variant="text" onClick={() => setSelected(tabIndex.TERRAFUND)}>
            <Text
              variant="text-14"
              className={classNames("border-b-2 border-transparent pb-3", {
                " !border-primary text-primary": selected === tabIndex.TERRAFUND
              })}
            >
              Top100
            </Text>
          </Button>
          {/* Hidde buttons for now */}
          {/* <Button variant="text" onClick={() => setSelected(tabIndex.PRICELESS)}>
            <Text
              variant="text-14"
              className={classNames("border-b-2 border-transparent pb-3", {
                " !border-primary text-primary": selected === tabIndex.PRICELESS
              })}
            >
              Priceless Planet Coalition
            </Text>
          </Button>

          <Button variant="text" onClick={() => setSelected(tabIndex.HARIT)}>
            <Text
              variant="text-14"
              className={classNames("border-b-2 border-transparent pb-3", {
                " !border-primary text-primary": selected === tabIndex.HARIT
              })}
            >
              Harit Bharat Fund
            </Text>
          </Button>

          <Button variant="text" onClick={() => setSelected(tabIndex.LAND)}>
            <Text
              variant="text-14"
              className={classNames("border-b-2 border-transparent pb-3", {
                " !border-primary text-primary": selected === tabIndex.LAND
              })}
            >
              Land Accelerator
            </Text>
          </Button> */}
        </div>
        <When condition={selected === tabIndex.TERRAFUND}>
          <div className="rounded-lg border border-neutral-200">
            <Table
              variant={VARIANT_TABLE_AIRTABLE}
              columns={[
                {
                  header: "Project Name",
                  accessorKey: "name",
                  enableSorting: false,
                  cell: props => {
                    const value = props.getValue() as tableProjectItemProps;
                    return (
                      <div className="flex items-center gap-4">
                        <Icon name={IconNames.LEAF} className="h-10 w-10 overflow-hidden rounded-lg" />
                        <div>
                          <div className="flex items-center gap-1">
                            <Text variant="text-14-semibold">{value.name}</Text>
                            <Icon name={IconNames.LINK_PA} className="h-3 w-3 text-neutral-950" />
                          </div>

                          <Text variant="text-14-light" className="opacity-50">
                            {value.description}
                          </Text>
                        </div>
                      </div>
                    );
                  }
                },
                {
                  header: "Last Updated",
                  accessorKey: "date",
                  enableSorting: false,
                  cell: props => {
                    const value = props.getValue() as string;
                    return (
                      <Text variant="text-14-light" className="whitespace-nowrap">
                        {value}
                      </Text>
                    );
                  }
                },
                {
                  header: "",
                  accessorKey: "ellipse",
                  enableSorting: false,
                  cell: () => (
                    <Menu menu={airtableItemMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
                      <div className="rounded p-1 hover:bg-primary-200">
                        <Icon
                          name={IconNames.ELIPSES}
                          className="roudn h-4 w-4 rounded-sm text-primary-500 hover:bg-primary-200"
                        />
                      </div>
                    </Menu>
                  )
                }
              ]}
              data={tableData}
            ></Table>
          </div>
        </When>
        <When condition={selected === tabIndex.PRICELESS}>
          <Table data={[]} columns={[]}></Table>
        </When>
        <When condition={selected === tabIndex.HARIT}>
          <Table data={[]} columns={[]}></Table>
        </When>
        <When condition={selected === tabIndex.LAND}>
          <Table data={[]} columns={[]}></Table>
        </When>
      </div>
    </>
  );
};

export default ProjectPipeline;
