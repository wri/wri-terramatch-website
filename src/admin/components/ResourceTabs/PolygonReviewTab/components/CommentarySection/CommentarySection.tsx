import { useT } from "@transifex/react";
import { FC } from "react";

import CommentaryBox from "@/components/elements/CommentaryBox/CommentaryBox";
import Text from "@/components/elements/Text/Text";
import Loader from "@/components/generic/Loading/Loader";
import { AuditStatusEntityType } from "@/connections/AuditStatus";
import { useMyUser } from "@/connections/User";
import { TextVariants } from "@/types/common";

type CommentarySectionProps = {
  record: any;
  entity: AuditStatusEntityType;
  refresh?: () => void;
  viewCommentsList?: boolean;
  loading?: boolean;
  variantText?: TextVariants;
};

const CommentarySection: FC<CommentarySectionProps> = ({
  record,
  entity,
  refresh,
  viewCommentsList = true,
  loading = false,
  variantText = "text-16-bold"
}) => {
  const [, { user }] = useMyUser();
  const t = useT();

  return (
    <div className="flex flex-col gap-4">
      <Text variant={variantText}>{t("Send Comment")}</Text>
      <CommentaryBox
        name={user?.firstName ?? ""}
        lastName={user?.lastName ?? ""}
        refresh={refresh}
        record={record}
        entity={entity}
      />
      {viewCommentsList && loading && (
        <div className="max-h-[60vh] min-h-[10vh] grid-cols-[14%_20%_18%_15%_33%]">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default CommentarySection;
