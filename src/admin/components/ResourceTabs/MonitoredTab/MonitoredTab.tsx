import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import StatusBar from "@/components/elements/StatusBar/StatusBar";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import DataCard, { DataStructure } from "./components/DataCard";
import FormMonitored from "./components/FormMonitored";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const TableData = [
  {
    polygonName: "ABA",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "50.0",
    phase: "baseline"
  },
  {
    polygonName: "Adison Thaochu A",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "85.0",
    phase: "baseline"
  },
  {
    polygonName: "AEK Nabara Selatan",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "75.0",
    phase: "baseline"
  },
  {
    polygonName: "AEK Raso",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "50.0",
    phase: "baseline"
  },
  {
    polygonName: "AEK Torup",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "65.0",
    phase: "baseline"
  },
  {
    polygonName: "Africas",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "50.0",
    phase: "baseline"
  },
  {
    polygonName: "Agoue Iboe",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "55.0",
    phase: "baseline"
  },
  {
    polygonName: "Agrajaya Baktitama",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "50.0",
    phase: "baseline"
  },
  {
    polygonName: "Agralsa",
    site: "Tannous/Brayton Road",
    year: "2024",
    cover: "",
    confidence: "75.0",
    phase: "baseline"
  }
];

const MonitoredCardData: DataStructure[] = [
  {
    label: "Tree Cover (TTC)",
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
    label: "Hectares by EcoRegion",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Hectares by Strategy",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Hectares by Land Use",
    tooltipContent: "Tooltip",
    tableData: TableData
  },
  {
    label: "Hectares by Land Use and Strategy",
    tooltipContent: "Tooltip",
    tableData: TableData
  }
];

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  const [intersectingCard, setIntersectingCard] = useState<string | null>(null);
  const cardLabelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const refWidth = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardElements = cardRefs.current;

    const observer = new IntersectionObserver(
      entries => {
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);

        if (intersectingEntries.length > 0) {
          const sortedEntries = intersectingEntries.sort((a, b) => {
            const aRect = a.target.getBoundingClientRect();
            const bRect = b.target.getBoundingClientRect();
            const aCenter = Math.abs(aRect.top + aRect.height / 2 - window.innerHeight / 2);
            const bCenter = Math.abs(bRect.top + bRect.height / 2 - window.innerHeight / 2);
            return aCenter - bCenter;
          });

          const mostCenteredEntry = sortedEntries[0];
          const index = mostCenteredEntry.target.getAttribute("data-index");

          if (index !== null) {
            const numIndex = Number(index);

            setIntersectingCard(MonitoredCardData[numIndex].label);
            focusOnCardLabel(numIndex);

            if (numIndex === 0) {
              focusOnCardLabel(0);
            } else if (numIndex === MonitoredCardData.length - 1) {
              focusOnCardLabel(MonitoredCardData.length - 1);
            }
          }
        }
      },
      { threshold: 1 }
    );

    cardElements.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      cardElements.forEach(ref => {
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

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
      const parentElement = scrollContainerRef.current;
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
        <div className="flex w-[36%] flex-col gap-4" ref={refWidth}>
          <div className="relative w-full self-center overflow-hidden rounded-lg">
            <img src="/images/map-img.png" alt="Monitored" className="w-full" />
            <div className="absolute top-0 z-10 flex h-full w-full items-center justify-center">
              <button className="text-12-semibold flex items-center rounded-full bg-white object-center px-2 py-1 text-primary hover:bg-primary hover:text-white lg:px-3">
                <Icon name={IconNames.MAP_PIN} className="mr-[3px] w-[10px] lg:w-3" />
                View Map
              </button>
            </div>
          </div>
          <FormMonitored />
        </div>
        <div className="flex min-w-0 flex-col gap-4" style={{ width: (refWidth.current?.clientWidth ?? 0) * 1.74 }}>
          <div className="flex min-w-0 items-center gap-2">
            <div
              ref={scrollContainerRef}
              className="scroll-indicator-hide flex min-w-0 items-center gap-2 overflow-auto"
            >
              {MonitoredCardData.map((data, index) => (
                <button
                  key={data.label}
                  onClick={() => focusOnCard(index)}
                  ref={el => (cardLabelRefs.current[index] = el)}
                >
                  <Text
                    variant="text-12-light"
                    className={classNames("whitespace-nowrap rounded-lg border border-grey-700 px-1", {
                      "!font-bold": intersectingCard === data.label
                    })}
                  >
                    {data.label}
                  </Text>
                </button>
              ))}
            </div>
            <button onClick={scrollRight}>{">"}</button>
          </div>
          <StatusBar
            title="Analysis is due for 345 Polygons for this project. Please run analysis."
            status="awaiting"
            className="!w-full"
            classNameStatusBar="!w-full"
          />
          <div className="flex max-h-[89vh] w-full flex-col gap-5 overflow-auto">
            {MonitoredCardData.map((data, index) => (
              <div key={data.label} data-index={index} ref={el => (cardRefs.current[index] = el)}>
                <DataCard data={data} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default MonitoredTab;
