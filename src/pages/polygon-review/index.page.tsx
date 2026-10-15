import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import { useMyUser } from "@/connections/User";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import Layout from "@/redesignComponents/Layout/Layout";

const PolygonReviewIndexPage: FC = () => {
  const t = useT();
  const router = useRouter();
  const [isUserLoaded, { isAdmin }] = useMyUser();

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
    </Layout>
  );
};

export default PolygonReviewIndexPage;
