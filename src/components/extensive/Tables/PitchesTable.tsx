import { SortingState } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import Link from "next/link";
import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import Pagination from "@/components/elements/Table/Pagination";
import Table from "@/components/elements/Table/Table";
import { useModalContext } from "@/context/modal.provider";
import { useToastContext } from "@/context/toast.provider";
import {
  GetV2ProjectPitchesResponse,
  useDeleteV2ProjectPitchesUUID,
  useGetV2ProjectPitches
} from "@/generated/apiComponents";
import { ProjectPitchRead } from "@/generated/apiSchemas";
import { useDate } from "@/hooks/useDate";
import { tableSortingStateToQueryParamsSort } from "@/utils/dataTransformation";

import { IconNames } from "../Icon/Icon";
import Modal from "../Modal/Modal";

interface PitchesTableProps {
  organisationUUID: string;
  onFetch?: (data: GetV2ProjectPitchesResponse) => void;
}

const PitchesTable = (props: PitchesTableProps) => {
  const t = useT();
  const { format } = useDate();
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { openModal, closeModal } = useModalContext();
  const { openToast } = useToastContext();

  const { data: pitches, refetch } = useGetV2ProjectPitches(
    {
      queryParams: {
        page,
        per_page: 5,
        //@ts-ignore
        "filter[organisation_id]": props.organisationUUID,
        sort: tableSortingStateToQueryParamsSort(sorting)
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
    <>
      <Table<ProjectPitchRead>
        serverSideData
        onTableStateChange={state => setSorting(state.sorting)}
        data={
          pitches?.data?.map(pitch => ({
            ...pitch,
            project_name: pitch.project_name || "",
            //@ts-ignore
            funding_programme_name: pitch.funding_programme?.name || ""
          })) || []
        }
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
                <div className="flex justify-end gap-4">
                  <Button as={Link} href={`/project-pitches/${props.getValue()}`}>
                    {t("View")}
                  </Button>
                  <When condition={row.original.status === "draft"}>
                    <IconButton
                      onClick={() => handleDeleteClick(props.getValue() as string)}
                      aria-label={t("Delete Application")}
                      iconProps={{
                        name: IconNames.TRASH_CIRCLE,
                        className: "fill-error",
                        width: 32,
                        height: 32
                      }}
                    />
                  </When>
                </div>
              );
            },
            enableSorting: false
          }
        ]}
      />
      <Pagination
        className="my-8 justify-center"
        getCanNextPage={() => page < pitches?.meta?.last_page!}
        getCanPreviousPage={() => page > 1}
        getPageCount={() => pitches?.meta?.last_page || 1}
        nextPage={() => setPage(page => page + 1)}
        pageIndex={page - 1}
        previousPage={() => setPage(page => page - 1)}
        setPageIndex={index => setPage(index + 1)}
      />
    </>
  );
};

export default PitchesTable;
