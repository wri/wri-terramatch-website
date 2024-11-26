import * as reactQuery from "@tanstack/react-query";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import PageSection from "@/components/extensive/PageElements/Section/PageSection";
import { apiBaseUrl } from "@/constants/environment";
import Log from "@/utils/log";

const baseUrl = `${apiBaseUrl}/api`;

const DebugPage = () => {
  const { mutate: fetchAPI500 } = reactQuery.useMutation({
    mutationFn: async () => {
      let response: any;
      let error: any;
      // Similar response to how openapi codegen does it.
      try {
        response = await fetch(`${baseUrl}/v2/debug/error`);
        if (!response.ok) {
          try {
            error = {
              statusCode: response.status,
              ...(await response.json())
            };
          } catch (e) {
            if (process.env.NODE_ENV === "development") {
              Log.error("apiFetch", e);
            }
            error = {
              statusCode: -1
            };
          }

          throw error;
        }
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          Log.error("apiFetch", e);
        }
        error = {
          statusCode: response?.status || -1,
          //@ts-ignore
          ...(e || {})
        };
        throw error;
      }
    }
  });

  const handleErrorClick = () => {
    fetchAPI500();
  };

  const handleCrashPage = () => {
    throw new Error("Client side error");
  };

  return (
    <>
      <Head>
        <title>Debug</title>
      </Head>
      <PageHeader className="h-[203px]" title="Debug Page" />
      <PageBody>
        <PageSection>
          <PageCard title="Errors">
            <div className="space-y-8">
              <Button onClick={handleErrorClick}>Trigger Network Error</Button>
              <Button onClick={handleCrashPage}>Crash Client side</Button>
              <Button as={Link} href="?broken=true">
                Crash ServerSideProps
              </Button>
            </div>
          </PageCard>
        </PageSection>
      </PageBody>
    </>
  );
};

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  if (ctx.query.broken === "true") {
    throw new Error("getServerSideProps error");
  } else return { props: {} };
};

export default DebugPage;
