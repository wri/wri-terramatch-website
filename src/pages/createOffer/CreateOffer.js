import React, { useEffect, useState } from 'react';
import FormWalkthrough from '../../components/formWalkthrough/FormWalkthrough';
import { getSteps } from './steps';
import { getRawResponseErrors,
         getArrayOfTeamMembers,
         canCreate,
         didSend,
         compareModels,
         parseOfferDraft,
         getLastStep,
         getMediaId } from '../../helpers';
import { useTranslation,  } from 'react-i18next';
import { gaEvent } from '../../helpers/analytics';
import { Prompt, Link } from "react-router-dom";
import DraftSelection from '../../components/draftSelection/DraftSelectionContainer';
import { OfferCreate, OfferContactCreate } from 'wrm-api';
import { Backdrop } from 'tsc-chameleon-component-library';

export default (props) => {
  const { dispatchMethod,
    uploadCoverState,
    createDraft,
    createDraftState,
    history,
    updateDraft,
    updateDraftState,
    clearState,
    clearUpdateDraft,
    publishDraft,
    publishDraftState
  } = props;

  const draftId = props.match.params.id || null;
  const { t } = useTranslation();
  const [ steps, setSteps ] = useState(getSteps(t));
  const [ teamMembers, setTeamMembers ] = useState([]);
  const [ draft, setDraft ] = useState(null);
  const [ isSelectingDraft, setIsSelectingDraft ] = useState(true);
  const [ initialStep, setInitialStep ] = useState(null);
  const [ readyToPublish, setReadyToPublish ] = useState(false);
  const [ show404Modal, setShow404Modal ] = useState(false);
  const [ didSetCoverDraft, setCoverDraft] = useState(false);
  const [ value, setValue ] = useState({
    model: {},
    childModels: null
  });

  const createOfferSuccess = {
    title: 'createOffer.successTitle',
    text: 'createOffer.success',
    linkText: 'createOffer.successLinkText',
    link: publishDraftState.data ? `/funding/${publishDraftState.data.offer_id}` : '/profile'
  };

  useEffect(() => {
    clearState();
    return () => {
      clearState();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [ errors, setErrors ] = useState([]);

  /**
   * After async redux changes, merge all errors to one array
   */
  useEffect(() => {
    let newErrors = [];

    newErrors = [...newErrors, ...getRawResponseErrors(publishDraftState)];

    newErrors = [...newErrors, ...getRawResponseErrors(uploadCoverState).map(error => {
      return {
        ...error,
        source: "cover_photo"
      }
    })];

    setErrors(newErrors);

    if (publishDraftState.lastSuccessTime > 0) {
      gaEvent({
        category: 'Funding offer',
        action: 'User completed'
      });
    }

    if ((updateDraftState.error && updateDraftState.error.status === 404) ||
        (publishDraftState.error && publishDraftState.error.status === 404)) {
      setShow404Modal(true);
    }
  }, [publishDraftState, setErrors, uploadCoverState, updateDraftState]);

  useEffect(() => {
    setSteps(s => {
      for (let i = 0; i < s.length; i++) {
        const step = s[i];
        if (step.fields) {
          for (let j = 0; j < step.fields.length; j++) {
            const field = step.fields[j];
            if (field.modelKey === 'cover_photo') {
              field.uploadState = uploadCoverState;
            }
          }
        }
      }
      return [...s];
    });
  }, [uploadCoverState]);

  // temp fix for drafts not updating on cover photo upload.
  useEffect(() => {
    if (didSend(uploadCoverState) && !didSetCoverDraft && draft) {
      // used to prevent an infinite loop
      setCoverDraft(true);
      updateDraft(draft.id, [{
        op: 'replace',
        path: '/offer/cover_photo',
        value: uploadCoverState.data.id
      }]);
    }
  }, [uploadCoverState, updateDraft, draft, didSetCoverDraft])

  // On step change, either create a new draft or patch it.
  const onStepChange = (step, newModel, newChildModels, shouldPublish) => {
    if (step === 2 && canCreate(createDraftState) && !draft) {
      // First step done, get the name and create draft.
      createDraft({name: newModel.name, type: 'offer'});
    } else if ((step >= 2 || shouldPublish) && draft) {
      const newTeamMembers = getArrayOfTeamMembers(newChildModels && newChildModels.offer_contacts && newChildModels.offer_contacts.teamSelect);
      const updatedModel = {
        ...newModel,
        name: !newModel.name ? draft.name : newModel.name,
        cover_photo: getMediaId(value.model.cover_photo, uploadCoverState)
      };

      // Has there been a change? If so what and do an update to patch.
      const changes = compareModels({
        offer: OfferCreate.constructFromObject(value.model),
        offer_contacts: teamMembers.map(contact => OfferContactCreate.constructFromObject(contact))
      }, {
        offer: OfferCreate.constructFromObject(updatedModel),
        offer_contacts: newTeamMembers.map(contact => OfferContactCreate.constructFromObject(contact))
      });

      if (changes.length > 0 && draft && draft.id !== undefined && !updateDraftState.isFetching) {
        // Send patches
        clearUpdateDraft();
        setCoverDraft(false);
        updateDraft(draft.id, changes);
        setValue({
          model: updatedModel,
          childModels: newChildModels
        });
        setTeamMembers(JSON.parse(JSON.stringify(newTeamMembers)));
        setReadyToPublish(shouldPublish);
      } else if (changes.length === 0 && draft && draft.id && shouldPublish && !publishDraftState.isFetching && !uploadCoverState.isFetching) {
        clearUpdateDraft();
        publishDraft(draft.id);
      }
    }
  };

  useEffect(() => {
    if (createDraftState.data && !createDraftState.error) {
      setDraft(createDraftState.data);
      // Set the name of the offer
      updateDraft(createDraftState.data.id, [
        { op: "replace", path: "/offer/name", value: createDraftState.data.name }
      ]);
    }
  }, [createDraftState, updateDraft]);

  useEffect(() => {
    if (updateDraftState.data && !updateDraftState.error) {
      setDraft(updateDraftState.data);
      if (readyToPublish && !publishDraftState.isFetching) {
        publishDraft(updateDraftState.data.id);
      }
    }
  }, [updateDraftState]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDraftSelected = (draft) => {
    if (draft) {
      setDraft(draft);
      const parsed = parseOfferDraft(draft);
      setValue({
        model: parsed.model,
        childModels: {offer_contacts: {teamSelect: parsed.childModels.offer_contacts}}
      });
      setTeamMembers(draft.data.offer_contacts);
      // Set step of last known edit;
      setInitialStep(getLastStep(parsed, steps));
    } else {
      setInitialStep(0);
    }

    setIsSelectingDraft(false);
  };

  const isSuccess = !!(publishDraftState.data);
  const isFetching = publishDraftState.isFetching;

  return isSelectingDraft || initialStep === null ? (
    <DraftSelection
      onDraftSelected={onDraftSelected}
      projectType='offer'
      draftId={draftId}
    />
  ) : (
    <>
    <Prompt
      when={!isSuccess && !show404Modal}
      message={t('common.changesSaved')}
    />
    <section className="u-whole-page u-flex u-flex--centered u-flex--justify-centered">
      {show404Modal ?
      <>
        <div className="c-form-container">
            <div className="c-form-container__content u-text-center u-margin-vertical-small">
              <h1>{t('drafts.alreadySubmitted')}</h1>
              <p>{t('drafts.alreadySubmittedHelp')}</p>
              <Link className="c-button c-button--is-link" to="/profile">{t('common.continue')}</Link>
            </div>
        </div>
        <Backdrop show opaque className="c-backdrop--has-background"/>
      </>
      :
      <FormWalkthrough
        value={value}
        steps={steps}
        successOptions={createOfferSuccess}
        onSubmit={(model, childModels) => onStepChange(null, model, childModels, true)}
        onValidate={() => {}}
        errors={errors}
        dispatchMethod={dispatchMethod}
        isFetching={isFetching}
        isSuccess={isSuccess}
        onCancel={() => { history.goBack(); }}
        showProgress
        onStepChange={onStepChange}
        gaCategory='Funding Offer'
        initialStep={initialStep}
        updateDraftState={updateDraftState}
      />}
    </section>
    </>
  );
};
