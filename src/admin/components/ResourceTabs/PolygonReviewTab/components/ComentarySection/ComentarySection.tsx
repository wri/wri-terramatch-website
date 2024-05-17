import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";
import Text from "@/components/elements/Text/Text";
import Loader from "@/components/generic/Loading/Loader";
import { useGetAuthMe, useGetV2Attachment } from "@/generated/apiComponents";

const ComentarySection = ({
  auditLogData,
  mutate,
  refresh,
  record,
  entity
}: {
  auditLogData?: any;
  mutate?: any;
  refresh?: any;
  record?: any;
  entity?: string;
}) => {
  const { data: authMe } = useGetAuthMe({}) as {
    data: {
      data: any;
      first_name: string;
      last_name: string;
    };
  };
  const { data: attachment, refetch: attachmentRefetch } = useGetV2Attachment<any>({});

  return (
    <div className="flex flex-col gap-4">
      <Text variant="text-16-bold">Send Comment</Text>
      <ComentaryBox
        name={authMe?.data.first_name}
        lastName={authMe?.data.last_name}
        mutate={mutate}
        refresh={refresh}
        record={record}
        entity={entity}
        attachmentRefetch={attachmentRefetch}
      />
      <div className="max-h-[60vh] min-h-[10vh] grid-cols-[14%_20%_18%_15%_33%] overflow-auto">
        {auditLogData !== null && auditLogData !== undefined ? (
          auditLogData.length > 0 ? (
            auditLogData
              .filter((item: any) => item.type === "comment")
              .map((item: any) => (
                <Comentary
                  key={item.id}
                  name={item?.first_name || item.created_by}
                  lastName={item?.last_name}
                  date={item.date_created}
                  comentary={item.comment}
                  files={attachment?.data?.filter((attachment: any) => attachment.entity_id == item.id)}
                />
              ))
          ) : (
            <></>
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default ComentarySection;
