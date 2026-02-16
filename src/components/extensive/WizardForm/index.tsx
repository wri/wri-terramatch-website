import { Box } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dictionary } from "lodash";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { forwardRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import Tabs, { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { STEP_QUERY_PARAM, useFormNavigation } from "@/components/extensive/WizardForm/useFormNavigation";
import { useFormStepsWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { useFullProject } from "@/connections/Entity";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import WizardFormProvider, {
  FormFieldsProvider,
  FormModelsDefinition,
  OrgFormDetails,
  ProjectFormDetails
} from "@/context/wizardForm.provider";
import { ErrorWrapper } from "@/generated/apiFetcher";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useOnMount } from "@/hooks/useOnMount";
import { useValueChanged } from "@/hooks/useValueChanged";
import { TagSubmissionState } from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission.type";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import { ChevronRight } from "@/redesignComponents/foundations/Icons/ChevronRight";
import { Project } from "@/redesignComponents/foundations/Icons/Project";
import ToolbarForm from "@/redesignComponents/navigation/Toolbar/ToolbarForm";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import Log from "@/utils/log";

import { ModalId } from "../Modal/ModalConst";
import { WizardFormHeader } from "./FormHeader";
import { FormSummaryOptions } from "./FormSummary";
import SaveAndCloseModal, { SaveAndCloseModalProps } from "./modals/SaveAndCloseModal";
import SummaryItem from "./SummaryItem";
export interface WizardFormProps {
  fieldsProvider: FormFieldsProvider;
  models: FormModelsDefinition;
  orgDetails?: OrgFormDetails;
  projectDetails?: ProjectFormDetails;

  framework: Framework;

  defaultValues?: any;
  onStepChange?: (values: any) => void;
  onChange?: (values: Dictionary<any>, isCloseAndSave?: boolean) => void;
  onSubmit?: (values: any) => void;
  onBackFirstStep: () => void;
  onCloseForm?: () => void;

  formStatus?: "saving" | "saved";
  title?: string;
  subtitle?: string;
  errors?: ErrorWrapper<null>;
  summaryOptions?: FormSummaryOptions & {
    downloadButtonText?: string;
  };

  header?: {
    hide?: boolean;
  };

  // Footer
  nextButtonText?: string;
  submitButtonText?: string;
  submitButtonDisable?: boolean;
  backButtonText?: string;
  hideBackButton?: boolean;
  hideSaveAndCloseButton?: boolean;

  saveAndCloseModal?: SaveAndCloseModalProps;

  disableAutoProgress?: boolean;
  disableInitialAutoProgress?: boolean;

  initialStepIndex?: number;
  roundedCorners?: boolean;
  className?: string;
}

// Wrapper component to handle both relative routes (Next.js Link) and full URLs (window.location)
const AdminLinkWrapper = forwardRef<HTMLAnchorElement, { to?: string; children?: React.ReactNode; className?: string }>(
  ({ to, children, className, ...props }, ref) => {
    const isFullUrl = to?.startsWith("http://") || to?.startsWith("https://");

    if (isFullUrl) {
      return (
        <a
          ref={ref}
          href={to}
          className={className}
          onClick={e => {
            e.preventDefault();
            if (to) window.location.href = to;
          }}
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <Link ref={ref} href={to || "#"} className={className} {...props}>
        {children}
      </Link>
    );
  }
);

AdminLinkWrapper.displayName = "AdminLinkWrapper";

// Helper function to map model type to React Admin route (ResourceName format)
const getModelRoute = (model?: string): string => {
  if (!model) return "project";

  const modelRouteMap: Record<string, string> = {
    projects: "project",
    sites: "site",
    nurseries: "nursery",
    projectReports: "projectReport",
    siteReports: "siteReport",
    nurseryReports: "nurseryReport",
    financialReports: "financialReport",
    disturbanceReports: "disturbanceReport",
    srpReports: "srpReport"
  };

  return modelRouteMap[model] || "project";
};

function WizardForm(props: WizardFormProps) {
  const t = useT();
  const modal = useModalContext();
  const { selectedStepIndex, setSelectedStepIndex } = useFormNavigation(props.fieldsProvider);
  const steps = useFormStepsWithValidation(props.fieldsProvider, props.framework);
  const selectedSection = selectedStepIndex < 0 ? undefined : steps[selectedStepIndex];
  const [loadingProject, { data: project }] = useFullProject({ id: props.projectDetails?.uuid });
  const primaryModel = Array.isArray(props.models) ? props.models[0] : props.models;
  const isAdmin = useIsAdmin();
  const searchParams = useSearchParams();
  const formStepId = searchParams.get(STEP_QUERY_PARAM);
  const modelRoute = getModelRoute(primaryModel?.model);

  const mapUpdateRequestStatusToTagState = (status: string | null | undefined): TagSubmissionState | undefined => {
    switch (status) {
      case "draft":
        return "draft";
      case "awaiting-approval":
        return "pending-approval";
      case "needs-more-information":
        return "information-required";
      case "approved":
        return "approved";
      case "no-update":
        return "nothing-reported";
      default:
        return undefined;
    }
  };

  const lastIndex = props.summaryOptions ? steps.length : steps.length - 1;
  const formHook: UseFormReturn = useForm(
    useMemo(
      () => ({
        defaultValues: props.defaultValues,
        mode: "onTouched",
        resolved: selectedSection?.validation == null ? undefined : yupResolver(selectedSection.validation)
      }),
      [props.defaultValues, selectedSection?.validation]
    )
  );

  useValueChanged(selectedStepIndex, () => {
    // Force validation on all fields when the step changes
    if (selectedStepIndex >= 0) formHook.trigger();
  });

  const formHasError = useRef(false);
  formHasError.current = Object.values(formHook.formState.errors ?? {}).length > 0;

  Log.debug("Form Values", formHook.watch());
  Log.debug("Form Errors", formHook.formState.errors);

  const { onChange } = props;
  const _onChange = useDebounce(
    useCallback(() => !formHasError.current && onChange?.(formHook.getValues()), [formHook, onChange]),
    // Send an update to the server at most once per second
    1000
  );

  const onSubmitStep = useCallback(
    (data: any) => {
      if (selectedStepIndex < lastIndex) {
        // Step changes through 0 - last step
        if (!props.disableAutoProgress) {
          // Disable auto step progress if disableAutoProgress was passed
          setSelectedStepIndex(n => n + 1);
        }
        let values = formHook.getValues();
        values = { ...values };
        props.onChange?.(values, true);
        props.onStepChange?.(data);
        formHook.reset(values);
        formHook.clearErrors();
      } else {
        // Step changes on last step
        if (props.onSubmit == null) return props.onStepChange?.(data);
        props.onSubmit(data);
      }
    },
    [formHook, lastIndex, props, selectedStepIndex, setSelectedStepIndex]
  );

  const onClickSaveAndClose = useCallback(() => {
    let values = formHook.getValues();
    values = { ...values };

    props.onChange?.(values, true);
    formHook.reset(values);
    modal.openModal(
      ModalId.SAVE_AND_CLOSE_MODAL,
      <SaveAndCloseModal
        {...props.saveAndCloseModal}
        onConfirm={props.saveAndCloseModal?.onConfirm || props.onCloseForm || props.onBackFirstStep}
      />
    );
  }, [formHook, modal, props]);

  useEffect(() => {
    if (props.errors != null) {
      formHook.clearErrors();
      props.errors.errors?.forEach(error => {
        formHook.setError(error.source, {
          message: error.detail,
          type: error.code
        });
      });
    }
    formHook.reset(formHook.getValues());
  }, [formHook, props.errors]);

  useOnMount(() => {
    // We linked directly to a step; stay on that step.
    if (selectedStepIndex >= 0) return;

    if (props.disableAutoProgress || props.disableInitialAutoProgress) {
      // We don't auto progress, so either use the initial step or default to 0;
      setSelectedStepIndex(props.initialStepIndex ?? 0);
      return;
    }

    // Find the first invalid step or go straight to the last step.
    const stepIndex = steps.findIndex(({ validation }) => !validation.isValidSync(props.defaultValues));
    setSelectedStepIndex(stepIndex < 0 ? lastIndex : stepIndex);
  });

  useLayoutEffect(() => {
    document.getElementById("step")?.scrollTo({ top: 0 });
  }, [selectedStepIndex]);

  const renderStep = useCallback(
    (stepId: string, title: string | null, index: number) => (
      <div className="overflow-auto sm:h-[calc(100vh-218px)] md:h-[calc(100vh-256px)] lg:h-[calc(100vh-268px)]">
        {index === 0 && title === "Site Overview" && (
          <div className="w-full bg-white px-16 pt-8">
            <div className="rounded-lg bg-tertiary-80 p-6">
              <Text variant="text-16-bold" className="text-white">
                {t(
                  `Note: To edit your site polygons, close this form and edit directly on the new map interface located at the bottom of the site landing page.`
                )}
              </Text>
            </div>
          </div>
        )}
        <FormStep id="step" stepId={stepId} formHook={formHook} onChange={_onChange} className="pb-24" />
        {/* <FormFooter
          variant="sticky"
          backButtonProps={
            !props.hideBackButton
              ? {
                  children: props.backButtonText ?? t("Back"),
                  onClick: () => {
                    if (selectedStepIndex > 0) {
                      setSelectedStepIndex(n => n - 1);
                    } else {
                      props.onBackFirstStep();
                    }
                  }
                }
              : undefined
          }
          submitButtonProps={{
            children:
              selectedStepIndex < lastIndex
                ? props.nextButtonText ?? t("Save and continue")
                : props.submitButtonText ?? t("Submit"),
            onClick: formHook.handleSubmit(onSubmitStep, onSubmitStep),
            className: "py-3",
            disabled: selectedStepIndex === lastIndex && props.submitButtonDisable
          }}
        /> */}
        <Box
          className={classNames(
            "absolute right-0 left-0 z-20 shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.10)]",
            isAdmin ? "bottom-0" : "bottom-[0px]"
          )}
        >
          <ToolbarForm
            ButtonLeft={{
              children: "Cancel",
              onClick: () => {}
            }}
            ButtonPrimary={{
              children: "Next",
              onClick: () => setSelectedStepIndex(selectedStepIndex + 1)
            }}
            ButtonSecondary={{
              children: "Save and Exit",
              onClick: () => (selectedStepIndex !== lastIndex ? setSelectedStepIndex(selectedStepIndex + 1) : undefined)
            }}
            {...(index !== 0 && {
              ButtonTertiary: {
                children: "Previous",
                leftIcon: <ChevronRight className="rotate-180" />,
                onClick: () => setSelectedStepIndex(selectedStepIndex - 1)
              }
            })}
          />
        </Box>
      </div>
    ),
    [t, formHook, _onChange, selectedStepIndex, lastIndex, setSelectedStepIndex, isAdmin]
  );

  const stepsVisited = useRef<number[]>([]);
  const stepTabItems = useMemo(
    (): TabItem[] =>
      steps.map(({ id, title, validation }, index) => {
        const state: TabItem["state"] = validation.isValidSync(formHook.getValues())
          ? stepsVisited.current.includes(index)
            ? "complete"
            : "unstarted"
          : "error";
        return {
          title: t(`{title}`, { title }),
          state,
          renderBody: () => {
            if (!stepsVisited.current.includes(index)) stepsVisited.current.push(index);
            return renderStep(id, title ?? null, index);
          }
        };
      }),
    [formHook, renderStep, steps, t]
  );

  const summaryItem = useMemo(
    (): TabItem => ({
      title: t(`{title}`, { title: props.summaryOptions?.title }),
      renderBody: () => {
        const submitButtonDisable =
          props.submitButtonDisable ||
          steps.find(({ validation }) => !validation.isValidSync(formHook.getValues())) != null;
        return (
          <SummaryItem
            title={props.summaryOptions?.title!}
            subtitle={props.summaryOptions?.subtitle}
            formHook={formHook}
            downloadButtonText={props.summaryOptions?.downloadButtonText}
            setSelectedStepIndex={setSelectedStepIndex}
            onSubmitStep={onSubmitStep}
            submitButtonDisable={submitButtonDisable}
            models={props.models}
          />
        );
      }
    }),
    [
      t,
      props.summaryOptions?.title,
      props.summaryOptions?.subtitle,
      props.summaryOptions?.downloadButtonText,
      props.submitButtonDisable,
      props.models,
      steps,
      formHook,
      setSelectedStepIndex,
      onSubmitStep
    ]
  );

  const tabItems: TabItem[] = props.summaryOptions == null ? stepTabItems : [...stepTabItems, summaryItem];

  const orgDetails = useMemo(
    (): OrgFormDetails => ({ title: props.title, ...props.orgDetails }),
    [props.orgDetails, props.title]
  );

  return selectedStepIndex < 0 ? null : (
    <div className="relative">
      <FrameworkProvider frameworkKey={props.framework}>
        <WizardFormProvider
          models={props.models}
          fieldsProvider={props.fieldsProvider}
          orgDetails={orgDetails}
          projectDetails={props.projectDetails}
        >
          {!props.header?.hide && !loadingProject && (
            <WizardFormHeader
              currentStep={selectedStepIndex + 1}
              numberOfSteps={tabItems.length}
              formStatus={props.formStatus}
              errorMessage={props.errors && t("Something went wrong")}
              onClickSaveAndCloseButton={!props.hideSaveAndCloseButton ? onClickSaveAndClose : undefined}
              title={props.title}
              subtitle={props.subtitle}
            />
          )}
          <div className={twMerge("flex w-full flex-col", props.className)}>
            {loadingProject && (
              <Box className={classNames("sticky z-20 px-1", isAdmin ? "top-0" : "top-[70px]")}>
                <ToolbarObject
                  breadcrumbs={{
                    links: [
                      {
                        label: primaryModel?.model ?? "projects",
                        link: isAdmin
                          ? `http://localhost:3000/admin?formStepId=summary#/${modelRoute}?filter=%7B%7D&order=ASC&page=1&perPage=10&sort=`
                          : "/my-projects",
                        icon: <Project className="!text-theme-primary-900" />
                      },
                      {
                        label: project?.name ?? "",
                        link: isAdmin
                          ? formStepId && props.projectDetails?.uuid
                            ? `http://localhost:3000/admin?formStepId=${formStepId}#/${modelRoute}/${props.projectDetails.uuid}/show`
                            : props.projectDetails?.uuid
                            ? `/${modelRoute}/${props.projectDetails.uuid}`
                            : "#"
                          : props.projectDetails?.uuid
                          ? `/${modelRoute}/${props.projectDetails.uuid}`
                          : "#"
                      },
                      {
                        label: "Edit",
                        link: props.projectDetails?.uuid
                          ? `/entity/${modelRoute}/edit/${props.projectDetails.uuid}`
                          : "#"
                      }
                    ],
                    linkRouter: isAdmin ? AdminLinkWrapper : Link
                  }}
                />
                <PageHeader
                  title={project?.name ?? "Project Name"}
                  label="Set Up Status:"
                  tag={
                    mapUpdateRequestStatusToTagState(project?.updateRequestStatus)
                      ? { state: mapUpdateRequestStatusToTagState(project?.updateRequestStatus)! }
                      : undefined
                  }
                />
              </Box>
            )}
            <Tabs
              onChangeSelected={setSelectedStepIndex}
              selectedIndex={selectedStepIndex}
              tabItems={tabItems}
              rounded={props.roundedCorners}
              itemOption={{}}
              carouselOptions={{
                slidesPerView: 3
              }}
            />
          </div>
        </WizardFormProvider>
      </FrameworkProvider>
    </div>
  );
}

export default WizardForm;
