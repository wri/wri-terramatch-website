import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";

import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { ActionTableCell } from "@/components/extensive/TableCells/ActionTableCell";
import { useModalContext } from "@/context/modal.provider";
import { useToastContext } from "@/context/toast.provider";
import {
  GetV2ProjectPitchesResponse,
  useDeleteV2ProjectPitchesUUID,
  useGetV2ProjectPitches
} from "@/generated/apiComponents";
import { ProjectPitchRead } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";

import { IconNames } from "../Icon/Icon";
import Modal from "../Modal/Modal";

interface PitchesTableProps {
  organisationUUID: string;
  onFetch?: (data: GetV2ProjectPitchesResponse) => void;
}

const PitchesTable = (props: PitchesTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [queryParams, setQueryParams] = useState<any>();

  const { openModal, closeModal } = useModalContext();
  const { openToast } = useToastContext();

  const {
    data: pitches,
    isLoading,
    refetch
  } = useGetV2ProjectPitches(
    {
      queryParams: {
        ...queryParams,
        //@ts-ignore
        "filter[organisation_id]": props.organisationUUID
      }
    },
    {
      enabled: !!props.organisationUUID,
      keepPreviousData: true,
      onSuccess: data => props.onFetch?.(data)
    }
  );

  const { mutate: deletePitch } = useDeleteV2ProjectPitchesUUID({
    onSuccess: () => {
      refetch();
      openToast(t("Pitch Deleted"));
    }
  });

  const handleDeleteClick = (uuid: string) => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.INFO_CIRCLE_ALT, width: 60, height: 60 }}
        title={t("Are you sure you want to delete this draft?")}
        content={t(
          "When you delete this draft, the pitch and all its associated data will be permanently removed. Please be aware that this action cannot be undone."
        )}
        primaryButtonProps={{
          children: "Delete Draft",
          onClick: () => {
            closeModal();
            deletePitch({ pathParams: { uuid } });
          }
        }}
        secondaryButtonProps={{
          children: "Cancel",
          onClick: closeModal
        }}
      />
    );
  };

  return (
    <div>
      <ServerSideTable<ProjectPitchRead>
        meta={pitches?.meta}
        data={
          pitches?.data?.map(pitch => ({
            ...pitch,
            project_name: pitch.project_name || "",
            //@ts-ignore
            funding_programme_name: pitch.funding_programme?.name || ""
          })) || []
        }
        isLoading={isLoading}
        onQueryParamChange={setQueryParams}
        columns={[
          {
            accessorKey: "created_at",
            header: "Date Created",
            cell: props => format(props.getValue() as string)
          },
          {
            accessorKey: "project_name",
            header: "Project Pitch Name"
          },
          {
            accessorKey: "funding_programme_name",
            header: "Application"
          },
          {
            accessorKey: "uuid",
            header: "",
            cell: props => {
              const row = props.row;

              return (
                <ActionTableCell
                  primaryButtonProps={{ as: Link, href: `/project-pitches/${props.getValue()}`, children: t("View") }}
                  hasDeleteButton={row.original.status === "draft"}
                  onDelete={() => handleDeleteClick(props.getValue() as string)}
                />
              );
            },
            enableSorting: false
          }
        ]}
      />
    </div>
  );
};

export default PitchesTable;
