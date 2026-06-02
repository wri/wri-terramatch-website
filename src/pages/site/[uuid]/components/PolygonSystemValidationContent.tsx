import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { validationLabels } from "@/components/elements/MapPolygonPanel/ChecklistInformation";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import FloatingActionToolbar from "@/redesignComponents/navigation/Toolbar/FloatingActionToolbar";
import { ICriteriaCheckItem } from "@/types/validation";

import SubmissionValidationTags from "./SubmissionValidationTags";
import ValidationDetail from "./ValidationDetail";

export type PolygonSystemValidationContentProps = {
  polygon?: SitePolygonLightDto;
};

// TODO: Replace with real validation data from API
const MOCK_VALIDATION_ITEMS: ICriteriaCheckItem[] = [
  { id: 3, status: true, label: validationLabels[3], extra_info: null },
  { id: 4, status: true, label: validationLabels[4], extra_info: null },
  { id: 5, status: true, label: validationLabels[5], extra_info: null },
  { id: 6, status: false, label: validationLabels[6], extra_info: null },
  {
    id: 7,
    status: true,
    label: validationLabels[7],
    extra_info: { countryName: "Malawi" }
  },
  { id: 8, status: false, label: validationLabels[8], extra_info: null },
  { id: 10, status: true, label: validationLabels[10], extra_info: null },
  {
    id: 12,
    status: true,
    label: validationLabels[12],
    extra_info: {
      totalAreaSite: null,
      totalAreaProject: 1500,
      sumAreaProjectApproved: 2669.92,
      percentageProjectApproved: 177.99,
      isPolygonApproved: true
    }
  },
  { id: 14, status: true, label: validationLabels[14], extra_info: null },
  { id: 15, status: true, label: validationLabels[15], extra_info: null }
];

// TODO: Replace with real validation data from API
const MOCK_VALIDATION_ITEMS_OVERLAPPING: ICriteriaCheckItem[] = [
  { id: 3, status: false, label: "Overlapping Polygon", extra_info: null },
  { id: 4, status: true, label: validationLabels[4], extra_info: null },
  { id: 5, status: true, label: validationLabels[5], extra_info: null },
  { id: 6, status: false, label: validationLabels[6], extra_info: null },
  {
    id: 7,
    status: true,
    label: validationLabels[7],
    extra_info: { countryName: "Malawi" }
  },
  { id: 8, status: false, label: validationLabels[8], extra_info: null },
  { id: 10, status: true, label: validationLabels[10], extra_info: null },
  {
    id: 12,
    status: true,
    label: validationLabels[12],
    extra_info: {
      totalAreaSite: null,
      totalAreaProject: 1500,
      sumAreaProjectApproved: 2669.92,
      percentageProjectApproved: 177.99,
      isPolygonApproved: true
    }
  },
  { id: 14, status: true, label: validationLabels[14], extra_info: null },
  { id: 15, status: true, label: validationLabels[15], extra_info: null }
];

const MOCK_FAILED_COUNT = MOCK_VALIDATION_ITEMS.filter(item => !item.status).length;
const MOCK_TOTAL_ITEMS = MOCK_VALIDATION_ITEMS.length;
const MOCK_FAILED_COUNT_OVERLAPPING = MOCK_VALIDATION_ITEMS_OVERLAPPING.filter(item => !item.status).length;
const MOCK_TOTAL_ITEMS_OVERLAPPING = MOCK_VALIDATION_ITEMS_OVERLAPPING.length;

const PolygonSystemValidationContent: FC<PolygonSystemValidationContentProps> = ({ polygon }) => {
  const overlapping = polygon?.validationStatus === "failed";
  const t = useT();
  return (
    <Flex className="min-h-0 flex-1 flex-col gap-2">
      <Flex className="mr-[0.25rem] min-h-0 flex-1 flex-col gap-2 overflow-auto py-5 px-2 pl-6 pr-7">
        <SubmissionValidationTags polygon={polygon} />
        <Flex direction="column" gap={3} className="mt-4">
          <ValidationDetail
            failedCount={overlapping ? MOCK_FAILED_COUNT_OVERLAPPING : MOCK_FAILED_COUNT}
            totalItems={overlapping ? MOCK_TOTAL_ITEMS_OVERLAPPING : MOCK_TOTAL_ITEMS}
            items={overlapping ? MOCK_VALIDATION_ITEMS_OVERLAPPING : MOCK_VALIDATION_ITEMS}
          />
        </Flex>
      </Flex>
      {overlapping && (
        <Flex className="w-full justify-center">
          <FloatingActionToolbar
            className="bg-theme-neutral-200"
            items={[
              {
                onClick: () => {},
                label: t("Fix Overlap")
              }
            ]}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default PolygonSystemValidationContent;
