import { FC } from "react";
import { SaveButton, Toolbar, ToolbarClasses, useRecordContext } from "react-admin";

import { PushTranslationsButton } from "@/admin/components/PushTranslationsButton";
import { pushFundingProgrammeTranslation } from "@/connections/FundingProgramme";
import { FundingProgrammeDto } from "@/generated/v3/entityService/entityServiceSchemas";

const FundingProgrammeTranslateButton: FC = () => {
  const record = useRecordContext<FundingProgrammeDto & { id?: string }>();
  const uuid = record?.uuid ?? record?.id;

  return <PushTranslationsButton uuid={uuid} push={pushFundingProgrammeTranslation} />;
};

const FundingProgrammeToolbar: FC = () => (
  <Toolbar>
    <div className={ToolbarClasses.defaultToolbar}>
      <SaveButton />

      <div>
        <FundingProgrammeTranslateButton />
      </div>
    </div>
  </Toolbar>
);

export default FundingProgrammeToolbar;
