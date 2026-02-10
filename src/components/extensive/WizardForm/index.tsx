import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import Tabs, { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { useFormNavigation } from "@/components/extensive/WizardForm/useFormNavigation";
import { useFormStepsWithValidation } from "@/components/extensive/WizardForm/useFormStepsWithValidation";
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
import { useOnMount } from "@/hooks/useOnMount";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

import { ModalId } from "../Modal/ModalConst";
import { FormFooter } from "./FormFooter";
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

function WizardForm(props: WizardFormProps) {
  const t = useT();
  const modal = useModalContext();
  const { selectedStepIndex, setSelectedStepIndex } = useFormNavigation(props.fieldsProvider);
  const steps = useFormStepsWithValidation(props.fieldsProvider, props.framework);
  const selectedSection = selectedStepIndex < 0 ? undefined : steps[selectedStepIndex];

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
        <FormStep id="step" stepId={stepId} formHook={formHook} onChange={_onChange} />
        <FormFooter
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
        />
      </div>
    ),
    [t, formHook, _onChange, props, selectedStepIndex, lastIndex, onSubmitStep, setSelectedStepIndex]
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
          title: t(`Step {number}<br/> <p class="text-14-light">{title} </p>`, { number: index + 1, title }),
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
      title: t(`Step {number}<br/> {title}`, { number: lastIndex + 1, title: props.summaryOptions?.title }),
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
      lastIndex,
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
    <div>
      <FrameworkProvider frameworkKey={props.framework}>
        <WizardFormProvider
          models={props.models}
          fieldsProvider={props.fieldsProvider}
          orgDetails={orgDetails}
          projectDetails={props.projectDetails}
        >
          {!props.header?.hide && (
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
          <div className={twMerge("mx-auto mt-0 max-w-[82vw] px-6 py-6 xl:px-0", props.className)}>
            <Tabs
              onChangeSelected={setSelectedStepIndex}
              selectedIndex={selectedStepIndex}
              tabItems={tabItems}
              rounded={props.roundedCorners}
              tabListClassName="overflow-auto sm:h-[calc(100vh-218px)] md:h-[calc(100vh-256px)] lg:h-[calc(100vh-268px)]"
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
