import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import Button from "@/components/elements/Button/Button";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import { FILTER_SEARCH_MONITORING } from "@/components/elements/TableFilters/Inputs/FilterSearchBoxVariants";
import Text from "@/components/elements/Text/Text";
import Toggle, { TogglePropsItem } from "@/components/elements/Toggle/Toggle";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalRunAnalysis from "@/components/extensive/Modal/ModalRunAnalysis";
import { useModalContext } from "@/context/modal.provider";

import DataCard, { DataStructure } from "./components/DataCard";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const TableData = [
  {
    polygonName: "ABA",
    siteName: "Palm Oil",
    status: "Draft",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Adison Thaochu A",
    siteName: "Palm Oil",
    status: "Submitted",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "AEK Nabara Selatan",
    siteName: "Palm Oil",
    status: "Needs Info",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "AEK Raso",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "AEK Torup",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Africas",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Agoue Iboe",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Agrajaya Baktitama",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  },
  {
    polygonName: "Agralsa",
    siteName: "Palm Oil",
    status: "Approved",
    size: "7,473",
    dateRun2024: "9/26/24",
    dateRun2025: "10/25/24",
    "2024-2015": "0.423",
    "2024-2016": "0.120",
    "2024-2017": "0.655",
    "2024-2018": "0.208",
    "2024-2019": "0.654",
    "2024-2020": "0.466",
    "2024-2021": "0.151",
    "2024-2022": "0.385",
    "2024-2023": "0.457",
    "2024-2024": "0.966",
    "2025-2016": "0.966",
    "2025-2017": "0.655",
    "2025-2018": "0.208",
    "2025-2019": "0.654",
    "2025-2020": "0.466",
    "2025-2021": "0.151",
    "2025-2022": "0.385",
    "2025-2023": "0.457",
    "2025-2024": "0.966",
    "2025-2025": "0.966"
  }
];

const MonitoredCardData: DataStructure[] = [
  {
    label: "Tree Cover TTC",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Tree Cover Loss",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Tree Cover Loss from Fire",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Restoration by  EcoRegion",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Restoration by Strategy",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Restoration by Land Use",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Tree Count",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Early Tree Verificaiton",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Field Monitoring",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "MSU Carbon",
    tooltipContent: "Tooltip",
    tableData: TableData
  }
];

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  const [intersectingCard, setIntersectingCard] = useState<string | null>(MonitoredCardData[0].label);
  const [widthValue, setWidthValue] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardLabelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefsContainer = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useModalContext();

  const toggleItems: TogglePropsItem[] = [
    {
      key: "dashboard",
      render: (
        <Text variant="text-14">
          <div className="text-14 flex h-min max-h-min items-center gap-2 normal-case text-black">
            <Icon name={IconNames.DASHBOARD} className="h-4 w-4" />
            Dashboard
          </div>
        </Text>
      )
    },
    {
      key: "table",
      render: (
        <Text variant="text-14">
          <div className="text-14 flex h-min max-h-min items-center gap-2 normal-case text-black">
            <Icon name={IconNames.TABLE} className="h-4 w-4" />
            Table
          </div>
        </Text>
      )
    }
  ];

  useEffect(() => {
    const cardElements = cardRefs.current;
    const container = cardRefsContainer.current;

    if (!container) return;
    if (MonitoredCardData.length == 0) return;

    const findNearestCard = (cardsTop: number[], centerContainer: number): number => {
      let nearestCardIndex = 0;
      let smallestDifference = Math.abs(cardsTop[0] - centerContainer);

      for (let i = 1; i < cardsTop.length; i++) {
        const difference = Math.abs(cardsTop[i] - centerContainer);
        if (difference < smallestDifference) {
          nearestCardIndex = i;
          smallestDifference = difference;
        }
      }

      return nearestCardIndex;
    };

    const handleScroll = () => {
      if (!cardElements.length) return;

      const containerRect = container.getBoundingClientRect();
      const centerContainer = containerRect.top + containerRect.height / 2;
      const isAtTop = container.scrollTop === 0;
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;

      let intersectingCard = null;
      let cardsTop: number[] = [];

      for (let i = 0; i < cardElements.length; i++) {
        const card = cardElements[i];
        if (!card) continue;

        const rect = card.getBoundingClientRect();
        const top = rect.top + rect.height / 2;
        cardsTop = [...cardsTop, top];
      }
      if (isAtTop || isAtBottom) {
        intersectingCard = isAtTop ? 0 : MonitoredCardData.length - 1;
      } else {
        intersectingCard = findNearestCard(cardsTop, centerContainer);
      }
      setIntersectingCard(MonitoredCardData[intersectingCard].label);
      focusOnCardLabel(intersectingCard);
    };
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const focusOnCard = (index: number) => {
    const targetElement = cardRefs.current[index];
    if (targetElement) {
      const parentElement = targetElement.parentElement;
      if (parentElement) {
        const rect = targetElement.getBoundingClientRect();
        const parentRect = parentElement.getBoundingClientRect();

        const scrollOffset = rect.top - parentRect.top - parentRect.height / 2 + rect.height / 2;

        parentElement.scrollBy({
          top: scrollOffset,
          behavior: "smooth"
        });
      }
    }
  };

  const focusOnCardLabel = (index: number) => {
    const targetElement = cardLabelRefs.current[index];
    if (targetElement) {
      const parentElement = labelsContainerRef.current;
      if (parentElement) {
        const rect = targetElement.getBoundingClientRect();
        const parentRect = parentElement.getBoundingClientRect();

        const scrollOffset = rect.left - parentRect.left - parentRect.width / 2 + rect.width / 2;

        parentElement.scrollBy({
          left: scrollOffset,
          behavior: "smooth"
        });
      }
    }
  };

  useEffect(() => {
    if (!labelsContainerRef.current) return;

    const labelContainer = labelsContainerRef.current;

    const updateWidth = () => {
      setWidthValue(labelContainer.clientWidth);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);

    resizeObserver.observe(labelContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const openRunAnalysis = () => {
    openModal(
      ModalId.MODAL_RUN_ANALYSIS,
      <ModalRunAnalysis
        title="Run Analysis "
        content="Project Developers may submit one or all polygons for review."
        primaryButtonText="Submit"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            closeModal(ModalId.MODAL_RUN_ANALYSIS);
          }
        }}
        onClose={() => closeModal(ModalId.MODAL_RUN_ANALYSIS)}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.MODAL_RUN_ANALYSIS)
        }}
      />
    );
  };

  return (
    <TabbedShowLayout.Tab label={label ?? "Monitored Data"} {...rest}>
      <div className="flex max-h-[calc(98vh_-_32px)] w-full gap-4 py-1">
        <div className="flex w-full min-w-0 gap-4">
          <div
            ref={labelsContainerRef}
            className="scroll-indicator-hide flex w-[16%] min-w-0 flex-col items-center gap-2 overflow-auto"
          >
            {MonitoredCardData.map((data, index) => (
              <button
                key={data.label}
                onClick={() => focusOnCard(index)}
                ref={el => (cardLabelRefs.current[index] = el)}
                className="w-full"
              >
                <Text
                  variant="text-14-light"
                  className={classNames("rounded-lg p-2 text-start hover:bg-grey-100", {
                    "text-primary": intersectingCard === data.label,
                    "bg-blueCustom-10": intersectingCard === data.label
                  })}
                >
                  {data.label}
                </Text>
              </button>
            ))}
          </div>

          <div className="flex max-w-[82%] flex-col gap-5" style={{ width: widthValue * 5.25 }}>
            <div className="flex items-center justify-between pl-4 pr-2">
              <FilterSearchBox placeholder="Search" onChange={() => {}} variant={FILTER_SEARCH_MONITORING} />
              <div className="flex gap-4">
                <Toggle items={toggleItems} onChangeActiveIndex={setActiveIndex}></Toggle>
                <Button
                  variant="purple"
                  onClick={() => {
                    openRunAnalysis();
                  }}
                >
                  <Icon name={IconNames.RUN_ALALYSIS} className="h-4 w-4" />
                  Run Analysis
                </Button>
                <Button variant="white-border" className="!h-min !min-h-min !rounded-lg !py-1">
                  <div className="text-14 flex h-min max-h-min items-center gap-2 normal-case text-black">
                    <Icon name={IconNames.IC_FILTER} className="h-4 w-4" />
                    Filter
                  </div>
                </Button>
              </div>
            </div>
            <div className=" flex max-h-[85vh] w-full flex-col gap-5 overflow-auto" ref={cardRefsContainer}>
              {MonitoredCardData.map((data, index) => (
                <div key={data.label} data-index={index} ref={el => (cardRefs.current[index] = el)}>
                  <DataCard data={data} isCardsTable={activeIndex === 1} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default MonitoredTab;
