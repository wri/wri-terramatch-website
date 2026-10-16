import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { noop } from "lodash";
import { useRouter } from "next/router";
import { FC, useEffect, useMemo } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useMyUser } from "@/connections/User";
import { MapAreaProvider } from "@/context/mapArea.provider";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import Layout from "@/redesignComponents/Layout/Layout";

import { buildPolygonTableColumns } from "../site/[uuid]/components/polygonTableColumns";
import PolygonReviewEmptyState from "./components/PolygonReviewEmptyState";
import PolygonReviewMap from "./components/PolygonReviewMap";
import PolygonReviewToolbar from "./components/PolygonReviewToolbar";

/**
 * Initial (unscoped) state of the Polygon Review index: no polygon data loads until a project is selected.
 * Selecting a project arrives with the Level 1 project picker (TM-3989).
 */
const PolygonReviewIndexPage: FC = () => {
  const t = useT();
  const router = useRouter();
  const [isUserLoaded, { isAdmin }] = useMyUser();

  const columns = useMemo(() => buildPolygonTableColumns(t, { showEntityColumns: true }), [t]);

  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) {
      void router.replace("/");
    }
  }, [isAccessDenied, router]);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <Layout>
      <PageHeader title={t("Polygon Review")} />
      <MapAreaProvider>
        <PageContent className="bg-theme-neutral-100">
          <Flex direction="column" gap={4}>
            <PolygonReviewToolbar />
            <PolygonReviewMap />
            <Flex
              direction="column"
              borderWidth="1px"
              borderColor="neutral.300"
              borderRadius="0.25rem"
              bg="neutral.100"
            >
              <Table data={[]} columns={columns} selectable showPagination={false} />
              {/* TM-3989: open the Level 1 project picker. */}
              <PolygonReviewEmptyState onSelectProject={noop} />
            </Flex>
          </Flex>
        </PageContent>
      </MapAreaProvider>
    </Layout>
  );
};

export default PolygonReviewIndexPage;
