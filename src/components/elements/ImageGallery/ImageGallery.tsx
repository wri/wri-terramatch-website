import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useState } from "react";
import { When } from "react-if";

import FilterDropDown from "@/components/elements/TableFilters/Inputs/FilterDropDown";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import Pagination from "@/components/extensive/Pagination";
import { useModalContext } from "@/context/modal.provider";
import { Option } from "@/types/common";

import ImageGalleryItem, { ImageGalleryItemData, ImageGalleryItemProps } from "./ImageGalleryItem";
import ImageGalleryPreviewer from "./ImageGalleryPreviewer";

export interface ImageGalleryProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  data: ImageGalleryItemData[];
  pageCount: number;
  onGalleryStateChange: (
    pagination: { page: number; pageSize: number },
    filter?: { key: string; value: string }
  ) => void;
  onDeleteConfirm: (id: string) => void;
  hasFilter?: boolean;
  filterOptions?: Option[];
  ItemComponent?: FC<ImageGalleryItemProps>;
}

const ImageGallery = ({
  title,
  data,
  pageCount,
  onGalleryStateChange,
  onDeleteConfirm,
  className,
  hasFilter = true,
  filterOptions = [],
  ItemComponent = ImageGalleryItem,
  ...rest
}: ImageGalleryProps) => {
  const t = useT();
  const defaultPageSize = 10;

  const { openModal, closeModal } = useModalContext();

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [modelName, setModelName] = useState<string>();

  const getCanNextPage = () => {
    return pageIndex + 1 < pageCount;
  };

  const getCanPreviousPage = () => {
    return pageIndex > 0;
  };

  const getPageCount = () => {
    return pageCount;
  };

  const nextPage = () => {
    setPageIndex(state => state + 1);
  };

  const previousPage = () => {
    setPageIndex(state => state - 1);
  };

  const handlePageSizeChange = (count: number) => {
    setPageSize(count);
    setPageIndex(0);
  };

  const onClickGalleryItem = (previewData: ImageGalleryItemData) => {
    openModal(<ImageGalleryPreviewer data={previewData} onDelete={handleDelete} />);
  };

  const handleDelete = (id: string) => {
    openModal(
      <Modal
        title={t("Delete Image")}
        content={t(
          "Are you sure you want to delete this image? This action cannot be undone, and the image will be permanently removed."
        )}
        iconProps={{
          height: 60,
          width: 60,
          className: "fill-error",
          name: IconNames.TRASH_CIRCLE
        }}
        primaryButtonProps={{
          children: t("Confirm Delete"),
          onClick: () => {
            closeModal();
            onDeleteConfirm(id);
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: closeModal
        }}
      />
    );
  };

  useEffect(() => {
    onGalleryStateChange(
      { page: pageIndex + 1, pageSize },
      modelName && modelName != "-1" ? { key: "model_name", value: modelName } : undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize, modelName]);

  return (
    <>
      <div {...rest} className={classNames("space-y-8", className)}>
        <When condition={hasFilter}>
          <FilterDropDown
            placeholder="Show All"
            className="w-64"
            options={[{ title: t("Show All"), value: "-1" }, ...filterOptions]}
            onChange={setModelName}
          />
        </When>
        {/* Images */}
        <div className="grid-cols-3 grid gap-8">
          {data.map(item => (
            <ItemComponent
              key={item.uuid}
              data={item}
              onClickGalleryItem={onClickGalleryItem}
              onDelete={handleDelete}
            />
          ))}
        </div>
        {data.length === 0 && (
          <div className="!mb-16">
            <Text variant="text-bold-subtitle-500" className="mb-2 w-full text-center">
              {t("No images found.")}
            </Text>
            <Text variant="text-light-subtitle-400" className="w-full text-center">
              {t("Try refining your filter options or add new images.")}
            </Text>
          </div>
        )}
        <Pagination
          getCanNextPage={getCanNextPage}
          getCanPreviousPage={getCanPreviousPage}
          getPageCount={getPageCount}
          nextPage={nextPage}
          previousPage={previousPage}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          setPageSize={handlePageSizeChange}
          defaultPageSize={defaultPageSize}
          hasPageSizeSelector
        />
      </div>
    </>
  );
};

export default ImageGallery;
