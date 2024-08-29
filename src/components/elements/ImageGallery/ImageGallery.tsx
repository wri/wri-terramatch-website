import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes, useEffect, useState } from "react";
import { When } from "react-if";

import FilterDropDown from "@/components/elements/TableFilters/Inputs/FilterDropDown";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Pagination from "@/components/extensive/Pagination";
import { VARIANT_PAGINATION_TEXT_16 } from "@/components/extensive/Pagination/PaginationVariant";
import { useModalContext } from "@/context/modal.provider";
import { Option } from "@/types/common";

import Menu, { MenuItemProps } from "../Menu/Menu";
import MenuColapse from "../Menu/MenuCollapse";
import { MENU_PLACEMENT_BOTTOM_BOTTOM } from "../Menu/MenuVariant";
import FilterSearchBox from "../TableFilters/Inputs/FilterSearchBox";
import Toggle from "../Toggle/Toggle";
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
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [modelName, setModelName] = useState<string>();
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = ["All Images", "Geotagged", "Not Geotagged"];
  const menuFilter = [
    {
      id: "0",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
          &nbsp; {t("Entity")}
        </Text>
      ),
      type: "collapse",
      children: [
        {
          id: "1",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Projects")}
            </Text>
          )
        },
        {
          id: "2",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Sites")}
            </Text>
          )
        },
        {
          id: "3",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Nurseries")}
            </Text>
          )
        }
      ]
    },
    { id: "2", render: () => {}, type: "line" },
    {
      id: "3",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
          &nbsp; {t("Source")}
        </Text>
      ),
      type: "collapse",
      children: [
        {
          id: "4",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Project")}
            </Text>
          )
        },
        {
          id: "5",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Site")}
            </Text>
          )
        },
        {
          id: "6",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Nursery")}
            </Text>
          )
        },
        {
          id: "7",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Report")}
            </Text>
          )
        }
      ]
    },
    { id: "7.5", render: () => {}, type: "line" },
    {
      id: "5",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
          &nbsp; {t("Privacy")}
        </Text>
      ),
      type: "collapse",
      children: [
        {
          id: "8",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Public")}
            </Text>
          )
        },
        {
          id: "9",
          render: () => (
            <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
              &nbsp; {t("Private")}
            </Text>
          )
        }
      ]
    }
  ];
  const menuSort = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center" onClick={() => {}}>
          <Icon name={IconNames.IC_Z_TO_A_CUSTOM} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Newest to Oldest")}
        </Text>
      )
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center" onClick={() => {}}>
          <Icon name={IconNames.IC_A_TO_Z_CUSTOM} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Oldest to Newest")}
        </Text>
      )
    }
  ];

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
            <FilterSearchBox onChange={() => {}} placeholder={"Search..."} className="w-64" />
            <Toggle items={tabs} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </div>
          <div className="flex gap-4">
            <button className="text-primary hover:text-red">
              <Text variant="text-14-bold">Clear Filters</Text>
            </button>
            <When condition={!hasFilter}>
              <FilterDropDown
                placeholder="Show All"
                className="w-48"
                options={[{ title: t("Show All"), value: "-1" }, ...filterOptions]}
                onChange={setModelName}
                classNameContent="w-48"
              />
            </When>
            <MenuColapse
              menu={menuFilter as MenuItemProps[]}
              placement={MENU_PLACEMENT_BOTTOM_BOTTOM}
              classNameContentMenu="!sticky"
            >
              <button
                className="text-14-bold flex w-48 items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white py-2 pl-4 pr-4"
                onClick={() => {
                  setOpenFilter(!openFilter);
                }}
              >
                Filter
                <Icon
                  name={IconNames.CHEVRON_DOWN}
                  className={classNames(" top-3 right-4 fill-neutral-900 transition", openFilter && "rotate-180")}
                  width={20}
                />
              </button>
            </MenuColapse>
            <Menu menu={menuSort} placement={MENU_PLACEMENT_BOTTOM_BOTTOM} classNameContentMenu="!sticky">
              <button
                className="text-14-bold flex w-32 items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white py-2 pl-4 pr-4"
                onClick={() => {
                  setOpenSort(!openSort);
                }}
              >
                Sort
                <Icon
                  name={IconNames.CHEVRON_DOWN}
                  className={classNames(" top-3 right-4 fill-neutral-900 transition", openSort && "rotate-180")}
                  width={20}
                />
              </button>
            </Menu>
          </div>
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
