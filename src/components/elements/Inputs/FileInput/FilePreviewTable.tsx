import { useT } from "@transifex/react";
import classNames from "classnames";
import { Else, If, Then, When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalImageDetails from "@/components/extensive/Modal/ModalImageDetails";
import { useModalContext } from "@/context/modal.provider";
import { UploadedFile } from "@/types/common";

import Menu from "../../Menu/Menu";
import Table from "../../Table/Table";
import { VARIANT_TABLE_SITE_POLYGON_REVIEW } from "../../Table/TableVariants";
import Text from "../../Text/Text";
import Checkbox from "../Checkbox/Checkbox";

export interface FilePreviewTableProps {
  items: Partial<UploadedFile>[];
  className?: string;
  onDelete?: (file: Partial<UploadedFile>) => void;
  onPrivateChange?: (file: Partial<UploadedFile>, checked: boolean) => void;
}

const FilePreviewTable = ({ items, className, onDelete, onPrivateChange }: FilePreviewTableProps) => {
  const t = useT();

  const { openModal, closeModal } = useModalContext();

  const openModalImageDetail = (item: any) => {
    openModal(
      ModalId.MODAL_IMAGE_DETAIL,
      <ModalImageDetails
        title="IMAGE DETAILS"
        data={item}
        entityData={[]}
        onClose={() => closeModal(ModalId.MODAL_IMAGE_DETAIL)}
        reloadGalleryImages={() => {}}
        handleDelete={() => {}}
      />,
      true
    );
  };

  const data = items.map(item => ({
    id: item.uuid,
    image: item,
    size: item.size,
    cover: true,
    public: item,
    geoCoded: false,
    elipsis: item
  }));

  return (
    <When condition={items.length > 0}>
      <Table
        variant={VARIANT_TABLE_SITE_POLYGON_REVIEW}
        data={data}
        columns={[
          {
            accessorKey: "image",
            header: `${t("Image")}`,
            cell: (props: any) => {
              const uploadState = props.getValue().uploadState;
              console.log(uploadState);
              return (
                <div
                  className={classNames({
                    "bg-green": uploadState?.isSuccess,
                    "bg-tertiary-80": uploadState?.isLoading,
                    "bg-red": uploadState?.error,
                    "bg-primary-500": uploadState?.isDeleting
                  })}
                >
                  {props.getValue().title}
                </div>
              );
            }
          },
          {
            accessorKey: "size",
            header: `${t("Size")}`
          },
          {
            accessorKey: "cover",
            cell: (props: any) => <Checkbox value={props.getValue()} name={""}></Checkbox>,
            header: `${t("Cover")}`,
            meta: { align: "center" }
          },
          {
            accessorKey: "public",
            cell: (props: any) => (
              <Checkbox
                value={props.getValue().is_public}
                name={""}
                onChange={e => onPrivateChange && onPrivateChange(props.getValue(), e.target.checked)}
              ></Checkbox>
            ),
            header: `${t("Public")}`,
            meta: { align: "center" }
          },
          {
            accessorKey: "geoCoded",
            header: `${t("GeoCoded")}`,
            cell: (props: any) => (
              <If condition={props.getValue}>
                <Then>
                  <div className="w-fit rounded bg-secondary-200 py-1 px-2">
                    <Text variant="text-12-bold" className="text-green">
                      Verified
                    </Text>
                  </div>
                </Then>
                <Else>
                  <div className="w-fit rounded bg-grey-100 py-1 px-2">
                    <Text variant="text-12-semibold" className="text-neutral-600">
                      Not Verified
                    </Text>
                  </div>
                </Else>
              </If>
            ),
            meta: { align: "center" }
          },
          {
            accessorKey: "elipsis",
            header: "",
            cell: (props: any) => (
              <Menu
                menu={[
                  {
                    id: "1",
                    render: () => (
                      <div className="flex items-center gap-2">
                        <Icon name={IconNames.EDIT_PA} className="h-3 w-3" />
                        <Text variant="text-12-bold">Edit</Text>
                      </div>
                    ),
                    onClick: () => {
                      openModalImageDetail(props.getValue());
                    }
                  },
                  {
                    id: "2",
                    render: () => (
                      <div className="flex items-center gap-2">
                        <Icon name={IconNames.TRASH_PA} className="h-3 w-3" />
                        <Text variant="text-12-bold">Delete</Text>
                      </div>
                    ),
                    onClick: () => {
                      onDelete && onDelete(props.getValue());
                    }
                  }
                ]}
              >
                <Icon name={IconNames.ELIPSES} />
              </Menu>
            ),
            meta: { align: "right" },
            enableSorting: false
          }
        ]}
      />
    </When>
  );
};

export default FilePreviewTable;
