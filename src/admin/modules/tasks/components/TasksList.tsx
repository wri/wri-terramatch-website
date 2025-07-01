import { Stack } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import {
  AutocompleteInput,
  Datagrid,
  DateField,
  FunctionField,
  List,
  ReferenceInput,
  SelectInput,
  TextField,
  useListContext,
  useReference
} from "react-admin";

import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import FrameworkSelectionDialog, { useFrameworkExport } from "@/admin/components/Dialogs/FrameworkSelectionDialog";
import ModalBulkApprove from "@/admin/components/extensive/Modal/ModalBulkApprove";
import CustomChipField from "@/admin/components/Fields/CustomChipField";
import Button from "@/components/elements/Button/Button";
import Status from "@/components/elements/Status/Status";
import Text from "@/components/elements/Text/Text";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getTaskStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { APPROVED } from "@/constants/statuses";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import {
  NurseryReportLightDto,
  SiteReportLightDto,
  TaskLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import { EntityName } from "@/types/common";
import { optionToChoices } from "@/utils/options";

import modules from "../..";
import BulkApprovalRunner from "./BulkApprovalRunner";

type SelectedItem = {
  id: string;
  name: string;
  type: string;
  dateSubmitted: string;
};

type TaskWithReports = TaskLightDto & {
  siteReports?: SiteReportLightDto[];
  nurseryReports?: NurseryReportLightDto[];
};

const TaskDataGrid: FC<{ onProjectUuidChange: (uuid: string | undefined) => void }> = ({ onProjectUuidChange }) => {
  const frameworkInputChoices = useUserFrameworkChoices();
  const { filterValues } = useListContext();

  useEffect(() => {
    onProjectUuidChange(filterValues.projectUuid);
  }, [filterValues, onProjectUuidChange]);

  return (
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="projectName" label="Project Name" />
      <FunctionField
        source="status"
        label="Status"
        sortable={false}
        render={(record?: TaskLightDto) => {
          const { title } = getTaskStatusOptions().find((option: any) => option.value === record?.status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <TextField source="organisationName" label="Organization" />
      <FunctionField
        source="frameworkKey"
        label="Framework"
        render={(record?: TaskLightDto) =>
          frameworkInputChoices.find((framework: any) => framework.id === record?.frameworkKey)?.name ??
          record?.frameworkKey
        }
        sortable={false}
      />
      <DateField source="dueAt" label="Due Date" locales="en-GB" />
      <DateField source="updatedAt" label="Last Updated" locales="en-GB" />
    </Datagrid>
  );
};

const TreesPlantedTotal: FC = () => {
  const { data } = useListContext();

  const total = Array.isArray(data) ? data.reduce((sum, item) => sum + (item.treesPlantedCount || 0), 0) : 0;

  return (
    <Text variant="text-14-bold" className="leading-none">
      {total.toLocaleString()}
    </Text>
  );
};

export const TasksList: FC = () => {
  const frameworkChoices = useFrameworkChoices();
  const { openModal, closeModal } = useModalContext();
  const [currentProjectUuid, setCurrentProjectUuid] = useState<string | undefined>();
  const { openNotification } = useNotificationContext();
  const { referenceRecord: selectedProject } = useReference({
    reference: modules.project.ResourceName,
    id: currentProjectUuid as string
  });

  const tasksListRef = useRef<TaskWithReports[]>([]);
  const [selectableReports, setSelectableReports] = useState<SelectedItem[]>([]);
  const [bulkApprovalTasks, setBulkApprovalTasks] = useState<
    {
      uuid: string;
      site: string[] | null;
      nursery: string[] | null;
      feedback: string;
    }[]
  >([]);
  const [triggerBulk, setTriggerBulk] = useState(false);
  // const [completedBulk, setCompletedBulk] = useState<string[]>([]);

  const ListDataLogger: FC = () => {
    const { data } = useListContext();

    useEffect(() => {
      if (Array.isArray(data)) {
        tasksListRef.current = data as TaskWithReports[];
        const reports: SelectedItem[] = [];
        (data as TaskWithReports[]).forEach(task => {
          (task.siteReports ?? []).forEach(report => {
            if (report.status !== APPROVED && report.nothingToReport == true) {
              reports.push({
                id: report.uuid,
                name: report.siteName ?? report.reportTitle ?? "",
                type: "Site",
                dateSubmitted: report.submittedAt ? new Date(report.submittedAt).toLocaleDateString("en-GB") : ""
              });
            }
          });
          (task.nurseryReports ?? []).forEach(report => {
            if (report.status !== APPROVED && report.nothingToReport == true) {
              reports.push({
                id: report.uuid,
                name: report.nurseryName ?? report.reportTitle ?? "",
                type: "Nursery",
                dateSubmitted: report.submittedAt ? new Date(report.submittedAt).toLocaleDateString("en-GB") : ""
              });
            }
          });
        });
        setSelectableReports(reports);
      }
    }, [data]);

    return null;
  };

  const filters = [
    <ReferenceInput
      key="project"
      source="projectUuid"
      reference={modules.project.ResourceName}
      label="Project"
      sort={{
        field: "name",
        order: "ASC"
      }}
    >
      <AutocompleteInput
        optionText="name"
        label="Project"
        filterToQuery={searchText => ({ searchFilter: searchText })}
      />
    </ReferenceInput>,
    <SelectInput key="status" label="Status" source="status" choices={optionToChoices(getTaskStatusOptions())} />,
    <SelectInput key="frameworkKey" label="Framework" source="frameworkKey" choices={frameworkChoices} />
  ];

  const { exporting, onClickExportButton, frameworkDialogProps } = useFrameworkExport(
    modules.task.ResourceName as EntityName,
    frameworkChoices
  );

  const openModalHandlerBulkApprove = (data: Array<SelectedItem>, tasks?: TaskWithReports[]) => {
    let currentSelectedReports: Array<SelectedItem> = [];

    openModal(
      ModalId.APPROVE_POLYGONS,
      <ModalBulkApprove
        title="Bulk Approve - Nothing to Report"
        data={data}
        onClose={() => {
          closeModal(ModalId.APPROVE_POLYGONS);
        }}
        content={`This project has indicated there is nothing to report for the following reports that were due [task due date]. Press "select all" to bulk approve these reports (you can manually adjust your selection before final approval if needed).`}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            openModalHandlerBulkConfirm(currentSelectedReports, tasks);
          },
          disabled: data.length > 0 ? false : true
        }}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => {
            closeModal(ModalId.APPROVE_POLYGONS);
          }
        }}
        primaryButtonText="Next"
        secondaryButtonText="Cancel"
        onSelectionChange={selectedIds => {
          currentSelectedReports = selectedIds;
        }}
      />
    );
  };

  const openModalHandlerBulkConfirm = (currentSelectedReports: SelectedItem[], tasks?: TaskWithReports[]) => {
    openModal(
      ModalId.CONFIRM_POLYGON_APPROVAL,
      <ModalConfirm
        title={"Confirm Bulk Approval"}
        content={
          <div className="max-h-[140px] overflow-y-auto lg:max-h-[150px]">
            {currentSelectedReports.length > 0 ? (
              currentSelectedReports.map(report => (
                <li key={report.id} className="text-12-light">
                  {report.type} Report - {report.name} - {report.dateSubmitted}
                </li>
              ))
            ) : (
              <li className="text-12-light">No reports selected</li>
            )}
          </div>
        }
        commentArea
        onClose={() => {
          closeModal(ModalId.CONFIRM_POLYGON_APPROVAL);
        }}
        onConfirm={async (text: string) => {
          try {
            const siteReportUuids = currentSelectedReports
              .filter(report => report.type === "Site")
              .map(report => report.id);
            const nurseryReportUuids = currentSelectedReports
              .filter(report => report.type === "Nursery")
              .map(report => report.id);

            const tasksWithSelectedReports = (tasks ?? tasksListRef.current)
              .map((task: TaskWithReports) => {
                const filteredSiteReports =
                  task.siteReports?.filter((report: SiteReportLightDto) => siteReportUuids.includes(report.uuid)) || [];

                const filteredNurseryReports =
                  task.nurseryReports?.filter((report: NurseryReportLightDto) =>
                    nurseryReportUuids.includes(report.uuid)
                  ) || [];

                if (filteredSiteReports.length === 0 && filteredNurseryReports.length === 0) {
                  return null;
                }

                return {
                  uuid: task.uuid,
                  site: filteredSiteReports.map(r => r.uuid),
                  nursery: filteredNurseryReports.map(r => r.uuid),
                  feedback: text ?? ""
                };
              })
              .filter(task => task !== null) as {
              uuid: string;
              site: string[] | null;
              nursery: string[] | null;
              feedback: string;
            }[];

            setBulkApprovalTasks(tasksWithSelectedReports);
            setTriggerBulk(true);
            // setCompletedBulk([]);
            openNotification("success", "Reports approved successfully", "");
            //to update list in modal
            ApiSlice.pruneCache("tasks", [currentProjectUuid!]);
            closeModal(ModalId.CONFIRM_POLYGON_APPROVAL);
            closeModal(ModalId.APPROVE_POLYGONS);
          } catch (error) {
            openNotification(
              "error",
              "Failed to approve reports",
              error instanceof Error ? error.message : "An error occurred"
            );
          }
        }}
      />
    );
  };

  return (
    <>
      <Stack gap={1} py={2}>
        <Text variant="text-36-bold" className="leading-none">
          Tasks
        </Text>
      </Stack>

      <List actions={<ListActions onExport={onClickExportButton} />} filters={filters}>
        <ListDataLogger />
        {selectedProject && (
          <div className="m-6 flex items-center justify-between gap-6 rounded-2xl border border-neutral-300 px-6 py-4">
            <Text variant="text-20-bold" className="w-full leading-none">
              {selectedProject?.name ?? "N/A"}
            </Text>
            <div className="grid shrink-0 grid-cols-2 items-center gap-x-6 gap-y-2">
              <Text variant="text-12-light" className="leading-none">
                Status
              </Text>
              <Text variant="text-12-light" className="whitespace-nowrap leading-none">
                Trees Planted
              </Text>
              <Status status={selectedProject?.status} variant="small" />
              <TreesPlantedTotal />
            </div>
            <Button
              onClick={() => {
                openModalHandlerBulkApprove(selectableReports, tasksListRef.current);
              }}
              variant="primary"
            >
              Bulk Approve &quot;Nothing to Report&quot;
            </Button>
          </div>
        )}
        <div className="m-6 overflow-hidden rounded-2xl border border-neutral-300">
          <TaskDataGrid onProjectUuidChange={setCurrentProjectUuid} />
        </div>
      </List>

      <FrameworkSelectionDialog {...frameworkDialogProps} />

      <ExportProcessingAlert show={exporting} />

      {triggerBulk &&
        bulkApprovalTasks.map(task => (
          <BulkApprovalRunner
            key={task.uuid}
            uuid={task.uuid}
            siteReportUuids={task.site}
            nurseryReportUuids={task.nursery}
            feedback={task.feedback}
            trigger={triggerBulk}
            // onDone={uuid => setCompletedBulk(prev => [...prev, uuid])}
            onDone={uuid => console.log(uuid)}
          />
        ))}
    </>
  );
};
