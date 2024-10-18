import classNames from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import Button from "@/components/elements/Button/Button";
import RadioGroup from "@/components/elements/Inputs/RadioGroup/RadioGroup";
import StatusBar from "@/components/elements/StatusBar/StatusBar";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import DataCard, { DataStructure } from "./components/DataCard";
import FormMonitored from "./components/FormMonitored";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
}

const MonitoredCardData: DataStructure[] = [
  {
    label: "Tree Cover (TTC)",
    tooltipContent: "Tooltip",
    tableData: [
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
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
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
        confidence: "50.0",
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
        polygonName: "Adison Thaochu A",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      }
    ]
  },
  {
    label: "Tree Cover Loss",
    tooltipContent: "Tooltip",
    tableData: [
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
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      },
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
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      },
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
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      }
    ]
  },
  {
    label: "Tree Cover Loss from Fire",
    tooltipContent: "Tooltip",
    tableData: [
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
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      }
    ]
  },
  {
    label: "Hectares by EcoRegion",
    tooltipContent: "Tooltip",
    tableData: [
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
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      }
    ]
  },
  {
    label: "Hectares by Strategy",
    tooltipContent: "Tooltip",
    tableData: [
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
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      }
    ]
  },
  {
    label: "Hectares by Land Use",
    tooltipContent: "Tooltip",
    tableData: [
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
        confidence: "50.0",
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: "50.0",
        phase: "baseline"
      }
    ]
  },
  {
    label: "Hectares by Land Use and Strategy",
    tooltipContent: "Tooltip",
    tableData: [
      {
        polygonName: "ABA",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "Adison Thaochu A",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      },
      {
        polygonName: "AEK Nabara Selatan",
        site: "Tannous/Brayton Road",
        year: "2024",
        cover: "",
        confidence: 50.0,
        phase: "baseline"
      }
    ]
  }
];

const MonitoredTab: FC<IProps> = ({ label, ...rest }) => {
  const [intersectingCard, setIntersectingCard] = useState<string | null>(null);
  const cardLabelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const refWidth = useRef<HTMLDivElement>(null);
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

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scroll = scrollContainerRef.current;
      scroll.scrollBy({ left: scroll.clientWidth, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scroll = scrollContainerRef.current;
      scroll.scrollBy({ left: -scroll.clientWidth, behavior: "smooth" });
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
          <div>
            <Text variant="text-14" className="mb-1.5 flex items-center gap-1">
              Display polygons
              <Icon name={IconNames.IC_INFO} className="ml-1 h-[14px] w-[14px] text-darkCustom" />
            </Text>
            <RadioGroup
              contentClassName="flex flex-wrap gap-1 !space-y-0"
              variantTextRadio="text-12-semibold"
              labelRadio="text-darkCustom-300"
              classNameRadio="!gap-1"
              contentRadioClassName="text-darkCustom-300 !border-neutral-300 py-[6px] px-[6px] rounded-lg w-fit"
              options={[
                { title: "All Polygons", value: "All Polygons" },
                { title: "Analysis Due <30 Days", value: "Analysis Due <30 Days" },
                { title: "Analysis Due < 7 Days", value: "Analysis Due < 7 Days" },
                { title: "OverDue", value: "OverDue" }
              ]}
            />
          </div>
          <FormMonitored />
        </div>
        <div className="flex min-w-0 flex-col gap-4" style={{ width: (refWidth.current?.clientWidth ?? 0) * 1.74 }}>
          <div className="flex min-w-0 items-center gap-2">
            <Button variant="white-border" onClick={scrollLeft} className="min-h-fit rounded-full p-1">
              <Icon name={IconNames.CHEVRON_RIGHT} className="h-3 w-3 rotate-180" />
            </Button>
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
            <Button variant="white-border" onClick={scrollRight} className="min-h-fit rounded-full p-1">
              <Icon name={IconNames.CHEVRON_RIGHT} className="h-3 w-3" />
            </Button>
          </div>
          <StatusBar
            title="Analysis is due for 345 Polygons for this project. Please run analysis."
            status="awaiting"
            className="!w-full"
            classNameStatusBar="!w-full"
          />
          <div className="relative flex max-h-[89vh] w-full flex-col gap-5 overflow-auto" ref={cardRefsContainer}>
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
