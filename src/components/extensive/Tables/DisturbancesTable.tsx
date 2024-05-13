import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { getDisturbanceTableColumns } from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import {
  GetV2DisturbancesENTITYUUIDResponse,
  GetV2FormsENTITYUUIDResponse,
  useGetV2DisturbancesENTITYUUID,
  useGetV2FormsENTITYUUID
} from "@/generated/apiComponents";

export interface DisturbancesTableProps {
  modelName: string;
  modelUUID: string;
  collection?: string;
  hasCountColumn?: boolean;
  onFetch?: (data: GetV2DisturbancesENTITYUUIDResponse) => void;
}

const DisturbancesTable = ({ modelName, modelUUID, collection, onFetch }: DisturbancesTableProps) => {
  const t = useT();

  const [queryParams, setQueryParams] = useState<any>();
  const [showDisturbance, setShowDisturbance] = useState(false);

  if (collection && queryParams) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: disturbances, isLoading } = useGetV2DisturbancesENTITYUUID(
    {
      queryParams,
      pathParams: { entity: modelName, uuid: modelUUID }
    },
    {
      enabled: !!modelUUID,
      keepPreviousData: true,
      onSuccess: data => onFetch?.(data)
    }
  );

  const hasAllHeaders = !!disturbances?.data?.[0]?.extent && !!disturbances?.data?.[0].intensity;
  const { data: record } = useGetV2FormsENTITYUUID<{ data: GetV2FormsENTITYUUIDResponse }>({
    pathParams: {
      uuid: modelUUID,
      entity: modelName
    }
  });

  const viewDataDisturbances = record?.data?.form?.form_sections.map((questions: any) =>
    questions.form_questions.map((item: any) => item.uuid).map((item: any) => record?.data?.answers?.[item])
  );

  const verifydata = () => {
    record?.data?.form?.form_sections.forEach((section: any, sectionIndex: number) => {
      section.form_questions.forEach((question: any, questionIndex: number) => {
        if (question.children) {
          question.children.forEach((child: any) => {
            if (child.input_type === "disturbances") {
              setShowDisturbance(viewDataDisturbances?.[sectionIndex as number]?.[questionIndex as number]);
              viewDataDisturbances?.[sectionIndex as number]?.[questionIndex as number];
            }
          });
        }
      });
    });
    return false;
  };

  useEffect(() => {
    verifydata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record]);
  return (
    <div>
      <ServerSideTable
        meta={disturbances?.meta}
        data={(showDisturbance ? disturbances?.data : []) || []}
        isLoading={isLoading}
        onQueryParamChange={setQueryParams}
        columns={getDisturbanceTableColumns({ hasExtent: hasAllHeaders, hasIntensity: hasAllHeaders }, t)}
      />
    </div>
  );
};

export default DisturbancesTable;
