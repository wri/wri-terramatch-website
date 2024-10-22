import { When } from "react-if";

import CommentaryBox from "@/components/elements/CommentaryBox/CommentaryBox";
import Text from "@/components/elements/Text/Text";
import Loader from "@/components/generic/Loading/Loader";
import { useGetAuthMe } from "@/generated/apiComponents";

import { AuditLogEntity } from "../../../AuditLogTab/constants/types";

const CommentarySection = ({
  record,
  entity,
  refresh,
  viewCommentsList = true,
  loading = false
}: {
  record: any;
  entity: AuditLogEntity;
  refresh?: () => void;
  viewCommentsList?: boolean;
  loading?: boolean;
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
      <CommentaryBox
        name={authMe?.data.first_name}
        lastName={authMe?.data.last_name}
        refresh={refresh}
        record={record}
        entity={entity}
      />
      <When condition={viewCommentsList}>
        {loading && (
          <div className="max-h-[60vh] min-h-[10vh] grid-cols-[14%_20%_18%_15%_33%]">
            <Loader />
          </div>
        )}
      </When>
    </div>
  );
};

export default CommentarySection;
