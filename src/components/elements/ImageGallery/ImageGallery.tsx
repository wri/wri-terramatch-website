import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, FC, HTMLAttributes, SetStateAction, useEffect, useState } from "react";

import Menu, { MenuItemProps } from "@/components/elements/Menu/Menu";
import MenuColapse from "@/components/elements/Menu/MenuCollapse";
import { MENU_PLACEMENT_BOTTOM_BOTTOM, MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import Pagination from "@/components/extensive/Pagination";
import { VARIANT_PAGINATION_TEXT_16 } from "@/components/extensive/Pagination/PaginationVariant";
import { useModalContext } from "@/context/modal.provider";
import { Option } from "@/types/common";

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
  filterOptions?: Option[];
  ItemComponent?: FC<ImageGalleryItemProps>;
  onChangeSearch: Dispatch<SetStateAction<string>>;
  onChangeGeotagged: Dispatch<SetStateAction<number>>;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
  setFilters: Dispatch<SetStateAction<any>>;
  entity: string;
  isAdmin?: boolean;
  entityData?: any;
}

const ImageGallery = ({
  title,
  data,
  pageCount,
  onGalleryStateChange,
  onDeleteConfirm,
  className,
  filterOptions = [],
  ItemComponent = ImageGalleryItem,
  onChangeSearch,
  onChangeGeotagged,
  sortOrder,
  setSortOrder,
  setFilters,
  entity,
  entityData,
  isAdmin = false,
  ...rest
}: ImageGalleryProps) => {
  const t = useT();
  const defaultPageSize = 10;

  const { openModal, closeModal } = useModalContext();
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [modelName] = useState<string>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [source, setSource] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [privacy, setPrivacy] = useState<boolean>();
  const [filterLabel, setFilterLabel] = useState<string>("Filter");
  const [sortLabel, setSortLabel] = useState<string>("Sort");

  const mapSourceLabels: { [key: string]: string } = {
    projects: t("Project"),
    sites: t("Site"),
    nurseries: t("Nursery"),
    reports: t("Report")
  };

  useEffect(() => {
    setFilters({ isPublic: privacy, modelType: source });
    const currentPrivacytLabel = privacy === false ? "Private" : privacy === true ? "Public" : undefined;
    setFilterLabel(
      source || currentPrivacytLabel
        ? t(
            `${source ? `${mapSourceLabels[source]}${currentPrivacytLabel ? ", " : ""} ` : ""}${
              currentPrivacytLabel ? t(currentPrivacytLabel) : ""
            }`
          )
        : "Filter"
    );
  }, [privacy, source]);

  useEffect(() => {
    setSortLabel(sortOrder === "asc" ? t("Oldest to Newest") : t("Newest to Oldest"));
  }, [sortOrder]);

  const tabs = ["All Images", "Geotagged", "Not Geotagged"];
  const getFilteredMenu = (entity: string) => {
    return [
      {
        id: "3",
        render: () => (
          <Text variant="text-14-semibold" className="flex items-center " onClick={() => {}}>
            &nbsp; {t("Source")}
          </Text>
        ),
        type: "collapse",
        children: [
          ...(entity === "projects"
            ? [
                {
                  id: "4",
                  render: () => (
                    <Text variant="text-14" className="flex items-center ">
                      &nbsp; {t("Project")}
                    </Text>
                  ),
                  onClick: () => {
                    setSource("projects");
                  }
                }
              ]
            : []),
          ...(entity === "projects" || entity === "sites"
            ? [
                {
                  id: "5",
                  render: () => (
                    <Text variant="text-14" className="flex items-center ">
                      &nbsp; {t("Site")}
                    </Text>
                  ),
                  onClick: () => {
                    setSource("sites");
                  }
                }
              ]
            : []),
          ...(entity === "projects" || entity === "nurseries"
            ? [
                {
                  id: "6",
                  render: () => (
                    <Text variant="text-14" className="flex items-center ">
                      &nbsp; {t("Nursery")}
                    </Text>
                  ),
                  onClick: () => {
                    setSource("nurseries");
                  }
                }
              ]
            : []),
          ...(entity === "projects" || entity === "sites" || entity === "nurseries"
            ? [
                {
                  id: "7",
                  render: () => (
                    <Text variant="text-14" className="flex items-center ">
                      &nbsp; {t("Report")}
                    </Text>
                  ),
                  onClick: () => {
                    setSource("reports");
                  }
                }
              ]
            : [])
        ]
      },
      { id: "7.5", render: () => {}, type: "line" },
      {
        id: "5",
        render: () => (
          <Text variant="text-14-semibold" className="flex items-center ">
            &nbsp; {t("Privacy")}
          </Text>
        ),
        type: "collapse",
        children: [
          {
            id: "8",
            render: () => (
              <Text variant="text-14" className="flex items-center ">
                &nbsp; {t("Public")}
              </Text>
            ),
            onClick: () => {
              setPrivacy(true);
            }
          },
          {
            id: "9",
            render: () => (
              <Text variant="text-14" className="flex items-center ">
                &nbsp; {t("Private")}
              </Text>
            ),
            onClick: () => {
              setPrivacy(false);
            }
          }
        ]
      }
    ];
  };

  const menuFilter = getFilteredMenu(entity);

  const menuSort = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14" className="flex items-center" onClick={() => setSortOrder("desc")}>
          <Icon name={IconNames.IC_Z_TO_A_CUSTOM} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Newest to Oldest")}
        </Text>
      )
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14" className="flex items-center" onClick={() => setSortOrder("asc")}>
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

  const handleClearFilters = () => {
    setPrivacy(undefined);
    setSource("");
    setActiveIndex(0);
    setSearchText("");
    onChangeSearch("");
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

  useEffect(() => {
    onChangeGeotagged(activeIndex);
  }, [activeIndex]);
  return (
    <>
      <div {...rest} className={classNames("space-y-8", className)}>
        <div className="flex justify-between gap-4">
          <div className="flex gap-4">
            <FilterSearchBox
              value={searchText}
              onChange={e => {
                setSearchText(e);
                onChangeSearch(e);
              }}
              placeholder={"Search..."}
              className="w-64"
            />
            <Toggle items={tabs} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </div>
          <div className="flex gap-4">
            <button className="text-primary hover:text-red" onClick={handleClearFilters}>
              <Text variant="text-14-bold">{t("Clear Filters")}</Text>
            </button>
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
                {filterLabel}
                <Icon
                  name={IconNames.CHEVRON_DOWN}
                  className={classNames(" top-3 right-4 fill-neutral-900 transition", openFilter && "rotate-180")}
                  width={20}
                />
              </button>
            </MenuColapse>
            <Menu
              menu={menuSort}
              placement={isAdmin ? MENU_PLACEMENT_BOTTOM_LEFT : MENU_PLACEMENT_BOTTOM_BOTTOM}
              classNameContentMenu="!sticky"
            >
              <button
                className="text-14-bold flex w-36 items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white py-2 pl-4 pr-4 lg:w-44"
                onClick={() => {
                  setOpenSort(!openSort);
                }}
              >
                <span className="text-14-bold overflow-hidden text-ellipsis whitespace-nowrap">{sortLabel}</span>
                <Icon
                  name={IconNames.CHEVRON_DOWN}
                  className={classNames("top-3 right-4 fill-neutral-900 transition", openSort && "rotate-180")}
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
              entityData={entityData}
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
