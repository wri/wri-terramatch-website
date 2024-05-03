import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import InputTextArea from "@/components/elements/Inputs/textArea/InputTextArea";
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
import { ToastType, useToastContext } from "@/context/toast.provider";
import {
  useDeleteV2ProjectPipelineId,
  useGetAuthMe,
  useGetV2ProjectPipeline,
  useGetV2ProjectPipelineId,
  usePostV2ProjectPipeline,
  usePutV2ProjectPipelineId
} from "@/generated/apiComponents";

const tabIndex = { TERRAFUND: 0, PRICELESS: 1, HARIT: 2, LAND: 3 };

type ProjectPipelinePost = {
  Name: string;
  Description: string;
  SubmittedBy: string;
  Program: string;
  Cohort: string;
  PublishFor: string;
  URL: string;
};

interface AuthMeResponse {
  data: {
    first_name: string;
    last_name: string;
  };
}

interface ProjectPipelineResponse {
  data: [];
}

export interface tableProjectItemProps {
  name: string;
  description: string;
}

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

const ProjectPipeline: FC = () => {
  const { openModal, closeModal } = useModalContext();
  const [selected, setSelected] = useState(tabIndex.TERRAFUND);
  const [projectId, setProjectId] = useState("");
  const [_, setDropdownValueProgram] = useState(1);
  const [__, setDropdownValueCohort] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);
  const form = useForm();
  const { data: authMe } = useGetAuthMe({}) as { data: AuthMeResponse };
  const [isEdit, setIsEdit] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { data: projectsPipeline, refetch } = useGetV2ProjectPipeline<ProjectPipelineResponse>({});

  console.log(_, __);
  const { data: getProject } = useGetV2ProjectPipelineId({
    pathParams: {
      id: form.getValues("id") || projectId
    }
  });
  const { mutate: postProject } = usePostV2ProjectPipeline({
    onSuccess: () => {
      openToast("Created!", ToastType.SUCCESS);
    }
  });
  const { mutate: putProject } = usePutV2ProjectPipelineId({
    onSuccess: () => {
      openToast("Updated!", ToastType.SUCCESS);
    },
    onError: (e: any) => {
      openToast("Error!", ToastType.ERROR);
    }
  });
  const { mutate: remove } = useDeleteV2ProjectPipelineId();
  const [searchTerm, setSearchTerm] = useState("");
  const { openToast } = useToastContext();
  const filteredProjects = projectsPipeline?.data?.filter(
    (project: { name: { name: string | null; description: string | null } }) =>
      project?.name?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      project?.name?.description?.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  const handleSubmit = async () => {
    const requestBody: ProjectPipelinePost = {
      Name: form.getValues("name"),
      Description: form.getValues("description"),
      SubmittedBy: form.getValues("submittedBy"),
      Program: form.getValues("program") || "Terrafund",
      Cohort: form.getValues("cohort") || "Top100",
      PublishFor: form.getValues("publishFor"),
      URL: form.getValues("url")
    };
    if (form.getValues("id")) {
      putProject({
        pathParams: {
          id: form.getValues("id")
        },
        body: requestBody
      });
      setTimeout(() => {
        alert("Project Pipeline Record Updated");
        closeModal();
        form.reset();
        refetch();
      }, 2000);
    } else {
      postProject({ body: requestBody });
      closeModal();
      form.reset();
      alert("Record Created");
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  };
  const handleDelete = (projectId: string) => {
    setRefreshKey(prevKey => prevKey + 1);
    remove({
      pathParams: {
        id: projectId
      }
    });
    setTimeout(() => {
      alert("Project Deleted");
      refetch();
      setRefreshKey(prevKey => prevKey + 1);
    }, 2000);
  };

  const handleEdit = async (id: string) => {
    form.setValue("id", id);
    form.setValue("name", getProject?.data?.name?.name);
    form.setValue("description", getProject?.data?.name?.description);
    form.setValue("submittedBy", getProject?.data?.SubmittedBy);
    form.setValue("program", getProject?.data?.Program === "Terrafund" ? 1 : 2);
    form.setValue("cohort", getProject?.data?.Cohort === "Top100" ? 1 : 2);
    form.setValue("publishFor", getProject?.data?.PublishFor);
    form.setValue("url", getProject?.data?.URL);
    openFormModalHandler("Update Pipeline", "Save Project Pipeline");
    setProjectId(id);
    setIsEdit(true);
  };
  const handleAddPipeline = () => {
    form.reset();
    form.setValue("submittedBy", authMe?.data.first_name + " " + authMe?.data.last_name);
    setIsEdit(true);
    openFormModalHandler("Add New Project Pipeline", "Save Project Pipeline");
  };
  const handleCohortChange = (e: any) => {
    form.setValue("cohort", e == 1 ? "Top100" : "Top50");
  };
  const handleProgramChange = (e: any) => {
    form.setValue("program", e == 1 ? "Terrafund" : "Terramatch");
  };

  const airtableItemMenu = [
    {
      id: "1",
      is_airtable: true,
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.EDIT} className="h-6 w-6" />
          <Text variant="text-12-bold">Edit</Text>
        </div>
      ),
      onClick: (id: string) => {
        handleEdit(id);
      }
    },
    {
      id: "2",
      is_airtable: true,
      render: () => (
        <div className="flex items-center gap-2">
          <Icon name={IconNames.TRASH_PA} className="h-6 w-6" />
          <Text variant="text-12-bold">Delete</Text>
        </div>
      ),
      onClick: (id: string) => {
        handleDelete(id);
      }
    }
  ];
  useEffect(() => {
    if (!isEdit) {
      form.setValue("submittedBy", authMe?.data.first_name + " " + authMe?.data.last_name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMe]);
  useEffect(() => {
    if (isEdit && getProject?.data) {
      setDropdownValueProgram(getProject.data.Program === "Terrafund" ? 1 : 2);
      setDropdownValueCohort(getProject.data.Cohort === "Top100" ? 1 : 2);
      form.setValue("name", getProject?.data?.name?.name);
      form.setValue("description", getProject?.data?.name?.description);
      form.setValue("submittedBy", getProject?.data?.SubmittedBy);
      form.setValue("program", getProject?.data?.Program);
      form.setValue("cohort", getProject?.data?.Cohort);
      form.setValue("publishFor", getProject?.data?.PublishFor);
      form.setValue("url", getProject?.data?.URL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProject]);
  useEffect(() => {
    setRefreshKey(prevKey => prevKey + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, projectsPipeline]);
  const openFormModalHandler = (title: string, buttonName: string) => {
    openModal(
      <ModalCloseLogo
        key={refreshKey}
        className="w-[556px]"
        title={title}
        onCLose={closeModal}
        primaryButtonProps={{
          children: buttonName,
          className: "w-full text-white capitalize",
          onClick: handleSubmit
        }}
      >
        <form method="POST" className="w-full">
          <div className="flex w-full flex-col gap-4">
            <Input
              labelVariant="text-14-light"
              labelClassName="capitalize"
              label="Name"
              placeholder="Input Name"
              name="name"
              type="text"
              hideErrorMessage
              formHook={form}
              defaultValue={form.getValues("name")}
              readOnly={false}
            />
            <Input
              label="Submitted by"
              labelClassName="capitalize"
              labelVariant="text-14-light"
              placeholder="Input Submitted by"
              name="submittedBy"
              type="text"
              disabled
              formHook={form}
              defaultValue={form.getValues("submittedBy")}
              readOnly={false}
            />
            <InputTextArea
              label="Description"
              labelVariant="text-14-light"
              labelClassName="capitalize"
              placeholder="Input Description"
              name="description"
              className="text-14-light max-h-72 !min-h-0 resize-none rounded-lg border border-grey-750 px-4 py-3"
              containerClassName="w-full"
              rows={3}
              formHook={form}
              defaultValue={form.getValues("description")}
              readOnly={false}
            />
            <Dropdown
              label="Program"
              labelClassName="capitalize"
              labelVariant="text-14-light"
              placeholder="Select Program"
              options={dropdownOptionsProgram}
              defaultValue={[_] || [form.getValues("program")?.toString() == "Terrafund" ? 1 : 2]}
              onChange={handleProgramChange}
              formHook={form}
              customName="program"
            />
            <Dropdown
              label="Cohort"
              labelClassName="capitalize"
              labelVariant="text-14-light"
              placeholder="Select Cohort"
              options={dropdownOptionsCohort}
              defaultValue={[__] || [form.getValues("cohort")?.toString() == "Top100" ? 1 : 2]}
              onChange={handleCohortChange}
              formHook={form}
              customName="cohort"
            />
            <Input
              label="Publish For"
              labelClassName="capitalize"
              labelVariant="text-14-light"
              placeholder="Input Publish For"
              name="publishFor"
              type="text"
              formHook={form}
              defaultValue={form.getValues("publishFor")}
              readOnly={false}
            />
            <Input
              label="URL"
              labelClassName="capitalize"
              labelVariant="text-14-light"
              placeholder="Input URL"
              name="url"
              type="text"
              formHook={form}
              defaultValue={form.getValues("url")}
              readOnly={false}
            />
          </div>
        </form>
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
          iconProps={{ name: IconNames.PLUS_PA, className: "text-blueCustom-900 w-5 h-5" }}
          onClick={handleAddPipeline}
        >
          <Text variant="text-14-bold" className="text-blueCustom-900">
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
          <FilterSearchBox
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search"
            variant={FILTER_SEARCH_BOX_AIRTABLE}
          />
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
          <div ref={tableRef}>
            <Table<any>
              key={refreshKey}
              variant={VARIANT_TABLE_AIRTABLE}
              classNameWrapper="rounded-lg border border-neutral-200"
              columns={[
                {
                  header: "Project Name",
                  accessorKey: "name",
                  enableSorting: false,
                  cell: props => {
                    const value = props?.getValue() as tableProjectItemProps;
                    return (
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10">
                          <Icon
                            name={IconNames.LEAF}
                            className="min-w-10 min-h-10 h-10 w-10 overflow-hidden rounded-lg"
                          />
                        </div>
                        <div>
                          <div
                            className="group flex cursor-pointer items-center gap-1"
                            onClick={() => {
                              window.open(props.row.original.URL, "_blank");
                            }}
                          >
                            <Text variant="text-14-semibold" className="group-hover:text-primary">
                              {value.name}
                            </Text>
                            <Icon
                              name={IconNames.LINK_PA}
                              className="h-3 w-3 text-blueCustom-900 group-hover:text-primary"
                            />
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
                  cell: x => {
                    return (
                      <Menu
                        menu={airtableItemMenu}
                        placement={MENU_PLACEMENT_BOTTOM_LEFT}
                        extraData={x.cell.row.original.id}
                      >
                        <div className="rounded p-1 hover:bg-primary-200">
                          <Icon
                            name={IconNames.ELIPSES}
                            className="roudn h-4 w-4 rounded-sm text-primary-500 hover:bg-primary-200"
                          />
                        </div>
                      </Menu>
                    );
                  }
                }
              ]}
              data={(searchTerm != "" ? filteredProjects : projectsPipeline?.data) || []}
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
