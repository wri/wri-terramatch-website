import { When } from "react-if";

import CommentaryBox from "@/components/elements/CommentaryBox/CommentaryBox";
import Text from "@/components/elements/Text/Text";
import Loader from "@/components/generic/Loading/Loader";
import { useMyUser } from "@/connections/User";
import { TextVariants } from "@/types/common";

import { AuditLogEntity } from "../../../AuditLogTab/constants/types";

const CommentarySection = ({
  record,
  entity,
  refresh,
  viewCommentsList = true,
  loading = false,
  variantText = "text-16-bold"
}: {
  record: any;
  entity: AuditLogEntity;
  refresh?: () => void;
  viewCommentsList?: boolean;
  loading?: boolean;
  variantText?: TextVariants;
}) => {
  const [, { user }] = useMyUser();

  return (
    <div className="flex flex-col gap-4">
      <Text variant={variantText}>Send Comment</Text>
      <CommentaryBox
        name={user?.firstName ?? ""}
        lastName={user?.lastName ?? ""}
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
