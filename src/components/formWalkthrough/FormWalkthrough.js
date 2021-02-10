import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Backdrop, Button, Loader } from 'tsc-chameleon-component-library';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FormElements from './FormElements';
import api from 'wrm-api';
import { Redirect } from 'react-router-dom';
import { validateField, gaEvent, debounce } from '../../helpers';
import SavingIndicator from '../savingIndicator/SavingIndicator';

const keyNumberRegex = /^\d+/;

const updateCallback = debounce((options, func) => func(options.currentStep, options.model, options.childModels), 500);

const FormWalkthrough = (props) => {
  const {
    modelName,
    value,
    onSubmit,
    onStepChange,
    onValidate,
    onCancel,
    errors,
    isFetching,
    successOptions,
    isSuccess,
    children,
    icon,
    dispatchMethod,
    childrenBelowForm,
    fullPage,
    showProgress,
    initialStep,
    updateDraftState,
    gaCategory
  } = props;

  const [ currentStep, setCurrentStep ] = useState(initialStep);
  const [ steps, setSteps ] = useState(props.steps);
  const [ step, setStep ] = useState(steps[currentStep]);

  const getChildModels = () => {
    const childModels = {};
    steps.forEach(step => {
      const listCount = step.defaultCount !== null && step.defaultCount !== undefined ? step.defaultCount : 1;
      if (step.model) {
        childModels[step.model] = step.isList ? {listCount} : {};
      }
    });
    return childModels;
  };


  let modelValue = modelName ? new api[modelName]() : {};
  let childModelValue = (value && value.childModels) || getChildModels();

  if (value) {
    modelValue = value.model;
  }

  const [ model, setModel ] = useState(modelValue);
  const [ childModels, setChildModels ] = useState(childModelValue);
  const [ validationErrors, setValidationErrors ] = useState([]);
  const [ scrollToId, setScrollToId ] = useState(null);
  const [ shouldStepChange, setShouldStepChange ] = useState(false);
  const { t } = useTranslation();
  const formRef = useRef(null);

  useEffect(() => {
    if (value && value.model) {
      setModel(value.model);
    }
    if (value && value.childModels) {
      setChildModels(value.childModels);
    }
  }, [value]);

  useEffect(() => {
    for (let i = 0; i < steps.length; i++) {
      const fields = steps[i].fields;
      if (fields) {
        for (let j = 0; j < fields.length; j++) {
          const field = fields[j];
          if (!(field.modelKey in model) && field.initialValue) {
            model[field.modelKey] = field.initialValue;
          }
        }
      }
    }
  }, [steps, model]);

  const getStep = (childModels) => {
    let newStep = steps[currentStep];

    if (newStep.overrideMethod) {
      const overrideMethod = newStep.overrideMethod;
      const isList = newStep.isList;
      newStep = newStep.overrideMethod(t, model, childModels);
      newStep.overrideMethod = overrideMethod;
      newStep.isList = isList;
      steps[currentStep] = newStep;
      setSteps([...steps]);
    }
    return newStep;
  };

  // On step change call the onStepChange prop.
  useEffect(() => {
    setStep(getStep(childModels));
    updateCallback({currentStep, model: model, childModels}, onStepChange);
  }, [currentStep]); // eslint-disable-line react-hooks/exhaustive-deps
  // Only change on currentStep, no need for other deps here.

  useEffect(()=> {
    if (formRef && formRef.current) {
      // Reset the form to clear any validation states.
      formRef.current.reset();
    }
  }, [step]);

  // When we have errors, find the right error so we can change step and scroll to it.
  useEffect(() => {
    if (shouldStepChange && !isFetching) {
      const modelKeys = errors.map(error => error.source);
      // Only on error change, force back to the right step.
      if (modelKeys.length > 0) {
        // Find the lowest step.
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          let foundField = null;
          if (step.fields) {
            const index = step.fields.findIndex(field => {
              const modelIndex = modelKeys.findIndex(key => key === field.modelKey);
              if (modelIndex > -1) {
                foundField = field;
              }
              return modelIndex > -1
            })
            if (index > -1) {
              setScrollToId(`${foundField.modelKey}-${foundField.type}-input-error`);
              setCurrentStep(i);
              setShouldStepChange(false)
              break;
            }
          }
        }
      }
    }
  }, [errors, steps, setCurrentStep, shouldStepChange, isFetching]);

  // When we set the scroll to ID, scroll to the correct place (if it exists).
  useEffect(() => {
    if (scrollToId) {
      const elementToScroll = document.getElementById(scrollToId);
      if (elementToScroll) {
        elementToScroll.scrollIntoView();
        setScrollToId(null);
      }
    }
  }, [scrollToId]);

  const updateField = (update, field) => {
    const modelKey = field.modelKey;
    let updatedModel = {...model};

    if (step.model) {
      childModels[step.model][modelKey] = update;
      setChildModels(childModels);
    } else {
      updatedModel[modelKey] = update;
      setModel(updatedModel);
    }

    updateCallback({currentStep, model: updatedModel, childModels}, onStepChange);
  };

  const validateErrors = () => {
    onValidate();

    const stepErrors = []
    steps[currentStep].fields.forEach((field) => {
      const childModel = steps[currentStep].model;
      const value = childModel ? childModels[childModel][field.modelKey] : model[field.modelKey];
      const result = validateField(field, value, model, childModels);
      if (result.error) {
        stepErrors.push({
          source: field.modelKey,
          code: result.code,
          variables: result.variables
        });
      }
    });

    // Add non backend validation for repeated password
    const repeatPasswordError = {
      source: "repeat_password",
      code: 'REPEAT'
    }

    if (model.password !== model.repeatPassword) {
      stepErrors.push(repeatPasswordError)
    }

    const errorArrUnique = [];

    stepErrors.forEach((err) => {
      const index = errorArrUnique.findIndex(error => err.source === error.source && err.code === error.code);
      if (index === -1) {
        errorArrUnique.push(err);
      }
    });

    setValidationErrors(errorArrUnique);
    return errorArrUnique.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateErrors()) {
      // Next step or submit?
      if (currentStep === steps.length - 1) {
        if (model.repeatPassword) {
          delete model.repeatPassword;
        }
        setShouldStepChange(true);
        onSubmit(model, childModels);
      } else {
        // Go to next step
        setCurrentStep(currentStep + 1);

        if (gaCategory) {
          // may need to enforce en_us text
          const stepName = t(steps[currentStep + 1].title);
          gaEvent({
            category: gaCategory,
            action: 'User stepped through form',
            label: stepName
          })
        }
      }
    }
  };

  const addToList = () => {
    childModels[step.model].listCount += 1;
    setChildModels(childModels);
    setStep(getStep(childModels));
  };

  const removeFromList = (index) => {
    childModels[step.model].listCount -= 1;
    Object.keys(childModels[step.model]).forEach((key) => {
      const keyIndex = getKeyNumber(key);

      if (keyIndex === index) {
        delete childModels[step.model][key];
      } else if (keyIndex > index) {
        // We have to -1 each key above the index to delete
        const newKey = dropKeyIndex(key);
        childModels[step.model][newKey] = JSON.parse(JSON.stringify(childModels[step.model][key]));
        delete childModels[step.model][key];

        const childModel = childModels[step.model][newKey];
        if (Array.isArray(childModel) &&
            typeof childModel[0] === "string") {
              // Drop the index of string arrays e.g. 2-produces_food
              childModel.forEach((item, index) => {
                childModel[index] = dropKeyIndex(childModel[index]);
              });
        }
      }
    });

    setChildModels(childModels);
    setStep(getStep(childModels));
  };

  const getKeyNumber = (key) => {
    const keyMatch = keyNumberRegex.exec(key);
    if (keyMatch) {
      return parseInt(keyMatch[0], 10);
    }
    return false;
  }

  const dropKeyIndex = (key) => {
    const index = getKeyNumber(key);
    if (!isNaN(index)) {
      return key.replace(/^\d+/, index - 1);
    }

    return key;
  };

  const hasMoreSteps = currentStep > 0 && currentStep < steps.length;
  const isFullWidth = steps[currentStep].fullWidth;
  const percentComplete = `${((currentStep + 1) / steps.length) * 100}%`;
  const SuccessChild = successOptions.children;

  return (
    <>
      <div className="c-form-walkthrough">
        {showProgress &&
          <>
            <span className="c-form-walkthrough__progress-text u-text-bold">
              {currentStep + 1} / {steps.length}
            </span>
            {updateDraftState &&
              <SavingIndicator className="c-form-walkthrough__saving-indicator"
                isSaving={updateDraftState.isFetching}
                isError={updateDraftState.error}
                isSaved={!updateDraftState.isFetching && updateDraftState.lastSuccessTime > 0}/>}
            <div className="c-form-walkthrough__progress-bar-wrapper" role="presentation">
              <div className="c-form-walkthrough__progress-bar" style={{width: percentComplete}}></div>
            </div>
          </>
        }
        <div className={`c-form-walkthrough__content u-text-center u-margin-vertical-small ${isFullWidth ? 'u-padding-horizontal-none c-form-walkthrough--full-width' : ''}`}>
          { !isSuccess && <form onSubmit={handleSubmit} ref={formRef} >
            <h2>{t(step.title)}</h2>

            {icon && <img className="c-form-walkthrough__icon" alt="" src={icon} />}

            <p className="c-form-walkthrough__help">{t(step.subtext, step.subtextVariables)}</p>

            { !childrenBelowForm && children }

            <FormElements
              fields={step.fields || []}
              updateField={updateField}
              model={step.model ? childModels[step.model] : model}
              errors={errors}
              validationErrorsAfterSubmit={validationErrors}
              dispatchMethod={dispatchMethod}
              removeFromList={removeFromList}
              childModels={childModels}
            />

            { step.isList &&
              <Button variant="outline" click={addToList} className="u-margin-top-small">
                {step.addListLabel ? t(step.addListLabel) : t('common.add')}
              </Button>
            }

            { childrenBelowForm && children }

            <div className={hasMoreSteps ? 'c-form-walkthrough__actions u-flex u-flex--space-between' : 'c-form-walkthrough__actions'}>
              {hasMoreSteps &&
                <Button
                  className="c-button--medium u-margin-tiny"
                  variant="grey"
                  click={() => setCurrentStep(currentStep - 1)}>
                  {t('common.back')}
                </Button>
              }
              <div className="u-margin-tiny">
                <input type="submit"
                  data-testid={hasMoreSteps? 'submit-button': 'next-button'}
                  className={hasMoreSteps ? 'c-button c-button--medium' : 'c-button'}
                  value={t(step.nextSubmitButton)}
                />
                <br />
                {/* cancel button should only appear at the start of the form */}
                {(onCancel && currentStep === 0) &&
                  <Button variant="link" className="u-text-bold u-text-black u-font-small" click={onCancel}>
                    {step.cancelButton ? t(step.cancelButton) : t('common.cancel')}
                  </Button>
                }
              </div>
            </div>
          </form> }
          { isSuccess && !successOptions.noPage &&
            <>
            <h2>{successOptions.title ? t(successOptions.title) : t(step.title)}</h2>
            <p>{t(successOptions.text)}</p>
            {SuccessChild && <SuccessChild {...successOptions.childProps}/>}
            <div>
              <Link className="c-button u-padding-vertical-small u-padding-horizontal-large"
                    to={successOptions.link}
                    style={{top: '15px'}}>
                    {t(successOptions.linkText)}
              </Link>
              { successOptions.altLink &&
                  <Link className="u-text-bold u-text-black u-font-small c-form-walkthrough__alt-success-link"
                    to={successOptions.altLink}
                  >
                    {t(successOptions.altLinkText)}
                  </Link>
              }
            </div>
            </>
          }
          { isSuccess && successOptions && successOptions.noPage &&
            <Redirect to={{pathname: successOptions.link}} />
          }
          {isFetching && (
            <div className="u-overlay u-overlay--light u-flex u-flex--centered u-flex--justify-centered">
              <Loader />
            </div>
          )}
        </div>
      </div>
      {fullPage && <Backdrop show opaque className="c-backdrop--has-background"/>}
    </>
  );
};

FormWalkthrough.propTypes = {
  modelName: PropTypes.string,
  successOptions: PropTypes.object,
  steps: PropTypes.array.isRequired,
  isFetching: PropTypes.bool,
  isSuccess: PropTypes.bool,
  onSubmit: PropTypes.func,
  onValidate: PropTypes.func,
  onStepChange: PropTypes.func,
  onCancel: PropTypes.func,
  errors: PropTypes.array,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  icon: PropTypes.string,
  dispatchMethod: PropTypes.func,
  childrenBelowForm: PropTypes.bool,
  fullPage: PropTypes.bool,
  showProgress: PropTypes.bool,
  initialStep: PropTypes.number,
  gaCategory: PropTypes.string
};

FormWalkthrough.defaultProps = {
  modelName: '',
  onSubmit: () => {},
  onStepChange: () => {},
  onValidate: () => {},
  errors: [],
  isFetching: false,
  isSuccess: false,
  successOptions: {
    title: '',
    text: '',
    linkText: '',
    link: '/'
  },
  children: [],
  icon: '',
  dispatchMethod: () => {},
  childrenBelowForm: false,
  fullPage: true,
  showProgress: false,
  initialStep: 0
};

export default FormWalkthrough;
