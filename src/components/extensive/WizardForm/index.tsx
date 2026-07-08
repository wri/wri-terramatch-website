import { Box, Flex } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { Dictionary } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FieldErrors, useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import Tabs, { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import SectionFeedbackBanner from "@/components/extensive/WizardForm/SectionFeedbackBanner";
import { useFormNavigation } from "@/components/extensive/WizardForm/useFormNavigation";
import { useFormSectionAnalytics } from "@/components/extensive/WizardForm/useFormSectionAnalytics";
import { useFormStepsWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
import { useReportAnalytics } from "@/components/extensive/WizardForm/useReportAnalytics";
import FrameworkProvider, { ALL_TF, Framework, toFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import WizardFormProvider, {
  FormFieldsProvider,
  FormModelsDefinition,
  OrgFormDetails,
  ProjectFormDetails,
  useFieldsProvider
} from "@/context/wizardForm.provider";
import { entityLinkHeaderMap, mapEntityTitle, mapStatusToTagState } from "@/helpers/entityFormLinkHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { useDownloadFormAnswers } from "@/hooks/useDownloadFormAnswers";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useOnMount } from "@/hooks/useOnMount";
import { useReportingWindow } from "@/hooks/useReportingWindow";
import { SuffixButtonConfig } from "@/pages/project/[uuid]/index.page";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import { ReportsIcon } from "@/redesignComponents/foundations/Icons";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons/NavigationSections/ProjectIcon";
import ResponsiveBreadcrumbToolbar from "@/redesignComponents/navigation/Toolbar/ResponsiveBreadcrumbToolbar";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import { toArray } from "@/utils/array";
import Log from "@/utils/log";

import { ModalId } from "../Modal/ModalConst";
import { hasUnresolvedFeedbackInStep } from "./feedbackUtils";
import { FormFooter } from "./FormFooter";
import { FormSummaryOptions } from "./FormSummary";
import SaveAndCloseModal, { SaveAndCloseModalProps } from "./modals/SaveAndCloseModal";
import SummaryItem from "./SummaryItem";
import { useHotjarAboveStickyFooter } from "./useHotjarAboveStickyFooter";
import { getFormHeaderLabel } from "./utils";

/** Marks the page while a wizard sticky footer is present (for third-party widget CSS). */
export const WIZARD_STICKY_FOOTER_BODY_ATTR = "data-wizard-sticky-footer";

export type WizardFormEntity = {
  siteUuid?: string | null;
  uuid?: string | null;
  frameworkKey?: string | null;
  dueAt?: string | null;
  status?: string | null;
  title?: string | null;
  name?: string | null;
  organisationName?: string | null;
  organisationUuid?: string | null;
  fundingProgrammeName?: string | null;
  projectName?: string | null;
  projectUuid?: string | null;
  projectReportUuid?: string | null;
  taskUuid?: string | null;
  siteName?: string | null;
  nurseryName?: string | null;
  nurseryUuid?: string | null;
  feedback?: string | null;
  feedbackFields?: string[] | null;
};

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
  cancelEditForm?: () => void;
  redirectEntityPage?: string;

  adminListPath?: string;
  entity?: WizardFormEntity;

  /** When true, step errors and field validation messages are hidden until the user submits a step or reopens the form. */
  deferValidation?: boolean;
}

function WizardForm(props: WizardFormProps) {
  const { entity } = props;
  const t = useT();
  const modal = useModalContext();
  const { selectedStepIndex, setSelectedStepIndex } = useFormNavigation(props.fieldsProvider);
  const steps = useFormStepsWithValidation(props.fieldsProvider, props.framework);
  const selectedSection = selectedStepIndex < 0 ? undefined : steps[selectedStepIndex];
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const reportingWindow = useReportingWindow(toFramework(entity?.frameworkKey), entity?.dueAt!);
  const taskTitle = t("Reporting Task {window}", { window: reportingWindow });
  const fieldsProvider = useFieldsProvider();

  const [showValidationErrors, setShowValidationErrors] = useState(!(props.deferValidation ?? false));

  useHotjarAboveStickyFooter();

  const models = useMemo(() => toArray(props.models), [props.models]);
  const isSubmissionModel = models.length > 1;

  const formHook: UseFormReturn = useForm(
    useMemo(
      (): UseFormProps => ({
        defaultValues: props.defaultValues,
        mode: props.deferValidation ? "onSubmit" : "onTouched",
        resolver: selectedSection?.validation == null ? undefined : yupResolver(selectedSection.validation)
      }),
      [props.defaultValues, props.deferValidation, selectedSection?.validation]
    )
  );
  const { trackSectionCompleted, trackSectionError } = useFormSectionAnalytics({
    models,
    steps,
    selectedStepIndex,
    formHook
  });

  const lastIndex = props.summaryOptions ? steps.length : steps.length - 1;

  const initialFormValues = useRef(props.defaultValues);
  if (initialFormValues.current == null && props.defaultValues != null) {
    initialFormValues.current = props.defaultValues;
  }

  const formValues = formHook.watch();

  const formHasError = useRef(false);
  formHasError.current = showValidationErrors && Object.values(formHook.formState.errors ?? {}).length > 0;

  const stepHasIssues = useCallback(
    (stepId: string, validation: (typeof steps)[number]["validation"]) =>
      (showValidationErrors && !validation.isValidSync(formValues)) ||
      hasUnresolvedFeedbackInStep(
        props.fieldsProvider,
        stepId,
        entity?.feedbackFields,
        formValues,
        initialFormValues.current
      ),
    [entity?.feedbackFields, formValues, props.fieldsProvider, showValidationErrors]
  );

  const reportAnalytics = useReportAnalytics({
    models: models,
    steps,
    selectedStepIndex,
    fieldsProvider: props.fieldsProvider,
    entityId: models[0]?.uuid ?? entity?.uuid,
    feedbackFields: entity?.feedbackFields,
    initialValues: initialFormValues.current,
    summaryTitle: props.summaryOptions?.title,
    stepHasIssues
  });

  const hasErrorInAnyStep = steps.some(({ id, validation }) => stepHasIssues(id, validation));

  Log.debug("Form Values", formValues);
  Log.debug("Form Errors", formHook.formState.errors);

  const { onChange } = props;
  const _onChange = useDebounce(
    useCallback(() => {
      if (!formHasError.current) onChange?.(formHook.getValues());
    }, [formHook, onChange]),
    // Send an update to the server at most once per second
    1000
  );

  const onSubmitStep = useCallback(
    (data: any) => {
      trackSectionCompleted(selectedStepIndex);

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
        reportAnalytics.trackReportSubmitted();
        props.onSubmit(data);
      }
    },
    [formHook, lastIndex, props, reportAnalytics, selectedStepIndex, setSelectedStepIndex, trackSectionCompleted]
  );

  const onSubmitStepError = useCallback(
    (errors: FieldErrors) => {
      setShowValidationErrors(true);
      trackSectionError(selectedStepIndex, errors);
    },
    [selectedStepIndex, trackSectionError]
  );

  const onClickSaveAndClose = useCallback(() => {
    reportAnalytics.trackReportSaveExited();

    let values = formHook.getValues();
    values = { ...values };

    props.onChange?.(values, true);
    formHook.reset(values);
    modal.openModal(
      ModalId.SAVE_AND_CLOSE_MODAL,
      <SaveAndCloseModal
        {...props.saveAndCloseModal}
        onConfirm={props.saveAndCloseModal?.onConfirm || props.onCloseForm || props.onBackFirstStep}
        models={models}
      />
    );
  }, [formHook, modal, props, reportAnalytics, models]);

  const onClickSaveAndExit = useCallback(() => {
    if (isAdmin) {
      reportAnalytics.trackReportSaveExited();

      let values = formHook.getValues();
      values = { ...values };

      props.onChange?.(values, true);
      formHook.reset(values);
      props.onSubmit?.(values);
      return;
    }

    onClickSaveAndClose();
  }, [formHook, isAdmin, onClickSaveAndClose, props, reportAnalytics]);

  const onClickSaveChanges = useCallback(() => {
    if (isAdmin) {
      reportAnalytics.trackReportSaveExited();
      formHook.handleSubmit(onSubmitStep)();
      return;
    }
    onClickSaveAndClose();
  }, [onClickSaveAndClose, isAdmin, formHook, onSubmitStep, reportAnalytics]);

  const handleDownloadAnswers = useDownloadFormAnswers({
    fieldsProvider,
    formHook
  });

  useOnMount(() => {
    // We linked directly to a step; stay on that step.
    if (selectedStepIndex >= 0) return;

    if (!showValidationErrors || props.disableAutoProgress || props.disableInitialAutoProgress) {
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

  const isEntityApproved = entity?.status == "approved";
  const renderStep = useCallback(
    (stepId: string, title: string | null, index: number) => (
      <div
        className={classNames("h-full overflow-auto pr-[12px]", {
          "h-[calc(100vh-354px)] md:h-[calc(100vh-355px)] lg:h-[calc(100vh-355px)]": isAdmin
        })}
      >
        {index === 0 && title === "Site Overview" && (
          <div className="w-full bg-white pt-8 pl-20">
            <InlineMessage
              size="full-width"
              label={t("Note")}
              caption={t(
                "To edit your site polygons, close this form and edit directly on the new map interface located at the bottom of the site landing page."
              )}
              variant="info-grey"
            />
          </div>
        )}
        {reportAnalytics.isTrackingEnabled && (
          <SectionFeedbackBanner
            sectionName={reportAnalytics.getSectionNameForIndex(index)}
            feedback={entity?.feedback}
            isVisible={reportAnalytics.hasFeedbackBannerInCurrentStep(stepId)}
            onDisplayed={reportAnalytics.trackFeedbackBannerDisplayed}
          />
        )}
        <FormStep id="step" stepId={stepId} formHook={formHook} onChange={_onChange} />
        <FormFooter
          className={classNames(
            "absolute right-0 left-0 z-20 shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.10)]",
            isAdmin ? "bottom-0" : "bottom-[0px]"
          )}
          primaryButtonProps={{
            children: t(`${selectedStepIndex === lastIndex ? "Submit" : "Next"}`),
            disabled: hasErrorInAnyStep && selectedStepIndex === lastIndex,
            onClick: formHook.handleSubmit(onSubmitStep, onSubmitStepError)
          }}
          secondaryButtonProps={
            !isSubmissionModel
              ? {
                  children: t("Save and Exit"),
                  onClick: () => {
                    if (isAdmin) {
                      reportAnalytics.trackReportSaveExited();
                      formHook.handleSubmit(onSubmitStep, onSubmitStepError);
                      props.onSubmit?.(formHook.getValues());
                    } else {
                      onClickSaveAndClose();
                    }
                  }
                }
              : {
                  children: t("Save and Exit"),
                  onClick: onClickSaveAndClose
                }
          }
          tertiaryButtonProps={{
            children: t("Download"),
            onClick: handleDownloadAnswers
          }}
        />
      </div>
    ),
    [
      isAdmin,
      t,
      reportAnalytics,
      entity?.feedback,
      formHook,
      _onChange,
      selectedStepIndex,
      lastIndex,
      hasErrorInAnyStep,
      onSubmitStep,
      onSubmitStepError,
      isSubmissionModel,
      handleDownloadAnswers,
      props,
      onClickSaveAndClose
    ]
  );

  const getStepTabState = useCallback(
    (stepId: string, validation: (typeof steps)[number]["validation"]): TabItem["state"] => {
      if (stepHasIssues(stepId, validation)) return "error";
      if (validation.isValidSync(formValues)) return "complete";
      return "unstarted";
    },
    [formValues, stepHasIssues]
  );

  const stepTabItems = useMemo(
    (): TabItem[] =>
      steps.map(({ id, title, validation }, index) => ({
        title: t(`{title}`, { title }),
        state: getStepTabState(id, validation),
        renderBody: () => renderStep(id, title ?? null, index)
      })),
    [getStepTabState, renderStep, steps, t]
  );

  const summaryItem = useMemo(
    (): TabItem => ({
      title: t(`{title}`, { title: props.summaryOptions?.title }),
      renderBody: () => {
        const submitButtonDisable =
          props.submitButtonDisable || steps.some(({ id, validation }) => stepHasIssues(id, validation));
        return (
          <SummaryItem
            title={props.summaryOptions?.title!}
            subtitle={props.summaryOptions?.subtitle}
            formHook={formHook}
            downloadButtonText={props.summaryOptions?.downloadButtonText}
            setSelectedStepIndex={setSelectedStepIndex}
            onSubmitStep={onSubmitStep}
            submitButtonDisable={submitButtonDisable}
            models={models}
            enableSaveChangesButton={isEntityApproved}
            saveChanges={() => onClickSaveChanges()}
            onSaveAndExit={onClickSaveAndExit}
            feedback={entity?.feedback}
            feedbackFields={entity?.feedbackFields}
            initialValues={initialFormValues.current}
            reportSummaryAnalytics={
              reportAnalytics.isTrackingEnabled
                ? {
                    reviewSectionName: props.summaryOptions?.title?.trim() ?? t("Review Details"),
                    onFeedbackBannerDisplayed: reportAnalytics.trackFeedbackBannerDisplayed,
                    onAccordionExpanded: reportAnalytics.trackAccordionExpanded
                  }
                : undefined
            }
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
      models,
      steps,
      formHook,
      setSelectedStepIndex,
      onSubmitStep,
      isEntityApproved,
      onClickSaveChanges,
      onClickSaveAndExit,
      entity?.feedback,
      entity?.feedbackFields,
      stepHasIssues,
      reportAnalytics
    ]
  );

  const tabItems: TabItem[] = props.summaryOptions == null ? stepTabItems : [...stepTabItems, summaryItem];

  const orgDetails = useMemo(
    (): OrgFormDetails => ({ title: props.title, ...props.orgDetails }),
    [props.orgDetails, props.title]
  );

  const linkHeaderMap = useMemo(() => {
    if (isSubmissionModel) {
      return [
        ...(entity
          ? [
              {
                label: `${entity?.organisationName} - ${entity?.fundingProgrammeName}`,
                link: props.redirectEntityPage ?? "/my-projects"
              }
            ]
          : []),
        { label: t("Edit"), link: `/form/submission/${entity?.uuid ?? ""}` }
      ];
    } else if (models[0]?.model === "organisations") {
      return [{ label: t("Edit"), link: `/organization/create?uuid=${entity?.uuid ?? ""}` }];
    } else if (models.length > 0) {
      return entityLinkHeaderMap({
        isAdmin,
        model: models[0].model,
        uuid: models[0].uuid ?? props?.entity?.uuid,
        redirectEntityPage: props.redirectEntityPage,
        adminListPath: props.adminListPath,
        entity: entity,
        firstLinkIcon: models[0].model.includes("Reports") ? (
          <ReportsIcon className="!text-theme-primary-900" />
        ) : (
          <ProjectIcon className="!text-theme-primary-900" />
        ),
        t,
        taskTitle
      })[models[0].model];
    }
    return [];
  }, [
    isSubmissionModel,
    models,
    entity,
    props.redirectEntityPage,
    props?.entity?.uuid,
    props.adminListPath,
    t,
    isAdmin,
    taskTitle
  ]);

  const pageHeaderTitle = useMemo(() => {
    if (isSubmissionModel) {
      return entity?.organisationName != null || entity?.fundingProgrammeName != null
        ? `${entity?.organisationName ?? ""} - ${entity?.fundingProgrammeName ?? ""}`
        : t("Unnamed Application");
    } else if (models[0]?.model === "projectReports" || models[0]?.model === "srpReports") {
      return getFormHeaderLabel(entity?.projectName ?? "", taskTitle);
    } else if (models[0]?.model === "siteReports") {
      return getFormHeaderLabel(entity?.siteName ?? "", taskTitle);
    } else if (models[0]?.model === "nurseryReports") {
      return getFormHeaderLabel(entity?.nurseryName ?? "", taskTitle);
    } else if (models[0]?.model === "disturbanceReports") {
      return entity?.projectName + " - " + entity?.title;
    } else if (models[0]?.model === "financialReports") {
      return getFormHeaderLabel(entity?.organisationName ?? "", taskTitle);
    } else {
      return mapEntityTitle(entity?.title ?? entity?.name ?? null, models[0]?.model ?? "", t);
    }
  }, [
    isSubmissionModel,
    models,
    entity?.organisationName,
    entity?.fundingProgrammeName,
    entity?.projectName,
    entity?.siteName,
    entity?.nurseryName,
    entity?.title,
    entity?.name,
    t,
    taskTitle
  ]);

  const suffixButtons: SuffixButtonConfig[] = useMemo(() => {
    if (models[0]?.model === "siteReports") {
      return [
        { key: "site-profile", labelKey: "Site Profile" },
        { key: "project-report", labelKey: "Project Report" }
      ];
    }
    if (models[0]?.model === "nurseryReports") {
      return [
        { key: "nursery-profile", labelKey: "Nursery Profile" },
        { key: "project-report", labelKey: "Project Report" }
      ];
    } else if (models[0]?.model === "projectReports") {
      return [
        { key: "project-profile", labelKey: "Project Profile" },
        { key: "site-reports", labelKey: "Site Reports" },
        ...(ALL_TF.includes(props.framework) ? [{ key: "nursery-reports", labelKey: "Nursery Reports" }] : [])
      ];
    } else if (models[0]?.model === "srpReports") {
      return [
        { key: "project-profile", labelKey: "Project Profile" },
        { key: "project-report", labelKey: "Project Report" }
      ];
    } else if (models[0]?.model === "financialReports") {
      return [
        { key: "organisation-profile", labelKey: "Organisation Profile" },
        { key: "my-projects", labelKey: "Projects" }
      ];
    }
    return [
      { key: "project-profile", labelKey: "Project Profile" },
      { key: "site-reports", labelKey: "Site Reports" },
      ...(props.framework === Framework.TF ? [{ key: "nurseries-reports", labelKey: "Nursery Reports" }] : [])
    ];
  }, [models, props.framework]);

  const navigateToTab = useCallback(
    (tab: string) => {
      if (tab === "project-profile") {
        router.push(`/project/${entity?.projectUuid}`, undefined, { shallow: true });
      } else if (tab == "site-profile") {
        router.push(`/site/${entity?.siteUuid}`, undefined, { shallow: true });
      } else if (tab == "nursery-profile") {
        router.push(`/nursery/${entity?.nurseryUuid}`, undefined, { shallow: true });
      } else if (tab == "project-report") {
        router.push(`/reports/project-report/${entity?.projectReportUuid}`, undefined, { shallow: true });
      } else {
        router.push(`/project/${entity?.projectUuid}/reporting-task/${entity?.taskUuid}`, undefined, { shallow: true });
      }
    },
    [router, entity]
  );

  const handleStepSelected = useCallback(
    (targetIndex: number) => {
      if (targetIndex !== selectedStepIndex) {
        reportAnalytics.trackFormNavClicked(targetIndex, selectedStepIndex);
      }
      setSelectedStepIndex(targetIndex);
    },
    [reportAnalytics, selectedStepIndex, setSelectedStepIndex]
  );

  return selectedStepIndex < 0 ? null : (
    <div className={classNames("relative", { "h-full": !isAdmin })}>
      <FrameworkProvider frameworkKey={props.framework}>
        <WizardFormProvider
          models={models}
          fieldsProvider={props.fieldsProvider}
          orgDetails={orgDetails}
          projectDetails={props.projectDetails}
          showValidationErrors={showValidationErrors}
        >
          <div className={twMerge("flex h-full w-full flex-col", props.className)}>
            {entity != null && (
              <Box background={"neutral.200"} className={classNames("sticky top-0 z-20 pb-1")}>
                {!isAdmin && (
                  <ResponsiveBreadcrumbToolbar
                    breadcrumbs={linkHeaderMap}
                    suffix={
                      models[0]?.model.includes("Reports") && (
                        <Flex gap={1.5} alignItems="center">
                          {suffixButtons.map((button, index) => (
                            <Flex key={button.key} alignItems="center" gap={1.5}>
                              {index > 0 && <span className="text-sm text-theme-neutral-300">|</span>}
                              <Button
                                variant="borderless"
                                size="small"
                                className="underline underline-offset-2"
                                onClick={() => {
                                  navigateToTab(button.key);
                                }}
                              >
                                {t(button.labelKey)}
                              </Button>
                            </Flex>
                          ))}
                        </Flex>
                      )
                    }
                  />
                )}
                <div className="bg-theme-neutral-300 pt-[1px]">
                  <PageHeader
                    title={pageHeaderTitle}
                    label={models[0]?.model.includes("Reports") ? t("Report Status:") : t("Set Up Status:")}
                    tag={
                      mapStatusToTagState(entity?.status) ? { state: mapStatusToTagState(entity?.status)! } : undefined
                    }
                  />
                </div>
              </Box>
            )}
            <Tabs
              onChangeSelected={handleStepSelected}
              selectedIndex={selectedStepIndex}
              tabItems={tabItems}
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
