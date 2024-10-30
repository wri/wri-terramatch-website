import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import Button from "@/components/elements/Button/Button";
import FilterSearchBox from "@/components/elements/TableFilters/Inputs/FilterSearchBox";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import DataCard, { DataStructure } from "./components/DataCard";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const TableData = [
  {
    polygonName: "ABA",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "50.0",
    phase: "baseline"
  },
  {
    polygonName: "Adison Thaochu A",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "85.0",
    phase: "baseline"
  },
  {
    polygonName: "AEK Nabara Selatan",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "75.0",
    phase: "baseline"
  },
  {
    polygonName: "AEK Raso",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "50.0",
    phase: "baseline"
  },
  {
    polygonName: "AEK Torup",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "65.0",
    phase: "baseline"
  },
  {
    polygonName: "Africas",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "50.0",
    phase: "baseline"
  },
  {
    polygonName: "Agoue Iboe",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "55.0",
    phase: "baseline"
  },
  {
    polygonName: "Agrajaya Baktitama",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "50.0",
    phase: "baseline"
  },
  {
    polygonName: "Agralsa",
    site: "Tannous/Brayton Road",
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
    year: "2024",
    cover: "",
    confidence: "75.0",
    phase: "baseline"
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
  const [isCardsTable, setIsCardsTable] = useState(false);
  const cardLabelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefsContainer = useRef<HTMLDivElement>(null);

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

  return (
    <TabbedShowLayout.Tab label={label ?? "Monitored Data"} {...rest}>
      <div className="flex max-h-[calc(98vh_-_32px)] w-full gap-4">
        {/* <div className="flex w-[22%] flex-col gap-4" ref={refWidth}>
          <div className="relative self-center w-full overflow-hidden rounded-lg">
            <img src="/images/map-img.png" alt="Monitored" className="w-full" />
            <div className="absolute top-0 z-10 flex items-center justify-center w-full h-full">
              <button className="flex items-center object-center px-2 py-1 bg-white rounded-full text-12-semibold text-primary hover:bg-primary hover:text-white lg:px-3">
                <Icon name={IconNames.MAP_PIN} className="mr-[3px] w-[10px] lg:w-3" />
                View Map
              </button>
            </div>
          </div>
          <FormMonitored />
        </div> */}
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
                  variant="text-16-light"
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

          <div className="flex w-full flex-col gap-5">
            <div className="flex items-center justify-between">
              <FilterSearchBox placeholder="Search" />
              <div className="flex gap-4">
                <Button variant="purple">
                  <Icon name={IconNames.RUN_ALALYSIS} className="h-4 w-4" />
                  Run Analysis
                </Button>
                <Button variant="white-border" className="!h-min !min-h-min !rounded-lg !py-1">
                  <div className="text-14 flex h-min max-h-min items-center gap-2 normal-case text-black">
                    <Icon name={IconNames.IC_FILTER} className="h-4 w-4" />
                    Filter
                  </div>
                </Button>
                <Button
                  variant="white-border"
                  className="!h-min !min-h-min !rounded-lg !py-1"
                  onClick={() => setIsCardsTable(!isCardsTable)}
                >
                  <div className="text-14 flex h-min max-h-min items-center gap-2 normal-case text-black">
                    <Icon name={isCardsTable ? IconNames.DASHBOARD : IconNames.TABLE} className="h-4 w-4" />
                    {isCardsTable ? "Dashboard" : "Table"}
                  </div>
                </Button>
              </div>
            </div>
            <div className=" flex max-h-[85vh] w-full flex-col gap-5 overflow-auto" ref={cardRefsContainer}>
              {MonitoredCardData.map((data, index) => (
                <div key={data.label} data-index={index} ref={el => (cardRefs.current[index] = el)}>
                  <DataCard data={data} isCardsTable={isCardsTable} />
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
