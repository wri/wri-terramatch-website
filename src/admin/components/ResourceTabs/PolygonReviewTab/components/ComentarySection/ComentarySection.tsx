import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";
import Text from "@/components/elements/Text/Text";
import Loader from "@/components/generic/Loading/Loader";
import { useGetAuthMe } from "@/generated/apiComponents";

const comentaryFiles: any[] = [
  // { id: "1", file: "img-attachment.jpeg" },
  // { id: "2", file: "img-attachment-with-large-name.jpeg" },
  // { id: "3", file: "img-attachment.jpeg" },
  // { id: "4", file: "img-attachment.jpeg" }
];

const ComentarySection = ({
  auditLogData,
  mutate,
  refresh,
  record
}: {
  auditLogData?: any;
  mutate?: any;
  refresh: any;
  record?: any;
}) => {
  const { data: authMe } = useGetAuthMe({}) as {
    data: {
      data: any;
      first_name: string;
      last_name: string;
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <Text variant="text-16-bold">Send Comment</Text>
      <ComentaryBox
        name={authMe?.data.first_name}
        lastName={authMe?.data.last_name}
        mutate={mutate}
        refresh={refresh}
        record={record}
      />
      {auditLogData && auditLogData.length > 0 ? (
        auditLogData
          ?.filter((item: any) => item.type == "comment")
          .slice(0, 5)
          .map((item: any) => (
            <Comentary
              key={item.id}
              name={item?.first_name || item.created_by}
              lastName={item?.last_name}
              date={item.date_created}
              comentary={item.comment}
              files={comentaryFiles}
            />
          ))
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default ComentarySection;
