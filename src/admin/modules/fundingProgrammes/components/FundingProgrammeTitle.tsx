import { useRecordContext } from "react-admin";

const FundingProgrammeTitle = () => {
  const record = useRecordContext();
  return <>Funding Programme &quot;{record?.name}&quot;</>;
};

export default FundingProgrammeTitle;
