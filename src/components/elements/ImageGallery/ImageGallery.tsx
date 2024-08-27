import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useState } from "react";
import { When } from "react-if";

import FilterDropDown from "@/components/elements/TableFilters/Inputs/FilterDropDown";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Pagination from "@/components/extensive/Pagination";
import { VARIANT_PAGINATION_TEXT_16 } from "@/components/extensive/Pagination/PaginationVariant";
import { useModalContext } from "@/context/modal.provider";
import { Option } from "@/types/common";

import Button from "../Button/Button";
import FilterSearchBox from "../TableFilters/Inputs/FilterSearchBox";
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
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = ["All Images", "Geotagged", "Not Geotagged"];

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
    openModal(
      ModalId.IMAGE_GALLERY_PREVIEWER,
      <ImageGalleryPreviewer data={previewData} onDelete={handleDelete} />,
      true
    );
  };

  const handleDelete = (id: string) => {
    openModal(
      ModalId.DELETE_IMAGE,
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
            closeModal(ModalId.DELETE_IMAGE);
            onDeleteConfirm(id);
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: () => closeModal(ModalId.DELETE_IMAGE)
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
        <div className="flex justify-between gap-4">
          <div className="flex gap-4">
            <When condition={!hasFilter}>
              <FilterDropDown
                placeholder="Show All"
                className="w-64"
                options={[{ title: t("Show All"), value: "-1" }, ...filterOptions]}
                onChange={setModelName}
              />
            </When>
            <FilterSearchBox onChange={() => {}} placeholder={"Search..."} className="w-64" />
            <div className="flex rounded-lg bg-neutral-40 p-1 ">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveIndex(index)} // Actualizar el estado al hacer clic en el botón
                  className={classNames(
                    "hover:stroke-blue-950 hover:text-blue-950 group inline-flex h-full w-max min-w-[32px] items-center justify-center gap-1 whitespace-nowrap px-3 align-middle transition-all duration-300 ease-in-out",
                    activeIndex === index && "text-14-bold rounded-md bg-white text-darkCustom drop-shadow",
                    activeIndex !== index && "text-14-light rounded-lg bg-transparent text-darkCustom-60"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <Button>Upload Images</Button>
        </div>

        {/* Images */}
        <div className="grid grid-cols-3 gap-4">
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
          variant={VARIANT_PAGINATION_TEXT_16}
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
          invertSelect
        />
      </div>
    </>
  );
};

export default ImageGallery;
