import { useMediaQuery } from "@mui/material";

import PageRow from "@/components/extensive/PageElements/Row/PageRow";

const ContentDashboardtWrapper = ({
  children,
  isLeftWrapper = false
}: {
  children: React.ReactNode;
  isLeftWrapper?: boolean;
}) => {
  const isMobile = useMediaQuery("(max-width: 1200px)");

  if (isMobile) {
    return <>{children}</>;
  }

  if (isLeftWrapper) {
    return (
      <div className="overflow-hiden mx-auto w-full max-w-[730px]  small:w-1/2 small:max-w-max">
        <PageRow className="gap-4 p-0">{children}</PageRow>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[730px]  small:w-1/2 small:max-w-max">
      <PageRow className="w-full gap-4 p-0">{children}</PageRow>
    </div>
  );
};

export default ContentDashboardtWrapper;
