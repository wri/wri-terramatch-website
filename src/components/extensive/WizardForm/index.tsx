import { yupResolver } from "@hookform/resolvers/yup";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import Tabs, { TabItem } from "@/components/elements/Tabs/Default/Tabs";
import Text from "@/components/elements/Text/Text";
import { FormQuestionsProvider } from "@/components/extensive/WizardForm/formQuestions.provider";
import { FormStep } from "@/components/extensive/WizardForm/FormStep";
import { selectQuestions, selectSection, selectSections, useForm as useApiForm } from "@/connections/util/Form";
import { useFramework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
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
import { getSchema, questionDtoToDefinition } from "./utils";

export interface WizardFormProps {
  formUuid: string;
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

  tabOptions?: {
    disableFutureTabs?: boolean;
    markDone?: boolean;
  };

  saveAndCloseModal?: SaveAndCloseModalProps;

  disableAutoProgress?: boolean;
  disableInitialAutoProgress?: boolean;

  initialStepIndex?: number;
  roundedCorners?: boolean;
  className?: string;
  formSubmissionOrg?: any;
}

function WizardForm(props: WizardFormProps) {
  const t = useT();
  const modal = useModalContext();
  const framework = useFramework();
  // In most cases, we should expect the form already to be loaded by our parent, but this simply ensures
  // that it's cached correctly. Without the form already loaded in the connection cache, all the section / question
  // selectors in use won't work correctly.
  const [, { data: form }] = useApiForm({ id: props.formUuid, enabled: props.formUuid != null });
  const [selectedStepIndex, setSelectedStepIndex] = useState(props.initialStepIndex ?? 0);
  const { sections, questions } = useMemo(() => {
    const sections =
      form?.uuid == null
        ? []
        : selectSections(form?.uuid).map(({ uuid }) => ({
            sectionId: uuid,
            title: selectSection(uuid)?.title,
            validation: getSchema(selectQuestions(uuid).map(questionDtoToDefinition), t, framework)
          }));
    const questions = sections.flatMap(({ sectionId }) => selectQuestions(sectionId));
    return { sections, questions };
  }, [form?.uuid, framework, t]);
  const selectedSection = sections[selectedStepIndex];

  const lastIndex = props.summaryOptions ? sections.length : sections.length - 1;
  const formHook: UseFormReturn = useForm(
    useMemo(
      () =>
        selectedSection?.validation != null
          ? {
              resolver: yupResolver(selectedSection?.validation),
              defaultValues: props.defaultValues,
              mode: "onTouched"
            }
          : { mode: "onTouched" },
      [props.defaultValues, selectedSection?.validation]
    )
  );

  useValueChanged(selectedStepIndex, () => {
    // Force validation on all fields when the step changes
    formHook.trigger();
  });

  const formHasError = Object.values(formHook.formState.errors ?? {}).length > 0;

  Log.debug("Form Values", formHook.watch());
  Log.debug("Form Errors", formHook.formState.errors);

  const onChange = useDebounce(() => !formHasError && props.onChange?.(formHook.getValues()));

  const onSubmitStep = useCallback(
    (data: any) => {
      if (selectedStepIndex < lastIndex) {
        //Step changes through 0 - last step
        if (!props.disableAutoProgress) {
          //Disable auto step progress if disableAutoProgress was passed
          setSelectedStepIndex(n => n + 1);
        }
        let values = formHook.getValues();
        values = { ...values };
        props.onChange?.(values, true);
        props.onStepChange?.(data);
        formHook.reset(values);
        formHook.clearErrors();
      } else {
        //Step changes on last step
        if (!props.onSubmit) return props.onStepChange?.(data);
        props.onSubmit?.(data);
      }
    },
    [formHook, lastIndex, props, selectedStepIndex]
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
    if (props.disableAutoProgress || props.disableInitialAutoProgress) return;

    // If none of the steps has an invalid field, use the last step
    const stepIndex = sections.findIndex(({ validation }) => !validation.isValidSync(props.defaultValues));
    setSelectedStepIndex(stepIndex < 0 ? lastIndex : stepIndex);
  });

  useValueChanged(props.defaultValues, () => {
    if (props.defaultValues != null) {
      for (const [key, value] of Object.entries(props.defaultValues)) {
        formHook.setValue(key, value);
      }
    }
  });

  useLayoutEffect(() => {
    document.getElementById("step")?.scrollTo({ top: 0 });
  }, [selectedStepIndex]);

  const renderStep = useCallback(
    (sectionId: string, title: string | null, index: number) => (
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
        <FormStep
          id="step"
          sectionId={sectionId}
          formHook={formHook}
          onChange={onChange}
          formSubmissionOrg={{ ...props?.formSubmissionOrg, title: props?.title }}
        />
        <FormFooter
          variant="sticky"
          backButtonProps={
            !props.hideBackButton
              ? {
                  children: props.backButtonText || t("Back"),
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
            onClick: formHook.handleSubmit(onSubmitStep),
            className: "py-3",
            disabled: (selectedStepIndex === lastIndex && props.submitButtonDisable) || formHasError
          }}
        />
      </div>
    ),
    [formHasError, formHook, lastIndex, onChange, onSubmitStep, props, selectedStepIndex, t]
  );

  const stepTabItems = useMemo(
    () =>
      sections.map(({ sectionId, title }, index) => ({
        title: t(`Step {number}<br/> <p className="text-14-light">{title} </p>`, { number: index + 1, title }),
        done: props.tabOptions?.markDone && index < selectedStepIndex,
        disabled: props.tabOptions?.disableFutureTabs && index > selectedStepIndex,
        renderBody: () => renderStep(sectionId, title ?? null, index)
      })),
    [props.tabOptions?.disableFutureTabs, props.tabOptions?.markDone, renderStep, sections, selectedStepIndex, t]
  );

  const summaryItem = useMemo(
    () => ({
      title: t(`Step {number}<br/> {title}`, { number: lastIndex + 1, title: props.summaryOptions?.title }),
      done: props.tabOptions?.markDone && sections.length < selectedStepIndex,
      disabled: props.tabOptions?.disableFutureTabs && sections.length > selectedStepIndex,
      renderBody: () => (
        <SummaryItem
          formUuid={props.formUuid}
          title={props.summaryOptions?.title!}
          subtitle={props.summaryOptions?.subtitle}
          formHook={formHook}
          downloadButtonText={props.summaryOptions?.downloadButtonText}
          setSelectedStepIndex={setSelectedStepIndex}
          onSubmitStep={onSubmitStep}
          submitButtonDisable={props.submitButtonDisable}
        />
      )
    }),
    [
      formHook,
      lastIndex,
      onSubmitStep,
      props.formUuid,
      props.submitButtonDisable,
      props.summaryOptions?.downloadButtonText,
      props.summaryOptions?.subtitle,
      props.summaryOptions?.title,
      props.tabOptions?.disableFutureTabs,
      props.tabOptions?.markDone,
      sections.length,
      selectedStepIndex,
      t
    ]
  );

  const tabItems: TabItem[] = props.summaryOptions == null ? stepTabItems : [...stepTabItems, summaryItem];

  return (
    <div>
      <FormQuestionsProvider questions={questions}>
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
      </FormQuestionsProvider>
    </div>
  );
}

export default WizardForm;
