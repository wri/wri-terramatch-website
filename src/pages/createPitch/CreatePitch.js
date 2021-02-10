import React, { useEffect, useState } from 'react';
import FormWalkthrough from '../../components/formWalkthrough/FormWalkthrough';
import { Prompt, Link } from "react-router-dom";
import { getSteps } from './steps';
import { getRawResponseErrors,
         getArrayOfMetrics,
         getArrayOfTreeSpecies,
         getArrayOfTeamMembers,
         getArrayOfCarbonCerts,
         getArrayOfDocuments,
         canCreate,
         compareModels,
         parsePitchDraft,
         getDraftUploadErrors,
         getLastStep,
         gaEvent,
         getMediaId } from '../../helpers';
import { useTranslation } from 'react-i18next';
import DraftSelection from '../../components/draftSelection/DraftSelectionContainer';
import { PitchCreate,
         RestorationMethodMetricCreate,
         TreeSpeciesCreate,
         CarbonCertificationCreate,
         PitchContactCreate,
         PitchDocumentCreate } from 'wrm-api'
import { Backdrop } from 'tsc-chameleon-component-library';

export default (props) => {
  const { dispatchMethod,
    uploadPitchCoverState,
    uploadPitchVideoState,
    createDraft,
    createDraftState,
    clearState,
    history,
    updateDraft,
    updateDraftState,
    publishDraft,
    publishDraftState,
    clearUpdateDraft
  } = props;

  const draftId = props.match.params.id || null;
  const { t } = useTranslation();
  const [ steps, setSteps ] = useState(getSteps(t));
  const [ metrics, setMetrics ] = useState([]);
  const [ treeSpecies, setTreeSpecies ] = useState([]);
  const [ teamMembers, setTeamMembers ] = useState([]);
  const [ documents, setDocuments ] = useState([]);
  const [ carbonCerificates, setCarbonCerificates ] = useState([]);
  const [ draft, setDraft ] = useState(null);
  const [ isSelectingDraft, setIsSelectingDraft ] = useState(true);
  const [ initialStep, setInitialStep ] = useState(null);
  const [ value, setValue ] = useState({ model: {}, childModels: null });
  const [ readyToPublish, setReadyToPublish ] = useState(false);
  const [ show404Modal, setShow404Modal ] = useState(false);

  const createPitchSuccess = {
    title: 'createPitch.successTitle',
    text: 'createPitch.success',
    linkText: 'createPitch.successLinkText',
    link: publishDraftState.data ? `/projects/${publishDraftState.data.pitch_id}` : '/profile'
  };

  useEffect(() => {
    return () => {
      clearState();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [ errors, setErrors ] = useState([]);

  /**
   * After async redux changes, merge all errors to one array (and give uploads the correct source)
   */
  useEffect(() => {
    let newErrors = [];

    newErrors = [...newErrors, ...getRawResponseErrors(publishDraftState)];

    newErrors = [...newErrors, ...getRawResponseErrors(uploadPitchCoverState).map(error => {
      return {
        ...error,
        source: "cover_photo"
      }
    })];

    newErrors = [...newErrors, ...getRawResponseErrors(uploadPitchVideoState).map(error => {
      return {
        ...error,
        source: "video"
      }
    })];

    if (publishDraftState.lastSuccessTime > 0) {
      gaEvent({
        category: 'Pitch',
        action: 'User completed'
      });
    }

    setErrors(newErrors);

    if ((updateDraftState.error && updateDraftState.error.status === 404) ||
        (publishDraftState.error && publishDraftState.error.status === 404)) {
      setShow404Modal(true);
    }
  }, [
       uploadPitchCoverState,
       uploadPitchVideoState,
       publishDraftState,
       updateDraftState,
       setErrors
     ]);

  useEffect(() => {
    setSteps(s => {
      for (let i = 0; i < s.length; i++) {
        const step = s[i];
        if (step.fields) {
          for (let j = 0; j < step.fields.length; j++) {
            const field = step.fields[j];
            switch (field.modelKey) {
              case 'cover_photo':
                field.uploadState = uploadPitchCoverState
                break;
              case 'video':
                field.uploadState = uploadPitchVideoState
                break;
              default:
                break;
            }
          }
        }
      }
      return [...s];
    });
  }, [uploadPitchCoverState, uploadPitchVideoState]);

  useEffect(() => {
    if (createDraftState.data && !createDraftState.error) {
      setDraft(createDraftState.data);
      // Set the name of the pitch
      updateDraft(createDraftState.data.id, [
        { op: "replace", path: "/pitch/name", value: createDraftState.data.name }
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

  /*
   * Ensure that any missing parts to a pitch, required for a draft, are added in.
   */
  const updateModel = (modelToUpdate) => {
    modelToUpdate.cover_photo = getMediaId(value.model.cover_photo, uploadPitchCoverState);
    modelToUpdate.video = getMediaId(value.model.video, uploadPitchVideoState);

    modelToUpdate.name = !modelToUpdate.name ? draft.name : modelToUpdate.name;

    if (!modelToUpdate.training_involved) {
      // Should not have these fields if training is not involved
      modelToUpdate.training_amount_people = null;
      modelToUpdate.training_type = null;
    }
  };

  const onStepChange = (step, newModel, newChildModels, shouldPublish) => {
    if (step === 2 && canCreate(createDraftState) && !draft) {
      // First step done, get the name and create draft.
      createDraft({name: newModel.name, type: 'pitch'});
    } else if ((step >= 2 || shouldPublish) && draft) {
      const newMetrics = getArrayOfMetrics(newChildModels.restoration_method_metrics);
      const newTreeSpecies = getArrayOfTreeSpecies(newChildModels.tree_species);
      const newCarbonCerts = getArrayOfCarbonCerts(newChildModels.carbon_certifications);
      const newTeamMembers = getArrayOfTeamMembers(newChildModels.pitch_contacts.teamSelect);
      const newDocuments = getArrayOfDocuments(newChildModels.legalDocuments.docs);
      updateModel(newModel);
      // Has there been a change? If so what and do an update to patch.
      const changes = compareModels({
        pitch: PitchCreate.constructFromObject(value.model),
        restoration_method_metrics: metrics.map(metric => RestorationMethodMetricCreate.constructFromObject(metric)),
        tree_species: treeSpecies.map(tree => TreeSpeciesCreate.constructFromObject(tree)),
        carbon_certifications: carbonCerificates.map(cert => CarbonCertificationCreate.constructFromObject(cert)),
        pitch_contacts: teamMembers.map(contact => PitchContactCreate.constructFromObject(contact)),
        pitch_documents: documents.map(doc => PitchDocumentCreate.constructFromObject(doc))
      }, {
        pitch: PitchCreate.constructFromObject(newModel),
        restoration_method_metrics: newMetrics.map(metric => RestorationMethodMetricCreate.constructFromObject(metric)),
        tree_species: newTreeSpecies.map(tree => TreeSpeciesCreate.constructFromObject(tree)),
        carbon_certifications: newCarbonCerts.map(cert => CarbonCertificationCreate.constructFromObject(cert)),
        pitch_contacts: newTeamMembers.map(contact => PitchContactCreate.constructFromObject(contact)),
        pitch_documents: newDocuments.map(doc => PitchDocumentCreate.constructFromObject(doc))
      });

      if (changes.length > 0 && draft && draft.id !== undefined && !updateDraftState.isFetching) {
        // Send patches
        updateDraft(draft.id, changes);
        setValue({
          model: newModel,
          childModels: newChildModels
        });
        setMetrics(JSON.parse(JSON.stringify(newMetrics)));
        setTreeSpecies(JSON.parse(JSON.stringify(newTreeSpecies)));
        setCarbonCerificates(JSON.parse(JSON.stringify(newCarbonCerts)));
        setDocuments(JSON.parse(JSON.stringify(newDocuments)));
        setTeamMembers(JSON.parse(JSON.stringify(newTeamMembers)));
        setReadyToPublish(shouldPublish);
      } else if (changes.length === 0 && draft && draft.id && shouldPublish && !publishDraftState.isFetching && !uploadPitchVideoState.isFetching) {
          // Check upload errors
          const draftErrors = getDraftUploadErrors(draft);
          if (draftErrors.length > 0) {
            setErrors(draftErrors);
          } else {
            clearUpdateDraft();
            publishDraft(draft.id);
          }
      }
    }
  };

  const onDraftSelected = (draft) => {
    if (draft) {
      setDraft(draft);
      const parsed = parsePitchDraft(draft);
      setTeamMembers(draft.data.pitch_contacts);
      setMetrics(draft.data.restoration_method_metrics);
      setTreeSpecies(draft.data.tree_species);
      setCarbonCerificates(draft.data.carbon_certifications);
      setDocuments(draft.data.pitch_documents);

      setValue({
        model: parsed.model,
        childModels: {
          restoration_method_metrics: parsed.childModels.restoration_method_metrics,
          pitch_contacts: {teamSelect: parsed.childModels.pitch_contacts},
          tree_species: parsed.childModels.tree_species,
          carbon_certifications: parsed.childModels.carbon_certifications,
          legalDocuments: {docs: draft.data.pitch_documents}
        }
      });

      setInitialStep(getLastStep(parsed, steps));
    } else {
      setInitialStep(0);
    }

    setIsSelectingDraft(false);
  };

  const isSuccess = !!publishDraftState.data;
  const isFetching = publishDraftState.isFetching;

  return isSelectingDraft || initialStep === null ? (
    <DraftSelection
      onDraftSelected={onDraftSelected}
      projectType='pitch'
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
        successOptions={createPitchSuccess}
        onSubmit={(model, childModels) => onStepChange(null, model, childModels, true)}
        onValidate={() => {}}
        errors={errors}
        dispatchMethod={dispatchMethod}
        isFetching={isFetching}
        isSuccess={isSuccess}
        onCancel={() => { history.goBack(); }}
        showProgress
        gaCategory='Pitch'
        onStepChange={onStepChange}
        initialStep={initialStep}
        updateDraftState={updateDraftState}
      />}
    </section>
    </>
  );
};
