import Comentary from "@/components/elements/Comentary/Comentary";
import ComentaryBox from "@/components/elements/ComentaryBox/ComentaryBox";
import Text from "@/components/elements/Text/Text";
import { useGetAuthMe } from "@/generated/apiComponents";

const comentaryFiles = [
  { id: "1", file: "img-attachment.jpeg" },
  { id: "2", file: "img-attachment-with-large-name.jpeg" },
  { id: "3", file: "img-attachment.jpeg" },
  { id: "4", file: "img-attachment.jpeg" }
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
      {auditLogData
        ?.filter((item: any) => item.type == "comment")
        .map((item: any) => (
          <Comentary
            key={item.id}
            name={item.created_by}
            lastName={""}
            date={item.date_created}
            comentary={item.comment}
            files={comentaryFiles}
          />
        ))}
    </div>
  );
};

export default ComentarySection;
