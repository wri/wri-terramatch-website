import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { Fragment } from "react";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import ProjectCard from "@/components/elements/Cards/ProjectCard/ProjectCard";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import PageBody from "@/components/extensive/PageElements/Body/PageBody";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import PageSection from "@/components/extensive/PageElements/Section/PageSection";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { GetV2MyProjectsResponse, useDeleteV2ProjectsUUID, useGetV2MyProjects } from "@/generated/apiComponents";
import { useMyOrg } from "@/hooks/useMyOrg";

const MyProjectsPage = () => {
  const t = useT();
  const myOrg = useMyOrg();
  const { openToast } = useToastContext();

  const { data: projectsData, isLoading, refetch } = useGetV2MyProjects<{ data: GetV2MyProjectsResponse }>({});
  const projects = projectsData?.data || [];

  const { mutate: deleteProject } = useDeleteV2ProjectsUUID({
    onSuccess() {
      refetch();
      openToast(t("The project has been successfully deleted"));
    },
    onError() {
      openToast(t("Something went wrong!"), ToastType.ERROR);
    }
  });

  return (
    <>
      <Head>
        <title>{t("My Projects")}</title>
      </Head>
      <PageHeader className="h-[203px]" title={t("My Projects")}>
        <When condition={projects.length > 0}>
          <Button as={Link} href="/project/reporting-framework-select">
            {t("Create Project")}
          </Button>
        </When>
      </PageHeader>

      <PageBody>
        <If condition={myOrg?.status === "approved"}>
          <Then>
            <LoadingContainer loading={isLoading}>
              <If condition={projects.length > 0}>
                <Then>
                  <PageSection className="space-y-8">
                    <Text variant="text-bold-headline-1000">
                      {t("Projects I’m monitoring ({count})", { count: projects?.length })}
                    </Text>
                    <List
                      as={Fragment}
                      itemAs={Fragment}
                      items={projects}
                      render={project => (
                        <ProjectCard
                          project={project}
                          onDelete={uuid => {
                            deleteProject({ pathParams: { uuid } });
                          }}
                        />
                      )}
                    />
                  </PageSection>
                </Then>
                <Else>
                  <PageSection>
                    <EmptyState
                      title={t("Start monitoring your project")}
                      subtitle={t(
                        "Your organization currently has no projects. To begin monitoring your restoration activities, you need to create a project in TerraMatch."
                      )}
                      iconProps={{ name: IconNames.TREE_CIRCLE, className: "fill-success" }}
                      ctaProps={{
                        as: Link,
                        href: "/project/reporting-framework-select",
                        children: t("Create Project")
                      }}
                    />
                  </PageSection>
                </Else>
              </If>
            </LoadingContainer>
          </Then>
          <Else>
            <PageSection>
              <EmptyState
                iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
                title={t("Explore Funding Projects")}
                subtitle={t(
                  "Your organization's approval is currently pending, which is why you can't view any listed projects here. Once your organization receives approval, this page will showcase all available projects, enabling you to apply for them. In the meantime, if you have questions or require assistance, please don't hesitate to contact our support team through the help center."
                )}
              />
            </PageSection>
          </Else>
        </If>
        <br />
        <br />
      </PageBody>
      <PageFooter />
    </>
  );
};

export default MyProjectsPage;
