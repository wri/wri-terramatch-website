import { Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
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
import { useApproveReports, useProjectTaskProcessing } from "@/connections/ProjectTaskProcessing";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { getTaskStatusOptions } from "@/constants/options/status";
import { useUserFrameworkChoices } from "@/constants/options/userFrameworksChoices";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { TaskLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

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
        render={({ status }: TaskLightDto) => {
          const { title } = getTaskStatusOptions().find((option: any) => option.value === status) ?? {};
          return <CustomChipField label={title} />;
        }}
      />
      <TextField source="organisationName" label="Organization" />
      <FunctionField
        source="frameworkKey"
        label="Framework"
        render={(record: TaskLightDto) =>
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

export const TasksList: FC = () => {
  const frameworkChoices = useFrameworkChoices();
  const { openModal, closeModal } = useModalContext();
  const [currentProjectUuid, setCurrentProjectUuid] = useState<string | undefined>();
  const { openNotification } = useNotificationContext();
  const { referenceRecord: selectedProject } = useReference({
    reference: modules.project.ResourceName,
    id: currentProjectUuid as string
  });
  const [, { data: projectTaskData }] = useProjectTaskProcessing({ uuid: currentProjectUuid as string });

  const [, { approveReports }] = useApproveReports({ uuid: currentProjectUuid as string });

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

  const { exporting, onClickExportButton, frameworkDialogProps } = useFrameworkExport("tasks", frameworkChoices);

  const openModalHandlerBulkApprove = (
    data: Array<{ id: string; name: string; type: string; dateSubmitted: string }>,
    currentProjectUuid?: string
  ) => {
    let currentSelectedReports: string[] = [];

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
            const selectedData = data.filter(report => currentSelectedReports.includes(report.id));
            openModalHandlerBulkConfirm(selectedData, currentSelectedReports, currentProjectUuid);
          }
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

  const openModalHandlerBulkConfirm = (
    selectedData: Array<{ id: string; name: string; type: string; dateSubmitted: string }>,
    selectedUuids: string[],
    currentProjectUuid?: string
  ) => {
    openModal(
      ModalId.CONFIRM_POLYGON_APPROVAL,
      <ModalConfirm
        title={"Confirm Bulk Approval"}
        content={
          <div className="max-h-[140px] overflow-y-auto lg:max-h-[150px]">
            {selectedData.length > 0 ? (
              selectedData.map(report => (
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
        onConfirm={(text: string) => {
          if (!currentProjectUuid) {
            console.error("No project UUID available for approval");
            return;
          }

          try {
            approveReports(selectedUuids, text);
            openNotification("success", "Reports approved successfully", "");
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
              <Text variant="text-14-bold" className="leading-none">
                {selectedProject?.trees_planted_count?.toLocaleString() ?? 0}
              </Text>
            </div>
            <Button
              onClick={() => {
                if (projectTaskData?.reports) {
                  const reportsData = projectTaskData.reports.map(report => ({
                    id: report.uuid,
                    name: report.name,
                    type: report.type === "nurseryReport" ? "Nursery" : "Site",
                    dateSubmitted: new Date(report.submittedAt).toLocaleDateString("en-GB")
                  }));
                  openModalHandlerBulkApprove(reportsData, currentProjectUuid);
                }
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
    </>
  );
};
