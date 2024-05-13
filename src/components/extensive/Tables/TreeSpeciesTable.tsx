import { useT } from "@transifex/react";
import { useEffect, useState } from "react";

import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import {
  GetV2FormsENTITYUUIDResponse,
  GetV2TreeSpeciesEntityUUIDResponse,
  useGetV2FormsENTITYUUID,
  useGetV2TreeSpeciesEntityUUID
} from "@/generated/apiComponents";

export interface TreeSpeciesTableProps {
  modelName: string;
  modelUUID: string;
  collection?: string;
  onFetch?: (data: GetV2TreeSpeciesEntityUUIDResponse) => void;
}

const TreeSpeciesTable = ({ modelName, modelUUID, collection, onFetch }: TreeSpeciesTableProps) => {
  const t = useT();
  const [showTreeSpecies, setShowTreeSpecies] = useState(false);

  const [queryParams, setQueryParams] = useState<any>();

  if (collection && queryParams) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: treeSpecies, isLoading } = useGetV2TreeSpeciesEntityUUID(
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

  const hasCountColumn =
    treeSpecies?.data && treeSpecies?.data?.length > 0
      ? treeSpecies?.data?.reduce((total, item) => total + (typeof item.amount === "number" ? 1 : 0), 0) > 0
      : false;

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
            if (child.input_type === "treeSpecies") {
              setShowTreeSpecies(viewDataDisturbances?.[sectionIndex as number]?.[questionIndex as number]);
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
        meta={treeSpecies?.meta}
        data={showTreeSpecies ? treeSpecies?.data?.map(item => ({ ...item, amount: item.amount || 0 })) || [] : []}
        isLoading={isLoading}
        treeSpeciesShow={true}
        onQueryParamChange={setQueryParams}
        columns={[
          {
            accessorKey: "name",
            header: t("Name"),
            enableSorting: false
          },
          {
            accessorKey: "amount",
            header: t("Count"),
            enableSorting: false
          }
        ].filter(item => hasCountColumn || item.accessorKey !== "amount")}
      />
    </div>
  );
};

export default TreeSpeciesTable;
