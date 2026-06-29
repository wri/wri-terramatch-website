import { FC, ReactNode } from "react";

import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import FrameworkProvider from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import ProjectResponsiveTypography from "@/styles/ResponsiveTypography";

interface SitePageProvidersProps {
  frameworkKey?: string;
  isLoaded: boolean;
  children: ReactNode;
}

const SitePageProviders: FC<SitePageProvidersProps> = ({ frameworkKey, isLoaded, children }) => {
  const { loading } = useLoading();

  return (
    <MapAreaProvider>
      <ProjectResponsiveTypography />
      <FrameworkProvider frameworkKey={frameworkKey}>
        {loading && (
          <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
            <Loader />
          </div>
        )}
        <LoadingContainer loading={!isLoaded}>{children}</LoadingContainer>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default SitePageProviders;
